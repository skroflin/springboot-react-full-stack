/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.auth.JwtResponse;
import ffos.skroflin.model.dto.korisnik.KorisnikOdgovorDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikPrijavaDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikRegistracijaDTO;
import ffos.skroflin.security.JwtTokenUtil;
import ffos.skroflin.service.KorisnikService;
import ffos.skroflin.service.KorisnikUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
