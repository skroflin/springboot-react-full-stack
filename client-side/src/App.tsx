import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './components/Login';
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

  return (
    <>
      <Navbar username={username} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="pt-16 px-4 pb-4 bg-gray-50 min-h-screen">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
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
          <Route path="*" element={<h1 className="text-center mt-20 text-4xl text-gray-700">404 - Stranica nije pronađena</h1>} />
        </Routes>
      </div>
    </>
  );
};

export default App;