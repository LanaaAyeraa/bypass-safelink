import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import app from '../index.js';

describe('Express API Server Endpoints', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as { port: number };
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('GET /api/health should return ok status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.engine).toContain('Bypasser');
  });

  it('POST /api/bypass with valid parameter encoded URL should bypass successfully', async () => {
    const rawTarget = 'https://developer.mozilla.org/en-US/docs/Web';
    const b64 = Buffer.from(rawTarget).toString('base64');
    const safelink = `https://mysafelink.site/landing?url=${b64}`;

    const res = await fetch(`${baseUrl}/api/bypass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: safelink })
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.destinationUrl).toBe(rawTarget);
  });

  it('POST /api/bypass without url should return 400 bad request', async () => {
    const res = await fetch(`${baseUrl}/api/bypass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it('POST /api/bypass/batch should process multiple links', async () => {
    const target1 = 'https://target-one.org';
    const target2 = 'https://target-two.org';
    const url1 = `https://safelink.site/?dest=${encodeURIComponent(target1)}`;
    const url2 = `https://safelink.site/?dest=${encodeURIComponent(target2)}`;

    const res = await fetch(`${baseUrl}/api/bypass/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: [url1, url2] })
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.count).toBe(2);
    expect(data.results[0].destinationUrl).toBe(target1);
    expect(data.results[1].destinationUrl).toBe(target2);
  });
});
