import { useEffect } from 'react'
import { CompoundDetailPage } from '@/pages/compound-detail'
import { CompoundsPage } from '@/pages/compounds'
import { ElementDetailPage } from '@/pages/element-detail'
import { HomePage } from '@/pages/home'
import { useAppStore, useResolvedTheme } from '@/shared'
import { useAppRoute } from '@/shared/lib/router'

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
    return <ElementDetailPage atomicNumber={route.atomicNumber} />
  }

  if (route.name === 'compounds') {
    return <CompoundsPage />
  }

  if (route.name === 'compound-detail') {
    return <CompoundDetailPage cid={route.cid} />
  }

  return <HomePage />
}
