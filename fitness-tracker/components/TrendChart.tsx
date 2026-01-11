'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Entry, MetricType } from '@/lib/types';
import { format } from 'date-fns';

interface TrendChartProps {
  entries: Entry[];
  metric: MetricType;
}

export default function TrendChart({ entries, metric }: TrendChartProps) {
  const data = entries
    .slice()
    .reverse() // Reverse to show chronological order (oldest to newest)
    .map((entry) => ({
      date: format(new Date(entry.date), 'MMM d'),
      value: getMetricValue(entry, metric),
      fullDate: entry.date,
    }));

  const metricConfig = {
    composite: { name: 'Composite Score', color: '#3b82f6', type: 'bar' },
    weight: { name: 'Weight (lbs)', color: '#ef4444', type: 'line' },
    steps: { name: 'Steps', color: '#10b981', type: 'line' },
    eating: { name: 'Clean Eating %', color: '#f59e0b', type: 'bar' },
    protein: { name: 'Protein %', color: '#8b5cf6', type: 'bar' },
    lift: { name: 'Exercise', color: '#ec4899', type: 'bar' },
  };

  const config = metricConfig[metric];
  const ChartComponent = config.type === 'bar' ? BarChart : LineChart;

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">{config.name}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number) => [
              formatValue(value, metric),
              config.name,
            ]}
          />
          {config.type === 'bar' ? (
            <Bar dataKey="value" fill={config.color} radius={[4, 4, 0, 0]} />
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

function getMetricValue(entry: Entry, metric: MetricType): number {
  switch (metric) {
    case 'composite':
      return entry.composite_score;
    case 'weight':
      return entry.weight;
    case 'steps':
      return entry.steps;
    case 'eating':
      return entry.clean_eating_score;
    case 'protein':
      return entry.protein_percentage;
    case 'lift':
      return entry.lifted_or_stretched ? 1 : 0;
  }
}

function formatValue(value: number, metric: MetricType): string {
  switch (metric) {
    case 'composite':
    case 'eating':
    case 'protein':
      return `${Math.round(value * 100)}%`;
    case 'weight':
      return `${value.toFixed(1)} lbs`;
    case 'steps':
      return value.toLocaleString();
    case 'lift':
      return value === 1 ? 'Yes' : 'No';
  }
}
