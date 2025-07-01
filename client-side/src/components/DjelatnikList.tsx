import React, { useState, useEffect } from 'react';
import type { DjelatnikDTO } from '../types/Djelatnik';

interface DjelatnikListProps {
    authToken: string;
}

export function DjelatnikList({ authToken }: DjelatnikListProps) {
    const [djelatnici, setDjelatnici] = useState<DjelatnikDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDjelatnici = async () => {
            setLoading(true);
            setError(null);

            if (!authToken) {
                setLoading(false);
                setError("Niste prijavljeni ili token nije dostupan.");
                setDjelatnici([]);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/skroflin/djelatnik/get', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP greška: ${response.status} - ${errorData.message || response.statusText}`);
                }

                const data: DjelatnikDTO[] = await response.json();
                setDjelatnici(data);
            } catch (err) {
                console.error("Greška pri dohvatu djelatnika:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Nepoznata greška pri dohvatu djelatnika.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchDjelatnici();
        } else {
            setDjelatnici([]);
            setLoading(false);
            setError("Za prikaz djelatnika potrebno je biti prijavljen.");
        }
    }, [authToken]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-center p-4">Učitavam djelatnike...</div></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-center p-4 text-red-600">Greška: {error}</div></div>;
    }

    if (djelatnici.length === 0 && !loading && !error) {
        return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-gray-600">Nema pronađenih djelatnika (ili niste prijavljeni).</p></div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Popis Djelatnika</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ime</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Prezime</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Plaća</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Početak rada</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Zaposlen</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Odjel (šifra)</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tvrtka (šifra)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {djelatnici.map((djelatnik, index) => (
                            <tr key={djelatnik.imeDjelatnika + djelatnik.prezimeDjelatnika + index} className="hover:bg-gray-50">
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.imeDjelatnika}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.prezimeDjelatnika}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.placaDjelatnika}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.pocetakRada ? new Date(djelatnik.pocetakRada).toLocaleDateString() : 'N/A'}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.jeZaposlen ? 'Da' : 'Ne'}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.odjelSifra ?? 'N/A'}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.tvrtkaSifra ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
