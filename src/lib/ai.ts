const fallbackResponse = 'You were looking for fullness in what cannot fill. Return to the One who does.'

export async function getGentleReflectionResponse(input: string) {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT as string | undefined

  if (!endpoint) {
    return fallbackResponse
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })

    if (!response.ok) {
      return fallbackResponse
    }

    const data = (await response.json()) as { text?: string }
    return data.text?.trim() || fallbackResponse
  } catch {
    return fallbackResponse
  }
}

export const reflectionFallback = fallbackResponse
