import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScreenContainer from '../components/ScreenContainer'
import { PrimaryButton } from '../components/PrimaryButton'
import { supabase } from '../lib/supabase'
import { ensureSperoUser } from '../lib/speroIdentity'

export default function CompanionPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [companionId, setCompanionId] = useState('')
  const [request, setRequest] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const savedCompanionId = window.localStorage.getItem('spero-companion-id')
    const savedStatus = window.localStorage.getItem('spero-companion-status')
    const savedRequest = window.localStorage.getItem('spero-companion-request')
    if (savedCompanionId) setCompanionId(savedCompanionId)
    if (savedStatus) setStatus(savedStatus)
    if (savedRequest) setRequest(savedRequest)
  }, [])

  useEffect(() => {
    if (companionId) window.localStorage.setItem('spero-companion-id', companionId)
  }, [companionId])

  useEffect(() => {
    if (status) window.localStorage.setItem('spero-companion-status', status)
  }, [status])

  useEffect(() => {
    window.localStorage.setItem('spero-companion-request', request)
  }, [request])

  async function sendCheckIn(nextStatus: string) {
    setStatus(nextStatus)
    const user = await ensureSperoUser()
    if (!supabase || !user || !companionId) {
      setMessage('Saved locally.')
      return
    }

    const { error } = await supabase
      .from('companions')
      .upsert(
        {
          user_id: user.id,
          companion_id: companionId,
        },
        { onConflict: 'user_id,companion_id' },
      )

    setMessage(error ? 'Saved locally.' : 'Check-in sent privately.')
  }

  async function sendPrayerRequest() {
    if (!request.trim()) {
      setMessage('Write a request first.')
      return
    }

    const user = await ensureSperoUser()
    if (!supabase || !user || !companionId) {
      setMessage('Saved locally.')
      return
    }

    const { error } = await supabase
      .from('companions')
      .upsert(
        {
          user_id: user.id,
          companion_id: companionId,
        },
        { onConflict: 'user_id,companion_id' },
      )

    setMessage(error ? 'Saved locally.' : 'Prayer request prepared privately.')
  }

  return (
    <ScreenContainer>
      <div
        className="absolute inset-0 bg-[url('/altar.png')] bg-cover opacity-12"
        style={{ backgroundPosition: 'center 24%' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,236,199,0.1),transparent_24%),linear-gradient(180deg,rgba(15,12,9,0.06),rgba(15,12,9,0.48))]" />
      <div className="relative flex h-full flex-col px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex h-full flex-col"
        >
          <div className="space-y-2 text-center">
            <h1 className="serif text-2xl text-center mb-3 text-[#e7cba9]">Companion</h1>
            <p className="text-center text-sm text-[#c6a47a] mb-8">Pray for one another.</p>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-white">Your Companion</h2>
                <p className="text-sm leading-6 text-white/70">Pray for one another.</p>
              </div>

              <input
                value={companionId}
                onChange={(event) => setCompanionId(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/50"
                placeholder="Companion ID"
              />

              <div className="grid grid-cols-2 gap-3">
                <PrimaryButton onClick={() => void sendCheckIn('I am doing well.')}>Faithful</PrimaryButton>
                <PrimaryButton onClick={() => void sendCheckIn('I need prayer.')}>Struggling</PrimaryButton>
              </div>

              {status ? <p className="text-xs text-[#e7cba9]">{status}</p> : null}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-soft space-y-3">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-white">Pray for Me</h2>
                <p className="text-sm leading-6 text-white/70">Send a prayer request to your companion.</p>
              </div>
              <textarea
                rows={4}
                value={request}
                onChange={(event) => setRequest(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/50"
                placeholder="Write quietly..."
              />
              <PrimaryButton onClick={() => void sendPrayerRequest()} className="w-full">
                Send check-in
              </PrimaryButton>
            </div>
          </div>

          {message ? <p className="mt-5 text-center text-xs text-[#8c7a65]">{message}</p> : null}
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
