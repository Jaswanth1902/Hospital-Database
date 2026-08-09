import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import patientroutes from "./Routes/patientroutes.js";
import appointmentroutes from "./Routes/appointmentroutes.js";
import pharmacyroutes from "./Routes/pharmacyroutes.js";
import billingroutes from "./Routes/billingroutes.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.resolve(dirname, "../../.env") });
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", patientroutes);
app.use("/api", appointmentroutes);
app.use("/api", pharmacyroutes);
app.use("/api", billingroutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Hospital Management System API is running",
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Hospital API Server running on port ${PORT}`);
});
