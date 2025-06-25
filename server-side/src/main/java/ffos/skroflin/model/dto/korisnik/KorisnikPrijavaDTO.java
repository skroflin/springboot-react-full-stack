/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.korisnik;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record KorisnikPrijavaDTO(
        @Schema(example = "1") int sifra,
        @Schema(example = "skroflin") String korisnickoIme,
        @Schema(example = "lozinka123") String lozinka
        ) {
    
}
