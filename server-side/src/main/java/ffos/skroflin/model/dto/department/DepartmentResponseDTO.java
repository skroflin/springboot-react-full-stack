/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.department;

/**
 *
 * @author svenk
 */
public record DepartmentResponseDTO(
        int id,
        String departmentName,
        String departmentLocation,
        boolean isActive,
        Integer companyId) {

}
