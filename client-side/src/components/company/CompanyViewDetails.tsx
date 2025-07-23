import { useCallback, useEffect, useState } from "react";
import type { CompanyResponseDTO } from "../../types/Company";
import axios from "axios";
import { toast } from "react-toastify";

interface CompanyDetailProps {
    authToken: string;
    company: CompanyResponseDTO | null;
    show: boolean;
    onClose: () => void;
}

export function CompanyViewDetails({ authToken, company, onClose }: CompanyDetailProps) {
    const [companyDetails, setCompanyDetails] = useState<CompanyResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanyDetails = useCallback(async () => {
        if (!company?.id) {
            setCompanyDetails(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            const response = await axios.get(`http://localhost:8080/api/skroflin/company/getById?id=${company.id}`, { headers });
            setCompanyDetails(response.data);
        } catch (err: any) {
            console.error('Error upon fetching company details:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Error upon fetching company details.');
                toast.error(err.response?.data?.message || err.message || 'Error upon fetching company details.');
            } else {
                setError(err.message || 'Unexpected error.');
                toast.error(err.message || 'Unexpected error whilst fetching company details.');
            }
        } finally {
            setLoading(false);
        }
    }, [authToken, company]);

    useEffect(() => {
        fetchCompanyDetails();
    }, [fetchCompanyDetails]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            {companyDetails && (
                <div key={companyDetails.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-center text-2xl font-bold text-gray-900 mb-4 border-b border-gray-600">{companyDetails.companyName}</h3>
                        <p className="text-gray-700">
                            <span className="font-medium">Sjedište:</span> {companyDetails.companyLocation}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">U stečaju:</span>{' '}
                            <span className={companyDetails.bankruptcy ? 'text-red-600' : 'text-green-600'}>
                                {companyDetails.bankruptcy ? 'Da' : 'Ne'}
                            </span>
                        </p>
                    </div>
                    <div className="flex justify-center space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                            disabled={loading}
                        >
                            Zatvori
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}