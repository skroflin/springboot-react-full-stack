import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { OdjelOdgovorDTO } from '../../types/Odjel';

interface TvrtkaDropdownItem {
    sifra: number;
    nazivTvrtke: string;
}

interface OdjelDodajObrazacProps {
    authToken: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function OdjelDodajObrazac({ authToken, onSuccess, onCancel }: OdjelDodajObrazacProps) {
    const [nazivOdjela, setNazivOdjela] = useState<string>('');
    const [lokacijaOdjela, setLokacijaOdjela] = useState<string>('');
    const [tvrtkaSifra, setTvrtkaSifra] = useState<number | null>(null);
    const [tvrtke, setTvrtke] = useState<TvrtkaDropdownItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingTvrtke, setFetchingTvrtke] = useState<boolean>(true);

    useEffect(() => {
        const fetchTvrtkeForDropdown = async () => {
            setFetchingTvrtke(true);
            try {
                const headers = { Authorization: `Bearer ${authToken}` };
                const response = await axios.get<TvrtkaDropdownItem[]>('http://localhost:8080/api/skroflin/tvrtka/get', { headers });
                setTvrtke(response.data);
                if (response.data.length > 0) {
                    setTvrtkaSifra(response.data[0].sifra);
                } else {
                    setTvrtkaSifra(null);
                }
            } catch (err: any) {
                console.error('Greška pri dohvatu tvrtki za dropdown:', err);
                toast.error('Greška pri dohvatu popisa tvrtki.');
                setErrorMessage('Nije moguće dohvatiti popis tvrtki. Pokušajte ponovo.');
            } finally {
                setFetchingTvrtke(false);
            }
        };

        fetchTvrtkeForDropdown();
    }, [authToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        if (tvrtkaSifra === null) {
            setErrorMessage('Molimo odaberite tvrtku.');
            toast.error('Molimo odaberite tvrtku.');
            setLoading(false);
            return;
        }

        try {
            const headers = {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            };

            let odjeliSistimNazivom: OdjelOdgovorDTO[] = [];
            try {
                const checkResponse = await axios.get<OdjelOdgovorDTO[]>(`http://localhost:8080/api/skroflin/odjel/getByNaziv?naziv=${encodeURIComponent(nazivOdjela)}`, { headers });
                odjeliSistimNazivom = checkResponse.data;
            } catch (checkError: any) {
                if (axios.isAxiosError(checkError) && checkError.response?.status === 404) {
                } else if (axios.isAxiosError(checkError) && checkError.response?.status === 401) {
                    throw new Error(checkError.response?.data?.message || 'Neuspjela autorizacija prilikom provjere odjela.');
                } else {
                    throw new Error(checkError.response?.data?.message || 'Greška pri provjeri naziva odjela.');
                }
            }

            const existingOdjelInSelectedTvrtka = odjeliSistimNazivom.find(
                odjel => odjel.tvrtkaSifra === tvrtkaSifra
            );

            if (existingOdjelInSelectedTvrtka) {
                setErrorMessage(`Odjel s nazivom '${nazivOdjela}' već postoji unutar odabrane tvrtke.`);
                toast.error(`Odjel s nazivom '${nazivOdjela}' već postoji unutar odabrane tvrtke.`);
                setLoading(false);
                return;
            }

            await axios.post('http://localhost:8080/api/skroflin/odjel/post', {
                nazivOdjela,
                lokacijaOdjela,
                tvrtkaSifra,
                jeAktivan: true
            }, { headers });

            toast.success('Odjel uspješno dodan!');
            onSuccess();
        } catch (err: any) {
            console.error('Greška pri dodavanju odjela:', err);
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message || err.message || 'Došlo je do greške pri dodavanju odjela.');
                toast.error(err.response?.data?.message || err.message || 'Došlo je do greške pri dodavanju odjela.');
            } else {
                setErrorMessage('Došlo je do neočekivane greške.');
                toast.error('Došlo je do neočekivane greške pri dodavanju odjela.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dodaj novi odjel</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nazivOdjela" className="block text-sm font-medium text-gray-700">Naziv odjela:</label>
                        <input
                            type="text"
                            id="nazivOdjela"
                            value={nazivOdjela}
                            onChange={(e) => setNazivOdjela(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lokacijaOdjela" className="block text-sm font-medium text-gray-700">Lokacija odjela:</label>
                        <input
                            type="text"
                            id="lokacijaOdjela"
                            value={lokacijaOdjela}
                            onChange={(e) => setLokacijaOdjela(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tvrtka" className="block text-sm font-medium text-gray-700">Tvrtka:</label>
                        {fetchingTvrtke ? (
                            <p className="text-gray-500 mt-1">Učitavanje tvrtki...</p>
                        ) : tvrtke.length > 0 ? (
                            <select
                                id="tvrtka"
                                value={tvrtkaSifra === null ? '' : tvrtkaSifra}
                                onChange={(e) => setTvrtkaSifra(Number(e.target.value) || null)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" className="text-gray-500">Odaberite tvrtku</option>
                                {tvrtke.map((tvrtka) => (
                                    <option key={tvrtka.sifra} value={tvrtka.sifra}>
                                        {tvrtka.nazivTvrtke}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-red-500 mt-1">Nema dostupnih tvrtki. Molimo prvo dodajte tvrtku.</p>
                        )}
                    </div>

                    {errorMessage && (
                        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                            disabled={loading}
                        >
                            Odustani
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={loading || tvrtke.length === 0 || tvrtkaSifra === null}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            ) : (
                                'Dodaj odjel'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}