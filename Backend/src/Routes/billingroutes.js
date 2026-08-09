const router = require("express").Router();

router.get("/api/billing/unpaid", async (req, res) => {

    sql = "SELECT * FROM Accounts_Receivable_view";
    const result = await query(sql);
    res.json(result.rows);
});

router.get("/api/patients/:id/invoices", async (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM Invoices WHERE patient_id = $1";
    const params = [id];
    const result = await query(sql, params);
    res.json(result.rows);
});

router.put("/api/invoices/:id/pay", async (req, res) => {
    const { id } = req.params;
    let sql = "UPDATE Invoices SET status = 'Paid' WHERE invoice_id = $1 RETURNING *";
    const params = [id];
    const result = await query(sql, params);
    res.json(result.rows[0]);
});

export default router;