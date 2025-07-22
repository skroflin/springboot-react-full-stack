import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUser, FaBriefcase, FaBuilding, FaBirthdayCake, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaCity } from 'react-icons/fa';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';

import type { EmployeeResponseDTO } from '../../types/Employee';

interface EmployeeSalaryDetailsProps {
    selectedEmployee: EmployeeResponseDTO | null;
    salaryData: {
        employeeId: number;
        grossSalary: number;
        pension1Pillar: number;
        pension2Pillar: number;
        healthInsurance: number;
        taxBase: number;
        totalTaxSurtax: number;
        netSalary: number;
    } | null;
    companyMap: Map<number, string>;
    departmentMap: Map<number, string>;
}

export function EmployeeSalaryDetails({ selectedEmployee, salaryData, companyMap, departmentMap }: EmployeeSalaryDetailsProps) {
    if (!selectedEmployee) {
        return (
            <p className="text-gray-600 italic">Odaberite djelatnika s popisa da vidite detalje plaće i grafikon.</p>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Plaća za: {selectedEmployee.employeeName} {selectedEmployee.employeeSurname}
            </h3>
            {salaryData ? (
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={[
                                { name: 'Gross salary', value: salaryData.grossSalary },
                                { name: 'Net salary', value: salaryData.netSalary },
                                { name: 'Pension 1', value: salaryData.pension1Pillar },
                                { name: 'Pension 2', value: salaryData.pension2Pillar },
                                { name: 'Health Insurance', value: salaryData.healthInsurance },
                                { name: 'Tax & Surtax', value: salaryData.totalTaxSurtax }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value.toFixed(2)} EUR`} />
                            <Legend />
                            <Bar dataKey="value" fill="#60A5FA" />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-md text-gray-700 mb-1">
                            <span className="font-semibold">Bruto plaća:</span> {salaryData.grossSalary.toFixed(2)} EUR
                        </p>
                        <p className="text-md text-gray-700 mb-1">
                            <span className="font-semibold">Neto plaća:</span> {salaryData.netSalary.toFixed(2)} EUR
                        </p>
                        <hr className="my-3 border-gray-200" />
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Mirovinsko I. stup:</span> {salaryData.pension1Pillar.toFixed(2)} EUR
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Mirovinsko II. stup:</span> {salaryData.pension2Pillar.toFixed(2)} EUR
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Zdravstveno osiguranje:</span> {salaryData.healthInsurance.toFixed(2)} EUR
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Ukupni porez i prirezi:</span> {salaryData.totalTaxSurtax.toFixed(2)} EUR
                        </p>
                        <hr className="my-3 border-gray-200" />
                        <p className="text-md text-gray-700 font-semibold">
                            Ukupni odbici: {(salaryData.pension1Pillar + salaryData.pension2Pillar + salaryData.healthInsurance + salaryData.totalTaxSurtax).toFixed(2)} EUR
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 italic">Učitavanje podataka o plaći...</p>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Podaci o djelatniku:</h4>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaUser className="mr-2 text-gray-500" />
                    <span className="font-semibold mr-1">Ime i Prezime:</span> {selectedEmployee.employeeName} {selectedEmployee.employeeSurname}
                </p>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-500" />
                    <span className="font-semibold mr-1">Plaća djelatnika:</span> {selectedEmployee.employeeSalary.toFixed(2)} EUR
                </p>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-purple-500" />
                    <span className="font-semibold mr-1">Odjel:</span> {
                        selectedEmployee.departmentId !== null
                            ? departmentMap.get(selectedEmployee.departmentId) || 'Nije dodijeljeno'
                            : 'Nije dodijeljeno'
                    }
                </p>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaCity className="mr-2 text-red-500" />
                    <span className="font-semibold mr-1">Tvrtka:</span> {
                        selectedEmployee.companyId !== null
                            ? companyMap.get(selectedEmployee.companyId) || 'Nije dodijeljeno'
                            : 'Nije dodijeljeno'
                    }
                </p>
                {selectedEmployee.dateOfBirth && (
                    <p className="text-md text-gray-700 mb-1 flex items-center">
                        <FaBirthdayCake className="mr-2 text-pink-500" />
                        <span className="font-semibold mr-1">Datum rođenja:</span> {
                            format(new Date(selectedEmployee.dateOfBirth), 'dd.MM.yyyy', { locale: hr })
                        }
                    </p>
                )}
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-500" />
                    <span className="font-semibold mr-1">Početak rada:</span> {
                        format(new Date(selectedEmployee.beginningOfWork), 'dd.MM.yyyy', { locale: hr })
                    }
                </p>
                <p className={`text-md text-gray-700 flex items-center ${selectedEmployee.employeed ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedEmployee.employeed ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                    <span className="font-semibold mr-1">Status zaposlenja:</span> {selectedEmployee.employeed ? 'Zaposlen' : 'Nije zaposlen'}
                </p>
            </div>
        </div>
    );
}