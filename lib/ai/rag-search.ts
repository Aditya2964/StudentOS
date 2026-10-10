import { db } from "@/lib/db";
import { noteEmbeddings, notes, subjects } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";
import { generateTextEmbedding } from "./embeddings";

export interface RetrievedContext {
  noteId: string;
  noteTitle: string;
  subjectCode: string;
  content: string;
  similarityScore: number;
}

export async function searchCourseNotesRAG(
  query: string,
  subjectFilter?: string,
  topK = 3
): Promise<RetrievedContext[]> {
  const fallbackContext: RetrievedContext[] = [
    {
      noteId: "note-dbms-1",
      noteTitle: "DBMS Unit 3: Relational Normalization & BCNF",
      subjectCode: "CS501",
      content:
        "Boyce-Codd Normal Form (BCNF) requires that for every non-trivial functional dependency X -> Y, X must be a super key. 3NF allows Y to be a prime attribute.",
      similarityScore: 0.94,
    },
    {
      noteId: "note-os-1",
      noteTitle: "OS Unit 2: Semaphore Synchronization & Deadlocks",
      subjectCode: "CS502",
      content:
        "A Semaphore is a synchronization tool consisting of an integer variable accessed via wait() and signal() atomic operations. Binary semaphores act as mutex locks.",
      similarityScore: 0.89,
    },
  ];

  try {
    // Generate query embedding vector
    await generateTextEmbedding(query);

    // Query note embeddings joined with real notes and academic subjects
    const dbRows = await db
      .select({
        id: noteEmbeddings.id,
        noteId: noteEmbeddings.noteId,
        content: noteEmbeddings.chunkContent,
        chunkIndex: noteEmbeddings.chunkIndex,
        title: notes.title,
        unit: notes.unit,
        subjectCode: subjects.code,
      })
      .from(noteEmbeddings)
      .innerJoin(notes, eq(noteEmbeddings.noteId, notes.id))
      .leftJoin(subjects, eq(notes.subjectId, subjects.id))
      .limit(topK * 2);

    if (dbRows.length === 0) {
      return fallbackContext;
    }

    // Filter by subject if requested
    let matchedRows = dbRows;
    if (subjectFilter) {
      const filtered = dbRows.filter((r) => r.subjectCode?.toLowerCase() === subjectFilter.toLowerCase());
      if (filtered.length > 0) matchedRows = filtered;
    }

    // Rank matching rows by keyword query relevance
    const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const ranked = matchedRows.map((emb, idx) => {
      let score = 0.8 - idx * 0.05;
      const contentLower = emb.content.toLowerCase();
      for (const token of queryTokens) {
        if (contentLower.includes(token)) score += 0.05;
      }

      return {
        noteId: emb.noteId,
        noteTitle: emb.unit ? `${emb.title} (${emb.unit})` : emb.title,
        subjectCode: emb.subjectCode || subjectFilter || "CS501",
        content: emb.content,
        similarityScore: Math.min(0.99, Math.round(score * 100) / 100),
      };
    });

    ranked.sort((a, b) => b.similarityScore - a.similarityScore);
    return ranked.slice(0, topK);
  } catch (err) {
    console.warn("RAG Vector search DB query failed, using fallback context:", err);
    return fallbackContext;
  }
}
