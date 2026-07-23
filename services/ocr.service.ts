import * as mupdf from "mupdf";
import { createWorker } from "tesseract.js";

/**
 * OCR Service
 *
 * Responsibilities:
 * - Convert image-based PDFs into images
 * - Extract text using Tesseract OCR
 * - Process a maximum of 2 pages
 *
 * This service does NOT:
 * - Download files
 * - Save data to the database
 * - Normalize extracted text
 */

const MAX_OCR_PAGES = 2;
const RENDER_SCALE = 3;

export async function extractTextWithOCR(
  pdfBuffer: Buffer
): Promise<string> {
  console.log("========== OCR START ==========");

  const startTime = Date.now();

  const document = mupdf.Document.openDocument(pdfBuffer, "application/pdf");

  const totalPagesInDoc = document.countPages();
  const totalPages = Math.min(totalPagesInDoc, MAX_OCR_PAGES);

  console.log(`PDF contains ${totalPagesInDoc} page(s).`);
  console.log(`Processing ${totalPages} page(s)...`);

  const worker = await createWorker("eng");

  let extractedText = "";

  try {
    const matrix = mupdf.Matrix.scale(RENDER_SCALE, RENDER_SCALE);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      console.log(`OCR Page ${pageIndex + 1}/${totalPages}`);

      const page = document.loadPage(pageIndex);
      const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB);
      const pngBuffer = pixmap.asPNG();

      const {
        data: { text },
      } = await worker.recognize(Buffer.from(pngBuffer));

      extractedText += "\n" + text;

      pixmap.destroy();
      page.destroy();
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`OCR completed in ${elapsed}s`);
    console.log("=========== OCR END ===========");

    return extractedText.trim();
  } catch (error) {
    console.error("OCR failed:", error);
    throw new Error("Unable to extract text using OCR.");
  } finally {
    await worker.terminate();
    document.destroy();
  }
}