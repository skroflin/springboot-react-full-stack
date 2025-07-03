package ffos.skroflin.service;

import ffos.skroflin.model.Odjel;
import ffos.skroflin.model.Tvrtka;
import ffos.skroflin.model.dto.odjel.OdjelDTO;
import ffos.skroflin.model.dto.odjel.OdjelOdgovorDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class OdjelService extends MainService {
        
    private OdjelOdgovorDTO convertToResponseDTO(Odjel odjel){
        if (odjel == null) {
            return null;
        }
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
                throw new IllegalArgumentException("Tvrtka sa šifrom " + dto.tvrtkaSifra() + " ne postoji!");
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
                throw new IllegalArgumentException("Tvrtka sa šifrom " + dto.tvrtkaSifra() + " ne postoji!");
            }
            odjel.setTvrtka(tvrtka);
        } else {
            odjel.setTvrtka(null);
        }
    }
            
    @Transactional
    public List<OdjelOdgovorDTO> getAll() {
        try {
            List<Odjel> odjeli = session.createQuery(
                    "SELECT o FROM Odjel o LEFT JOIN FETCH o.tvrtka", Odjel.class).list();
            return odjeli.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Greška pri dohvatu svih odjela: " + e.getMessage(), e);
        }
    }
        
    @Transactional
    public OdjelOdgovorDTO getBySifra(int sifra) {
        try {
            Odjel odjel = session.createQuery(
                    "SELECT o FROM Odjel o LEFT JOIN FETCH o.tvrtka WHERE o.sifra = :sifra", Odjel.class)
                    .setParameter("sifra", sifra)
                    .uniqueResult();
            
            if (odjel == null) {
                throw new NoResultException("Odjel sa šifrom " + sifra + " ne postoji!");
            }
            
            return convertToResponseDTO(odjel);
        } catch (Exception e) {
            throw new RuntimeException("Greška pri dohvatu odjela: " + e.getMessage(), e);
        }
    }
            
    @PreAuthorize("hasRole('admin')")
    @Transactional
    public OdjelOdgovorDTO post(OdjelDTO o) {
        try {
            Long count = session.createQuery(
                    "SELECT COUNT(*) FROM Odjel o WHERE o.nazivOdjela = :naziv", Long.class)
                    .setParameter("naziv", o.nazivOdjela())
                    .uniqueResult();
            
            if (count > 0) {
                throw new IllegalArgumentException("Odjel s nazivom " + o.nazivOdjela() + " već postoji!");
            }
            
            Odjel odjel = convertToEntity(o);
            session.persist(odjel);
            session.flush();
            return convertToResponseDTO(odjel);
        } catch (Exception e) {
            throw new RuntimeException("Greška prilikom stvaranja odjela: " + e.getMessage(), e);
        }
    }
        
    @PreAuthorize("hasRole('admin')")
    @Transactional
    public OdjelOdgovorDTO put(OdjelDTO o, int sifra) {
        try {
            Odjel od = session.get(Odjel.class, sifra);
            if (od == null) {
                throw new NoResultException("Odjel sa šifrom " + sifra + " ne postoji!");
            }
            
            if (!od.getNazivOdjela().equals(o.nazivOdjela())) {
                Long count = session.createQuery(
                        "SELECT COUNT(*) FROM Odjel o WHERE o.nazivOdjela = :naziv", Long.class)
                        .setParameter("naziv", o.nazivOdjela())
                        .uniqueResult();
                
                if (count > 0) {
                    throw new IllegalArgumentException("Odjel s nazivom " + o.nazivOdjela() + " već postoji!");
                }
            }
            
            updateEntityFromDto(od, o);
            session.merge(od);
            session.flush();
            return convertToResponseDTO(od);
        } catch (Exception e) {
            throw new RuntimeException("Greška pri ažuriranju odjela: " + e.getMessage(), e);
        }
    }
        
    @PreAuthorize("hasRole('admin')")
    @Transactional
    public void softDelete(int sifra) {
        try {
            Odjel o = session.get(Odjel.class, sifra);
            if (o == null) {
                throw new NoResultException("Odjel sa šifrom " + sifra + " ne postoji!");
            }
            o.setJeAktivan(false);
            session.merge(o);
        } catch (Exception e) {
            throw new RuntimeException("Greška pri brisanju odjela: " + e.getMessage(), e);
        }
    }
}
