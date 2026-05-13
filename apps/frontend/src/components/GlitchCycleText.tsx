import React from 'react'
import { motion } from 'motion/react'
import { useGlitchCycle } from '../hooks/useGlitchCycle'

interface GlitchCycleTextProps {
  words: string[]
}

const GLITCH_TRANSITION = { duration: 0.8, ease: 'linear' as const }
// Strike bars stay invisible until ~45% of the glitch progresses
const STRIKE_TIMES = [0, 0.4, 0.5, 0.6, 0.7, 0.85, 1]
const STRIKE_TRANSITION = {
  duration: 0.8,
  ease: 'linear' as const,
  times: STRIKE_TIMES,
}

const GlitchCycleText: React.FC<GlitchCycleTextProps> = ({ words }) => {
  const { displayText, isGlitching } = useGlitchCycle(words)

  return (
    <span className="relative inline-block align-baseline">
      {/* Red channel (chromatic aberration) — stronger offsets */}
      <motion.span
        aria-hidden
        className="absolute inset-0 pointer-events-none text-[#ff003c] mix-blend-screen"
        animate={
          isGlitching
            ? {
                x: [0, -8, 6, -10, 5, -3, 7, 0],
                y: [0, 2, -2, 3, -1, 1, 0],
                opacity: [0, 1, 0.7, 1, 0.6, 0.9, 0.8, 0],
              }
            : { x: 0, y: 0, opacity: 0 }
        }
        transition={GLITCH_TRANSITION}
      >
        {displayText}
      </motion.span>

      {/* Cyan channel (chromatic aberration) — stronger offsets */}
      <motion.span
        aria-hidden
        className="absolute inset-0 pointer-events-none text-[#00fff5] mix-blend-screen"
        animate={
          isGlitching
            ? {
                x: [0, 8, -6, 10, -5, 3, -7, 0],
                y: [0, -2, 2, -3, 1, -1, 0],
                opacity: [0, 1, 0.7, 1, 0.6, 0.9, 0.8, 0],
              }
            : { x: 0, y: 0, opacity: 0 }
        }
        transition={GLITCH_TRANSITION}
      >
        {displayText}
      </motion.span>

      {/* Main text layer — heavier jitter, skew, contrast pulses */}
      <motion.span
        className="relative inline-block"
        animate={
          isGlitching
            ? {
                x: [0, -4, 3, -6, 4, -2, 5, 0],
                skewX: [0, -9, 6, -4, 8, -3, 0],
                filter: [
                  'brightness(1) contrast(1)',
                  'brightness(1.7) contrast(1.5)',
                  'brightness(0.7) contrast(1.3)',
                  'brightness(2) contrast(1.6)',
                  'brightness(1.1) contrast(1.4)',
                  'brightness(1.5) contrast(1.2)',
                  'brightness(1) contrast(1)',
                ],
              }
            : { x: 0, skewX: 0, filter: 'brightness(1) contrast(1)' }
        }
        transition={GLITCH_TRANSITION}
      >
        {displayText}
      </motion.span>

      {/* Strike bars — weaker, appear only mid-glitch (not from the start) */}
      <motion.span
        aria-hidden
        className="absolute left-0 right-0 h-[2px] bg-white pointer-events-none origin-left"
        style={{ top: '48%' }}
        animate={
          isGlitching
            ? {
                scaleX: [0, 0, 1, 0.4, 0.9, 0.2, 0],
                opacity: [0, 0, 0.45, 0.2, 0.35, 0.15, 0],
                x: [0, 0, 2, -2, 1, 0, 0],
              }
            : { scaleX: 0, opacity: 0 }
        }
        transition={STRIKE_TRANSITION}
      />
      <motion.span
        aria-hidden
        className="absolute left-0 right-0 h-[1px] bg-primary pointer-events-none origin-right"
        style={{ top: '62%' }}
        animate={
          isGlitching
            ? {
                scaleX: [0, 0, 0.6, 1, 0.3, 0.8, 0],
                opacity: [0, 0, 0.3, 0.5, 0.2, 0.4, 0],
                x: [0, 0, -2, 1, -1, 0, 0],
              }
            : { scaleX: 0, opacity: 0 }
        }
        transition={STRIKE_TRANSITION}
      />
    </span>
  )
}

export default GlitchCycleText
