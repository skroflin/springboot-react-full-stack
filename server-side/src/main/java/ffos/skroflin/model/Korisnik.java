/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model;

import ffos.skroflin.model.enums.Uloga;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.Date;

/**
 *
 * @author svenk
 */
@Entity
@AttributeOverride(name = "sifra", column = @Column(name = "korisnik_sifra"))
@Table(
        name = "korisnik",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "korisnicko_ime", name = "uq_korisnicko_ime"),
            @UniqueConstraint(columnNames = "email", name = "uq_korisnicki_email")
        })
public class Korisnik extends Entitet {

    @Column(name = "korisnicko_ime", nullable = false)
    private String korisnickoIme;
    @Column(nullable = false)
    private String lozinka;
    @Column(nullable = false)
    private String email;
    private boolean aktivan;
    @Column(name = "datum_kreiranja")
    private Date datumKreiranja;
    @Enumerated(EnumType.STRING)
    private Uloga uloga;

    public Korisnik() {
    }

    public Korisnik(String korisnickoIme, String lozinka, String email, boolean aktivan, Uloga uloga) {
        this.korisnickoIme = korisnickoIme;
        this.lozinka = lozinka;
        this.email = email;
        this.aktivan = aktivan;
        this.uloga = uloga;
    }

    public String getKorisnickoIme() {
        return korisnickoIme;
    }

    public void setKorisnickoIme(String korisnickoIme) {
        this.korisnickoIme = korisnickoIme;
    }

    public String getLozinka() {
        return lozinka;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isAktivan() {
        return aktivan;
    }

    public void setAktivan(boolean aktivan) {
        this.aktivan = aktivan;
    }

    public Date getDatumKreiranja() {
        return datumKreiranja;
    }

    public void setDatumKreiranja(Date datumKreiranja) {
        this.datumKreiranja = datumKreiranja;
    }

    public Uloga getUloga() {
        return uloga;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }
}
