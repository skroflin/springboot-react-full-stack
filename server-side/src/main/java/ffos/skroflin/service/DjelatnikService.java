/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Djelatnik;
import ffos.skroflin.model.dto.DjelatnikDTO;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class DjelatnikService extends MainService {

    public List<Djelatnik> getAll() {
        return session.createQuery("from djelatnik", Djelatnik.class).list();
    }

    public Djelatnik getBySifra(int sifra) {
        return session.get(Djelatnik.class, sifra);
    }

    public Djelatnik post(DjelatnikDTO o) {
        Djelatnik d = new Djelatnik(o.imeDjelatnika(), o.prezimeDjelatnika(), o.placaDjelatnika(), o.datumRodenja(), o.pocetakRada(), o.jeZaposlen());
        session.beginTransaction();
        session.persist(d);
        session.getTransaction().commit();
        return d;
    }

    public void put(DjelatnikDTO o, int sifra) {
        session.beginTransaction();
        Djelatnik d = (Djelatnik) session.get(Djelatnik.class, sifra);
        d.setImeDjelatnika(o.imeDjelatnika());
        d.setPrezimeDjelatnika(o.prezimeDjelatnika());
        d.setPlacaDjelatnika(o.placaDjelatnika());
        d.setDatumRodenja(o.datumRodenja());
        d.setPocetakRada(o.pocetakRada());
        d.setJeZaposlen(o.jeZaposlen());
        session.persist(d);
        session.beginTransaction().commit();
    }

    public void softDelete(int sifra) {
        session.beginTransaction();
        Djelatnik d = session.get(Djelatnik.class, sifra);
        d.setJeZaposlen(false);
        session.merge(d);
        session.getTransaction().commit();
    }

    public List<Djelatnik> getAllZaposleni(boolean zaposlen) {
        return session.createQuery(
                "from djelatnik d where d.zaposlen = :uvjet", Djelatnik.class)
                .setParameter("zaposlen", zaposlen)
                .list();
    }
}
