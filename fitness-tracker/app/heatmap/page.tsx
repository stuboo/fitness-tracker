'use client';

import { useState } from 'react';
import Heatmap from '@/components/Heatmap';
import { useEntries } from '@/hooks/useEntries';
import { MetricType } from '@/lib/types';

export default function HeatmapPage() {
  const { entries, loading, error } = useEntries();
  const [metric, setMetric] = useState<MetricType>('composite');

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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Activity Heatmap</h1>

      {/* Metric Selector */}
      <div className="mb-6">
        <label htmlFor="metric" className="block text-lg font-medium mb-2 text-gray-900">
          Metric
        </label>
        <select
          id="metric"
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricType)}
          className="w-full md:w-64 h-12 px-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="composite">Composite Score</option>
          <option value="weight">Weight</option>
          <option value="steps">Steps</option>
          <option value="eating">Clean Eating</option>
          <option value="protein">Protein</option>
          <option value="lift">Exercise</option>
        </select>
      </div>

      <Heatmap entries={entries} metric={metric} />
    </div>
  );
}
