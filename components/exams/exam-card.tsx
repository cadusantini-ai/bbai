"use client";

import { useState } from "react";
import { FlaskConical, Loader2, AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Exam, ExamCategory } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { deleteDocument, userCollection } from "@/lib/firebase/firestore";
import { getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

const CATEGORY_LABEL: Record<ExamCategory, string> = {
  hematologia: "Hematologia",
  bioquimica: "Bioquímica",
  hormonal: "Hormonal",
  hepatica: "Hepática",
  renal: "Renal",
  urina: "Urina",
  imagem: "Imagem",
  outros: "Outros",
};

const CATEGORY_COLOR: Record<ExamCategory, string> = {
  hematologia: "#EF4444",
  bioquimica: "#3B82F6",
  hormonal: "#F59E0B",
  hepatica: "#10B981",
  renal: "#8B5CF6",
  urina: "#06B6D4",
  imagem: "#8B92A9",
  outros: "#6B7280",
};

interface ExamCardProps {
  exam: Exam;
  userId: string;
}

export function ExamCard({ exam, userId }: ExamCardProps) {
  const [deleting, setDeleting] = useState(false);
  const isProcessing = exam.status === "uploading" || exam.status === "processing";

  async function handleDelete() {
    setDeleting(true);
    try {
      // Delete associated markers first
      const markersCol = userCollection(userId, "exam_markers");
      const q = query(markersCol, where("examId", "==", exam.id ?? ""));
      const snap = await getDocs(q);
      if (snap.docs.length > 0) {
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
      // Delete the exam doc
      if (exam.id) await deleteDocument(userId, "exams", exam.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-secondary shrink-0">
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-foreground truncate">
                {exam.labName ?? exam.fileName}
              </p>
              {exam.category && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: `${CATEGORY_COLOR[exam.category]}1A`,
                    color: CATEGORY_COLOR[exam.category],
                  }}
                >
                  {CATEGORY_LABEL[exam.category]}
                </span>
              )}
            </div>

            {exam.labName && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{exam.fileName}</p>
            )}

            <div className="flex items-center gap-3 mt-1.5">
              {exam.examDate && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(parseISO(exam.examDate), "dd MMM yyyy", { locale: ptBR })}
                </span>
              )}
              {exam.status === "done" && exam.markerCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {exam.markerCount} marcador{exam.markerCount !== 1 ? "es" : ""}
                </span>
              )}
            </div>

            {exam.status === "error" && exam.errorMessage && (
              <p className="text-xs text-destructive mt-1 line-clamp-2">{exam.errorMessage}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isProcessing && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
            {exam.status === "done" && <CheckCircle2 className="h-4 w-4 text-chart-1" />}
            {exam.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
              title="Remover exame"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-3">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {exam.status === "uploading" ? "Enviando arquivo..." : "Extraindo dados com IA..."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
