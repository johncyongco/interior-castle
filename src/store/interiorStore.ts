import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type InteriorState = 'restless' | 'distracted' | 'tempted' | 'numb' | 'peaceful'

interface Store {
  state: InteriorState
  mood: InteriorState
  depth: number
  temptationStep: number
  setState: (s: InteriorState) => void
  setMood: (s: InteriorState) => void
  increaseDepth: () => void
  setTemptationStep: (step: number) => void
}

export const useInteriorStore = create<Store>()(
  persist(
    (set) => ({
      state: 'restless',
      mood: 'restless',
      depth: 1,
      temptationStep: 0,
      setState: (s) => set({ state: s, mood: s }),
      setMood: (s) => set({ state: s, mood: s }),
      increaseDepth: () => set((prev) => ({ depth: prev.depth + 1 })),
      setTemptationStep: (step) => set({ temptationStep: step }),
    }),
    {
      name: 'spero-interior',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        state: state.state,
        mood: state.mood,
        depth: state.depth,
        temptationStep: state.temptationStep,
      }),
    },
  ),
)

export function getGuidanceLevel(depth: number) {
  if (depth < 3) return 'guided'
  if (depth < 7) return 'semi'
  return 'silent'
}
