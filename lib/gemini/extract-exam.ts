import { getGeminiFlash } from "./client";
import type { ExamCategory, MarkerStatus } from "@/lib/types";

export interface ExtractedMarker {
  name: string;
  nameRaw: string;
  date: string;
  value: number;
  unit: string;
  referenceMin: number | null;
  referenceMax: number | null;
  status: MarkerStatus;
  category: ExamCategory;
}

export interface ExtractedExam {
  labName: string;
  examDate: string;
  category: ExamCategory;
  markers: ExtractedMarker[];
}

const PROMPT = `Você é um especialista em laudos laboratoriais brasileiros. Analise TODAS as páginas do documento.

Retorne EXATAMENTE este JSON (sem markdown, sem texto extra):
{
  "labName": "Nome do laboratório",
  "examDate": "YYYY-MM-DD",
  "category": "categoria_predominante",
  "markers": [
    {
      "name": "Nome padronizado em português",
      "nameRaw": "Nome original no documento",
      "date": "YYYY-MM-DD",
      "value": 0.0,
      "unit": "unidade",
      "referenceMin": 0.0,
      "referenceMax": 0.0,
      "status": "normal|alto|baixo|desconhecido",
      "category": "categoria_deste_marcador"
    }
  ]
}

═══════════════════════════════════════
REGRA 1 — GRÁFICO DE HISTÓRICO (CRÍTICO)
═══════════════════════════════════════
Para CADA marcador que tiver seção "Gráfico de Histórico":
→ Crie UMA ENTRADA SEPARADA no array markers por CADA PONTO DO GRÁFICO
→ Use a data exata do eixo X e o valor do eixo Y de cada ponto
→ Não omita nenhum ponto histórico
Exemplo: se Hemoglobina tem pontos em 21/03/2025=14,2 e 08/03/2026=14,0 → crie 2 entradas com dates "2025-03-21" e "2026-03-08"

═══════════════════════════════════════
REGRA 2 — REFERÊNCIAS POR TABELA
═══════════════════════════════════════
Quando o intervalo de referência for uma tabela por sexo/idade:
→ Use o intervalo para MASCULINO ADULTO (faixa "22 a 49 anos" ou "acima de 19 anos" ou "acima de 21 anos")
→ Exemplos:
  - Testosterona Total masculino 22-49 anos: 164,94–753,38 ng/dL → referenceMin=164.94, referenceMax=753.38
  - DHT masculino >19 anos: 112–955 pg/mL → referenceMin=112, referenceMax=955
  - Estradiol masculino >21 anos: até 39,8 pg/mL → referenceMin=0, referenceMax=39.8
  - Cobre masculino 12-60 anos: 70–140 µg/dL → referenceMin=70, referenceMax=140

═══════════════════════════════════════
REGRA 3 — REFERÊNCIAS ESPECIAIS
═══════════════════════════════════════
- "Não se aplica" → referenceMin=null, referenceMax=null, status="desconhecido"
- "Vide Intervalo de Referência Abaixo" → consulte a tabela na mesma página e aplique Regra 2
- "Inferior a X" → referenceMin=0, referenceMax=X
- "Superior a X" → referenceMin=X, referenceMax=9999
- Vitamina D saudável <60 anos: "Superior a 20 ng/mL" → referenceMin=20, referenceMax=100

═══════════════════════════════════════
REGRA 4 — CATEGORIAS POR MARCADOR
═══════════════════════════════════════
Categorize cada marcador individualmente:
- hematologia: Hemoglobina, Hematócrito, Eritrócitos, VCM, HCM, CHCM, RDW, Leucócitos, Neutrófilos, Eosinófilos, Basófilos, Linfócitos, Monócitos, Plaquetas, VPM, Ferritina
- bioquimica: Glicose, HbA1c, GME, Insulina, HOMA-IR, Triglicérides, Colesterol Total, HDL, LDL, VLDL, Não HDL, Ácido Úrico, CPK, Vitamina D, Vitamina B-12, Vitamina C, Cobre, Zinco, Magnésio, Fósforo, Cálcio, Cálcio Ionizado, TP, Atividade de Protrombina, RNI, TTPA
- hormonal: Testosterona, Estradiol, TSH, T4 Livre, T3, FSH, LH, Prolactina, ACTH, Cortisol, Insulina, DHT, PSA
- hepatica: TGO, TGP, GGT, Fosfatase Alcalina, Bilirrubina, Albumina
- renal: Creatinina, Ureia, eGFR, Microalbuminúria
- urina: EAS, Microalbuminúria
- imagem: laudos sem valores numéricos
- outros: tudo mais

═══════════════════════════════════════
REGRA 5 — STATUS
═══════════════════════════════════════
- alto: value > referenceMax
- baixo: value < referenceMin
- normal: referenceMin ≤ value ≤ referenceMax
- desconhecido: sem referência ou status não determinável

═══════════════════════════════════════
REGRA 6 — NORMALIZAÇÃO DE NOMES
═══════════════════════════════════════
Use nomes padronizados em pt-BR:
TGO→"TGO (Transaminase Oxalacética)", TGP→"TGP (Transaminase Pirúvica)", HGB→"Hemoglobina",
GLU→"Glicemia de Jejum", TSH→"TSH", T4L→"T4 Livre", TESTO→"Testosterona Total",
DHT→"Dihidrotestosterona (DHT)", HbA1c→"Hemoglobina Glicada (HbA1c)",
eGFR→"Taxa de Filtração Glomerular (eGFR)", CPK→"Creatinofosfoquinase (CPK)",
"25-Hidroxivitamina D"→"Vitamina D (25-OH)", "Vitamina B-12"→"Vitamina B12"

Para série branca, crie entradas para AMBOS percentual E valor absoluto quando disponíveis:
- "Neutrófilos %" com valor percentual e "Neutrófilos" com valor em /µL

Categorias válidas: hematologia | bioquimica | hormonal | hepatica | renal | urina | imagem | outros
Status válidos: normal | alto | baixo | desconhecido`;

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
      maxOutputTokens: 65536,
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
