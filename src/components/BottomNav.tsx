import { useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const nav = useNavigate()

  return (
    <div className="absolute bottom-0 left-1/2 z-30 flex w-full max-w-[420px] -translate-x-1/2 justify-around bg-black/20 px-2 py-3 backdrop-blur-md">
      <button className="text-sm text-[#e7cba9]" onClick={() => nav('/gate')}>
        Gate
      </button>
      <button className="text-sm text-[#e7cba9]" onClick={() => nav('/room')}>
        Room
      </button>
      <button className="text-sm text-[#e7cba9]" onClick={() => nav('/prayer')}>
        Prayer
      </button>
      <button className="text-sm text-[#e7cba9]" onClick={() => nav('/reflect')}>
        Reflect
      </button>
      <button className="text-sm text-[#e7cba9]" onClick={() => nav('/community')}>
        Community
      </button>
    </div>
  )
}
