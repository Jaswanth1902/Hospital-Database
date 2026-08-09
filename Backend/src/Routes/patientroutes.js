import express from "express";

const router = express.Router();

router.get("/api/patients", async (req, res) => {
  const { name } = req.query;
  let sql = "SELECT * FROM Patients";
  const params = [];

  if (name) {
    sql += " WHERE patient_name ILIKE $1";
    params.push(`%${name}%`);
  }
  sql += " ORDER BY patient_id ASC";
  params.push(`%${name}%`);

  const result = await query(sql, params);
  res.json(result.rows);
});

router.get("/api/patients/:id", async (req, res) => {
  const { id } = req.params;
  let sql = "SELECT * FROM Patients WHERE patient_id = $1";
  const params = [id];

  const result = await query(sql, params);
  res.json(result.rows);
});

router.post("/api/patients", async (req, res) => {
  const { name, dob, email, phone, gender,  } = req.body;
  let sql =
    "INSERT INTO Patients (patient_name, dob, email, phone, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const params = [name, dob, email, phone, gender];

  const result = await query(sql, params);
  res.json(result.rows[0]);
});

router.put("/api/patients/:id", async (req, res) => {
  const { id } = req.params;
  const { name, dob, email, phone, gender } = req.body;
  let sql =
    "UPDATE Patients SET patient_name = COALESCE($1, patient_name), dob = COALESCE($2, dob), email = COALESCE($3, email), phone = COALESCE($4, phone), gender = COALESCE($5, gender) WHERE patient_id = $6 RETURNING *";
  const params = [name, dob, email, phone, gender, id];

  const result = await query(sql, params);
  res.json(result.rows[0]);
});

export default router;
