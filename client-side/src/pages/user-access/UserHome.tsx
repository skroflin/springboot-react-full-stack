import { useEffect } from 'react';
import { FaHandSpock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/misc/Footer';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/auth/AuthProvider';

export function UserHomePage() {
    const navigate = useNavigate();
    const { authToken, username, role } = useAuth();

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            toast.error('You must be logged in to access this page.');
            return;
        }

        if (role !== 'user') {
            navigate('/login');
            toast.warn('You do not have permission to access this page.');
            return;
        }
    }, [authToken, navigate, role]);

    return (
        <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex justify-start">Dobrodošli{username ? `, ${username}` : ''}! <FaHandSpock className="ml-6" /></h1>
            <Footer />
        </div>
    );
}