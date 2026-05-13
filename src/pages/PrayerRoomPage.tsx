import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenContainer from '../components/ScreenContainer'
import { joinChannel, leaveChannel, getJoinedChannel, isAgoraAvailable } from '../lib/agora'
import type { PrayerChannel } from '../pages/ChapelPage'

export default function PrayerRoomPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const channel = (location.state as any)?.channel as PrayerChannel | undefined
  const username = (location.state as any)?.username as string | undefined
  const [joined, setJoined] = useState(false)
  const [users, setUsers] = useState<string[]>([username || 'You'])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!channel || !username) {
      navigate('/chapel')
      return
    }
  }, [channel, username, navigate])

  useEffect(() => {
    if (!channel || !username) return
    if (!isAgoraAvailable()) {
      setJoined(true)
      setUsers([`${username} (you)`])
      return
    }
    joinChannel(
      channel.id,
      null,
      username,
      channel,
      (uid) => setUsers((prev) => (prev.includes(uid) ? prev : [...prev, uid])),
      (uid) => setUsers((prev) => prev.filter((u) => u !== uid)),
    ).then(() => {
      setJoined(true)
      setUsers((prev) => (prev.includes(username) ? prev : [...prev, username]))
    }).catch((err) => {
      setError(err.message || 'Failed to join')
    })
    return () => { leaveChannel().catch(() => {}) }
  }, [channel, username])

  const handleLeave = async () => {
    await leaveChannel().catch(() => {})
    navigate('/chapel')
  }

  if (!channel) return null

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,244,220,0.12),transparent_26%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.42))]" />

      <div className="relative flex h-full flex-col px-6 py-10 pb-28">
        <div className="flex items-center justify-between">
          <button type="button" onClick={handleLeave} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 backdrop-blur-xl transition hover:shadow-glow">Leave Room</button>
        </div>

        <div className="mt-6 text-center">
          <p className="serif text-2xl text-[#e7cba9]">{channel.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/40">{channel.mode} · {channel.type}</p>
        </div>

        {!isAgoraAvailable() && (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-center text-xs text-amber-400/70">
            Voice not configured. Add VITE_AGORA_APP_ID to .env for voice.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-xs text-red-400/70">{error}</div>
        )}

        <div className="mt-6 flex-1 rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-soft">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">In this room ({users.length})</p>
          <div className="mt-3 space-y-2">
            {users.map((u) => (
              <div key={u} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-green-400/70" />
                <span className="text-sm text-white/80">{u}</span>
                {u === username && <span className="text-[10px] text-white/30">(you)</span>}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-center"
        >
          <p className="serif text-xs italic text-[#e7cba9]/50">"Where two or three are gathered in my name, there am I in the midst of them."</p>
          <p className="mt-1 text-[10px] text-white/30">Matthew 18:20</p>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
