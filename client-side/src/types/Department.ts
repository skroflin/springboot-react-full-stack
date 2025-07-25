export interface DepartmentResponseDTO {
    id: number,
    departmentName: string,
    departmentLocation: string,
    isActive: boolean,
    companyId: number | null
}