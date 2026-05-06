export type VerseDetail = {
  reference: string
  excerpt: string
  sourceUrl: string
}

export type Teaching = {
  id: string
  title: string
  text: string
  verses: VerseDetail[]
}

export const teachings: Teaching[] = [
  {
    id: 'god-is-all-things',
    title: 'God is all things',
    text: 'Food, water, air, fire, sky, universe, earth, clothing, work, creation, man, body, head, arms, feet, walking, running, standing, sea, ocean, breath, time, rest, and light all point us back to God in ordinary life.',
    verses: [
      {
        reference: 'Genesis 1:1',
        excerpt: 'God is the maker of heaven and earth, the beginning of all creation.',
        sourceUrl: 'https://bible.usccb.org/bible/genesis/1',
      },
      {
        reference: 'Colossians 1:16-17',
        excerpt: 'All things were created through him and for him, and in him all things hold together.',
        sourceUrl: 'https://bible.usccb.org/bible/colossians/1',
      },
      {
        reference: 'Matthew 6:11',
        excerpt: 'Daily bread reminds us that food is received as gift, not seized as control.',
        sourceUrl: 'https://bible.usccb.org/bible/matthew/6',
      },
      {
        reference: 'John 6:35',
        excerpt: 'Jesus reveals himself as the true bread that satisfies deeper hunger.',
        sourceUrl: 'https://bible.usccb.org/bible/john/6',
      },
      {
        reference: 'John 4:13-14',
        excerpt: 'Living water is offered by Christ for the thirst that ordinary water cannot end.',
        sourceUrl: 'https://bible.usccb.org/bible/john/4',
      },
      {
        reference: 'Isaiah 44:24',
        excerpt: 'The Lord is the one who made all things, stretching out the heavens and the earth.',
        sourceUrl: 'https://bible.usccb.org/bible/isaiah/44',
      },
      {
        reference: 'Psalm 19:1',
        excerpt: 'The heavens and sky declare the glory of God in the universe above us.',
        sourceUrl: 'https://bible.usccb.org/bible/psalms/19',
      },
      {
        reference: 'Psalm 24:1',
        excerpt: 'The earth and everything in it belong to the Lord.',
        sourceUrl: 'https://bible.usccb.org/bible/psalms/24',
      },
      {
        reference: 'Matthew 6:28-30',
        excerpt: 'Even clothing points to the Father who knows what we need.',
        sourceUrl: 'https://bible.usccb.org/bible/matthew/6',
      },
      {
        reference: 'Colossians 3:23-24',
        excerpt: 'Work can be offered to the Lord, not only to people.',
        sourceUrl: 'https://bible.usccb.org/bible/colossians/3',
      },
      {
        reference: 'Genesis 2:15',
        excerpt: 'Human work begins as a vocation to serve and tend what God has made.',
        sourceUrl: 'https://bible.usccb.org/bible/genesis/2',
      },
      {
        reference: 'Genesis 1:27',
        excerpt: 'Man and woman are made in the image of God.',
        sourceUrl: 'https://bible.usccb.org/bible/genesis/1',
      },
      {
        reference: 'Psalm 139:13-14',
        excerpt: 'The body is fearfully and wonderfully made by God.',
        sourceUrl: 'https://bible.usccb.org/bible/psalms/139',
      },
      {
        reference: '1 Corinthians 6:19-20',
        excerpt: 'Your body is a temple of the Holy Spirit and should be honored.',
        sourceUrl: 'https://bible.usccb.org/bible/1corinthians/6',
      },
      {
        reference: 'Ephesians 1:22-23',
        excerpt: 'Christ is the head over all things for the Church.',
        sourceUrl: 'https://bible.usccb.org/bible/ephesians/1',
      },
      {
        reference: 'Isaiah 40:11',
        excerpt: 'God tends his people with the care of a shepherd carrying them close.',
        sourceUrl: 'https://bible.usccb.org/bible/isaiah/40',
      },
      {
        reference: 'Psalm 119:105',
        excerpt: 'God gives light for the feet and direction for the path.',
        sourceUrl: 'https://bible.usccb.org/bible/psalms/119',
      },
      {
        reference: 'Hebrews 12:1-2',
        excerpt: 'The life of faith is a race run with endurance and eyes fixed on Jesus.',
        sourceUrl: 'https://bible.usccb.org/bible/hebrews/12',
      },
      {
        reference: 'Micah 6:8',
        excerpt: 'Walking with God means doing justice, loving mercy, and living humbly.',
        sourceUrl: 'https://bible.usccb.org/bible/micah/6',
      },
      {
        reference: 'Ephesians 6:13-14',
        excerpt: 'Standing firm means taking up truth and righteousness.',
        sourceUrl: 'https://bible.usccb.org/bible/ephesians/6',
      },
      {
        reference: 'Psalm 95:5',
        excerpt: 'The sea is a sign that the Lord made everything beneath and above it.',
        sourceUrl: 'https://bible.usccb.org/bible/psalms/95',
      },
      {
        reference: 'Job 38:8-11',
        excerpt: 'Even the ocean has limits set by the Lord who commands the waves.',
        sourceUrl: 'https://bible.usccb.org/bible/job/38',
      },
      {
        reference: 'Acts 17:25',
        excerpt: 'Life, breath, and everything else come from God.',
        sourceUrl: 'https://bible.usccb.org/bible/acts/17',
      },
      {
        reference: 'Ecclesiastes 3:1',
        excerpt: 'Time itself is held within seasons and purposes appointed by God.',
        sourceUrl: 'https://bible.usccb.org/bible/ecclesiastes/3',
      },
      {
        reference: 'Psalm 4:8',
        excerpt: 'Sleep and rest are also places where the Lord keeps his people safe.',
        sourceUrl: 'https://bible.usccb.org/bible/psalms/4',
      },
      {
        reference: 'John 8:12',
        excerpt: 'Christ is the light that helps us see the world rightly.',
        sourceUrl: 'https://bible.usccb.org/bible/john/8',
      },
    ],
  },
  {
    id: 'promises-of-god',
    title: 'The Promises of God',
    text: 'Hold what God has spoken as faithful and sure.',
    verses: [
      {
        reference: '2 Peter 1:4',
        excerpt: 'precious and very great promises',
        sourceUrl: 'https://bible.usccb.org/bible/2peter/1',
      },
      {
        reference: 'Romans 8:28',
        excerpt: 'all things work for good for those who love God',
        sourceUrl: 'https://bible.usccb.org/bible/romans/8',
      },
      {
        reference: 'Hebrews 10:23',
        excerpt: 'he who made the promise is trustworthy',
        sourceUrl: 'https://bible.usccb.org/bible/hebrews/10',
      },
    ],
  },
  {
    id: 'new-heaven-new-earth',
    title: 'The New Heaven and New Earth',
    text: 'Look toward the promised renewal of all things.',
    verses: [
      {
        reference: 'Revelation 21:1-5',
        excerpt: 'Then I saw a new heaven and a new earth',
        sourceUrl: 'https://bible.usccb.org/bible/revelation/21',
      },
      {
        reference: 'Isaiah 65:17',
        excerpt: 'See, I am creating new heavens and a new earth',
        sourceUrl: 'https://bible.usccb.org/bible/isaiah/65',
      },
      {
        reference: '2 Peter 3:13',
        excerpt: 'new heavens and a new earth in which righteousness dwells',
        sourceUrl: 'https://bible.usccb.org/bible/2peter/3',
      },
    ],
  },
  {
    id: 'beatific-vision',
    title: 'Beatific Vision',
    text: 'Rest in the final seeing of God face to face.',
    verses: [
      {
        reference: '1 John 3:2',
        excerpt: 'we shall be like him, for we shall see him as he is',
        sourceUrl: 'https://bible.usccb.org/bible/1john/3',
      },
      {
        reference: 'Matthew 5:8',
        excerpt: 'the clean of heart, for they will see God',
        sourceUrl: 'https://bible.usccb.org/bible/matthew/5',
      },
      {
        reference: '1 Corinthians 13:12',
        excerpt: 'At present we see indistinctly, as in a mirror, but then face to face',
        sourceUrl: 'https://bible.usccb.org/bible/1corinthians/13',
      },
    ],
  },
  {
    id: 'life-everlasting',
    title: 'Life Everlasting',
    text: 'Enter the hope that does not pass away.',
    verses: [
      {
        reference: 'John 3:16',
        excerpt: 'so that everyone who believes in him might have eternal life',
        sourceUrl: 'https://bible.usccb.org/bible/john/3',
      },
      {
        reference: 'John 10:28',
        excerpt: 'I give them eternal life, and they shall never perish',
        sourceUrl: 'https://bible.usccb.org/bible/john/10',
      },
      {
        reference: 'Romans 6:23',
        excerpt: 'the gift of God is eternal life in Christ Jesus our Lord',
        sourceUrl: 'https://bible.usccb.org/bible/romans/6',
      },
    ],
  },
  {
    id: 'communion-of-saints',
    title: 'Communion of Saints',
    text: 'Remember the great companionship of the holy.',
    verses: [
      {
        reference: 'Hebrews 12:1',
        excerpt: 'surrounded by so great a cloud of witnesses',
        sourceUrl: 'https://bible.usccb.org/bible/hebrews/12',
      },
      {
        reference: 'Romans 12:5',
        excerpt: 'we, though many, are one body in Christ',
        sourceUrl: 'https://bible.usccb.org/bible/romans/12',
      },
      {
        reference: '1 Corinthians 12:27',
        excerpt: 'you are Christ’s body, and individually parts of it',
        sourceUrl: 'https://bible.usccb.org/bible/1corinthians/12',
      },
    ],
  },
]

export function getTeachingById(id: string | undefined) {
  return teachings.find((teaching) => teaching.id === id) ?? teachings[0]
}
