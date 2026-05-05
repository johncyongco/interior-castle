import type { ReactNode } from 'react'

export function SoftCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`glass-panel rounded-3xl p-5 ${className}`}>{children}</div>
}
