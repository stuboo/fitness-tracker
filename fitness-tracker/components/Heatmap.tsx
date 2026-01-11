'use client';

import { useEffect, useRef } from 'react';
import CalHeatmap from 'cal-heatmap';
import { Entry, MetricType } from '@/lib/types';
import 'cal-heatmap/cal-heatmap.css';

interface HeatmapProps {
  entries: Entry[];
  metric: MetricType;
}

export default function Heatmap({ entries, metric }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<CalHeatmap | null>(null);

  useEffect(() => {
    if (!containerRef.current || !entries.length) return;

    // Transform entries to heatmap data format
    const data: Record<number, number> = {};
    entries.forEach((entry) => {
      const timestamp = Math.floor(new Date(entry.date).getTime() / 1000);
      let value = 0;

      switch (metric) {
        case 'composite':
          value = entry.composite_score;
          break;
        case 'weight':
          // Normalize weight to 0-1 scale (arbitrary range 100-300 lbs)
          value = Math.max(0, Math.min(1, (entry.weight - 100) / 200));
          break;
        case 'steps':
          value = Math.min(entry.steps / 8000, 1); // Normalize to 0-1
          break;
        case 'eating':
          value = entry.clean_eating_score;
          break;
        case 'protein':
          value = entry.protein_percentage;
          break;
        case 'lift':
          value = entry.lifted_or_stretched ? 1 : 0;
          break;
      }

      data[timestamp] = value;
    });

    // Initialize Cal-Heatmap
    if (calRef.current) {
      calRef.current.destroy();
    }

    calRef.current = new CalHeatmap();
    calRef.current.paint({
      itemSelector: containerRef.current,
      domain: {
        type: 'month',
        gutter: 4,
      },
      subDomain: {
        type: 'day',
        radius: 2,
        width: 12,
        height: 12,
        gutter: 2,
      },
      data: {
        source: data,
        type: 'json',
      },
      date: { start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      range: 12, // 12 months
      scale: {
        color: {
          type: 'threshold',
          range: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          domain: [0.2, 0.4, 0.6, 0.8],
        },
      },
    });

    return () => {
      if (calRef.current) {
        calRef.current.destroy();
      }
    };
  }, [entries, metric]);

  if (!entries.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        No data to display. Start logging your fitness data!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div ref={containerRef} className="min-w-max" />
    </div>
  );
}
