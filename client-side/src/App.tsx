import React, { useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Login } from './components/Login'
import { HomePage } from './pages/HomePage'

const AuthWrapper: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('jwtToken'))

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token)
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setAuthToken(null)
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route
        path='/djelatnik'
        element={
          authToken ? (
            <HomePage authToken={authToken} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {
        <Route
          path='/'
          element={authToken ? <Navigate to="djelatnik" replace /> : <Navigate to="/login" replace />}
        />
      }
      <Route path='*' element={<h1 className='text-center mt-20 text-4xl text-gray-700'>404 - Stranica nije pronađena</h1>} />
    </Routes >
  )
}

function App() {
  return (
    <Router>
      <div className='App p-4'>
        <AuthWrapper />
      </div>
    </Router>
  )
}

export default App