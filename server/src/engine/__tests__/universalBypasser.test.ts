import { describe, it, expect } from 'vitest';
import { bypassUrl, bypassBatch } from '../universalBypasser.js';

describe('Universal Bypasser Pipeline', () => {
  it('should immediately resolve parameter encoded safelinks', async () => {
    const rawTarget = 'https://archive.org/download/test-item';
    const b64 = Buffer.from(rawTarget).toString('base64');
    const input = `https://mysafelink.com/reading?url=${b64}`;

    const result = await bypassUrl(input);
    expect(result.success).toBe(true);
    expect(result.destinationUrl).toBe(rawTarget);
    expect(result.method).toBe('param-unpacker');
  });

  it('should reject invalid or malformed URLs gracefully', async () => {
    const input = 'not-a-valid-url';
    const result = await bypassUrl(input);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should process batch requests correctly', async () => {
    const target1 = 'https://site-a.com/page1';
    const target2 = 'https://site-b.com/page2';
    const url1 = `https://safelink.me/?url=${encodeURIComponent(target1)}`;
    const url2 = `https://safelink.me/?url=${encodeURIComponent(target2)}`;

    const results = await bypassBatch([url1, url2]);
    expect(results).toHaveLength(2);
    expect(results[0].destinationUrl).toBe(target1);
    expect(results[1].destinationUrl).toBe(target2);
  });
});
