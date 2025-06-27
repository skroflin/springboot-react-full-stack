/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Djelatnik;
import ffos.skroflin.model.Odjel;
import ffos.skroflin.model.Tvrtka;
import ffos.skroflin.model.dto.tvrtka.TvrtkaDTO;
import ffos.skroflin.model.dto.tvrtka.TvrtkaOdgovorDTO;
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
public class TvrtkaService extends MainService{
    
    private TvrtkaOdgovorDTO convertToResponseDTO(Tvrtka tvrtka){
        Integer sifraOdjel = (tvrtka.getOdjel() != null) ? tvrtka.getOdjel().getSifra() : null;
        
        return new TvrtkaOdgovorDTO(
                tvrtka.getSifra(), 
                tvrtka.getNazivTvrtke(), 
                tvrtka.getSjedisteTvrtke(), 
                tvrtka.isUStjecaju(), 
                sifraOdjel
        );
    }
    
    private Tvrtka convertToEntity(TvrtkaDTO dto){
        Tvrtka tvrtka = new Tvrtka();
        tvrtka.setNazivTvrtke(dto.nazivTvrtke());
        tvrtka.setSjedisteTvrtke(dto.sjedisteTvrtke());
        tvrtka.setUStjecaju(dto.uStjecaju());
        if (dto.odjelSifra() != null) {
            Odjel odjel = session.get(Odjel.class, dto.odjelSifra());
            if (odjel == null) {
                throw new IllegalArgumentException("Odjel sa šifrom" + " " + dto.odjelSifra() + " " + "ne postoji!");
            }
            tvrtka.setOdjel(odjel);
        }
        return tvrtka;
    }
    
    private void updateEntityFromDto(Tvrtka tvrtka, TvrtkaDTO dto){
        tvrtka.setNazivTvrtke(dto.nazivTvrtke());
        tvrtka.setSjedisteTvrtke(dto.sjedisteTvrtke());
        tvrtka.setUStjecaju(dto.uStjecaju());
        if (dto.odjelSifra() != null) {
            Odjel odjel = session.get(Odjel.class, dto.odjelSifra());
            if (odjel == null) {
                throw new IllegalArgumentException("Odjel sa šifrom" + " " + dto.odjelSifra() + " " + "ne postoji!");
            }
            tvrtka.setOdjel(odjel);
        } else {
            tvrtka.setOdjel(null);
        }
    }
    
    public List<TvrtkaOdgovorDTO> getAll(){
        List<Tvrtka> tvrtke = session.createQuery(
                "from tvrtka", Tvrtka.class).list();
        return tvrtke.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public TvrtkaOdgovorDTO getBySifra(int sifra){
        Tvrtka tvrtka = session.get(Tvrtka.class, sifra);
        return convertToResponseDTO(tvrtka);
    }
    
    @PreAuthorize("hasRole('admin')")
    public TvrtkaOdgovorDTO post(TvrtkaDTO o){
        try {
            Long count = session.createQuery(
                    "select count(*) from tvrtka t where t.nazivTvrtke = :naziv", Long.class)
                    .setParameter("naziv", o.nazivTvrtke())
                    .getSingleResult();
            if (count > 0) {
                session.getTransaction().rollback();
                throw new IllegalArgumentException("Tvrtka s nazivom" + " " + o.nazivTvrtke() + " " + "već postoji!");
            }
            Tvrtka tvrtka = convertToEntity(o);
            session.beginTransaction();
            session.persist(tvrtka);
            session.getTransaction().commit();
            return convertToResponseDTO(tvrtka);
        } catch (Exception e) {
            throw new RuntimeException("Greška prilikom stvaranja tvrtke" + " " + e.getMessage(), e);
        }
    }
    
    @PreAuthorize("hasRole('admin')")
    public TvrtkaOdgovorDTO put(TvrtkaDTO o, int sifra){
        Tvrtka t = (Tvrtka) session.get(Tvrtka.class, sifra);
        if (t == null) {
            throw new NoResultException("Tvrtka sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        if (!t.getNazivTvrtke().equals(o.nazivTvrtke())) {
            Long count = session.createQuery(
                    "select count(*) from tvrtka t where t.nazivTvrtke = :naziv", Long.class)
                    .setParameter("naziv", o.nazivTvrtke())
                    .getSingleResult();
            if (count > 0) {
                throw new IllegalArgumentException("Tvrtka s nazivom" + " " + o.nazivTvrtke() + " " + "već postoji!");
            }
        }
        updateEntityFromDto(t, o);
        session.beginTransaction();
        session.persist(t);
        session.getTransaction().commit();
        return convertToResponseDTO(t);
    }
    
    @PreAuthorize("hasRole('admin')")
    public void delete(int sifra){
        Tvrtka tvrtka = session.get(Tvrtka.class, sifra);
        if (tvrtka == null) {
            throw new NoResultException("Tvrtka sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        session.remove(tvrtka);
    }
    
    @PreAuthorize("hasRole('admin')")
    public void softDelete(int sifra){
        Tvrtka tvrtka = session.get(Tvrtka.class, sifra);
        if (tvrtka == null) {
            throw new NoResultException("Tvrtka sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        tvrtka.setUStjecaju(false);
    }
    
    public List<TvrtkaOdgovorDTO> getAktivneTvrtke(boolean aktivan){
        List<Tvrtka> tvrtke = session.createQuery(
                "from tvrtka t where t.aktivan = :uvjet", Tvrtka.class)
                .setParameter("uvjet", aktivan)
                .getResultList();
        return tvrtke.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
}
