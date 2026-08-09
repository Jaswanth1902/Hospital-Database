import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Receipt, DollarSign, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';

export default function BillingView() {
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const data = await api.getUnpaidInvoices();
      setUnpaidInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const handlePayInvoice = async (invoiceId) => {
    try {
      await api.payInvoice(invoiceId);
      loadBillingData();
      alert(`Invoice #${invoiceId} successfully marked as PAID!`);
    } catch (err) {
      alert(`Payment update error: ${err.message}`);
    }
  };

  const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">${totalUnpaid.toFixed(2)}</div>
            <div className="stat-lbl">Total Accounts Receivable (Unpaid)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="stat-val">{unpaidInvoices.length}</div>
            <div className="stat-lbl">Pending Unpaid Invoices</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Receipt size={22} color="var(--accent-amber)" />
            <span>Accounts Receivable Hit-List (Unpaid Invoices)</span>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading Accounts Receivable View...</p>
          ) : unpaidInvoices.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No outstanding unpaid invoices! All accounts settled.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Patient Name</th>
                  <th>Contact Details</th>
                  <th>Appt ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unpaidInvoices.map((inv) => (
                  <tr key={inv.invoice_id}>
                    <td>#{inv.invoice_id}</td>
                    <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{inv.patient_name}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}><Phone size={12} color="var(--accent-cyan)" /> {inv.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}><Mail size={12} /> {inv.email}</div>
                    </td>
                    <td>#{inv.appointment_id}</td>
                    <td style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--accent-amber)' }}>
                      ${parseFloat(inv.amount).toFixed(2)}
                    </td>
                    <td>
                      <span className="badge badge-unpaid">UNPAID</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handlePayInvoice(inv.invoice_id)}
                      >
                        <CheckCircle2 size={14} /> Mark as Paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
