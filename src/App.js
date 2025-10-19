// src/App.js
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, UserPlus } from 'lucide-react';
import './App.css';

// API Base URL - Change this if your backend runs on different port
const API_URL = 'http://localhost:8080/api/employees';

function App() {
  // State Management
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    position: '',
    salary: '',
    hireDate: '',
    isActive: true
  });

  // Fetch all employees when component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // ============================================
  // CREATE & READ - Fetch all employees from API
  // ============================================
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched employees:', data);
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('⚠️ Failed to fetch employees. Make sure:\n1. Backend is running on http://localhost:8080\n2. Database is connected\n3. Check browser console for details');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Handle input changes in the form
  // ============================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEmployee(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ============================================
  // CREATE & UPDATE - Submit form (Add or Edit)
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editMode ? `${API_URL}/${currentEmployee.id}` : API_URL;
      const method = editMode ? 'PUT' : 'POST';
      
      console.log(`${method} request to:`, url);
      console.log('Data:', currentEmployee);
      
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(currentEmployee)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save employee');
      }

      const savedEmployee = await response.json();
      console.log('Saved employee:', savedEmployee);
      
      // Refresh employee list
      await fetchEmployees();
      
      // Close modal and reset form
      closeModal();
      
      // Show success message
      alert(editMode 
        ? '✅ Employee updated successfully!' 
        : '✅ Employee created successfully!');
        
    } catch (error) {
      console.error('Error saving employee:', error);
      alert(`❌ Error: ${error.message}\n\nPlease check:\n1. All required fields are filled\n2. Email is unique\n3. Backend is running\n4. Check console for details`);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UPDATE - Open edit modal with employee data
  // ============================================
  const handleEdit = (employee) => {
    console.log('Editing employee:', employee);
    setCurrentEmployee({
      ...employee,
      hireDate: employee.hireDate || '',
      salary: employee.salary || '',
      phoneNumber: employee.phoneNumber || ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  // ============================================
  // DELETE - Remove employee from database
  // ============================================
  const handleDelete = async (id, employeeName) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete ${employeeName}?\n\nThis action cannot be undone!`
    );
    
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      
      console.log(`Deleted employee with ID: ${id}`);
      
      // Refresh employee list
      await fetchEmployees();
      
      alert('✅ Employee deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('❌ Failed to delete employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CREATE - Open modal for adding new employee
  // ============================================
  const openAddModal = () => {
    setCurrentEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      position: '',
      salary: '',
      hireDate: '',
      isActive: true
    });
    setEditMode(false);
    setShowModal(true);
  };

  // ============================================
  // Close modal and reset form
  // ============================================
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      position: '',
      salary: '',
      hireDate: '',
      isActive: true
    });
  };

  // ============================================
  // RENDER UI
  // ============================================
  return (
    <div className="app-container">
      <div className="max-width-container">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="header-card">
          <div className="header-content">
            <div>
              <h1 className="main-title">
                <UserPlus size={32} />
                Employment Management System
              </h1>
              <p className="subtitle">
                Complete CRUD Operations - Create, Read, Update, Delete
              </p>
            </div>
            <button 
              onClick={openAddModal} 
              className="btn-primary"
              disabled={loading}
            >
              <Plus size={20} />
              Add New Employee
            </button>
          </div>

          {/* ===== SEARCH BAR ===== */}
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="🔍 Search by name, email, department, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ===== STATISTICS ===== */}
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-value">{employees.length}</span>
              <span className="stat-label">Total Employees</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {employees.filter(e => e.isActive).length}
              </span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {employees.filter(e => !e.isActive).length}
              </span>
              <span className="stat-label">Inactive</span>
            </div>
          </div>
        </div>

        {/* ===== EMPLOYEE TABLE ===== */}
        <div className="table-card">
          {loading && <div className="loading-overlay">Loading...</div>}
          
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Hire Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="id-cell">{employee.id}</td>
                      <td className="employee-name">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.phoneNumber || 'N/A'}</td>
                      <td>
                        <span className="department-badge">
                          {employee.department || 'N/A'}
                        </span>
                      </td>
                      <td>{employee.position || 'N/A'}</td>
                      <td className="salary-cell">
                        ${employee.salary?.toLocaleString() || '0'}
                      </td>
                      <td>{employee.hireDate || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${employee.isActive ? 'active' : 'inactive'}`}>
                          {employee.isActive ? '✓ Active' : '✗ Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="btn-edit"
                            title="Edit Employee"
                            disabled={loading}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(
                              employee.id, 
                              `${employee.firstName} ${employee.lastName}`
                            )}
                            className="btn-delete"
                            title="Delete Employee"
                            disabled={loading}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="no-data">
                      {searchTerm 
                        ? `No employees found matching "${searchTerm}"` 
                        : 'No employees found. Click "Add New Employee" to get started!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== MODAL FOR CREATE/UPDATE ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="modal-header">
              <h2>
                {editMode ? '✏️ Edit Employee' : '➕ Add New Employee'}
              </h2>
              <button onClick={closeModal} className="btn-close" type="button">
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-grid">
                
                {/* First Name */}
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={currentEmployee.firstName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={currentEmployee.lastName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentEmployee.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="employee@company.com"
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={currentEmployee.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* Department */}
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={currentEmployee.department}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>

                {/* Position */}
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={currentEmployee.position}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                {/* Salary */}
                <div className="form-group">
                  <label htmlFor="salary">Salary ($)</label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={currentEmployee.salary}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="50000"
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Hire Date */}
                <div className="form-group">
                  <label htmlFor="hireDate">Hire Date</label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={currentEmployee.hireDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Active Status Checkbox */}
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={currentEmployee.isActive}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <label htmlFor="isActive">
                  Active Employee (Uncheck to mark as inactive)
                </label>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading 
                    ? 'Saving...' 
                    : editMode ? 'Update Employee' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
