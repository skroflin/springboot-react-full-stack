import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [odjeliResponse, tvrtkeResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/skroflin/odjel/get', { headers: { 'Authorization': `Bearer ${authToken}` } }),
                    fetch('http://localhost:8080/api/skroflin/tvrtka/get', { headers: { 'Authorization': `Bearer ${authToken}` } })
                ]);

                if (!odjeliResponse.ok) {
                    throw new Error(`HTTP greška pri dohvatu odjela: ${odjeliResponse.status}`);
                }
                const odjeliData: OdjelOdgovorDTO[] = await odjeliResponse.json();
                setOdjeli(odjeliData);

                if (!tvrtkeResponse.ok) {
                    throw new Error(`HTTP greška pri dohvatu tvrtki: ${tvrtkeResponse.status}`);
                }
                const tvrtkeData: TvrtkaOdgovorDTO[] = await tvrtkeResponse.json();

                const newTvrtkaMap = new Map<number, string>();
                tvrtkeData.forEach(tvrtka => {
                    newTvrtkaMap.set(tvrtka.sifra, tvrtka.nazivTvrtke);
                });
                setTvrtkaMap(newTvrtkaMap);

            } catch (err) {
                console.error('Greška pri dohvatu podataka za odjele:', err);
                if (err instanceof Error) {
                    setError(err.message);
                    toast.error(`Greška pri dohvatu podataka za odjele: ${err.message}`);
                } else {
                    setError('Došlo je do neočekivane greške.');
                    toast.error('Došlo je do neočekivane greške pri dohvatu podataka za odjele.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authToken]);

    const handleDelete = async (sifra: number) => {
        if (!window.confirm('Jeste li sigurni da želite obrisati ovaj odjel?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/skroflin/odjel/softDelete/${sifra}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP greška: ${response.status}`);
            }

            setOdjeli(prevOdjeli => prevOdjeli.filter(o => o.sifra !== sifra));
            toast.success('Odjel uspješno obrisan (logički)!');
        } catch (err) {
            console.error('Greška pri logičkom brisanju odjela:', err);
            if (err instanceof Error) {
                toast.error(`Greška pri brisanju: ${err.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri brisanju odjela.');
            }
        }
    };

    const handleEdit = (odjel: OdjelOdgovorDTO) => {
        toast.info(`Uređivanje odjela: ${odjel.nazivOdjela}`);
        console.log('Uredi odjel:', odjel);
    };

    if (loading) {
        return <div className="text-center text-lg mt-8 text-gray-600">Učitavanje odjela i tvrtki...</div>;
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
                            <p className={`text-md text-gray-700 text-center mb-1 flex items-center justify-center ${odjel.aktivan ? 'text-green-600' : 'text-red-600'}`}>
                                {odjel.aktivan ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                                {odjel.aktivan ? 'Aktivan' : 'Neaktivan'}
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