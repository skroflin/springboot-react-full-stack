import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { TvrtkaDeaktivacijaModal } from './TvrtkaDeaktivacijaModal';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface TvrtkaListProps {
    authToken: string;
}

interface Tvrtka {
    sifra: number;
    nazivTvrtke: string;
    sjedisteTvrtke: string;
    uStjecaju: boolean;
}

export function TvrtkaList({ authToken }: TvrtkaListProps) {
    const [tvrtke, setTvrtke] = useState<Tvrtka[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showDeaktivacijaModal, setShowDeaktivacijaModal] = useState<boolean>(false);
    const [selectedTvrtkaSifra, setSelectedTvrtkaSifra] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(4);

    const fetchTvrtke = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!authToken) {
                throw new Error('Auth Token is missing!');
            }

            const headers = {
                Authorization: `Bearer ${authToken}`,
            };

            const response = await axios.get<Tvrtka[]>('http://localhost:8080/api/skroflin/tvrtka/get', { headers });
            setTvrtke(response.data);
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.message || "Greška prilikom dohvaćanja tvrtki.");
                toast.error(err.response.data.message || "Greška prilikom dohvaćanja tvrtki.");
            } else if (err.request) {
                setError("Nema odgovora sa servera. Provjerite mrežnu vezu.");
                toast.error("Nema odgovora sa servera. Provjerite mrežnu vezu.");
            } else {
                setError(err.message || "Nepoznata greška.");
                toast.error(err.message || "Nepoznata greška.");
            }
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchTvrtke();
    }, [fetchTvrtke]);

    const handleShowDeaktivacijaModal = (sifra: number) => {
        setSelectedTvrtkaSifra(sifra);
        setShowDeaktivacijaModal(true);
    };

    const handleHideDeaktivacijaModal = () => {
        setShowDeaktivacijaModal(false);
        setSelectedTvrtkaSifra(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTvrtke = tvrtke.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tvrtke.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    return (
        <div className="container mx-auto p-4 mt-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Popis Tvrtki</h2>

            {loading && (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2 text-gray-700">Učitavam...</span>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Greška!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {!loading && !error && (
                <>
                    {currentTvrtke.length === 0 ? (
                        <p className="text-center text-gray-600">Nema unesenih tvrtki.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {currentTvrtke.map((tvrtka) => (
                                <div key={tvrtka.sifra} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{tvrtka.nazivTvrtke}</h3>
                                        <p className="text-gray-700 mb-1">
                                            <span className="font-medium">Šifra:</span> {tvrtka.sifra}
                                        </p>
                                        <p className="text-gray-700 mb-1">
                                            <span className="font-medium">Sjedište:</span> {tvrtka.sjedisteTvrtke}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium">U stečaju:</span>{' '}
                                            <span className={tvrtka.uStjecaju ? 'text-red-600 font-bold' : 'text-green-600'}>
                                                {tvrtka.uStjecaju ? 'Da' : 'Ne'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleShowDeaktivacijaModal(tvrtka.sifra)}
                                            disabled={tvrtka.uStjecaju}
                                            className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${tvrtka.uStjecaju
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75'
                                                }`}
                                        >
                                            Deaktiviraj
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-2">
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
                    )}
                </>
            )}

            <TvrtkaDeaktivacijaModal
                show={showDeaktivacijaModal}
                onHide={handleHideDeaktivacijaModal}
                tvrtkaSifra={selectedTvrtkaSifra}
                onSuccess={fetchTvrtke}
                authToken={authToken}
            />
        </div>
    );
}