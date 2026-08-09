import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserPlus, Edit, Eye, User, Phone, Mail, MapPin, Calendar as CalendarIcon } from 'lucide-react';

export default function PatientsView({ searchTerm, onSelectEHR }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [formData, setFormData] = useState({
    patient_name: '',
    dob: '',
    email: '',
    phone: '',
    gender: 'Male',
    address: '',
  });

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await api.getPatients(searchTerm);
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [searchTerm]);

  const handleOpenRegister = () => {
    setEditingPatient(null);
    setFormData({
      patient_name: '',
      dob: '',
      email: '',
      phone: '',
      gender: 'Male',
      address: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      patient_name: patient.patient_name,
      dob: patient.dob ? patient.dob.split('T')[0] : '',
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      address: patient.address,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.updatePatient(editingPatient.patient_id, formData);
      } else {
        await api.createPatient(formData);
      }
      setShowModal(false);
      loadPatients();
    } catch (err) {
      alert(`Error saving patient: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <User size={22} color="#6366f1" />
            <span>Registered Patients</span>
          </div>
          <button className="btn btn-primary" onClick={handleOpenRegister}>
            <UserPlus size={18} />
            <span>Register Patient</span>
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading patients database...</p>
          ) : patients.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No patients found.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Gender / DOB</th>
                  <th>Phone & Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.patient_id}>
                    <td>#{p.patient_id}</td>
                    <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{p.patient_name}</td>
                    <td>
                      <div>{p.gender}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {p.dob ? new Date(p.dob).toLocaleDateString() : ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                        <Phone size={12} color="var(--accent-cyan)" /> {p.phone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <Mail size={12} /> {p.email}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <MapPin size={12} color="var(--accent-amber)" /> {p.address}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(p)}>
                          <Edit size={14} /> Edit
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => onSelectEHR(p.patient_id)}>
                          <Eye size={14} /> EHR History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingPatient ? 'Edit Patient Profile' : 'Register New Patient'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-control"
                  required
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-control"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number (10 digits)</label>
                <input
                  className="form-control"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  className="form-control"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPatient ? 'Save Changes' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
