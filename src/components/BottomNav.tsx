import { useNavigate } from 'react-router-dom'

function NavIcon({
  path,
}: {
  path: 'gate' | 'room' | 'prayer' | 'reflect' | 'community'
}) {
  const common = {
    className: 'h-7 w-7 shrink-0',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (path) {
    case 'gate':
      return (
        <svg {...common}>
          <path d="M4 20V10h16v10" />
          <path d="M6 10V6h3v4" />
          <path d="M15 10V6h3v4" />
          <path d="M9 20v-5h6v5" />
          <path d="M7 20h10" />
        </svg>
      )
    case 'room':
      return (
        <svg {...common}>
          <path d="M4 12l8-6 8 6" />
          <path d="M6 10v8h12v-8" />
          <path d="M9 18v-4h6v4" />
        </svg>
      )
    case 'prayer':
      return (
        <svg {...common}>
          <path d="M12 4v16" />
          <path d="M8 8c0-2 1.8-4 4-4s4 2 4 4" />
          <path d="M8 12c0-2 1.8-4 4-4s4 2 4 4" />
          <path d="M6 16h12" />
        </svg>
      )
    case 'reflect':
      return (
        <svg {...common}>
          <path d="M12 4v3" />
          <path d="M12 17v3" />
          <path d="M4 12h3" />
          <path d="M17 12h3" />
          <path d="M7.5 7.5l2.1 2.1" />
          <path d="M14.4 14.4l2.1 2.1" />
          <path d="M16.5 7.5l-2.1 2.1" />
          <path d="M7.5 16.5l2.1-2.1" />
        </svg>
      )
    case 'community':
      return (
        <svg {...common}>
          <path d="M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M16 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M5 19c0-2.2 1.8-4 4-4" />
          <path d="M15 15c2.2 0 4 1.8 4 4" />
          <path d="M9 15h6" />
          <path d="M12 13c1.7 0 3 1.3 3 3v3H9v-3c0-1.7 1.3-3 3-3Z" />
        </svg>
      )
  }
}

export default function BottomNav() {
  const nav = useNavigate()

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 grid w-full grid-cols-5 justify-items-center gap-0.5 overflow-hidden border-t border-white/10 bg-black/32 px-2 py-2.5 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.22)]">
      <button
        className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]"
        onClick={() => nav('/gate')}
      >
        <span className="sm:hidden">
          <NavIcon path="gate" />
        </span>
        <span className="hidden sm:inline">Gate</span>
      </button>
      <button
        className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]"
        onClick={() => nav('/room')}
      >
        <span className="sm:hidden">
          <NavIcon path="room" />
        </span>
        <span className="hidden sm:inline">Room</span>
      </button>
      <button
        className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]"
        onClick={() => nav('/prayer')}
      >
        <span className="sm:hidden">
          <NavIcon path="prayer" />
        </span>
        <span className="hidden sm:inline">Prayer</span>
      </button>
      <button
        className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]"
        onClick={() => nav('/reflect')}
      >
        <span className="sm:hidden">
          <NavIcon path="reflect" />
        </span>
        <span className="hidden sm:inline">Reflect</span>
      </button>
      <button
        className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]"
        onClick={() => nav('/community')}
      >
        <span className="sm:hidden">
          <NavIcon path="community" />
        </span>
        <span className="hidden sm:inline">Community</span>
      </button>
    </div>
  )
}
