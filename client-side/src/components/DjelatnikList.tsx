import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaBriefcase, FaBuilding, FaEdit, FaTrash, FaBirthdayCake, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaCity } from 'react-icons/fa'; // Uklonjene FaEnvelope, FaPhone
import type { DjelatnikOdgovorDTO } from '../types/Djelatnik';
import type { OdjelOdgovorDTO } from '../types/Odjel';
import type { TvrtkaOdgovorDTO } from '../types/Tvrtka';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';

interface DjelatnikListProps {
    authToken: string;
}

export function DjelatnikList({ authToken }: DjelatnikListProps) {
    const [djelatnici, setDjelatnici] = useState<DjelatnikOdgovorDTO[]>([]);
    const [tvrtkaMap, setTvrtkaMap] = useState<Map<number, string>>(new Map());
    const [odjelMap, setOdjelMap] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [djelatniciResponse, tvrtkeResponse, odjeliResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/skroflin/djelatnik/get', { headers: { 'Authorization': `Bearer ${authToken}` } }),
                    fetch('http://localhost:8080/api/skroflin/tvrtka/get', { headers: { 'Authorization': `Bearer ${authToken}` } }),
                    fetch('http://localhost:8080/api/skroflin/odjel/get', { headers: { 'Authorization': `Bearer ${authToken}` } })
                ]);

                if (!djelatniciResponse.ok) {
                    throw new Error(`HTTP greška pri dohvatu djelatnika: ${djelatniciResponse.status}`);
                }
                const djelatniciData: DjelatnikOdgovorDTO[] = await djelatniciResponse.json();
                setDjelatnici(djelatniciData);

                if (!tvrtkeResponse.ok) {
                    throw new Error(`HTTP greška pri dohvatu tvrtki: ${tvrtkeResponse.status}`);
                }
                const tvrtkeData: TvrtkaOdgovorDTO[] = await tvrtkeResponse.json();

                if (!odjeliResponse.ok) {
                    throw new Error(`HTTP greška pri dohvatu odjela: ${odjeliResponse.status}`);
                }
                const odjeliData: OdjelOdgovorDTO[] = await odjeliResponse.json();

                const newTvrtkaMap = new Map<number, string>();
                tvrtkeData.forEach(tvrtka => {
                    newTvrtkaMap.set(tvrtka.sifra, tvrtka.nazivTvrtke);
                });
                setTvrtkaMap(newTvrtkaMap);

                const newOdjelMap = new Map<number, string>();
                odjeliData.forEach(odjel => {
                    newOdjelMap.set(odjel.sifra, odjel.nazivOdjela);
                });
                setOdjelMap(newOdjelMap);

            } catch (err) {
                console.error('Greška pri dohvatu podataka:', err);
                if (err instanceof Error) {
                    setError(err.message);
                    toast.error(`Greška pri dohvatu podataka: ${err.message}`);
                } else {
                    setError('Došlo je do neočekivane greške.');
                    toast.error('Došlo je do neočekivane greške pri dohvatu podataka.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authToken]);

    const handleDelete = async (sifra: number) => {
        if (!window.confirm('Jeste li sigurni da želite obrisati ovog djelatnika?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/skroflin/djelatnik/softDelete/${sifra}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP greška: ${response.status}`);
            }

            setDjelatnici(prevDjelatnici => prevDjelatnici.filter(d => d.sifra !== sifra));
            toast.success('Djelatnik uspješno obrisan (logički)!');
        } catch (err) {
            console.error('Greška pri logičkom brisanju djelatnika:', err);
            if (err instanceof Error) {
                toast.error(`Greška pri brisanju: ${err.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri brisanju djelatnika.');
            }
        }
    };

    const handleEdit = (djelatnik: DjelatnikOdgovorDTO) => {
        toast.info(`Uređivanje djelatnika: ${djelatnik.imeDjelatnika} ${djelatnik.prezimeDjelatnika}`);
        console.log('Uredi djelatnika:', djelatnik);
    };

    if (loading) {
        return <div className="text-center text-lg mt-8 text-gray-600">Učitavanje djelatnika, odjela i tvrtki...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 text-lg mt-8">Greška: {error}</div>;
    }

    if (djelatnici.length === 0) {
        return <div className="text-center text-lg mt-8 text-gray-600">Nema pronađenih djelatnika.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Popis djelatnika</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {djelatnici.map((djelatnik) => (
                    <div
                        key={djelatnik.sifra}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl">
                                    <FaUser />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                                {djelatnik.imeDjelatnika} {djelatnik.prezimeDjelatnika}
                            </h2>
                            <p className="text-md text-gray-700 text-center mb-1 flex items-center justify-center">
                                <FaBriefcase className="mr-2 text-blue-500" /> Plaća: {djelatnik.placaDjelatnika}
                            </p>

                            <p className="text-sm text-gray-600 text-center mb-1 flex items-center justify-center">
                                <FaBuilding className="mr-2 text-purple-500" /> Odjel: {
                                    djelatnik.odjelSifra !== null
                                        ? odjelMap.get(djelatnik.odjelSifra) || 'Nije dodijeljeno'
                                        : 'Nije dodijeljeno'
                                }
                            </p>

                            <p className="text-sm text-gray-600 text-center mb-1 flex items-center justify-center">
                                <FaCity className="mr-2 text-red-500" /> Tvrtka: {
                                    djelatnik.tvrtkaSifra !== null
                                        ? tvrtkaMap.get(djelatnik.tvrtkaSifra) || 'N/A'
                                        : 'Nije dodijeljeno'
                                }
                            </p>

                            <p className="text-sm text-gray-600 text-center mb-1 flex items-center justify-center">
                                <FaCalendarAlt className="mr-2 text-gray-500" /> Početak rada: {
                                    djelatnik.pocetakRada
                                        ? format(new Date(djelatnik.pocetakRada), 'dd.MM.yyyy')
                                        : 'N/A'
                                }
                            </p>
                            <p className={`text-sm text-gray-600 text-center flex items-center justify-center ${djelatnik.jeZaposlen ? 'text-green-600' : 'text-red-600'}`}>
                                {djelatnik.jeZaposlen ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                                {djelatnik.jeZaposlen ? 'Zaposlen' : 'Nije zaposlen'}
                            </p>
                        </div>

                        <div className="flex justify-around mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(djelatnik)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Uredi djelatnika"
                            >
                                <FaEdit className="mr-1" /> Uredi
                            </button>
                            <button
                                onClick={() => handleDelete(djelatnik.sifra)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Obriši djelatnika"
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