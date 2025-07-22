export interface DepartmentResponseDTO {
    id: number,
    departmentName: string,
    departmentLocation: string,
    active: boolean,
    companyId: number | null
}

export interface DepartmentDTO {
    departmentName: string,
    departmentLocation: string,
    active: boolean,
    companyId: number | null
}