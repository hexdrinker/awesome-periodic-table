import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Element, ElementCategory } from '../../entities/element/model/elements'
import type { PhysicalState } from '../../entities/element/model/physical-state'
import { DEFAULT_FILTER_TEMPERATURE_K } from '../../entities/element/model/physical-state'

export type ControlMode = 'rotate' | 'orbit' | 'zoom-in' | 'zoom-out' | 'reset' | 'none'
export type AppLanguage = 'en' | 'ko'
export type ThemeMode = 'system' | 'dark' | 'light'

interface StoreState {
  selectedElement: Element | null
  hoveredElement: Element | null
  controlMode: ControlMode
  autoRotate: boolean
  filterCategory: ElementCategory | null
  filterStates: PhysicalState[]
  filterTemperature: number
  language: AppLanguage
  theme: ThemeMode
  setSelectedElement: (el: Element | null) => void
  setHoveredElement: (el: Element | null) => void
  setControlMode: (mode: ControlMode) => void
  setAutoRotate: (v: boolean) => void
  setFilterCategory: (cat: ElementCategory | null) => void
  toggleFilterState: (state: PhysicalState) => void
  clearFilterStates: () => void
  setFilterTemperature: (temperature: number) => void
  clearFilters: () => void
  setLanguage: (language: AppLanguage) => void
  setTheme: (theme: ThemeMode) => void
}

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedElement: null,
      hoveredElement: null,
      controlMode: 'none',
      autoRotate: false,
      filterCategory: null,
      filterStates: [],
      filterTemperature: DEFAULT_FILTER_TEMPERATURE_K,
      language: 'en',
      theme: 'system',
      setSelectedElement: (el) => set({ selectedElement: el }),
      setHoveredElement: (el) => set({ hoveredElement: el }),
      setControlMode: (mode) => set({ controlMode: mode }),
      setAutoRotate: (v) => set({ autoRotate: v }),
      setFilterCategory: (cat) => set({ filterCategory: cat }),
      toggleFilterState: (state) =>
        set((current) => ({
          filterStates: current.filterStates.includes(state)
            ? current.filterStates.filter((entry) => entry !== state)
            : [...current.filterStates, state],
        })),
      clearFilterStates: () => set({ filterStates: [] }),
      setFilterTemperature: (temperature) => set({ filterTemperature: temperature }),
      clearFilters: () =>
        set({
          filterCategory: null,
          filterStates: [],
          filterTemperature: DEFAULT_FILTER_TEMPERATURE_K,
        }),
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
