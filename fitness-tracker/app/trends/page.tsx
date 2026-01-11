'use client';

import TrendChart from '@/components/TrendChart';
import { useEntries } from '@/hooks/useEntries';
import { TrendingUp, Flame, Sparkles } from 'lucide-react';

export default function TrendsPage() {
  const { entries, loading, error } = useEntries();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="card-elevated px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[var(--focus-indigo)] border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-semibold text-gray-700">Loading your trends...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="card-elevated px-8 py-6 text-center">
          <Flame className="w-12 h-12 text-[var(--energy-coral)] mx-auto mb-3" />
          <div className="text-lg font-bold text-gray-900 mb-1">Error Loading Data</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="card-elevated px-8 py-6 text-center max-w-md">
          <Sparkles className="w-12 h-12 text-[var(--focus-indigo)] mx-auto mb-3" />
          <div className="text-lg font-bold text-gray-900 mb-2">No Data Yet</div>
          <p className="text-sm text-gray-600">
            Start logging your fitness data to see beautiful trends and insights!
          </p>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const latestEntry = entries[0];
  const avgComposite = entries.reduce((sum, e) => sum + e.composite_score, 0) / entries.length;
  const avgSteps = Math.round(entries.reduce((sum, e) => sum + e.steps, 0) / entries.length);
  const workoutDays = entries.filter(e => e.lifted_or_stretched).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--focus-indigo)] to-[var(--focus-violet)] mb-4 shadow-lg animate-float">
            <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Trends & Progress
          </h1>
          <p className="text-gray-600 text-base">
            Track your journey over the last 30 days
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div className="card-elevated">
            <div className="text-sm font-semibold text-gray-600 mb-1">Avg Composite</div>
            <div className="text-3xl font-bold gradient-text-focus">
              {Math.round(avgComposite * 100)}%
            </div>
          </div>
          <div className="card-elevated">
            <div className="text-sm font-semibold text-gray-600 mb-1">Avg Steps</div>
            <div className="text-3xl font-bold gradient-text-health">
              {avgSteps.toLocaleString()}
            </div>
          </div>
          <div className="card-elevated">
            <div className="text-sm font-semibold text-gray-600 mb-1">Workout Days</div>
            <div className="text-3xl font-bold gradient-text">
              {workoutDays}/{entries.length}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <TrendChart entries={entries} metric="composite" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <TrendChart entries={entries} metric="weight" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <TrendChart entries={entries} metric="steps" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <TrendChart entries={entries} metric="eating" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <TrendChart entries={entries} metric="protein" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <TrendChart entries={entries} metric="lift" />
          </div>
        </div>
      </div>
    </div>
  );
}
