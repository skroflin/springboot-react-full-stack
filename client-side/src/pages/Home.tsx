import React, { useCallback, useEffect, useState } from 'react';
import { FaHandSpock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/misc/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';

interface HomePageProps {
    authToken: string | null;
    username: string | null;
}

export function HomePage({ authToken, username }: HomePageProps) {
    const navigate = useNavigate();
    const [numOfCompanies, setNumOfCompanies] = useState<{numOfCompanies: number;} | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    if (!authToken) {
        toast.error(`You aren't logged in. Please log in!`);
        navigate('/login');
        setLoading(false);
        return;
    }

    const fetchCompanyData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            const [companyCountResponse, bankruptCountResponse, nonBankruptCountResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/skroflin/company/getNumOfCompanies', {headers}),
                axios.get('http://localhost:8080/api/skroflin/company/getNumOfBankruptCompanies', {headers}),
                axios.get('http://localhost:8080/api/skroflin/company/getNumOfNonBankruptCompanies', {headers})
            ]);

            setNumOfCompanies(companyCountResponse.data);
            // setNumOfBankruptCompanies(bankruptCountResponse.data);
            // setNumOfNonBankruptCompanies(nonBankruptCountResponse.data);

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
        fetchCompanyData();
    }, [fetchCompanyData])

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

    if(numOfCompanies === null && !loading) {

    }
    return (
        <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex justify-start">Dobrodošli{username ? `, ${username}` : ''}! <FaHandSpock className="ml-6" /></h1>
            <Footer />
        </div>
    );
}