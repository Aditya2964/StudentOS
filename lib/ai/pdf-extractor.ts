import * as pdfParse from "pdf-parse";

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const parse = (pdfParse as any).default || pdfParse;
    const data = await parse(buffer);
    return data.text.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("PDF Extraction failed:", err);
    throw new Error("Failed to parse PDF document text.");
  }
}
