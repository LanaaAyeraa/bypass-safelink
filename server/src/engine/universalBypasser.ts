import { isValidHttpUrl, unpackUrlParameters } from './paramUnpacker.js';
import { traceRedirects, type Hop } from './redirectTracer.js';
import { isKnownSafelinkDomain, resolveSafelinkOnline } from './safelinkResolver.js';

export interface BypassResult {
  success: boolean;
  originalUrl: string;
  destinationUrl: string;
  domain: string;
  method: 'param-unpacker' | 'safelink-extractor' | 'http-redirect' | 'hybrid-pipeline' | 'direct';
  hops: Hop[];
  totalHops: number;
  durationMs: number;
  error?: string;
}

/**
 * Normalizes input URL string
 */
export function normalizeUrl(raw: string): string {
  let cleaned = raw.trim();
  if (!cleaned) return '';
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }
  if (cleaned.includes('.') || cleaned.startsWith('localhost')) {
    return `https://${cleaned}`;
  }
  return cleaned;
}

/**
 * Executes multi-stage bypass pipeline on a single URL
 */
export async function bypassUrl(rawUrl: string): Promise<BypassResult> {
  const startTime = Date.now();
  const normalized = normalizeUrl(rawUrl);

  if (!isValidHttpUrl(normalized)) {
    return {
      success: false,
      originalUrl: rawUrl,
      destinationUrl: rawUrl,
      domain: '',
      method: 'direct',
      hops: [],
      totalHops: 0,
      durationMs: Date.now() - startTime,
      error: 'Format URL tidak valid. Pastikan menyertakan domain yang benar.'
    };
  }

  let domain = '';
  try {
    domain = new URL(normalized).hostname;
  } catch {
    domain = '';
  }

  const hops: Hop[] = [];

  // Stage 1: Check if destination URL is immediately present in query parameters (Base64, Hex, URL-encoded)
  const paramExtracted = unpackUrlParameters(normalized);
  if (paramExtracted && paramExtracted !== normalized) {
    hops.push({
      url: normalized,
      status: 200,
      redirectUrl: paramExtracted,
      type: 'http-redirect'
    });

    return {
      success: true,
      originalUrl: normalized,
      destinationUrl: paramExtracted,
      domain,
      method: 'param-unpacker',
      hops,
      totalHops: hops.length,
      durationMs: Date.now() - startTime
    };
  }

  // Stage 2: Specialized extractor for known safelink domains (Safelinku, AdLinkFly, etc.)
  if (isKnownSafelinkDomain(normalized)) {
    const onlineResult = await resolveSafelinkOnline(normalized);
    if (onlineResult && onlineResult !== normalized) {
      hops.push({
        url: normalized,
        status: 200,
        redirectUrl: onlineResult,
        type: 'http-redirect'
      });

      const subTrace = await traceRedirects(onlineResult, 10);
      const finalUrl = subTrace.bypassed ? subTrace.finalUrl : onlineResult;

      return {
        success: true,
        originalUrl: normalized,
        destinationUrl: finalUrl,
        domain,
        method: 'safelink-extractor',
        hops: [...hops, ...subTrace.hops],
        totalHops: hops.length + subTrace.totalHops,
        durationMs: Date.now() - startTime
      };
    }
  }

  // Stage 3: Universal Recursive HTTP & Meta-Refresh Redirect Tracer (supports 10,000+ generic shorteners)
  const trace = await traceRedirects(normalized, 15);
  hops.push(...trace.hops);

  let candidateFinal = trace.finalUrl;

  // Stage 4: Secondary heuristic check on the landing page URL
  const secondaryParam = unpackUrlParameters(candidateFinal);
  if (secondaryParam && secondaryParam !== candidateFinal) {
    hops.push({
      url: candidateFinal,
      status: 200,
      redirectUrl: secondaryParam,
      type: 'http-redirect'
    });
    candidateFinal = secondaryParam;
  }

  const isBypassed = candidateFinal !== normalized || hops.length > 0;

  return {
    success: true,
    originalUrl: normalized,
    destinationUrl: candidateFinal,
    domain,
    method: hops.length > 1 ? 'hybrid-pipeline' : 'http-redirect',
    hops,
    totalHops: hops.length,
    durationMs: Date.now() - startTime,
    error: isBypassed ? undefined : 'Tautan tidak mengalami pengalihan atau sudah berupa tautan langsung.'
  };
}

/**
 * Executes bypass for multiple URLs with controlled concurrency
 */
export async function bypassBatch(
  urls: string[],
  concurrency: number = 5
): Promise<BypassResult[]> {
  const results: BypassResult[] = [];
  const queue = [...urls];

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      if (!url) break;
      const res = await bypassUrl(url);
      results.push(res);
    }
  });

  await Promise.all(workers);
  return results;
}
