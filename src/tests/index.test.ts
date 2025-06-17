// src/tests/index.test.ts
import { describe, it, vi, expect } from 'vitest';

// Mock the pdfjs-dist import inside renderPdf before importing index
vi.mock('../renderPdf', () => ({
  renderPdf: vi.fn().mockResolvedValue(undefined),
}));

import * as index from '../index';

describe('index', () => {
  it('should export all modules without error', () => {
    expect(index).toBeDefined();
  });
});
