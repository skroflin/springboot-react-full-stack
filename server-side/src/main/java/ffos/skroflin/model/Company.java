/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 *
 * @author svenk
 */
@Entity
@Table(name = "company")
@AttributeOverride(name = "id", column = @Column(name = "company_id"))
public class Company extends MainEntity{
    @Column(name = "company_name", nullable = false)
    private String companyName;
    @Column(name = "company_location")
    private String companyLocation;
    @Column(columnDefinition = "bit")
    private boolean bankruptcy;

    public Company() {
    }

    public Company(String companyName, String companyLocation, boolean bankruptcy) {
        this.companyName = companyName;
        this.companyLocation = companyLocation;
        this.bankruptcy = bankruptcy;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public boolean isBankruptcy() {
        return bankruptcy;
    }

    public void setBankruptcy(boolean bankruptcy) {
        this.bankruptcy = bankruptcy;
    }

    
    
}
