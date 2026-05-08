import { useEffect, useState } from 'react';
import { fetchPortfolioLastUpdated } from '../services/githubService';

export function usePortfolioLastUpdated() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchPortfolioLastUpdated().then(setDate);
  }, []);

  return date;
}
