import { useState, useEffect } from 'react'

export function useTypewriter(text: string, delayMs = 50, startDelayMs = 0): string {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    const startTimer = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1))
        index++
        if (index >= text.length) {
          clearInterval(interval)
        }
      }, delayMs)

      return () => clearInterval(interval)
    }, startDelayMs)

    return () => clearTimeout(startTimer)
  }, [text, delayMs, startDelayMs])

  return displayedText
}
