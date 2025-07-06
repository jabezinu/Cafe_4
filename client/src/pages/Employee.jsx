import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/employees';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState({});
  const [newData, setNewData] = useState({
    name: '', phone: '', image: '', description: '', salary: '', date_hired: '', position: '', table_assigned: '', working_hour: '', status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const positionOptions = [
    { value: '', label: 'Select Position' },
    { value: 'waiter', label: 'Waiter' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'manager', label: 'Manager' },
    { value: 'barista', label: 'Barista' },
    { value: 'chaf', label: 'Chaf' },
  ];
  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'active', label: 'Active' },
    { value: 'fired', label: 'Fired' },
    { value: 'resigned', label: 'Resigned' },
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch {
      setError('Failed to fetch employees');
    }
    setLoading(false);
  };

  const handleEdit = (emp) => {
    setSelected(emp.id);
    setEditData(emp);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const areAllFieldsFilled = (data) => {
    return Object.values(data).every((val) => val !== undefined && val !== null && val.toString().trim() !== '');
  };

  const handleUpdate = async () => {
    if (!areAllFieldsFilled(editData)) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${selected}`, editData);
      setSelected(null);
      fetchEmployees();
    } catch {
      setError('Failed to update employee');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
    } catch {
      setError('Failed to delete employee');
    }
    setLoading(false);
  };

  const handleNewChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!areAllFieldsFilled(newData)) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_URL, newData);
      setNewData({ name: '', phone: '', image: '', description: '', salary: '', date_hired: '', position: '', table_assigned: '', working_hour: '', status: '' });
      fetchEmployees();
    } catch {
      setError('Failed to create employee');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Employees</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {/* Create Employee Form */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Add New Employee</h3>
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-1" name="name" placeholder="Name" value={newData.name} onChange={handleNewChange} required />
          <input className="border p-1" name="phone" placeholder="Phone" value={newData.phone} onChange={handleNewChange} required />
          <input className="border p-1" name="image" placeholder="Image URL" value={newData.image} onChange={handleNewChange} required />
          <input className="border p-1" name="description" placeholder="Description" value={newData.description} onChange={handleNewChange} required />
          <input className="border p-1" name="salary" placeholder="Salary" value={newData.salary} onChange={handleNewChange} required />
          <input className="border p-1" name="date_hired" placeholder="Date Hired" value={newData.date_hired} onChange={handleNewChange} required />
          <select className="border p-1" name="position" value={newData.position} onChange={handleNewChange} required>
            {positionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input className="border p-1" name="table_assigned" placeholder="Table Assigned (if waiter)" value={newData.table_assigned} onChange={handleNewChange} required />
          <input className="border p-1" name="working_hour" placeholder="Working Hour" value={newData.working_hour} onChange={handleNewChange} required />
          <select className="border p-1" name="status" value={newData.status} onChange={handleNewChange} required>
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded" onClick={handleCreate}>Create</button>
      </div>
      {/* Employee Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Image</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Salary</th>
            <th className="border px-2 py-1">Date Hired</th>
            <th className="border px-2 py-1">Position</th>
            <th className="border px-2 py-1">Table</th>
            <th className="border px-2 py-1">Working Hour</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b">
              {selected === emp.id ? (
                <>
                  <td className="border px-2 py-1"><input name="name" value={editData.name || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1"><input name="phone" value={editData.phone || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1"><input name="image" value={editData.image || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1"><input name="description" value={editData.description || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1"><input name="salary" value={editData.salary || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1"><input name="date_hired" value={editData.date_hired || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1">
                    <select name="position" value={editData.position || ''} onChange={handleChange} className="border p-1">
                      {positionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td className="border px-2 py-1"><input name="table_assigned" value={editData.table_assigned || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1"><input name="working_hour" value={editData.working_hour || ''} onChange={handleChange} /></td>
                  <td className="border px-2 py-1">
                    <select name="status" value={editData.status || ''} onChange={handleChange} className="border p-1">
                      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={handleUpdate}>Save</button>
                    <button className="bg-gray-400 text-white px-2 py-1" onClick={() => setSelected(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border px-2 py-1">{emp.name}</td>
                  <td className="border px-2 py-1">{emp.phone}</td>
                  <td className="border px-2 py-1">{emp.image ? <img src={emp.image} alt="img" className="w-12 h-12 object-cover" /> : '-'}</td>
                  <td className="border px-2 py-1">{emp.description}</td>
                  <td className="border px-2 py-1">{emp.salary}</td>
                  <td className="border px-2 py-1">{emp.date_hired}</td>
                  <td className="border px-2 py-1">{emp.position}</td>
                  <td className="border px-2 py-1">{emp.position === 'waiter' ? emp.table_assigned : '-'}</td>
                  <td className="border px-2 py-1">{emp.working_hour}</td>
                  <td className="border px-2 py-1">{emp.status}</td>
                  <td className="border px-2 py-1">
                    <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={() => handleEdit(emp)}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;
