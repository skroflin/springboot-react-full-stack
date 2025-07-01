import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { HomePage } from './pages/HomePage';
import { DjelatnikList } from './components/DjelatnikList';
import { OdjelList } from './components/OdjelList';
import { TvrtkaList } from './components/TvrtkaList';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('jwtToken'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const location = useLocation();
  const isAuthenticated = !!authToken;

  // Odredimo je li trenutna stranica login ili register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLoginSuccess = (token: string, userIdentifier: string) => {
    setAuthToken(token);
    setUsername(userIdentifier);
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('username', userIdentifier);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUsername(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
  };

  if (isAuthPage && !isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      {!isAuthPage && <Navbar username={username} isAuthenticated={isAuthenticated} onLogout={handleLogout} />}

      <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/login"
              element={<Navigate to="/home" replace />}
            />
            <Route
              path="/register"
              element={<Navigate to="/home" replace />}
            />
            <Route
              path="/home"
              element={
                isAuthenticated
                  ? <HomePage authToken={authToken} username={username} />
                  : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/djelatnici"
              element={
                isAuthenticated
                  ? <DjelatnikList authToken={authToken!} />
                  : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/odjeli"
              element={
                isAuthenticated
                  ? <OdjelList authToken={authToken!} />
                  : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/tvrtke"
              element={
                isAuthenticated
                  ? <TvrtkaList authToken={authToken!} />
                  : <Navigate to="/login" replace />
              }
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
            <Route path="*" element={<div className="text-center text-4xl text-gray-700">404 - Stranica nije pronađena</div>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;