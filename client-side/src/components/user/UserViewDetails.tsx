import { useCallback, useEffect, useState } from "react";
import type { UserResponseDTO } from "../../types/Users";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';

interface UserDetailProps {
    authToken: string;
    user: UserResponseDTO | null;
    show: boolean;
    onClose: () => void;
}

export function UserViewDetails({ authToken, user, onClose }: UserDetailProps) {
    const [userDetails, setUserDetails] = useState<UserResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserDetails = useCallback(async () => {
        if (!user?.id) {
            setUserDetails(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            const response = await axios.get(`http://localhost:8080/api/skroflin/user/getById?id=${user.id}`, { headers });
            setUserDetails(response.data);
        } catch (err: any) {
            console.error('Error upon fetching user details:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Error upon fetching user details.');
                toast.error(err.response?.data?.message || err.message || 'Error upon fetching user details.');
            } else {
                setError(err.message || 'Unexpected error.');
                toast.error(err.message || 'Unexpected error whilst fetching user details.');
            }
        } finally {
            setLoading(false);
        }
    }, [authToken, user]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            {userDetails && (
                <div key={userDetails.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-center text-2xl font-bold text-gray-900 mb-4 border-b border-gray-600">{userDetails.userName}</h3>
                        <p className="text-gray-700">
                            <span className="font-medium">Korisnički email</span> {userDetails.email}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Status</span>{' '}
                            <span className={userDetails.active ? 'text-green-600' : 'text-red-600'}>
                                {userDetails.active ? 'Aktivan' : 'Neaktivan'}
                            </span>
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">
                                Datum kreiranja{' '}
                            </span>
                            {format(new Date(userDetails.dateCreated), 'dd.MM.yyyy HH:mm:ss', { locale: hr })}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">
                                Datum ažuriranja{' '}
                            </span>
                            {format(new Date(userDetails.dateUpdated), 'dd.MM.yyyy HH:mm:ss', { locale: hr })}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">
                                Uloga{' '}
                            </span>
                            {userDetails.role}
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