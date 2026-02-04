import { aiWorkerEnv } from "../config/env";

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export const generateCompletion = async (messages: ChatMessage[]): Promise<string> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), aiWorkerEnv.OPENAI_TIMEOUT_MS);
  const endpoint = new URL("/chat/completions", aiWorkerEnv.OPENAI_BASE_URL).toString();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${aiWorkerEnv.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: aiWorkerEnv.OPENAI_MODEL,
      messages,
      temperature: 0.2
    }),
    signal: controller.signal
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("LLM returned empty response");
  }

  return content.trim();
};
