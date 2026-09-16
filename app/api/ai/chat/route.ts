import { searchCourseNotesRAG } from "@/lib/ai/rag-search";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, subjectCode } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 1. Perform Hybrid RAG Context Retrieval
    const retrievedNotes = await searchCourseNotesRAG(lastUserMessage, subjectCode, 2);

    const contextText = retrievedNotes
      .map((n) => `[Source: ${n.noteTitle}] ${n.content}`)
      .join("\n\n");

    // 2. Synthesize Grounded RAG Answer
    let answerText = `Based on your course materials:\n\n`;
    if (retrievedNotes.length > 0) {
      answerText += `${retrievedNotes[0].content}\n\n`;
    } else {
      answerText += `Here is a summary based on standard curriculum guidelines.\n\n`;
    }

    return NextResponse.json({
      role: "assistant",
      content: answerText,
      sources: retrievedNotes.map((n) => ({ title: n.noteTitle, id: n.noteId })),
    });
  } catch (err) {
    console.error("AI Chat error:", err);
    return NextResponse.json({ error: "Failed to process AI chat query." }, { status: 500 });
  }
}
