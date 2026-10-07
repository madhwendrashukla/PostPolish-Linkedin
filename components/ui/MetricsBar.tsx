'use client';

import React from 'react';
import { AlertTriangle, Clock, Hash, CheckCircle2, Flame } from 'lucide-react';
import { analyzePostText } from '@/lib/utils/text-metrics';

interface MetricsBarProps {
  formattedText: string;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ formattedText }) => {
  const metrics = analyzePostText(formattedText);
  const percentage = Math.min(100, Math.round((metrics.charCount / 3000) * 100));

  // Determine counter color
  let progressColor = 'text-[var(--teal)]';
  let progressBg = 'bg-[var(--teal)]';
  if (metrics.isOverLimit) {
    progressColor = 'text-red-500';
    progressBg = 'bg-red-500';
  } else if (metrics.isNearLimit) {
    progressColor = 'text-amber-500';
    progressBg = 'bg-amber-500';
  }

  return (
    <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Metric Badges */}
      <div className="flex items-center gap-4 flex-wrap text-[var(--text-secondary)]">
        {/* Character Count Progress */}
        <div className="flex items-center gap-2">
          <div className="w-14 h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${progressBg}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`font-mono font-semibold ${progressColor}`}>
            {metrics.charCount.toLocaleString()}/3,000 chars
          </span>
        </div>

        {/* Word Count & Reading Time */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>
            {metrics.wordCount} words • ~{metrics.readingTimeSeconds}s read
          </span>
        </div>

        {/* Hook Length Gauge */}
        <div className="flex items-center gap-1.5">
          <Flame
            className={`w-3.5 h-3.5 ${
              metrics.hookCharCount <= 210 ? 'text-amber-500' : 'text-[var(--text-muted)]'
            }`}
          />
          <span title="Characters in the top hook line before the fold">
            Hook: <strong>{metrics.hookCharCount}</strong> chars{' '}
            {metrics.hookCharCount > 0 && metrics.hookCharCount <= 210 ? (
              <span className="text-emerald-600 font-medium">(fits above fold)</span>
            ) : metrics.hookCharCount > 210 ? (
              <span className="text-amber-600 font-medium">(truncated)</span>
            ) : null}
          </span>
        </div>

        {/* Hashtags */}
        {metrics.hashtagCount > 0 && (
          <div className="flex items-center gap-1 text-[var(--text-muted)]">
            <Hash className="w-3.5 h-3.5" />
            <span>{metrics.hashtagCount} tags</span>
          </div>
        )}
      </div>

      {/* Warning indicators */}
      <div className="flex items-center gap-2">
        {metrics.isOverLimit && (
          <div className="flex items-center gap-1 text-red-600 font-semibold animate-bounce">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Exceeds 3,000 char limit</span>
          </div>
        )}

        {metrics.hasStyledOveruseWarning && !metrics.isOverLimit && (
          <div className="flex items-center gap-1 text-amber-600 text-[11px] font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span title="Overusing Unicode math characters may impair screen reader accessibility">
              Heavy styled text: keep emphasis selective for best reach
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
