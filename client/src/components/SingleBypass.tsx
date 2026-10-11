import React, { useState } from 'react';
import { ArrowRight, Clipboard, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import type { BypassResult } from '../types';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ResultCard } from './ResultCard';

interface SingleBypassProps {
  onBypassComplete: (result: BypassResult) => void;
}

const SAMPLE_LINKS = [
  {
    label: 'Safelink Blogger Base64',
    url: 'https://safelinkreviewer.blogspot.com/?url=aHR0cHM6Ly9naXRodWIuY29tL3RvcC9yZXBvcy9hd2Vzb21l'
  },
  {
    label: 'WordPress Encrypted Param',
    url: 'https://teknosimple.com/get?link=aHR0cHM6Ly9tZWRpYWZpcmUuY29tL2ZpbGUvc2FtcGxlLnppcA=='
  },
  {
    label: 'Generic Shortlink Redirect',
    url: 'https://tinyurl.com/google-test-search'
  }
];

export const SingleBypass: React.FC<SingleBypassProps> = ({ onBypassComplete }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<BypassResult | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // ignore clipboard permission error
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const res = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data: BypassResult = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal melewati tautan. Pastikan link masih aktif.');
      } else {
        const enrichedResult = { ...data, timestamp: Date.now() };
        setCurrentResult(enrichedResult);
        onBypassComplete(enrichedResult);
      }
    } catch (err: any) {
      setError(err.message || 'Koneksi ke backend server gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="safelink-input"
                className="text-sm font-semibold text-foreground flex items-center justify-between"
              >
                <span>Masukkan Tautan Safelink atau Shortlink:</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Mendukung Safelinku, Sfl.gl, Idsly & 10.000+ shortlink
                </span>
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="safelink-input"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Contoh: https://sfl.gl/xxx atau https://blog.com/?url=aHR0cHM6..."
                    className="pr-10 font-mono text-xs sm:text-sm"
                    disabled={loading}
                    autoComplete="off"
                    autoFocus
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handlePaste}
                  title="Tempel dari Clipboard"
                  className="shrink-0 h-11 w-11"
                  disabled={loading}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="gap-2 h-11 px-5 shrink-0 font-semibold shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Bypass
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Sample Links */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground/80 mr-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Coba Contoh:
              </span>
              {SAMPLE_LINKS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrl(sample.url);
                  }}
                  className="px-2 py-0.5 rounded-md bg-secondary hover:bg-secondary/80 text-[11px] transition-colors border border-border/50"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Gagal Melakukan Bypass</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Result Card */}
      {currentResult && <ResultCard result={currentResult} />}
    </div>
  );
};
