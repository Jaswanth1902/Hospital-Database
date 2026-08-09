import { Router } from "express";
import { query } from "../db.js";   

const router = express.Router();

router.get("/patients", async (req, res) => {
  const { name } = req.query;
  let sql = "SELECT * FROM Patients";
  const params = [];

  if (name) {
    sql += " WHERE patient_name ILIKE $1";
    params.push(`%${name}%`);
  }
  sql += " ORDER BY patient_id ASC";
  const result = await query(sql, params);
  res.json(result.rows);
});

router.get("/patients/:id", async (req, res) => {
  const { id } = req.params;
  let sql = "SELECT * FROM Patients WHERE patient_id = $1";
  const params = [id];

  const result = await query(sql, params);
  res.json(result.rows[0]);
});

router.post("/patients", async (req, res) => {
  const { name, dob, email, phone, gender, address } = req.body;
  let sql =
    "INSERT INTO Patients (patient_name, dob, email, phone, gender, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
  const params = [name, dob, email, phone, gender, address];

  const result = await query(sql, params);
  res.json(result.rows[0]);
});

router.put("/patients/:id", async (req, res) => {
  const { id } = req.params;
  const { name, dob, email, phone, gender, address } = req.body;
  let sql =
    "UPDATE Patients SET patient_name = COALESCE($1, patient_name), dob = COALESCE($2, dob), email = COALESCE($3, email), phone = COALESCE($4, phone), gender = COALESCE($5, gender), address = COALESCE($6, address) WHERE patient_id = $7 RETURNING *";
  const params = [name, dob, email, phone, gender, address, id];

  const result = await query(sql, params);
  res.json(result.rows[0]);
});

export default router;
