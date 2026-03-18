import { Suspense, lazy, useEffect } from 'react'
import { sceneThemePalettes, translations, useAppStore, useResolvedTheme } from '@/shared'
import { useAppRoute } from '@/shared/lib/router'

const HomePage = lazy(async () => {
  const module = await import('@/pages/home')
  return { default: module.HomePage }
})

const ElementDetailPage = lazy(async () => {
  const module = await import('@/pages/element-detail')
  return { default: module.ElementDetailPage }
})

const CompoundsPage = lazy(async () => {
  const module = await import('@/pages/compounds')
  return { default: module.CompoundsPage }
})

const CompoundDetailPage = lazy(async () => {
  const module = await import('@/pages/compound-detail')
  return { default: module.CompoundDetailPage }
})

function AppLoadingFallback() {
  const language = useAppStore((state) => state.language)
  const resolvedTheme = useResolvedTheme()
  const palette = sceneThemePalettes[resolvedTheme]
  const copy = translations[language]

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: palette.background }}
    >
      <div
        className="font-inter tracking-widest"
        style={{ fontSize: '12px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}
      >
        {copy.loading.subtitle}
      </div>
    </div>
  )
}

export default function App() {
  const route = useAppRoute()
  const language = useAppStore((state) => state.language)
  const resolvedTheme = useResolvedTheme()

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.lang = language
    document.documentElement.style.colorScheme = resolvedTheme
  }, [language, resolvedTheme])

  if (route.name === 'element-detail') {
    return (
      <Suspense fallback={<AppLoadingFallback />}>
        <ElementDetailPage atomicNumber={route.atomicNumber} />
      </Suspense>
    )
  }

  if (route.name === 'compounds') {
    return (
      <Suspense fallback={<AppLoadingFallback />}>
        <CompoundsPage />
      </Suspense>
    )
  }

  if (route.name === 'compound-detail') {
    return (
      <Suspense fallback={<AppLoadingFallback />}>
        <CompoundDetailPage cid={route.cid} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<AppLoadingFallback />}>
      <HomePage />
    </Suspense>
  )
}
