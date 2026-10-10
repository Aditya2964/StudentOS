import { searchCourseNotesRAG } from "@/lib/ai/rag-search";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, subjectCode } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 1. Perform Hybrid RAG Context Retrieval
    const retrievedNotes = await searchCourseNotesRAG(lastUserMessage, subjectCode, 2);

    const contextText = retrievedNotes
      .map((n) => `[Source: ${n.noteTitle} | Course: ${n.subjectCode}]\n${n.content}`)
      .join("\n\n");

    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;

    // 2. If API Key is present, call OpenAI chat completion with grounded prompt
    if (apiKey && apiKey.startsWith("sk-")) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are StudentOS AI Study Assistant. Answer the student's question accurately using only the verified course material below when available. Cite key concepts clearly.\n\nContext Materials:\n${contextText}`,
              },
              ...messages.slice(-5),
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const completionData = await response.json();
          const aiText = completionData.choices?.[0]?.message?.content;
          if (aiText) {
            return NextResponse.json({
              role: "assistant",
              content: aiText,
              sources: retrievedNotes.map((n) => ({ title: n.noteTitle, id: n.noteId })),
            });
          }
        }
      } catch (llmErr) {
        console.warn("LLM generation failed, falling back to structured RAG synthesizer:", llmErr);
      }
    }

    // 3. Structured RAG Synthesis fallback
    let answerText = `Based on your course materials for ${subjectCode || "your curriculum"}:\n\n`;
    if (retrievedNotes.length > 0) {
      answerText += `${retrievedNotes[0].content}\n\n`;
      if (retrievedNotes.length > 1) {
        answerText += `Additionally, related course notes note that:\n${retrievedNotes[1].content}\n\n`;
      }
      answerText += `💡 *Tip: Check the notes tab for full unit slides and formula summaries.*`;
    } else {
      answerText += `Here is a summary based on standard curriculum guidelines.\n\n`;
      answerText += `No specific course note matched your query closely. Please ensure course notes are uploaded under this subject.`;
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
