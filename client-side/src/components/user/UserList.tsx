import { useCallback, useEffect, useState } from "react";
import type { UserResponseDTO } from "../../types/Users";
import axios from "axios";
import { toast } from "react-toastify";

interface UsersListProps {
    authToken: string;
}

export function UsersList({ authToken }: UsersListProps) {
    const [allUsers, setAllUsers] = useState<UserResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!authToken) {
                throw new Error("Auth token is missing!");
            }

            const headers = {
                Authorization: `Bearer ${authToken}`,
            };

            const response = await axios.get<UserResponseDTO[]>('http://localhost:8080/api/skroflin/user/get', { headers });
            setAllUsers(response.data);
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Error upon fetching users.");
                toast.error(err.response?.data?.message || "Error upon fetching users.");
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
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="container mx-auto p-4 mt-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-black-600 w-fit">Popis Korisnika</h2>
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
                    <div className="grid grid-cels-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {allUsers.map(user => (
                            <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                                <p className="text-gray-700">Email: {user.email}</p>
                                <p className={`text-sm ${user.active ? 'text-green-600' : 'text-red-600'}`}>
                                    Status: {user.active ? 'Aktivan' : 'Neaktivan'}
                                </p>
                                <p className="text-gray-700">Role: {user.role}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}