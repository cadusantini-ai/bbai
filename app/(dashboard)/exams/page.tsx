"use client";

import { Header } from "@/components/layout/header";
import { UploadZone } from "@/components/exams/upload-zone";
import { ExamCard } from "@/components/exams/exam-card";
import { MarkersTimeline } from "@/components/exams/markers-timeline";
import { useAuth } from "@/lib/hooks/useAuth";
import { useExams, useMarkersGrouped } from "@/lib/hooks/use-exams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, TrendingUp } from "lucide-react";

export default function ExamsPage() {
  const { user } = useAuth();
  const { exams, loading } = useExams(user?.uid ?? null);
  const { totalMarkers } = useMarkersGrouped(user?.uid ?? null);

  if (!user) return null;

  return (
    <>
      <Header title="Exames" />
      <div className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="exams">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <FlaskConical className="h-3.5 w-3.5" />
              Exames
              {exams.length > 0 && (
                <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  {exams.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Linha do Tempo
              {totalMarkers > 0 && (
                <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  {totalMarkers}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="mt-6 space-y-6">
            <UploadZone userId={user.uid} />

            {loading && (
              <div className="text-sm text-muted-foreground">Carregando...</div>
            )}

            {!loading && exams.length === 0 && (
              <div className="text-center py-16">
                <FlaskConical className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum exame carregado ainda</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Arraste seus laudos acima para começar
                </p>
              </div>
            )}

            {exams.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {exams.length} exame{exams.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-2">
                  {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <MarkersTimeline userId={user.uid} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
