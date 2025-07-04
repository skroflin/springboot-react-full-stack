import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBriefcase, FaBuilding, FaEdit, FaTrash, FaBirthdayCake, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaCity, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';
import { DjelatnikPlacaDetalji } from './DjelatnikPlacaDetalji'; // Prilagodite putanju ako je potrebno

import type { DjelatnikOdgovorDTO, PlacaOdgovorDTO } from '../../types/Djelatnik';
import type { OdjelOdgovorDTO } from '../../types/Odjel';
import type { TvrtkaOdgovorDTO } from '../../types/Tvrtka';

interface DjelatnikListProps {
    authToken: string;
}

export function DjelatnikList({ authToken }: DjelatnikListProps) {
    const [djelatnici, setDjelatnici] = useState<DjelatnikOdgovorDTO[]>([]);
    const [selectedDjelatnik, setSelectedDjelatnik] = useState<DjelatnikOdgovorDTO | null>(null);
    const [placaData, setPlacaData] = useState<{
        sifraDjelatnika: number;
        brutoPlaca: number;
        mirovinsko1Stup: number;
        mirovinsko2Stup: number;
        zdravstvenoOsiguranje: number;
        poreznaOsnovica: number;
        ukupniPorezPrirezi: number;
        netoPlaca: number;
    } | null>(null);
    const [brutoOsnovicaInput, setBrutoOsnovicaInput] = useState<string>('1000.00');

    const [tvrtkaMap, setTvrtkaMap] = useState<Map<number, string>>(new Map());
    const [odjelMap, setOdjelMap] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(4);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            if (!authToken) {
                toast.error('Niste prijavljeni. Molimo prijavite se.');
                navigate('/login');
                setLoading(false);
                return;
            }

            try {
                const [djelatniciResponse, tvrtkeResponse, odjeliResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/skroflin/djelatnik/get', { headers: { 'Authorization': `Bearer ${authToken}` } }),
                    fetch('http://localhost:8080/api/skroflin/tvrtka/get', { headers: { 'Authorization': `Bearer ${authToken}` } }),
                    fetch('http://localhost:8080/api/skroflin/odjel/get', { headers: { 'Authorization': `Bearer ${authToken}` } })
                ]);

                if (!djelatniciResponse.ok) {
                    const errorData = await djelatniciResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP greška pri dohvatu djelatnika: ${djelatniciResponse.status}`);
                }
                const djelatniciData: DjelatnikOdgovorDTO[] = await djelatniciResponse.json();
                setDjelatnici(djelatniciData);

                if (!tvrtkeResponse.ok) {
                    const errorData = await tvrtkeResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP greška pri dohvatu tvrtki: ${tvrtkeResponse.status}`);
                }
                const tvrtkeData: TvrtkaOdgovorDTO[] = await tvrtkeResponse.json();

                if (!odjeliResponse.ok) {
                    const errorData = await odjeliResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP greška pri dohvatu odjela: ${odjeliResponse.status}`);
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
    }, [authToken, navigate]);

    const fetchPlaca = async (sifra: number, brutoOsnovica: string) => {
        const parsedBruto = parseFloat(brutoOsnovica);
        if (isNaN(parsedBruto) || parsedBruto <= 0) {
            setPlacaData(null);
            return;
        }

        if (!authToken) {
            toast.error('Niste prijavljeni. Molimo prijavite se.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/skroflin/djelatnik/izracunajPlacu/${sifra}?brutoOsnovica=${brutoOsnovica}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                let errorMessage: string = 'Nije uspio izračun plaće.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || `HTTP greška: ${response.status} ${response.statusText}`;
                } catch (jsonError) {
                    errorMessage = `HTTP greška: ${response.status} ${response.statusText || 'Nepoznata greška'}. Odgovor nije bio JSON.`;
                }
                throw new Error(errorMessage);
            }

            const rawData: PlacaOdgovorDTO = await response.json();

            const convertedData = {
                sifraDjelatnika: rawData.sifraDjelatnika,
                brutoPlaca: parseFloat(rawData.brutoPlaca),
                mirovinsko1Stup: parseFloat(rawData.mirovinsko1Stup),
                mirovinsko2Stup: parseFloat(rawData.mirovinsko2Stup),
                zdravstvenoOsiguranje: parseFloat(rawData.zdravstvenoOsiguranje),
                poreznaOsnovica: parseFloat(rawData.poreznaOsnovica),
                ukupniPorezPrirezi: parseFloat(rawData.ukupniPorezPrirezi),
                netoPlaca: parseFloat(rawData.netoPlaca),
            };
            setPlacaData(convertedData);
        } catch (error) {
            console.error('Greška pri izračunu plaće:', error);
            if (error instanceof Error) {
                toast.error(`Greška pri izračunu plaće: ${error.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri izračunu plaće.');
            }
            setPlacaData(null);
        }
    };

    useEffect(() => {
        if (selectedDjelatnik && brutoOsnovicaInput) {
            fetchPlaca(selectedDjelatnik.sifra, brutoOsnovicaInput);
        } else {
            setPlacaData(null);
        }
    }, [selectedDjelatnik, brutoOsnovicaInput, authToken]);

    const handleEdit = (djelatnik: DjelatnikOdgovorDTO) => {
        toast.info(`Uređivanje djelatnika: ${djelatnik.imeDjelatnika} ${djelatnik.prezimeDjelatnika}`);
    };

    const handleDelete = async (sifra: number) => {
        if (!window.confirm(`Jeste li sigurni da želite obrisati djelatnika sa šifrom ${sifra}?`)) {
            return;
        }

        if (!authToken) {
            toast.error('Niste prijavljeni.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/skroflin/djelatnik/softDelete/${sifra}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                let errorMessage: string = 'Nije uspjelo brisanje djelatnika.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || `HTTP greška: ${response.status} ${response.statusText}`;
                } catch (jsonError) {
                    errorMessage = `HTTP greška: ${response.status} ${response.statusText || 'Nepoznata greška'}. Odgovor nije bio JSON.`;
                }
                throw new Error(errorMessage);
            }

            toast.success('Djelatnik uspješno obrisan (soft delete)!');
            setDjelatnici(prevDjelatnici => prevDjelatnici.filter(d => d.sifra !== sifra));
            setSelectedDjelatnik(null);
            setPlacaData(null);
        } catch (error) {
            console.error('Greška pri brisanju djelatnika:', error);
            if (error instanceof Error) {
                toast.error(`Greška pri brisanju djelatnika: ${error.message}`);
            } else {
                toast.error('Došlo je do neočekivane greške pri brisanju djelatnika.');
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDjelatnici = djelatnici.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(djelatnici.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setSelectedDjelatnik(null);
        setPlacaData(null);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    if (loading) {
        return <div className="text-center text-lg mt-8 text-gray-600">Učitavanje podataka...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 text-lg mt-8">Greška: {error}</div>;
    }

    if (djelatnici.length === 0 && !loading) {
        return (
            <div className="flex flex-col md:flex-row p-4 min-h-screen bg-gray-100">
                <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Popis djelatnika</h2>
                    <div className="mb-6">
                        <label htmlFor="brutoOsnovica" className="block text-gray-700 text-sm font-bold mb-2">
                            Bruto osnovica za izračun plaće (EUR):
                        </label>
                        <input
                            type="number"
                            id="brutoOsnovica"
                            value={brutoOsnovicaInput}
                            onChange={(e) => setBrutoOsnovicaInput(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Unesite bruto osnovicu"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <p className="text-gray-600">Nema pronađenih djelatnika.</p>
                </div>
                <div className="w-full md:w-1/2 pl-0 md:pl-4 bg-white p-6 rounded-lg shadow-md md:border-l border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalji plaće</h2>
                    <p className="text-gray-600 italic">Odaberite djelatnika s popisa da vidite detalje plaće i grafikon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row p-4 min-h-screen bg-gray-100">
            <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Popis djelatnika</h2>

                <div className="mb-6">
                    <label htmlFor="brutoOsnovica" className="block text-gray-700 text-sm font-bold mb-2">
                        Bruto osnovica za izračun plaće (EUR):
                    </label>
                    <input
                        type="number"
                        id="brutoOsnovica"
                        value={brutoOsnovicaInput}
                        onChange={(e) => setBrutoOsnovicaInput(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Unesite bruto osnovicu"
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {currentDjelatnici.map((djelatnik) => (
                        <div
                            key={djelatnik.sifra}
                            className={`p-4 border rounded-lg cursor-pointer ${selectedDjelatnik?.sifra === djelatnik.sifra ? 'bg-blue-50 border-blue-400 shadow-inner' : 'bg-white hover:bg-gray-100 border-gray-200'} transition-all duration-200`}
                            onClick={() => setSelectedDjelatnik(djelatnik)}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                                <FaUser className="mr-2 text-gray-600" />
                                {djelatnik.imeDjelatnika} {djelatnik.prezimeDjelatnika}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1 flex items-center">
                                <FaBuilding className="mr-2 text-purple-500" />
                                Odjel: {djelatnik.odjelSifra !== null ? odjelMap.get(djelatnik.odjelSifra) || 'Nije dodijeljeno' : 'Nije dodijeljeno'}
                            </p>
                            <p className="text-sm text-gray-600 mb-1 flex items-center">
                                <FaCity className="mr-2 text-red-500" />
                                Tvrtka: {djelatnik.tvrtkaSifra !== null ? tvrtkaMap.get(djelatnik.tvrtkaSifra) || 'Nije dodijeljeno' : 'Nije dodijeljeno'}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                                <FaBriefcase className="mr-2 text-blue-500" />
                                Plaća: {djelatnik.placaDjelatnika.toFixed(2)} EUR
                            </p>
                            <div className="flex justify-end mt-3 space-x-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(djelatnik); }}
                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center text-sm"
                                    title="Uredi"
                                >
                                    <FaEdit className="mr-1" /> Uredi
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(djelatnik.sifra); }}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center text-sm"
                                    title="Obriši"
                                >
                                    <FaTrash className="mr-1" /> Obriši
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        <FaArrowLeft className="mr-2" /> Prethodna
                    </button>
                    <span className="px-4 py-2 text-gray-700 font-semibold">
                        Stranica {currentPage} od {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Sljedeća <FaArrowRight className="ml-2" />
                    </button>
                </div>
            </div>

            <div className="w-full md:w-1/2 pl-0 md:pl-4 bg-white p-6 rounded-lg shadow-md md:border-l border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalji plaće</h2>
                <DjelatnikPlacaDetalji
                    selectedDjelatnik={selectedDjelatnik}
                    placaData={placaData}
                    tvrtkaMap={tvrtkaMap}
                    odjelMap={odjelMap}
                />
            </div>
        </div>
    );
}