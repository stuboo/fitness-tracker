import { Entry, EntryInput } from './types';

/**
 * Calculate protein percentage based on 180g target
 */
export function calculateProteinPercentage(proteinGrams: number): number {
  return proteinGrams / 180;
}

/**
 * Calculate composite score from normalized metrics
 * Average of: steps/8000, clean_eating_score, protein/180, lifted (0 or 1)
 * Capped at 1.0
 */
export function calculateCompositeScore(
  steps: number,
  cleanEatingScore: number,
  proteinGrams: number,
  liftedOrStretched: boolean
): number {
  const stepsNormalized = steps / 8000;
  const proteinNormalized = proteinGrams / 180;
  const liftNormalized = liftedOrStretched ? 1 : 0;

  const score =
    (stepsNormalized + cleanEatingScore + proteinNormalized + liftNormalized) /
    4;

  return Math.min(score, 1.0);
}

/**
 * Prepare an entry for submission by calculating derived fields
 */
export function prepareEntryForSubmission(
  input: EntryInput
): Omit<Entry, 'id' | 'timestamp'> {
  const proteinPercentage = calculateProteinPercentage(input.protein_grams);
  const compositeScore = calculateCompositeScore(
    input.steps,
    input.clean_eating_score,
    input.protein_grams,
    input.lifted_or_stretched
  );

  return {
    ...input,
    protein_percentage: proteinPercentage,
    composite_score: compositeScore,
    id: '', // Set by backend
    timestamp: '', // Set by backend
  };
}
