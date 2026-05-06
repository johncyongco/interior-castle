import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import ScreenContainer from '../components/ScreenContainer'
import { teachings } from '../lib/communityTeachings'

type FaithTopic = {
  title: string
  description: string
  keywords: string[]
  href: string
  type: 'internal' | 'external'
}

const catechismUrl = 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM'

const faithTopics: FaithTopic[] = [
  {
    title: 'Prayer',
    description: 'Go to prayer practices, meditations, and guided devotion.',
    keywords: ['pray', 'prayer', 'meditation', 'devotion'],
    href: '/prayer',
    type: 'internal',
  },
  {
    title: 'Daily Gospel',
    description: 'Open the daily reading window.',
    keywords: ['daily gospel', 'daily bread', 'gospel', 'reading', 'bread'],
    href: '/daily-gospel',
    type: 'internal',
  },
  {
    title: 'Reflection',
    description: 'Enter the reflection page for discernment and journal work.',
    keywords: ['reflection', 'reflect', 'journal', 'discernment'],
    href: '/reflection',
    type: 'internal',
  },
  {
    title: 'Friends of the Suffering Souls',
    description: 'Open the page for prayers for the holy souls.',
    keywords: ['souls', 'suffering', 'purgatory', 'friends of the suffering'],
    href: '/community/friends-of-the-suffering/souls',
    type: 'internal',
  },
  {
    title: 'Friends of the Suffering',
    description: 'Learn about the association and its mission.',
    keywords: ['foss', 'friends of the suffering', 'novena'],
    href: '/community/friends-of-the-suffering/foss',
    type: 'internal',
  },
  {
    title: 'Rosary',
    description: 'Pray the Rosary.',
    keywords: ['rosary', 'hail mary', 'mysteries'],
    href: '/prayer/rosary',
    type: 'internal',
  },
  {
    title: 'Divine Mercy',
    description: 'Open the Divine Mercy chaplet page.',
    keywords: ['mercy', 'divine mercy', 'chaplet'],
    href: '/prayer/divine-mercy',
    type: 'internal',
  },
  {
    title: 'Angels Prayer',
    description: 'Pray with the angels.',
    keywords: ['angel', 'angels', 'guardian angel'],
    href: '/prayer/angels-prayer',
    type: 'internal',
  },
  {
    title: 'Deliverance Prayer',
    description: 'Open the deliverance prayer page.',
    keywords: ['deliverance', 'liberation', 'spiritual warfare'],
    href: '/prayer/deliverance-prayer',
    type: 'internal',
  },
  {
    title: 'Saints',
    description: 'Visit the saints page.',
    keywords: ['saint', 'saints', 'holy'],
    href: '/saints',
    type: 'internal',
  },
  {
    title: 'Creation',
    description: 'Go to the creation teaching.',
    keywords: ['creation', 'creator', 'made', 'universe', 'earth'],
    href: '/community/god-is-all-things',
    type: 'internal',
  },
  {
    title: 'Rest',
    description: 'Go to the rest teaching.',
    keywords: ['rest', 'sabbath', 'seventh day', 'sleep'],
    href: '/community/god-is-all-things',
    type: 'internal',
  },
  {
    title: 'Promises of God',
    description: 'Open the promises teaching.',
    keywords: ['promise', 'promises', 'faithful', 'trust'],
    href: '/community/promises-of-god',
    type: 'internal',
  },
  {
    title: 'Beatific Vision',
    description: 'Open the teaching on seeing God face to face.',
    keywords: ['vision', 'heaven', 'face to face', 'beatific'],
    href: '/community/beatific-vision',
    type: 'internal',
  },
  {
    title: 'Life Everlasting',
    description: 'Open the teaching on eternal life.',
    keywords: ['eternal', 'everlasting', 'life', 'heaven'],
    href: '/community/life-everlasting',
    type: 'internal',
  },
  {
    title: 'Communion of Saints',
    description: 'Open the teaching on the communion of saints.',
    keywords: ['communion', 'saints', 'witnesses', 'church'],
    href: '/community/communion-of-saints',
    type: 'internal',
  },
  {
    title: 'CCC Index',
    description: 'Open the official Catechism index in a new tab.',
    keywords: ['catechism', 'ccc', 'index', 'church'],
    href: catechismUrl,
    type: 'external',
  },
]

function getTeachingTopics() {
  return teachings.flatMap((teaching) => {
    if (teaching.everydayThings && teaching.everydayThings.length > 0) {
      return teaching.everydayThings.map((thing) => ({
        title: `${teaching.title}: ${thing.name}`,
        description: thing.verses
          .map((verse) => `${verse.reference} ${verse.excerpt}`)
          .join(' '),
        keywords: [teaching.title, thing.name, ...thing.verses.flatMap((verse) => [verse.reference, verse.excerpt])],
        href: `/community/${teaching.id}`,
        type: 'internal' as const,
      }))
    }

    return [
      {
        title: teaching.title,
        description: teaching.text,
        keywords: [teaching.title, teaching.text, ...teaching.verses.flatMap((verse) => [verse.reference, verse.excerpt])],
        href: `/community/${teaching.id}`,
        type: 'internal' as const,
      },
    ]
  })
}

export default function CccPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const baseTopics = [...faithTopics, ...getTeachingTopics()]

    if (!normalized) return baseTopics.slice(0, 8)

    return baseTopics.filter((topic) => {
      const haystack = [topic.title, topic.description, ...topic.keywords].join(' ').toLowerCase()
      return haystack.includes(normalized)
    })
  }, [query])

  const openResult = (href: string, type: FaithTopic['type']) => {
    if (type === 'external') {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    navigate(href)
  }

  const handleSubmit = () => {
    const first = searchResults[0]
    if (!first) return
    openResult(first.href, first.type)
  }

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,236,199,0.12),transparent_26%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.42))]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/castle-gate.png')] bg-cover bg-center opacity-[0.03]" />

      <div className="relative flex h-full flex-col px-6 py-10 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/room"
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Back to Room
            </Link>
            <a
              href={catechismUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow"
            >
              Open CCC Index
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-soft">
            <p className="text-xs uppercase tracking-[0.28em] text-[#c6a47a]">CCC Search</p>
            <h1 className="mt-2 serif text-2xl text-[#e7cba9]">Search the faith</h1>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Type a topic and open a related prayer, teaching, or the official Catechism index.
            </p>

            <div className="mt-4 flex gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="Search prayer, mercy, saints, creation..."
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#e7cba9]/40"
                aria-label="Search faith topics"
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-2xl border border-white/10 bg-[#e7cba9] px-4 py-3 text-sm font-medium text-[#22170f] transition hover:brightness-110"
              >
                Open
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Results</p>
              <p className="text-xs text-white/35">{searchResults.length} found</p>
            </div>

            <div className="mt-4 grid gap-3">
              {searchResults.length > 0 ? (
                searchResults.map((topic) => (
                  <button
                    key={`${topic.title}-${topic.href}`}
                    type="button"
                    onClick={() => openResult(topic.href, topic.type)}
                    className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:bg-white/[0.08]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="serif text-lg text-[#e7cba9]">{topic.title}</h2>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                        {topic.type === 'external' ? 'External' : 'Open'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">{topic.description}</p>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/60">
                  No matches. Try prayer, saints, mercy, creation, or daily bread.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
