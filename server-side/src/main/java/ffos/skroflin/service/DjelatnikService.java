package ffos.skroflin.service;

import ffos.skroflin.model.Djelatnik;
import ffos.skroflin.model.Odjel;
import ffos.skroflin.model.Tvrtka;
import ffos.skroflin.model.dto.djelatnik.DjelatnikDTO;
import ffos.skroflin.model.dto.djelatnik.DjelatnikOdgovorDTO;
import ffos.skroflin.model.dto.djelatnik.PlacaOdgovorDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DjelatnikService extends MainService {
    
    @Transactional
    private DjelatnikOdgovorDTO convertToResponseDTO(Djelatnik djelatnik) {
        if (djelatnik == null) {
            return null;
        }
        Integer sifraOdjel = (djelatnik.getOdjel() != null) ? djelatnik.getOdjel().getSifra() : null;
        Integer sifraTvrtka = (djelatnik.getTvrtka() != null) ? djelatnik.getTvrtka().getSifra() : null;
        return new DjelatnikOdgovorDTO(
                djelatnik.getSifra(),
                djelatnik.getImeDjelatnika(),
                djelatnik.getPrezimeDjelatnika(),
                djelatnik.getPlacaDjelatnika(),
                djelatnik.getPocetakRada(),
                djelatnik.isJeZaposlen(),
                sifraOdjel,
                sifraTvrtka
        );
    }

    @Transactional
    private Djelatnik convertToEntity(DjelatnikDTO dto) {
        Djelatnik djelatnik = new Djelatnik();
        djelatnik.setImeDjelatnika(dto.imeDjelatnika());
        djelatnik.setPrezimeDjelatnika(dto.prezimeDjelatnika());
        djelatnik.setDatumRodenja(dto.datumRodenja());
        djelatnik.setPlacaDjelatnika(dto.placaDjelatnika());
        djelatnik.setJeZaposlen(dto.jeZaposlen());
        djelatnik.setPocetakRada(dto.pocetakRada());
        
        if (dto.odjelSifra() != null) {
            Odjel odjel = session.get(Odjel.class, dto.odjelSifra());
            if (odjel == null) {
                throw new IllegalArgumentException("Odjel sa šifrom " + dto.odjelSifra() + " ne postoji!");
            }
            djelatnik.setOdjel(odjel);
        }
        
        if (dto.tvrtkaSifra() != null) {
            Tvrtka tvrtka = session.get(Tvrtka.class, dto.tvrtkaSifra());
            if (tvrtka == null) {
                throw new IllegalArgumentException("Tvrtka sa šifrom " + dto.tvrtkaSifra() + " ne postoji!");
            }
            djelatnik.setTvrtka(tvrtka);
        }
        
        return djelatnik;
    }

    @Transactional
    private void updateEntityFromDto(Djelatnik djelatnik, DjelatnikDTO dto) {
        djelatnik.setImeDjelatnika(dto.imeDjelatnika());
        djelatnik.setPrezimeDjelatnika(dto.prezimeDjelatnika());
        djelatnik.setPlacaDjelatnika(dto.placaDjelatnika());
        djelatnik.setPocetakRada(dto.pocetakRada());
        djelatnik.setJeZaposlen(dto.jeZaposlen());
        
        if (dto.odjelSifra() != null) {
            Odjel odjel = session.get(Odjel.class, dto.odjelSifra());
            if (odjel == null) {
                throw new IllegalArgumentException("Odjel sa šifrom " + dto.odjelSifra() + " ne postoji!");
            }
            djelatnik.setOdjel(odjel);
        } else {
            djelatnik.setOdjel(null);
        }
        
        if (dto.tvrtkaSifra() != null) {
            Tvrtka tvrtka = session.get(Tvrtka.class, dto.tvrtkaSifra());
            if (tvrtka == null) {
                throw new IllegalArgumentException("Tvrtka sa šifrom " + dto.tvrtkaSifra() + " ne postoji!");
            }
            djelatnik.setTvrtka(tvrtka);
        } else {
            djelatnik.setTvrtka(null);
        }
    }

    public List<DjelatnikOdgovorDTO> getAll() {
        try {
            List<Djelatnik> djelatnici = session.createQuery(
                    "SELECT d FROM Djelatnik d LEFT JOIN FETCH d.odjel LEFT JOIN FETCH d.tvrtka", 
                    Djelatnik.class).list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Greška pri dohvatu svih djelatnika: " + e.getMessage(), e);
        }
    }

    public DjelatnikOdgovorDTO getBySifra(int sifra) {
        try {
            Djelatnik djelatnik = session.createQuery(
                    "SELECT d FROM Djelatnik d LEFT JOIN FETCH d.odjel LEFT JOIN FETCH d.tvrtka WHERE d.sifra = :sifra", 
                    Djelatnik.class)
                    .setParameter("sifra", sifra)
                    .uniqueResult();
            
            if (djelatnik == null) {
                throw new NoResultException("Djelatnik sa šifrom " + sifra + " ne postoji!");
            }
            
            return convertToResponseDTO(djelatnik);
        } catch (Exception e) {
            throw new RuntimeException("Greška pri dohvatu djelatnika: " + e.getMessage(), e);
        }
    }
 
    public DjelatnikOdgovorDTO post(DjelatnikDTO o) {
        try {
            Djelatnik djelatnik = convertToEntity(o);
            session.beginTransaction();
            session.persist(djelatnik);
            session.flush();
            return convertToResponseDTO(djelatnik);
        } catch (Exception e) {
            throw new RuntimeException("Greška prilikom stvaranja djelatnika: " + e.getMessage(), e);
        }
    }

    public DjelatnikOdgovorDTO put(DjelatnikDTO o, int sifra) {
        try {
            Djelatnik dj = session.get(Djelatnik.class, sifra);
            if (dj == null) {
                throw new NoResultException("Djelatnik sa šifrom " + sifra + " ne postoji!");
            }
            updateEntityFromDto(dj, o);
            session.merge(dj);
            session.flush();
            return convertToResponseDTO(dj);
        } catch (Exception e) {
            throw new RuntimeException("Greška pri ažuriranju djelatnika: " + e.getMessage(), e);
        }
    }

    public void softDelete(int sifra) {
        Djelatnik d = session.get(Djelatnik.class, sifra);
        if (d == null) {
            throw new NoResultException("Djelatnik sa šifrom " + sifra + " ne postoji!");
        }
        d.setJeZaposlen(false);
        session.beginTransaction();
        session.persist(d);
        session.getTransaction().commit();
    }
    
    public void delete(int sifra){
        Djelatnik d = session.get(Djelatnik.class, sifra);
        if (d == null) {
            throw new NoResultException("Djelatnik sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        session.beginTransaction();
        session.remove(d);
        session.getTransaction().commit();
    }

    @Transactional
    public List<DjelatnikOdgovorDTO> getAllZaposleni(boolean zaposlen) {
        try {
            List<Djelatnik> djelatnici = session.createQuery(
                    "SELECT d FROM Djelatnik d LEFT JOIN FETCH d.odjel LEFT JOIN FETCH d.tvrtka WHERE d.jeZaposlen = :zaposlen", 
                    Djelatnik.class)
                    .setParameter("zaposlen", zaposlen)
                    .list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Greška pri dohvatu zaposlenih: " + e.getMessage(), e);
        }
    }

    @Transactional
    public List<DjelatnikOdgovorDTO> getByImePrezime(String uvjet) {
        try {
            List<Djelatnik> djelatnici = session.createQuery(
                    "SELECT d FROM Djelatnik d LEFT JOIN FETCH d.odjel LEFT JOIN FETCH d.tvrtka " +
                    "WHERE LOWER(d.imeDjelatnika) LIKE LOWER(:uvjet) " +
                    "OR LOWER(d.prezimeDjelatnika) LIKE LOWER(:uvjet)", 
                    Djelatnik.class)
                    .setParameter("uvjet", "%" + uvjet + "%")
                    .list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Greška pri pretraživanju djelatnika: " + e.getMessage(), e);
        }
    }
    
    public List<DjelatnikOdgovorDTO> getByPocetakRada(Date uvjet){
        try {
            List<Djelatnik> djelatnici = session.createQuery(
                    "select d from Djelatnik d left join fetch d.odjel left join fetch d.tvrtka " +
                    "where lower (d.pocetakRada) like lower(:uvjet)",
                    Djelatnik.class)
                    .setParameter("uvjet", "%" + uvjet + "%")
                    .list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Greška pri pretraživanju djelatnika: " + e.getMessage(), e);
        }
    }

    @Transactional
    public PlacaOdgovorDTO izracunajPlacu(int sifra, BigDecimal brutoOsnovica) {
        if (brutoOsnovica == null || brutoOsnovica.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Bruto osnovica mora biti veća od 0!");
        }
        
        Djelatnik dj = session.get(Djelatnik.class, sifra);
        if (dj == null) {
            throw new IllegalArgumentException("Djelatnik sa šifrom " + sifra + " ne postoji!");
        }
        
        final int scale = 2;
        BigDecimal stopaMirovinsko1Stup = new BigDecimal("0.15");
        BigDecimal stopaMirovinsko2Stup = new BigDecimal("0.05");
        BigDecimal ukupnaStopaMirovinsko = new BigDecimal("0.20");
        
        BigDecimal mirovinskoStup1 = brutoOsnovica.multiply(stopaMirovinsko1Stup).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal mirovinskoStup2 = brutoOsnovica.multiply(stopaMirovinsko2Stup).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal ukupniDoprinosiIzPlace = brutoOsnovica.multiply(ukupnaStopaMirovinsko).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal poreznaOsnovica = brutoOsnovica.subtract(ukupniDoprinosiIzPlace).setScale(scale, RoundingMode.HALF_UP);
        
        BigDecimal stopaPorezaNaNizi = new BigDecimal("0.20");
        BigDecimal porezNaDohodak = poreznaOsnovica.multiply(stopaPorezaNaNizi).setScale(scale, RoundingMode.HALF_UP);
        
        BigDecimal stopaPrirez = new BigDecimal("0.15");
        BigDecimal prirez = porezNaDohodak.multiply(stopaPrirez).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal ukupniPorezPrirez = porezNaDohodak.add(prirez).setScale(scale, RoundingMode.HALF_UP);
        
        BigDecimal netoPlaca = poreznaOsnovica.subtract(ukupniPorezPrirez).setScale(scale, RoundingMode.HALF_UP);
        
        BigDecimal stopaZdravstveno = new BigDecimal("0.165");
        BigDecimal zdravstvenoOsiguranje = brutoOsnovica.multiply(stopaZdravstveno).setScale(scale, RoundingMode.HALF_UP);
        
        return new PlacaOdgovorDTO(
                sifra,
                brutoOsnovica,
                mirovinskoStup1,
                mirovinskoStup2,
                zdravstvenoOsiguranje,
                poreznaOsnovica,
                ukupniPorezPrirez,
                netoPlaca
        );
    }
}
