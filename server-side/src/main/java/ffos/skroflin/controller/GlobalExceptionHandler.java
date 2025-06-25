/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import java.nio.file.AccessDeniedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author svenk
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex){
        return new ResponseEntity<>("Nemate dopuštenje za navedenu radnju.", HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatusException(ResponseStatusException ex){
        return new ResponseEntity<>(ex.getReason(), ex.getStatusCode());
    }
    
    public ResponseEntity<String> handleGenericException(Exception ex){
        return new ResponseEntity<>("Došlo je do neočekivane pogreške" + " " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUsernameNotFoundException(UsernameNotFoundException ex){
        return new ResponseEntity<>("Neispravno korisničko ime ili lozinka!", HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(IllegalAccessException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalAccessException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
