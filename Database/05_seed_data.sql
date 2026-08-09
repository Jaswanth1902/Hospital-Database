-- Seed Data for Hospital Database

-- Departments
INSERT INTO Departments (department_name) VALUES
('Cardiology'),
('Neurology'),
('Orthopedics'),
('Pediatrics'),
('General Medicine')
ON CONFLICT DO NOTHING;

-- Doctors
INSERT INTO Doctors (doctor_name, specialization, shift, email, phone, department_id) VALUES
('Dr. Robert Smith', 'Cardiologist', 'Morning', 'robert.smith@hospital.com', '9876543210', 1),
('Dr. Emily Davis', 'Neurologist', 'Evening', 'emily.davis@hospital.com', '9876543211', 2),
('Dr. James Wilson', 'Orthopedic Surgeon', 'Morning', 'james.wilson@hospital.com', '9876543212', 3),
('Dr. Sarah Jenkins', 'Pediatrician', 'Night', 'sarah.jenkins@hospital.com', '9876543213', 4),
('Dr. Michael Brown', 'General Physician', 'Morning', 'michael.brown@hospital.com', '9876543214', 5)
ON CONFLICT DO NOTHING;

-- Patients
INSERT INTO Patients (patient_name, dob, email, phone, gender, address) VALUES
('John Doe', '1985-04-12', 'john.doe@email.com', '9123456789', 'Male', '123 Elm Street, Cityville'),
('Jane Smith', '1992-08-25', 'jane.smith@email.com', '9123456788', 'Female', '456 Oak Avenue, Metro City'),
('Alice Johnson', '1978-11-03', 'alice.j@email.com', '9123456787', 'Female', '789 Pine Road, Suburbia'),
('Bob Martin', '2001-01-15', 'bob.m@email.com', '9123456786', 'Male', '321 Maple Lane, Townsville')
ON CONFLICT DO NOTHING;

-- Medications
INSERT INTO Medications (medication_name, description, Stock_quantity, price) VALUES
('Amoxicillin 500mg', 'Antibiotic used for bacterial infections', 200, 15.50),
('Lisinopril 10mg', 'Medication for high blood pressure', 150, 22.00),
('Ibuprofen 400mg', 'Nonsteroidal anti-inflammatory drug', 500, 8.00),
('Metformin 850mg', 'First-line medication for type 2 diabetes', 300, 12.75),
('Atorvastatin 20mg', 'Statin medication to prevent cardiovascular disease', 180, 28.50)
ON CONFLICT DO NOTHING;

-- Today's Scheduled Appointments for Doctor Daily View
INSERT INTO Appointments (appointment_time, doctor_id, patient_id, status) VALUES
(CURRENT_DATE + TIME '09:00:00', 1, 1, 'Scheduled'),
(CURRENT_DATE + TIME '10:30:00', 1, 2, 'Scheduled'),
(CURRENT_DATE + TIME '11:00:00', 5, 3, 'Scheduled'),
(CURRENT_DATE + TIME '14:00:00', 3, 4, 'Scheduled')
ON CONFLICT DO NOTHING;

-- Completed Appointment & Medical Record
INSERT INTO Appointments (appointment_time, doctor_id, patient_id, status) VALUES
(CURRENT_DATE - INTERVAL '1 day' + TIME '10:00:00', 5, 1, 'Completed')
ON CONFLICT DO NOTHING;

-- Medical Record (Triggers Invoice creation automatically)
INSERT INTO Medical_Records (appointment_id, diagnosis, notes) VALUES
(5, 'Acute Rhinopharyngitis (Common Cold)', 'Patient reported fever, headache, and runny nose for 2 days. Advised rest and fluids.')
ON CONFLICT DO NOTHING;

-- Prescription (Triggers Stock Deduction automatically)
INSERT INTO Prescriptions (appointment_id, medication_id, record_id, quantity, refills, instructions) VALUES
(5, 1, 1, 10, 1, 'Take 1 capsule twice daily after meals for 5 days')
ON CONFLICT DO NOTHING;
