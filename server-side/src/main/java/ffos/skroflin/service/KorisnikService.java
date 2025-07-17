/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Korisnik;
import ffos.skroflin.model.dto.korisnik.KorisnikDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikOdgovorDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikPrijavaDTO;
import ffos.skroflin.model.dto.korisnik.KorisnikRegistracijaDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
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
        return new KorisnikOdgovorDTO(korisnik.getKorisnickoIme(), korisnik.getEmail(), korisnik.isAktivan(), korisnik.getDatumKreiranja(), korisnik.getUloga());
    }
    
    @Transactional
    private Korisnik convertToEntity(KorisnikDTO dto){
        Korisnik korisnik = new Korisnik();
        korisnik.setKorisnickoIme(dto.korisnickoIme());
        korisnik.setEmail(dto.email());
        korisnik.setAktivan(dto.aktivan());
        korisnik.setUloga(dto.uloga());
        korisnik.setDatumKreiranja(dto.datumKreiranja());
        return korisnik;
    }
    
    @Transactional
    private void updateEntityFromDto(Korisnik korisnik, KorisnikDTO dto){
        korisnik.setKorisnickoIme(dto.korisnickoIme());
        korisnik.setEmail(dto.email());
        korisnik.setAktivan(dto.aktivan());
        korisnik.setUloga(dto.uloga());
        korisnik.setDatumKreiranja(dto.datumKreiranja());
    }
    
    @Transactional
    public List<KorisnikOdgovorDTO> getAll(){
        List<Korisnik> korisnici = session.createQuery(
                "from Korisnik", Korisnik.class).list();
        return korisnici.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public KorisnikOdgovorDTO getBySifra(int sifra){
        Korisnik korisnik = session.get(Korisnik.class, sifra);
        return mapToResponseDTO(korisnik);
    }
    
    @Transactional
    public KorisnikOdgovorDTO put(KorisnikDTO o, int sifra){
        Korisnik k = (Korisnik) session.get(Korisnik.class, sifra);
        if (k == null) {
            throw new NoResultException("Korisnik sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        if (!k.getKorisnickoIme().equals(o.korisnickoIme())) {
            Long count = session.createQuery(
                    "select count(*) from Korisnik k where k.korisnickoIme = :naziv", Long.class)
                    .getSingleResult();
            if (count > 0) {
                throw new IllegalArgumentException("Korisnik s korisničkim imenom" + " " + o.korisnickoIme() + " " + "već postoji!");
            }
        }
        updateEntityFromDto(k, o);
        session.beginTransaction();
        session.persist(k);
        session.getTransaction().commit();
        return mapToResponseDTO(k);
    }
    
    @Transactional
    public void delete(int sifra){
        Korisnik korisnik = session.get(Korisnik.class, sifra);
        if (korisnik == null) {
            throw new NoResultException("Korisnik sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        session.remove(korisnik);
    }
    
    @Transactional
    public List<KorisnikOdgovorDTO> getAktivneKorisnike(boolean aktivan){
        List<Korisnik> korisnici = session.createQuery(
                "from Korisnik k where k.aktivan = :uvjet", Korisnik.class)
                .setParameter("uvjet", aktivan)
                .getResultList();
        return korisnici.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<KorisnikOdgovorDTO> getByNaziv(String uvjet) {
        try {
            List<Korisnik> korisnici = session.createQuery(
                    "select k from Korisnik k "
                    + "where lower (k.korisnickoIme) like lower (:uvjet)",
                Korisnik.class)
                .setParameter("uvjet", "%" + uvjet + "%")
                .list();
            return korisnici.stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Greška pri pretraživanju korisnika: " + e.getMessage());
        }
    }
    
    public KorisnikOdgovorDTO registracijaKorisnika(KorisnikRegistracijaDTO o){
        Korisnik noviKorisnik = new Korisnik();
        session.beginTransaction();
        noviKorisnik.setKorisnickoIme(o.korisnickoIme());
        noviKorisnik.setLozinka(bCryptPasswordEncoder.encode(o.lozinka()));
        noviKorisnik.setEmail(o.email());
        noviKorisnik.setAktivan(o.aktivan());
        noviKorisnik.setUloga(o.uloga());
        session.persist(noviKorisnik);
        session.getTransaction().commit();
        return mapToResponseDTO(noviKorisnik);
    }
    
    public KorisnikOdgovorDTO prijavaKorisnika(KorisnikPrijavaDTO o){
        Korisnik korisnik = session.createQuery(
                "from Korisnik k where k.korisnickoIme = :korisnickoIme and k.aktivan = true", Korisnik.class)
                .setParameter("korisnickoIme", o.korisnickoIme())
                .getSingleResult();
        if (!bCryptPasswordEncoder.matches(o.lozinka(), korisnik.getLozinka())) {
            throw new IllegalArgumentException("Pogrešna lozinka!");
        }
        return mapToResponseDTO(korisnik);
    }
}
