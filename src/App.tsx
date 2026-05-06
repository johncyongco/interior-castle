import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import PrayerPage from './pages/PrayerPage'
import ReflectionPage from './pages/ReflectionPage'
import ReflectionHistoryPage from './pages/ReflectionHistoryPage'
import SoulsDetailPage from './pages/SoulsDetailPage'
import TemptationPage from './pages/TemptationPage'
import CommunityPage from './pages/CommunityPage'
import FriendsOfTheSufferingPage from './pages/FriendsOfTheSufferingPage'
import FriendsPrayerPage from './pages/FriendsPrayerPage'
import FriendsFossPage from './pages/FriendsFossPage'
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
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative min-h-[100dvh]"
          >
            <motion.div
              key={`${location.pathname}-jesus-overlay`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, times: [0, 0.35, 1], ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/Jesus.jpg')] bg-cover bg-center bg-no-repeat opacity-100" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.45),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(15,12,9,0.25))] opacity-50 mix-blend-screen" />
            </motion.div>
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/gate" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/room" element={<RoomPage />} />
              <Route path="/prayer" element={<PrayerPage />} />
              <Route path="/prayer/*" element={<PrayerPage />} />
              <Route path="/reflect" element={<ReflectionPage />} />
              <Route path="/reflection" element={<ReflectionPage />} />
              <Route path="/reflection/history" element={<ReflectionHistoryPage />} />
              <Route path="/community/friends-of-the-suffering" element={<FriendsOfTheSufferingPage />} />
              <Route path="/community/friends-of-the-suffering/prayer" element={<FriendsPrayerPage />} />
              <Route path="/community/friends-of-the-suffering/souls" element={<SoulsDetailPage />} />
              <Route path="/community/friends-of-the-suffering/foss" element={<FriendsFossPage />} />
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
