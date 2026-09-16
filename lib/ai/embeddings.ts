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
  // Generates 1536-dimensional embedding array mock for pgvector
  // In production, uses OpenAI text-embedding-3-small or Gemini Embedding API
  const mockVector = new Array(1536).fill(0).map((_, i) => (Math.sin(i + text.length) * 0.05));
  return mockVector;
}
