package ffos.skroflin.service;

import ffos.skroflin.model.Employee;
import ffos.skroflin.model.Department;
import ffos.skroflin.model.Company;
import ffos.skroflin.model.dto.employee.EmployeeDTO;
import ffos.skroflin.model.dto.employee.EmployeeResponseDTO;
import ffos.skroflin.model.dto.employee.SalaryResponseDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService extends MainService {

    @Transactional
    private EmployeeResponseDTO convertToResponseDTO(Employee employee) {
        if (employee == null) {
            return null;
        }
        Integer departmentId = (employee.getDepartment() != null) ? employee.getDepartment().getId() : null;
        Integer companyId = (employee.getCompany() != null) ? employee.getCompany().getId() : null;
        return new EmployeeResponseDTO(
                employee.getId(),
                employee.getEmployeeName(),
                employee.getEmployeeSurname(),
                employee.getEmployeeSalary(),
                employee.getDateOfBirth(),
                employee.getBeginningOfWork(),
                employee.isEmployeed(),
                departmentId,
                companyId
        );
    }

    @Transactional
    private Employee convertToEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setEmployeeName(dto.employeeName());
        employee.setEmployeeSurname(dto.employeeSurname());
        employee.setEmployeeSalary(dto.employeeSalary());
        employee.setDateOfBirth(dto.dateOfBirth());
        employee.setBeginningOfWork(dto.beginningOfWork());
        employee.setEmployeed(dto.employeed());

        if (dto.departmentId() != null) {
            Department department = session.get(Department.class, dto.departmentId());
            if (department == null) {
                throw new IllegalArgumentException("Department with id " + dto.departmentId() + " doesn't exist!");
            }
            employee.setDepartment(department);
        }

        if (dto.companyId() != null) {
            Company company = session.get(Company.class, dto.companyId());
            if (company == null) {
                throw new IllegalArgumentException("Company with it " + dto.companyId() + " doesn't exist!");
            }
            employee.setCompany(company);
        }

        return employee;
    }

    @Transactional
    private void updateEntityFromDto(Employee employee, EmployeeDTO dto) {
        employee.setEmployeeName(dto.employeeName());
        employee.setEmployeeSurname(dto.employeeSurname());
        employee.setEmployeeSalary(dto.employeeSalary());
        employee.setDateOfBirth(dto.dateOfBirth());
        employee.setBeginningOfWork(dto.beginningOfWork());
        employee.setEmployeed(dto.employeed());

        if (dto.departmentId() != null) {
            Department department = session.get(Department.class, dto.departmentId());
            if (department == null) {
                throw new IllegalArgumentException("Department with id " + dto.departmentId() + " doesn't exist!");
            }
            employee.setDepartment(department);
        } else {
            employee.setDepartment(null);
        }

        if (dto.companyId() != null) {
            Company company = session.get(Company.class, dto.companyId());
            if (company == null) {
                throw new IllegalArgumentException("Company with it " + dto.companyId() + " doesn't exist!");
            }
            employee.setCompany(company);
        } else {
            employee.setCompany(null);
        }
    }

    public List<EmployeeResponseDTO> getAll() {
        try {
            List<Employee> djelatnici = session.createQuery(
                    "select e from Employee e left join fetch"
                    + " e.department left join fetch e.company",
                    Employee.class).list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching all employees: " + e.getMessage(), e);
        }
    }

    public EmployeeResponseDTO getById(int id) {
        try {
            Employee employee = session.createQuery(
                    "select e from Employee e left join fetch"
                    + " e.department left join fetch e.company"
                            + "where e.id = :id",
                    Employee.class)
                    .setParameter("id", id)
                    .uniqueResult();

            if (employee == null) {
                throw new NoResultException("Employee with id " + id + " doesn't exist!");
            }

            return convertToResponseDTO(employee);
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching employee: " + e.getMessage(), e);
        }
    }

    public EmployeeResponseDTO post(EmployeeDTO o) {
        try {
            Employee employee = convertToEntity(o);
            session.beginTransaction();
            session.persist(employee);
            session.getTransaction().commit();
            return convertToResponseDTO(employee);
        } catch (Exception e) {
            throw new RuntimeException("Error upon creating employee: " + e.getMessage(), e);
        }
    }

    public EmployeeResponseDTO put(EmployeeDTO o, int id) {
        try {
            Employee e = session.get(Employee.class, id);
            if (e == null) {
                throw new NoResultException("Employee with id " + id + " doesn't exist!");
            }
            updateEntityFromDto(e, o);
            session.merge(e);
            session.flush();
            return convertToResponseDTO(e);
        } catch (Exception e) {
            throw new RuntimeException("Error upon updating employee: " + e.getMessage(), e);
        }
    }

    public void softDelete(int id) {
        Employee e = session.get(Employee.class, id);
        if (e == null) {
            throw new NoResultException("Employee with id " + id + " doesn't exist!");
        }
        e.setEmployeed(false);
        session.beginTransaction();
        session.persist(e);
        session.getTransaction().commit();
    }

    public void delete(int id) {
        Employee e = session.get(Employee.class, id);
        if (e == null) {
            throw new NoResultException("Employee with id" + " " + id + " " + "doesn't exist!");
        }
        session.beginTransaction();
        session.remove(e);
        session.getTransaction().commit();
    }

    @Transactional
    public List<EmployeeResponseDTO> getAllEmployeed(boolean employeed) {
        try {
            List<Employee> djelatnici = session.createQuery(
                    "select d from Employee e left join fetch e.department"
                            + " left join fetch e.company "
                            + "where e.employeed = :employeed",
                    Employee.class)
                    .setParameter("employeed", employeed)
                    .list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching all employees: " + e.getMessage(), e);
        }
    }

    @Transactional
    public List<EmployeeResponseDTO> getByName(String name) {
        try {
            List<Employee> djelatnici = session.createQuery(
                    "select d from Employee e left join fetch e.department"
                            + " left join fetch e.company "
                    + "where lower(e.employeeName) like lower(:name) "
                    + "or lower(e.employeeSurname) like lower(:name)",
                    Employee.class)
                    .setParameter("name", "%" + name + "%")
                    .list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching all employees: " + e.getMessage(), e);
        }
    }

    public List<EmployeeResponseDTO> getByBeginningOfWork(Date timestamp) {
        try {
            List<Employee> djelatnici = session.createQuery(
                    "select d from Employee e left join fetch e.department"
                            + " left join fetch e.company "
                    + "where lower (e.beginningOfWork) like lower(:timestamp)",
                    Employee.class)
                    .setParameter("timestamp", "%" + timestamp + "%")
                    .list();
            return djelatnici.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching all employees: " + e.getMessage(), e);
        }
    }

    @Transactional
    public SalaryResponseDTO calculatePay(int id, BigDecimal grossBasis) {
        if (grossBasis == null || grossBasis.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Gross basis must be larger than 0!");
        }

        Employee e = session.get(Employee.class, id);
        if (e == null) {
            throw new IllegalArgumentException("Employee with id " + id + " doesn't exist!");
        }

        final int scale = 2;
        BigDecimal ratePension1Pillar = new BigDecimal("0.15");
        BigDecimal ratePension2Pillar = new BigDecimal("0.05");
        BigDecimal totalPensionRate = new BigDecimal("0.20");

        BigDecimal pension1Pillar = grossBasis.multiply(ratePension1Pillar).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal pension2Pillar = grossBasis.multiply(ratePension2Pillar).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal totalContributionsFromSalary = grossBasis.multiply(totalPensionRate).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal taxBase = grossBasis.subtract(totalContributionsFromSalary).setScale(scale, RoundingMode.HALF_UP);

        BigDecimal rowTaxRate = new BigDecimal("0.20");
        BigDecimal incomeTax = rowTaxRate.multiply(rowTaxRate).setScale(scale, RoundingMode.HALF_UP);

        BigDecimal rate = new BigDecimal("0.15");
        BigDecimal surtax = incomeTax.multiply(rate).setScale(scale, RoundingMode.HALF_UP);
        BigDecimal totalTaxSurtax = incomeTax.add(surtax).setScale(scale, RoundingMode.HALF_UP);

        BigDecimal netSalary = rate.subtract(totalTaxSurtax).setScale(scale, RoundingMode.HALF_UP);

        BigDecimal rateHealth = new BigDecimal("0.165");
        BigDecimal healthInsurance = grossBasis.multiply(rateHealth).setScale(scale, RoundingMode.HALF_UP);

        return new SalaryResponseDTO(
                id,
                grossBasis,
                pension1Pillar,
                pension2Pillar,
                healthInsurance,
                taxBase,
                totalTaxSurtax,
                netSalary
        );
    }
}
