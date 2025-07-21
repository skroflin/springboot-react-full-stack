/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.auth.JwtResponse;
import ffos.skroflin.model.dto.user.UserDTO;
import ffos.skroflin.model.dto.user.UserResponseDTO;
import ffos.skroflin.model.dto.user.UserSignUpDTO;
import ffos.skroflin.model.dto.user.UserRegistrationDTO;
import ffos.skroflin.security.JwtTokenUtil;
import ffos.skroflin.service.UserService;
import ffos.skroflin.service.UsersDetailsService;
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
public class UserController {

    private final UserService korisnikService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UsersDetailsService userDetailsService;

    public UserController(UserService korisnikService, AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, UsersDetailsService userDetailsService) {
        this.korisnikService = korisnikService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/get")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAll(){
        try {
            return new ResponseEntity<>(korisnikService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getBySifra")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> getBySifa(
            @RequestParam int sifra
    ){
        try {
            if (sifra <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            UserResponseDTO korisnik = korisnikService.getBySifra(sifra);
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
    public ResponseEntity<UserResponseDTO> put(
            @RequestParam int sifra,
            @RequestBody(required = true) UserDTO dto
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
            UserResponseDTO azuriraniKorisnik = korisnikService.put(dto, sifra);
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
    @PreAuthorize("hasRole('ADMIN')")
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
    
    @GetMapping("/getByNaziv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getByNaziv(
            @RequestParam String naziv
    ){
        try {
            if (naziv == null || naziv.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Naziv je obavezan");
            }
            List<UserResponseDTO> korisnici = korisnikService.getByNaziv(naziv);
            if (korisnici == null || korisnici.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Korisnici s navedenim nazivima" + " " + naziv + " " + "ne postoje!");
            }
            return new ResponseEntity<>(korisnici, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/getAktivneKorisnike")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAktivneKorisnike(
            @RequestParam boolean aktivan
    ){
        try {
            List<UserResponseDTO> korisnici = korisnikService.getAktivneKorisnike(aktivan);
            if (korisnici == null || korisnici.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Korisnici s navedenim uvjetom" + " " + aktivan + " " + "ne postoje!");
            }
            return new ResponseEntity<>(korisnici, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom dohvaćanja" + " " + e.getMessage(), e);
        }
    }
    
    @PostMapping("/registracija")
    public ResponseEntity<UserResponseDTO> registracija(
            @Valid @RequestBody(required = true) UserRegistrationDTO dto
    ) {
        UserResponseDTO odgovor = korisnikService.registracijaKorisnika(dto);
        return new ResponseEntity<>(odgovor, HttpStatus.CREATED);
    }

    @PostMapping("/prijava")
    public ResponseEntity<?> prijava(
            @Valid @RequestBody(required = true) UserSignUpDTO dto
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
