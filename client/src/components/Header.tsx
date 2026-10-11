import React, { useEffect, useState } from 'react';
import { Moon, Sun, Zap, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight sm:text-lg">
                Universal Bypass
              </span>
              <Badge variant="success" className="text-[10px] py-0 px-2 font-mono">
                10,000+ Links
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Lewati Safelinku, Sfl.gl, Idsly & Pemendek Link Tanpa Iklan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-medium">Engine Aktif</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full h-9 w-9"
            title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
