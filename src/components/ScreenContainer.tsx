import type { ReactNode } from 'react'

export default function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <div className="vignette relative h-screen w-full overflow-hidden pb-20">
      {children}
    </div>
  )
}
