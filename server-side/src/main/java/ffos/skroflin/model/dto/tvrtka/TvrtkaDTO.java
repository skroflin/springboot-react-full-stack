/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.tvrtka;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record TvrtkaDTO(
        @Schema(example = "Filozofski fakultet Osijek") String nazivTvrtke,
        @Schema(example = "31000, Osijek, Hrvatska") String sjedisteTvrtke,
        @Schema(example = "false") boolean uStjecaju,
        @Schema(example = "1") Integer odjelSifra
        ) {
    
}
