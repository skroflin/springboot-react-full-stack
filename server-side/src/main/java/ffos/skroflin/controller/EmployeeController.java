/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.employee.EmployeeDTO;
import ffos.skroflin.model.dto.employee.EmployeeResponseDTO;
import ffos.skroflin.model.dto.employee.SalaryResponseDTO;
import ffos.skroflin.service.EmployeeService;
import ffos.skroflin.service.DepartmentService;
import ffos.skroflin.service.CompanyService;
import jakarta.persistence.NoResultException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author svenk
 */
@RestController
@RequestMapping("/api/skroflin/employee")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final DepartmentService departmentService;
    private final CompanyService companyService;

    public EmployeeController(EmployeeService employeeService, DepartmentService departmentService, CompanyService companyService) {
        this.employeeService = employeeService;
        this.departmentService = departmentService;
        this.companyService = companyService;
    }
    
    @GetMapping("/get")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EmployeeResponseDTO>> getAll(){
        try {
            return new ResponseEntity<>(employeeService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getById")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmployeeResponseDTO> getById(
            @RequestParam int id
    ){
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be less than 0");
            }
            EmployeeResponseDTO employee = employeeService.getById(id);
            if (employee == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee with the following" + " " + id + " " + "doesn't exist!");
            }
            return new ResponseEntity<>(employee, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }
    
    @PostMapping("/post")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponseDTO> post(
            @RequestBody(required = true) EmployeeDTO dto
    ){
        try {
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The necessary data wasn't entered!");
            }
            if (dto.employeeName()== null || dto.employeeName().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee name is necessary!");
            }
            if (dto.employeeSurname()== null || dto.employeeSurname().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee surname is necessary!");
            }
            if (dto.beginningOfWork()== null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Beginning of work date is necessary!");
            }
            if (dto.departmentId() != null) {
                try {
                    departmentService.getById(dto.departmentId());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
                }
            }
            if (dto.companyId()!= null) {
                try {
                    companyService.getById(dto.companyId());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
                }
            }
            EmployeeResponseDTO createdEmployee = employeeService.post(dto);
            return new ResponseEntity<>(createdEmployee, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error upon creating" + " " + e.getMessage(),
                    e
            );
        }
    }
    
    @PutMapping("/put")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponseDTO> put(
            @RequestParam int id,
            @RequestBody(required = true) EmployeeDTO dto
    ){
        try {
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The necessary data wasn't entered!");
            }
            if (dto.employeeName()== null || dto.employeeName().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee name is necessary!");
            }
            if (dto.employeeSurname()== null || dto.employeeSurname().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee surname is necessary!");
            }
            if (dto.beginningOfWork()== null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Beginning of work date is necessary!");
            }
            if (dto.departmentId() != null) {
                try {
                    departmentService.getById(dto.departmentId());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
                }
            }
            if (dto.companyId() != null) {
                try {
                    companyService.getById(dto.companyId());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
                }
            }
            EmployeeResponseDTO updatedEmployee = employeeService.put(dto, id);
            return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error upon updating" + " " + e.getMessage(),
                    e
            );
        }
    }
    
    @PutMapping("/softDelete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDelete(
            @RequestParam int id
    ){
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be lesser than 0!");
            }
            employeeService.softDelete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error upon soft deletion" + " " + e.getMessage(), 
                    e
            );
        }
    }
    
    @GetMapping("/calculatePay/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SalaryResponseDTO> calculatePay(
            @PathVariable int id,
            @RequestParam BigDecimal grossBasis
    ){
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be lesser than 0!");
            }
            if (grossBasis == null || grossBasis.compareTo(BigDecimal.ZERO) <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gross basis musn't be lesser than 0!");
            }
            SalaryResponseDTO salary = employeeService.calculatePay(id, grossBasis);
            return new ResponseEntity<>(salary, HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Error upon calculating salary" + " " + e.getMessage(),
                    e
            );
        }
    }
    
    @GetMapping("/getAllEmployeed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployeed(
            @RequestParam boolean employeed
    ){
        try {
            List<EmployeeResponseDTO> employees = employeeService.getAllEmployeed(employeed);
            if (employees == null || employees.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employees with the following status" + " " + employeed + " " + "don't exist!");
            }
            return new ResponseEntity<>(employees, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Error upon fetching" + " " + e.getMessage(),
                    e
            );
        }
    }
    
    @GetMapping("/getByName")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EmployeeResponseDTO>> getByName(
            @RequestParam String name
    ) {
        try {
            if (name == null || name.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee name is necessary");
            }
            List<EmployeeResponseDTO> employees = employeeService.getByName(name);
            if (employees == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employees with the following name" + " " + name + " " + "don't exist!");
            }
            return new ResponseEntity<>(employees, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Error upon fetching" + " " + e.getMessage(), 
                    e
            );
        }
    }
    
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @RequestParam int id
    ){
        try {
            if(id <= 0){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be less than 0!");
            }
            employeeService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Error upon deletion" + " " + e.getMessage(), 
                    e
            );
        }
    }
    
    @GetMapping("/getByBeginningOfWork")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EmployeeResponseDTO>> getByBeginningOfWork(
            @RequestParam Date timestamp
    ) {
        try {
            if (timestamp == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date is necessary");
            }
            List<EmployeeResponseDTO> employees = employeeService.getByBeginningOfWork(timestamp);
            if (employees == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employees with the following beginning of work date" + " " + timestamp  + " " + "don't exist!");
            }
            return new ResponseEntity<>(employees, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Error upon fetching" + " " + e.getMessage(), 
                    e
            );
        }
    }
    
    @PostMapping("/massiveInsert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> massiveInsert(
            @RequestParam int number,
            @RequestBody(required = true) EmployeeDTO dto
    ){
        try {
            if (number < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Number of n employees musn't be lesser than 0");
            }
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body of the request template musn't be null");
            }
            List<EmployeeResponseDTO> insertedEmployees = employeeService.massiveInsert(dto, number);
            return new ResponseEntity<>(insertedEmployees, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Error upon inserting" + " " + e.getMessage(), 
                    e
            );
        }
    }
}
