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
