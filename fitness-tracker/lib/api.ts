import { Entry, APIResponse } from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch all entries from the API
 */
export async function fetchEntries(): Promise<Entry[]> {
  const response = await fetch(`${API_BASE_URL}/api/entries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Failed to fetch entries',
    }));
    throw new Error(error.error || 'Failed to fetch entries');
  }

  const data: APIResponse = await response.json();
  return data.entries || [];
}

/**
 * Submit a new entry to the API
 */
export async function submitEntry(
  entry: Omit<Entry, 'id' | 'timestamp'>
): Promise<Entry> {
  const response = await fetch(`${API_BASE_URL}/api/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    const error: APIResponse = await response.json().catch(() => ({
      success: false,
      error: 'Failed to submit entry',
    }));
    throw new Error(error.error || 'Failed to submit entry');
  }

  const data: APIResponse = await response.json();
  if (!data.entry) {
    throw new Error('Invalid response from server');
  }
  return data.entry;
}
