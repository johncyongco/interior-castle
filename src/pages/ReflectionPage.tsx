import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenContainer from '../components/ScreenContainer'
import ChoiceButton from '../components/ChoiceButton'
import { PrimaryButton } from '../components/PrimaryButton'
import { useInteriorStore } from '../store/interiorStore'
import { logReflection } from '../lib/speroIdentity'
import { getTeresaReflectionInsight } from '../lib/teresaPassages'
import {
  clearReflectionDraft,
  clearReflectionHistory,
  loadReflectionHistory,
  loadReflectionDraft,
  saveReflectionDraft,
  saveReflectionEntry,
  type ReflectionEntry,
} from '../lib/reflectionJournal'

const questions = [
  'Where did you seek yourself today?',
  'What disturbed your peace?',
  'Where did you resist grace?',
]

export default function ReflectionPage() {
  const navigate = useNavigate()
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [response, setResponse] = useState<{
    title: string
    description: string
    passage: string
  } | null>(null)
  const [savedNotice, setSavedNotice] = useState('')
  const [history, setHistory] = useState<ReflectionEntry[]>([])
  const increaseDepth = useInteriorStore((store) => store.increaseDepth)
  const mood = useInteriorStore((store) => store.mood)

  useEffect(() => {
    const draft = loadReflectionDraft()
    if (!draft) return

    if (draft.question) setSelectedQuestion(draft.question)
    setInput(draft.input ?? '')
  }, [])

  useEffect(() => {
    setHistory(loadReflectionHistory())
  }, [])

  useEffect(() => {
    if (!selectedQuestion && !input) return
    saveReflectionDraft({ question: selectedQuestion, input })
  }, [selectedQuestion, input])

  const prompt = useMemo(
    () => selectedQuestion ?? 'The interior mirror. Look within with honesty and trust.',
    [selectedQuestion],
  )

  async function submitReflection() {
    const insight = getTeresaReflectionInsight({
      mood,
      question: selectedQuestion ?? prompt,
      input,
    })
    setResponse(insight)
    setSavedNotice('Saved to your reflection journal.')
    saveReflectionEntry({
      question: selectedQuestion ?? prompt,
      input,
      title: insight.title,
      description: insight.description,
      passage: insight.passage,
      mood,
      createdAt: new Date().toISOString(),
    })
    setHistory(loadReflectionHistory())
    clearReflectionDraft()
    increaseDepth()
    void logReflection(input || prompt, insight.passage)
  }

  function clearHistory() {
    clearReflectionHistory()
    setHistory([])
  }

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/mirror.png')] bg-cover opacity-12"
        style={{ backgroundPosition: 'center 34%' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,236,199,0.11),transparent_22%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.48))]" />
      <div className="relative flex h-full flex-col px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="space-y-2 text-center">
            <h1 className="serif text-2xl text-center mb-3 text-[#e7cba9]">Reflection</h1>
            <p className="text-center text-sm text-[#c6a47a] mb-8">
              The interior mirror. Look within with honesty and trust.
            </p>
          </div>

          {!selectedQuestion ? (
            <div className="space-y-3">
              {questions.map((question) => (
                <ChoiceButton
                  key={question}
                  onClick={() => setSelectedQuestion(question)}
                  label={question}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
              <p className="serif text-xl text-white/95">{selectedQuestion}</p>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/50"
                placeholder="Write quietly..."
              />
              <div className="flex flex-col gap-3">
                <PrimaryButton onClick={submitReflection}>Continue</PrimaryButton>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="text-xs text-white/55 transition hover:text-gold"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {response ? (
            <div className="mt-5 space-y-3 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">{response.title}</p>
              <p className="text-sm leading-6 text-white/70">{response.description}</p>
              <p className="serif text-2xl leading-snug text-white/95">{response.passage}</p>
              {savedNotice ? <p className="text-xs text-[#c6a47a]">{savedNotice}</p> : null}
              <p className="text-xs text-white/40">St. Teresa of Avila</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">First Mansion</p>
              <p className="serif text-2xl leading-snug text-white/95">
                I thought of the soul as resembling a castle.
              </p>
              <p className="text-xs text-white/40">St. Teresa of Avila</p>
            </div>
          )}

          <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft">
            <button
              type="button"
              onClick={() => navigate('/reflection/history')}
              className="w-full space-y-3 rounded-3xl border border-white/8 bg-white/[0.04] p-5 text-left transition hover:bg-white/[0.07]"
            >
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Your Reflections</p>
                <p className="serif text-lg leading-snug text-white/95">
                  {history.length > 0 ? `${history.length} saved reflection${history.length === 1 ? '' : 's'}` : 'No saved reflections yet.'}
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
