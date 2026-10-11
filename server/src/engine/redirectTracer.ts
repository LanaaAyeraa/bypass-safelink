import axios from 'axios';
import { isValidHttpUrl } from './paramUnpacker.js';

export interface Hop {
  url: string;
  status: number;
  redirectUrl?: string;
  type?: 'http-redirect' | 'meta-refresh' | 'js-redirect';
}

export interface TraceResult {
  originalUrl: string;
  finalUrl: string;
  hops: Hop[];
  totalHops: number;
  bypassed: boolean;
  method: string;
  error?: string;
}

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

/**
 * Parses <meta http-equiv="refresh" ...> from HTML text
 */
function extractMetaRefresh(html: string, currentUrl: string): string | null {
  if (!html) return null;
  const match = html.match(
    /<meta\s+[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*content\s*=\s*["']?[0-9\.]+\s*;\s*url=([^"'>\s]+)["']?/i
  ) || html.match(
    /<meta\s+[^>]*content\s*=\s*["']?[0-9\.]+\s*;\s*url=([^"'>\s]+)["']?[^>]*http-equiv\s*=\s*["']?refresh["']?/i
  );

  if (match && match[1]) {
    try {
      const target = match[1].trim().replace(/^['"]|['"]$/g, '');
      return new URL(target, currentUrl).href;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Parses simple inline window.location redirects from HTML
 */
function extractJsRedirect(html: string, currentUrl: string): string | null {
  if (!html) return null;
  const jsPatterns = [
    /(?:window\.)?location(?:\.href)?\s*=\s*["']([^"']+)["']/i,
    /(?:window\.)?location\.replace\(["']([^"']+)["']\)/i,
    /(?:window\.)?location\.assign\(["']([^"']+)["']\)/i
  ];

  for (const pattern of jsPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      try {
        const target = match[1].trim();
        if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('/')) {
          const resolved = new URL(target, currentUrl).href;
          if (resolved !== currentUrl) return resolved;
        }
      } catch {
        // continue
      }
    }
  }
  return null;
}

/**
 * Traces HTTP redirects, HTML meta-refresh, and JavaScript redirection
 */
export async function traceRedirects(
  inputUrl: string,
  maxHops: number = 15
): Promise<TraceResult> {
  const hops: Hop[] = [];
  const visited = new Set<string>();

  let currentUrl = inputUrl;
  let hopCount = 0;

  while (hopCount < maxHops) {
    if (visited.has(currentUrl)) {
      // Loop detected, abort and return current
      return {
        originalUrl: inputUrl,
        finalUrl: currentUrl,
        hops,
        totalHops: hops.length,
        bypassed: hops.length > 0,
        method: 'recursive-redirect-tracer',
        error: 'Redirect loop detected'
      };
    }

    visited.add(currentUrl);

    try {
      const response = await axios.get(currentUrl, {
        headers: {
          'User-Agent': DEFAULT_USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,id;q=0.8'
        },
        maxRedirects: 0,
        validateStatus: () => true, // capture all status codes
        timeout: 10000
      });

      const status = response.status;
      const headers = response.headers;
      const data = typeof response.data === 'string' ? response.data : '';

      // Check HTTP 3xx redirect
      if ([301, 302, 303, 307, 308].includes(status) && headers.location) {
        const nextUrl = new URL(headers.location, currentUrl).href;
        hops.push({
          url: currentUrl,
          status,
          redirectUrl: nextUrl,
          type: 'http-redirect'
        });
        currentUrl = nextUrl;
        hopCount++;
        continue;
      }

      // If status 200, check meta refresh
      const metaUrl = extractMetaRefresh(data, currentUrl);
      if (metaUrl && isValidHttpUrl(metaUrl) && metaUrl !== currentUrl) {
        hops.push({
          url: currentUrl,
          status,
          redirectUrl: metaUrl,
          type: 'meta-refresh'
        });
        currentUrl = metaUrl;
        hopCount++;
        continue;
      }

      // Check JavaScript redirect
      const jsUrl = extractJsRedirect(data, currentUrl);
      if (jsUrl && isValidHttpUrl(jsUrl) && jsUrl !== currentUrl) {
        hops.push({
          url: currentUrl,
          status,
          redirectUrl: jsUrl,
          type: 'js-redirect'
        });
        currentUrl = jsUrl;
        hopCount++;
        continue;
      }

      // No more redirects found
      break;
    } catch (err: any) {
      return {
        originalUrl: inputUrl,
        finalUrl: currentUrl,
        hops,
        totalHops: hops.length,
        bypassed: hops.length > 0,
        method: 'recursive-redirect-tracer',
        error: err.message || 'Network request failed'
      };
    }
  }

  return {
    originalUrl: inputUrl,
    finalUrl: currentUrl,
    hops,
    totalHops: hops.length,
    bypassed: hops.length > 0 && currentUrl !== inputUrl,
    method: 'recursive-redirect-tracer'
  };
}
