/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.employee;

import java.math.BigDecimal;

/**
 *
 * @author svenk
 */
public record SalaryResponseDTO(
        int employeeId,
        BigDecimal grossSalary,
        BigDecimal pension1Pillar,
        BigDecimal pension2Pillar,
        BigDecimal healthInsurance,
        BigDecimal taxBase,
        BigDecimal totalTaxSurtax,
        BigDecimal netSalary
        ) {
    
}
