import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Pill, Plus, Package, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PharmacyView() {
  const [queue, setQueue] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    appointment_id: '',
    medication_id: '',
    record_id: '',
    quantity: 1,
    refills: 0,
    instructions: '',
  });

  const loadPharmacyData = async () => {
    try {
      setLoading(true);
      const [queueData, medsData] = await Promise.all([
        api.getPharmacyQueue(),
        api.getMedications(),
      ]);
      setQueue(queueData);
      setMedications(medsData);
      if (medsData.length > 0) {
        setPrescriptionData((prev) => ({ ...prev, medication_id: medsData[0].medication_id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacyData();
  }, []);

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create prescription (DB trigger automatically deducts stock!)
      await api.createPrescription(prescriptionData);
      setShowPrescriptionModal(false);
      loadPharmacyData();
      alert('Prescription created & inventory deducted successfully!');
    } catch (err) {
      alert(`Prescription Error (Inventory Trigger Check): ${err.message}`);
    }
  };

  return (
    <div>
      {/* Pharmacy Fulfillment Queue View */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Pill size={22} color="var(--accent-emerald)" />
            <span>Pharmacy Fulfillment Queue (Today's Orders)</span>
          </div>
          <button className="btn btn-primary" onClick={() => setShowPrescriptionModal(true)}>
            <Plus size={18} />
            <span>Create Prescription</span>
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading pharmacy queue...</p>
          ) : queue.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No pending pharmacy orders for today.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Medication</th>
                  <th>Quantity</th>
                  <th>Refills</th>
                  <th>Instructions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{item.patient_name}</td>
                    <td>
                      <div style={{ fontWeight: '500', color: 'var(--accent-cyan)' }}>{item.medication_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>${item.price} per unit</div>
                    </td>
                    <td>{item.quantity} units</td>
                    <td>{item.refills} refills</td>
                    <td style={{ fontSize: '0.85rem' }}>{item.instructions}</td>
                    <td>
                      <span className="badge badge-completed">Ready for Dispense</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Medication Inventory List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Package size={22} color="var(--accent-amber)" />
            <span>Hospital Drug Inventory & Stock</span>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Medication Name</th>
                <th>Description</th>
                <th>Stock Quantity</th>
                <th>Price per Unit</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m) => (
                <tr key={m.medication_id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{m.medication_name}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.description}</td>
                  <td>
                    <span
                      style={{
                        color: m.stock_quantity < 20 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        fontWeight: '600',
                      }}
                    >
                      {m.stock_quantity} units {m.stock_quantity < 20 && '(Low Stock)'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>${m.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Prescription Modal */}
      {showPrescriptionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Issue Prescription</h2>
              <button className="modal-close" onClick={() => setShowPrescriptionModal(false)}>✕</button>
            </div>
            <form onSubmit={handlePrescriptionSubmit}>
              <div className="form-group">
                <label>Appointment ID</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  placeholder="e.g. 5"
                  value={prescriptionData.appointment_id}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, appointment_id: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Record ID</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  placeholder="e.g. 1"
                  value={prescriptionData.record_id}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, record_id: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Select Medication</label>
                <select
                  className="form-control"
                  value={prescriptionData.medication_id}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, medication_id: e.target.value })}
                >
                  {medications.map((m) => (
                    <option key={m.medication_id} value={m.medication_id}>
                      {m.medication_name} (Stock: {m.stock_quantity}) - ${m.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  required
                  value={prescriptionData.quantity}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Refills Authorized</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  value={prescriptionData.refills}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, refills: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Dosage & Instructions</label>
                <input
                  className="form-control"
                  required
                  placeholder="e.g. Take 1 capsule twice daily after meals"
                  value={prescriptionData.instructions}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPrescriptionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
