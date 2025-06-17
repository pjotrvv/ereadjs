import JSZip from 'jszip';
import { renderCbz } from '../renderCbz';
import { vi, describe, it, expect } from 'vitest';

globalThis.URL.createObjectURL = vi.fn(() => 'blob:mocked-url');

describe('renderCbz', () => {
  it('renders images into container', async () => {
    const zip = new JSZip();
    zip.file('page1.jpg', new Uint8Array([255, 216, 255])); // minimal JPEG header
    const zipContent = await zip.generateAsync({ type: 'uint8array' });

    const mockFile = new File([zipContent], 'test.cbz', { type: 'application/zip' });
    const container = document.createElement('div');

    await expect(renderCbz(mockFile, container)).resolves.not.toThrow();
    expect(container.querySelectorAll('img').length).toBeGreaterThan(0);
  });
});
