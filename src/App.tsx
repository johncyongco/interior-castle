import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import PrayerPage from './pages/PrayerPage'
import ReflectionPage from './pages/ReflectionPage'
import TemptationPage from './pages/TemptationPage'
import CommunityPage from './pages/CommunityPage'
import TeachingDetailPage from './pages/TeachingDetailPage'
import CompanionPage from './pages/CompanionPage'
import SaintsPage from './pages/SaintsPage'
import { AmbientField } from './components/AmbientField'
import { ensureSperoUser } from './lib/speroIdentity'
import BottomNav from './components/BottomNav'

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    void ensureSperoUser().catch(() => undefined)
  }, [])

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-castle text-white">
      <AmbientField />
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative min-h-[100dvh]"
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/gate" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/room" element={<RoomPage />} />
              <Route path="/prayer" element={<PrayerPage />} />
              <Route path="/prayer/*" element={<PrayerPage />} />
              <Route path="/reflect" element={<ReflectionPage />} />
              <Route path="/reflection" element={<ReflectionPage />} />
              <Route path="/temptation" element={<TemptationPage />} />
              <Route path="/temptation/*" element={<TemptationPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/:teachingId" element={<TeachingDetailPage />} />
              <Route path="/companion" element={<CompanionPage />} />
              <Route path="/saints" element={<SaintsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
          <BottomNav />
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function App() {
  return <AppShell />
}
