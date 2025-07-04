/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.djelatnik.DjelatnikDTO;
import ffos.skroflin.model.dto.djelatnik.DjelatnikOdgovorDTO;
import ffos.skroflin.model.dto.djelatnik.PlacaOdgovorDTO;
import ffos.skroflin.service.DjelatnikService;
import ffos.skroflin.service.OdjelService;
import ffos.skroflin.service.TvrtkaService;
import jakarta.persistence.NoResultException;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/skroflin/djelatnik")
public class DjelatnikController {
    private final DjelatnikService djelatnikService;
    private final OdjelService odjelService;
    private final TvrtkaService tvrtkaService;

    public DjelatnikController(DjelatnikService djelatnikService, OdjelService odjelService, TvrtkaService tvrtkaService) {
        this.djelatnikService = djelatnikService;
        this.odjelService = odjelService;
        this.tvrtkaService = tvrtkaService;
    }
    
    @GetMapping("/get")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DjelatnikOdgovorDTO>> getAll(){
        try {
            return new ResponseEntity<>(djelatnikService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getBySifra")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DjelatnikOdgovorDTO> getBySifra(
            @RequestParam int sifra
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            DjelatnikOdgovorDTO djelatnik = djelatnikService.getBySifra(sifra);
            if (djelatnik == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Djelatnik s navedenom šifrom" + " " + sifra + " " + "nije pronađen!");
            }
            return new ResponseEntity<>(djelatnik, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @PostMapping("/post")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DjelatnikOdgovorDTO> post(
            @RequestBody(required = true) DjelatnikDTO dto
    ){
        try {
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nisu uneseni traženi podaci!");
            }
            if (dto.imeDjelatnika() == null || dto.imeDjelatnika().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ime djelatnik je obavezno!");
            }
            if (dto.prezimeDjelatnika() == null || dto.prezimeDjelatnika().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prezime djelatnik je obavezno!");
            }
            if (dto.pocetakRada() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Početak rada djelatnika je obavezno!");
            }
            if (dto.odjelSifra() != null) {
                try {
                    odjelService.getBySifra(dto.odjelSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            if (dto.tvrtkaSifra() != null) {
                try {
                    tvrtkaService.getBySifra(dto.tvrtkaSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            DjelatnikOdgovorDTO unesenDjelatnik = djelatnikService.post(dto);
            return new ResponseEntity<>(unesenDjelatnik, HttpStatus.OK);
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
    public ResponseEntity<DjelatnikOdgovorDTO> put(
            @RequestParam int sifra,
            @RequestBody(required = true) DjelatnikDTO dto
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            if (dto.imeDjelatnika() == null || dto.imeDjelatnika().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ime djelatnik je obavezno!");
            }
            if (dto.prezimeDjelatnika() == null || dto.prezimeDjelatnika().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prezime djelatnik je obavezno!");
            }
            if (dto.pocetakRada() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Početak rada djelatnika je obavezno!");
            }
            if (dto.odjelSifra() != null) {
                try {
                    odjelService.getBySifra(dto.odjelSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            if (dto.tvrtkaSifra() != null) {
                try {
                    tvrtkaService.getBySifra(dto.tvrtkaSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            DjelatnikOdgovorDTO azuriraniDjelatnik = djelatnikService.put(dto, sifra);
            return new ResponseEntity<>(azuriraniDjelatnik, HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Greška prilikom ažuriranja" + " " + e.getMessage(),
                    e
            );
        }
    }
    
    @PutMapping("/softDelete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDelete(
            @PathVariable int sifra
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            djelatnikService.softDelete(sifra);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom logičkog brisanja" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/izracunajPlacu/{sifra}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PlacaOdgovorDTO> izracunajPlacu(
            @PathVariable int sifra,
            @RequestParam BigDecimal brutoOsnovica
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            if (brutoOsnovica == null || brutoOsnovica.compareTo(BigDecimal.ZERO) <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bruto osnovica ne smije biti manja od 0!");
            }
            PlacaOdgovorDTO placa = djelatnikService.izracunajPlacu(sifra, brutoOsnovica);
            return new ResponseEntity<>(placa, HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom logičkog brisanja" + " " + e.getMessage(), e);
        }
    }
}
