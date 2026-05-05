import type { ReactNode } from 'react'

export default function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <div className="vignette relative mx-auto h-screen w-full max-w-[420px] overflow-hidden pb-20">
      {children}
    </div>
  )
}
