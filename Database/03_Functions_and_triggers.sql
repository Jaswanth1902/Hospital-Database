CREATE OR REPLACE FUNCTION Double_booking()
RETURNS TRIGGER AS $$
   BEGIN
      IF EXISTS (SELECT 1 FROM Appointments WHERE doctor_id = NEW.doctor_id AND appointment_time = NEW.appointment_time AND appointment_id != NEW.appointment_id) THEN
         RAISE EXCEPTION 'Doctor is already booked at this time';
      END IF;
      RETURN NEW;
   END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevents_double_booking
BEFORE INSERT OR UPDATE ON Appointments
FOR EACH ROW
EXECUTE FUNCTION Double_booking();


CREATE OR REPLACE FUNCTION Inventory_Deduction()
RETURNS TRIGGER AS $$
   BEGIN
      IF EXISTS (SELECT 1 FROM Medications WHERE Medication_id = NEW.Medication_id AND Stock_quantity >= NEW.quantity) THEN
         UPDATE Medications 
         SET Stock_quantity = Stock_quantity - NEW.quantity
         WHERE Medication_id = NEW.Medication_id;
      ELSE
         RAISE EXCEPTION 'Insufficient stock';
      END IF;
      RETURN NEW;
   END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_insufficient_stock
BEFORE INSERT OR UPDATE ON Prescriptions
FOR EACH ROW
EXECUTE FUNCTION Inventory_Deduction();


CREATE OR REPLACE FUNCTION Invoice_Generator()
RETURNS TRIGGER AS $$
DECLARE
    v_patient_id INT;
    v_amount NUMERIC;
BEGIN
    -- Step 1: Deduce patient_id from the Appointments table
    SELECT patient_id INTO v_patient_id
    FROM Appointments
    WHERE appointment_id = NEW.appointment_id;

   SELECT consultation_fee INTO v_amount
   FROM Doctors
   WHERE doctor_id = (SELECT doctor_id FROM Appointments WHERE appointment_id = NEW.appointment_id);

    -- Step 2: Validate that the appointment exists
    IF v_patient_id IS NULL THEN
        RAISE EXCEPTION 'Appointment ID % not found', NEW.appointment_id;
    END IF;

    IF v_amount IS NULL THEN
        RAISE EXCEPTION 'Consultation fee not found for the doctor associated with appointment ID %', NEW.appointment_id;
    END IF;

    -- Step 3: Insert a new invoice with the standard base consultation fee
    INSERT INTO Invoice (
        appointment_id, 
        patient_id, 
        amount, 
        is_paid
    )
    VALUES (
        NEW.appointment_id, 
        v_patient_id, 
        v_amount,       
        FALSE         
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger attached to Medical_Records AFTER INSERT
CREATE TRIGGER generate_invoice
AFTER INSERT ON Medical_Records
FOR EACH ROW
EXECUTE FUNCTION Invoice_Generator();


CREATE OR REPLACE FUNCTION Add_Updated_At_Time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Departments
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Doctors
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Patients
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Appointments
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Medical_Records
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Medications
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Prescriptions
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();

CREATE TRIGGER update_timestamp_on_update
BEFORE UPDATE ON Invoice
FOR EACH ROW
EXECUTE FUNCTION Add_Updated_At_Time();