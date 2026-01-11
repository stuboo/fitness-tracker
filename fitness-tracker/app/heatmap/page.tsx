'use client';

import { useState } from 'react';
import Heatmap from '@/components/Heatmap';
import { useEntries } from '@/hooks/useEntries';
import { MetricType } from '@/lib/types';
import { Target, Weight, Footprints, Apple, Drumstick, Dumbbell, Flame } from 'lucide-react';

const metricOptions = [
  { value: 'composite' as MetricType, label: 'Composite', icon: Target, color: 'var(--focus-indigo)' },
  { value: 'weight' as MetricType, label: 'Weight', icon: Weight, color: 'var(--energy-coral)' },
  { value: 'steps' as MetricType, label: 'Steps', icon: Footprints, color: 'var(--health-ocean)' },
  { value: 'eating' as MetricType, label: 'Eating', icon: Apple, color: 'var(--energy-amber)' },
  { value: 'protein' as MetricType, label: 'Protein', icon: Drumstick, color: 'var(--focus-violet)' },
  { value: 'lift' as MetricType, label: 'Exercise', icon: Dumbbell, color: 'var(--health-mint)' },
];

export default function HeatmapPage() {
  const { entries, loading, error } = useEntries();
  const [metric, setMetric] = useState<MetricType>('composite');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="card-elevated px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[var(--focus-indigo)] border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-semibold text-gray-700">Loading your data...</span>
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

  const totalDays = entries.length;
  const currentDate = new Date();
  const streakDays = calculateCurrentStreak(entries);
  const bestStreak = calculateBestStreak(entries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div className="card-elevated text-center">
            <div className="text-3xl font-bold gradient-text-focus mb-1">{totalDays}</div>
            <div className="text-xs font-semibold text-gray-600">Total Days</div>
          </div>
          <div className="card-elevated text-center">
            <div className="text-3xl font-bold gradient-text-health mb-1">{streakDays}</div>
            <div className="text-xs font-semibold text-gray-600">Current Streak</div>
          </div>
          <div className="card-elevated text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{bestStreak}</div>
            <div className="text-xs font-semibold text-gray-600">Best Streak</div>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <label className="block text-sm font-bold text-gray-700 mb-3">Select Metric</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {metricOptions.map((option) => {
              const Icon = option.icon;
              const isActive = metric === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setMetric(option.value)}
                  className={`card-elevated flex flex-col items-center gap-2 py-4 transition-all duration-300 ${
                    isActive ? 'ring-2 scale-[1.05]' : 'hover:scale-[1.02]'
                  }`}
                  style={isActive ? { outlineColor: option.color, outlineWidth: '2px', outlineStyle: 'solid' } : {}}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: isActive ? option.color : '#9ca3af' }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isActive ? option.color : '#6b7280' }}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Heatmap */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Heatmap entries={entries} metric={metric} />
        </div>
      </div>
    </div>
  );
}

// Calculate current streak of consecutive days
function calculateCurrentStreak(entries: any[]): number {
  if (!entries.length) return 0;

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Calculate best streak of consecutive days
function calculateBestStreak(entries: any[]): number {
  if (!entries.length) return 0;

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i - 1].date);
    const currDate = new Date(sortedEntries[i].date);

    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}
