import React, { useState, useEffect } from 'react';
import type { OdjelDTO } from '../types/Odjel';

interface OdjelListProps {
    authToken: string;
}

export function OdjelList({ authToken }: OdjelListProps) {
    const [odjeli, setOdjeli] = useState<OdjelDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOdjeli = async () => {
            setLoading(true);
            setError(null);

            if (!authToken) {
                setLoading(false);
                setError("Niste prijavljeni ili token nije dostupan.");
                setOdjeli([]);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/skroflin/odjel/get', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP greška: ${response.status} - ${errorData.message || response.statusText}`);
                }

                const data: OdjelDTO[] = await response.json();
                setOdjeli(data);
            } catch (err) {
                console.error("Greška pri dohvatu odjela:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Nepoznata greška pri dohvatu odjela.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchOdjeli();
        } else {
            setOdjeli([]);
            setLoading(false);
            setError("Za prikaz odjela potrebno je biti prijavljen.");
        }
    }, [authToken]);

    if (loading) {
        return <div className="text-center p-4">Učitavam odjele...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">Greška: {error}</div>;
    }

    if (odjeli.length === 0 && !loading && !error) {
        return <p className="text-gray-600">Nema pronađenih odjela (ili niste prijavljeni).</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Popis Odjela</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Naziv Odjela</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Lokacija Odjela</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aktivan</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Šifra Tvrtke</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {odjeli.map((odjel, index) => (
                            <tr key={odjel.nazivOdjela + odjel.lokacijaOdjela + String(odjel.aktivan) + index} className="hover:bg-gray-50">
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{odjel.nazivOdjela}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{odjel.lokacijaOdjela}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{odjel.aktivan ? 'Da' : 'Ne'}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{odjel.tvrtkaSifra ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}