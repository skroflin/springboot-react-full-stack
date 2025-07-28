import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import type { CompanyResponseDTO } from '../../../types/Company';
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CompanySearch } from '../CompanySearch';
import { CompanyAddForm } from './CompanyAddForm';
import { CompanyDeactivationModel } from './CompanyDeactivationModel';
import { CompanyViewDetails } from '../CompanyViewDetails';
import { Footer } from '../../misc/Footer';
import { useAuth } from '../../auth/AuthProvider';

export function CompanyList() {
    const [allCompanies, setAllCompanies] = useState<CompanyResponseDTO[]>([]);
    const [displayedCompanies, setDisplayedCompanies] = useState<CompanyResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showDeactivationModel, setShowDeactivationModel] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyResponseDTO | null>(null);
    const [showDetails, setShowDetails] = useState<boolean>(false);

    const [showAddCompanyForm, setShowAddCompanyForm] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);

    const { authToken } = useAuth();

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!authToken) {
                throw new Error('Auth Token is missing!');
            }

            const headers = {
                Authorization: `Bearer ${authToken}`,
            };

            const response = await axios.get<CompanyResponseDTO[]>('http://localhost:8080/api/skroflin/company/get', { headers });
            setAllCompanies(response.data);
            setDisplayedCompanies(response.data);
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Error upon fetching companies.");
                toast.error(err.response?.data?.message || "Error upon fetching companies.");
            } else if (err.request) {
                setError("No response from the server, check your connection.");
                toast.error("No response from the server, check your connection.");
            } else {
                setError(err.message || "Unknown error.");
                toast.error(err.message || "Unknown error.");
            }
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleShowDetails = (company: CompanyResponseDTO) => {
        setSelectedCompany(company);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedCompany(null);
    };

    const handleShowDeactivationModel = (company: CompanyResponseDTO) => {
        setSelectedCompany(company);
        setShowDeactivationModel(true);
    };

    const handleHideDeactivationModel = () => {
        setShowDeactivationModel(false);
        setSelectedCompany(null);
        fetchCompanies();
    };

    const handleSearchResults = (results: CompanyResponseDTO[]) => {
        setDisplayedCompanies(results);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setDisplayedCompanies(allCompanies);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = displayedCompanies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedCompanies.length / itemsPerPage);

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
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-black-600 w-fit">Popis Tvrtki</h2>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowAddCompanyForm(true)}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                    <FaPlus className="mr-2" /> Dodaj novu tvrtku
                </button>
            </div>

            <CompanySearch
                onSearchResults={handleSearchResults}
                onClearSearch={handleClearSearch}
            />

            {loading && (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2 text-gray-700">Učitavam...</span>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Greška!</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {!loading && !error && (
                <>
                    {displayedCompanies.length === 0 ? (
                        <p className="text-center text-gray-600">
                            {
                                currentCompanies.length === 0 && allCompanies.length > 0
                                    ? "Nema pronađenih tvrtki koje odgovaraju kriterijima pretraživanja."
                                    : "Nema unesenih tvrtki."
                            }
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {currentCompanies.map((company) => (
                                <div key={company.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                                    <div>
                                        <h3
                                            onClick={() => handleShowDetails(company)}
                                            className="hover:underline text-l font-semibold text-gray-900 mb-2 text-center"
                                        >
                                            {company.companyName}
                                        </h3>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleShowDeactivationModel(company)}
                                            disabled={company.bankruptcy}
                                            className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${company.bankruptcy
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75'
                                                }`}
                                        >
                                            Deaktiviraj
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {showDetails && selectedCompany?.id == selectedCompany?.id && (
                                <CompanyViewDetails
                                    company={selectedCompany}
                                    show={showDetails}
                                    onClose={handleCloseDetails}
                                />
                            )}
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

            {showAddCompanyForm && (
                <CompanyAddForm
                    onSuccess={() => {
                        setShowAddCompanyForm(false);
                        fetchCompanies();
                    }}
                    onCancel={() => setShowAddCompanyForm(false)}
                />
            )}

            <CompanyDeactivationModel
                show={showDeactivationModel}
                onHide={handleHideDeactivationModel}
                company={selectedCompany}
                onSuccess={fetchCompanies}
            />
            <Footer />
        </div>
    );
}