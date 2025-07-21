/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.user;

import ffos.skroflin.model.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Date;

/**
 *
 * @author svenk
 */
public record UserResponseDTO(
        @Schema(example = "skroflin")
        String userName,
        @Schema(example = "skroflin@gmail.com")
        String email,
        @Schema(example = "true")
        boolean active,
        @Schema(example = "2025-07-16")
        Date dateCreated,
        @Schema(example = "2025-07-16")
        Date dateUpdated,
        @Schema(example = "admin")
        Role role) {

}
