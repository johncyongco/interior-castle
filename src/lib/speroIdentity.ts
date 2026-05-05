import { supabase } from './supabase'

export type SperoUser = {
  id: string
  email: string | null
}

export async function ensureSperoUser(): Promise<SperoUser | null> {
  if (!supabase) return null

  try {
    const sessionResult = await supabase.auth.getSession()
    let session = sessionResult.data.session

    if (!session) {
      const anonResult = await supabase.auth.signInAnonymously()
      session = anonResult.data.session ?? null
    }

    const user = session?.user ?? (await supabase.auth.getUser()).data.user

    if (!user) return null

    await supabase.from('users').upsert({
      id: user.id,
      email: user.email ?? null,
    })

    return {
      id: user.id,
      email: user.email ?? null,
    }
  } catch {
    return null
  }
}

export async function logInteriorState(state: string) {
  if (!supabase) return

  try {
    const user = await ensureSperoUser()
    if (!user) return

    await supabase.from('interior_logs').insert({
      user_id: user.id,
      state,
    })
  } catch {
    return
  }
}

export async function logReflection(content: string, aiResponse: string) {
  if (!supabase) return

  try {
    const user = await ensureSperoUser()
    if (!user) return

    await supabase.from('reflections').insert({
      user_id: user.id,
      content,
      ai_response: aiResponse,
    })
  } catch {
    return
  }
}
