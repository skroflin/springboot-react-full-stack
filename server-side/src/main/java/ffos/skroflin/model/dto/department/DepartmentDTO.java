/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.department;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record DepartmentDTO(
        @Schema(example = "Development")
        String departmentName,
        @Schema(example = "Ul. Lorenza Jagera 9")
        String departmentLocation,
        @Schema(example = "true")
        boolean active,
        @Schema(example = "1")
        Integer companyId) {

}
