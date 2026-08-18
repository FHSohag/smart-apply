
import * as mupdf from "mupdf";
import { createWorker, PSM } from "tesseract.js";
import path from "path";
import { fileURLToPath } from "url";

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

/**
 * Resolve the Tesseract Node worker using an actual filesystem path.
 *
 * This is necessary because Next.js/Turbopack can transform
 * require.resolve() into an internal module reference rather
 * than returning a real worker file path.
 */
function getTesseractWorkerPath(): string {
  const currentFilePath = fileURLToPath(import.meta.url);

  return path.join(
    path.dirname(currentFilePath),
    "..",
    "node_modules",
    "tesseract.js",
    "src",
    "worker-script",
    "node",
    "index.js"
  );
}

export async function extractTextWithOCR(
  pdfBuffer: Buffer
): Promise<string> {
  console.log("========== OCR START ==========");

  const startTime = Date.now();

  const document = mupdf.Document.openDocument(
    pdfBuffer,
    "application/pdf"
  );

  const totalPagesInDoc = document.countPages();
  const totalPages = Math.min(totalPagesInDoc, MAX_OCR_PAGES);

  console.log(`PDF contains ${totalPagesInDoc} page(s).`);
  console.log(`Processing ${totalPages} page(s)...`);

  const workerPath = getTesseractWorkerPath();

  console.log(`Tesseract worker path: ${workerPath}`);

  const worker = await createWorker("eng", 1, {
    workerPath,
  });

  // SPARSE_TEXT: finds text without assuming column/block structure.
  // Chosen over the default (fully automatic) after testing showed it
  // recovers text the default silently drops (e.g. large stylized
  // headers), and holds up on multi-column/sidebar resume layouts
  // without splicing text across columns. Reading order can
  // be imperfect on complex layouts, but that's acceptable since this
  // feeds an LLM structuring step downstream, not a layout-sensitive
  // renderer.
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SPARSE_TEXT,
  });

  let extractedText = "";

  try {
    const matrix = mupdf.Matrix.scale(
      RENDER_SCALE,
      RENDER_SCALE
    );

    for (
      let pageIndex = 0;
      pageIndex < totalPages;
      pageIndex++
    ) {
      console.log(
        `OCR Page ${pageIndex + 1}/${totalPages}`
      );

      const page = document.loadPage(pageIndex);

      const pixmap = page.toPixmap(
        matrix,
        mupdf.ColorSpace.DeviceRGB
      );

      const pngBuffer = pixmap.asPNG();

      const {
        data: { text },
      } = await worker.recognize(
        Buffer.from(pngBuffer)
      );

      extractedText += "\n" + text;

      pixmap.destroy();
      page.destroy();
    }

    const elapsed = (
      (Date.now() - startTime) /
      1000
    ).toFixed(2);

    console.log(`OCR completed in ${elapsed}s`);
    console.log("=========== OCR END ===========");

    return extractedText.trim();
  } catch (error) {
    console.error("OCR failed:", error);

    throw new Error(
      "Unable to extract text using OCR."
    );
  } finally {
    await worker.terminate();
    document.destroy();
  }
}

export async function extractTextFromImage(
  imageBuffer: Buffer
): Promise<string> {
  console.log(
    "========== OCR START (image) =========="
  );

  const startTime = Date.now();

  const workerPath = getTesseractWorkerPath();

  console.log(`Tesseract worker path: ${workerPath}`);

  const worker = await createWorker("eng", 1, {
    workerPath,
  });

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SPARSE_TEXT,
  });

  try {
    console.log("OCR Page 1/1");

    const {
      data: { text },
    } = await worker.recognize(
      imageBuffer
    );

    const elapsed = (
      (Date.now() - startTime) /
      1000
    ).toFixed(2);

    console.log(`OCR completed in ${elapsed}s`);
    console.log("=========== OCR END ===========");

    return text.trim();
  } catch (error) {
    console.error("OCR failed:", error);

    throw new Error(
      "Unable to extract text using OCR."
    );
  } finally {
    await worker.terminate();
  }
}
