import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import ScreenContainer from '../components/ScreenContainer'

const ADMIN_KEY = 'spero-admin-email'

export default function AdminPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const adminEmail = localStorage.getItem(ADMIN_KEY)
    if (adminEmail) navigate('/chapel', { replace: true })
    else setChecking(false)
  }, [navigate])

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return
    setError('')

    if (!supabase) {
      setError('Supabase not configured')
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      setError('Invalid email or password')
      return
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email.trim())
      .single()

    if (!adminData) {
      await supabase.auth.signOut()
      setError('Not authorized as admin')
      return
    }

    localStorage.setItem(ADMIN_KEY, email.trim())
    navigate('/chapel', { replace: true })
  }

  if (checking) return null

  return (
    <ScreenContainer>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,244,220,0.12),transparent_26%),linear-gradient(180deg,rgba(15,12,9,0.08),rgba(15,12,9,0.42))]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-xs space-y-4"
        >
          <p className="serif text-lg text-[#e7cba9]">Admin Login</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-center text-base text-white outline-none placeholder:text-white/30 backdrop-blur-xl"
            autoFocus
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
            className="w-full rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-center text-base text-white outline-none placeholder:text-white/30 backdrop-blur-xl"
          />
          {error && <p className="text-xs text-red-400/70">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full rounded-3xl border border-white/14 bg-white/[0.05] px-4 py-3 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/[0.1]"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/chapel')}
            className="w-full text-xs text-white/40 transition hover:text-white/60"
          >
            Skip (guest)
          </button>
        </motion.div>
      </div>
    </ScreenContainer>
  )
}
