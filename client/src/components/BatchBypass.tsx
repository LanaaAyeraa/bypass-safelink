import React, { useState } from 'react';
import { Play, Copy, Check, Download, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { BypassResult } from '../types';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface BatchBypassProps {
  onBypassComplete: (results: BypassResult[]) => void;
}

export const BatchBypass: React.FC<BatchBypassProps> = ({ onBypassComplete }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BypassResult[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const urls = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const handleStartBatch = async () => {
    if (urls.length === 0) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch('/api/bypass/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        const enriched = data.results.map((r: BypassResult) => ({
          ...r,
          timestamp: Date.now()
        }));
        setResults(enriched);
        onBypassComplete(enriched);
      }
    } catch {
      // error handled in results
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = async () => {
    const text = results
      .filter((r) => r.success)
      .map((r) => r.destinationUrl)
      .join('\n');

    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportTxt = () => {
    const text = results
      .map((r) => `${r.originalUrl} -> ${r.destinationUrl}`)
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bypassed-links-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Masukkan Banyak Tautan (Satu tautan per baris):
            </label>
            <Badge variant="secondary" className="font-mono text-xs">
              {urls.length} Tautan Terdeteksi
            </Badge>
          </div>

          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`https://sfl.gl/link1\nhttps://safelinkreviewer.blogspot.com/?url=aHR0cHM6Ly9nby5jb20=\nhttps://tinyurl.com/link3`}
            disabled={loading}
            className="h-36 resize-y"
          />

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInputText('')}
              disabled={loading || !inputText}
            >
              Kosongkan Input
            </Button>

            <Button
              onClick={handleStartBatch}
              disabled={loading || urls.length === 0}
              className="gap-2 font-semibold px-6 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses {urls.length} Link...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Mulai Batch Bypass
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="pt-2 space-y-1.5 animate-in fade-in-50">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Memproses antrean safelink...</span>
                <span>Harap tunggu</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table / Cards */}
      {results.length > 0 && (
        <Card className="border-border/60 shadow-md animate-in fade-in-50 duration-300">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div>
                <h4 className="font-bold text-base">Hasil Batch Bypass</h4>
                <p className="text-xs text-muted-foreground">
                  {results.filter((r) => r.success).length} dari {results.length}{' '}
                  link berhasil dilewati
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportTxt}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Ekspor .txt
                </Button>

                <Button
                  size="sm"
                  onClick={handleCopyAll}
                  className="gap-1.5 text-xs font-semibold"
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Semua Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin Semua Hasil
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border/60 max-h-[420px] overflow-y-auto pr-1 space-y-1">
              {results.map((res, index) => (
                <div
                  key={index}
                  className="py-3 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {res.success ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="truncate text-muted-foreground font-mono">
                        {res.originalUrl}
                      </div>
                      <div className="font-mono font-semibold text-foreground truncate select-all">
                        {res.destinationUrl}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {res.durationMs}ms
                    </Badge>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => navigator.clipboard.writeText(res.destinationUrl)}
                      title="Salin tautan ini"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
