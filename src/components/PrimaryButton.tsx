import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function PrimaryButton({ children, className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white transition duration-500 ease-out hover:shadow-glow active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  )
}
