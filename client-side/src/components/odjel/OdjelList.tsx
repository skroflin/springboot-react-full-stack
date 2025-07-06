import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBuilding, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from 'react-icons/fa';
import type { OdjelOdgovorDTO } from '../../types/Odjel';
import type { TvrtkaOdgovorDTO } from '../../types/Tvrtka';

interface OdjelListProps {
    authToken: string;
}

export function OdjelList({ authToken }: OdjelListProps) {
    const [odjeli, setOdjeli] = useState<OdjelOdgovorDTO[]>([]);
    const [tvrtkaMap, setTvrtkaMap] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };

            const odjeliResponse = await axios.get<OdjelOdgovorDTO[]>('http://localhost:8080/api/skroflin/odjel/get', { headers });
            setOdjeli(odjeliResponse.data);

            const tvrtkeResponse = await axios.get<TvrtkaOdgovorDTO[]>('http://localhost:8080/api/skroflin/tvrtka/get', { headers });
            const newTvrtkaMap = new Map<number, string>();
            tvrtkeResponse.data.forEach(tvrtka => {
                newTvrtkaMap.set(tvrtka.sifra, tvrtka.nazivTvrtke);
            });
            setTvrtkaMap(newTvrtkaMap);

        } catch (err: any) {
            console.error('Greška pri dohvatu podataka za odjele:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Greška pri dohvatu podataka za odjele.');
                toast.error(err.response?.data?.message || err.message || 'Greška pri dohvatu podataka za odjele.');
            } else {
                setError(err.message || 'Došlo je do neočekivane greške.');
                toast.error(err.message || 'Došlo je do neočekivane greške pri dohvatu podataka za odjele.');
            }
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (sifra: number) => {
        if (!window.confirm('Jeste li sigurni da želite obrisati ovaj odjel?')) {
            return;
        }
        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            await axios.put(`http://localhost:8080/api/skroflin/odjel/softDelete/${sifra}`, {}, { headers });

            setOdjeli(prevOdjeli => prevOdjeli.filter(o => o.sifra !== sifra));
            toast.success('Odjel uspješno obrisan (logički)!');
        } catch (err: any) {
            console.error('Greška pri logičkom brisanju odjela:', err);
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || err.message || 'Greška pri brisanju odjela.');
            } else {
                toast.error(err.message || 'Došlo je do neočekivane greške pri brisanju odjela.');
            }
        }
    };

    const handleEdit = (odjel: OdjelOdgovorDTO) => {
        toast.info(`Uređivanje odjela: ${odjel.nazivOdjela}`);
        console.log('Uredi odjel:', odjel);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <span className="ml-4 text-lg text-gray-600">Učitavanje odjela i tvrtki...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 text-lg mt-8">Greška: {error}</div>;
    }

    if (odjeli.length === 0) {
        return <div className="text-center text-lg mt-8 text-gray-600">Nema pronađenih odjela.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Popis odjela</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {odjeli.map((odjel) => (
                    <div
                        key={odjel.sifra}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 text-4xl">
                                <FaBuilding />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 mt-2 pt-2 border-t border-gray-500">
                                {odjel.nazivOdjela}
                            </h2>
                            {odjel.lokacijaOdjela && (
                                <p className="text-md text-gray-700 text-center mb-1 flex items-center justify-center">
                                    <FaMapMarkerAlt className="mr-2 text-blue-600" /> Lokacija: {odjel.lokacijaOdjela}
                                </p>
                            )}
                            <p className={`text-md text-gray-700 text-center mb-1 flex items-center justify-center ${odjel.jeAktivan ? 'text-green-600' : 'text-red-600'}`}>
                                {odjel.jeAktivan ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                                {odjel.jeAktivan ? 'Aktivan' : 'Neaktivan'}
                            </p>

                            <p className="text-sm text-gray-600 text-center mb-1 flex items-center justify-center">
                                <FaBuilding className="mr-2 text-orange-500" /> Tvrtka: {
                                    odjel.tvrtkaSifra !== null
                                        ? tvrtkaMap.get(odjel.tvrtkaSifra) || 'N/A'
                                        : 'Nije dodijeljeno'
                                }
                            </p>
                        </div>

                        <div className="flex justify-around mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(odjel)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Uredi odjel"
                            >
                                <FaEdit className="mr-1" /> Uredi
                            </button>
                            <button
                                onClick={() => handleDelete(odjel.sifra)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Obriši odjel"
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