DROP TABLE IF EXISTS Invoice CASCADE;
DROP TABLE IF EXISTS Prescriptions CASCADE;
DROP TABLE IF EXISTS Medications CASCADE;
DROP TABLE IF EXISTS Medical_Records CASCADE;
DROP TABLE IF EXISTS Appointments CASCADE;
DROP TABLE IF EXISTS Patients CASCADE;
DROP TABLE IF EXISTS Doctors CASCADE;
DROP TABLE IF EXISTS Departments CASCADE;

CREATE TABLE IF NOT EXISTS Departments (
	Department_id SERIAL PRIMARY KEY,
	department_name VARCHAR(255)  
);

CREATE TABLE IF NOT EXISTS Doctors (
	Doctor_id SERIAL PRIMARY KEY,
	doctor_name VARCHAR(255) NOT NULL,  
    specialization VARCHAR(255) NOT NULL,
    consultation_fee NUMERIC NOT NULL,
    shift VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE ,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    department_id INT REFERENCES Departments(department_id) ON DELETE SET NULL

);

CREATE TABLE IF NOT EXISTS Patients (
	Patient_id SERIAL PRIMARY KEY,
	patient_name VARCHAR(255) NOT NULL,  
    dob DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE ,
    gender VARCHAR(10) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Appointments (
	Appointment_id SERIAL PRIMARY KEY,
    appointment_time TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    doctor_id INT REFERENCES Doctors(doctor_id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL,
    patient_id INT REFERENCES Patients(patient_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Medical_Records (
    Record_id SERIAL PRIMARY KEY,
    Appointment_id INT REFERENCES Appointments(appointment_id) ON DELETE SET NULL,
    diagnosis TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS Medications (
    Medication_id SERIAL PRIMARY KEY,
    medication_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    Stock_quantity INT NOT NULL,
    price NUMERIC NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Prescriptions (
    Prescription_id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES Appointments(appointment_id) ON DELETE SET NULL,
    medication_id INT REFERENCES Medications(medication_id) ON DELETE SET NULL,
    record_id INT REFERENCES Medical_Records(record_id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    refills INT DEFAULT 0,
    instructions TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Invoice (
    Invoice_id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES Appointments(appointment_id) ON DELETE SET NULL,
    patient_id INT REFERENCES Patients(patient_id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);