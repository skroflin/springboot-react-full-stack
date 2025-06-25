/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.korisnik.KorisnikOdgovorDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikPrijavaDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikRegistracijaDTO;
import ffos.skroflin.service.KorisnikService;
import jakarta.persistence.NoResultException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author svenk
 */
@RestController
@RequestMapping("/api/skroflin/korisnik")
public class KorisnikController {

    private final KorisnikService korisnikService;

    public KorisnikController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }

    @PostMapping("/registracija")
    public ResponseEntity<KorisnikOdgovorDTO> registracija(
            @Valid @RequestBody(required = true) KorisnikRegistracijaDTO dto
    ) {
        try {
            KorisnikOdgovorDTO registriraniKorisnik = korisnikService.registracijaKorisnika(dto);
            return new ResponseEntity<>(registriraniKorisnik, HttpStatus.CREATED);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Greška prilikom registracije" + " " + e.getMessage(),
                    e
            );
        }
    }

    @PostMapping("/prijava")
    public ResponseEntity<KorisnikOdgovorDTO> prijava(
            @Valid @RequestBody(required = true) KorisnikPrijavaDTO dto
    ) {
        try {
            KorisnikOdgovorDTO prijavljeniKorisnik = korisnikService.prijavaKorisnika(dto);
            return new ResponseEntity<>(prijavljeniKorisnik, HttpStatus.OK);
        } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Neispravno korisničko ime ili lozinka", e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Greška prilikom prijave" + " " + e.getMessage(),
                    e
            );
        }
    }
}
