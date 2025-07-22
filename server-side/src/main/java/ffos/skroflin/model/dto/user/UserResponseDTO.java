/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.user;

import ffos.skroflin.model.enums.Role;
import java.util.Date;

/**
 *
 * @author svenk
 */
public record UserResponseDTO(
        int id,
        String userName,
        String email,
        boolean active,
        Date dateCreated,
        Date dateUpdated,
        Role role) {

}
