import { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
// import HomePage from './components/pages/HomePage.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
// import BackgroundAnimation from './components/pages/BackgroundAnimation.jsx'
// import Dashboard from './components/pages/Dashboard.jsx'
import SignupPage from './components/pages/SignupPage.jsx'
// import SubmissionsPage from './components/pages/SubmissionsPage.jsx'
// import ProblemsetPage from './components/pages/ProblemsetPage.jsx'
// import SubmitProblemPage from './components/pages/SubmitProblemPage.jsx'
// import ProfilePage from './components/pages/ProfilePage.jsx'
// import ProblemDetailPage from './components/pages/ProblemDetailPage.jsx'
import ContestListPage from './components/pages/ContestListPage.jsx'
import ContestDetailPage from './components/pages/ContestDetailPage.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore.js'
import useThemeStore from './store/useThemeStore.js'
import { Toaster } from 'react-hot-toast'
import ProblemsetPage from './components/pages/ProblemsetPage.jsx'
import { motion, AnimatePresence } from 'motion/react'
import ProblemDetailPage from './components/pages/ProblemDetailPage.jsx'
import ProblemEditor from './components/ProblemEditor.jsx'
import WrapEditor from './components/WrapEditor.jsx'
import ProblemStatement from './components/ProblemStatement.jsx'
import Dashboard from './components/pages/Dashboard.jsx'
import SubmissionsPage from './components/pages/SubmissionsPage.jsx'
import ContestRegisterPage from './components/pages/ContestRegisterPage.jsx'
import Timer from './components/Timer.jsx'
import Leaderboard from './components/pages/Leaderboard.jsx'
import { LogIn } from 'lucide-react'
import HomePage from './components/pages/HomePage.jsx'
import Animation from './components/pages/Animation.jsx'
// import NotFoundPage from './components/pages/NotFoundPage.jsx'

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
    console.log("Auth checked");
  }, [checkAuth]);
  if(1){
    // return <Animation/>
  }
  if (isCheckingAuth) {
    return (
        <motion.div
          key="global.loader"
          className="flex items-center justify-center h-screen"
          data-theme={theme}
        >
          <span className="loading loading-infinity size-16"></span>
        </motion.div>
    );
  }

  if (!authUser) {
    return (
      <div data-theme={theme} className='[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] h-screen min-h-fit overflow-scroll scrollbar-hide bg-base-100/60'>
        <Animation />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </div>
    );
  }
  return (
    <div data-theme={theme} className='[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] h-screen min-h-fit overflow-scroll scrollbar-hide bg-base-100/60'>
      <Animation />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/submissions/page/:pageNumber" element={<SubmissionsPage />} />
        <Route path="/dashboard/submissions" element={<Navigate to="/dashboard/submissions/page/1" replace />} />
        <Route path="/problemset/page/:paramPage" element={<ProblemsetPage />} />
        <Route path="/problemset" element={<Navigate to="/problemset/page/1" replace />} />
        <Route path="/contests/page/:pageNumber" element={<ContestListPage />} />
        <Route path="/contests" element={<Navigate to="/contests/page/1" replace />} />
        <Route path="/contest/:contestId" element={<ContestDetailPage />} />
        <Route path="/problem/:problemId" element={<ProblemDetailPage isAssessment={false}/>} />
        <Route path="/problem/live/:problemId" element={<ProblemDetailPage isAssessment={true}/>} />
        <Route path="/leaderboard/:contestId/page/:paramPage" element={<Leaderboard />} />
        <Route path="/login" element={<Navigate to="/problemset/page/1" replace />} />
        <Route path="/register/:contestId" element={<ContestRegisterPage />} />
        <Route path="*" element={<Navigate to="/problemset/page/1" replace />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
