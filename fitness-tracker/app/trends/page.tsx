'use client';

import TrendChart from '@/components/TrendChart';
import { useEntries } from '@/hooks/useEntries';

export default function TrendsPage() {
  const { entries, loading, error } = useEntries();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-gray-600">
          No data yet. Start logging your fitness data!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Trends</h1>

      <div className="space-y-8">
        <TrendChart entries={entries} metric="composite" />
        <TrendChart entries={entries} metric="weight" />
        <TrendChart entries={entries} metric="steps" />
        <TrendChart entries={entries} metric="eating" />
        <TrendChart entries={entries} metric="protein" />
        <TrendChart entries={entries} metric="lift" />
      </div>
    </div>
  );
}
