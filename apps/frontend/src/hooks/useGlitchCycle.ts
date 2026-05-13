import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

const GLITCH_CHARS = '█▓▒░▌▐▀▄■─━│┃-|=_'
const GLITCH_DURATION = 800
const HOLD_DURATION = 1400
const INITIAL_DELAY = 1500
const FULL_CHAOS_RATIO = 0.1
const UNSETTLED_GLITCH_PROB = 0.3
const SETTLED_FLICKER_PROB = 0.1

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

function scramble(target: string, settledIndices: Set<number>): string {
  return target
    .split('')
    .map((char, i) => {
      if (settledIndices.has(i)) {
        if (Math.random() < SETTLED_FLICKER_PROB) return randomChar()
        return char
      }
      if (char === ' ') return ' '
      // Keep the original letter most of the time; only occasionally corrupt with a block/dash
      if (Math.random() < UNSETTLED_GLITCH_PROB) return char
      return randomChar()
    })
    .join('')
}

export interface GlitchCycleState {
  displayText: string
  isGlitching: boolean
}

export function useGlitchCycle(words: string[]): GlitchCycleState {
  const prefersReducedMotion = useReducedMotion()
  const [state, setState] = useState<GlitchCycleState>({
    displayText: words[0] ?? '',
    isGlitching: false,
  })
  const rafRef = useRef<number | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const wordsKey = words.join('|')

  useEffect(() => {
    if (prefersReducedMotion || words.length < 2) {
      setState({ displayText: words[words.length - 1] ?? '', isGlitching: false })
      return
    }

    setState({ displayText: words[0] ?? '', isGlitching: false })

    function animateGlitch(target: string, onComplete: () => void): void {
      const start = performance.now()
      const indices = Array.from({ length: target.length }, (_, i) => i)
      const revealOrder = shuffle(indices)

      setState({ displayText: scramble(target, new Set()), isGlitching: true })

      function frame(): void {
        const elapsed = performance.now() - start
        const progress = Math.min(elapsed / GLITCH_DURATION, 1)
        const settleProgress = Math.max(0, (progress - FULL_CHAOS_RATIO) / (1 - FULL_CHAOS_RATIO))
        const numSettled = Math.floor(target.length * settleProgress)
        const settled = new Set(revealOrder.slice(0, numSettled))
        setState({ displayText: scramble(target, settled), isGlitching: true })

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(frame)
        } else {
          setState({ displayText: target, isGlitching: false })
          onComplete()
        }
      }

      rafRef.current = requestAnimationFrame(frame)
    }

    function runCycle(index: number): void {
      if (index >= words.length) return
      animateGlitch(words[index], () => {
        if (index < words.length - 1) {
          const t = setTimeout(() => runCycle(index + 1), HOLD_DURATION)
          timersRef.current.push(t)
        }
      })
    }

    const initial = setTimeout(() => runCycle(1), INITIAL_DELAY)
    timersRef.current.push(initial)

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsKey, prefersReducedMotion])

  return state
}
