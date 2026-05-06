import { useNavigate } from 'react-router-dom'
import ScreenContainer from './ScreenContainer'

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_45%),linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.5))]">
        <div
          className="absolute inset-0 bg-[url('/cathedral.png')] bg-cover opacity-30"
          style={{ backgroundPosition: 'center 18%' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0f0c09] via-[#0f0c09]/75 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="space-y-4">
          <p className="mx-auto max-w-[240px] text-sm text-[#c6a47a]">
            He is already there.
          </p>
        </div>

        <button
          className="mt-10 w-full rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.1)] transition hover:bg-white/[0.1]"
          onClick={() => nav('/gate')}
        >
          Enter
        </button>
      </div>
    </ScreenContainer>
  )
}
