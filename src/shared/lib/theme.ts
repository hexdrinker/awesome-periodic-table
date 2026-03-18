import { useEffect, useState } from 'react'
import { useAppStore } from '../model/app-store'
import type { ThemeMode } from '../model/app-store'

export type ResolvedTheme = 'light' | 'dark'

export const sceneThemePalettes: Record<
  ResolvedTheme,
  {
    background: string
    fog: string
    gridMajor: string
    gridMinor: string
    showStars: boolean
    ambient: number
    primaryDirectional: number
    secondaryDirectional: number
    primaryPoint: number
    secondaryPoint: number
    tertiaryPoint: number
    bloom: number
  }
> = {
  dark: {
    background: '#0b0e14',
    fog: '#0b0e14',
    gridMajor: '#1a2030',
    gridMinor: '#111620',
    showStars: true,
    ambient: 0.18,
    primaryDirectional: 0.85,
    secondaryDirectional: 0.32,
    primaryPoint: 1.15,
    secondaryPoint: 0.55,
    tertiaryPoint: 0.5,
    bloom: 1.2,
  },
  light: {
    background: '#eef4fb',
    fog: '#eef4fb',
    gridMajor: '#ced8e6',
    gridMinor: '#e1e8f2',
    showStars: false,
    ambient: 0.3,
    primaryDirectional: 0.7,
    secondaryDirectional: 0.24,
    primaryPoint: 0.82,
    secondaryPoint: 0.3,
    tertiaryPoint: 0.28,
    bloom: 0.75,
  },
}

function getSystemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return true
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function resolveTheme(theme: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (theme === 'system') {
    return prefersDark ? 'dark' : 'light'
  }

  return theme
}

export function useResolvedTheme() {
  const theme = useAppStore((state) => state.theme)
  const [prefersDark, setPrefersDark] = useState(getSystemPrefersDark)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setPrefersDark(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return resolveTheme(theme, prefersDark)
}
