CREATE INDEX idx_doctors_department_id
ON Doctors (department_id);

CREATE INDEX idx_Appointments_doctor_id
ON Appointments (doctor_id);

CREATE INDEX idx_Appointments_patient_id
ON Appointments (patient_id);

CREATE INDEX idx_Medical_Records_appointment_id
ON Medical_Records (appointment_id);

CREATE INDEX idx_Prescriptions_medication_id
ON Prescriptions (medication_id);

CREATE INDEX idx_Prescriptions_appointment_id
ON Prescriptions (appointment_id);

CREATE INDEX idx_Prescriptions_record_id
ON Prescriptions (record_id);

CREATE INDEX idx_Invoice_appointment_id
ON Invoice (appointment_id);

CREATE INDEX idx_Invoice_patient_id
ON Invoice (patient_id);
