/**
 * Client-side text extraction from PDF, DOCX, and TXT files
 */

// ── Extract text from uploaded file ──
export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (ext === 'txt') {
    return await file.text();
  }
  
  if (ext === 'docx') {
    return await extractFromDocx(file);
  }
  
  if (ext === 'pdf') {
    return await extractFromPdf(file);
  }
  
  throw new Error(`Unsupported file type: .${ext}. Please upload PDF, DOCX, or TXT.`);
}

async function extractFromDocx(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractFromPdf(file) {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }
  
  return text.trim();
}
