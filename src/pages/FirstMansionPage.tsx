import ScreenContainer from '../components/ScreenContainer'

export default function FirstMansionPage() {
  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 bg-[url('/1st%20Mansion.jpg')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundPosition: 'center center' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,244,220,0.1),transparent_28%),linear-gradient(180deg,rgba(12,10,8,0.08),rgba(12,10,8,0.45))]" />
      <div className="relative flex h-full items-end justify-center pb-[max(2rem,env(safe-area-inset-bottom))]">
        <p className="serif text-xs text-[#e7cba9]/55 sm:text-sm">You are in the 1st Mansion</p>
      </div>
    </ScreenContainer>
  )
}
