'use client';

import { useEffect, useRef } from 'react';
import CalHeatmap from 'cal-heatmap';
import { Entry, MetricType } from '@/lib/types';

interface HeatmapProps {
  entries: Entry[];
  metric: MetricType;
}

// Metric-specific color scales matching the design system
const metricColorScales: Record<MetricType, { range: string[]; name: string }> = {
  composite: {
    name: 'Composite Score',
    range: ['#f1f5f9', '#ddd6fe', '#c4b5fd', '#a78bfa', '#7c3aed'],
  },
  weight: {
    name: 'Weight',
    range: ['#F1A6A6', '#ED9090', '#E97474', '#E35151', '#DC2626'],
  },
  steps: {
    name: 'Steps',
    range: ['#f1f5f9', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981'],
  },
  eating: {
    name: 'Clean Eating',
    range: ['#f1f5f9', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b'],
  },
  protein: {
    name: 'Protein',
    range: ['#f1f5f9', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7'],
  },
  lift: {
    name: 'Exercise',
    range: ['#f1f5f9', '#6ee7b7', '#34d399', '#10b981', '#059669'],
  },
};

export default function Heatmap({ entries, metric }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<CalHeatmap | null>(null);

  useEffect(() => {
    if (!containerRef.current || !entries.length) return;

    // Ensure we destroy any existing instance first
    if (calRef.current) {
      calRef.current.destroy();
      calRef.current = null;
    }

    // Clear the container to prevent duplicates
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    console.log('[Heatmap] Processing entries:', entries.length);
    console.log('[Heatmap] First entry:', entries[0]);
    console.log('[Heatmap] Metric:', metric);

    // Transform entries to heatmap data format
    // Cal-heatmap v4 expects array of objects with date and value
    const dataArray: Array<{ date: string; value: number }> = entries
      .map((entry) => {
        let value = 0;
        let shouldInclude = true;

        switch (metric) {
          case 'composite':
            value = entry.composite_score;
            break;
          case 'weight':
            // Only show color if weight was actually logged
            if (!entry.weight || entry.weight === 0) {
              shouldInclude = false;
            } else {
              // Weight progress: 210 lbs (start) = 0 (light), 175 lbs (goal) = 1 (dark)
              const startWeight = 210;
              const goalWeight = 175;
              value = Math.max(0, Math.min(1, (startWeight - entry.weight) / (startWeight - goalWeight)));
            }
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

        console.log('[Heatmap] Entry date:', entry.date, 'value:', value, 'shouldInclude:', shouldInclude);
        return { date: entry.date, value, shouldInclude };
      })
      .filter((item) => item.shouldInclude)
      .map(({ date, value }) => ({ date, value }));

    console.log('[Heatmap] Data array for cal-heatmap:', dataArray);
    console.log('[Heatmap] Data array length:', dataArray.length);

    // Get metric-specific color scale
    const colorScale = metricColorScales[metric];

    // Set start date to January 1, 2026
    const startDate = new Date(2026, 0, 1); // Month is 0-indexed (0 = January)
    console.log('[Heatmap] Start date:', startDate);
    console.log('[Heatmap] Color scale:', colorScale);
    console.log('[Heatmap] Data entries count:', dataArray.length);

    calRef.current = new CalHeatmap();
    calRef.current.paint({
      itemSelector: containerRef.current,
      domain: {
        type: 'month',
        gutter: 8,
        label: {
          text: 'MMM',
          textAlign: 'start',
          position: 'top',
        },
      },
      subDomain: {
        type: 'day',
        radius: 4,
        width: 14,
        height: 14,
        gutter: 4,
      },
      data: {
        source: dataArray,
        x: 'date',
        y: 'value',
      },
      date: { start: startDate },
      range: 12, // 12 months
      scale: {
        color: {
          type: 'quantize',
          range: colorScale.range,
          domain: [0, 1],
        },
      },
    });

    console.log('[Heatmap] Cal-heatmap painted successfully');

    // Debug: Check if colors are being applied
    setTimeout(() => {
      const cells = containerRef.current?.querySelectorAll('.ch-subdomain-bg');
      console.log('[Heatmap] Total cells rendered:', cells?.length);

      const cellsWithData = containerRef.current?.querySelectorAll('.ch-subdomain-bg[fill]');
      console.log('[Heatmap] Cells with fill attribute:', cellsWithData?.length);

      if (cellsWithData && cellsWithData.length > 0) {
        cellsWithData.forEach((cell, index) => {
          const fillColor = cell.getAttribute('fill');
          const dataValue = cell.getAttribute('data-value');
          console.log(`[Heatmap] Cell ${index} - fill: ${fillColor}, data-value: ${dataValue}`);
        });
      }
    }, 100);

    return () => {
      if (calRef.current) {
        calRef.current.destroy();
      }
    };
  }, [entries, metric]);

  if (!entries.length) {
    return (
      <div className="card-elevated text-center py-12">
        <div className="text-gray-400 text-lg font-medium mb-2">No Data Yet</div>
        <p className="text-gray-500 text-sm">Start logging your fitness data to see your progress!</p>
      </div>
    );
  }

  const colorScale = metricColorScales[metric];

  return (
    <div className="space-y-6">
      {/* Heatmap Container */}
      <div className="card-elevated overflow-x-auto animate-slide-up">
        <div ref={containerRef} className="min-w-max" />
      </div>

      {/* Legend */}
      <div className="card-elevated animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{colorScale.name} Intensity</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {metric === 'weight' ? '210#' : 'Less'}
            </span>
            <div className="flex gap-1">
              {colorScale.range.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {metric === 'weight' ? '175#' : 'More'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
