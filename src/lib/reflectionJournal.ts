export type ReflectionDraft = {
  question: string | null
  input: string
}

export type ReflectionEntry = {
  question: string
  input: string
  title: string
  description: string
  passage: string
  mood: string
  createdAt: string
}

const DRAFT_KEY = 'spero-reflection-draft'
const HISTORY_KEY = 'spero-reflection-history'

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function loadReflectionDraft() {
  return readJson<ReflectionDraft>(DRAFT_KEY)
}

export function saveReflectionDraft(draft: ReflectionDraft) {
  writeJson(DRAFT_KEY, draft)
}

export function clearReflectionDraft() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(DRAFT_KEY)
}

export function loadReflectionHistory() {
  return readJson<ReflectionEntry[]>(HISTORY_KEY) ?? []
}

export function saveReflectionEntry(entry: ReflectionEntry) {
  const current = loadReflectionHistory()
  const next = [entry, ...current].slice(0, 50)
  writeJson(HISTORY_KEY, next)
}

export function clearReflectionHistory() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(HISTORY_KEY)
}
