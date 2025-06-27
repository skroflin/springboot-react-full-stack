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
@Entity(name = "tvrtka")
@AttributeOverride(name = "sifra", column = @Column(name = "tvrtka_sifra"))
public class Tvrtka extends Entitet{
    @Column(name = "naziv_tvrtke", nullable = false)
    private String nazivTvrtke;
    @Column(name = "sjediste_tvrtke")
    private String sjedisteTvrtke;
    @Column(columnDefinition = "bit", name = "u_stjecaju")
    private boolean uStjecaju;

    public Tvrtka() {
    }

    public Tvrtka(String nazivTvrtke, String sjedisteTvrtke, boolean uStjecaju) {
        this.nazivTvrtke = nazivTvrtke;
        this.sjedisteTvrtke = sjedisteTvrtke;
        this.uStjecaju = uStjecaju;
    }

    public String getNazivTvrtke() {
        return nazivTvrtke;
    }

    public void setNazivTvrtke(String nazivTvrtke) {
        this.nazivTvrtke = nazivTvrtke;
    }

    public String getSjedisteTvrtke() {
        return sjedisteTvrtke;
    }

    public void setSjedisteTvrtke(String sjedisteTvrtke) {
        this.sjedisteTvrtke = sjedisteTvrtke;
    }

    public boolean isUStjecaju() {
        return uStjecaju;
    }

    public void setUStjecaju(boolean uStjecaju) {
        this.uStjecaju = uStjecaju;
    }
    
}
