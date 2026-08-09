import { Router } from "express";
import { query } from "../db.js";   

const router = Router();

router.get("/medications", async (req, res) => {
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

router.post("/prescriptions", async (req, res) => {
    const { appointment_id, medication_id, record_id, quantity, refills, instructions } = req.body;
    let sql = "INSERT INTO Prescriptions (appointment_id, medication_id, record_id, quantity, refills, instructions) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const params = [appointment_id, medication_id, record_id, quantity, refills, instructions];
    const result = await query(sql, params);
    res.json(result.rows[0]);
});

router.get("/pharmacy/queue", async (req, res) => {
    
    let sql = "SELECT * FROM Pharmacy_fulfillment";
    const result = await query(sql);
    res.json(result.rows);
});

export default router;