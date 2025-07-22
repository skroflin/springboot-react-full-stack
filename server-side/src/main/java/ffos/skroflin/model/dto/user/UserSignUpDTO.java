/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record UserSignUpDTO(
        @Schema(example = "1")
        int id,
        @Schema(example = "skroflin")
        String userName,
        @Schema(example = "lozinka123")
        String password
        ) {

}
