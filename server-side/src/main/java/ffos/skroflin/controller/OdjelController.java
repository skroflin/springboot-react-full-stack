/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.controller;

import ffos.skroflin.model.dto.odjel.OdjelOdgovorDTO;
import ffos.skroflin.service.OdjelService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author svenk
 */
@RestController
@RequestMapping("/api/skroflin/odjel")
public class OdjelController {
    private final OdjelService odjelService;

    public OdjelController(OdjelService odjelService) {
        this.odjelService = odjelService;
    }
    
    @GetMapping("/get")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OdjelOdgovorDTO>> getAll(){
        try {
            return new ResponseEntity<>(odjelService.getAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/getBySifra/{sifra}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getBySifra(
            @RequestParam int sifra
    ){
        try {
            if (sifra <= 0) {
                return new ResponseEntity<>("Šifra ne smije biti manja od 0", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
        }
    }
}
