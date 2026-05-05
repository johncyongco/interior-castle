import OpenAI from 'npm:openai'

const fallbackText = 'You were looking for fullness in what cannot fill. Return to the One who does.'

export default async function handler(req: Request) {
  const apiKey = Deno.env.get('OPENAI_API_KEY')

  if (!apiKey) {
    return new Response(JSON.stringify({ text: fallbackText }), {
      headers: { 'content-type': 'application/json' },
    })
  }

  const openai = new OpenAI({
    apiKey,
  })

  const { input } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a gentle Catholic spiritual guide. Be brief, calm, and non-judgmental.',
      },
      {
        role: 'user',
        content: input,
      },
    ],
  })

  return new Response(
    JSON.stringify({
      text: completion.choices[0].message.content,
    }),
    {
      headers: { 'content-type': 'application/json' },
    },
  )
}
