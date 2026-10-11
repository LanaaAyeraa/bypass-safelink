import React, { useState } from 'react';
import { Bookmark, Copy, Check, MousePointerClick, Smartphone } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export const BookmarkletCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Bookmarklet code that opens local bypasser app with query parameter or direct API
  const bookmarkletCode = `javascript:(function(){var u=encodeURIComponent(window.location.href);window.open('${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}?bypass='+u,'_blank');})();`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-md">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 border-b pb-4">
            <Bookmark className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-bold text-base">Bookmarklet Quick Bypass</h4>
              <p className="text-xs text-muted-foreground">
                Bypass link langsung dari halaman web safelink tanpa perlu bolak-balik copy-paste
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-secondary/30 p-5 space-y-4 text-center">
            <p className="text-sm text-foreground">
              Tarik (drag & drop) tombol di bawah ini ke <strong>Bookmarks Bar</strong> peramban Anda:
            </p>

            <div className="inline-block py-2">
              <a
                href={bookmarkletCode}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Tarik tombol ini ke bilah Bookmark browser Anda!');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-primary/25 cursor-grab active:cursor-grabbing hover:scale-105 transition-all select-none"
              >
                <Bookmark className="h-4 w-4" />
                ⚡ Bypass Safelink
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              Atau salin kode JavaScript bookmarklet secara manual:
            </p>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="gap-2 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Kode Bookmarklet Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Salin Kode Bookmarklet
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border p-4 bg-card space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                <MousePointerClick className="h-4 w-4 text-primary" />
                Cara Pakai di Laptop / PC (Chrome, Edge, Firefox)
              </div>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside pl-1">
                <li>Tampilkan Bookmarks bar browser (<kbd className="font-mono bg-muted px-1 rounded text-[10px]">Ctrl+Shift+B</kbd>).</li>
                <li>Tarik tombol "⚡ Bypass Safelink" ke bookmark bar.</li>
                <li>Saat Anda membuka halaman Safelinku atau shortlink iklan, klik bookmarklet tersebut untuk bypass instan!</li>
              </ol>
            </div>

            <div className="rounded-xl border p-4 bg-card space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                <Smartphone className="h-4 w-4 text-primary" />
                Cara Pakai di Smartphone (Android / iOS)
              </div>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside pl-1">
                <li>Klik tombol "Salin Kode Bookmarklet" di atas.</li>
                <li>Buat bookmark baru pada halaman sembarang di browser HP.</li>
                <li>Edit URL bookmark tersebut dan tempel (paste) kode bookmarklet.</li>
                <li>Ketik nama bookmark di kolom address bar saat berada di halaman safelink.</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
