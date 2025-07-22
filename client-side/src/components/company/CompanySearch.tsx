import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';

import type { CompanyResponseDTO } from '../../types/Company';

interface CompanySearchProps {
    authToken: string;
    onSearchResults: (results: CompanyResponseDTO[]) => void;
    onClearSearch: () => void;
}

export function CompanySearch({ authToken, onSearchResults, onClearSearch }: CompanySearchProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            onClearSearch();
            return;
        }

        setLoadingSearch(true);
        try {
            const headers = {
                Authorization: `Bearer ${authToken}`,
            };
            const response = await axios.get<CompanyResponseDTO[]>(`http://localhost:8080/api/skroflin/company/getByName?name=${encodeURIComponent(searchTerm)}`, { headers });

            onSearchResults(response.data);
            toast.success(`Found ${response.data.length} companies for '${searchTerm}'`);

        } catch (err: any) {
            console.error("Error upon company searching:", err);
            onSearchResults([]);
            if (err.response) {
                if (err.response.status === 404) {
                    toast.info(`No companies found for the name '${searchTerm}'.`);
                } else if (err.response.status === 400) {
                    toast.error(err.response.data.message || "Name is necessary for search.");
                } else {
                    toast.error(err.response.data.message || "Error upon searching for companies.");
                }
            } else if (err.request) {
                toast.error("No response from the server, check your connection.");
            } else {
                toast.error("Unknown error whilst searching.");
            }
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Pretraži tvrtke po nazivu</h3>
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Unesite naziv ili dio naziva tvrtke..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSearch}
                    disabled={loadingSearch}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loadingSearch ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <FaSearch className="mr-2" />
                    )}
                    Pretraži
                </button>
                <button
                    onClick={() => {
                        setSearchTerm('');
                        onClearSearch();
                        toast.info("Pretraga je resetirana, prikazuju se sve tvrtke.");
                    }}
                    className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center"
                >
                    Očisti pretragu
                </button>
            </div>
        </div>
    );
}