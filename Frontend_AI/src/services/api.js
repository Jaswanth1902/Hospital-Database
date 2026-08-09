const API_BASE = 'http://localhost:5000/api';

async function fetchJSON(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Patients
  getPatients: (name = '') => fetchJSON(`/patients${name ? `?name=${encodeURIComponent(name)}` : ''}`),
  getPatientById: (id) => fetchJSON(`/patients/${id}`),
  createPatient: (data) => fetchJSON('/patients', { method: 'POST', body: JSON.stringify(data) }),
  updatePatient: (id, data) => fetchJSON(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Appointments & EHR
  getTodayAppointments: () => fetchJSON('/appointments/today'),
  getDoctors: () => fetchJSON('/doctors'),
  getDepartments: () => fetchJSON('/departments'),
  createAppointment: (data) => fetchJSON('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointmentStatus: (id, status) => fetchJSON(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getPatientRecords: (patientId) => fetchJSON(`/patients/${patientId}/records`),
  createMedicalRecord: (data) => fetchJSON('/records', { method: 'POST', body: JSON.stringify(data) }),

  // Pharmacy
  getMedications: () => fetchJSON('/medications'),
  createPrescription: (data) => fetchJSON('/prescriptions', { method: 'POST', body: JSON.stringify(data) }),
  getPharmacyQueue: () => fetchJSON('/pharmacy/queue'),

  // Billing
  getUnpaidInvoices: () => fetchJSON('/billing/unpaid'),
  getPatientInvoices: (patientId) => fetchJSON(`/patients/${patientId}/invoices`),
  payInvoice: (invoiceId) => fetchJSON(`/billing/${invoiceId}/pay`, { method: 'PUT' }),
};
