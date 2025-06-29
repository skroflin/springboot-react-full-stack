import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    onLoginSuccess: (token: string) => void
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await fetch('http://localhost:8080/api/skroflin/korisnik/prijava', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    korisnickoIme: username,
                    lozinka: password
                })
            })

            console.log('Response:', response);

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Neispravno korisničko ime ili lozinka!')
            }

            const data = await response.json()
            const jwtToken = data.jwt

            localStorage.setItem('jwtToken', jwtToken)
            onLoginSuccess(jwtToken)
            navigate('/djelatnik')
        } catch (err) {
            console.error('Greška pri prijavi:', err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Došlo je do neočekivane greške.')
            }
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Prijava
                </h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Korisničko ime
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline"
                            required
                        />
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                Lozinka
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                                Prijavi se
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}