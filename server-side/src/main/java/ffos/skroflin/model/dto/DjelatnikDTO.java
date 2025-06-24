/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * @author svenk
 */
public record DjelatnikDTO(
        @Schema(example = "Sven") String imeDjelatnika,
        @Schema(example = "Kroflin") String prezimeDjelatnika,
        @Schema(example = "1050.65") BigDecimal placaDjelatnika,
        @Schema(example = "2002-03-05") Date datumRodenja,
        @Schema(example = "2026-06-25") Date pocetakRada,
        @Schema(example = "true") boolean jeZaposlen
        ) {
    
}
