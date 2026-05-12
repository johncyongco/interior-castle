import { useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function BreakfastPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 bg-[url('/Breakfast.png')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundPosition: 'center center' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,244,220,0.1),transparent_28%),linear-gradient(180deg,rgba(12,10,8,0.08),rgba(12,10,8,0.45))]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <p className="serif absolute top-6 text-xs text-[#e7cba9]/55 sm:text-sm">Breakfast</p>
        <button
          type="button"
          onClick={() => navigate('/room')}
          className="mt-10 w-full max-w-xs rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.1)] transition hover:bg-white/[0.1]"
        >
          Back to Room
        </button>
      </div>
    </ScreenContainer>
  )
}
