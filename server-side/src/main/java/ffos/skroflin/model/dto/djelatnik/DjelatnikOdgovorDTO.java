package ffos.skroflin.model.dto.djelatnik;

import java.math.BigDecimal;
import java.util.Date;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author svenk
 */
public record DjelatnikOdgovorDTO(
        int sifra,
        String imeDjelatnika,
        String prezimeDjelatnika,
        BigDecimal placaDjelatnika,
        Date pocetakRada,
        boolean jeZaposlen,
        Integer odjelSifra,
        Integer tvrtkaSifra
        ) {
    
}
