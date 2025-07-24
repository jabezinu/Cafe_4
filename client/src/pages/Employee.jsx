import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL + '/employees';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState({});
  const [newData, setNewData] = useState({
    name: '', phone: '', image: '', description: '', salary: '', date_hired: '', position: '', table_assigned: '', working_hour: '', status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFired, setShowFired] = useState(false);

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
    setShowEditModal(true);
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
    // Check for duplicate phone number (excluding the current employee)
    const duplicate = employees.some(emp => emp.phone === editData.phone && emp.id !== selected);
    if (duplicate) {
      toast.error("Another employee with this phone number already exists", { position: "top-center" });
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${selected}`, editData);
      setSelected(null);
      setShowEditModal(false);
      fetchEmployees();
      toast.success("Employee updated successfully", { position: "top-center" });
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
    // Check for duplicate phone number
    const duplicate = employees.some(emp => emp.phone === newData.phone);
    if (duplicate) {
      toast.error("An employee with this phone number already exists", { position: "top-center" });
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_URL, newData);
      setNewData({ name: '', phone: '', image: '', description: '', salary: '', date_hired: '', position: '', table_assigned: '', working_hour: '', status: '' });
      setShowAddModal(false);
      fetchEmployees();
      toast.success("Employee created successfully", { position: "top-center" });
    } catch {
      setError('Failed to create employee');
    }
    setLoading(false);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelected(null);
    setError('');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Employee Management</h2>
      {loading && <div className="mb-4 text-blue-500">Loading...</div>}
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      <button
        className="mb-8 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
        onClick={() => { setShowAddModal(true); setError(''); }}
      >
        Add Employee
      </button>
      {/* Employee Cards */}
      {(() => {
        const activeEmployees = employees.filter(emp => emp.status =='active');
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeEmployees.map((emp) => (
              <div key={emp.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                <div className="w-20 h-20 mb-4">
                  {emp.image ? (
                    <img src={emp.image} alt="img" className="w-20 h-20 object-cover rounded-full" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">{emp.name}</h3>
                  <div className="text-gray-600 text-sm mb-1">{emp.position} {emp.position === 'waiter' && emp.table_assigned ? `- Table: ${emp.table_assigned}` : ''}</div>
                  <div className="text-gray-500 text-xs mb-2">Hired: {emp.date_hired}</div>
                  <div className="mb-2 text-gray-700">{emp.description}</div>
                  <div className="mb-1"><span className="font-medium">Phone:</span> {emp.phone}</div>
                  <div className="mb-1"><span className="font-medium">Salary:</span> {emp.salary}</div>
                  <div className="mb-1"><span className="font-medium">Working Hour:</span> {emp.working_hour}</div>
                  <div className="mb-1"><span className="font-medium">Status:</span> {emp.status}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn-blue" onClick={() => handleEdit(emp)}>Edit</button>
                  <button className="btn-red" onClick={() => handleDelete(emp.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      {/* Toggle Fired Employees */}
      <div className="flex flex-col items-center mt-8">
        <button
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all mb-4"
          onClick={() => setShowFired(!showFired)}
        >
          {showFired ? 'Hide Fired Employees' : 'Show Fired Employees'}
        </button>
        {showFired && (() => {
          const firedEmployees = employees.filter(emp => emp.status !== 'active');
          if (firedEmployees.length === 0) {
            return <div className="text-gray-500">No fired employees.</div>;
          }
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {firedEmployees.map((emp) => (
                <div key={emp.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center opacity-70">
                  <div className="w-20 h-20 mb-4">
                    {emp.image ? (
                      <img src={emp.image} alt="img" className="w-20 h-20 object-cover rounded-full" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="w-full">
                    <h3 className="text-lg font-semibold mb-1 text-gray-800">{emp.name}</h3>
                    <div className="text-gray-600 text-sm mb-1">{emp.position} {emp.position === 'waiter' && emp.table_assigned ? `- Table: ${emp.table_assigned}` : ''}</div>
                    <div className="text-gray-500 text-xs mb-2">Hired: {emp.date_hired}</div>
                    <div className="mb-2 text-gray-700">{emp.description}</div>
                    <div className="mb-1"><span className="font-medium">Phone:</span> {emp.phone}</div>
                    <div className="mb-1"><span className="font-medium">Salary:</span> {emp.salary}</div>
                    <div className="mb-1"><span className="font-medium">Working Hour:</span> {emp.working_hour}</div>
                    <div className="mb-1"><span className="font-medium">Status:</span> {emp.status}</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="btn-blue" onClick={() => handleEdit(emp)}>Edit</button>
                    <button className="btn-red" onClick={() => handleDelete(emp.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" name="name" placeholder="Name" value={newData.name} onChange={handleNewChange} />
              <input className="input" name="phone" placeholder="Phone" value={newData.phone} onChange={handleNewChange} />
              <input className="input" name="image" placeholder="Image URL" value={newData.image} onChange={handleNewChange} />
              <input className="input" name="description" placeholder="Description" value={newData.description} onChange={handleNewChange} />
              <input className="input" name="salary" placeholder="Salary" value={newData.salary} onChange={handleNewChange} />
              <input className="input" type="date" name="date_hired" placeholder="Date Hired" value={newData.date_hired} onChange={handleNewChange} />
              <select className="input" name="position" value={newData.position} onChange={handleNewChange}>
                {positionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <input className="input" name="table_assigned" placeholder="Table Assigned (if waiter)" value={newData.table_assigned} onChange={handleNewChange} />
              <input className="input" name="working_hour" placeholder="Working Hour" value={newData.working_hour} onChange={handleNewChange} />
              <select className="input" name="status" value={newData.status} onChange={handleNewChange}>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <button className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all" onClick={handleCreate}>
              Create Employee
            </button>
          </div>
        </div>
      )}
      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={closeModals}>&times;</button>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Edit Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" name="name" placeholder="Name" value={editData.name || ''} onChange={handleChange} />
              <input className="input" name="phone" placeholder="Phone" value={editData.phone || ''} onChange={handleChange} />
              <input className="input" name="image" placeholder="Image URL" value={editData.image || ''} onChange={handleChange} />
              <input className="input" name="description" placeholder="Description" value={editData.description || ''} onChange={handleChange} />
              <input className="input" name="salary" placeholder="Salary" value={editData.salary || ''} onChange={handleChange} />
              <input className="input" type="date" name="date_hired" placeholder="Date Hired" value={editData.date_hired || ''} onChange={handleChange} />
              <select className="input" name="position" value={editData.position || ''} onChange={handleChange}>
                {positionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <input className="input" name="table_assigned" placeholder="Table Assigned (if waiter)" value={editData.table_assigned || ''} onChange={handleChange} />
              <input className="input" name="working_hour" placeholder="Working Hour" value={editData.working_hour || ''} onChange={handleChange} />
              <select className="input" name="status" value={editData.status || ''} onChange={handleChange}>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-green" onClick={handleUpdate}>Save</button>
              <button className="btn-gray" onClick={closeModals}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Employee;
