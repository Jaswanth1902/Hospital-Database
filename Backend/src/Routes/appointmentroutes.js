const router = require("express").Router();

router.get("/api/appointments/today", async (req, res) => {
    const { patient_name, doctor_name, date } = req.query;
    let sql = "SELECT * FROM Doctor_daily_view";
    const params = [];
    if(patient_name) {
        sql += " WHERE patient_name ILIKE $1";
        params.push(`%${patient_name}%`);
    }
    if(doctor_name) {
        sql += params.length ? " AND doctor_name ILIKE $2" : " WHERE doctor_name ILIKE $1";
        params.push(`%${doctor_name}%`);
    }
    if(date) {
        sql += params.length ? " AND appointment_date = $3" : " WHERE appointment_date = $1";
        params.push(date);
    }
    sql += " ORDER BY appointment_date ASC";
    const result = await query(sql, params);
    res.json(result.rows);
});

router.get("/api/appointments/:id/records", async (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM Patient_EHR_view WHERE appointment_id = $1";
    const params = [id];
    const result = await query(sql, params);
    res.json(result.rows);
});

router.post("/api/records", async (req, res) => {
    const { appointment_id, diagnosis, treatment, notes } = req.body;
    let sql = "INSERT INTO MedicalRecords (appointment_id, diagnosis, treatment, notes) VALUES ($1, $2, $3, $4) RETURNING *";
    const params = [appointment_id, diagnosis, treatment, notes];
    const result = await query(sql, params);
    res.json(result.rows[0]);
});

router.put("/api/appointments/:id/status", async (req, res) => {
    const {status, id } = req.params;
    let sql = "UPDATE Appointments SET status = $1 WHERE appointment_id = $2 RETURNING *";
    const params = [status, id];
    const result = await query(sql, params);
    res.json(result.rows[0]);
});

router.post("/api/records", async (req, res) => {
    const { appointment_id, diagnosis, treatment, notes } = req.body;
    let sql = "INSERT INTO MedicalRecords (appointment_id, diagnosis, treatment, notes) VALUES ($1, $2, $3, $4) RETURNING *";
    const params = [appointment_id, diagnosis, treatment, notes];
    const result = await query(sql, params);
    res.json(result.rows[0]);
});

export default router;