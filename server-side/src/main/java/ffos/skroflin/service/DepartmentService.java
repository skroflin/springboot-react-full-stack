package ffos.skroflin.service;

import ffos.skroflin.model.Department;
import ffos.skroflin.model.Company;
import ffos.skroflin.model.dto.department.DepartmentDTO;
import ffos.skroflin.model.dto.department.DepartmentResponseDTO;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService extends MainService {

    @Transactional
    private DepartmentResponseDTO convertToResponseDTO(Department department) {
        if (department == null) {
            return null;
        }
        Integer companyId = (department.getId() != null) ? department.getCompany().getId() : null;
        return new DepartmentResponseDTO(
                department.getId(),
                department.getDepartmentName(),
                department.getDepartmentLocation(),
                department.isActive(),
                companyId
        );
    }

    @Transactional
    private Department convertToEntity(DepartmentDTO dto) {
        Department department = new Department();
        department.setDepartmentName(dto.departmentName());
        department.setDepartmentLocation(dto.departmentLocation());
        department.setActive(dto.active());

        if (dto.companyId() != null) {
            Company company = session.get(Company.class, dto.companyId());
            if (company == null) {
                throw new IllegalArgumentException("Company with id " + dto.companyId() + " doesn't exist!");
            }
            department.setCompany(company);
        }

        return department;
    }

    @Transactional
    private void updateEntityFromDto(Department department, DepartmentDTO dto) {
        department.setDepartmentName(dto.departmentName());
        department.setDepartmentLocation(dto.departmentLocation());
        department.setActive(dto.active());

        if (dto.companyId() != null) {
            Company company = session.get(Company.class, dto.companyId());
            if (company == null) {
                throw new IllegalArgumentException("Company with id " + dto.companyId() + " doesn't exist!");
            }
            department.setCompany(company);
        } else {
            department.setCompany(null);
        }
    }

    public List<DepartmentResponseDTO> getAll() {
        try {
            List<Department> departments = session.createQuery("select d from Department d left join fetch d.company", Department.class).list();
            return departments.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching departments: " + e.getMessage(), e);
        }
    }

    public DepartmentResponseDTO getById(int id) {
        try {
            Department department = session.createQuery("select d from Department d left join fetch d.company where d.id = :id", Department.class)
                    .setParameter("id", id)
                    .uniqueResult();

            if (department == null) {
                throw new NoResultException("Department with id" + " " + id + " " + "doesn't exist");
            }

            return convertToResponseDTO(department);
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching departments: " + e.getMessage(), e);
        }
    }

    public DepartmentResponseDTO post(DepartmentDTO o) {
        try {
            Long count = session.createQuery(
                    "select count(*) from Department d where d.departmentName = :name", Long.class)
                    .setParameter("name", o.departmentName())
                    .uniqueResult();

            if (count > 0) {
                throw new IllegalArgumentException("Department with name " + o.departmentName() + " already exists!");
            }

            Department department = convertToEntity(o);
            session.beginTransaction();
            session.persist(department);
            session.getTransaction().commit();
            return convertToResponseDTO(department);
        } catch (Exception e) {
            throw new RuntimeException("Error upon fetching departments: " + e.getMessage(), e);
        }
    }

    public DepartmentResponseDTO put(DepartmentDTO o, int id) {
        try {
            Department d = session.get(Department.class, id);
            if (d == null) {
                throw new NoResultException("Department with " + id + " doesn't exist!");
            }

            if (!d.getDepartmentName().equals(o.departmentName())) {
                Long count = session.createQuery(
                        "select count(*) from Department d where d.departmentName = :name", Long.class)
                        .setParameter("name", o.departmentName())
                        .uniqueResult();

                if (count > 0) {
                throw new IllegalArgumentException("Department with name " + o.departmentName() + " already exists!");
            }
            }

            updateEntityFromDto(d, o);
            session.merge(d);
            session.flush();
            return convertToResponseDTO(d);
        } catch (Exception e) {
            throw new RuntimeException("Error upon updating departments: " + e.getMessage(), e);
        }
    }

    public void softDelete(int id) {
        try {
            Department d = session.get(Department.class, id);
            if (d == null) {
                throw new NoResultException("Department with " + id + " doesn't exist!");
            }
            d.setActive(true);
            session.merge(d);
        } catch (Exception e) {
            throw new RuntimeException("Error upon softly deleting departments: " + e.getMessage(), e);
        }
    }

    public List<DepartmentResponseDTO> getByName(String name) {
        try {
            List<Department> odjeli = session.createQuery(
                    "select d from Department d left join fetch d.company "
                    + "where lower(d.departmentName) like lower(:name)",
                    Department.class)
                    .setParameter("name", "%" + name + "%")
                    .list();
            return odjeli.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon searching for departments: " + e.getMessage(), e);
        }
    }
    
    public List<DepartmentResponseDTO> getByLocation(String location){
        try {
            List<Department> odjeli = session.createQuery(
                    "select d from Department d left join fetch d.company "
                    + "where lower(d.departmentLocation) like lower(:location)",
                    Department.class)
                    .setParameter("location", "%" + location + "%")
                    .list();
            return odjeli.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error upon searching for departments: " + e.getMessage(), e);
        }
    }
}
