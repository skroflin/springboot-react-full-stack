import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HomePage } from './pages/Home';
import { EmployeeList } from './components/employee/admin-access/EmployeeList';
import { DepartmentList } from './components/department/admin-access/DepartmentList';
import { CompanyList } from './components/company/admin-access/CompanyList';
import Navbar from './components/misc/AdminNavbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UsersList } from './components/user/UserList';
import { useAuth } from './components/auth/AuthProvider';

export function App() {
  const { authToken, setAuthToken, role, setRole, username, setUsername } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!authToken;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdmin = role === 'admin' && location.pathname === '/home-page';

  function handleLogout(): void {
    setAuthToken(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

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
            element={<Login />}
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
                  element={isAdmin ? (<Navigate to="/home" replace />) : (<Navigate to="/home" replace />)}
                />
                <Route
                  path="/register"
                  element={<Navigate to="/home" replace />}
                />
                <Route
                  path="/home"
                  element={
                    isAuthenticated && role === 'admin'
                      ? <HomePage authToken={authToken} username={username} role={role}/>
                      : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/djelatnici-admin"
                  element={
                    isAuthenticated && role === 'admin'
                      ? <EmployeeList authToken={authToken!} />
                      : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/odjeli-admin"
                  element={
                    isAuthenticated && role === 'admin'
                      ? <DepartmentList authToken={authToken!} />
                      : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/tvrtke-admin"
                  element={
                    isAuthenticated && role === 'admin'
                      ? <CompanyList authToken={authToken!} />
                      : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/korisnici-admin"
                  element={
                    isAuthenticated && role === 'admin'
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