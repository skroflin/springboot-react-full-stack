import React from "react";
import { DjelatnikList } from "../components/DjelatnikList";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
    authToken: string | null
    onLogout: () => void
}

export function HomePage({ authToken, onLogout }: HomePageProps) {
    const navigate = useNavigate()
    if (!authToken) {
        navigate('/login')
        return null
    }

    const handleLogout = () => {
        onLogout()
        navigate('/login')
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Pregled djelatnika
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Odjava
                </button>
            </div>
            <DjelatnikList authToken={authToken} />
        </div>
    )
}