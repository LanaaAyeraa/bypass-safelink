import * as cheerio from 'cheerio';
import axios from 'axios';
import { decodeCandidate, isValidHttpUrl } from './paramUnpacker.js';

const KNOWN_SAFELINK_DOMAINS = [
  'safelinku.com',
  'sfl.gl',
  'idsly.bid',
  'idsly.com',
  'droplink.co',
  'clicksfly.com',
  'shrinkearn.com',
  'exe.io',
  'clk.sh',
  'shortzon.com',
  'adbull.me',
  'ouo.io',
  'ouo.press',
  'linkduit.mobi',
  'semawur.com',
  'realsafelink.com',
  'safelinkblogger.com',
  'teknosimple.com',
  'hexafile.net'
];

/**
 * Checks whether a given URL belongs to a known safelink / ad-shortener domain
 */
export function isKnownSafelinkDomain(urlString: string): boolean {
  try {
    const hostname = new URL(urlString).hostname.toLowerCase();
    return KNOWN_SAFELINK_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Extracts destination URL or hidden redirect from an HTML document
 */
export function extractSafelinkFromHtml(html: string, baseUrl: string): string | null {
  if (!html) return null;

  const $ = cheerio.load(html);

  // Strategy 1: Check elements with data attributes (data-url, data-href, data-link, etc.)
  const candidateAttributes = [
    'data-url',
    'data-href',
    'data-link',
    'data-target',
    'data-dest',
    'data-destination',
    'data-original'
  ];

  for (const attr of candidateAttributes) {
    const elements = $(`[${attr}]`);
    for (let i = 0; i < elements.length; i++) {
      const val = $(elements[i]).attr(attr);
      if (val) {
        const decoded = decodeCandidate(val);
        if (decoded && isValidHttpUrl(decoded)) {
          return decoded;
        }
      }
    }
  }

  // Strategy 2: Check buttons or links with specific IDs or classes
  const targetSelectors = [
    'a#get-link',
    'a#btn-main',
    'a#download',
    'a#download-button',
    'a#final-link',
    'a.get-link',
    'a.download-link',
    'a[href*="/links/go/"]'
  ];

  for (const selector of targetSelectors) {
    const el = $(selector);
    const href = el.attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      const decoded = decodeCandidate(href);
      if (decoded && isValidHttpUrl(decoded)) {
        return decoded;
      }
    }
  }

  // Strategy 3: Search script tags for atob() calls with base64 encoded URLs
  const atobMatches = html.matchAll(/atob\s*\(\s*["']([A-Za-z0-9+/=]+)["']\s*\)/g);
  for (const match of atobMatches) {
    const b64 = match[1];
    const decoded = decodeCandidate(b64);
    if (decoded && isValidHttpUrl(decoded)) {
      return decoded;
    }
  }

  // Strategy 4: Search script tags for decoded destination variable assignments
  const scriptVarPatterns = [
    /(?:var|let|const)\s+(?:secretLink|finalLink|destination|targetUrl|directUrl|downloadUrl)\s*=\s*["']([^"']+)["']/i,
    /(?:window\.)?(?:finalLink|targetUrl|downloadUrl)\s*=\s*["']([^"']+)["']/i
  ];

  for (const pattern of scriptVarPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const decoded = decodeCandidate(match[1]);
      if (decoded && isValidHttpUrl(decoded)) {
        return decoded;
      }
    }
  }

  // Strategy 5: Detect AdLinkFly form
  const adLinkFlyForm = $('form#go-link, form[action*="/links/go"]');
  if (adLinkFlyForm.length > 0) {
    const action = adLinkFlyForm.attr('action') || '/links/go';
    try {
      const resolvedEndpoint = new URL(action, baseUrl).href;
      return resolvedEndpoint;
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Executes specialized online extraction for a safelink page
 */
export async function resolveSafelinkOnline(
  urlString: string,
  userAgent: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
): Promise<string | null> {
  try {
    const res = await axios.get(urlString, {
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000,
      validateStatus: () => true
    });

    if (res.status >= 200 && res.status < 400 && typeof res.data === 'string') {
      const extracted = extractSafelinkFromHtml(res.data, urlString);
      if (extracted) {
        return extracted;
      }
    }
    return null;
  } catch {
    return null;
  }
}
