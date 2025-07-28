import { useCallback, useEffect, useState } from 'react';
import { FaHandSpock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/misc/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthProvider';

export function HomePage() {
    const navigate = useNavigate();
    const [numOfCompanies, setNumOfCompanies] = useState<number | null>(null);
    const [numOfBankruptCompanies, setNumOfBankruptCompanies] = useState<number | null>(null);
    const [numOfNonBankruptCompanies, setNumOfNonBankruptCompanies] = useState<number | null>(null);
    const [numOfDepartments, setNumOfDepartments] = useState<number | null>(null);
    const [numOfActiveDepartments, setNumOfActiveDepartments] = useState<number | null>(null);
    const [numOfInactiveDepartments, setNumOfInactiveDepartments] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { authToken, username, role } = useAuth();

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            toast.error('You must be logged in to access this page.');
            return;
        }

        if (role !== 'admin') {
            navigate('/login');
            toast.warn('You do not have permission to access this page.');
            return;
        }
    }, [authToken, navigate, role]);

    const fetchCompanyData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setNumOfCompanies(null);
        setNumOfBankruptCompanies(null);
        setNumOfNonBankruptCompanies(null);

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            const [companyCountResponse, bankruptCountResponse, nonBankruptCountResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/skroflin/company/getNumOfCompanies', { headers }),
                axios.get('http://localhost:8080/api/skroflin/company/getNumOfBankruptCompanies', { headers }),
                axios.get('http://localhost:8080/api/skroflin/company/getNumOfNonBankruptCompanies', { headers })
            ]);

            setNumOfCompanies(companyCountResponse.data);
            setNumOfBankruptCompanies(bankruptCountResponse.data);
            setNumOfNonBankruptCompanies(nonBankruptCountResponse.data);

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

    const fetchDepartmentData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setNumOfDepartments(null);
        setNumOfActiveDepartments(null);
        setNumOfInactiveDepartments(null);

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            const [departmentCountResponse, activeDepartmentCountResponse, inactiveDepartmentCountResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/skroflin/department/getNumOfDepartments', { headers }),
                axios.get('http://localhost:8080/api/skroflin/department/getNumOfActiveDepartments', { headers }),
                axios.get('http://localhost:8080/api/skroflin/department/getNumOfInactiveDepartments', { headers })
            ]);

            setNumOfDepartments(departmentCountResponse.data);
            setNumOfActiveDepartments(activeDepartmentCountResponse.data);
            setNumOfInactiveDepartments(inactiveDepartmentCountResponse.data);
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
        if (authToken && role === 'admin') {
            fetchCompanyData();
            fetchDepartmentData();
        }
    }, [fetchCompanyData, fetchDepartmentData, authToken, role]);

    if (loading) {
        return <div className="text-center text-lg mt-8 text-gray-600">Učitavanje podataka...</div>;
    }

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex justify-start">Dobrodošli{username ? `, ${username}` : ''}! <FaHandSpock className="ml-6" /></h1>
                <div className="text-red-600 text-lg">{error}</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex justify-start">Dobrodošli{username ? `, ${username}` : ''}! <FaHandSpock className="ml-6" /></h1>
            {loading ? (
                <div className="flex-grow text-center text-lg mt-8 text-gray-600">Učitavanje podataka...</div>
            ) : error ? (
                <div className="flex-grow text-red-600 text-lg mt-8">{error}</div>
            ) : (
                <div className="flex-grow flex justify-center items-center mt-8 space-x-2 border-t border-gray-200 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 py-2">Broj tvrtki</h2>
                            <p className="text-3xl font-bold text-gray-700">{numOfCompanies}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 py-2">Broj tvrtki u stečaju</h2>
                            <p className="text-3xl font-bold text-gray-700">
                                <span className="text-gray-400">
                                    {numOfBankruptCompanies}
                                </span>
                                /{numOfCompanies}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 py-2">Broj tvrtki koje nisu u stečaju</h2>
                            <p className="text-3xl font-bold text-gray-700">
                                <span className="text-gray-500">
                                    {numOfNonBankruptCompanies}
                                </span>
                                /{numOfCompanies}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 py-2">Broj odjela</h2>
                            <p className="text-3xl font-bold text-gray-700">{numOfDepartments}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 py-2">Broj aktivnih odjela</h2>
                            <p className="text-3xl font-bold text-gray-700">
                                <span className="text-gray-500">
                                    {numOfActiveDepartments}
                                </span>
                                /{numOfDepartments}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 py-2">Broj neaktivnih odjela</h2>
                            <p className="text-3xl font-bold text-gray-700">
                                <span className="text-gray-500">
                                    {numOfInactiveDepartments}
                                </span>
                                /{numOfDepartments}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}