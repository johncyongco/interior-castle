import type { InteriorState } from '../store/interiorStore'

const passagesByMood: Record<InteriorState, string[]> = {
  restless: [
    'I thought of the soul as resembling a castle.',
    'There are many rooms in this castle.',
    'In the centre, in the very midst of them all, is the principal chamber.',
  ],
  distracted: [
    'The gate by which to enter this castle is prayer and meditation.',
    'Certain books on prayer advise the soul to enter into itself.',
    'Our habit of conversing about spiritual matters is a good preservative against such evil ways.',
  ],
  tempted: [
    'At length they enter the first rooms in the basement of the castle.',
    'They are accompanied by numerous reptiles which disturb their peace.',
    'Accustomed as they are to be with the reptiles outside the castle, they imitate their habits.',
  ],
  numb: [
    'We need not tire ourselves by trying to realize all the beauty of this castle.',
    'Rarely do we reflect upon what gifts our souls may possess.',
    'It is a small misfortune that we neither understand our nature nor our origin.',
  ],
  peaceful: [
    'In the centre, in the very midst of them all, is the principal chamber.',
    'God dwells in the centre of the soul.',
    'Let us return to our beautiful and charming castle and discover how to enter it.',
  ],
}

type ReflectionTheme = {
  id: string
  label: string
  description: string
  keywords: string[]
  passages: string[]
}

const reflectionThemesByMood: Record<InteriorState, ReflectionTheme[]> = {
  restless: [
    {
      id: 'anxiety',
      label: 'Anxious heart',
      description: 'When fear and worry keep returning, the soul needs quiet trust.',
      keywords: ['anxious', 'anxiety', 'worried', 'worry', 'fear', 'afraid', 'panic', 'stress', 'stressful'],
      passages: [
        'There are many rooms in this castle.',
        'In the centre, in the very midst of them all, is the principal chamber.',
        'Let us return to our beautiful and charming castle and discover how to enter it.',
      ],
    },
    {
      id: 'control',
      label: 'Control and pressure',
      description: 'When you try to hold everything together, grace invites you to release it.',
      keywords: ['control', 'perfect', 'perfection', 'pressure', 'manage', 'plan', 'fix', 'holding'],
      passages: [
        'The gate by which to enter this castle is prayer and meditation.',
        'Certain books on prayer advise the soul to enter into itself.',
        'God dwells in the centre of the soul.',
      ],
    },
    {
      id: 'loneliness',
      label: 'Lonely heart',
      description: 'When isolation speaks loudly, God remains present in the center.',
      keywords: ['alone', 'lonely', 'loneliness', 'isolated', 'empty', 'abandoned'],
      passages: [
        'In the centre, in the very midst of them all, is the principal chamber.',
        'God dwells in the centre of the soul.',
        'Rarely do we reflect upon what gifts our souls may possess.',
      ],
    },
  ],
  distracted: [
    {
      id: 'scattered',
      label: 'Scattered mind',
      description: 'When attention keeps breaking apart, inward prayer gathers it back.',
      keywords: ['distracted', 'scatter', 'scattered', 'busy', 'noise', 'noisy', 'overloaded', 'overwhelm'],
      passages: [
        'The gate by which to enter this castle is prayer and meditation.',
        'Certain books on prayer advise the soul to enter into itself.',
        'We need not tire ourselves by trying to realize all the beauty of this castle.',
      ],
    },
    {
      id: 'comparison',
      label: 'Comparison',
      description: 'When the self is measured against others, the soul forgets its own dwelling place.',
      keywords: ['compare', 'comparison', 'envy', 'jealous', 'jealousy', 'social', 'scrolling'],
      passages: [
        'Rarely do we reflect upon what gifts our souls may possess.',
        'Let us return to our beautiful and charming castle and discover how to enter it.',
        'The gate by which to enter this castle is prayer and meditation.',
      ],
    },
  ],
  tempted: [
    {
      id: 'desire',
      label: 'Temptation',
      description: 'When desire pulls hard, the first rooms teach vigilance.',
      keywords: ['tempt', 'tempted', 'temptation', 'desire', 'lust', 'porn', 'impure', 'sexual'],
      passages: [
        'At length they enter the first rooms in the basement of the castle.',
        'They are accompanied by numerous reptiles which disturb their peace.',
        'Accustomed as they are to be with the reptiles outside the castle, they imitate their habits.',
      ],
    },
    {
      id: 'anger',
      label: 'Anger and resentment',
      description: 'When anger takes the lead, peace begins by naming the wound honestly.',
      keywords: ['angry', 'anger', 'mad', 'resent', 'resentment', 'rage', 'furious', 'hurt'],
      passages: [
        'They are accompanied by numerous reptiles which disturb their peace.',
        'The gate by which to enter this castle is prayer and meditation.',
        'Let us return to our beautiful and charming castle and discover how to enter it.',
      ],
    },
    {
      id: 'habit',
      label: 'Habit and compulsion',
      description: 'When a habit keeps repeating, the soul needs patient return.',
      keywords: ['habit', 'compulsion', 'addiction', 'addicted', 'drinking', 'drink', 'phone', 'scroll', 'gaming'],
      passages: [
        'Accustomed as they are to be with the reptiles outside the castle, they imitate their habits.',
        'At length they enter the first rooms in the basement of the castle.',
        'The gate by which to enter this castle is prayer and meditation.',
      ],
    },
  ],
  numb: [
    {
      id: 'burnout',
      label: 'Burnout',
      description: 'When the heart feels tired and heavy, it needs to remember its dignity.',
      keywords: ['burnout', 'burnt', 'exhausted', 'tired', 'weary', 'drained', 'fatigue'],
      passages: [
        'We need not tire ourselves by trying to realize all the beauty of this castle.',
        'Rarely do we reflect upon what gifts our souls may possess.',
        'It is a small misfortune that we neither understand our nature nor our origin.',
      ],
    },
    {
      id: 'sadness',
      label: 'Sadness',
      description: 'When sadness closes in, the soul is not empty, only hidden from itself.',
      keywords: ['sad', 'sadness', 'hopeless', 'empty', 'depressed', 'depression', 'blue'],
      passages: [
        'Rarely do we reflect upon what gifts our souls may possess.',
        'We need not tire ourselves by trying to realize all the beauty of this castle.',
        'God dwells in the centre of the soul.',
      ],
    },
  ],
  peaceful: [
    {
      id: 'gratitude',
      label: 'Grateful peace',
      description: 'When peace is present, gratitude keeps the heart near the center.',
      keywords: ['grateful', 'gratitude', 'thankful', 'peace', 'peaceful', 'trust'],
      passages: [
        'In the centre, in the very midst of them all, is the principal chamber.',
        'God dwells in the centre of the soul.',
        'Let us return to our beautiful and charming castle and discover how to enter it.',
      ],
    },
  ],
}

function daySeed(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function countKeywordMatches(text: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => {
    const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'g')
    const matches = text.match(pattern)
    return score + (matches?.length ?? 0)
  }, 0)
}

export function getTeresaReflectionInsight({
  mood,
  question,
  input,
}: {
  mood: InteriorState
  question: string
  input: string
}) {
  const normalizedText = `${question} ${input}`.toLowerCase()
  const themes = reflectionThemesByMood[mood] ?? reflectionThemesByMood.restless
  const matchedTheme =
    themes
      .map((theme) => ({
        theme,
        score: countKeywordMatches(normalizedText, theme.keywords),
      }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)[0]?.theme ?? null

  const theme =
    matchedTheme ??
    themes[hashString(`${daySeed()}|${mood}|${question}|${input.trim().slice(0, 64)}`) % themes.length]

  const passages = theme.passages.length > 0 ? theme.passages : passagesByMood[mood] ?? passagesByMood.restless
  const seed = `${daySeed()}|${mood}|${theme.id}|${question}|${input.trim().slice(0, 64)}`

  return {
    title: `First Mansion · ${theme.label}`,
    description: theme.description,
    passage: passages[hashString(seed) % passages.length],
  }
}

export function getTeresaReflectionPassage({
  mood,
  question,
  input,
}: {
  mood: InteriorState
  question: string
  input: string
}) {
  return getTeresaReflectionInsight({ mood, question, input }).passage
}
