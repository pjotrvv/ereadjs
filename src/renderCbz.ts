import JSZip from 'jszip';

export async function renderCbz(file: File | Blob, container: HTMLElement) {
  const zip = await JSZip.loadAsync(file);
  const entries = Object.values(zip.files).filter(f => /\.(jpe?g|png)$/i.test(f.name));
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const blob = await entry.async('blob');
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    img.className = 'w-full mb-4';
    container.appendChild(img);
  }
}
