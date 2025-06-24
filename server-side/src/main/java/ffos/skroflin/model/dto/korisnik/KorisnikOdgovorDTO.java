/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.korisnik;

import ffos.skroflin.model.enums.Uloga;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record KorisnikOdgovorDTO(
        @Schema(example = "skroflin") String korisnickoIme,
        @Schema(example = "skroflin@gmail.com") String email,
        @Schema(example = "true") boolean aktivan,
        @Schema(example = "admin") Uloga uloga
        ) {
    
}
