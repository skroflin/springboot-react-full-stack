export interface EmployeeResponseDTO {
    id: number,
    employeeName: string,
    employeeSurname: string,
    employeeSalary: number,
    beginningOfWork: string,
    dateOfBirth: string,
    employeed: boolean,
    departmentId: number | null,
    companyId: number | null
}

export interface SalaryResponseDTO {
    employeeId: number;
    grossSalary: string;
    pension1Pillar: string;
    pension2Pillar: string;
    healthInsurance: string;
    taxBase: string;
    totalTaxSurtax: string;
    netSalary: string;
}