/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 *
 * @author svenk
 */
@Entity
@Table(name = "odjel")
@AttributeOverride(name = "sifra", column = @Column(name = "odjel_sifra"))
public class Odjel extends Entitet{
    @Column(name = "naziv_odjela", nullable = false)
    private String nazivOdjela;
    @Column(name = "lokacija_odjela", nullable = false)
    private String lokacijaOdjela;
    @Column(columnDefinition = "bit", name = "aktivan")
    private boolean jeAktivan;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tvrtka_sifra", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Tvrtka tvrtka;

    public Odjel() {
    }

    public Odjel(String nazivOdjela, String lokacijaOdjela, boolean jeAktivan, Tvrtka tvrtka) {
        this.nazivOdjela = nazivOdjela;
        this.lokacijaOdjela = lokacijaOdjela;
        this.jeAktivan = jeAktivan;
        this.tvrtka = tvrtka;
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

    public boolean isJeAktivan() {
        return jeAktivan;
    }

    public void setJeAktivan(boolean jeAktivan) {
        this.jeAktivan = jeAktivan;
    }

    public Tvrtka getTvrtka() {
        return tvrtka;
    }

    public void setTvrtka(Tvrtka tvrtka) {
        this.tvrtka = tvrtka;
    }
    
}
