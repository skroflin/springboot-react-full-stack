/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.employee;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * @author svenk
 */
public record EmployeeDTO(
        @Schema(example = "Sven")
        String employeeName,
        @Schema(example = "Kroflin")
        String employeeSurname,
        @Schema(example = "1050.65")
        BigDecimal employeeSalary,
        @Schema(example = "2002-03-05")
        Date dateOfBirth,
        @Schema(example = "2026-06-25")
        Date beginningOfWork,
        @Schema(example = "true")
        boolean employeed,
        @Schema(example = "1")
        Integer departmentId,
        @Schema(example = "1")
        Integer companyId) {

}
