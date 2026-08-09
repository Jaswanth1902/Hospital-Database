const router = require("express").Router();

router.get("/api/medications", async (req, res) => {
    const { name } = req.query;
    let sql = "SELECT * FROM Medications";
    const params = [];
    if (name) {
        sql += " WHERE medication_name ILIKE $1";
        params.push(`%${name}%`);
    }
    const result = await query(sql, params);
    res.json(result.rows);
});

router.post("/api/prescriptions", async (req, res) => {
    const { appointment_id, medication_id, record_id, qunatity, refills, instructions } = req.body;
    let sql = "INSERT INTO Prescriptions (appointment_id, medication_id, record_id, qunatity, refills, instructions) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const params = [appointment_id, medication_id, record_id, qunatity, refills, instructions];
    const result = await query(sql, params);
    res.json(result.rows[0]);
});

router.get("/api/pharmacy/queue", async (req, res) => {
    
    let sql = "SELECT * FROM Pharmacy_fulfillment";
    const result = await query(sql);
    res.json(result.rows);
});

export default router;