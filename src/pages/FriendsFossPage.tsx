import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'

export default function FriendsFossPage() {
  const location = useLocation()
  const cameFromRoom = location.state?.from === 'room' || window.sessionStorage.getItem('spero-room-entry') === 'door'
  const backTo = cameFromRoom ? '/room' : '/community/friends-of-the-suffering'

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
            <Link to={backTo} className="text-xs text-[#c6a47a] transition hover:text-[#e7cba9]">
              Back
            </Link>
          </div>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Become Friends of the Suffering</p>
            <h1 className="serif text-2xl text-[#e7cba9]">Friends of the Suffering Souls</h1>
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
            <p className="text-sm leading-7 text-white/70">
              A Catholic lay association conducting a perpetual novena of Masses for the Holy Souls in Purgatory.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              FOSS began in devotion to Our Lady of Knock, and its perpetual novena offers Masses for the Holy Souls
              while also promising remembrance after death and a way to surround loved ones with heavenly intercessors.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Members arrange one Mass each year for the intention, “For the Holy Souls in Purgatory, especially the
              deceased members of FOSS.” Additional enrollments can be made for family and friends, with the same Mass
              intention offered in confidence for their spiritual good.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              At present, members in 50 countries offer more than 35,000 Masses each year for this intention. If you
              love the Holy Souls and want prayer for yourself and your loved ones, join them at{' '}
              <a
                href="https://fossnovena.org/"
                target="_blank"
                rel="noreferrer"
                className="text-[#e7cba9] underline decoration-white/25 underline-offset-4 transition hover:decoration-white/60"
              >
                fossnovena.org
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
