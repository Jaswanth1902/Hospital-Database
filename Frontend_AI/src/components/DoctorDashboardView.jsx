import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar, Plus, FileText, CheckCircle, Clock, User, Stethoscope } from 'lucide-react';

export default function DoctorDashboardView({ onSelectEHR }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Form states
  const [bookData, setBookData] = useState({
    doctor_id: '',
    patient_id: '',
    appointment_time: '',
  });

  const [recordData, setRecordData] = useState({
    diagnosis: '',
    notes: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [apptsData, docsData, ptsData] = await Promise.all([
        api.getTodayAppointments(),
        api.getDoctors(),
        api.getPatients(),
      ]);
      setAppointments(apptsData);
      setDoctors(docsData);
      setPatients(ptsData);
      if (docsData.length > 0) setBookData((prev) => ({ ...prev, doctor_id: docsData[0].doctor_id }));
      if (ptsData.length > 0) setBookData((prev) => ({ ...prev, patient_id: ptsData[0].patient_id }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment({
        ...bookData,
        appointment_time: new Date(bookData.appointment_time).toISOString(),
        status: 'Scheduled',
      });
      setShowBookModal(false);
      loadData();
    } catch (err) {
      alert(`Booking Error (Trigger check): ${err.message}`);
    }
  };

  const handleOpenExamModal = (appt) => {
    setSelectedAppt(appt);
    setRecordData({ diagnosis: '', notes: '' });
    setShowRecordModal(true);
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create medical record (DB trigger automatically generates Invoice!)
      await api.createMedicalRecord({
        appointment_id: selectedAppt.appointment_id,
        diagnosis: recordData.diagnosis,
        notes: recordData.notes,
      });

      // 2. Mark appointment status as 'Completed'
      await api.updateAppointmentStatus(selectedAppt.appointment_id, 'Completed');

      setShowRecordModal(false);
      loadData();
    } catch (err) {
      alert(`Error creating record: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-val">{appointments.length}</div>
            <div className="stat-lbl">Today's Scheduled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <div className="stat-val">{doctors.length}</div>
            <div className="stat-lbl">Active Doctors</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={22} color="var(--accent-cyan)" />
            <span>Doctor Morning Dashboard (Scheduled Appointments)</span>
          </div>
          <button className="btn btn-primary" onClick={() => setShowBookModal(true)}>
            <Plus size={18} />
            <span>Book Appointment</span>
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading Doctor Daily View...</p>
          ) : appointments.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No scheduled appointments for today.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Patient Name</th>
                  <th>Age & Gender</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.appointment_id}>
                    <td>#{a.appointment_id}</td>
                    <td style={{ fontWeight: '600' }}>{a.patient_name}</td>
                    <td>{a.patient_age} yrs ({a.gender})</td>
                    <td>{a.doctor_name}</td>
                    <td>
                      <span className="badge badge-scheduled">
                        {new Date(a.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleOpenExamModal(a)}>
                          <CheckCircle size={14} /> Exam & Write Record
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => onSelectEHR(a.patient_id)}>
                          <FileText size={14} /> EHR History
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

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Schedule New Appointment</h2>
              <button className="modal-close" onClick={() => setShowBookModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBookSubmit}>
              <div className="form-group">
                <label>Select Patient</label>
                <select
                  className="form-control"
                  value={bookData.patient_id}
                  onChange={(e) => setBookData({ ...bookData, patient_id: e.target.value })}
                >
                  {patients.map((p) => (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.patient_name} (ID: #{p.patient_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  className="form-control"
                  value={bookData.doctor_id}
                  onChange={(e) => setBookData({ ...bookData, doctor_id: e.target.value })}
                >
                  {doctors.map((d) => (
                    <option key={d.doctor_id} value={d.doctor_id}>
                      {d.doctor_name} - {d.specialization} ({d.shift})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Appointment Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  required
                  value={bookData.appointment_time}
                  onChange={(e) => setBookData({ ...bookData, appointment_time: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Exam & Create Medical Record Modal */}
      {showRecordModal && selectedAppt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Medical Exam Record for {selectedAppt.patient_name}</h2>
              <button className="modal-close" onClick={() => setShowRecordModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRecordSubmit}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Note: Submitting this record will mark appointment as Completed and automatically trigger PostgreSQL to generate an Invoice.
              </p>

              <div className="form-group">
                <label>Diagnosis</label>
                <input
                  className="form-control"
                  required
                  placeholder="e.g. Acute Rhinopharyngitis, Hypertension"
                  value={recordData.diagnosis}
                  onChange={(e) => setRecordData({ ...recordData, diagnosis: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Clinical Notes & Observations</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Patient observations, vitals, recommended lab tests..."
                  value={recordData.notes}
                  onChange={(e) => setRecordData({ ...recordData, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Complete Exam & Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
