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
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * @author svenk
 */
@Entity
@Table(name = "djelatnik")
@AttributeOverride(name = "sifra", column = @Column(name = "djelatnik_sifra"))
public class Djelatnik extends Entitet {

    @Column(name = "ime_djelatnika", nullable = false)
    private String imeDjelatnika;
    @Column(name = "prezime_djelatnika", nullable = false)
    private String prezimeDjelatnika;
    @Column(name = "placa_djelatnik", nullable = false, columnDefinition = "float")
    private BigDecimal placaDjelatnika;
    @Column(name = "datum_rodenja")
    private Date datumRodenja;
    @Column(name = "pocetak_rada", nullable = false)
    private Date pocetakRada;
    @Column(columnDefinition = "bit", name = "zaposlen")
    private boolean jeZaposlen;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "odjel_sifra", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Odjel odjel;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tvrtka_sifra", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Tvrtka tvrtka;

    public Djelatnik() {
    }

    public Djelatnik(String imeDjelatnika, String prezimeDjelatnika, BigDecimal placaDjelatnika, Date datumRodenja, Date pocetakRada, boolean jeZaposlen, Odjel odjel, Tvrtka tvrtka) {
        this.imeDjelatnika = imeDjelatnika;
        this.prezimeDjelatnika = prezimeDjelatnika;
        this.placaDjelatnika = placaDjelatnika;
        this.datumRodenja = datumRodenja;
        this.pocetakRada = pocetakRada;
        this.jeZaposlen = jeZaposlen;
        this.odjel = odjel;
        this.tvrtka = tvrtka;
    }

    public String getImeDjelatnika() {
        return imeDjelatnika;
    }

    public void setImeDjelatnika(String imeDjelatnika) {
        this.imeDjelatnika = imeDjelatnika;
    }

    public String getPrezimeDjelatnika() {
        return prezimeDjelatnika;
    }

    public void setPrezimeDjelatnika(String prezimeDjelatnika) {
        this.prezimeDjelatnika = prezimeDjelatnika;
    }

    public BigDecimal getPlacaDjelatnika() {
        return placaDjelatnika;
    }

    public void setPlacaDjelatnika(BigDecimal placaDjelatnika) {
        this.placaDjelatnika = placaDjelatnika;
    }

    public Date getDatumRodenja() {
        return datumRodenja;
    }

    public void setDatumRodenja(Date datumRodenja) {
        this.datumRodenja = datumRodenja;
    }

    public Date getPocetakRada() {
        return pocetakRada;
    }

    public void setPocetakRada(Date pocetakRada) {
        this.pocetakRada = pocetakRada;
    }

    public boolean isJeZaposlen() {
        return jeZaposlen;
    }

    public void setJeZaposlen(boolean jeZaposlen) {
        this.jeZaposlen = jeZaposlen;
    }

    public Odjel getOdjel() {
        return odjel;
    }

    public void setOdjel(Odjel odjel) {
        this.odjel = odjel;
    }

    public Tvrtka getTvrtka() {
        return tvrtka;
    }

    public void setTvrtka(Tvrtka tvrtka) {
        this.tvrtka = tvrtka;
    }

}
