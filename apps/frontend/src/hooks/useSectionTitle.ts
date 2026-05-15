import { useEffect } from 'react'

const SECTION_TITLES: Record<string, string> = {
  hero: 'Samuel Panzera | Backend Developer',
  techstack: 'Samuel Panzera | Tech Stack',
  projetos: 'Samuel Panzera | Projects',
  experience: 'Samuel Panzera | Experience',
  pdi: 'Samuel Panzera | PDI',
}

export function useSectionTitle() {
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    Object.entries(SECTION_TITLES).forEach(([id, title]) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) document.title = title
        },
        { threshold: 0.4 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [])
}
