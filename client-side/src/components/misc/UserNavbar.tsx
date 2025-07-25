import { FaHome, FaUser } from 'react-icons/fa';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

interface NavbarProps {
    username: string | null;
    isAuthenticated: boolean;
    onLogout: () => void;
}

export function Navbar({ username, isAuthenticated, onLogout }: NavbarProps) {
    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 text-white shadow-md z-10">
            <div className="mx-auto max-w-screen-xl flex justify-between">
                <div className="flex items-center space-x-4">
                    {username && <span className="font-bold text-l mr-4 border-r border-white-400 px-4 flex items-center">{username}! <FaUser className="ml-2" /></span>}
                    <Link to="/home" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center">
                        Home
                        <FaHome className="ml-2" />
                    </Link>
                    <Link to="/djelatnici" className="text-white hover:text-blue-400 transition-colors duration-200">Djelatnici</Link>
                    <Link to="/odjeli" className="text-white hover:text-blue-400 transition-colors duration-200">Odjeli</Link>
                    <Link to="/tvrtke" className="text-white hover:text-blue-400 transition-colors duration-200">Tvrtke</Link>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={onLogout}
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