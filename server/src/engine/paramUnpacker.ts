/**
 * Validates whether a candidate string is an absolute HTTP/HTTPS URL
 */
export function isValidHttpUrl(candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Attempts multiple decoding strategies on a string candidate
 */
export function decodeCandidate(raw: string): string | null {
  if (!raw) return null;

  // Level 1: URL decode
  let current = raw.trim();
  try {
    current = decodeURIComponent(current);
  } catch {
    // ignore malformed URI
  }

  if (isValidHttpUrl(current)) return current;

  // Level 2: Base64 decode
  try {
    const b64Decoded = Buffer.from(current, 'base64').toString('utf-8');
    if (isValidHttpUrl(b64Decoded)) return b64Decoded;

    // Check if base64 decoded string needs one more URL decode
    try {
      const b64UrlDecoded = decodeURIComponent(b64Decoded);
      if (isValidHttpUrl(b64UrlDecoded)) return b64UrlDecoded;
    } catch {
      // ignore
    }
  } catch {
    // not valid base64
  }

  // Level 3: Hex decode
  if (/^[0-9a-fA-F]{10,}$/.test(current) && current.length % 2 === 0) {
    try {
      const hexDecoded = Buffer.from(current, 'hex').toString('utf-8');
      if (isValidHttpUrl(hexDecoded)) return hexDecoded;
    } catch {
      // not valid hex
    }
  }

  // Level 4: ROT13 decode
  const rot13 = current.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code >= 97 ? 97 : 65;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
  if (isValidHttpUrl(rot13)) return rot13;

  // Level 5: Reverse string
  const reversed = current.split('').reverse().join('');
  if (isValidHttpUrl(reversed)) return reversed;

  return null;
}

const COMMON_TARGET_PARAMS = [
  'url',
  'link',
  'target',
  'dest',
  'destination',
  'go',
  'to',
  'next',
  'u',
  'd',
  'r',
  'redirect',
  'return',
  'uri',
  'out',
  'redirect_to',
  'href'
];

/**
 * Inspects a URL query string for encoded destination URLs
 */
export function unpackUrlParameters(urlString: string): string | null {
  try {
    const parsed = new URL(urlString);
    const searchParams = parsed.searchParams;

    // First check prioritized common parameters
    for (const key of COMMON_TARGET_PARAMS) {
      const val = searchParams.get(key);
      if (val) {
        const decoded = decodeCandidate(val);
        if (decoded) return decoded;
      }
    }

    // Next check any other parameters present in query string
    for (const [, val] of searchParams.entries()) {
      const decoded = decodeCandidate(val);
      if (decoded) return decoded;
    }

    // Check URL hash/fragment (e.g. https://site.com#aHR0cHM6Ly9nby5jb20=)
    if (parsed.hash && parsed.hash.length > 2) {
      const hashContent = parsed.hash.replace(/^#/, '');
      const decoded = decodeCandidate(hashContent);
      if (decoded) return decoded;
    }

    return null;
  } catch {
    return null;
  }
}
