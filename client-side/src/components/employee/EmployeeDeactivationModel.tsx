import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify'
import type { EmployeeResponseDTO } from '../../types/Employee';

interface EmployeeDeactivationModelProps {
    show: boolean;
    onHide: () => void;
    employee: EmployeeResponseDTO | null;
    onSuccess: () => void;
    authToken: string;
}

export function EmployeeDeactivationModel({ show, onHide, employee, onSuccess, authToken }: EmployeeDeactivationModelProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!show || !employee) {
        return null;
    }

    const handleDeactivate = async () => {
        if (employee === null || employee.id === null) {
            setError("Employee wasn't selected for termination.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!authToken) {
                throw new Error('Auth token is missing!');
            }

            const headers = {
                Authorization: `Bearer ${authToken}`
            };

            await axios.put(`http://localhost:8080/api/skroflin/employee/softDelete?sifra=${employee.id}`, null, { headers });

            toast.success(`Employee ${employee.employeeName} ${employee.employeeSurname} sucessfully terminated!`);
            onSuccess();
            onHide();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || `Unknown error upon terminating employee ${employee.employeeName} ${employee.employeeSurname}.`;
            setError(errorMessage);
            toast.error(`Termination of employee ${employee.employeeName} ${employee.employeeSurname} unsucessful: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Otpuštanje djelatnika</h3>
                    <button
                        onClick={onHide}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none outline-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-4">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <p className="text-gray-700">Jeste li sigurni da želite otpustiti djelatnika <strong className="font-bold">{employee.employeeName} {employee.employeeSurname}</strong>?</p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onHide}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Odustani
                    </button>
                    <button
                        onClick={handleDeactivate}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75-disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Otpuštam...' : 'Otpusti'}
                    </button>
                </div>
            </div>
        </div>
    )
}