import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
}

export default function ChoiceButton({ label, className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left text-white/95 backdrop-blur-md transition hover:bg-white/10 ${className}`}
    >
      {label}
    </button>
  )
}
