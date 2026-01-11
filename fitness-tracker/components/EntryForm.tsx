'use client';

import { useState, FormEvent } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Weight, Footprints, Apple, Drumstick, Dumbbell, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { prepareEntryForSubmission } from '@/lib/calculations';
import { submitEntry } from '@/lib/api';

export default function EntryForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    steps: '',
    clean_eating_score: 75, // Default 75%
    protein_grams: '',
    lifted_or_stretched: false,
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const entry = prepareEntryForSubmission({
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        steps: parseInt(formData.steps),
        clean_eating_score: formData.clean_eating_score / 100,
        protein_grams: parseInt(formData.protein_grams),
        lifted_or_stretched: formData.lifted_or_stretched,
        date: formData.date,
      });

      await submitEntry(entry);

      toast.success('Entry logged successfully!', {
        duration: 3000,
        position: 'top-center',
      });

      // Reset form
      setFormData({
        weight: '',
        steps: '',
        clean_eating_score: 75,
        protein_grams: '',
        lifted_or_stretched: false,
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit entry',
        {
          duration: 4000,
          position: 'top-center',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getEatingColor = (score: number) => {
    if (score < 40) return 'var(--energy-coral)';
    if (score < 70) return 'var(--energy-amber)';
    return 'var(--health-mint)';
  };

  const proteinProgress = formData.protein_grams ? Math.min((parseInt(formData.protein_grams) / 180) * 100, 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="stagger-fade space-y-5 p-6 max-w-lg mx-auto">
      {/* Weight Input */}
      <div className="card-elevated">
        <label htmlFor="weight" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Weight className="w-4 h-4 text-[var(--energy-coral)]" />
          Weight
        </label>
        <div className="relative">
          <input
            id="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="w-full h-14 pl-4 pr-12 text-2xl font-mono font-semibold bg-white/50 border-2 border-gray-200 rounded-xl focus-glow transition-all duration-300"
            placeholder="0.0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">lbs</span>
        </div>
      </div>

      {/* Steps Input */}
      <div className="card-elevated">
        <label htmlFor="steps" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Footprints className="w-4 h-4 text-[var(--health-ocean)]" />
          Steps
        </label>
        <div className="relative">
          <input
            id="steps"
            type="number"
            value={formData.steps}
            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
            className="w-full h-14 pl-4 pr-4 text-2xl font-mono font-semibold bg-white/50 border-2 border-gray-200 rounded-xl focus-glow transition-all duration-300"
            placeholder="10000"
            required
          />
        </div>
      </div>

      {/* Clean Eating Slider */}
      <div className="card-elevated">
        <label htmlFor="clean_eating" className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Apple className="w-4 h-4 text-[var(--health-mint)]" />
            Clean Eating
          </span>
          <span
            className="text-2xl font-bold font-mono px-3 py-1 rounded-lg"
            style={{ color: getEatingColor(formData.clean_eating_score) }}
          >
            {formData.clean_eating_score}%
          </span>
        </label>
        <input
          id="clean_eating"
          type="range"
          min="0"
          max="100"
          value={formData.clean_eating_score}
          onChange={(e) =>
            setFormData({
              ...formData,
              clean_eating_score: parseInt(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      {/* Protein Input */}
      <div className="card-elevated">
        <label htmlFor="protein" className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Drumstick className="w-4 h-4 text-[var(--focus-violet)]" />
            Protein
          </span>
          {formData.protein_grams && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-violet-100 text-[var(--focus-violet)]">
              {Math.round(proteinProgress)}% of 180g
            </span>
          )}
        </label>
        <div className="relative">
          <input
            id="protein"
            type="number"
            value={formData.protein_grams}
            onChange={(e) => setFormData({ ...formData, protein_grams: e.target.value })}
            className="w-full h-14 pl-4 pr-12 text-2xl font-mono font-semibold bg-white/50 border-2 border-gray-200 rounded-xl focus-glow transition-all duration-300"
            placeholder="180"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">g</span>
        </div>
        {formData.protein_grams && (
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--focus-violet)] to-[var(--focus-grape)] transition-all duration-500 rounded-full"
              style={{ width: `${proteinProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Exercise Toggle */}
      <div className="card-elevated">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Dumbbell className="w-4 h-4 text-[var(--energy-amber)]" />
          Exercise
        </label>
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              lifted_or_stretched: !formData.lifted_or_stretched,
            })
          }
          className={`w-full h-14 rounded-xl text-base font-semibold transition-all duration-300 ${
            formData.lifted_or_stretched
              ? 'bg-gradient-to-r from-[var(--health-mint)] to-[var(--health-emerald)] text-white shadow-[var(--shadow-health)] scale-[1.02]'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {formData.lifted_or_stretched ? (
              <>
                <Sparkles className="w-5 h-5" />
                Lifted or Stretched
              </>
            ) : (
              'No Exercise Yet'
            )}
          </span>
        </button>
      </div>

      {/* Date Input */}
      <div className="card-elevated">
        <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <CalendarIcon className="w-4 h-4 text-[var(--focus-indigo)]" />
          Date
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          max={format(new Date(), 'yyyy-MM-dd')}
          className="w-full h-14 px-4 text-base font-medium bg-white/50 border-2 border-gray-200 rounded-xl focus-glow transition-all duration-300"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`btn-gradient w-full h-16 text-lg ${loading ? 'loading-shimmer' : ''}`}
      >
        <span className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Progress...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Log Today's Progress
            </>
          )}
        </span>
      </button>
    </form>
  );
}
