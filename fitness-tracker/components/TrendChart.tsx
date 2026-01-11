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
  Area,
  AreaChart,
} from 'recharts';
import { Entry, MetricType } from '@/lib/types';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Weight, Footprints, Apple, Drumstick, Dumbbell, Target } from 'lucide-react';

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
    composite: {
      name: 'Composite Score',
      color: '#5c7cfa',
      gradient: ['#5c7cfa', '#845ef7'],
      type: 'area',
      icon: Target
    },
    weight: {
      name: 'Weight',
      color: '#ff6b6b',
      gradient: ['#ff6b6b', '#ff8787'],
      type: 'line',
      icon: Weight
    },
    steps: {
      name: 'Steps',
      color: '#51cf66',
      gradient: ['#51cf66', '#20c997'],
      type: 'area',
      icon: Footprints
    },
    eating: {
      name: 'Clean Eating',
      color: '#ffa94d',
      gradient: ['#ffd43b', '#51cf66'],
      type: 'bar',
      icon: Apple
    },
    protein: {
      name: 'Protein',
      color: '#845ef7',
      gradient: ['#845ef7', '#cc5de8'],
      type: 'bar',
      icon: Drumstick
    },
    lift: {
      name: 'Exercise',
      color: '#20c997',
      gradient: ['#20c997', '#51cf66'],
      type: 'bar',
      icon: Dumbbell
    },
  };

  const config = metricConfig[metric];
  const Icon = config.icon;

  // Calculate trend
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  const previousValue = data.length > 1 ? data[data.length - 2].value : latestValue;
  const trend = latestValue > previousValue ? 'up' : latestValue < previousValue ? 'down' : 'flat';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="card-elevated animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})`,
            }}
          >
            <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{config.name}</h3>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
        </div>

        {/* Current Value Badge */}
        {latestValue > 0 && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-2xl font-bold font-mono" style={{ color: config.color }}>
              {formatValue(latestValue, metric)}
            </span>
            {trend !== 'flat' && (
              <span className={`flex items-center gap-1 text-xs font-semibold ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="w-3 h-3" />
                {Math.abs(((latestValue - previousValue) / previousValue) * 100).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        {config.type === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.gradient[0]} stopOpacity={1} />
                <stop offset="100%" stopColor={config.gradient[1]} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#e2e8f0"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#e2e8f0"
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: '12px 16px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return ['N/A', config.name];
                return [formatValue(value, metric), config.name];
              }}
            />
            <Bar
              dataKey="value"
              fill={`url(#gradient-${metric})`}
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        ) : config.type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.gradient[0]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={config.gradient[1]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#e2e8f0"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#e2e8f0"
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: config.color, strokeWidth: 2, strokeDasharray: '5 5' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: '12px 16px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return ['N/A', config.name];
                return [formatValue(value, metric), config.name];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={3}
              fill={`url(#gradient-${metric})`}
              dot={{ r: 4, fill: config.color, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#e2e8f0"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#e2e8f0"
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: config.color, strokeWidth: 2, strokeDasharray: '5 5' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: '12px 16px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return ['N/A', config.name];
                return [formatValue(value, metric), config.name];
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={3}
              dot={{ r: 4, fill: config.color, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        )}
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
