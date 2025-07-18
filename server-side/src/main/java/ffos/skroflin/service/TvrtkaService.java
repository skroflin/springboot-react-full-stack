/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Tvrtka;
import ffos.skroflin.model.dto.tvrtka.TvrtkaDTO;
import ffos.skroflin.model.dto.tvrtka.TvrtkaOdgovorDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class TvrtkaService extends MainService{
    
    private TvrtkaOdgovorDTO convertToResponseDTO(Tvrtka tvrtka){
        
        return new TvrtkaOdgovorDTO(
                tvrtka.getSifra(), 
                tvrtka.getNazivTvrtke(), 
                tvrtka.getSjedisteTvrtke(), 
                tvrtka.isUStjecaju()
        );
    }
    
    @Transactional
    private Tvrtka convertToEntity(TvrtkaDTO dto){
        Tvrtka tvrtka = new Tvrtka();
        tvrtka.setNazivTvrtke(dto.nazivTvrtke());
        tvrtka.setSjedisteTvrtke(dto.sjedisteTvrtke());
        tvrtka.setUStjecaju(dto.uStjecaju());
        return tvrtka;
    }
    
    @Transactional
    private void updateEntityFromDto(Tvrtka tvrtka, TvrtkaDTO dto){
        tvrtka.setNazivTvrtke(dto.nazivTvrtke());
        tvrtka.setSjedisteTvrtke(dto.sjedisteTvrtke());
        tvrtka.setUStjecaju(dto.uStjecaju());
    }
    
    @Transactional
    public List<TvrtkaOdgovorDTO> getAll(){
        List<Tvrtka> tvrtke = session.createQuery(
                "from Tvrtka", Tvrtka.class).list();
        return tvrtke.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TvrtkaOdgovorDTO getBySifra(int sifra){
        Tvrtka tvrtka = session.get(Tvrtka.class, sifra);
        return convertToResponseDTO(tvrtka);
    }
    
    @Transactional
    public TvrtkaOdgovorDTO post(TvrtkaDTO o){
        try {
            Long count = session.createQuery(
                    "select count(*) from Tvrtka t where t.nazivTvrtke = :naziv", Long.class)
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
    
    @Transactional
    public TvrtkaOdgovorDTO put(TvrtkaDTO o, int sifra){
        Tvrtka t = (Tvrtka) session.get(Tvrtka.class, sifra);
        if (t == null) {
            throw new NoResultException("Tvrtka sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        if (!t.getNazivTvrtke().equals(o.nazivTvrtke())) {
            Long count = session.createQuery(
                    "select count(*) from Tvrtka t where t.nazivTvrtke = :naziv", Long.class)
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
    
    @Transactional
    public void delete(int sifra){
        Tvrtka tvrtka = session.get(Tvrtka.class, sifra);
        if (tvrtka == null) {
            throw new NoResultException("Tvrtka sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        session.remove(tvrtka);
    }
    
    @Transactional
    public void softDelete(int sifra){
        Tvrtka tvrtka = session.get(Tvrtka.class, sifra);
        if (tvrtka == null) {
            throw new NoResultException("Tvrtka sa šifrom" + " " + sifra + " " + "ne postoji!");
        }
        tvrtka.setUStjecaju(true);
        session.beginTransaction();
        session.persist(tvrtka);
        session.getTransaction().commit();
    }
    
    @Transactional
    public List<TvrtkaOdgovorDTO> getAktivneTvrtke(boolean aktivan){
        List<Tvrtka> tvrtke = session.createQuery(
                "from Tvrtka t where t.uStjecaju = :uvjet", Tvrtka.class)
                .setParameter("uvjet", aktivan)
                .getResultList();
        return tvrtke.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<TvrtkaOdgovorDTO> getByNaziv(String uvjet){
        try {
            List<Tvrtka> tvrtke = session.createQuery(
                        "select t from Tvrtka t " +
                        "where lower (t.nazivTvrtke) like lower(:uvjet)",
                    Tvrtka.class)
                    .setParameter("uvjet", "%" + uvjet + "%")
                    .list();
            return tvrtke.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Greška pri pretraživanju tvrtki: " + e.getMessage(), e);
        }
    }
}
