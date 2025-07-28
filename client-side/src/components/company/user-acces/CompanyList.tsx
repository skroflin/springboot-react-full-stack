import { useCallback, useState } from "react";
import type { CompanyResponseDTO } from "../../../types/Company";
import { useAuth } from "../../auth/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

export function CompanyList(){
    const [allCompanies, setAllCompanies] = useState<CompanyResponseDTO[]>([]);
    const [displayedCompanies, setDisplayedCompanies] = useState<CompanyResponseDTO[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<CompanyResponseDTO[] | null>([]);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(3);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { authToken } = useAuth();

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!authToken) {
                throw new Error('Auth token is missing!');
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
}