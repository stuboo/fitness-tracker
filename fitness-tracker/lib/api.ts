import { Entry, APIResponse } from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('[API] Environment variable NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('[API] Using API_BASE_URL:', API_BASE_URL);

/**
 * Fetch all entries from the API
 */
export async function fetchEntries(): Promise<Entry[]> {
  const url = `${API_BASE_URL}/api/entries`;
  console.log('[API] Fetching entries from:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[API] Fetch response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: `Failed to fetch entries: ${response.status} ${response.statusText}` };
      }
      throw new Error(error.error || 'Failed to fetch entries');
    }

    const data: APIResponse = await response.json();
    console.log('[API] Fetch successful, entries:', data.entries?.length || 0);
    return data.entries || [];
  } catch (error) {
    console.error('[API] Fetch error:', error);
    throw error;
  }
}

/**
 * Submit a new entry to the API
 */
export async function submitEntry(
  entry: Omit<Entry, 'id' | 'timestamp'>
): Promise<Entry> {
  const url = `${API_BASE_URL}/api/entries`;
  console.log('[API] Submitting entry to:', url);
  console.log('[API] Request body:', JSON.stringify(entry, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    console.log('[API] Submit response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Submit failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      let error: APIResponse;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = {
          success: false,
          error: `Failed to submit entry: ${response.status} ${response.statusText}`,
        };
      }
      throw new Error(error.error || 'Failed to submit entry');
    }

    const responseText = await response.text();
    console.log('[API] Submit response body:', responseText);

    let data: APIResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[API] Failed to parse response:', parseError);
      throw new Error('Invalid JSON response from server');
    }

    if (!data.entry) {
      console.error('[API] Response missing entry:', data);
      throw new Error('Invalid response from server - no entry returned');
    }

    console.log('[API] Submit successful:', data.entry);
    return data.entry;
  } catch (error) {
    console.error('[API] Submit error:', error);
    throw error;
  }
}
