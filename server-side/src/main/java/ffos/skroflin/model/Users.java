/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model;

import ffos.skroflin.model.enums.Role;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.Date;

/**
 *
 * @author svenk
 */
@Entity
@AttributeOverride(name = "id", column = @Column(name = "user_id"))
@Table(
        name = "user",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "username", name = "uq_username"),
            @UniqueConstraint(columnNames = "email", name = "uq_user_email")
        })
public class Users extends MainEntity {

    @Column(name = "username", nullable = false)
    private String userName;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String email;
    private boolean active;
    @Column(name = "date_created")
    private Date dateCreated;    
    @Column(name = "date_update")
    private Date dateUpdated;
    @Enumerated(EnumType.STRING)
    private Role role;

    public Users() {
    }

    public Users(String userName, String password, String email, boolean active, Date dateCreated, Date dateUpdated, Role role) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.active = active;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.role = role;
    }

    @PrePersist
    protected void onCreation(){
        dateCreated = new Date();
    }
    
    @PreUpdate
    protected void preUpdate(){
        dateUpdated = new Date();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Date getDateUpdated() {
        return dateUpdated;
    }

    public void setDateUpdated(Date dateUpdated) {
        this.dateUpdated = dateUpdated;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    
    
}
