import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    username: string | null;
    isAuthenticated: boolean;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, isAuthenticated, onLogout }) => {
    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 text-white shadow-md z-10 flex justify-between items-center">
            <div className="flex items-center space-x-6">
                {username && <span className="font-bold text-lg mr-4">Dobrodošli, {username}!</span>}
                <Link to="/djelatnici" className="text-white hover:text-blue-400 transition-colors duration-200">Djelatnici</Link>
                <Link to="/odjeli" className="text-white hover:text-blue-400 transition-colors duration-200">Odjeli</Link>
                <Link to="/tvrtke" className="text-white hover:text-blue-400 transition-colors duration-200">Tvrtke</Link>
            </div>
            <div className="flex items-center">
                <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Odjava
                </button>
            </div>
        </nav>
    );
};

export default Navbar;