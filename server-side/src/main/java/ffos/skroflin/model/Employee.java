/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * @author svenk
 */
@Entity
@Table(name = "employee")
@AttributeOverride(name = "id", column = @Column(name = "employee_id"))
public class Employee extends MainEntity {

    @Column(name = "employee_name", nullable = false)
    private String employeeName;
    @Column(name = "employee_surname", nullable = false)
    private String employeeSurname;
    @Column(name = "employee_salary", nullable = false, columnDefinition = "float")
    private BigDecimal employeeSalary;
    @Column(name = "date_of_birth")
    private Date dateOfBirth;
    @Column(name = "beginning_of_work", nullable = false)
    private Date beginningOfWork;
    @Column(columnDefinition = "bit", name = "employeed")
    private boolean employeed;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Department department;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Company company;

    public Employee() {
    }

    public Employee(String employeeName, String employeeSurname, BigDecimal employeeSalary, Date dateOfBirth, Date beginningOfWork, boolean employeed, Department department, Company company) {
        this.employeeName = employeeName;
        this.employeeSurname = employeeSurname;
        this.employeeSalary = employeeSalary;
        this.dateOfBirth = dateOfBirth;
        this.beginningOfWork = beginningOfWork;
        this.employeed = employeed;
        this.department = department;
        this.company = company;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeSurname() {
        return employeeSurname;
    }

    public void setEmployeeSurname(String employeeSurname) {
        this.employeeSurname = employeeSurname;
    }

    public BigDecimal getEmployeeSalary() {
        return employeeSalary;
    }

    public void setEmployeeSalary(BigDecimal employeeSalary) {
        this.employeeSalary = employeeSalary;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Date getBeginningOfWork() {
        return beginningOfWork;
    }

    public void setBeginningOfWork(Date beginningOfWork) {
        this.beginningOfWork = beginningOfWork;
    }

    public boolean isEmployeed() {
        return employeed;
    }

    public void setEmployeed(boolean employeed) {
        this.employeed = employeed;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    
}
