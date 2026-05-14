import { useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function GuardianAngelPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,244,220,0.08),transparent_28%),linear-gradient(180deg,rgba(18,14,11,0.24),rgba(0,0,0,0.8))]" />
      <div className="relative flex h-full flex-col px-6 py-10">
        <button
          type="button"
          onClick={() => { try { window.sessionStorage.setItem('spero-room-entry', 'door') } catch {}; navigate('/room') }}
          className="self-start text-xs text-[#c6a47a] transition hover:text-[#e7cba9]"
        >
          Back to Room
        </button>
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-md rounded-3xl border border-white/10 bg-black/35 px-6 py-7 text-center text-white/85 backdrop-blur-xl">
            <p className="serif text-lg leading-8 sm:text-xl">
              Angel of God, my guardian dear,
              <br />
              to whom God&apos;s love commits me here,
              <br />
              ever this day be at my side,
              <br />
              to light and guard, to rule and guide.
              <br />
              <br />
              Amen.
            </p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  )
}
