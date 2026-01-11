'use client';

import { useState, useEffect } from 'react';
import { Entry } from '@/lib/types';
import { fetchEntries } from '@/lib/api';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await fetchEntries();
        // Sort by date descending (most recent first)
        const sorted = data.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entries');
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEntries();
      const sorted = data.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEntries(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  return { entries, loading, error, refresh };
}
