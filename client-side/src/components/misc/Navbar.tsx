import { FaHome, FaUser } from 'react-icons/fa';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { toast } from 'react-toastify';

export function Navbar() {
    const { authToken, setAuthToken, username, setUsername, role, setRole } = useAuth();
    const navigate = useNavigate();
    const isAuthenticated = !!authToken;

    const handleLogout = () => {
        setAuthToken(null);
        setUsername(null);
        setRole(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        toast.success('Successfully logged out.');
        navigate('/login');
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 text-white shadow-md z-10">
            <div className="mx-auto max-w-screen-xl flex justify-between">
                <div className="flex items-center space-x-4">
                    {username &&
                        (<span className="font-bold text-l mr-4 border-r border-white-400 px-4 flex items-center">
                            {username} <FaUser className="ml-2" />
                            <span className="ml-2 text-sm text-gray-300">
                                {role}
                            </span>
                        </span>
                        )}
                    {role === 'admin' ? (
                        <>
                            <Link to="/home-admin" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center">
                                Home
                                <FaHome className="ml-2" />
                            </Link>
                            <Link to="/djelatnici-admin" className="text-white hover:text-blue-400 transition-colors duration-200">Djelatnici</Link>
                            <Link to="/odjeli-admin" className="text-white hover:text-blue-400 transition-colors duration-200">Odjeli</Link>
                            <Link to="/tvrtke-admin" className="text-white hover:text-blue-400 transition-colors duration-200">Tvrtke</Link>
                            <Link to="/korisnici-admin" className="text-white hover:text-blue-400 transition-colors duration-200">Korisnici</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/home" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center">
                                Home
                                <FaHome className="ml-2" />
                            </Link>
                            <Link to="/user-profile" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center">
                                Profile
                            </Link>
                            <Link to="/djelatnici" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center">
                                Home
                                <FaHome className="ml-2" />
                            </Link>
                            <Link to="/odjeli" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center">
                                Home
                                <FaHome className="ml-2" />
                            </Link>
                            <Link to="/tvrtke" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center">
                                Home
                                <FaHome className="ml-2" />
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex items-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded transition-colors duration-200 flex items-center"
                    >
                        Odjava!
                        <RiLogoutBoxRFill className="ml-2" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;