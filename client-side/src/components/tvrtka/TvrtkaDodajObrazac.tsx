import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface TvrtkaFormProps {
    authToken: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function TvrtkaDodajObrazac({ authToken, onSuccess, onCancel }: TvrtkaFormProps) {
    const [nazivTvrtke, setNazivTvrtke] = useState<string>('');
    const [sjedisteTvrtke, setSjedisteTvrtke] = useState<string>('');
    const [uStjecaju, setUStjecaju] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        try {
            const headers = {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            };

            try {
                const checkResponse = await axios.get(`http://localhost:8080/api/skroflin/tvrtka/getByNaziv?naziv=${encodeURIComponent(nazivTvrtke)}`, { headers });

                if (checkResponse.data && checkResponse.data.length > 0) {
                    setErrorMessage('Tvrtka s ovim nazivom već postoji!');
                    toast.error('Tvrtka s ovim nazivom već postoji!');
                    setLoading(false);
                    return;
                }
            } catch (checkError: any) {
                if (axios.isAxiosError(checkError) && checkError.response?.status !== 404) {
                    throw new Error(checkError.response?.data?.message || 'Greška pri provjeri naziva tvrtke.');
                }
            }

            await axios.post('http://localhost:8080/api/skroflin/tvrtka/post', {
                nazivTvrtke,
                sjedisteTvrtke,
                uStjecaju,
                jeAktivan: true
            }, { headers });

            toast.success('Tvrtka uspješno dodana!');
            onSuccess();
        } catch (err: any) {
            console.error('Greška pri dodavanju tvrtke:', err);
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message || err.message || 'Došlo je do greške pri dodavanju tvrtke.');
                toast.error(err.response?.data?.message || err.message || 'Došlo je do greške pri dodavanju tvrtke.');
            } else {
                setErrorMessage('Došlo je do neočekivane greške.');
                toast.error('Došlo je do neočekivane greške pri dodavanju tvrtke.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dodaj novu tvrtku</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nazivTvrtke" className="block text-sm font-medium text-gray-700">Naziv tvrtke:</label>
                        <input
                            type="text"
                            id="nazivTvrtke"
                            value={nazivTvrtke}
                            onChange={(e) => setNazivTvrtke(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="sjedisteTvrtke" className="block text-sm font-medium text-gray-700">Sjedište tvrtke:</label>
                        <input
                            type="text"
                            id="sjedisteTvrtke"
                            value={sjedisteTvrtke}
                            onChange={(e) => setSjedisteTvrtke(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="uStjecaju"
                            checked={uStjecaju}
                            onChange={(e) => setUStjecaju(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="uStjecaju" className="ml-2 block text-sm text-gray-900">
                            U stečaju
                        </label>
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
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            ) : (
                                'Dodaj tvrtku'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}