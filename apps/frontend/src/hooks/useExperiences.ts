import { useFetch } from './useFetch';

export interface ExperienceItem {
  id: string;
  order: number;
  company: string;
  logo?: string;
  linkedinUrl?: string;
  role: { pt: string; en: string };
  period: { start: string; end: string | null };
  description: { pt: string; en: string };
}

const DATA_URL = '/data/experiences.json';

export function useExperiences() {
  const { data, loading, error } = useFetch<ExperienceItem[]>(DATA_URL);
  return { experiences: data ?? [], loading, error };
}
