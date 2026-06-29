"use client";

import { useCallback, useRef, useState } from "react";
import { CloudUpload, FileText, ImageIcon, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadExamFile, examStoragePath, getFileUrl } from "@/lib/firebase/storage";
import { addDocument, updateDocument } from "@/lib/firebase/firestore";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
  error?: string;
  examId?: string;
}

interface UploadZoneProps {
  userId: string;
}

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB = 100;

export function UploadZone({ userId }: UploadZoneProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateFile = useCallback((id: string, patch: Partial<UploadingFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const processFile = useCallback(
    async (uploadingFile: UploadingFile) => {
      const { file } = uploadingFile;
      const uid = uploadingFile.id;

      let examRef;
      try {
        examRef = await addDocument(userId, "exams", {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          status: "uploading",
          examDate: null,
          labName: null,
          category: null,
          markerCount: 0,
          errorMessage: null,
          extractedAt: null,
          fileUrl: "",
          filePath: "",
        });
      } catch (err) {
        updateFile(uid, {
          status: "error",
          error: err instanceof Error ? err.message : "Erro ao criar registro no banco",
        });
        return;
      }

      const examId = examRef.id;
      updateFile(uid, { examId });

      const task = uploadExamFile(userId, examId, file);

      task.on(
        "state_changed",
        (snap) => {
          const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          updateFile(uid, { progress });
        },
        (err) => {
          updateFile(uid, { status: "error", error: err.message });
        },
        async () => {
          const filePath = examStoragePath(userId, examId, file.name);
          const fileUrl = await getFileUrl(filePath);

          await updateDocument(userId, "exams", examId, { filePath, fileUrl });

          updateFile(uid, { status: "processing", progress: 100 });

          try {
            const res = await fetch("/api/exams/process", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ examId, filePath, mimeType: file.type }),
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error ?? "Erro no processamento");
            }

            updateFile(uid, { status: "done" });
          } catch (err) {
            updateFile(uid, {
              status: "error",
              error: err instanceof Error ? err.message : "Erro desconhecido",
            });
          }
        }
      );
    },
    [userId, updateFile]
  );

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const newFiles: UploadingFile[] = [];

      for (const file of Array.from(fileList)) {
        if (!ACCEPTED.includes(file.type)) continue;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) continue;

        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const entry: UploadingFile = { id, file, progress: 0, status: "uploading" };
        newFiles.push(entry);
      }

      setFiles((prev) => [...newFiles, ...prev]);
      newFiles.forEach(processFile);
    },
    [processFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-secondary/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <CloudUpload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Arraste exames aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, JPG ou PNG · Até {MAX_SIZE_MB}MB por arquivo
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 bg-card border border-border rounded-lg px-3 py-2.5"
            >
              {f.file.type === "application/pdf" ? (
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{f.file.name}</p>
                {f.status === "uploading" && (
                  <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
                {f.status === "processing" && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Extraindo dados com IA...
                  </p>
                )}
                {f.status === "error" && (
                  <p className="text-[10px] text-destructive mt-0.5 truncate">{f.error}</p>
                )}
              </div>

              <div className="shrink-0">
                {f.status === "uploading" && (
                  <span className="text-[10px] text-muted-foreground">{f.progress}%</span>
                )}
                {f.status === "processing" && (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                )}
                {f.status === "done" && <CheckCircle2 className="h-4 w-4 text-chart-1" />}
                {f.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
              </div>

              {(f.status === "done" || f.status === "error") && (
                <button
                  onClick={() => remove(f.id)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
