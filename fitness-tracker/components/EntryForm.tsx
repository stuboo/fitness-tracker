'use client';

import { useState, FormEvent } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
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
        weight: parseFloat(formData.weight),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-md mx-auto">
      {/* Weight Input */}
      <div>
        <label
          htmlFor="weight"
          className="block text-lg font-medium mb-2 text-gray-900"
        >
          Weight (lbs)
        </label>
        <input
          id="weight"
          type="number"
          step="0.1"
          value={formData.weight}
          onChange={(e) =>
            setFormData({ ...formData, weight: e.target.value })
          }
          className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Steps Input */}
      <div>
        <label
          htmlFor="steps"
          className="block text-lg font-medium mb-2 text-gray-900"
        >
          Steps
        </label>
        <input
          id="steps"
          type="number"
          value={formData.steps}
          onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
          className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Clean Eating Slider */}
      <div>
        <label
          htmlFor="clean_eating"
          className="block text-lg font-medium mb-2 text-gray-900"
        >
          Clean Eating: {formData.clean_eating_score}%
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
          className="w-full h-8"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Protein Input */}
      <div>
        <label
          htmlFor="protein"
          className="block text-lg font-medium mb-2 text-gray-900"
        >
          Protein (grams)
          {formData.protein_grams && (
            <span className="text-sm text-gray-600 ml-2">
              ({Math.round((parseInt(formData.protein_grams) / 180) * 100)}% of
              180g target)
            </span>
          )}
        </label>
        <input
          id="protein"
          type="number"
          value={formData.protein_grams}
          onChange={(e) =>
            setFormData({ ...formData, protein_grams: e.target.value })
          }
          className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Lift/Stretch Toggle */}
      <div>
        <label className="block text-lg font-medium mb-2 text-gray-900">
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
          className={`w-full h-14 rounded-lg text-lg font-medium transition-colors ${
            formData.lifted_or_stretched
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {formData.lifted_or_stretched ? '✓ Lifted/Stretched' : 'No Exercise'}
        </button>
      </div>

      {/* Date Input */}
      <div>
        <label
          htmlFor="date"
          className="block text-lg font-medium mb-2 text-gray-900"
        >
          Date
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          max={format(new Date(), 'yyyy-MM-dd')}
          className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Submitting...' : 'Log Entry'}
      </button>
    </form>
  );
}
