import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import BottomNav from './components/layout/BottomNav'

// Pages — to be implemented
import Home from './pages/Home/Home'
import Browse from './pages/Browse/Browse'
import Cities from './pages/Cities/Cities'
import Universities from './pages/Universities/Universities'
import UniversityDetail from './pages/UniversityDetail/UniversityDetail'
import ResidenceDetail from './pages/ResidenceDetail/ResidenceDetail'
import Search from './pages/Search/Search'
import SignUp from './pages/Auth/SignUp'
import SignIn from './pages/Auth/SignIn'
import EmailVerification from './pages/Auth/EmailVerification'
import WriteReview from './pages/Review/WriteReview'
import Profile from './pages/Profile/Profile'

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/browse/:province" element={<Cities />} />
        <Route path="/browse/:province/:city" element={<Universities />} />
        <Route path="/university/:universityId" element={<UniversityDetail />} />
        <Route path="/residence/:residenceId" element={<ResidenceDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/review" element={<WriteReview />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
    </AuthProvider>
  )
}
