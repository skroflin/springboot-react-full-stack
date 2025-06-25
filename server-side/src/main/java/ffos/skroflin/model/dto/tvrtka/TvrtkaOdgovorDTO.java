/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.tvrtka;

import ffos.skroflin.model.Djelatnik;
import ffos.skroflin.model.Odjel;

/**
 *
 * @author svenk
 */
public record TvrtkaOdgovorDTO(
        int sifra,
        String nazivTvrtke,
        String sjedisteTvrtke,
        boolean uStjecaju,
        Odjel odjel,
        Djelatnik djelatnik
        ) {
    
}
