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
import ffos.skroflin.model.enums.Role;
import ffos.skroflin.security.JwtTokenUtil;
import ffos.skroflin.service.UserService;
import ffos.skroflin.service.UsersDetailsService;
import jakarta.persistence.NoResultException;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
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
@RequestMapping("/api/skroflin/user")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UsersDetailsService userDetailsService;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, UsersDetailsService userDetailsService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/get")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        try {
            return new ResponseEntity<>(userService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error upon fetching" + " " + e.getMessage(),
                    e
            );
        }
    }

    @GetMapping("/getById")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> getById(
            @RequestParam int id
    ) {
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be lessr than 0!");
            }
            UserResponseDTO user = userService.getById(id);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with the following id" + " " + id + " " + "wasn't found!");
            }
            return new ResponseEntity<>(user, HttpStatus.OK);
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

    @PutMapping("/put")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> put(
            @RequestParam int id,
            @RequestBody(required = true) UserDTO dto
    ) {
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Šifra ne smije biti manja od 0");
            }
            if (dto.email() == null || dto.email().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User email is necessary!");
            }
            if (dto.userName() == null || dto.userName().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is necessary!");
            }
            UserResponseDTO azuriraniKorisnik = userService.put(dto, id);
            return new ResponseEntity<>(azuriraniKorisnik, HttpStatus.OK);
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

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @RequestParam int id
    ) {
        try {
            if (id <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id musn't be lesser than 0!");
            }
            userService.delete(id);
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

    @GetMapping("/getByName")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getByName(
            @RequestParam String name
    ) {
        try {
            if (name == null || name.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is necessary");
            }
            List<UserResponseDTO> users = userService.getByName(name);
            if (users == null || users.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Users with the following name" + " " + name + " " + "don't exist!");
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Greška prilikom dohvaćanja" + " " + e.getMessage(),
                    e
            );
        }
    }

    @GetMapping("/getActiveUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getActiveUsers(
            @RequestParam boolean active
    ) {
        try {
            List<UserResponseDTO> users = userService.getActiveUsers(active);
            if (users == null || users.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Users with the following status" + " " + active + " " + "don't exist!");
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
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

    @PostMapping("/userRegistration")
    public ResponseEntity<UserResponseDTO> userRegistration(
            @Valid @RequestBody(required = true) UserRegistrationDTO dto
    ) {
        UserResponseDTO response = userService.userRegistration(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/userSignUp")
    public ResponseEntity<?> userSignUp(
            @Valid @RequestBody(required = true) UserSignUpDTO dto
    ) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.userName(), dto.password()
                    )
            );
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Incorrect username or password!", HttpStatus.UNAUTHORIZED);
        }
        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(dto.userName());
        
        Role userRole = null;
        if (userDetails.getAuthorities() != null && !userDetails.getAuthorities().isEmpty()) {
            String authorityString = userDetails.getAuthorities().iterator().next().getAuthority();
            String roleName = authorityString.replaceFirst("ROLE_", "").toLowerCase(Locale.ROOT);
            try {
                userRole = Role.valueOf(roleName);
            } catch (Exception e) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Error upon fetching role" + " " + e.getMessage(),
                        e
                );
            }
        }
        
        final String jwt = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), userRole));
    }
}
    