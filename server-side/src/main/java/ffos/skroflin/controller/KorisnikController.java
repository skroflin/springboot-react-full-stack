/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.auth.JwtResponse;
import ffos.skroflin.model.dto.korisnik.KorisnikDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikOdgovorDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikPrijavaDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikRegistracijaDTO;
import ffos.skroflin.security.JwtTokenUtil;
import ffos.skroflin.service.KorisnikService;
import ffos.skroflin.service.KorisnikUserDetailsService;
import jakarta.persistence.NoResultException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/skroflin/korisnik")
public class KorisnikController {

    private final KorisnikService korisnikService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final KorisnikUserDetailsService userDetailsService;

    public KorisnikController(KorisnikService korisnikService, AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, KorisnikUserDetailsService userDetailsService) {
        this.korisnikService = korisnikService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/get")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<KorisnikOdgovorDTO>> getAll(){
        try {
            return new ResponseEntity<>(korisnikService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getBySifra")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<KorisnikOdgovorDTO> getBySifa(
            @RequestParam int sifra
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            KorisnikOdgovorDTO korisnik = korisnikService.getBySifra(sifra);
            if (korisnik == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Korisnik s navedenom šifrom" + " " + sifra + " " + "nije pronađen!");
            }
            return new ResponseEntity<>(korisnik, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @PutMapping("/put")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KorisnikOdgovorDTO> put(
            @RequestParam int sifra,
            @RequestBody(required = true) KorisnikDTO dto
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            if (dto.email() == null || dto.email().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email korisnika je obavezan!");
            }
            if (dto.korisnickoIme() == null || dto.korisnickoIme().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Korisničko ime je obavezno!");
            }
            KorisnikOdgovorDTO azuriraniKorisnik = korisnikService.put(dto, sifra);
            return new ResponseEntity<>(azuriraniKorisnik, HttpStatus.OK);
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
    
    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(
            @RequestParam int sifra
    ){
        try {
            if (sifra <= 0){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            korisnikService.delete(sifra);
            return new ResponseEntity<>(HttpStatus.OK);
                } catch (NoResultException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom logičkog brisanja" + " " + e.getMessage(), e);
        }
    }
    
    @PostMapping("/registracija")
    public ResponseEntity<KorisnikOdgovorDTO> registracija(
            @Valid @RequestBody(required = true) KorisnikRegistracijaDTO dto
    ) {
        KorisnikOdgovorDTO odgovor = korisnikService.registracijaKorisnika(dto);
        return new ResponseEntity<>(odgovor, HttpStatus.CREATED);
    }

    @PostMapping("/prijava")
    public ResponseEntity<?> prijava(
            @Valid @RequestBody(required = true) KorisnikPrijavaDTO dto
    ) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.korisnickoIme(), dto.lozinka()
                    )
            );
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Netočno korisničko ime ili lozinka!", HttpStatus.UNAUTHORIZED);
        }
        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(dto.korisnickoIme());
        final String jwt = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername()));
    }
}
