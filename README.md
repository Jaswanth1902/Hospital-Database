<div align="center">

![Hospital Database Banner](assets/hospital_database_banner.svg)

# 🏥 Hospital Database & Clinical Management System
### *Normalized 3NF Relational Schema, Automated Scheduling Triggers & Clinical RBAC Engine*

[![Database: PostgreSQL 14+](https://img.shields.io/badge/Database-PostgreSQL_14+-336791?style=flat-square&logo=postgresql&logoColor=white)](https://github.com/Jaswanth1902/Hospital-Database)
[![Backend: Node.js / Express](https://img.shields.io/badge/Backend-Node.js_%7C_Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://github.com/Jaswanth1902/Hospital-Database)
[![Schema: 3NF Normalized](https://img.shields.io/badge/Schema-3NF_Normalized-8B5CF6?style=flat-square)](https://github.com/Jaswanth1902/Hospital-Database)
[![Security: Parameterized RBAC](https://img.shields.io/badge/Security-Parameterized_RBAC-10B981?style=flat-square)](https://github.com/Jaswanth1902/Hospital-Database)
[![License: MIT](https://img.shields.io/badge/License-MIT-C5A059.svg?style=flat-square)](LICENSE)

*A production-grade, 3NF-normalized clinical relational schema with automated PL/pgSQL conflict detection, role-based access control (RBAC), and parameterized SQL query safety.*

</div>

---

## ⚡ The Architectural Vision

Hospital database systems frequently suffer from data redundancy, unindexed clinical queries, appointment scheduling conflicts, and severe SQL injection vulnerabilities. 

**Hospital-Database** delivers a rigorous, mathematically normalized relational architecture:
- **3NF Relational Model**: Eliminates transitive and partial dependencies across patients, doctors, appointments, medical records, and billing ledgers.
- **PL/pgSQL Trigger Engine**: Real-time automated conflict detection preventing overlapping doctor appointments and room double-bookings at the database engine level.
- **Role-Based Access Control (RBAC)**: Fine-grained security views isolating physician clinical notes from billing administrators and public receptionists.
- **AI Query Analytics**: Natural language query translation layer allowing clinical administrators to query bed occupancy and department utilization without writing raw SQL.

---

## 🏗️ Relational Schema Architecture

```mermaid
erDiagram
    PATIENTS ||--o{ APPOINTMENTS : schedules
    PATIENTS ||--o{ MEDICAL_RECORDS : possesses
    PATIENTS ||--o{ BILLING : charged
    PHYSICIANS ||--o{ APPOINTMENTS : attends
    PHYSICIANS ||--o{ MEDICAL_RECORDS : authors
    DEPARTMENTS ||--o{ PHYSICIANS : employs
    DEPARTMENTS ||--o{ ROOMS : contains
    APPOINTMENTS ||--o| ROOMS : assigned_to

    PATIENTS {
        uuid patient_id PK
        varchar national_id UK
        varchar full_name
        date dob
        varchar blood_group
        text emergency_contact
        timestamp created_at
    }

    PHYSICIANS {
        uuid physician_id PK
        varchar license_number UK
        varchar full_name
        uuid department_id FK
        varchar specialization
        boolean is_active
    }

    APPOINTMENTS {
        uuid appointment_id PK
        uuid patient_id FK
        uuid physician_id FK
        uuid room_id FK
        timestamp scheduled_time
        varchar status
    }

    MEDICAL_RECORDS {
        uuid record_id PK
        uuid patient_id FK
        uuid physician_id FK
        text diagnosis
        text prescription
        timestamp examination_date
    }

    BILLING {
        uuid invoice_id PK
        uuid patient_id FK
        decimal amount
        varchar payment_status
        timestamp generated_at
    }
```

---

## 🔄 Interaction & Conflict Resolution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Reception as Hospital Receptionist
    participant API as Node.js / Express API
    participant PG as PostgreSQL 14+ Engine
    participant Trigger as PL/pgSQL Conflict Trigger

    Reception->>API: POST /api/appointments {patient_id, physician_id, time, room_id}
    API->>API: Sanitize & Validate Request Body (Joi schema)
    API->>PG: BEGIN TRANSACTION
    API->>PG: INSERT INTO appointments (...) VALUES (...)
    PG->>Trigger: BEFORE INSERT TRIGGER check_physician_availability()
    alt Physician or Room Double-Booked
        Trigger-->>PG: RAISE EXCEPTION 'Scheduling Conflict'
        PG-->>API: Error: SQLSTATE 23505 (Constraint Violation)
        API->>PG: ROLLBACK
        API-->>Reception: HTTP 409 Conflict ("Doctor already booked for requested slot")
    else Slot Available
        Trigger-->>PG: ACCEPT INSERT
        PG-->>API: COMMIT TRANSACTION (appointment_id)
        API-->>Reception: HTTP 201 Created (Appointment Confirmed)
    end
```

---

## 🧩 Antigravity Skills & Tooling Ecosystem

This repository integrates with the Antigravity agentic skill matrix:

- **`clean-code`**: Strict adherence to Uncle Bob Martin clean code principles and modular separation between database migration scripts and API controllers.
- **`security-linting`**: Zero raw SQL concatenation; automated AST auditing verifying 100% parameterized queries.
- **`performance-profiling`**: `EXPLAIN ANALYZE` query execution plans guaranteeing B-Tree index utilization under high query velocity.
- **`schema-mapping`**: High-fidelity declarative mapping between clinical HL7/FHIR message standards and relational PostgreSQL tables.

---

## 📦 Tech Stack & Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Database** | PostgreSQL 14+ | Relational engine, 3NF schema, ACID compliance, PL/pgSQL triggers |
| **API Layer** | Node.js 18+ / Express | RESTful endpoints, connection pooling (`pg-pool`) |
| **Validation** | Joi | Strict payload validation preventing invalid inputs |
| **Security** | bcrypt | Secure password hashing (work factor 12) for clinical staff |
| **Frontend AI** | HTML5 / Modern CSS / Vanilla JS | Responsive clinical workbench for analytics and query inspection |

---

## 🛡️ Security Hardening & Zero-Trust Architecture

1. **100% Parameterized Queries**: All SQL executions utilize parameterized `$1, $2` variables via `pg` connection pool. Zero string interpolation is permitted.
2. **Clinical Data Isolation (RBAC)**: Database roles (`receptionist_role`, `doctor_role`, `billing_role`) enforce strict least-privilege table grants. Medical notes cannot be read by billing accounts.
3. **Secret Hygiene**: Zero database passwords or JWT tokens committed to source. All credentials loaded via validated environment configurations (`.env.example`).
4. **Audit Logging**: Immutable database trigger `clinical_audit_log` records timestamp, operator ID, and field diff for every change to patient records.

---

## 🚀 Getting Started

### 1. Prerequisites
- PostgreSQL 14 or higher
- Node.js 18 or higher

### 2. Database Initialization
```bash
# Create clinical database
createdb -U postgres hospital_db

# Execute schema and triggers
psql -U postgres -d hospital_db -f Database/schema.sql
```

### 3. Backend Setup
```bash
cd Backend
cp .env.example .env
npm install
npm start
```
API server runs at `http://localhost:5000`.

---

## 📄 License & Governance

Distributed under the [MIT License](LICENSE). Maintained by [Jaswanth Reddy](https://github.com/Jaswanth1902) — *Passionate learner & creative problem solver learning from and giving back to the open-source community.*
