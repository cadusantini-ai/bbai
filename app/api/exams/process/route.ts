export const dynamic = "force-dynamic";

import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { extractExamFromGCS } from "@/lib/gemini/extract-exam";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  let userId: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(session);
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

    const batch = db.batch();
    const markersCol = db.collection("users").doc(userId).collection("exam_markers");

    for (const m of extracted.markers) {
      const markerRef = markersCol.doc();
      batch.set(markerRef, {
        examId,
        examDate: extracted.examDate,
        labName: extracted.labName,
        category: extracted.category,
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

    await examRef.update({
      status: "done",
      examDate: extracted.examDate,
      labName: extracted.labName,
      category: extracted.category,
      markerCount: extracted.markers.length,
      extractedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, markerCount: extracted.markers.length });
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
