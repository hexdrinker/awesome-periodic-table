import { create } from 'zustand'
import type { Element } from '../data/elements'

type ControlMode = 'rotate' | 'orbit' | 'zoom-in' | 'zoom-out' | 'reset' | 'none'

interface StoreState {
  selectedElement: Element | null
  hoveredElement: Element | null
  controlMode: ControlMode
  autoRotate: boolean
  filterCategory: string | null
  setSelectedElement: (el: Element | null) => void
  setHoveredElement: (el: Element | null) => void
  setControlMode: (mode: ControlMode) => void
  setAutoRotate: (v: boolean) => void
  setFilterCategory: (cat: string | null) => void
}

export const useStore = create<StoreState>((set) => ({
  selectedElement: null,
  hoveredElement: null,
  controlMode: 'orbit',
  autoRotate: false,
  filterCategory: null,
  setSelectedElement: (el) => set({ selectedElement: el }),
  setHoveredElement: (el) => set({ hoveredElement: el }),
  setControlMode: (mode) => set({ controlMode: mode }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setFilterCategory: (cat) => set({ filterCategory: cat }),
}))
