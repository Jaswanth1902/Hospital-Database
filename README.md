# 🏥 Hospital Database & Clinical Management System

[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20PL%2FpgSQL-336791?style=flat-square&logo=postgresql)](https://github.com/Jaswanth1902/Hospital-Database)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=flat-square&logo=node.js)](https://github.com/Jaswanth1902/Hospital-Database)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A structured relational database architecture and RESTful backend designed for hospital management, doctor scheduling, and patient record tracking. Built with PostgreSQL, optimized indexing, and an AI query interface.

---

## ⚡ Key Features

- **Relational Integrity**: Fully normalized 3NF schema covering patients, physicians, departments, appointments, and billing ledgers.
- **Stored Procedures & Triggers**: Automated conflict detection for doctor scheduling using PL/pgSQL triggers.
- **RESTful API**: Node.js/Express service layer with parameterized SQL query safety.
- **AI Query Workbench**: Interactive frontend for querying appointment analytics and bed occupancy metrics.

---

## 🚀 Quickstart

### 1. Prerequisites
- PostgreSQL 14+
- Node.js 18+

### 2. Setup Database
```sql
-- Create database
CREATE DATABASE hospital_db;

-- Execute schema initialization
\i Database/schema.sql
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your local PostgreSQL credentials
```

### 4. Run Backend Service
```bash
cd Backend
npm install
npm start
```
API server runs at `http://localhost:5000`.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright (c) 2026 Jaswanth Reddy.
