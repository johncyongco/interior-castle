import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type VirtueCard = {
  title: string
  description: string
  phase: string
}

const sections: { heading: string; cards: VirtueCard[] }[] = [
  {
    heading: 'Foundation',
    cards: [
      {
        title: 'Humility',
        phase: 'The ground',
        description: 'Standing in truth before God, without self-importance, so the interior life can actually stand.',
      },
      {
        title: 'Love',
        phase: 'The heart',
        description: 'Choosing God first and letting that choice spill over into patient, costly love for others.',
      },
      {
        title: 'Detachment',
        phase: 'Freedom',
        description: 'Holding comforts loosely so the soul has room to receive what God gives.',
      },
      {
        title: 'Obedience',
        phase: 'Alignment',
        description: 'Trusting God’s will over private preference, even when the path is not the one you would pick.',
      },
    ],
  },
  {
    heading: 'Early Mansions',
    cards: [
      {
        title: 'Conversion',
        phase: 'Turning back',
        description: 'A serious break with sin and a real return toward God, not a half-step or a mood.',
      },
      {
        title: 'Perseverance',
        phase: 'Keep walking',
        description: 'Remaining faithful through dryness, setbacks, and days when prayer feels ordinary.',
      },
      {
        title: 'Prayer Discipline',
        phase: 'Daily fidelity',
        description: 'Keeping a steady habit of prayer so the soul learns to stay present instead of drifting.',
      },
      {
        title: 'Self-Knowledge',
        phase: 'Seeing clearly',
        description: 'Facing your weakness honestly so grace can heal what pride tries to hide.',
      },
      {
        title: 'Fear of Offending God',
        phase: 'Reverence',
        description: 'A loving sensitivity to sin that protects the heart from carelessness.',
      },
      {
        title: 'Moral Integrity',
        phase: 'Order',
        description: 'A life shaped by honesty, restraint, and small acts of fidelity that guard the larger path.',
      },
    ],
  },
  {
    heading: 'Middle Mansions',
    cards: [
      {
        title: 'Recollection',
        phase: 'Turning inward',
        description: 'Gathering the mind and heart back to God within, away from constant scattering.',
      },
      {
        title: 'Trust',
        phase: 'Receiving',
        description: 'Letting God lead prayer instead of controlling every movement of it.',
      },
      {
        title: 'Interior Silence',
        phase: 'Quiet',
        description: 'Allowing the noise to settle so love can speak more deeply than thought.',
      },
      {
        title: 'Generosity',
        phase: 'Self-gift',
        description: 'Offering will, plans, and preferences without bargaining with God.',
      },
      {
        title: 'Purity of Intention',
        phase: 'For God alone',
        description: 'Doing what is right without needing applause, comfort, or spiritual display.',
      },
    ],
  },
  {
    heading: 'Advanced Mansions',
    cards: [
      {
        title: 'Total Surrender',
        phase: 'Open hands',
        description: 'A heart that is ready for God to do whatever He wills with it.',
      },
      {
        title: 'Redemptive Suffering',
        phase: 'Union with Christ',
        description: 'Accepting trials as a place where love becomes more like the Cross.',
      },
      {
        title: 'Courage',
        phase: 'Steadfastness',
        description: 'Remaining open in the middle of dryness, wounds, and spiritual pressure.',
      },
      {
        title: 'Complete Detachment',
        phase: 'Empty space',
        description: 'Releasing even the subtler cravings for recognition, control, and consolations.',
      },
      {
        title: 'Union of Will',
        phase: 'One desire',
        description: 'Wanting what God wants until the soul’s consent becomes simple and deep.',
      },
    ],
  },
  {
    heading: 'Mature Life',
    cards: [
      {
        title: 'Self-Forgetfulness',
        phase: 'Less ego',
        description: 'Living without constantly circling back to self-protection and self-display.',
      },
      {
        title: 'Awareness of God',
        phase: 'Presence',
        description: 'Carrying God quietly through ordinary moments instead of reserving Him for prayer time.',
      },
      {
        title: 'Action and Contemplation',
        phase: 'Martha and Mary',
        description: 'Serving faithfully while staying rooted in inward communion.',
      },
      {
        title: 'Perfect Charity',
        phase: 'Pure love',
        description: 'A mature, steady love that does not need to win or be seen to remain real.',
      },
      {
        title: 'Hidden Service',
        phase: 'Lowly and free',
        description: 'Serving without needing credit, holding the secret joy of being unnoticed.',
      },
    ],
  },
]

export default function DevelopingVirtuesPage() {
  const navigate = useNavigate()

  return (
    <div className="relative h-screen w-full overflow-hidden bg-transparent">
      <div className="relative z-10 flex h-full flex-col px-5 pb-24 pt-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/room')}
              className="text-xs text-[#c6a47a] transition hover:text-[#e7cba9]"
            >
              Back to Room
            </button>
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/40">Interior Castle</p>
          </div>

          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">Developing Virtues</p>
            <h1 className="serif text-3xl tracking-wide text-[#e7cba9] sm:text-4xl">Virtues that build the interior castle</h1>
            <p className="max-w-2xl text-sm leading-6 text-white/68 sm:text-base">
              These are the habits that let the soul become stable, receptive, and ready for deeper prayer.
            </p>
          </div>

          <div className="space-y-5 pb-4">
            {sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#e7cba9]/30" />
                  <h2 className="text-xs uppercase tracking-[0.3em] text-[#e7cba9]/75">{section.heading}</h2>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {section.cards.map((card) => (
                    <article
                      key={card.title}
                      className="rounded-3xl border border-white/14 bg-white/[0.03] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl"
                    >
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <h3 className="serif text-xl tracking-wide text-[#f3dcc0]">{card.title}</h3>
                        <span className="rounded-full border border-[#e7cba9]/16 bg-black/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-[#e7cba9]/60">
                          {card.phase}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-white/74">{card.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
