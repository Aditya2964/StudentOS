import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { noteEmbeddings } from "@/db/schema";
import { chunkTextContent, generateTextEmbedding } from "@/lib/ai/embeddings";

export const vectorizeNotesJob = inngest.createFunction(
  {
    id: "vectorize-study-material-job",
    name: "Ingest & Vectorize Study Material PDF",
    triggers: [{ event: "studentos/notes.vectorize" }],
  },
  async ({ event, step }) => {
    const { noteId, rawText } = (event.data || {}) as { noteId: string; rawText: string };

    const chunks = await step.run("chunk-pdf-text", async () => {
      return chunkTextContent(rawText);
    });

    await step.run("store-vector-embeddings", async () => {
      for (const chunk of chunks) {
        await generateTextEmbedding(chunk.content);

        await db.insert(noteEmbeddings).values({
          noteId,
          chunkIndex: chunk.chunkIndex,
          chunkContent: chunk.content,
        });
      }
    });

    return { success: true, chunksProcessed: chunks.length };
  }
);
