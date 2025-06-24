/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Odjel;
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
        return new OdjelOdgovorDTO(odjel.getSifra(), odjel.getNazivOdjela(), odjel.getLokacijaOdjela(), odjel.isJeAktivan());
    }
    
    private Odjel convertToEntity(OdjelDTO dto){
        return new Odjel(dto.nazivOdjela(), dto.lokacijaOdjela(), dto.jeAktivan());
    }
    
    private void updateEntityFromDto(Odjel odjel, OdjelDTO dto){
        odjel.setNazivOdjela(dto.nazivOdjela());
        odjel.setLokacijaOdjela(dto.lokacijaOdjela());
        odjel.setJeAktivan(dto.jeAktivan());
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
        Long count = session.createQuery(
                "select (count) from odjel o where o.nazivOdjela = :naziv", Long.class)
                .setParameter("naziv", o.nazivOdjela())
                .uniqueResult();
        if (count > 0) {
            throw new IllegalArgumentException("Odjel s nazivom" + " " + o.nazivOdjela() + " " + "već postoji!");
        }
        Odjel odjel = convertToEntity(o);
        session.beginTransaction();
        session.persist(odjel);
        session.getTransaction().commit();
        return convertToResponseDTO(odjel);
    }

    @PreAuthorize("hasRole('admin')")
    public OdjelOdgovorDTO put(OdjelDTO o, int sifra) {
        session.beginTransaction();
        Odjel od = (Odjel) session.get(Odjel.class, sifra);
        if (od == null) {
            session.getTransaction().rollback();
            throw new NoResultException("Odjel s šifrom" + " " + sifra + " " + "ne postoji!");
        }
        if (!od.getNazivOdjela().equals(o.nazivOdjela())) {
            Long count = session.createQuery(
                    "select (count) from odjel o where o.nazivOdjela = :naziv", Long.class)
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
