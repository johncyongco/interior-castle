import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

const cards = [
  {
    description: 'Importance of prayer for the holy souls.',
    href: '/community/friends-of-the-suffering/prayer',
    title: 'The Importance of Praying for Souls',
  },
  {
    description: 'Add and remember names to pray for every day.',
    href: '/community/friends-of-the-suffering/souls',
    title: 'Souls',
  },
  {
    description: 'Learn about FOSS and how to join the mission.',
    href: '/community/friends-of-the-suffering/foss',
    title: 'Become Friends of the Suffering',
  },
] as const

export default function FriendsOfTheSufferingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const backToCommunity = location.state?.from === 'room' ? '/room' : '/community'
  const origin = location.state?.from ?? 'community'

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
            <Link to={backToCommunity} className="text-xs text-[#c6a47a] transition hover:text-[#e7cba9]">
              Back
            </Link>
          </div>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Friends of the Suffering</p>
            <h1 className="serif text-2xl text-[#e7cba9]">Choose a Card</h1>
          </div>

          <div className="mt-5 space-y-3">
            {cards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => navigate(card.href, { state: { from: origin } })}
                className="block rounded-3xl border border-white/10 bg-white/[0.05] p-5 text-left backdrop-blur-xl shadow-soft transition hover:bg-white/[0.08]"
              >
                <h2 className="serif text-xl text-[#e7cba9]">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">{card.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
