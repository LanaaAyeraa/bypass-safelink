import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { traceRedirects } from '../redirectTracer.js';

describe('HTTP Redirect & Meta-Refresh Tracer', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host}`);

      if (url.pathname === '/301-start') {
        res.writeHead(301, { Location: `${baseUrl}/302-mid` });
        res.end();
      } else if (url.pathname === '/302-mid') {
        res.writeHead(302, { Location: `${baseUrl}/meta-hop` });
        res.end();
      } else if (url.pathname === '/meta-hop') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head>
              <meta http-equiv="refresh" content="0;url=${baseUrl}/destination" />
            </head>
            <body>Redirecting...</body>
          </html>
        `);
      } else if (url.pathname === '/js-hop') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head>
              <script>
                window.location.href = "${baseUrl}/destination";
              </script>
            </head>
            <body>Please wait...</body>
          </html>
        `);
      } else if (url.pathname === '/destination') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Final Destination</h1>');
      } else if (url.pathname === '/loop-a') {
        res.writeHead(302, { Location: `${baseUrl}/loop-b` });
        res.end();
      } else if (url.pathname === '/loop-b') {
        res.writeHead(302, { Location: `${baseUrl}/loop-a` });
        res.end();
      } else {
        res.writeHead(404);
        res.end();
      }
    });

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

  it('should follow 301, 302, and HTML meta-refresh to final destination', async () => {
    const startUrl = `${baseUrl}/301-start`;
    const result = await traceRedirects(startUrl);

    expect(result.bypassed).toBe(true);
    expect(result.finalUrl).toBe(`${baseUrl}/destination`);
    expect(result.totalHops).toBe(3);
    expect(result.hops[0].status).toBe(301);
    expect(result.hops[1].status).toBe(302);
  });

  it('should detect inline window.location redirect', async () => {
    const startUrl = `${baseUrl}/js-hop`;
    const result = await traceRedirects(startUrl);

    expect(result.bypassed).toBe(true);
    expect(result.finalUrl).toBe(`${baseUrl}/destination`);
    expect(result.totalHops).toBe(1);
  });

  it('should prevent infinite loops and break gracefully', async () => {
    const loopUrl = `${baseUrl}/loop-a`;
    const result = await traceRedirects(loopUrl);

    expect(result.hops.length).toBeGreaterThan(0);
    // Should terminate and not crash or loop infinitely
    expect(result.finalUrl).toBeDefined();
  });
});
