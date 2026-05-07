import { useFetch } from './useFetch';

export interface ProjectItem {
  id: string;
  order: number;
  title: string;
  description: { pt: string; en: string };
  techStack: string[];
  link: string;
}

const DATA_URL = '/data/projects.json';

export function useProjects() {
  const { data, loading, error } = useFetch<ProjectItem[]>(DATA_URL);
  return { projects: data ?? [], loading, error };
}
