CREATE OR REPLACE VIEW Doctor_daily_view AS
SELECT 
    a.Appointment_id,
    d.doctor_id,
    p.patient_id,
    d.doctor_name,
    p.patient_name,
    p.gender,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.dob))::INT AS patient_age,
    a.appointment_time

FROM Appointments a
JOIN Doctors d ON a.doctor_id = d.doctor_id
JOIN Patients p ON a.patient_id = p.patient_id

WHERE a.status = 'Scheduled'
AND DATE(a.appointment_time) = CURRENT_DATE;

CREATE OR REPLACE VIEW Patient_EHR_view AS
SELECT 
    p.patient_id,
    p.patient_name,
    p.dob,
    p.email,
    p.phone,
    p.gender,
    p.address,
    d.doctor_name,
    d.doctor_id,
    m.diagnosis,
    m.notes,
    m.updated_at AS diagnosis_date,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.dob))::INT AS patient_age,
    a.appointment_time

FROM Appointments a
JOIN Medical_Records m ON a.appointment_id = m.appointment_id
JOIN Doctors d ON a.doctor_id = d.doctor_id
JOIN Patients p ON a.patient_id = p.patient_id;

CREATE OR REPLACE VIEW Pharmacy_fulfillment AS
SELECT 
    p.patient_id,
    p.patient_name,
    p.dob,
    p.email,
    p.phone,
    p.gender,
    p.address,
    m.diagnosis,
    pr.medication_id,
    pr.quantity,
    pr.refills,
    pr.instructions,
    med.medication_name,
    med.description,
    med.price,
    m.notes,
    m.updated_at AS diagnosis_date,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.dob))::INT AS patient_age,
    a.appointment_time,
    a.appointment_id
FROM Prescriptions pr
JOIN Appointments a ON pr.appointment_id = a.appointment_id
JOIN Medications med ON pr.medication_id = med.medication_id
JOIN Medical_Records m ON pr.record_id = m.record_id
JOIN Patients p ON a.patient_id = p.patient_id

WHERE a.status = 'Completed'
AND m.updated_at::DATE = CURRENT_DATE;

CREATE OR REPLACE VIEW Accounts_Receivable_view AS
SELECT 
    i.invoice_id,
    i.amount,
    i.is_paid,
    i.updated_at,
    i.created_at,
    i.appointment_id,
    p.patient_id,
    p.patient_name,
    p.dob,
    p.email,
    p.phone,
    p.gender,
    p.address,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.dob))::INT AS patient_age,
    a.appointment_time

FROM Invoice i
JOIN Appointments a ON i.appointment_id = a.appointment_id
JOIN Patients p ON a.patient_id = p.patient_id
WHERE i.is_paid = FALSE;
