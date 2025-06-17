import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderPdf } from '../renderPdf';

vi.mock('pdfjs-dist', () => {
  return {
    getDocument: vi.fn(() => ({
      promise: Promise.resolve({
        numPages: 2,
        getPage: vi.fn(() =>
          Promise.resolve({
            getViewport: () => ({ width: 800, height: 600 }),
            render: vi.fn(() => ({ promise: Promise.resolve() })),
          })
        ),
      }),
    })),
  };
});

describe('renderPdf', () => {
  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    // Overloads
    const getContextMock = (contextId: "2d", options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null => {
      return {
        fillRect: vi.fn(),
        drawImage: vi.fn(),
        getImageData: vi.fn(() => ({ data: [] })),
        putImageData: vi.fn(),
        // add more as needed
      } as unknown as CanvasRenderingContext2D;
    };

    const getContextMockBitmap = (contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null => {
      return null; // or mock as needed
    };

    const getContextMockWebGL = (contextId: "webgl" | "webgl2", options?: WebGLContextAttributes): WebGLRenderingContext | WebGL2RenderingContext | null => {
      return null; // or mock as needed
    };

    // Combine all overloads into one function with type assertion
    const getContext = ((contextId: string, options?: any) => {
      if (contextId === "2d") return getContextMock("2d", options);
      if (contextId === "bitmaprenderer") return getContextMockBitmap("bitmaprenderer", options);
      if (contextId === "webgl" || contextId === "webgl2") return getContextMockWebGL(contextId as "webgl" | "webgl2", options);
      return null;
    }) as HTMLCanvasElement['getContext'];

    HTMLCanvasElement.prototype.getContext = getContext;
  });
  it('renders PDF pages into container', async () => {
    const container = document.createElement('div');
    const mockFile = {
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    } as unknown as File;

    await expect(renderPdf(mockFile, container)).resolves.not.toThrow();
    expect(container.querySelectorAll('canvas').length).toBe(2);
  });
});
