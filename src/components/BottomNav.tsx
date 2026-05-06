import { useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const nav = useNavigate()

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 grid w-full grid-cols-5 justify-items-center gap-0.5 overflow-hidden border-t border-white/10 bg-black/32 px-2 py-2.5 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.22)]">
      <button className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/gate')}>
        Gate
      </button>
      <button className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/room')}>
        Room
      </button>
      <button className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/prayer')}>
        Prayer
      </button>
      <button className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/reflect')}>
        Reflect
      </button>
      <button className="flex w-full max-w-[72px] min-w-0 items-center justify-center rounded-[14px] px-0 py-2.5 text-center text-[11px] font-medium leading-none tracking-[0.02em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/community')}>
        Community
      </button>
    </div>
  )
}
