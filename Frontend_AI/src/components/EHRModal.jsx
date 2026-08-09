import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileText, Calendar, User, Stethoscope, Activity, X } from 'lucide-react';

export default function EHRModal({ patientId, onClose }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    const fetchEHR = async () => {
      try {
        setLoading(true);
        const data = await api.getPatientRecords(patientId);
        setRecords(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEHR();
  }, [patientId]);

  const patientInfo = records.length > 0 ? records[0] : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="var(--primary)" />
            <h2>Patient EHR Medical Timeline</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading Electronic Health Records...</p>
        ) : records.length === 0 ? (
          <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No medical history records found for Patient #{patientId}.</p>
        ) : (
          <div>
            {/* Patient Header Summary */}
            {patientInfo && (
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.9)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                }}
              >
                <div><strong>Patient Name:</strong> {patientInfo.patient_name}</div>
                <div><strong>Age / Gender:</strong> {patientInfo.patient_age} yrs ({patientInfo.gender})</div>
                <div><strong>Contact:</strong> {patientInfo.phone}</div>
                <div><strong>Address:</strong> {patientInfo.address}</div>
              </div>
            )}

            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Medical Examination Records Timeline</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {records.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    borderLeft: '4px solid var(--primary)',
                    border: '1px solid var(--border-color)',
                    borderLeftWidth: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                      <Calendar size={12} /> {new Date(r.diagnosis_date || r.appointment_time).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      <Stethoscope size={12} /> {r.doctor_name}
                    </span>
                  </div>

                  <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Diagnosis: {r.diagnosis}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {r.notes || 'No detailed clinical notes attached.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close EHR
          </button>
        </div>
      </div>
    </div>
  );
}
