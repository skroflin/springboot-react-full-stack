import { useCallback, useEffect, useState } from "react";
import type { UserResponseDTO } from "../../types/Users";
import axios from "axios";
import { toast } from "react-toastify";
import { UserViewDetails } from "./UserViewDetails";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface UsersListProps {
    authToken: string;
}

export function UsersList({ authToken }: UsersListProps) {
    const [allUsers, setAllUsers] = useState<UserResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage] = useState<number>(3);

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

    const handleViewDetails = (user: UserResponseDTO) => {
        setSelectedUser(user);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedUser(null);
    };

    const indexOfLastItem = currentPage * usersPerPage;
    const indexOfFirstItem = indexOfLastItem - usersPerPage;
    const currentUsers = allUsers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(allUsers.length / usersPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    }

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
                    {currentUsers.map(user => (
                        <div key={user.id} className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Korisničko ime
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Korisnički email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Uloga
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <th onClick={() => handleViewDetails(user)}
                                            scope="row" className="hover:underline px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {user.userName}
                                        </th>
                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.active ? (
                                                <span className="text-green-600">Aktivan</span>
                                            ) : (
                                                <span className="text-red-600">Neaktivan</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            {user.role}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {showDetails && selectedUser?.id === user.id && (
                                <UserViewDetails
                                    authToken={authToken}
                                    user={selectedUser}
                                    show={showDetails}
                                    onClose={handleCloseDetails}
                                />
                            )}
                        </div>
                    ))}
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
        </div>
    )
}