import { getGeminiFlash } from "./client";
import type { ExamCategory, MarkerStatus } from "@/lib/types";

export interface ExtractedMarker {
  name: string;
  nameRaw: string;
  value: number;
  unit: string;
  referenceMin: number | null;
  referenceMax: number | null;
  status: MarkerStatus;
}

export interface ExtractedExam {
  labName: string;
  examDate: string;
  category: ExamCategory;
  markers: ExtractedMarker[];
}

const PROMPT = `Você é um especialista em laudos laboratoriais e médicos brasileiros.
Analise o documento e extraia TODOS os marcadores/exames presentes.

Retorne EXATAMENTE este JSON (sem markdown, sem texto extra):
{
  "labName": "Nome do laboratório ou clínica",
  "examDate": "YYYY-MM-DD",
  "category": "hematologia|bioquimica|hormonal|hepatica|renal|urina|imagem|outros",
  "markers": [
    {
      "name": "Nome padronizado em português (ex: Hemoglobina, Glicemia de Jejum, Testosterona Total)",
      "nameRaw": "Nome original no documento (ex: HGB, Glucose, T-TOTAL)",
      "value": 14.5,
      "unit": "g/dL",
      "referenceMin": 12.0,
      "referenceMax": 16.0,
      "status": "normal|alto|baixo|desconhecido"
    }
  ]
}

Regras:
- Normalize nomes para termos médicos padrão pt-BR: "HGB"→"Hemoglobina", "GLU"→"Glicemia de Jejum", "TSH"→"TSH", "T4L"→"T4 Livre", "TESTO"→"Testosterona Total"
- examDate: use a data de coleta ou resultado, formato YYYY-MM-DD
- status: compare valor com referenceMin/Max. Se não houver referência, use "desconhecido"
- Inclua TODOS os marcadores, não apenas os alterados
- Para imagens sem valores numéricos: value=0, status="desconhecido"
- referenceMin e referenceMax: null se não presentes no documento`;

export async function extractExamFromGCS(gcsUri: string, mimeType: string): Promise<ExtractedExam> {
  const model = getGeminiFlash();

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { fileData: { fileUri: gcsUri, mimeType } },
          { text: PROMPT },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini retornou resposta vazia");

  const data = JSON.parse(text) as ExtractedExam;

  if (!data.markers || !Array.isArray(data.markers)) {
    throw new Error("Formato de resposta inválido");
  }

  return data;
}
