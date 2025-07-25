import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [active, setActive] = useState(true);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error(`Passwords aren't matching!`);
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/skroflin/user/userRegistration', {
                userName: username,
                password: password,
                email: email,
                role: role,
                active: active,
            });

            toast.success('Registration successful! Heading over to the login form...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            console.error('Error whilst registration:', err);
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error whilst registration.';
                toast.error(`Error whilst registration: ${errorMessage}`);
            } else {
                toast.error('Unexpected error whilst registration.');
            }
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-blue-900 to-gray-700 flex justify-between items-center">
            <div className="text-white mx-20">
                <h1 className="text-6xl font-bold mb-4 justify-start">
                    Registrirajte se
                </h1>
                <p className="text-xl text-gray-300 mt-2 pt-6 border-t border-gray-400">
                    Stvorite novi račun!
                </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg mr-20 w-96">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registracija</h2>
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
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
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
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                            Uloga:
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="user">Korisnik</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="mr-2 leading-tight"
                        />
                        <label htmlFor="active" className="text-sm text-gray-700">
                            Želim biti active korisnik
                        </label>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-400">
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