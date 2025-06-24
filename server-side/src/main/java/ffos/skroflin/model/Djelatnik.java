/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * @author svenk
 */
@Entity(name = "djelatnik")
@AttributeOverride(name = "sifra", column = @Column(name = "djelatnik_sifra"))
public class Djelatnik extends Entitet{
    @Column(name = "ime_djelatnika", nullable = false)
    private String imeDjelatnika;
    @Column(name = "prezime_djelatnika", nullable = false)
    private String prezimeDjelatnika;
    @Column(name = "placa_djelatnik", nullable = false, columnDefinition = "float")
    private BigDecimal placaDjelatnika;
    @Column(name = "datum_rodenja")
    private Date datumRodenja;
    @ManyToOne
    @JoinColumn(name = "odjel_sifra", nullable = false)
    private Odjel odjel;

    public Djelatnik() {
    }

    public Djelatnik(String imeDjelatnika, String prezimeDjelatnika, BigDecimal placaDjelatnika, Date datumRodenja, Odjel odjel) {
        this.imeDjelatnika = imeDjelatnika;
        this.prezimeDjelatnika = prezimeDjelatnika;
        this.placaDjelatnika = placaDjelatnika;
        this.datumRodenja = datumRodenja;
        this.odjel = odjel;
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

    public Odjel getOdjel() {
        return odjel;
    }

    public void setOdjel(Odjel odjel) {
        this.odjel = odjel;
    }
    
}
