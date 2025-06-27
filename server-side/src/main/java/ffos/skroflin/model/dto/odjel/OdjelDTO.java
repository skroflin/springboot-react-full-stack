/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.odjel;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record OdjelDTO(
        @Schema(example = "Development")
        String nazivOdjela,
        @Schema(example = "Ul. Lorenza Jagera 9")
        String lokacijaOdjela,
        @Schema(example = "true")
        boolean jeAktivan,
        @Schema(example = "1")
        Integer tvrtkaSifra) {

}
