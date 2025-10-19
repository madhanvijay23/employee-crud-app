package com.example.employment_system.repository;

import com.example.employment_system.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Custom query methods
    List<Employee> findByDepartment(String department);

    List<Employee> findByIsActive(Boolean isActive);

    boolean existsByEmail(String email);
}