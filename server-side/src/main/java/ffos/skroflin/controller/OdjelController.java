/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.odjel.OdjelDTO;
import ffos.skroflin.model.dto.odjel.OdjelOdgovorDTO;
import ffos.skroflin.service.OdjelService;
import ffos.skroflin.service.TvrtkaService;
import jakarta.persistence.NoResultException;
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
@RequestMapping("/api/skroflin/odjel")
public class OdjelController {

    private final OdjelService odjelService;
    private final TvrtkaService tvrtkaService;

    public OdjelController(OdjelService odjelService, TvrtkaService tvrtkaService) {
        this.odjelService = odjelService;
        this.tvrtkaService = tvrtkaService;
    }

    @GetMapping("/get")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OdjelOdgovorDTO>> getAll() {
        try {
            return new ResponseEntity<>(odjelService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }

    @GetMapping("/getBySifra/{sifra}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OdjelOdgovorDTO> getBySifra(
            @RequestParam int sifra
    ) {
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            OdjelOdgovorDTO odjel = odjelService.getBySifra(sifra);
            if (odjel == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Odjel s navedenom šifrom" + " " + sifra + " " + "nije pronađen!");
            }
            return new ResponseEntity<>(odjel, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }

    @PostMapping("/post")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<OdjelOdgovorDTO> post(
            @RequestBody(required = true) OdjelDTO dto
    ) {
        try {
            if (dto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nisu uneseni traženi podaci!");
            }
            if (dto.nazivOdjela() == null || dto.nazivOdjela().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Naziv odjela je obavezan!");
            }
            if (dto.lokacijaOdjela() == null || dto.lokacijaOdjela().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lokacija odjela je obavezna!");
            }
            if (dto.tvrtkaSifra() != null) {
                try {
                    tvrtkaService.getBySifra(dto.tvrtkaSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            OdjelOdgovorDTO kreiraniOdjel = odjelService.post(dto);
            return new ResponseEntity<>(kreiraniOdjel, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
    
    @PutMapping("/put/{sifra}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<OdjelOdgovorDTO> put(
            @RequestParam int sifra,
            @RequestBody(required = true) OdjelDTO dto
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            if (dto.nazivOdjela() == null || dto.nazivOdjela().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Naziv odjela je obavezan!");
            }
            if (dto.lokacijaOdjela() == null || dto.lokacijaOdjela().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lokacija odjela je obavezna!");
            }
            if (dto.tvrtkaSifra() != null) {
                try {
                    tvrtkaService.getBySifra(dto.tvrtkaSifra());
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
                }
            }
            OdjelOdgovorDTO azuriraniOdjel = odjelService.put(dto, sifra);
            return new ResponseEntity<>(azuriraniOdjel, HttpStatus.OK);
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
    
    @PutMapping("/softDelete/{sifra}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> softDelete(
            @PathVariable int sifra
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            odjelService.softDelete(sifra);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom logičkog brisanja" + " " + e.getMessage(), e);
        }
    }
}
