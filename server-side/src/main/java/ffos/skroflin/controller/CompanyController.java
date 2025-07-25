/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.company.CompanyDTO;
import ffos.skroflin.model.dto.company.CompanyResponseDTO;
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
@RequestMapping("/api/skroflin/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }    

    @GetMapping("/get")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CompanyResponseDTO>> getAll() {
        try {
            return new ResponseEntity<>(companyService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }

    @GetMapping("/getById")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CompanyResponseDTO> getById(
            @RequestParam int id
    ) {
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be lesser than 0");
            }
            CompanyResponseDTO company = companyService.getById(id);
            if (company == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Company with the following id" + " " + id + " " + "doesn't exist!");
            }
            return new ResponseEntity<>(company, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }

    @PostMapping("/post")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CompanyResponseDTO> post(
            @RequestBody(required = true) CompanyDTO dto
    ) {
        try {
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The necessary data wasn't entered!");
            }
            if (dto.companyName() == null || dto.companyName().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name is necessary!");
            }
            if (dto.companyLocation() == null || dto.companyLocation().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company location is necessary!");
            }
            CompanyResponseDTO createdCompany = companyService.post(dto);
            return new ResponseEntity<>(createdCompany, HttpStatus.CREATED);
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
    public ResponseEntity<CompanyResponseDTO> put(
            @RequestParam int id,
            @RequestBody(required = true) CompanyDTO dto
    ) {
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be lesser than 0");
            }
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The necessary data wasn't entered!");
            }
            if (dto.companyName() == null || dto.companyName().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name is necessary!");
            }
            if (dto.companyLocation() == null || dto.companyLocation().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company location is necessary!");
            }
            CompanyResponseDTO updatedCompany = companyService.put(dto, id);
            return new ResponseEntity<>(updatedCompany, HttpStatus.OK);
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
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be lesser than 0");
            }
            companyService.softDelete(id);
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
    public ResponseEntity<List<CompanyResponseDTO>> getByName(
            @RequestParam String name
    ) {
        try {
            if (name == null || name.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is necessary");
            }
            List<CompanyResponseDTO> companies = companyService.getByName(name);
            if (companies == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Companies with the following name" + " " + name + " " + "don't exist!");
            }
            return new ResponseEntity<>(companies, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getActiveCompanies")
    @PreAuthorize("isAuthenticated")
    public ResponseEntity<List<CompanyResponseDTO>> getActiveCompanies(
            @RequestParam boolean active
    ){
        try {
            List<CompanyResponseDTO> companies = companyService.getActiveCompanies(active);
            if (companies == null || companies.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Company with the following status" + " " + active + " " + "doesn't exist!");
            }
            return new ResponseEntity<>(companies, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getByLocation")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CompanyResponseDTO>> getByLocation(
            @RequestParam String location
    ) {
        try {
            if (location == null || location.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location is necessary");
            }
            List<CompanyResponseDTO> companies = companyService.getByLocation(location);
            if (companies == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Companies with the following location" + " " + location + " " + "don't exist!");
            }
            return new ResponseEntity<>(companies, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error upon fetching" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getNumOfCompanies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getNumOfCompanies(){
        try {
            Long company = companyService.getNumOfCompanies();
            return new ResponseEntity<>(company, HttpStatus.OK);
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
    
    @GetMapping("/getNumOfBankruptCompanies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getNumOfBankruptCompanies(){
        try {
            Long company = companyService.getNumOfBankruptCompanies();
            return new ResponseEntity<>(company, HttpStatus.OK);
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
    
    @GetMapping("/getNumOfNonBankruptCompanies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getNumOfNonBankruptCompanies(){
        try {
            Long company = companyService.getNumOfNonBankruptCompanies();
            return new ResponseEntity<>(company, HttpStatus.OK);
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
    public ResponseEntity<List<CompanyResponseDTO>> massiveInsert(
            @RequestParam int number,
            @RequestBody(required = true) CompanyDTO dto
    ){
        try {
            if (number < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Number of n companies musn't be lesser than 0");
            }
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body of the request template musn't be null");
            }
            List<CompanyResponseDTO> insertedCompanies = companyService.massiveInsert(dto, number);
            return new ResponseEntity<>(insertedCompanies, HttpStatus.OK);
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
