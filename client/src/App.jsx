import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const {authUser,loading} = useContext(AuthContext) ;
  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#0f0c1d] text-white"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>Restoring your session...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
    <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login"/>} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/"/>} />
        <Route path='/profile' element={authUser ?<Profile /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
