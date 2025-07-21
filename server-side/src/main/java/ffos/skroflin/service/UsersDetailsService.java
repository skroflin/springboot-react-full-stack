/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import ffos.skroflin.model.Users;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
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
public class UsersDetailsService extends MainService implements UserDetailsService{
    
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Users u = null;
        try(Session s = session.getSessionFactory().openSession()) {
            u = s.createQuery("from Users u where u.userName = :userName and u.active = true", Users.class)
                    .setParameter("korisnickoIme", userName)
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new UsernameNotFoundException(
                    "User with the given username:"
                            + " " + userName + " " + "doesn't exist!");
        }
        
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + u.getRole().name().toUpperCase());
        return new User(
                u.getUserName(),
                u.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
