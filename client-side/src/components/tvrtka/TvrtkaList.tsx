import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBuilding, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaClock } from 'react-icons/fa';
import type { TvrtkaOdgovorDTO } from '../../types/Tvrtka';

interface TvrtkaListProps {
    authToken: string;
}

export function TvrtkaList({ authToken }: TvrtkaListProps) {
    const [tvrtke, setTvrtke] = useState<TvrtkaOdgovorDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState<boolean>(false);
    const [tvrtkaToDeactivateSifra, setTvrtkaToDeactivateSifra] = useState<number | null>(null);
    const [tvrtkaToDeactivateNaziv, setTvrtkaToDeactivateNaziv] = useState<string | null>(null);


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

    const handleDeactivateClick = (sifra: number, naziv: string) => {
        setTvrtkaToDeactivateSifra(sifra);
        setTvrtkaToDeactivateNaziv(naziv);
        setShowDeactivateModal(true);
    };

    const confirmDeactivation = async () => {
        if (tvrtkaToDeactivateSifra === null) return;

        setShowDeactivateModal(false);

        try {
            console.log('Attempting to deactivate tvrtka:', tvrtkaToDeactivateSifra);
            console.log('Auth Token:', authToken);
            console.log('Request Headers:', { 'Authorization': `Bearer ${authToken}` });
            const response = await fetch(`http://localhost:8080/api/skroflin/tvrtka/softDelete?sifra=${tvrtkaToDeactivateSifra}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.ok) {
                if (response.status === 204) {
                    setTvrtke(prevTvrtke => prevTvrtke.filter(t => t.sifra !== tvrtkaToDeactivateSifra));
                    toast.success('Tvrtka uspješno deaktivirana!');
                } else {
                    const data = await response.json();
                    console.log('Odgovor s API-ja:', data);

                    setTvrtke(prevTvrtke => prevTvrtke.filter(t => t.sifra !== tvrtkaToDeactivateSifra));
                    toast.success('Tvrtka uspješno deaktivirana!');
                }
            } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP greška: ${response.status} - ${response.statusText}`);
                } else {
                    const errorText = await response.text();
                    throw new Error(`HTTP greška: ${response.status} - ${response.statusText}. Odgovor: ${errorText.substring(0, 100)}...`);
                }
            }
        } catch (err) {
            console.error('Greška pri deaktivaciji tvrtke:', err);
            if (err instanceof Error) {
                toast.error(`Greška pri deaktivaciji: ${err.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri deaktivaciji tvrtke.');
            }
        } finally {
            setTvrtkaToDeactivateSifra(null);
            setTvrtkaToDeactivateNaziv(null);
        }
    };

    const cancelDeactivation = () => {
        setShowDeactivateModal(false);
        setTvrtkaToDeactivateSifra(null);
        setTvrtkaToDeactivateNaziv(null);
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
                                <p className="text-md text-gray-700 text-center mb-1 flex items-center justify-center mt-2 pt-2 border-t border-gray-500">
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
                                onClick={() => handleDeactivateClick(tvrtka.sifra, tvrtka.nazivTvrtke)}
                                className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Deaktiviraj tvrtku"
                            >
                                <FaClock className="mr-1" /> Deaktiviraj
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showDeactivateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm mx-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Potvrda deaktivacije</h2>
                        <p className="text-gray-700 mb-6">
                            Jeste li sigurni da želite deaktivirati tvrtku <span className="font-semibold">"{tvrtkaToDeactivateNaziv}"</span>?
                            Ovom radnjom deaktivirate tvrtku.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDeactivation}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Odustani
                            </button>
                            <button
                                onClick={confirmDeactivation}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                            >
                                Deaktiviraj
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}