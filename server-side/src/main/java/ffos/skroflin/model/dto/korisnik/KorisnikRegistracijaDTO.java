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
public record KorisnikRegistracijaDTO(
        @Schema(example = "skroflin" ) String korisnickoIme,
        @Schema(example = "lozinka123") String lozinka,
        @Schema(example = "skroflin@gmail.com") String email
        ) {
    
}
