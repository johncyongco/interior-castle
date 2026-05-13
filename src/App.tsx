import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import HomePage from './pages/HomePage'
import RoomEntryPage from './pages/RoomEntryPage'
import RoomPage from './pages/RoomPage'
import DailyGospelPage from './pages/DailyGospelPage'
import PrayerPage from './pages/PrayerPage'
import RosaryPage from './pages/RosaryPage'
import DivineMercyPage from './pages/DivineMercyPage'
import AngelsPrayerPage from './pages/AngelsPrayerPage'
import DeliverancePrayerPage from './pages/DeliverancePrayerPage'
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
import GuardianAngelPage from './pages/GuardianAngelPage'
import FirstMansionPage from './pages/FirstMansionPage'
import DevelopingVirtuesPage from './pages/DevelopingVirtuesPage'
import BreakfastPage from './pages/BreakfastPage'
import BreakfastMediaPage from './pages/BreakfastMediaPage'
import BreakfastCalendarPage from './pages/BreakfastCalendarPage'
import NarniaPage from './pages/NarniaPage'
import ChapelPage from './pages/ChapelPage'
import RoomPopups from './components/RoomPopups'
import { AmbientField } from './components/AmbientField'
import { ensureSperoUser } from './lib/speroIdentity'
import BottomNav from './components/BottomNav'

const catechismUrl = 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM'

function RoomAccessGate() {
  const hasDoorEntry = typeof window !== 'undefined' && window.sessionStorage.getItem('spero-room-entry') === 'door'

  return hasDoorEntry ? <RoomPage /> : <Navigate to="/gate" replace />
}

function CatechismRedirect() {
  useEffect(() => {
    window.location.replace(catechismUrl)
  }, [])

  return null
}

function AppShell() {
  const location = useLocation()
  const hideVignette = location.pathname === '/developing-virtues'

  useEffect(() => {
    void ensureSperoUser().catch(() => undefined)
  }, [])

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-castle text-white">
      <RoomPopups />
      <AmbientField />
      {!hideVignette ? <div className="pointer-events-none absolute inset-0 vignette" /> : null}
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="relative min-h-[100dvh]"
          >
            <motion.div
              key={`${location.pathname}-jesus-overlay`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.0, times: [0, 0.35, 1], ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/Jesus.jpg')] bg-cover bg-center bg-no-repeat opacity-100" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.45),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(15,12,9,0.25))] opacity-50 mix-blend-screen" />
            </motion.div>
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/gate" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/room-entry" element={<RoomEntryPage />} />
              <Route path="/room" element={<RoomAccessGate />} />
              <Route path="/daily-gospel" element={<DailyGospelPage />} />
              <Route path="/ccc" element={<CatechismRedirect />} />
              <Route path="/prayer" element={<PrayerPage />} />
              <Route path="/prayer/*" element={<PrayerPage />} />
              <Route path="/prayer/rosary" element={<RosaryPage />} />
              <Route path="/prayer/divine-mercy" element={<DivineMercyPage />} />
              <Route path="/prayer/angels-prayer" element={<AngelsPrayerPage />} />
              <Route path="/prayer/deliverance-prayer" element={<DeliverancePrayerPage />} />
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
              <Route path="/guardian-angel" element={<GuardianAngelPage />} />
              <Route path="/first-mansion" element={<FirstMansionPage />} />
               <Route path="/developing-virtues" element={<DevelopingVirtuesPage />} />
               <Route path="/breakfast" element={<BreakfastPage />} />
               <Route path="/breakfast/media" element={<BreakfastMediaPage />} />
               <Route path="/breakfast/calendar" element={<BreakfastCalendarPage />} />
               <Route path="/narnia" element={<NarniaPage />} />
               <Route path="/chapel" element={<ChapelPage />} />
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
