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

export function getTeresaReflectionPassage({
  mood,
  question,
  input,
}: {
  mood: InteriorState
  question: string
  input: string
}) {
  const passages = passagesByMood[mood] ?? passagesByMood.restless
  const seed = `${daySeed()}|${mood}|${question}|${input.trim().slice(0, 64)}`
  return passages[hashString(seed) % passages.length]
}
