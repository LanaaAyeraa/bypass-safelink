import { describe, it, expect } from 'vitest';
import { unpackUrlParameters } from '../paramUnpacker.js';

describe('Bypass Engine Core - Parameter Unpacker', () => {
  it('should unpack plain URL-encoded query parameter', () => {
    const input = 'https://safelink.example.com/?url=https%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3Dtest';
    const result = unpackUrlParameters(input);
    expect(result).toBe('https://google.com/search?q=test');
  });

  it('should unpack Base64 encoded target URL', () => {
    const rawTarget = 'https://example.com/download-file.zip';
    const b64 = Buffer.from(rawTarget).toString('base64');
    const input = `https://blogger-safelink.com/?link=${b64}`;
    const result = unpackUrlParameters(input);
    expect(result).toBe(rawTarget);
  });

  it('should unpack Hex-encoded target URL', () => {
    const rawTarget = 'https://github.com/developer';
    const hex = Buffer.from(rawTarget).toString('hex');
    const input = `https://mysafelink.net/go?target=${hex}`;
    const result = unpackUrlParameters(input);
    expect(result).toBe(rawTarget);
  });

  it('should unpack double-encoded Base64 parameter', () => {
    const rawTarget = 'https://wikipedia.org';
    const b64 = Buffer.from(rawTarget).toString('base64');
    const doubleEncoded = encodeURIComponent(b64);
    const input = `https://safelink.id/?r=${doubleEncoded}`;
    const result = unpackUrlParameters(input);
    expect(result).toBe(rawTarget);
  });

  it('should unpack destination from common safelink parameters (dest, go, to, next, u, d)', () => {
    const rawTarget = 'https://speedtest.net';
    const b64 = Buffer.from(rawTarget).toString('base64');
    const input = `https://shortlink.site/landing?dest=${b64}`;
    const result = unpackUrlParameters(input);
    expect(result).toBe(rawTarget);
  });

  it('should return null when no redirect parameter exists', () => {
    const input = 'https://example.com/plain-page';
    const result = unpackUrlParameters(input);
    expect(result).toBeNull();
  });

  it('should return null when parameter content is not a valid http/https URL', () => {
    const input = 'https://example.com/?search=random_query_string';
    const result = unpackUrlParameters(input);
    expect(result).toBeNull();
  });
});
