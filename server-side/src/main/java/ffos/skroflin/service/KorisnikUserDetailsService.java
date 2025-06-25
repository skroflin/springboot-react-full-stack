/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Korisnik;
import jakarta.persistence.NoResultException;
import java.util.Collections;
import org.hibernate.Session;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class KorisnikUserDetailsService extends MainService implements UserDetailsService{
    @Override
    public UserDetails loadUserByUsername(String korisnickoIme) throws UsernameNotFoundException {
        Korisnik korisnik = null;
        try(Session s = session.getSessionFactory().openSession()) {
            korisnik = s.createQuery(
                    "from korisnik k where k.korisnickoIme = :korisnickoIme and k.aktivan = true", Korisnik.class)
                    .setParameter("korisnickoIme", korisnickoIme)
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new UsernameNotFoundException(
                    "Korisnik s navedenim korisničkim imenom"
                            + " " + korisnickoIme + " " + "ne postoji!");
        }
        
        GrantedAuthority authority = new SimpleGrantedAuthority("role_" + korisnik.getUloga().name());
        return new User(
                korisnik.getKorisnickoIme(),
                korisnik.getLozinka(),
                Collections.singletonList(authority)
        );
    }
}
