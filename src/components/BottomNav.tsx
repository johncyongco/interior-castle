import { useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const nav = useNavigate()

  return (
    <div className="absolute bottom-4 left-1/2 z-30 grid w-[calc(100%-1rem)] max-w-[372px] -translate-x-1/2 grid-cols-5 gap-1 rounded-[24px] border border-white/10 bg-black/35 px-3 py-3.5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <button className="rounded-[18px] px-2 py-3 text-[13px] font-medium leading-none tracking-[0.06em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/gate')}>
        Gate
      </button>
      <button className="rounded-[18px] px-2 py-3 text-[13px] font-medium leading-none tracking-[0.06em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/room')}>
        Room
      </button>
      <button className="rounded-[18px] px-2 py-3 text-[13px] font-medium leading-none tracking-[0.06em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/prayer')}>
        Prayer
      </button>
      <button className="rounded-[18px] px-2 py-3 text-[13px] font-medium leading-none tracking-[0.06em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/reflect')}>
        Reflect
      </button>
      <button className="rounded-[18px] px-2 py-3 text-[13px] font-medium leading-none tracking-[0.06em] text-[#e7cba9] transition active:scale-[0.98]" onClick={() => nav('/community')}>
        Community
      </button>
    </div>
  )
}
