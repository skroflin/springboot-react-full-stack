/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.company;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record CompanyDTO(
        @Schema(example = "Filozofski fakultet Osijek")
        String companyName,
        @Schema(example = "31000, Osijek, Hrvatska")
        String companyLocation,
        @Schema(example = "false")
        boolean bankruptcy
        ) {

}
