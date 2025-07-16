/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.korisnik;

import ffos.skroflin.model.enums.Uloga;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Date;

/**
 *
 * @author svenk
 */
public record KorisnikDTO(
        @Schema(example = "skroflin")
        String korisnickoIme,
        @Schema(example = "skroflin@gmail.com")
        String email,
        @Schema(example = "true")
        boolean aktivan,
        @Schema(example = "2025-07-16")
        Date datumKreiranja,
        @Schema(example = "admin")
        Uloga uloga) {

}
