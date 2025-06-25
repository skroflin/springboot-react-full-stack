/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Djelatnik;
import ffos.skroflin.model.dto.djelatnik.DjelatnikDTO;
import ffos.skroflin.model.dto.djelatnik.DjelatnikOdgovorDTO;
import ffos.skroflin.model.dto.djelatnik.PlacaOdgovorDTO;
import jakarta.persistence.NoResultException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class DjelatnikService extends MainService {

    private DjelatnikOdgovorDTO convertToResponseDTO(Djelatnik djelatnik){
        return new DjelatnikOdgovorDTO(djelatnik.getSifra(), djelatnik.getImeDjelatnika(), djelatnik.getPrezimeDjelatnika(), djelatnik.getPlacaDjelatnika(), djelatnik.getPocetakRada(), djelatnik.isJeZaposlen());
    }
    
    private Djelatnik convertToEntity(DjelatnikDTO dto) {
        return new Djelatnik(dto.imeDjelatnika(), dto.prezimeDjelatnika(), dto.placaDjelatnika(), dto.datumRodenja(), dto.pocetakRada(), dto.jeZaposlen());
    }
    
    private void updateEntityFromDto(Djelatnik djelatnik, DjelatnikDTO dto){
        djelatnik.setImeDjelatnika(dto.imeDjelatnika());
        djelatnik.setPrezimeDjelatnika(dto.prezimeDjelatnika());
        djelatnik.setPlacaDjelatnika(dto.placaDjelatnika());
        djelatnik.setPocetakRada(dto.pocetakRada());
        djelatnik.setJeZaposlen(dto.jeZaposlen());
    }
    
    public List<DjelatnikOdgovorDTO> getAll() {
        List<Djelatnik> djelatnici = session.createQuery(
                "from djelatnik", Djelatnik.class).list();
        return djelatnici.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public DjelatnikOdgovorDTO getBySifra(int sifra) {
        Djelatnik djelatnik = session.get(Djelatnik.class, sifra);
        return convertToResponseDTO(djelatnik);
    }

    @PreAuthorize("hasRole('admin')")
    public DjelatnikOdgovorDTO post(DjelatnikDTO o) {
        Djelatnik djelatnik = convertToEntity(o);
        session.beginTransaction();
        session.persist(djelatnik);
        session.getTransaction().commit();
        return convertToResponseDTO(djelatnik);
    }

    @PreAuthorize("hasRole('admin')")
    public DjelatnikOdgovorDTO put(DjelatnikDTO o, int sifra) {
        session.beginTransaction();
        Djelatnik dj = (Djelatnik) session.get(Djelatnik.class, sifra);
        if (dj == null) {
            session.getTransaction().rollback();
            throw new NoResultException("Djelatnik sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        updateEntityFromDto(dj, o);
        session.persist(dj);
        session.getTransaction().commit();
        return convertToResponseDTO(dj);
    }

    @PreAuthorize("hasRole('admin')")
    public void softDelete(int sifra) {
        session.beginTransaction();
        Djelatnik d = session.get(Djelatnik.class, sifra);
        d.setJeZaposlen(false);
        session.merge(d);
        session.getTransaction().commit();
    }

    public List<DjelatnikOdgovorDTO> getAllZaposleni(boolean zaposlen) {
        List<Djelatnik> djelatnici = session.createQuery(
                "from Djelatnik d where d.zaposlen = :zaposlen", Djelatnik.class)
                .setParameter("zaposlen", zaposlen)
                .list();
        return djelatnici.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<DjelatnikOdgovorDTO> getByImePrezime(String uvjet){
        List<Djelatnik> djelatnici = session.createQuery(
                "from Djelatnik d "
                + " where lower(d.imeDjelatnika) like lower(:uvjet) "
                + " or lower(d.prezimeDjelatnika) like lower(:uvjet)", Djelatnik.class)
                .setParameter("uvjet", "%" + uvjet + "%")
                .list();
        return djelatnici.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public PlacaOdgovorDTO izracunajPlacu(int sifra, BigDecimal brutoOsnovica){
        if (brutoOsnovica == null || brutoOsnovica.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Bruto osnovica mora biti veća od 0!");
        }
        Djelatnik dj = session.get(Djelatnik.class, sifra);
        if (dj == null) {
            throw new IllegalArgumentException("Djelatnik sa šifrom" + " " + sifra + " " + "ne postoji!");
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
