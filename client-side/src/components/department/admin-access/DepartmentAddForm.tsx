import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CompanyDropdownItem {
    id: number;
    companyName: string;
}

interface DepartmentFormProps {
    authToken: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function DepartmentAddForm({ authToken, onSuccess, onCancel }: DepartmentFormProps) {
    const [departmentName, setDepartmentName] = useState<string>('');
    const [departmentLocation, setDepartmentLocation] = useState<string>('');
    const [companyId, setCompanyId] = useState<number | null>(null);
    const [company, setCompany] = useState<CompanyDropdownItem[]>([]);
    const [active, setActive] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingcompany, setFetchingCompany] = useState<boolean>(true);

    useEffect(() => {
        const fetchcompanyForDropdown = async () => {
            setFetchingCompany(true);
            try {
                const headers = { Authorization: `Bearer ${authToken}` };
                const response = await axios.get<CompanyDropdownItem[]>('http://localhost:8080/api/skroflin/company/get', { headers });
                setCompany(response.data);
                if (response.data.length > 0) {
                    setCompanyId(response.data[0].id);
                } else {
                    setCompanyId(null);
                }
            } catch (err: any) {
                console.error('Error upon fetching companies for dropdown:', err);
                toast.error('Error upon fetching company list.');
                setErrorMessage('Unable to fetch company list. Try again.');
            } finally {
                setFetchingCompany(false);
            }
        };

        fetchcompanyForDropdown();
    }, [authToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        if (companyId === null) {
            setErrorMessage('Please choose a company.');
            toast.error('Please choose a company.');
            setLoading(false);
            return;
        }

        try {
            const headers = {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            };

            try {
                const checkResponse = await axios.get(`http://localhost:8080/api/skroflin/department/getByName?name=${encodeURIComponent(departmentName)}`, { headers });

                if (checkResponse.data && checkResponse.data.length > 0) {
                    setErrorMessage(`Department with the name "${departmentName}" already exists.`);
                    toast.error(`Department with the name "${departmentName}" already exists.`);
                    setLoading(false);
                    return;
                }
            } catch (checkError: any) {
                if (axios.isAxiosError(checkError) && checkError.response?.status !== 404) {
                    throw new Error(checkError.response?.data?.message || 'Error upon checking department name.');
                }
            }

            await axios.post('http://localhost:8080/api/skroflin/department/post', {
                departmentName,
                departmentLocation,
                companyId,
                active,
            }, { headers });

            toast.success('Department succefully added!');
            onSuccess();
        } catch (err: any) {
            console.error('Error upon adding new department:', err);
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message || err.message || 'Error occured upon adding new department.');
                toast.error(err.response?.data?.message || err.message || 'Error occured upon adding new department.');
            } else {
                setErrorMessage('Unexpected error occured.');
                toast.error('Unexpected error occured whilst adding a department.');
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
                        <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Naziv odjela:</label>
                        <input
                            type="text"
                            id="departmentName"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="departmentLocation" className="block text-sm font-medium text-gray-700">Lokacija odjela:</label>
                        <input
                            type="text"
                            id="departmentLocation"
                            value={departmentLocation}
                            onChange={(e) => setDepartmentLocation(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                            Aktivan
                        </label>
                    </div>
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company:</label>
                        {fetchingcompany ? (
                            <p className="text-gray-500 mt-1">Učitavanje tvrtki...</p>
                        ) : company.length > 0 ? (
                            <select
                                id="company"
                                value={companyId === null ? '' : companyId}
                                onChange={(e) => setCompanyId(Number(e.target.value) || null)}
                                className="shadow appearance-none border border-gray-300 rounded-md shadow-sm w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                {company.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.companyName}
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
                            disabled={loading || company.length === 0 || companyId === null}
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