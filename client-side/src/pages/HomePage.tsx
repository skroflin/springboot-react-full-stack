import React from 'react';
import { useNavigate } from 'react-router-dom';

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dobrodošli{username ? `, ${username}` : ''}!</h1>
            <p className="text-lg text-gray-700">
                Ovo je početna stranica vaše aplikacije. Koristite navigacijsku traku
                iznad za pregled djelatnika, odjela ili tvrtki. Aplikacija pruža mogućnosti jednostavnog i efikasnog upravljanja
                djelatnicima, odjelima i tvrtkama.
            </p>
        </div>
    );
}