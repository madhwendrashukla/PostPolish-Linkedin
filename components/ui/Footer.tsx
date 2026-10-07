'use client';

import React from 'react';
import { Heart, Sparkles, ShieldCheck, Zap, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 backdrop-blur-sm transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand and Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
              P
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-[var(--text-primary)]">
                PostPolish
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Format, preview, and polish your LinkedIn posts with confidence.
              </p>
            </div>
          </div>

          {/* Feature Highlights / Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-subtle)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Hashtag & URL Protected</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-subtle)]">
              <Lock className="w-3.5 h-3.5 text-[var(--teal)]" />
              <span>100% Private (Local Storage)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-subtle)]">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Copy</span>
            </div>
          </div>

          {/* Attribution */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span>
              Developed with{' '}
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block align-middle mx-0.5 animate-pulse" />{' '}
              by{' '}
              <span className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                Madhwendra Shukla
              </span>
            </span>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} PostPolish. Free & open web utility.</p>
          <p>Not affiliated with or endorsed by LinkedIn Corporation.</p>
        </div>
      </div>
    </footer>
  );
};
