import React, { useState } from 'react';
import { History, Trash2, Copy, Check, Search, ExternalLink, Globe } from 'lucide-react';
import type { BypassResult } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface HistoryListProps {
  history: BypassResult[];
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.destinationUrl.toLowerCase().includes(q) ||
      item.originalUrl.toLowerCase().includes(q) ||
      (item.domain && item.domain.toLowerCase().includes(q))
    );
  });

  const handleCopy = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="border-border/60 shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h4 className="font-bold text-base">Riwayat Bypass Lokal</h4>
            <Badge variant="secondary" className="font-mono text-xs">
              {history.length} Item
            </Badge>
          </div>

          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearHistory}
              className="text-xs text-destructive hover:bg-destructive/10 border-destructive/20 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Bersihkan Riwayat
            </Button>
          )}
        </div>

        {history.length > 0 ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari tautan tujuan atau domain..."
                className="pl-9 h-10 text-xs sm:text-sm"
              />
            </div>

            <div className="divide-y divide-border/60 max-h-[460px] overflow-y-auto space-y-1 pr-1">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  Tidak ada riwayat yang cocok dengan kata kunci pencarian.
                </div>
              ) : (
                filtered.map((item, index) => {
                  const itemId = `${item.destinationUrl}-${index}`;
                  return (
                    <div
                      key={itemId}
                      className="py-3 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.domain && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-mono gap-1"
                            >
                              <Globe className="h-2.5 w-2.5" />
                              {item.domain}
                            </Badge>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {item.timestamp
                              ? new Date(item.timestamp).toLocaleTimeString()
                              : ''}
                          </span>
                        </div>

                        <div className="truncate text-muted-foreground font-mono text-[11px]">
                          {item.originalUrl}
                        </div>

                        <div className="font-mono font-bold text-foreground truncate select-all text-sm">
                          {item.destinationUrl}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pt-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleCopy(item.destinationUrl, itemId)}
                          title="Salin tautan tujuan"
                        >
                          {copiedId === itemId ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>

                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title="Buka langsung"
                        >
                          <a
                            href={item.destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 text-primary" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <History className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-sm">Belum ada riwayat bypass</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tautan yang Anda lewati akan otomatis tercatat di perangkat Anda.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
