import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaEdit, FaTrash, FaCity, FaArrowLeft, FaArrowRight, FaTimesCircle } from 'react-icons/fa';
import { EmployeeSalaryDetails } from './EmployeeSalaryDetails';
import { EmployeeDeactivationModel } from './EmployeeDeactivationModel';
import { EmployeeDeleteModel } from './EmployeeDeleteModel';
import type { EmployeeResponseDTO, SalaryResponseDTO } from '../../types/Employee';
import type { DepartmentResponseDTO } from '../../types/Department';
import type { CompanyResponseDTO } from '../../types/Company';

interface EmployeeListProps {
    authToken: string;
}

export function EmployeeList({ authToken }: EmployeeListProps) {
    const [employees, setEmployees] = useState<EmployeeResponseDTO[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponseDTO | null>(null);
    const [salaryData, setSalaryData] = useState<{
        employeeId: number;
        grossSalary: number;
        pension1Pillar: number;
        pension2Pillar: number;
        healthInsurance: number;
        taxBase: number;
        totalTaxSurtax: number;
        netSalary: number;
    } | null>(null);
    const [grossBasisInput, setGrossBasisInput] = useState<string>('1000.00');

    const [companyMap, setCompanyMap] = useState<Map<number, string>>(new Map());
    const [departmentMap, setDepartmentMap] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showDeactivationModel, setShowDeactivationModel] = useState<boolean>(false);
    const [employeeForDeactivation, setEmployeeForDeactivation] = useState<EmployeeResponseDTO | null>(null);

    const [showDeleteModel, setShowDeleteModel] = useState<boolean>(false);
    const [employeeForDeletion, setEmployeeForDeletion] = useState<EmployeeResponseDTO | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(6);

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!authToken) {
            toast.error(`You aren't logged in. Please log in!`);
            navigate('/login');
            setLoading(false);
            return;
        }

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };

            const [employeesResponse, tvrtkeResponse, odjeliResponse] = await Promise.all([
                axios.get<EmployeeResponseDTO[]>('http://localhost:8080/api/skroflin/employee/get', { headers }),
                axios.get<CompanyResponseDTO[]>('http://localhost:8080/api/skroflin/company/get', { headers }),
                axios.get<DepartmentResponseDTO[]>('http://localhost:8080/api/skroflin/department/get', { headers })
            ]);

            setEmployees(employeesResponse.data);

            const newCompanyMap = new Map<number, string>();
            tvrtkeResponse.data.forEach(company => {
                newCompanyMap.set(company.id, company.companyName);
            });
            setCompanyMap(newCompanyMap);

            const newDepartmentMap = new Map<number, string>();
            odjeliResponse.data.forEach(department => {
                newDepartmentMap.set(department.id, department.departmentName);
            });
            setDepartmentMap(newDepartmentMap);

        } catch (err: any) {
            console.error('Error upon fetching data:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Error upon fetching data.');
                toast.error(err.response?.data?.message || err.message || 'Error upon fetching data.');
            } else {
                setError(err.message || 'Unexpected error.');
                toast.error(err.message || 'Unexpected error upon fetching data.');
            }
        } finally {
            setLoading(false);
        }
    }, [authToken, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleShowDeactivationModel = (djelatnik: EmployeeResponseDTO) => {
        setEmployeeForDeactivation(djelatnik);
        setShowDeactivationModel(true);
    };

    const handleHideDeaktivacijaModal = () => {
        setShowDeactivationModel(false);
        setEmployeeForDeactivation(null);
        fetchData();
    };

    const handleshowDeleteModel = (djelatnik: EmployeeResponseDTO) => {
        setEmployeeForDeletion(djelatnik);
        setShowDeleteModel(true);
    };

    const handleHideBrisanjeModal = () => {
        setShowDeleteModel(false);
        setEmployeeForDeletion(null);
        fetchData();
    };

    const fetchSalary = useCallback(async (id: number, grossBasis: string) => {
        const parsedBruto = parseFloat(grossBasis);
        if (isNaN(parsedBruto) || parsedBruto <= 0) {
            setSalaryData(null);
            return;
        }

        if (!authToken) {
            toast.error(`You aren't logged in. Please log in!`);
            navigate('/login');
            return;
        }

        try {
            const headers = { 'Authorization': `Bearer ${authToken}` };
            const response = await axios.get<SalaryResponseDTO>(`http://localhost:8080/api/skroflin/employee/calculatePay/${id}?grossBasis=${grossBasis}`, { headers });

            const rawData = response.data;
            const convertedData = {
                employeeId: rawData.employeeId,
                grossSalary: parseFloat(rawData.grossSalary),
                pension1Pillar: parseFloat(rawData.pension1Pillar),
                pension2Pillar: parseFloat(rawData.pension2Pillar),
                healthInsurance: parseFloat(rawData.healthInsurance),
                taxBase: parseFloat(rawData.taxBase),
                totalTaxSurtax: parseFloat(rawData.totalTaxSurtax),
                netSalary: parseFloat(rawData.netSalary),
            };
            setSalaryData(convertedData);
        } catch (error: any) {
            console.error('Error whilst calculating salary:', error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message || 'Error whilst calculating salary.');
            } else {
                toast.error(error.message || 'Unexpected error whilst calculating pay.');
            }
            setSalaryData(null);
        }
    }, [authToken, navigate]);

    useEffect(() => {
        if (selectedEmployee && grossBasisInput) {
            fetchSalary(selectedEmployee.id, grossBasisInput);
        } else {
            setSalaryData(null);
        }
    }, [selectedEmployee, grossBasisInput, fetchSalary]);

    const handleEdit = (employee: EmployeeResponseDTO) => {
        toast.info(`Uređivanje djelatnika: ${employee.employeeName} ${employee.employeeSurname}`);
    };

    const handleDelete = (employee: EmployeeResponseDTO) => {
        handleshowDeleteModel(employee);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentemployees = employees.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(employees.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setSelectedEmployee(null);
        setSalaryData(null);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    if (loading) {
        return <div className="text-center text-lg mt-8 text-gray-600">Učitavanje podataka...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 text-lg mt-8">Greška: {error}</div>;
    }

    if (employees.length === 0 && !loading) {
        return (
            <div className="flex flex-col md:flex-row p-4 min-h-screen bg-gray-100">
                <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Popis djelatnika</h2>
                    <div className="mb-6">
                        <label htmlFor="grossBasis" className="block text-gray-700 text-sm font-bold mb-2">
                            Bruto osnovica za izračun plaće (EUR):
                        </label>
                        <input
                            type="number"
                            id="grossBasis"
                            value={grossBasisInput}
                            onChange={(e) => setGrossBasisInput(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Unesite bruto osnovicu"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <p className="text-gray-600">Nema pronađenih djelatnika.</p>
                </div>
                <div className="w-full md:w-1/2 pl-0 md:pl-4 bg-white p-6 rounded-lg shadow-md md:border-l border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalji plaće</h2>
                    <p className="text-m text-gray-600 italic">Odaberite djelatnika s popisa da vidite detalje plaće i grafikon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row p-4 min-h-screen">
            <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Popis djelatnika</h2>

                <div className="mb-6">
                    <label htmlFor="grossBasis" className="block text-gray-700 text-sm font-bold mb-2">
                        Bruto osnovica za izračun plaće (EUR):
                    </label>
                    <input
                        type="number"
                        id="grossBasis"
                        value={grossBasisInput}
                        onChange={(e) => setGrossBasisInput(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Unesite bruto osnovicu"
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border-t border-b border-gray-200 py-6">
                    {currentemployees.map((employee) => (
                        <div
                            key={employee.id}
                            className={`p-4 border rounded-lg cursor-pointer ${selectedEmployee?.id === employee.id ? 'bg-blue-50 border-blue-400 shadow-inner' : 'bg-white hover:bg-gray-100 border-gray-200'} transition-all duration-200`}
                            onClick={() => setSelectedEmployee(employee)}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                                <FaUser className="mr-2 text-gray-600" />
                                {employee.employeeName} {employee.employeeSurname}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1 flex items-center">
                                <FaBuilding className="mr-2 text-gray-600" />
                                Odjel: {employee.departmentId !== null ? departmentMap.get(employee.departmentId) || 'Nije dodijeljeno' : 'Nije dodijeljeno'}
                            </p>
                            <p className="text-sm text-gray-600 mb-1 flex items-center">
                                <FaCity className="mr-2 text-gray-600" />
                                Tvrtka: {employee.companyId !== null ? companyMap.get(employee.companyId) || 'Nije dodijeljeno' : 'Nije dodijeljeno'}
                            </p>
                            <div className="border-t border-gray-700 flex justify-end mt-3 space-x-2">
                                <div className="border-r border-gray-700">
                                    <button
                                        disabled
                                        onClick={(e) => { e.stopPropagation(); handleEdit(employee); }}
                                        className="mx-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center text-sm"
                                        title="Uredi"
                                    >
                                        <FaEdit className="mr-1" /> Uredi
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(employee); }}
                                        className="mx-2 text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center text-sm"
                                        title="Obriši Trajno"
                                    >
                                        <FaTrash className="mr-1" /> Obriši
                                    </button>
                                </div>
                                {employee.employeed && (
                                    <div className="border-l border-gray-700">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleShowDeactivationModel(employee); }}
                                            className="mx-2 text-yellow-600 hover:text-yellow-800 transition-colors duration-200 flex items-center text-sm"
                                            title="Otpusti"
                                        >
                                            <FaTimesCircle className="mr-1" /> Otpusti
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6 space-x-2">
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
            </div>

            <div className="w-full md:w-1/2 pl-0 md:pl-4 md:ml-4 bg-white p-6 rounded-lg shadow-md md:border-l border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 ml-2 mb-4">Detalji plaće</h2>
                <EmployeeSalaryDetails
                    selectedEmployee={selectedEmployee}
                    salaryData={salaryData}
                    companyMap={companyMap}
                    departmentMap={departmentMap}
                />
            </div>

            <EmployeeDeactivationModel
                show={showDeactivationModel}
                onHide={handleHideDeaktivacijaModal}
                employee={employeeForDeactivation}
                onSuccess={fetchData}
                authToken={authToken}
            />

            <EmployeeDeleteModel
                show={showDeleteModel}
                onClose={handleHideBrisanjeModal}
                employee={employeeForDeletion}
                onSuccess={fetchData}
                authToken={authToken}
            />
        </div>
    );
}