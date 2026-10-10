export interface TextChunk {
  chunkIndex: number;
  content: string;
}

export function chunkTextContent(text: string, chunkSize = 800, overlap = 100): TextChunk[] {
  const words = text.split(" ");
  const chunks: TextChunk[] = [];
  let index = 0;

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunkWords = words.slice(i, i + chunkSize);
    if (chunkWords.length > 0) {
      chunks.push({
        chunkIndex: index++,
        content: chunkWords.join(" "),
      });
    }
  }

  return chunks;
}

export async function generateTextEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith("sk-")) {
    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: text.slice(0, 8000),
          model: "text-embedding-3-small",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data?.[0]?.embedding) {
          return data.data[0].embedding;
        }
      }
    } catch (apiErr) {
      console.warn("OpenAI embedding API call failed, using deterministic fallback:", apiErr);
    }
  }

  // Deterministic local vector simulation for development / offline environments
  const vector = new Array(1536).fill(0).map((_, i) => Math.sin(i * 17 + text.length) * 0.05);
  return vector;
}
