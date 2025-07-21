/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.department.DepartmentDTO;
import ffos.skroflin.model.dto.department.DepartmentResponseDTO;
import ffos.skroflin.service.DepartmentService;
import ffos.skroflin.service.CompanyService;
import jakarta.persistence.NoResultException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/skroflin/department")
public class DepartmentController {

    private final DepartmentService departmentService;
    private final CompanyService companyService;

    public DepartmentController(DepartmentService departmentService, CompanyService companyService) {
        this.departmentService = departmentService;
        this.companyService = companyService;
    }

    @GetMapping("/get")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DepartmentResponseDTO>> getAll() {
        try {
            return new ResponseEntity<>(departmentService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }

    @GetMapping("/getById")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DepartmentResponseDTO> getById(
            @RequestParam int id
    ) {
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be less than 0!");
            }
            DepartmentResponseDTO department = departmentService.getById(id);
            if (department == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Department with the following id" + " " + id + " " + "wasn't found!");
            }
            return new ResponseEntity<>(department, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }

    @PostMapping("/post")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponseDTO> post(
            @RequestBody(required = true) DepartmentDTO dto
    ) {
        try {
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The necessary data wasn't entered!");
            }
            if (dto.departmentName()== null || dto.departmentName().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Department name is necessary!");
            }
            if (dto.departmentLocation()== null || dto.departmentLocation().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Department location is necessary!");
            }
            if (dto.companyId() != null) {
                try {
                    companyService.getById(dto.companyId());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
                }
            }
            DepartmentResponseDTO createdDepartment = departmentService.post(dto);
            return new ResponseEntity<>(createdDepartment, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
    
    @PutMapping("/put")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponseDTO> put(
            @RequestParam int id,
            @RequestBody(required = true) DepartmentDTO dto
    ){
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be less than 0!");
            }
            if (dto.departmentName()== null || dto.departmentName().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Department name is necessary!");
            }
            if (dto.departmentLocation()== null || dto.departmentLocation().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Department location is necessary!");
            }
            if (dto.companyId() != null) {
                try {
                    companyService.getById(dto.companyId());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
                }
            }
            DepartmentResponseDTO updatedDepartment = departmentService.put(dto, id);
            return new ResponseEntity<>(updatedDepartment, HttpStatus.OK);
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
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be less than 0!");
            }
            departmentService.softDelete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon soft deletion" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getByName")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DepartmentResponseDTO>> getByName(
            @RequestParam String name
    ) {
        try {
            if (name == null || name.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is necessary");
            }
            List<DepartmentResponseDTO> departments = departmentService.getByName(name);
            if (departments == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Departments with the following name" + " " + name + " " + "don't exist!");
            }
            return new ResponseEntity<>(departments, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getByLocation")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DepartmentResponseDTO>> getByLocation(
            @RequestParam String location
    ){
        try {
            if (location == null || location.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location is necessary");
            }
            List<DepartmentResponseDTO> departments = departmentService.getByLocation(location);
            if (departments == null) {
               throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Departments with the following location" + " " + location + " " + "don't exist!"); 
            }
            return new ResponseEntity<>(departments, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }
}
