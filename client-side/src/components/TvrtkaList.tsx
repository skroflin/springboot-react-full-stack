import React, { useState, useEffect } from 'react';
import type { TvrtkaDTO } from '../types/Tvrtka';

interface TvrtkaListProps {
    authToken: string;
}

export function TvrtkaList({ authToken }: TvrtkaListProps) {
    const [tvrtke, setTvrtke] = useState<TvrtkaDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTvrtke = async () => {
            setLoading(true);
            setError(null);

            if (!authToken) {
                setLoading(false);
                setError("Niste prijavljeni ili token nije dostupan.");
                setTvrtke([]);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/skroflin/tvrtka/get', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP greška: ${response.status} - ${errorData.message || response.statusText}`);
                }

                const data: TvrtkaDTO[] = await response.json();
                setTvrtke(data);
            } catch (err) {
                console.error("Greška pri dohvatu tvrtki:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Nepoznata greška pri dohvatu tvrtki.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchTvrtke();
        } else {
            setTvrtke([]);
            setLoading(false);
            setError("Za prikaz tvrtki potrebno je biti prijavljen.");
        }
    }, [authToken]);

    if (loading) {
        return <div className="text-center p-4">Učitavam tvrtke...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">Greška: {error}</div>;
    }

    if (tvrtke.length === 0 && !loading && !error) {
        return <p className="text-gray-600">Nema pronađenih tvrtki (ili niste prijavljeni).</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Popis Tvrtki</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Naziv</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Lokacija</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stječaj</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tvrtke.map((tvrtka, index) => (
                            <tr key={tvrtka.nazivTvrtke + tvrtka.sjedisteTvrtke + String(tvrtka.uStjecaju) + index} className="hover:bg-gray-50">
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{tvrtka.nazivTvrtke}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{tvrtka.sjedisteTvrtke}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                                    {tvrtka.uStjecaju ? 'Da' : 'Ne'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}