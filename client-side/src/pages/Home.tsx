import React from 'react';
import { FaHandSpock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/misc/Footer';

interface HomePageProps {
    authToken: string | null;
    username: string | null;
}

export function HomePage({ authToken, username }: HomePageProps) {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!authToken) {
            navigate('/login');
        }
    }, [authToken, navigate]);

    if (!authToken) {
        return null;
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex justify-start">Dobrodošli{username ? `, ${username}` : ''}! <FaHandSpock className="ml-6"/></h1>
            <Footer />
        </div>
    );
}