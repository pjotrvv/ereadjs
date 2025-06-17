import { describe, it, expect, vi } from 'vitest';
import { renderCbr } from '../renderCbr';

globalThis.URL.createObjectURL = vi.fn(() => 'blob:mocked-url');

vi.mock('unrar-js', () => {
  return {
    createExtractorFromData: vi.fn().mockReturnValue({
      getFileList: () => ({
        fileHeaders: [
          { name: 'image1.jpg' },
          { name: 'image2.jpg' },
        ],
      }),
      extract: () => ({
        files: [
          {
            fileHeader: { name: 'image1.jpg' },
            extraction: {
              getContent: () => new Uint8Array([/* fake binary data */]),
            },
          },
          {
            fileHeader: { name: 'image2.jpg' },
            extraction: {
              getContent: () => new Uint8Array([/* fake binary data */]),
            },
          },
        ],
      }),
    }),
  };
});
describe('renderCbr', () => {
  it('renders CBR images into the container', async () => {

    const dummyData = new Uint8Array([0x52, 0x61, 0x72, 0x21]); // 'Rar!' magic header

    const blob = new Blob([dummyData], { type: 'application/vnd.rar' });

    const mockFile = new File([blob], 'test.cbr', { type: 'application/vnd.rar' });

    const container = document.createElement('div');

    await expect(renderCbr(mockFile, container)).resolves.not.toThrow();
    expect(container.querySelectorAll('img').length).toBeGreaterThan(0);
  });
});
