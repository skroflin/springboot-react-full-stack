/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.tvrtka.TvrtkaDTO;
import ffos.skroflin.model.dto.tvrtka.TvrtkaOdgovorDTO;
import ffos.skroflin.service.DjelatnikService;
import ffos.skroflin.service.OdjelService;
import ffos.skroflin.service.TvrtkaService;
import jakarta.persistence.NoResultException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
@RequestMapping("/api/skroflin/tvrtka")
public class TvrtkaController {
    private final TvrtkaService tvrtkaService;
    private final OdjelService odjelService;
    private final DjelatnikService djelatnikService;

    public TvrtkaController(TvrtkaService tvrtkaService, OdjelService odjelService, DjelatnikService djelatnikService) {
        this.tvrtkaService = tvrtkaService;
        this.odjelService = odjelService;
        this.djelatnikService = djelatnikService;
    }

    
    
    @GetMapping("/get")
    @PreAuthorize("isAuthenticated")
    public ResponseEntity<List<TvrtkaOdgovorDTO>> getAll(){
        try {
            return new ResponseEntity<>(tvrtkaService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getBySifra/{sifra}")
    @PreAuthorize("isAuthenticated")
    public ResponseEntity<TvrtkaOdgovorDTO> getBySifra(
            @RequestParam int sifra
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            TvrtkaOdgovorDTO tvrtka = tvrtkaService.getBySifra(sifra);
            if (tvrtka == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tvrtka s navedenom šifrom" + " " + sifra + " " + "nije pronađen!");
            }
            return new ResponseEntity<>(tvrtka, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @PostMapping("/post")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<TvrtkaOdgovorDTO> post(
            @RequestBody(required = true) TvrtkaDTO dto
    ){
        try {
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nisu uneseni traženi podaci!");
            }
            if (dto.nazivTvrtke() == null || dto.nazivTvrtke().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Naziv tvrtke je obavezan!");
            }
            if (dto.sjedisteTvrtke() == null || dto.sjedisteTvrtke().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sjedište tvrtke je obavezno!");
            }
            if (dto.odjelSifra()!= null) {
                try {
                    odjelService.getBySifra(dto.odjelSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            if (dto.djelatnikSifra()!= null) {
                try {
                    djelatnikService.getBySifra(dto.djelatnikSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            TvrtkaOdgovorDTO kreiranaTvrtka = tvrtkaService.post(dto);
            return new ResponseEntity<>(kreiranaTvrtka, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
