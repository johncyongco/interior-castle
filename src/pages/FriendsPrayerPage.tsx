import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function FriendsPrayerPage() {
  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/Purgatory.png')] bg-cover"
        style={{ backgroundPosition: 'center center' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,220,170,0.18),transparent_35%),linear-gradient(180deg,rgba(18,13,11,0.20),rgba(18,13,11,0.78))]" />
      <div className="relative flex h-full flex-col px-6 py-10 pb-28 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex min-h-full flex-col"
        >
          <div className="flex items-center justify-between">
            <Link to="/community/friends-of-the-suffering" className="text-xs text-[#c6a47a] transition hover:text-[#e7cba9]">
              Back
            </Link>
          </div>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Prayer</p>
            <h1 className="serif text-2xl text-[#e7cba9]">The Importance of Praying for Souls</h1>
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
            <p className="text-sm leading-7 text-white/70">
              Praying for the dead is an act of mercy and communion. It entrusts the souls in purgatory to God’s
              purification and asks the Church to intercede for them with hope and charity.
            </p>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
