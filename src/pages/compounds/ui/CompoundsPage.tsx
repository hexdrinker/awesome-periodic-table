import { useEffect, type CSSProperties } from 'react'
import { CompoundExplorer } from '@/features/compound-explorer'
import { Navbar } from '@/features/preferences'
import {
  sceneThemePalettes,
  useAppStore,
  useResolvedTheme,
} from '@/shared'

export function CompoundsPage() {
  const setSelectedElement = useAppStore((state) => state.setSelectedElement)
  const setHoveredElement = useAppStore((state) => state.setHoveredElement)
  const resolvedTheme = useResolvedTheme()
  const palette = sceneThemePalettes[resolvedTheme]

  useEffect(() => {
    setSelectedElement(null)
    setHoveredElement(null)
  }, [setHoveredElement, setSelectedElement])

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const appRoot = document.getElementById('root')
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = body.style.overflow
    const previousRootHeight = root.style.height
    const previousBodyHeight = body.style.height
    const previousAppRootOverflow = appRoot?.style.overflow ?? ''
    const previousAppRootHeight = appRoot?.style.height ?? ''

    root.style.overflow = 'auto'
    body.style.overflow = 'auto'
    root.style.height = 'auto'
    body.style.height = 'auto'
    if (appRoot) {
      appRoot.style.overflow = 'visible'
      appRoot.style.height = 'auto'
    }

    return () => {
      root.style.overflow = previousRootOverflow
      body.style.overflow = previousBodyOverflow
      root.style.height = previousRootHeight
      body.style.height = previousBodyHeight
      if (appRoot) {
        appRoot.style.overflow = previousAppRootOverflow
        appRoot.style.height = previousAppRootHeight
      }
    }
  }, [])

  return (
    <div
      className="min-h-screen"
      style={
        {
          background: `
            radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 30%),
            radial-gradient(circle at 82% 12%, color-mix(in srgb, #ff59e3 14%, transparent), transparent 24%),
            ${palette.background}
          `,
        } as CSSProperties
      }
    >
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-24 md:px-8 md:pb-14">
        <CompoundExplorer />
      </div>
    </div>
  )
}
