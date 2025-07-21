/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.user;

import ffos.skroflin.model.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 *
 * @author svenk
 */
public record UserRegistrationDTO(
        @Schema(example = "skroflin")
        String userName,
        @Schema(example = "lozinka123")
        String password,
        @Schema(example = "skroflin@gmail.com")
        String email,
        @Schema(example = "admin")
        Role role,
        @Schema(example = "true")
        boolean active
        ) {

}
