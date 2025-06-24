/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Djelatnik;
import ffos.skroflin.model.Odjel;
import ffos.skroflin.model.Tvrtka;
import ffos.skroflin.model.dto.TvrtkaDTO;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class TvrtkaService extends MainService{
    public List<Tvrtka> getAll(){
        return session.createQuery("from tvrtka", Tvrtka.class).list();
    }
    
    public Tvrtka getBySifra(int sifra){
        return session.get(Tvrtka.class, sifra);
    }
    
    @PreAuthorize("hasRole('admin')")
    public Tvrtka post(TvrtkaDTO o){
        Odjel odjel = session.get(Odjel.class, o.odjelSifra());
        Djelatnik djelatnik = session.get(Djelatnik.class, o.djelatnikSifra());
        Tvrtka t = new Tvrtka(o.nazivTvrtke(), o.sjedisteTvrtke(), o.uStjecaju(), odjel, djelatnik);
        session.beginTransaction();
        session.persist(t);
        session.getTransaction().commit();
        return t;
    }
    
    @PreAuthorize("hasRole('admin')")
    public void put(TvrtkaDTO o, int sifra){
        session.beginTransaction();
        Odjel odjel = (Odjel) session.get(Odjel.class, o.odjelSifra());
        Djelatnik djelatnik = (Djelatnik) session.get(Djelatnik.class, o.djelatnikSifra());
        Tvrtka t = (Tvrtka) session.get(Tvrtka.class, sifra);
        t.setNazivTvrtke(o.nazivTvrtke());
        t.setSjedisteTvrtke(o.sjedisteTvrtke());
        t.setUStjecaju(o.uStjecaju());
        t.setOdjel(odjel);
        t.setDjelatnik(djelatnik);
        session.persist(t);
        session.getTransaction().commit();
    }
    
    @PreAuthorize("hasRole('admin')")
    public void delete(int sifra){
        session.beginTransaction();
        session.remove(session.get(Tvrtka.class, sifra));
        session.getTransaction().commit();
    }
    
    @PreAuthorize("hasRole('admin')")
    public void softDelete(int sifra){
        session.beginTransaction();
        Tvrtka t = session.get(Tvrtka.class, sifra);
        t.setUStjecaju(false);
        session.merge(t);
        session.getTransaction().commit();
    }
    
    public List<Tvrtka> getAktivneTvrtke(boolean aktivan){
        return session.createQuery(
                "from tvrtka t where t.aktivan = :uvjet", Tvrtka.class)
                .setParameter("uvjet", aktivan)
                .list();
    }
}
