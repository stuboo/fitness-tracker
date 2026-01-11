export interface Entry {
  id: string;
  timestamp: string;
  date: string;
  weight: number;
  steps: number;
  clean_eating_score: number;
  protein_grams: number;
  protein_percentage: number;
  lifted_or_stretched: boolean;
  composite_score: number;
}

export interface EntryInput {
  weight: number;
  steps: number;
  clean_eating_score: number;
  protein_grams: number;
  lifted_or_stretched: boolean;
  date: string;
}

export type MetricType =
  | 'composite'
  | 'weight'
  | 'steps'
  | 'eating'
  | 'protein'
  | 'lift';

export interface APIResponse {
  success: boolean;
  entries?: Entry[];
  entry?: Entry;
  count?: number;
  version?: string;
  error?: string;
  details?: Record<string, string>;
}
