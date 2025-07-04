import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface LoginProps {
    onLoginSuccess: (token: string, username: string) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/skroflin/korisnik/prijava', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ korisnickoIme: username, lozinka: password }),
            });

            if (!response.ok) {
                let errorMessage: string;
                try {
                    errorMessage = await response.text();
                    if (!errorMessage) {
                        errorMessage = 'Netočno korisničko ime ili lozinka.';
                    }
                } catch (readError) {
                    errorMessage = `HTTP greška: ${response.status} ${response.statusText}.`;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            const jwtToken = data.jwt;
            const loggedInUsername = data.korisnickoIme ?? '';

            onLoginSuccess(jwtToken, loggedInUsername);
            toast.success('Prijava uspješna!');
            navigate('/home');

        } catch (err) {
            console.error('Greška pri prijavi:', err);
            if (err instanceof Error) {
                toast.error(`Greška pri prijavi: ${err.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri prijavi.');
            }
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-gray-900 to-blue-700 flex justify-between items-center">
            <div className="text-white mx-20">
                <h1 className="text-6xl font-bold mb-4 justify-start">
                    Dobrodošli
                </h1>
                <p className="text-xl text-gray-3 mt-2 pt-6 border-t border-gray-400">
                    Prijavite se u Vaš račun!
                </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg mr-20 w-96">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Prijava</h2>
                <form onSubmit={handleSubmit} className='mt-6 pt-4 border-t border-gray-400'>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Korisničko ime:
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Lozinka:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Prijavi se
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Nemate račun?{' '}
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            Registrirajte se ovdje.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}