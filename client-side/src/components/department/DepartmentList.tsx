import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBuilding, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import type { DepartmentResponseDTO } from '../../types/Department';
import type { CompanyResponseDTO } from '../../types/Company';
import { DepartmentAddForm } from './DepartmentAddForm';
import { DepartmentEditForm } from './DepartmentEditForm';
import { Footer } from '../misc/Footer';

interface Department {
    authToken: string;
}

export function DepartmentList({ authToken }: Department) {
    const [department, setDepartment] = useState<DepartmentResponseDTO[]>([]);
    const [company, setCompanyMap] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddDepartmentForm, setShowAddDepartmentForm] = useState<boolean>(false);
    const [showEditDepartmentForm, setShowEditDepartmentForm] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };

            const departmentResponse = await axios.get<DepartmentResponseDTO[]>('http://localhost:8080/api/skroflin/department/get', { headers });
            setDepartment(departmentResponse.data);

            const tvrtkeResponse = await axios.get<CompanyResponseDTO[]>('http://localhost:8080/api/skroflin/company/get', { headers });
            const newcompany = new Map<number, string>();
            tvrtkeResponse.data.forEach(company => {
                newcompany.set(company.id, company.companyLocation);
            });
            setCompanyMap(newcompany);

        } catch (err: any) {
            console.error('Error upon fetching data for departments:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Error upon fetching data for departments.');
                toast.error(err.response?.data?.message || err.message || 'Error upon fetching data for departments.');
            } else {
                setError(err.message || 'Unexpected error.');
                toast.error(err.message || 'Unexpected error whilst fetching data for departments.');
            }
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSoftDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to deactivate this department?')) {
            return;
        }
        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            await axios.put(`http://localhost:8080/api/skroflin/department/softDelete/${id}`, {}, { headers });

            setDepartment(prevdepartment => prevdepartment.filter(d => d.companyId !== id));
            toast.success('Department successfully deactivated!');
        } catch (err: any) {
            console.error('Error upon deactivating department:', err);
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || err.message || 'Error upon deactivating department.');
            } else {
                toast.error(err.message || 'Unexpected error whilst deactivating department.');
            }
        }
    };

    const handleShowAddDepartmentForm = () => {
        setShowAddDepartmentForm(true);
    };

    const handleHideAddDepartmentForm = () => {
        setShowAddDepartmentForm(false);
        fetchData();
    };

    const handleShowEditDepartmentForm = () => {
        setShowEditDepartmentForm(true);
    }

    const handleHideEditDepartmentForm = () => {
        setShowEditDepartmentForm(false);
        fetchData();
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <span className="ml-4 text-lg text-gray-600">Učitavanje odjela i tvrtki...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 text-lg mt-8">Greška: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center border-b border-gray-400 w-fit mx-auto pb-2">Popis odjela</h1>

            <div className="flex justify-end mb-6">
                <button
                    onClick={handleShowAddDepartmentForm}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                    <FaPlus className="mr-2" /> Dodaj novi odjel
                </button>
            </div>

            {department.length === 0 && (
                <div className="text-center text-lg mt-8 text-gray-600">Nema pronađenih odjela.</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {department.map((department) => (
                    <div
                        key={department.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 text-4xl">
                                <FaBuilding />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 mt-2 pt-2 border-t border-gray-500">
                                {department.departmentName}
                            </h2>
                            {department.departmentLocation && (
                                <p className="text-md text-gray-700 text-center mb-1 flex items-center justify-center">
                                    <FaMapMarkerAlt className="mr-2 text-gray-600" /> Lokacija: {department.departmentLocation}
                                </p>
                            )}
                            <p className={`text-md text-gray-700 text-center mb-1 flex items-center justify-center ${department.active ? 'text-green-600' : 'text-red-600'}`}>
                                {department.active ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                                {department.active ? 'Aktivan' : 'Neaktivan'}
                            </p>

                            <p className="text-sm text-gray-600 text-center mb-1 flex items-center justify-center">
                                <FaBuilding className="mr-2 mr-2 text-gray-600" /> Tvrtka: {
                                    department.companyId !== null
                                        ? company.get(department.companyId) || 'N/A'
                                        : 'Nije dodijeljeno'
                                }
                            </p>
                        </div>

                        <div className="flex justify-around mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleShowEditDepartmentForm()}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Uredi department"
                            >
                                <FaEdit className="mr-1" /> Uredi
                            </button>
                            <button
                                disabled
                                onClick={() => handleSoftDelete(department.id)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center px-3 py-1 rounded-md"
                                title="Obriši department"
                            >
                                <FaTrash className="mr-1" /> Obriši
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddDepartmentForm && (
                <DepartmentAddForm
                    authToken={authToken}
                    onSuccess={handleHideAddDepartmentForm}
                    onCancel={handleHideAddDepartmentForm}
                />
            )}

            {showEditDepartmentForm && (
                <DepartmentEditForm
                    show={showEditDepartmentForm}
                    department={department.length > 0 ? department[0] : null}
                    authToken={authToken}
                    onSuccess={handleHideEditDepartmentForm}
                    onCancel={handleHideEditDepartmentForm}
                />
            )}
            <Footer />
        </div>
    );
}