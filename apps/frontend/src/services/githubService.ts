const REPO = 'samuelpanzera/site-pessoal';
const DATA_PATH = 'apps/frontend/public/data';
const CACHE_KEY = 'portfolio_last_updated';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  date: string;
  ts: number;
}

export async function fetchPortfolioLastUpdated(): Promise<Date | null> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.ts < CACHE_TTL_MS) return new Date(entry.date);
    }

    const res = await fetch(
      `https://api.github.com/repos/${REPO}/commits?path=${DATA_PATH}&per_page=1`
    );
    if (!res.ok) return null;

    const [commit] = await res.json();
    const date: string | undefined = commit?.commit?.committer?.date;
    if (!date) return null;

    localStorage.setItem(CACHE_KEY, JSON.stringify({ date, ts: Date.now() } satisfies CacheEntry));
    return new Date(date);
  } catch {
    return null;
  }
}
