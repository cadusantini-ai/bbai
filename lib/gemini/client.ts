import { VertexAI } from "@google-cloud/vertexai";

let _client: VertexAI | null = null;

function getClient() {
  if (!_client) {
    _client = new VertexAI({
      project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      location: "us-central1",
    });
  }
  return _client;
}

export function getGeminiFlash() {
  return getClient().getGenerativeModel({ model: "gemini-2.5-flash" });
}
