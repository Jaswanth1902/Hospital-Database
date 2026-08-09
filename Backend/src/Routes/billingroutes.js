import { Router } from "express";
import { query } from "../db.js";   

const router = Router();

router.get("/billing/unpaid", async (req, res) => {
    let sql = "SELECT * FROM Accounts_Receivable_view";
    const result = await query(sql);
    res.json(result.rows);
});

router.get("/patients/:id/invoice", async (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM Invoice WHERE patient_id = $1";
    const params = [id];
    const result = await query(sql, params);
    res.json(result.rows);
});

router.put("/invoice/:id/pay", async (req, res) => {
    const { id } = req.params;
    let sql = "UPDATE Invoice SET is_paid = TRUE WHERE invoice_id = $1 RETURNING *";
    const params = [id];
    const result = await query(sql, params);
    res.json(result.rows[0]);
});

export default router;