"use client";

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
import { useExamMarkers } from "@/lib/hooks/use-exams";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ExamMarker, MarkerStatus } from "@/lib/types";

const STATUS_COLOR: Record<MarkerStatus, string> = {
  normal: "#00D4AA",
  alto: "#EF4444",
  baixo: "#3B82F6",
  desconhecido: "#8B92A9",
};

interface TooltipEntry {
  payload: ExamMarker & { displayDate: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipEntry[] }) {
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
      <p className="mt-1 font-medium capitalize" style={{ color: STATUS_COLOR[d.status] }}>
        {d.status === "desconhecido" ? "Sem referência" : d.status}
      </p>
    </div>
  );
}

interface MarkersTimelineProps {
  userId: string;
  markerName: string;
  markerNames: string[];
  onSelectMarker: (name: string) => void;
}

export function MarkersTimeline({
  userId,
  markerName,
  markerNames,
  onSelectMarker,
}: MarkersTimelineProps) {
  const { markers, loading } = useExamMarkers(userId, markerName);

  const chartData = markers.map((m) => ({
    ...m,
    displayDate: format(parseISO(m.examDate), "dd/MM/yy", { locale: ptBR }),
  }));

  const refMin = markers.find((m) => m.referenceMin != null)?.referenceMin ?? null;
  const refMax = markers.find((m) => m.referenceMax != null)?.referenceMax ?? null;
  const unit = markers[0]?.unit ?? "";

  const yPadding = refMax ? refMax * 0.2 : undefined;
  const yMin = refMin != null ? Math.max(0, refMin - (yPadding ?? 0)) : undefined;
  const yMax = refMax != null ? refMax + (yPadding ?? 0) : undefined;

  return (
    <div className="space-y-4">
      {markerNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {markerNames.map((name) => (
            <button
              key={name}
              onClick={() => onSelectMarker(name)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                name === markerName
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          Carregando...
        </div>
      )}

      {!loading && markers.length === 0 && (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          Nenhuma leitura encontrada para &ldquo;{markerName}&rdquo;
        </div>
      )}

      {!loading && markers.length > 0 && (
        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-sm font-semibold text-foreground">{markerName}</h3>
            <span className="text-xs text-muted-foreground">{unit}</span>
            {refMin != null && refMax != null && (
              <span className="text-xs text-muted-foreground">
                · Referência: {refMin}–{refMax}
              </span>
            )}
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3347" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 10, fill: "#8B92A9" }}
                tickLine={false}
                axisLine={{ stroke: "#2E3347" }}
              />
              <YAxis
                domain={[yMin ?? "auto", yMax ?? "auto"]}
                tick={{ fontSize: 10, fill: "#8B92A9" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />

              {refMin != null && refMax != null && (
                <ReferenceArea
                  y1={refMin}
                  y2={refMax}
                  fill="#00D4AA"
                  fillOpacity={0.06}
                  strokeOpacity={0}
                />
              )}
              {refMin != null && (
                <ReferenceLine
                  y={refMin}
                  stroke="#00D4AA"
                  strokeDasharray="3 3"
                  strokeOpacity={0.4}
                />
              )}
              {refMax != null && (
                <ReferenceLine
                  y={refMax}
                  stroke="#00D4AA"
                  strokeDasharray="3 3"
                  strokeOpacity={0.4}
                />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke="#00D4AA"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
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

          <div className="flex items-center gap-4 mt-2">
            {(["normal", "alto", "baixo"] as MarkerStatus[]).map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground capitalize"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLOR[s] }} />
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
