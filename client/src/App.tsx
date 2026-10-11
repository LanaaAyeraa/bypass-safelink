import React, { useState, useEffect } from 'react';
import { Zap, Layers, History, Bookmark, Sparkles, Shield, Rocket } from 'lucide-react';
import type { BypassResult } from './types';
import { Header } from './components/Header';
import { SingleBypass } from './components/SingleBypass';
import { BatchBypass } from './components/BatchBypass';
import { HistoryList } from './components/HistoryList';
import { BookmarkletCard } from './components/BookmarkletCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

const STORAGE_KEY = 'universal_bypass_history_v1';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('single');
  const [history, setHistory] = useState<BypassResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
    } catch {
      // ignore
    }
  }, [history]);

  // Handle auto bypass if opened via bookmarklet URL query (?bypass=https://...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bypassTarget = params.get('bypass');
      if (bypassTarget) {
        setActiveTab('single');
      }
    }
  }, []);

  const handleAddSingleResult = (result: BypassResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.destinationUrl !== result.destinationUrl);
      return [result, ...filtered].slice(0, 100);
    });
  };

  const handleAddBatchResults = (results: BypassResult[]) => {
    setHistory((prev) => {
      const newItems = results.filter((r) => r.success);
      const combined = [...newItems, ...prev];
      // remove duplicates by destinationUrl
      const unique = Array.from(
        new Map(combined.map((item) => [item.destinationUrl, item])).values()
      );
      return unique.slice(0, 100);
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Bypass Safelink & Pemendek Link Tanpa Iklan & Timer
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Universal Shortlink <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Bypasser</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dapatkan langsung tautan asli (Destination URL) dari Safelinku, Sfl.gl, Idsly, template blog safelink, dan lebih dari 10.000+ domain pemendek URL dalam hitungan detik.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
              <Shield className="h-3.5 w-3.5 text-emerald-500" /> Bebas Malware & Ads
            </span>
            <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
              <Rocket className="h-3.5 w-3.5 text-indigo-500" /> Multi-Stage Engine
            </span>
            <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> Instan & Ringan
            </span>
          </div>
        </div>

        {/* Main Tabs Container */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 max-w-md w-full h-auto p-1.5 gap-1">
              <TabsTrigger value="single" className="text-xs sm:text-sm font-semibold">
                <Zap className="h-4 w-4" />
                Single
              </TabsTrigger>

              <TabsTrigger value="batch" className="text-xs sm:text-sm font-semibold">
                <Layers className="h-4 w-4" />
                Batch
              </TabsTrigger>

              <TabsTrigger value="history" className="text-xs sm:text-sm font-semibold">
                <History className="h-4 w-4" />
                Riwayat
                {history.length > 0 && (
                  <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded-full font-bold">
                    {history.length}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger value="bookmarklet" className="text-xs sm:text-sm font-semibold">
                <Bookmark className="h-4 w-4" />
                Bookmarklet
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="single">
            <SingleBypass onBypassComplete={handleAddSingleResult} />
          </TabsContent>

          <TabsContent value="batch">
            <BatchBypass onBypassComplete={handleAddBatchResults} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryList
              history={history}
              onClearHistory={handleClearHistory}
            />
          </TabsContent>

          <TabsContent value="bookmarklet">
            <BookmarkletCard />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground mt-auto bg-card/40">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Universal Safelink Bypasser. Dibangun dengan shadcn/ui & React.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Server: Express REST API</span>
            <span>•</span>
            <span>Client: Vite + Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
