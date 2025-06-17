import Unrar from 'unrar-js';

export async function renderCbr(file: File | Blob, container: HTMLElement) {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const extractor = await Unrar.createExtractorFromData({ data: buffer });
  const { files } = extractor.extract({ password: '' });
  for (const entry of files) {
    if (/\.(jpe?g|png)$/i.test(entry.fileHeader.name)) {
      const blob = new Blob([entry.extraction], { type: 'image/jpeg' });
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      img.className = 'w-full mb-4';
      container.appendChild(img);
    }
  }
}
