/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.service;

import com.github.javafaker.Faker;
import ffos.skroflin.model.Company;
import ffos.skroflin.model.dto.company.CompanyDTO;
import ffos.skroflin.model.dto.company.CompanyResponseDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 *
 * @author svenk
 */
@Service
public class CompanyService extends MainService {

    private final Faker f;

    public CompanyService(Faker f) {
        this.f = f;
    }
    
    private CompanyResponseDTO convertToResponseDTO(Company company) {

        return new CompanyResponseDTO(
                company.getId(),
                company.getCompanyName(),
                company.getCompanyLocation(),
                company.isBankruptcy()
        );
    }

    @Transactional
    private Company convertToEntity(CompanyDTO dto) {
        Company company = new Company();
        company.setCompanyName(dto.companyName());
        company.setCompanyLocation(dto.companyLocation());
        company.setBankruptcy(dto.bankruptcy());
        return company;
    }

    @Transactional
    private void updateEntityFromDto(Company company, CompanyDTO dto) {
        company.setCompanyName(dto.companyName());
        company.setCompanyLocation(dto.companyLocation());
        company.setBankruptcy(dto.bankruptcy());
    }

    public List<CompanyResponseDTO> getAll() {
        List<Company> companies = session.createQuery("from Company", Company.class).list();
        return companies.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public CompanyResponseDTO getById(int sifra) {
        Company company = session.get(Company.class, sifra);
        return convertToResponseDTO(company);
    }

    public CompanyResponseDTO post(CompanyDTO o) {
        try {
            Long count = session.createQuery(
                    "select count(*) from Company c where c.companyName = :name", Long.class)
                    .setParameter("name", o.companyName())
                    .getSingleResult();
            if (count > 0) {
                session.getTransaction().rollback();
                throw new IllegalArgumentException("Company with the name" + " " + o.companyName() + " " + "already exists!");
            }
            Company company = convertToEntity(o);
            session.beginTransaction();
            session.persist(company);
            session.getTransaction().commit();
            return convertToResponseDTO(company);
        } catch (Exception e) {
            throw new RuntimeException("Error upon creating a new company" + " " + e.getMessage(), e);
        }
    }

    public CompanyResponseDTO put(CompanyDTO o, int id) {
        Company c = (Company) session.get(Company.class, id);
        if (c == null) {
            throw new NoResultException("Company with id" + " " + id + " " + "doesn't exist!");
        }
        if (!c.getCompanyName().equals(o.companyName())) {
            Long count = session.createQuery(
                    "select count(*) from Company c where c.companyName = :name", Long.class)
                    .setParameter("name", o.companyName())
                    .getSingleResult();
            if (count > 0) {
                throw new IllegalArgumentException("Company with the name" + " " + o.companyName() + " " + "already exists!");
            }
        }
        updateEntityFromDto(c, o);
        session.beginTransaction();
        session.persist(c);
        session.getTransaction().commit();
        return convertToResponseDTO(c);
    }

    public void delete(int id) {
        Company company = session.get(Company.class, id);
        if (company == null) {
            throw new NoResultException("Company with id" + " " + id + " " + "doesn't exist!");
        }
        session.remove(company);
    }

    public void softDelete(int id) {
        Company company = session.get(Company.class, id);
        if (company == null) {
            throw new NoResultException("Company with id" + " " + id + " " + "doesn't exist!");
        }
        company.setBankruptcy(true);
        session.beginTransaction();
        session.persist(company);
        session.getTransaction().commit();
    }

    public List<CompanyResponseDTO> getActiveCompanies(boolean active) {
        List<Company> tvrtke = session.createQuery("from Company c where c.bankruptcy = :active", Company.class)
                .setParameter("active", active)
                .getResultList();
        return tvrtke.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<CompanyResponseDTO> getByName(String name) {
        try {
            List<Company> tvrtke = session.createQuery(
                    "select c from Company c "
                    + "where lower (c.companyName) like lower(:name)",
                    Company.class)
                    .setParameter("name", "%" + name + "%")
                    .list();
            return tvrtke.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon searching for companies: " + e.getMessage(), e);
        }
    }

    public List<CompanyResponseDTO> getByLocation(String location) {
        try {
            List<Company> tvrtke = session.createQuery(
                    "select c from Company c "
                    + "where lower (c.companyLocation) like lower(:location)",
                    Company.class)
                    .setParameter("location", "%" + location + "%")
                    .list();
            return tvrtke.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon searching for companies: " + e.getMessage(), e);
        }
    }
    
    public Long getNumOfCompanies() {
        Long company = session.createQuery(
                "select count(c.id) from Company c", Long.class)
                .getSingleResult();
        return company;
    }
    
    public Long getNumOfBankruptCompanies() {
        Long company = session.createQuery(
                "select count(c.id) from Company c "
                        + "where c.bankruptcy = 1", Long.class)
                .getSingleResult();
        return company;
    }
    
    public Long getNumOfNonBankruptCompanies() {
        Long company = session.createQuery(
                "select count(c.id) from Company c "
                        + "where c.bankruptcy = 0", Long.class)
                .getSingleResult();
        return company;
    }

    public List<CompanyResponseDTO> massiveInsert(CompanyDTO o, int number) {
        List<CompanyResponseDTO> insertedCompanies = new ArrayList<>();
        try {
            for (int i = 0; i < number; i++) {
                Company newCompany = new Company();
                String newCompanyName = f.company().name();
                String newCompanyLocation = f.address().cityName();
                boolean newCompanyBankruptcyStatus = f.bool().bool();
                
                Long nameCount = session.createQuery(
                        "select count(*) from Company c where c.companyName = :name", Long.class)
                        .setParameter("name", o.companyName())
                        .getSingleResult();

                if (nameCount > 0) {
                    newCompanyName = f.company().name() + " " + "-" + System.currentTimeMillis();
                }

                newCompany.setCompanyName(newCompanyName);
                newCompany.setCompanyLocation(newCompanyLocation);
                newCompany.setBankruptcy(newCompanyBankruptcyStatus);
                
                session.beginTransaction();
                session.persist(newCompany);
                session.flush();
                session.refresh(newCompany);
                session.getTransaction().commit();
                insertedCompanies.add(convertToResponseDTO(newCompany));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error upon multiple company insertion" + " " + e.getMessage(), e);
        }
        return insertedCompanies;
    }
}
