/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Odjel;
import ffos.skroflin.model.dto.OdjelDTO;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class OdjelService extends MainService {

    public List<Odjel> getAll() {
        return session.createQuery("from odjel", Odjel.class).list();
    }

    public Odjel getBySifra(int sifra){
        return session.get(Odjel.class, sifra);
    }
    
    public Odjel post(OdjelDTO o){
        Odjel od = new Odjel(o.nazivOdjela(), o.lokacijaOdjela(), o.jeAktivan());
        session.beginTransaction();
        session.persist(od);
        session.getTransaction().commit();
        return od;
    }
    
    public void put(OdjelDTO o, int sifra){
        session.beginTransaction();
        Odjel od = (Odjel) session.get(Odjel.class, sifra);
        od.setNazivOdjela(o.nazivOdjela());
        od.setLokacijaOdjela(o.lokacijaOdjela());
        od.setJeAktivan(o.jeAktivan());
        session.persist(od);
        session.getTransaction().commit();
    }
}
