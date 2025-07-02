import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBuilding, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from 'react-icons/fa';
import type { TvrtkaOdgovorDTO } from '../../types/Tvrtka';

interface TvrtkaListProps {
    authToken: string;
}

export function TvrtkaList({ authToken }: TvrtkaListProps) {
    const [tvrtke, setTvrtke] = useState<TvrtkaOdgovorDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTvrtke = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/skroflin/tvrtka/get', {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });

                if (!response.ok) {
                    throw new Error(`HTTP greška: ${response.status}`);
                }

                const data: TvrtkaOdgovorDTO[] = await response.json();
                setTvrtke(data);
            } catch (err) {
                console.error('Greška pri dohvatu tvrtki:', err);
                if (err instanceof Error) {
                    setError(err.message);
                    toast.error(`Greška pri dohvatu tvrtki: ${err.message}`);
                } else {
                    setError('Došlo je do neočekivane greške.');
                    toast.error('Došlo je do neočekivane greške pri dohvatu tvrtki.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTvrtke();
    }, [authToken]);

    const handleDelete = async (sifra: number) => {
        if (!window.confirm('Jeste li sigurni da želite obrisati ovu tvrtku?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/skroflin/tvrtka/softDelete?sifra=${sifra}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP greška: ${response.status}`);
            }

            setTvrtke(prevTvrtke => prevTvrtke.filter(t => t.sifra !== sifra));
            toast.success('Tvrtka uspješno obrisana (logički)!');
        } catch (err) {
            console.error('Greška pri logičkom brisanju tvrtke:', err);
            if (err instanceof Error) {
                toast.error(`Greška pri brisanju: ${err.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri brisanju tvrtke.');
            }
        }
    };

    const handleEdit = (tvrtka: TvrtkaOdgovorDTO) => {
        toast.info(`Uređivanje tvrtke: ${tvrtka.nazivTvrtke}`);
        console.log('Uredi tvrtku:', tvrtka);
    };

    if (loading) {
        return <div className="text-center text-lg mt-8 text-gray-600">Učitavanje tvrtki...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 text-lg mt-8">Greška: {error}</div>;
    }

    if (tvrtke.length === 0) {
        return <div className="text-center text-lg mt-8 text-gray-600">Nema pronađenih tvrtki.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Popis tvrtki</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tvrtke.map((tvrtka) => (
                    <div
                        key={tvrtka.sifra}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl">
                                    <FaBuilding />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                                {tvrtka.nazivTvrtke}
                            </h2>

                            {tvrtka.sjedisteTvrtke && (
                                <p className="text-md text-gray-700 text-center mb-1 flex items-center justify-center">
                                    <FaMapMarkerAlt className="mr-2 text-red-500" /> Sjedište: {tvrtka.sjedisteTvrtke}
                                </p>
                            )}
                            <p className={`text-md text-gray-700 text-center mb-1 flex items-center justify-center ${tvrtka.uStjecaju ? 'text-red-600' : 'text-green-600'}`}>
                                {tvrtka.uStjecaju ? <FaTimesCircle className="mr-2" /> : <FaCheckCircle className="mr-2" />}
                                {tvrtka.uStjecaju ? 'U stečaju' : 'Aktivna'}
                            </p>
                        </div>

                        <div className="flex justify-around mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(tvrtka)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Uredi tvrtku"
                            >
                                <FaEdit className="mr-1" /> Uredi
                            </button>
                            <button
                                onClick={() => handleDelete(tvrtka.sifra)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Obriši tvrtku"
                            >
                                <FaTrash className="mr-1" /> Obriši
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}