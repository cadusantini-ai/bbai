export const dynamic = "force-dynamic";

import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { extractExamFromGCS } from "@/lib/gemini/extract-exam";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

const BATCH_SIZE = 499;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  let userId: string;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    userId = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
  }

  const { examId, filePath, mimeType } = await request.json();
  if (!examId || !filePath || !mimeType) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const db = getAdminDb();
  const examRef = db.collection("users").doc(userId).collection("exams").doc(examId);

  await examRef.update({ status: "processing", updatedAt: FieldValue.serverTimestamp() });

  try {
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!;
    const gcsUri = `gs://${bucket}/${filePath}`;

    const extracted = await extractExamFromGCS(gcsUri, mimeType);

    const markersCol = db.collection("users").doc(userId).collection("exam_markers");

    // Commit in chunks to stay under Firestore's 500-operation batch limit
    for (let i = 0; i < extracted.markers.length; i += BATCH_SIZE) {
      const chunk = extracted.markers.slice(i, i + BATCH_SIZE);
      const batch = db.batch();

      for (const m of chunk) {
        const markerRef = markersCol.doc();
        batch.set(markerRef, {
          examId,
          examDate: m.date || extracted.examDate,
          labName: extracted.labName,
          category: m.category || extracted.category,
          marker: m.name,
          markerRaw: m.nameRaw,
          value: m.value,
          unit: m.unit,
          referenceMin: m.referenceMin ?? null,
          referenceMax: m.referenceMax ?? null,
          status: m.status,
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      await batch.commit();
    }

    // Unique marker names (distinct biomarkers, not total readings)
    const uniqueMarkers = new Set(extracted.markers.map((m) => m.name)).size;

    await examRef.update({
      status: "done",
      examDate: extracted.examDate,
      labName: extracted.labName,
      category: extracted.category,
      markerCount: uniqueMarkers,
      extractedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, markerCount: uniqueMarkers, totalReadings: extracted.markers.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    await examRef.update({
      status: "error",
      errorMessage: message,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
