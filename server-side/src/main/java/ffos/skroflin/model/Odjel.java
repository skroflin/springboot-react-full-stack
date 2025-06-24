/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

/**
 *
 * @author svenk
 */
@Entity(name = "odjel")
@AttributeOverride(name = "sifra", column = @Column(name = "odjel_sifra"))
public class Odjel extends Entitet{
    @Column(name = "naziv_odjela", nullable = false)
    private String nazivOdjela;
    @Column(name = "lokacija_odjela", nullable = false)
    private String lokacijaOdjela;

    public Odjel() {
    }

    public Odjel(String nazivOdjela, String lokacijaOdjela) {
        this.nazivOdjela = nazivOdjela;
        this.lokacijaOdjela = lokacijaOdjela;
    }

    public String getNazivOdjela() {
        return nazivOdjela;
    }

    public void setNazivOdjela(String nazivOdjela) {
        this.nazivOdjela = nazivOdjela;
    }

    public String getLokacijaOdjela() {
        return lokacijaOdjela;
    }

    public void setLokacijaOdjela(String lokacijaOdjela) {
        this.lokacijaOdjela = lokacijaOdjela;
    }
    
}
