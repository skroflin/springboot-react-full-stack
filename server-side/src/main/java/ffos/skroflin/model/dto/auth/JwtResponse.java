/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model.dto.auth;

import ffos.skroflin.model.enums.Role;

/**
 *
 * @author svenk
 */
public class JwtResponse {
    private String jwt;
    private String userName;
    private Role role;

    public JwtResponse() {
    }

    public JwtResponse(String jwt, String userName, Role role) {
        this.jwt = jwt;
        this.userName = userName;
        this.role = role;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
