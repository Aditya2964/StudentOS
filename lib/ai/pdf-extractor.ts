import * as pdfParse from "pdf-parse";

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  try {
    type PdfParserFn = (buf: Buffer) => Promise<{ text: string }>;
    const parse: PdfParserFn =
      (pdfParse as unknown as { default?: PdfParserFn }).default ||
      (pdfParse as unknown as PdfParserFn);
    const data = await parse(buffer);
    return data.text.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("PDF Extraction failed:", err);
    throw new Error("Failed to parse PDF document text.");
  }
}
