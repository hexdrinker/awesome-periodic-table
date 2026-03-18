import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Element } from '../data/elements'

type ControlMode = 'rotate' | 'orbit' | 'zoom-in' | 'zoom-out' | 'reset' | 'none'
export type AppLanguage = 'en' | 'ko'
export type ThemeMode = 'system' | 'dark' | 'light'

interface StoreState {
  selectedElement: Element | null
  hoveredElement: Element | null
  controlMode: ControlMode
  autoRotate: boolean
  filterCategory: string | null
  language: AppLanguage
  theme: ThemeMode
  setSelectedElement: (el: Element | null) => void
  setHoveredElement: (el: Element | null) => void
  setControlMode: (mode: ControlMode) => void
  setAutoRotate: (v: boolean) => void
  setFilterCategory: (cat: string | null) => void
  setLanguage: (language: AppLanguage) => void
  setTheme: (theme: ThemeMode) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedElement: null,
      hoveredElement: null,
      controlMode: 'none',
      autoRotate: false,
      filterCategory: null,
      language: 'en',
      theme: 'system',
      setSelectedElement: (el) => set({ selectedElement: el }),
      setHoveredElement: (el) => set({ hoveredElement: el }),
      setControlMode: (mode) => set({ controlMode: mode }),
      setAutoRotate: (v) => set({ autoRotate: v }),
      setFilterCategory: (cat) => set({ filterCategory: cat }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'awesome-periodic-table-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    },
  ),
)
