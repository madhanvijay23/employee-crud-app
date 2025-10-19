package com.example.employment_system.service;

import com.example.employment_system.model.Employee;
import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long id, Employee employeeDetails);
    void deleteEmployee(Long id);
    List<Employee> getEmployeesByDepartment(String department);
    List<Employee> getActiveEmployees();
}
