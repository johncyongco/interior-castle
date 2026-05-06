import { motion } from 'framer-motion'
import ScreenContainer from '../components/ScreenContainer'
import { SoftCard } from '../components/SoftCard'
import { PrimaryButton } from '../components/PrimaryButton'
import { useInteriorStore } from '../store/interiorStore'

export default function SaintsPage() {
  const increaseDepth = useInteriorStore((store) => store.increaseDepth)

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/saint-teresa.png')] bg-cover opacity-12"
        style={{ backgroundPosition: 'center 20%' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,236,199,0.12),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.02),rgba(15,12,9,0.54))]" />
      <div className="relative flex h-full flex-col justify-end px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Saints</p>
            <h1 className="serif text-3xl tracking-wide text-[#e7cba9]">St. Teresa of Ávila</h1>
          </div>

          <SoftCard className="space-y-4 bg-black/20">
            <blockquote className="serif text-xl leading-snug text-white/95">
              Do not let anything disturb you. Let nothing frighten you. All things are passing. God never changes.
            </blockquote>
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-white">Invitation</h2>
              <p className="text-sm leading-6 text-white/70">Return to the center where He awaits you.</p>
            </div>
            <PrimaryButton
              onClick={() => increaseDepth()}
              className="w-full"
            >
              Learn More
            </PrimaryButton>
          </SoftCard>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
