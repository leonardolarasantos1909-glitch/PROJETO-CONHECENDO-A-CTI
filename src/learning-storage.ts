import { PROFILE_KEY } from './learning-profile';
import { INTEGRATION_KEY } from './integration-checklist';

export const LAST_PAGE_KEY = 'cti-book-page-v1';

const LEARNING_KEYS = ['cti-first-day-v1', 'cti-favorites-v1', LAST_PAGE_KEY, 'cti-visited', PROFILE_KEY, INTEGRATION_KEY] as const;

/** Read only known identifiers; stored values never become labels, URLs or markup. */
export function readSavedIds(key: string, allowed: readonly string[]): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    if (!Array.isArray(value)) return [];
    const known = new Set(allowed);
    return [...new Set(value.filter((id): id is string => typeof id === 'string' && known.has(id)))];
  } catch {
    return [];
  }
}

/** The caller can keep in-memory state when the browser refuses persistence. */
export function writeSavedIds(key: string, ids: readonly string[]): boolean {
  try {
    const unique = [...new Set(ids.filter(id => typeof id === 'string' && id.length > 0))];
    localStorage.setItem(key, JSON.stringify(unique));
    return true;
  } catch {
    return false;
  }
}

export function readLastPage(pageCount: number): number {
  if (!Number.isSafeInteger(pageCount) || pageCount < 1) return 1;
  try {
    const value: unknown = JSON.parse(localStorage.getItem(LAST_PAGE_KEY) ?? 'null');
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= 1 && value <= pageCount ? value : 1;
  } catch {
    return 1;
  }
}

export function saveLastPage(page: number): boolean {
  if (!Number.isSafeInteger(page) || page < 1) return false;
  try {
    localStorage.setItem(LAST_PAGE_KEY, JSON.stringify(page));
    return true;
  } catch {
    return false;
  }
}

/** Remove only this app's learning progress, never other data on the origin. */
export function clearLearningStorage(): boolean {
  let cleared = true;
  for (const key of LEARNING_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      cleared = false;
    }
  }
  return cleared;
}
