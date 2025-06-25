/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.auth;

/**
 *
 * @author svenk
 */
public class JwtResponse {
    private String jwt;
    private String korisnickoIme;

    public JwtResponse() {
    }

    public JwtResponse(String jwt, String korisnickoIme) {
        this.jwt = jwt;
        this.korisnickoIme = korisnickoIme;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getKorisnickoIme() {
        return korisnickoIme;
    }

    public void setKorisnickoIme(String korisnickoIme) {
        this.korisnickoIme = korisnickoIme;
    }
    
}
