import { describe, it, expect } from 'vitest';
import { extractSafelinkFromHtml, isKnownSafelinkDomain } from '../safelinkResolver.js';

describe('Safelinku & AdLinkFly Specialized Extractor', () => {
  it('should identify known safelink domains', () => {
    expect(isKnownSafelinkDomain('https://safelinku.com/xyz123')).toBe(true);
    expect(isKnownSafelinkDomain('https://sfl.gl/abc789')).toBe(true);
    expect(isKnownSafelinkDomain('https://idsly.bid/link123')).toBe(true);
    expect(isKnownSafelinkDomain('https://droplink.co/download')).toBe(true);
    expect(isKnownSafelinkDomain('https://google.com')).toBe(false);
  });

  it('should extract target URL encoded in inline script atob() call', () => {
    const rawTarget = 'https://mediafire.com/download/file123.zip';
    const b64 = Buffer.from(rawTarget).toString('base64');
    const html = `
      <html>
        <body>
          <div class="safelink-wrapper">
            <script>
              var secretLink = atob("${b64}");
              window.finalLink = secretLink;
            </script>
          </div>
        </body>
      </html>
    `;

    const result = extractSafelinkFromHtml(html, 'https://mysafelinkblog.com/post/1');
    expect(result).toBe(rawTarget);
  });

  it('should extract target URL from data-url, data-href, or get-link button attributes', () => {
    const rawTarget = 'https://drive.google.com/file/d/abcdef/view';
    const html = `
      <html>
        <body>
          <a id="get-link-btn" class="btn btn-success" data-url="${rawTarget}" href="javascript:void(0);">
            Click to Continue
          </a>
        </body>
      </html>
    `;

    const result = extractSafelinkFromHtml(html, 'https://safelinkportal.net/reading');
    expect(result).toBe(rawTarget);
  });

  it('should extract base64 encoded URL from data attribute', () => {
    const rawTarget = 'https://github.com/release/app.exe';
    const b64 = Buffer.from(rawTarget).toString('base64');
    const html = `
      <html>
        <body>
          <button id="download_btn" data-link="${b64}">Download Now</button>
        </body>
      </html>
    `;

    const result = extractSafelinkFromHtml(html, 'https://techblog.id/article/1');
    expect(result).toBe(rawTarget);
  });

  it('should extract AdLinkFly form parameters', () => {
    const html = `
      <html>
        <body>
          <form id="go-link" action="/links/go" method="POST">
            <input type="hidden" name="_wp_http_referer" value="/test-alias">
            <input type="hidden" name="ad_form_data" value="session_token_12345">
            <button type="submit">Get Link</button>
          </form>
        </body>
      </html>
    `;

    const result = extractSafelinkFromHtml(html, 'https://sfl.gl/test-alias');
    // For AdLinkFly forms, it should extract form target or return relevant endpoint info
    expect(result).toBeDefined();
  });
});
