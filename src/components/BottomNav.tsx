import { useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const nav = useNavigate()

  return (
    <div className="absolute bottom-3 left-1/2 z-30 grid w-[calc(100%-1.25rem)] max-w-[320px] -translate-x-1/2 grid-cols-5 gap-0.5 rounded-full border border-white/10 bg-black/25 px-1.5 py-1.5 backdrop-blur-md">
      <button className="rounded-full px-1 py-1 text-[9px] font-medium leading-none tracking-[0.08em] text-[#e7cba9]" onClick={() => nav('/gate')}>
        Gate
      </button>
      <button className="rounded-full px-1 py-1 text-[9px] font-medium leading-none tracking-[0.08em] text-[#e7cba9]" onClick={() => nav('/room')}>
        Room
      </button>
      <button className="rounded-full px-1 py-1 text-[9px] font-medium leading-none tracking-[0.08em] text-[#e7cba9]" onClick={() => nav('/prayer')}>
        Prayer
      </button>
      <button className="rounded-full px-1 py-1 text-[9px] font-medium leading-none tracking-[0.08em] text-[#e7cba9]" onClick={() => nav('/reflect')}>
        Reflect
      </button>
      <button className="rounded-full px-1 py-1 text-[9px] font-medium leading-none tracking-[0.08em] text-[#e7cba9]" onClick={() => nav('/community')}>
        Community
      </button>
    </div>
  )
}
