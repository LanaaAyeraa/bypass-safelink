import React, { useState } from 'react';
import { ArrowDown, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import type { Hop } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface HopTimelineProps {
  hops: Hop[];
  originalUrl: string;
  finalUrl: string;
}

export const HopTimeline: React.FC<HopTimelineProps> = ({
  hops,
  originalUrl,
  finalUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!hops || hops.length === 0) return null;

  return (
    <div className="mt-4 border rounded-xl bg-muted/30 overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 h-auto text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <LinkIcon className="h-3.5 w-3.5" />
          Rincian Rantai Pengalihan ({hops.length} Lompatan / Hops)
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <div className="p-4 pt-1 border-t space-y-3 font-mono text-xs">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">
              Awal
            </Badge>
            <div className="truncate text-muted-foreground select-all">
              {originalUrl}
            </div>
          </div>

          {hops.map((hop, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center justify-center py-0.5">
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/60" />
              </div>
              <div className="flex items-start gap-3 bg-background/60 p-2.5 rounded-lg border">
                <Badge
                  variant={hop.status >= 300 && hop.status < 400 ? 'default' : 'secondary'}
                  className="text-[10px] shrink-0 mt-0.5 font-bold"
                >
                  {hop.status || 'OK'}
                </Badge>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="truncate text-muted-foreground select-all">
                    {hop.url}
                  </div>
                  {hop.redirectUrl && (
                    <div className="truncate text-primary font-medium select-all">
                      ➜ {hop.redirectUrl}
                    </div>
                  )}
                  {hop.type && (
                    <span className="text-[10px] text-muted-foreground uppercase font-sans">
                      Metode: {hop.type}
                    </span>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}

          <div className="flex items-center justify-center py-0.5">
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/60" />
          </div>

          <div className="flex items-start gap-3 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/30">
            <Badge variant="success" className="text-[10px] shrink-0 mt-0.5">
              Tujuan Akhir
            </Badge>
            <div className="truncate text-emerald-600 dark:text-emerald-400 font-semibold select-all">
              {finalUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
