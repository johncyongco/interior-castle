import type { ReactNode } from 'react'

export default function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <div className="vignette relative mx-auto h-screen w-full max-w-[375px] overflow-hidden pb-24">
      {children}
    </div>
  )
}
