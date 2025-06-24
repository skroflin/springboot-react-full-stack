/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.odjel;

/**
 *
 * @author svenk
 */
public record OdjelOdgovorDTO(
        int sifra,
        String nazivOdjela,
        String lokacijaOdjela,
        boolean jeAktivan
        ) {
    
}
