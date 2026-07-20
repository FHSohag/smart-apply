import mammoth from "mammoth";
import pdfParse from "pdf-parse";

/**
 * Resume Parser Service
 *
 * Responsibilities:
 * - Download resume from Cloudinary
 * - Extract text from PDF or DOCX
 * - Normalize extracted text
 *
 * This service does NOT:
 * - Save data to the database
 * - Generate embeddings
 * - Perform AI analysis
 */

export async function extractResumeText(
  fileUrl: string,
  mimeType: string
): Promise<string> {
  const buffer = await downloadFile(fileUrl);

  switch (mimeType) {
    case "application/pdf":
      return extractPdfText(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocxText(buffer);

    default:
      throw new Error("Unsupported resume format.");
  }
}

async function downloadFile(fileUrl: string): Promise<Buffer> {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error("Unable to download resume.");
  }

  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer);
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const { text } = await pdfParse(buffer);

    const normalizedText = normalizeText(text);

    if (!normalizedText) {
      throw new Error("Resume contains no readable text.");
    }

    return normalizedText;
  } catch (error) {
    console.error("PDF parsing failed:", error);

    throw new Error("Unable to parse PDF resume.");
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const { value } = await mammoth.extractRawText({
      buffer,
    });

    const normalizedText = normalizeText(value);

    if (!normalizedText) {
      throw new Error("Resume contains no readable text.");
    }

    return normalizedText;
  } catch (error) {
    console.error("DOCX parsing failed:", error);

    throw new Error("Unable to parse DOCX resume.");
  }
}

function normalizeText(text: string): string {
  return text
    // Convert Windows line endings to Unix
    .replace(/\r\n/g, "\n")

    // Remove trailing spaces
    .replace(/[ \t]+$/gm, "")

    // Collapse 3+ blank lines into 2
    .replace(/\n{3,}/g, "\n\n")

    // Trim beginning and end
    .trim();
}