import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HomePage } from './pages/Home';
import { EmployeeList } from './components/employee/EmployeeList';
import { DepartmentList } from './components/department/DepartmentList';
import { CompanyList } from './components/company/CompanyList';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UsersList } from './components/user/UserList';

export function App() {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('jwtToken'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const location = useLocation();
  const isAuthenticated = !!authToken;

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

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {isAuthPage && !isAuthenticated ? (
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
      ) : (
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
                      ? <EmployeeList authToken={authToken!} />
                      : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/odjeli"
                  element={
                    isAuthenticated
                      ? <DepartmentList authToken={authToken!} />
                      : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/tvrtke"
                  element={
                    isAuthenticated
                      ? <CompanyList authToken={authToken!} />
                      : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/korisnici"
                  element={
                    isAuthenticated
                      ? <UsersList authToken={authToken!} />
                      : <Navigate to="/login" replace />
                  }
                />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
                <Route path="*" element={<div className="text-center text-4xl text-gray-700">404 - Stranica nije pronađena</div>} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
};