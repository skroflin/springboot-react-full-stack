import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLoginSuccess: (token: string, username: string) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/skroflin/korisnik/prijava', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ korisnickoIme: username, lozinka: password }),
            });

            if (!response.ok) {
                let errorMessage = 'Greška pri prijavi.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || response.statusText;
                } catch (jsonError) {
                    errorMessage = `HTTP greška: ${response.status} ${response.statusText}. Odgovor nije bio JSON.`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const jwtToken = data.jwt;
            const loggedInUsername = data.korisnickoIme ?? '';

            onLoginSuccess(jwtToken, loggedInUsername);
            navigate('/djelatnici');
        } catch (err) {
            console.error('Greška pri prijavi:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Došlo je do neočekivane greške.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Prijava</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
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
        </div>
    );
}