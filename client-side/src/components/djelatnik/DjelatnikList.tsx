import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';
import { FaUser, FaBriefcase, FaBuilding, FaEdit, FaTrash, FaBirthdayCake, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaCity, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
    const [itemsPerPage] = useState<number>(5);

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

                <ul className="space-y-3">
                    {currentDjelatnici.map((djelatnik) => (
                        <li
                            key={djelatnik.sifra}
                            className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center
                                ${selectedDjelatnik?.sifra === djelatnik.sifra ? 'bg-blue-50 border-blue-400 shadow-inner' : 'bg-white hover:bg-gray-100 border-gray-200'}
                                transition-all duration-200`}
                            onClick={() => setSelectedDjelatnik(djelatnik)}
                        >
                            <span className="text-lg font-medium text-gray-700">
                                {djelatnik.imeDjelatnika} {djelatnik.prezimeDjelatnika}
                                {djelatnik.odjelSifra !== null && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({odjelMap.get(djelatnik.odjelSifra) || 'N/A'})
                                    </span>
                                )}
                                {djelatnik.tvrtkaSifra !== null && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({tvrtkaMap.get(djelatnik.tvrtkaSifra) || 'N/A'})
                                    </span>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>

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

                {selectedDjelatnik ? (
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">
                            Plaća za: {selectedDjelatnik.imeDjelatnika} {selectedDjelatnik.prezimeDjelatnika}
                        </h3>
                        {placaData ? (
                            <div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={[
                                            { name: 'Bruto plaća', value: placaData.brutoPlaca },
                                            { name: 'Neto plaća', value: placaData.netoPlaca },
                                            { name: 'Mirovinsko 1', value: placaData.mirovinsko1Stup },
                                            { name: 'Mirovinsko 2', value: placaData.mirovinsko2Stup },
                                            { name: 'Zdravstveno', value: placaData.zdravstvenoOsiguranje },
                                            { name: 'Porez i Prirezi', value: placaData.ukupniPorezPrirezi }
                                        ]}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value: number) => `${value.toFixed(2)} EUR`} />
                                        <Legend />
                                        <Bar dataKey="value" fill="#60A5FA" />
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-md text-gray-700 mb-1">
                                        <span className="font-semibold">Bruto plaća:</span> {placaData.brutoPlaca.toFixed(2)} EUR
                                    </p>
                                    <p className="text-md text-gray-700 mb-1">
                                        <span className="font-semibold">Neto plaća:</span> {placaData.netoPlaca.toFixed(2)} EUR
                                    </p>
                                    <hr className="my-3 border-gray-200" />
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Mirovinsko I. stup:</span> {placaData.mirovinsko1Stup.toFixed(2)} EUR
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Mirovinsko II. stup:</span> {placaData.mirovinsko2Stup.toFixed(2)} EUR
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Zdravstveno osiguranje:</span> {placaData.zdravstvenoOsiguranje.toFixed(2)} EUR
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Ukupni porez i prirezi:</span> {placaData.ukupniPorezPrirezi.toFixed(2)} EUR
                                    </p>
                                    <hr className="my-3 border-gray-200" />
                                    <p className="text-md text-gray-700 font-semibold">
                                        Ukupni odbici: {(placaData.mirovinsko1Stup + placaData.mirovinsko2Stup + placaData.zdravstvenoOsiguranje + placaData.ukupniPorezPrirezi).toFixed(2)} EUR
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">Učitavanje podataka o plaći...</p>
                        )}

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-lg font-semibold mb-3 text-gray-700">Podaci o djelatniku:</h4>
                            <p className="text-md text-gray-700 mb-1 flex items-center">
                                <FaUser className="mr-2 text-gray-500" />
                                <span className="font-semibold mr-1">Ime i Prezime:</span> {selectedDjelatnik.imeDjelatnika} {selectedDjelatnik.prezimeDjelatnika}
                            </p>
                            <p className="text-md text-gray-700 mb-1 flex items-center">
                                <FaBriefcase className="mr-2 text-blue-500" />
                                <span className="font-semibold mr-1">Plaća djelatnika:</span> {selectedDjelatnik.placaDjelatnika.toFixed(2)} EUR
                            </p>
                            <p className="text-md text-gray-700 mb-1 flex items-center">
                                <FaBuilding className="mr-2 text-purple-500" />
                                <span className="font-semibold mr-1">Odjel:</span> {
                                    selectedDjelatnik.odjelSifra !== null
                                        ? odjelMap.get(selectedDjelatnik.odjelSifra) || 'Nije dodijeljeno'
                                        : 'Nije dodijeljeno'
                                }
                            </p>
                            <p className="text-md text-gray-700 mb-1 flex items-center">
                                <FaCity className="mr-2 text-red-500" />
                                <span className="font-semibold mr-1">Tvrtka:</span> {
                                    selectedDjelatnik.tvrtkaSifra !== null
                                        ? tvrtkaMap.get(selectedDjelatnik.tvrtkaSifra) || 'Nije dodijeljeno'
                                        : 'Nije dodijeljeno'
                                }
                            </p>
                            {selectedDjelatnik.datumRodenja && (
                                <p className="text-md text-gray-700 mb-1 flex items-center">
                                    <FaBirthdayCake className="mr-2 text-pink-500" />
                                    <span className="font-semibold mr-1">Datum rođenja:</span> {
                                        format(new Date(selectedDjelatnik.datumRodenja), 'dd.MM.yyyy', { locale: hr })
                                    }
                                </p>
                            )}
                            <p className="text-md text-gray-700 mb-1 flex items-center">
                                <FaCalendarAlt className="mr-2 text-gray-500" />
                                <span className="font-semibold mr-1">Početak rada:</span> {
                                    format(new Date(selectedDjelatnik.pocetakRada), 'dd.MM.yyyy', { locale: hr })
                                }
                            </p>
                            <p className={`text-md text-gray-700 flex items-center ${selectedDjelatnik.jeZaposlen ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedDjelatnik.jeZaposlen ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                                <span className="font-semibold mr-1">Status zaposlenja:</span> {selectedDjelatnik.jeZaposlen ? 'Zaposlen' : 'Nije zaposlen'}
                            </p>
                        </div>

                        <div className="flex justify-around mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => selectedDjelatnik && handleEdit(selectedDjelatnik)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Uredi djelatnika"
                            >
                                <FaEdit className="mr-1" />
                                Uredi
                            </button>
                            <button
                                onClick={() => selectedDjelatnik && handleDelete(selectedDjelatnik.sifra)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Obriši djelatnika"
                            >
                                <FaTrash className="mr-1" />
                                Obriši
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 italic">Odaberite djelatnika s popisa da vidite detalje plaće i grafikon.</p>
                )}
            </div>
        </div>
    );
}