const pdfParseModule = require("pdf-parse");
const mammoth = require("mammoth");

const parsePdfBuffer = async (buffer) => {
  // Support legacy pdf-parse function export.
  if (typeof pdfParseModule === "function") {
    const parsed = await pdfParseModule(buffer);
    return (parsed?.text || "").trim();
  }

  // Support current pdf-parse v2 class-based API.
  if (pdfParseModule && typeof pdfParseModule.PDFParse === "function") {
    const parser = new pdfParseModule.PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return (parsed?.text || "").trim();
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported pdf-parse module API");
};

const parseResumeBuffer = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Missing uploaded file buffer");
  }

  const mimeType = (file.mimetype || "").toLowerCase();
  const fileName = (file.originalname || "").toLowerCase();

  const isPdf = mimeType.includes("pdf") || fileName.endsWith(".pdf");
  const isDocx =
    mimeType.includes("wordprocessingml.document") ||
    fileName.endsWith(".docx");
  const isDoc = mimeType.includes("msword") || fileName.endsWith(".doc");

  if (isPdf) {
    return parsePdfBuffer(file.buffer);
  }

  if (isDocx) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return (parsed.value || "").trim();
  }

  if (isDoc) {
    throw new Error(".doc parsing is not supported yet. Please upload PDF or DOCX.");
  }

  throw new Error("Unsupported resume format. Please upload PDF or DOCX.");
};

module.exports = {
  parseResumeBuffer,
};
