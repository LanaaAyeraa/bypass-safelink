import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Clock, Layers, Globe } from 'lucide-react';
import type { BypassResult } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { HopTimeline } from './HopTimeline';

interface ResultCardProps {
  result: BypassResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.destinationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'param-unpacker':
        return 'Token / Param Unpacker';
      case 'safelink-extractor':
        return 'Safelinku Specialist';
      case 'http-redirect':
        return 'HTTP Redirect Tracer';
      case 'hybrid-pipeline':
        return 'Hybrid Multi-Stage';
      default:
        return 'Direct Bypass';
    }
  };

  return (
    <Card className="border-emerald-500/30 bg-card/95 shadow-lg shadow-emerald-500/5 animate-in fade-in-50 duration-300">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Berhasil Dilewati (Bypassed)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[11px] gap-1">
              <Layers className="h-3 w-3 text-muted-foreground" />
              {getMethodLabel(result.method)}
            </Badge>

            <Badge variant="outline" className="text-[11px] gap-1 font-mono">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {result.durationMs}ms
            </Badge>

            {result.domain && (
              <Badge variant="outline" className="text-[11px] gap-1 font-mono">
                <Globe className="h-3 w-3 text-muted-foreground" />
                {result.domain}
              </Badge>
            )}
          </div>
        </div>

        {/* Destination Box */}
        <div className="relative group rounded-xl border-2 border-emerald-500/25 bg-emerald-500/5 p-4 transition-all hover:border-emerald-500/40">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tautan Tujuan Asli (Destination URL):</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Bersih dari iklan
            </span>
          </div>

          <p className="font-mono text-sm md:text-base font-bold text-foreground break-all select-all">
            {result.destinationUrl}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <Button
            onClick={handleCopy}
            className="flex-1 min-w-[140px] gap-2 h-11 text-sm font-semibold shadow-md"
            variant={copied ? 'secondary' : 'default'}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                Tersalin ke Clipboard!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Salin Tautan Tujuan
              </>
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            className="min-w-[130px] gap-2 h-11 text-sm font-semibold border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            <a
              href={result.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              Buka Tautan
            </a>
          </Button>
        </div>

        {/* Hop Timeline */}
        <HopTimeline
          hops={result.hops}
          originalUrl={result.originalUrl}
          finalUrl={result.destinationUrl}
        />
      </CardContent>
    </Card>
  );
};
