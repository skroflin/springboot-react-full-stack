package ffos.skroflin.model.dto.employee;

import java.math.BigDecimal;
import java.util.Date;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author svenk
 */
public record EmployeeResponseDTO(
        int id,
        String employeeName,
        String employeeSurname,
        BigDecimal employeeSalary,
        Date dateOfBirth,
        Date beginningOfWork,
        boolean employeed,
        Integer departmentId,
        Integer companyId
        ) {
    
}
