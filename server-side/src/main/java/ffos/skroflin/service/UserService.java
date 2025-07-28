/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import com.github.javafaker.Faker;
import ffos.skroflin.model.Users;
import ffos.skroflin.model.dto.user.UserDTO;
import ffos.skroflin.model.dto.user.UserResponseDTO;
import ffos.skroflin.model.dto.user.UserSignUpDTO;
import ffos.skroflin.model.dto.user.UserRegistrationDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class UserService extends MainService{
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }
    
    private UserResponseDTO mapToResponseDTO(Users user){
        return new UserResponseDTO(user.getId(), user.getUserName(), user.getEmail(), user.isActive(), user.getDateCreated(), user.getDateUpdated(), user.getRole());
    }
    
    @Transactional
    private Users convertToEntity(UserDTO dto){
        Users user = new Users();
        user.setUserName(dto.userName());
        user.setEmail(dto.email());
        user.setActive(dto.active());
        user.setRole(dto.role());
        user.setDateCreated(dto.dateCreated());
        return user;
    }
    
    @Transactional
    private void updateEntityFromDto(Users user, UserDTO dto){
        user.setUserName(dto.userName());
        user.setEmail(dto.email());
        user.setActive(dto.active());
        user.setRole(dto.role());
        user.setDateCreated(dto.dateCreated());
    }
    
    public List<UserResponseDTO> getAll(){
        List<Users> users = session.createQuery("from Users u where u.role = 'user'", Users.class).list();
        return users.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public UserResponseDTO getById(int sifra){
        Users user = session.get(Users.class, sifra);
        return mapToResponseDTO(user);
    }
    
    public UserResponseDTO put(UserDTO o, int id){
        Users u = (Users) session.get(Users.class, id);
        if (u == null) {
            throw new NoResultException("User with id" + " " + id + " " + "doesn't exist!");
        }
        if (!u.getUserName().equals(o.userName())) {
            Long count = session.createQuery(
                    "select count(*) from Users u "
                            + "where u.userName= :name", Long.class)
                    .getSingleResult();
            if (count > 0) {
                throw new IllegalArgumentException("User with the said username" + " " + o.userName() + " " + "already exists!");
            }
        }
        updateEntityFromDto(u, o);
        session.beginTransaction();
        session.persist(u);
        session.getTransaction().commit();
        return mapToResponseDTO(u);
    }
    
    public void delete(int id){
        Users user = session.get(Users.class, id);
        if (user == null) {
            throw new NoResultException("Users with id" + " " + id + " " + "doesn't exist!");
        }
        session.remove(user);
    }
    
    @Transactional
    public List<UserResponseDTO> getActiveUsers(boolean active){
        List<Users> users = session.createQuery("from Users u where u.active = :active", Users.class)
                .setParameter("active", active)
                .getResultList();
        return users.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<UserResponseDTO> getByName(String name) {
        try {
            List<Users> users = session.createQuery("select u from Users u "
                    + "where lower (u.userName) like lower (:name)",
                Users.class)
                .setParameter("name", "%" + name + "%")
                .list();
            return users.stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon searching employees: " + e.getMessage());
        }
    }
    
    public List<UserResponseDTO> getByDateOfCreation(Date timestamp){
        try {
            List<Users> users = session.createQuery("select u from User u "
                    + "where lower(u.dateCreated) like lower (:timestamp)",
                    Users.class)
                    .setParameter("timestamp", "%" + timestamp + "%")
                    .list();
            return users.stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon searching employees: " + e.getMessage());
        }
    }
    
    public UserResponseDTO userRegistration(UserRegistrationDTO o){
        Users newUser = new Users();
        session.beginTransaction();
        newUser.setUserName(o.userName());
        newUser.setPassword(bCryptPasswordEncoder.encode(o.password()));
        newUser.setEmail(o.email());
        newUser.setActive(o.active());
        newUser.setRole(o.role());
        session.persist(newUser);
        session.getTransaction().commit();
        return mapToResponseDTO(newUser);
    }
    
    public UserResponseDTO userSignUp(UserSignUpDTO o){
        Users user = session.createQuery(
                "from Users u where u.userName = :userName "
                        + "and u.active = true", 
                Users.class)
                .setParameter("userName", o.userName())
                .getSingleResult();
        if (!bCryptPasswordEncoder.matches(o.password(), user.getPassword())) {
            throw new IllegalArgumentException("Wrong password!");
        }
        return mapToResponseDTO(user);
    }
    
    public Long getNumOfUsers(){
        Long user = session.createQuery(
                "select count(u.id) from Users u", Long.class)
                .getSingleResult();
        return user;
    }
    
    public Long getNumOfActiveUsers(){
        Long user = session.createQuery(
                "select count(u.id) from Users u "
                        + "where u.active = true", Long.class)
                .getSingleResult();
        return user;
    }
    
    public Long getNumOfInactiveUsers(){
        Long user = session.createQuery(
                "select count(u.id)  from Users u "
                        + "where u.active = false", Long.class)
                .getSingleResult();
        return user;
    }
    
    /*
    public UserResponseDTO massiveInsert(UserDTO o, int number){
        Users u;
        Faker f = new Faker();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyy-MM-dd");
        session.beginTransaction();
        for (int i = 0; i < number; i++) {
            u = new Users(f.name().username(), bCryptPasswordEncoder.encode(f.internet().password()), f.internet().emailAddress(). );
            session.persist(u);
        }
        session.getTransaction().commit();
        return mapToResponseDTO(u);
    }
    */
}
