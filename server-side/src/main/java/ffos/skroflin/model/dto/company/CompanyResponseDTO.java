/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.company;


/**
 *
 * @author svenk
 */
public record CompanyResponseDTO(
        int id,
        String companyName,
        String companyLocation,
        boolean bankruptcy
        ) {
    
}
