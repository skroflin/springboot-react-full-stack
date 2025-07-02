import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Lozinke se ne podudaraju!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/skroflin/korisnik/registracija', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ korisnickoIme: username, lozinka: password }),
            });

            if (!response.ok) {
                let errorMessage = 'Greška pri registraciji.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || response.statusText;
                } catch (jsonError) {
                    errorMessage = `HTTP greška: ${response.status} ${response.statusText}. Odgovor nije bio JSON.`;
                }
                throw new Error(errorMessage);
            }

            toast.success('Registracija uspješna! Preusmjeravam na stranicu za prijavu...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Greška pri registraciji:', err);
            if (err instanceof Error) {
                toast.error(`Greška pri registraciji: ${err.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri registraciji.');
            }
        }
    };

    return (
        <div className="flex w-full h-screen bg-gradient-to-br from-blue-900 to-blue-700 justify-between items-center">
            <div className="text-white mx-20">
                <h1 className="text-6xl font-bold mb-4 justify-start">
                    Registrirajte se
                </h1>
                <p className="text-xl text-gray-300">
                    Stvorite novi račun!
                </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg mr-20 w-96">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registracija</h2>
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
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-700 text-sm font-bold mb-2">
                            Lozinka:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Potvrdi lozinku:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Registriraj se
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Već imate račun?{' '}
                        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            Prijavite se ovdje.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}