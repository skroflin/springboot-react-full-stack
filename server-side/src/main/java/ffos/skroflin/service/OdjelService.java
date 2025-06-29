/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Odjel;
import ffos.skroflin.model.Tvrtka;
import ffos.skroflin.model.dto.odjel.OdjelDTO;
import ffos.skroflin.model.dto.odjel.OdjelOdgovorDTO;
import jakarta.persistence.NoResultException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class OdjelService extends MainService {

    private OdjelOdgovorDTO convertToResponseDTO(Odjel odjel){
        Integer sifraTvrtka = (odjel.getTvrtka() != null) ? odjel.getTvrtka().getSifra() : null;
        return new OdjelOdgovorDTO(
                odjel.getSifra(), 
                odjel.getNazivOdjela(), 
                odjel.getLokacijaOdjela(), 
                odjel.isJeAktivan(),
                sifraTvrtka
        );
    }
    
    private Odjel convertToEntity(OdjelDTO dto){
        Odjel odjel = new Odjel();
        odjel.setNazivOdjela(dto.nazivOdjela());
        odjel.setLokacijaOdjela(dto.lokacijaOdjela());
        odjel.setJeAktivan(dto.jeAktivan());
        if (dto.tvrtkaSifra() != null) {
            Tvrtka tvrtka = session.get(Tvrtka.class, dto.tvrtkaSifra());
            if (tvrtka == null) {
                throw new IllegalArgumentException("Tvrtka sa šifrom" + " " + dto.tvrtkaSifra() + " " + "ne postoji!");
            }
            odjel.setTvrtka(tvrtka);
        }
        return odjel;
    }
    
    private void updateEntityFromDto(Odjel odjel, OdjelDTO dto){
        odjel.setNazivOdjela(dto.nazivOdjela());
        odjel.setLokacijaOdjela(dto.lokacijaOdjela());
        odjel.setJeAktivan(dto.jeAktivan());
        if (dto.tvrtkaSifra() != null) {
            Tvrtka tvrtka = session.get(Tvrtka.class, dto.tvrtkaSifra());
            if (tvrtka == null) {
                throw new IllegalArgumentException("Tvrtka sa šifrom" + " " + dto.tvrtkaSifra() + " " + "ne postoji!");
            }
            odjel.setTvrtka(tvrtka);
        } else {
            odjel.setTvrtka(null);
        }
    }
    
    public List<OdjelOdgovorDTO> getAll() {
        List<Odjel> odjeli = session.createQuery(
                "from odjel", Odjel.class).list();
        return odjeli.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public OdjelOdgovorDTO getBySifra(int sifra) {
        Odjel odjel = session.get(Odjel.class, sifra);
        return convertToResponseDTO(odjel);
    }
    
    @PreAuthorize("hasRole('admin')")
    public OdjelOdgovorDTO post(OdjelDTO o) {
        try {
            Long count = session.createQuery(
                    "select count(*) from odjel o where o.nazivOdjela = :naziv", Long.class)
                    .setParameter("naziv", o.nazivOdjela())
                    .uniqueResult();
            if (count > 0) {
                session.getTransaction().rollback();
                throw new IllegalArgumentException("Odjel s nazivom" + " " + o.nazivOdjela() + " " + "već postoji!");
            }
            Odjel odjel = convertToEntity(o);
            session.beginTransaction();
            session.persist(odjel);
            session.getTransaction().commit();
            return convertToResponseDTO(odjel);
        } catch (Exception e) {
            throw new RuntimeException("Greška prilikom stvaranja odjela" + " " + e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('admin')")
    public OdjelOdgovorDTO put(OdjelDTO o, int sifra) {
        session.beginTransaction();
        Odjel od = (Odjel) session.get(Odjel.class, sifra);
        if (od == null) {
            session.getTransaction().rollback();
            throw new NoResultException("Odjel sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        if (!od.getNazivOdjela().equals(o.nazivOdjela())) {
            Long count = session.createQuery(
                    "select count(*) from odjel o where o.nazivOdjela = :naziv", Long.class)
                    .setParameter("naziv", o.nazivOdjela())
                    .uniqueResult();
            if (count > 0) {
                session.getTransaction().rollback();
                throw new IllegalArgumentException("Odjel s nazivom" + " " + o.nazivOdjela() + " " + "već postoji!");
            }
        }
        updateEntityFromDto(od, o);
        session.persist(od);
        session.getTransaction().commit();
        return convertToResponseDTO(od);
    }

    @PreAuthorize("hasRole('admin')")
    public void softDelete(int sifra) {
        session.beginTransaction();
        Odjel o = session.get(Odjel.class, sifra);
        o.setJeAktivan(false);
        session.merge(o);
        session.getTransaction();
    }
}
