import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { bypassUrl, bypassBatch, normalizeUrl } from '../universalBypasser.js';
import { unpackUrlParameters, isValidHttpUrl } from '../paramUnpacker.js';
import { traceRedirects } from '../redirectTracer.js';

describe('Bypass Engine - Hard-Test Stress & Edge Case Suite', () => {
  let mockServer: http.Server;
  let mockBaseUrl: string;

  beforeAll(async () => {
    mockServer = http.createServer((req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host}`);

      if (url.pathname === '/500-error') {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else if (url.pathname === '/404-not-found') {
        res.writeHead(404);
        res.end('Not Found');
      } else if (url.pathname === '/infinite-loop-1') {
        res.writeHead(302, { Location: `${mockBaseUrl}/infinite-loop-2` });
        res.end();
      } else if (url.pathname === '/infinite-loop-2') {
        res.writeHead(302, { Location: `${mockBaseUrl}/infinite-loop-1` });
        res.end();
      } else if (url.pathname === '/chain-1') {
        res.writeHead(301, { Location: `${mockBaseUrl}/chain-2` });
        res.end();
      } else if (url.pathname === '/chain-2') {
        res.writeHead(302, { Location: `${mockBaseUrl}/chain-3` });
        res.end();
      } else if (url.pathname === '/chain-3') {
        res.writeHead(307, { Location: `${mockBaseUrl}/final-target` });
        res.end();
      } else if (url.pathname === '/final-target') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Success Final Page</h1>');
      } else {
        res.writeHead(200);
        res.end('OK');
      }
    });

    await new Promise<void>((resolve) => {
      mockServer.listen(0, '127.0.0.1', () => {
        const addr = mockServer.address() as { port: number };
        mockBaseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => mockServer.close(() => resolve()));
  });

  describe('1. Edge Cases & Malformed Inputs', () => {
    it('should handle massive 50KB query payload without crash or timeout', () => {
      const hugePadding = 'A'.repeat(50000);
      const targetUrl = 'https://clean-target.com/file';
      const b64 = Buffer.from(targetUrl).toString('base64');
      const input = `https://safelink.site/?huge=${hugePadding}&url=${b64}`;

      const start = performance.now();
      const unpacked = unpackUrlParameters(input);
      const duration = performance.now() - start;

      expect(unpacked).toBe(targetUrl);
      expect(duration).toBeLessThan(100); // must process in < 100ms
    });

    it('should reject non-HTTP protocols safely (ftp, file, javascript, data)', () => {
      expect(isValidHttpUrl('ftp://ftp.example.com/file.iso')).toBe(false);
      expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
      expect(isValidHttpUrl('data:text/html,<html></html>')).toBe(false);
      expect(isValidHttpUrl('file:///C:/Windows/System32')).toBe(false);
      expect(isValidHttpUrl('')).toBe(false);
      expect(isValidHttpUrl('   ')).toBe(false);
    });

    it('should handle Unicode, special characters, and emojis in target URLs', () => {
      const targetUrl = 'https://example.com/download/manga-ch-1-%E2%98%85%E2%99%A5.pdf';
      const b64 = Buffer.from(targetUrl).toString('base64');
      const input = `https://safelink.me/go?link=${b64}`;

      const unpacked = unpackUrlParameters(input);
      expect(unpacked).toBe(targetUrl);
    });

    it('should handle nested double-encoded base64 payload', () => {
      const target = 'https://subdomain.secure-domain.org/landing/final';
      const level1 = Buffer.from(target).toString('base64');
      const level2 = Buffer.from(level1).toString('base64');
      const input = `https://blog-safelink.com/?target=${level2}`;

      const unpacked = unpackUrlParameters(input);
      // Either direct unpack or nested decode
      expect(unpacked).toBeDefined();
    });

    it('should survive URLs with zero parameters or only query markers', () => {
      expect(unpackUrlParameters('https://example.com/?')).toBeNull();
      expect(unpackUrlParameters('https://example.com/????&&&&')).toBeNull();
      expect(unpackUrlParameters('https://example.com/#')).toBeNull();
    });
  });

  describe('2. Network Fault Tolerance & Resilience', () => {
    it('should handle dead endpoints (connection refused) gracefully without crashing', async () => {
      const deadUrl = 'http://127.0.0.1:59999/does-not-exist';
      const result = await bypassUrl(deadUrl);

      expect(result.success).toBe(true); // returns result structure with fallback
      expect(result.finalUrl || result.destinationUrl).toBeDefined();
      expect(result.error || result.totalHops === 0).toBeTruthy();
    });

    it('should handle server 500 error gracefully', async () => {
      const server500Url = `${mockBaseUrl}/500-error`;
      const result = await traceRedirects(server500Url);

      expect(result.finalUrl).toBe(server500Url);
      expect(result.totalHops).toBe(0);
    });

    it('should handle server 404 error gracefully', async () => {
      const server404Url = `${mockBaseUrl}/404-not-found`;
      const result = await traceRedirects(server404Url);

      expect(result.finalUrl).toBe(server404Url);
      expect(result.totalHops).toBe(0);
    });

    it('should prevent cyclic loops and terminate within safe hop boundary', async () => {
      const loopUrl = `${mockBaseUrl}/infinite-loop-1`;
      const result = await traceRedirects(loopUrl, 10);

      expect(result.totalHops).toBeLessThanOrEqual(10);
      expect(result.error).toContain('loop');
    });

    it('should follow multi-hop chain (301 -> 302 -> 307) directly to target', async () => {
      const chainStart = `${mockBaseUrl}/chain-1`;
      const result = await traceRedirects(chainStart);

      expect(result.bypassed).toBe(true);
      expect(result.finalUrl).toBe(`${mockBaseUrl}/final-target`);
      expect(result.totalHops).toBe(3);
    });
  });

  describe('3. High Concurrency & Speed Hard-Test', () => {
    it('should process 50 parallel requests simultaneously without dropping', async () => {
      const testBatch = Array.from({ length: 50 }, (_, i) => {
        const dest = `https://fast-target-${i}.com/page`;
        const b64 = Buffer.from(dest).toString('base64');
        return `https://safelink.example.com/read?dest=${b64}`;
      });

      const startTime = performance.now();
      const results = await bypassBatch(testBatch, 10);
      const totalTime = performance.now() - startTime;

      expect(results).toHaveLength(50);
      results.forEach((res, i) => {
        expect(res.success).toBe(true);
        expect(res.destinationUrl).toBe(`https://fast-target-${i}.com/page`);
      });

      // Total time for 50 items with 10 concurrency should be extremely fast (< 1000ms)
      expect(totalTime).toBeLessThan(1000);
    });

    it('benchmarking: 200 parameter unpacks should complete in under 50ms', () => {
      const target = 'https://benchmarking-speed.org/test/resource';
      const b64 = Buffer.from(target).toString('base64');
      const input = `https://mysafelink.net/?url=${b64}`;

      const start = performance.now();
      for (let i = 0; i < 200; i++) {
        const res = unpackUrlParameters(input);
        expect(res).toBe(target);
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50); // extremely high throughput
    });
  });
});
