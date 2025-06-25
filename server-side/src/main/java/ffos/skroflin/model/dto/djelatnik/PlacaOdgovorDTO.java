/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.djelatnik;

import java.math.BigDecimal;

/**
 *
 * @author svenk
 */
public record PlacaOdgovorDTO(
        int sifraDjelatnika,
        BigDecimal brutoPlaca,
        BigDecimal mirovinsko1Stup,
        BigDecimal mirovinsko2Stup,
        BigDecimal zdravstvenoOsiguranje,
        BigDecimal poreznaOsnovica,
        BigDecimal ukupniPorezPrirezi,
        BigDecimal netoPlaca
        ) {
    
}
