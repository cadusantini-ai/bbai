"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useExamMarkers, useMarkersGrouped } from "@/lib/hooks/use-exams";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, TrendingUp } from "lucide-react";
import type { ExamCategory, ExamMarker, MarkerStatus } from "@/lib/types";
import type { MarkerSummary } from "@/lib/hooks/use-exams";

const STATUS_COLOR: Record<MarkerStatus, string> = {
  normal: "#00D4AA",
  alto: "#EF4444",
  baixo: "#3B82F6",
  desconhecido: "#8B92A9",
};

const STATUS_LABEL: Record<MarkerStatus, string> = {
  normal: "Normal",
  alto: "Acima",
  baixo: "Abaixo",
  desconhecido: "Sem ref.",
};

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

interface TooltipPayloadItem {
  payload: ExamMarker & { displayDate: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">
        {d.value} {d.unit}
      </p>
      <p className="text-muted-foreground">{d.displayDate}</p>
      <p className="text-muted-foreground">{d.labName}</p>
      {d.referenceMin != null && d.referenceMax != null && (
        <p className="text-muted-foreground">
          Ref: {d.referenceMin}–{d.referenceMax} {d.unit}
        </p>
      )}
      <p className="mt-1 font-medium" style={{ color: STATUS_COLOR[d.status] }}>
        {STATUS_LABEL[d.status]}
      </p>
    </div>
  );
}

function MarkerChart({ userId, markerName, onBack }: { userId: string; markerName: string; onBack: () => void }) {
  const { markers, loading } = useExamMarkers(userId, markerName);

  const chartData = markers.map((m) => ({
    ...m,
    displayDate: format(parseISO(m.examDate), "dd/MM/yy", { locale: ptBR }),
  }));

  const refMin = markers.find((m) => m.referenceMin != null)?.referenceMin ?? null;
  const refMax = markers.find((m) => m.referenceMax != null)?.referenceMax ?? null;
  const unit = markers[0]?.unit ?? "";
  const latest = markers[markers.length - 1];

  const allValues = markers.map((m) => m.value);
  const dataMin = allValues.length ? Math.min(...allValues) : 0;
  const dataMax = allValues.length ? Math.max(...allValues) : 100;
  const pad = (refMax ?? dataMax) * 0.25;
  const yMin = refMin != null ? Math.max(0, Math.min(dataMin, refMin) - pad) : "auto";
  const yMax = refMax != null ? Math.max(dataMax, refMax) + pad : "auto";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{markerName}</h3>
          <span className="text-xs text-muted-foreground">
            {markers.length} leitura{markers.length !== 1 ? "s" : ""}
            {unit && ` · ${unit}`}
            {refMin != null && refMax != null && ` · Ref: ${refMin}–${refMax}`}
          </span>
        </div>
        {latest && (
          <div className="text-right shrink-0">
            <p className="text-lg font-bold" style={{ color: STATUS_COLOR[latest.status] }}>
              {latest.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{STATUS_LABEL[latest.status]}</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
          Carregando...
        </div>
      )}

      {!loading && markers.length === 0 && (
        <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
          Nenhuma leitura encontrada
        </div>
      )}

      {!loading && markers.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3347" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 10, fill: "#8B92A9" }}
                tickLine={false}
                axisLine={{ stroke: "#2E3347" }}
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 10, fill: "#8B92A9" }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip content={<CustomTooltip />} />

              {refMin != null && refMax != null && (
                <ReferenceArea y1={refMin} y2={refMax} fill="#00D4AA" fillOpacity={0.07} strokeOpacity={0} />
              )}
              {refMin != null && (
                <ReferenceLine y={refMin} stroke="#00D4AA" strokeDasharray="3 3" strokeOpacity={0.4} />
              )}
              {refMax != null && (
                <ReferenceLine y={refMax} stroke="#00D4AA" strokeDasharray="3 3" strokeOpacity={0.4} />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke="#00D4AA"
                strokeWidth={2}
                dot={(props: { cx?: number; cy?: number; payload: ExamMarker & { displayDate: string } }) => {
                  const { cx = 0, cy = 0, payload } = props;
                  return (
                    <circle
                      key={`dot-${payload.id}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={STATUS_COLOR[payload.status as MarkerStatus]}
                      stroke="#0F1117"
                      strokeWidth={1.5}
                    />
                  );
                }}
                activeDot={{ r: 5, fill: "#00D4AA" }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4">
            {(["normal", "alto", "baixo"] as MarkerStatus[]).map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLOR[s] }} />
                {STATUS_LABEL[s]}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MarkerRow({ marker, onClick }: { marker: MarkerSummary; onClick: () => void }) {
  const color = STATUS_COLOR[marker.status];
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors text-left group"
    >
      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="flex-1 min-w-0">
        <span className="text-xs text-foreground group-hover:text-primary transition-colors truncate block">
          {marker.name}
        </span>
        {marker.readingCount > 1 && (
          <span className="text-[10px] text-muted-foreground/60">
            {marker.readingCount} leituras
          </span>
        )}
      </span>
      <span className="text-xs font-semibold shrink-0" style={{ color }}>
        {marker.latestValue} {marker.unit}
      </span>
    </button>
  );
}

interface MarkersTimelineProps {
  userId: string;
}

export function MarkersTimeline({ userId }: MarkersTimelineProps) {
  const { groups, loading, totalMarkers } = useMarkersGrouped(userId);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
        Carregando marcadores...
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-16">
        <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Nenhum marcador disponível</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Carregue exames para visualizar a linha do tempo
        </p>
      </div>
    );
  }

  if (selectedMarker) {
    return <MarkerChart userId={userId} markerName={selectedMarker} onBack={() => setSelectedMarker(null)} />;
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground mb-4">
        {totalMarkers} marcador{totalMarkers !== 1 ? "es" : ""} · selecione para ver a evolução
      </p>
      {groups.map((group) => (
        <div key={group.category} className="mb-4">
          <div className="flex items-center gap-2 mb-1 px-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: CATEGORY_COLOR[group.category] }}
            >
              {CATEGORY_LABEL[group.category]}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              ({group.markers.length})
            </span>
          </div>
          <div className="space-y-0.5">
            {group.markers.map((m) => (
              <MarkerRow key={m.name} marker={m} onClick={() => setSelectedMarker(m.name)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

