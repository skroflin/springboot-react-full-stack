/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Korisnik;
import ffos.skroflin.model.dto.korisnik.KorisnikOdgovorDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikPrijavaDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikRegistracijaDTO;
import ffos.skroflin.model.enums.Uloga;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class KorisnikService extends MainService{
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public KorisnikService(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }
    
    private KorisnikOdgovorDTO mapToResponseDTO(Korisnik korisnik){
        return new KorisnikOdgovorDTO(korisnik.getKorisnickoIme(), korisnik.getEmail(), korisnik.isAktivan(), korisnik.getUloga());
    }
    
    public KorisnikOdgovorDTO registracijaKorisnika(KorisnikRegistracijaDTO o){
        Korisnik noviKorisnik = new Korisnik();
        session.beginTransaction();
        noviKorisnik.setKorisnickoIme(o.korisnickoIme());
        noviKorisnik.setLozinka(bCryptPasswordEncoder.encode(o.lozinka()));
        noviKorisnik.setEmail(o.email());
        noviKorisnik.setAktivan(true);
        noviKorisnik.setUloga(Uloga.user);
        session.persist(noviKorisnik);
        session.getTransaction().commit();
        return mapToResponseDTO(noviKorisnik);
    }
    
    public KorisnikOdgovorDTO prijavaKorisnika(KorisnikPrijavaDTO o){
        Korisnik korisnik = session.createQuery(
                "from korisnik k where k.korisnickoIme = :korisnickoIme and k.aktivan = true", Korisnik.class)
                .setParameter("korisnickoIme", o.korisnickoIme())
                .getSingleResult();
        if (!bCryptPasswordEncoder.matches(o.lozinka(), korisnik.getLozinka())) {
            throw new IllegalArgumentException("Pogrešna lozinka!");
        }
        return mapToResponseDTO(korisnik);
    }
}
