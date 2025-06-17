import { getDocument } from 'pdfjs-dist';

export async function renderPdf(file: File | Blob, container: HTMLElement) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    container.appendChild(canvas);
  }
}
