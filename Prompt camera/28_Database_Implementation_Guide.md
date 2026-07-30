# 28_Database_Implementation_Guide.md

# GeoHeat AI Green Designer

## Database Implementation Guide

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดแนวทางการสร้างและจัดการ Database ของระบบ GeoHeat AI Green Designer

Database มีหน้าที่จัดเก็บข้อมูล:

* ผู้ใช้งาน
* พื้นที่โครงการ
* รูปภาพ
* ผลการวิเคราะห์ AI
* คำแนะนำต้นไม้
* แบบสวน
* รายงาน
* GIS Data
* System Logs

---

# 2. Database Technology

ใช้:

```text
Supabase PostgreSQL
```

เหตุผล:

* PostgreSQL มาตรฐาน
* รองรับ JSON Data
* รองรับ Spatial Data
* Authentication พร้อม
* Row Level Security
* Realtime Database

---

# 3. Database Architecture

```text
Supabase


├── PostgreSQL Database

├── Authentication

├── Storage

├── Realtime

└── Edge Functions

```

---

# 4. Database Environment

แบ่งเป็น 3 Environment

```text
Development

↓

Staging

↓

Production

```

---

# 5. Database Folder Structure

```text
database/


├── migrations/

│
├── 001_create_users.sql

├── 002_create_projects.sql

├── 003_create_images.sql

├── 004_create_analysis.sql

├── 005_create_plants.sql

├── 006_create_reports.sql


├── seed/


├── plants.sql

├── demo_data.sql


├── policies/

├── rls.sql


└── functions/

├── triggers.sql

```

---

# 6. Entity Relationship Overview

```text

users

 |

 |

projects

 |

 |------------------

 |                 |

images          analysis

                  |

                  |

          recommendations

                  |

                  |

             garden_designs

                  |

                  |

              reports


```

---

# 7. Users Table

## Purpose

เก็บข้อมูลผู้ใช้งาน

Table:

```sql
users
```

Structure:

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| email      | TEXT      |
| name       | TEXT      |
| avatar_url | TEXT      |
| role       | TEXT      |
| created_at | TIMESTAMP |

---

Relationship

```text
User 1:N Projects
```

---

# 8. Projects Table

## Purpose

เก็บพื้นที่ที่ผู้ใช้ต้องการวิเคราะห์

Table:

```sql
projects
```

Columns:

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | UUID      |
| name       | TEXT      |
| area_type  | TEXT      |
| area_size  | FLOAT     |
| latitude   | FLOAT     |
| longitude  | FLOAT     |
| status     | TEXT      |
| created_at | TIMESTAMP |

---

Example:

```json
{
"name":"สวนหลังบ้าน",

"area_size":25,

"area_type":"backyard"
}
```

---

# 9. Project Images Table

## Purpose

เก็บภาพพื้นที่

Table:

```sql
project_images
```

Columns:

| Column      | Type      |
| ----------- | --------- |
| id          | UUID      |
| project_id  | UUID      |
| image_url   | TEXT      |
| image_type  | TEXT      |
| uploaded_at | TIMESTAMP |

---

Relationship

```text
Project 1:N Images
```

---

# 10. AI Analysis Table

## Purpose

เก็บผลวิเคราะห์จาก AI

Table:

```sql
analysis_results
```

Columns:

| Column           | Type      |
| ---------------- | --------- |
| id               | UUID      |
| project_id       | UUID      |
| image_id         | UUID      |
| green_percentage | FLOAT     |
| heat_score       | FLOAT     |
| heat_level       | TEXT      |
| detected_objects | JSONB     |
| created_at       | TIMESTAMP |

---

Example JSON

```json
{
"tree":3,

"concrete":50,

"grass":20
}
```

---

# 11. Green Score Table

## Purpose

เก็บคะแนนสิ่งแวดล้อม

Table:

```sql
green_scores
```

Columns:

| Column      | Type    |
| ----------- | ------- |
| id          | UUID    |
| analysis_id | UUID    |
| score       | INTEGER |
| grade       | TEXT    |
| explanation | JSONB   |

---

# 12. Plant Database Table

## Purpose

ฐานข้อมูลต้นไม้

Table:

```sql
plants
```

Columns:

| Column            | Type    |
| ----------------- | ------- |
| id                | UUID    |
| name              | TEXT    |
| scientific_name   | TEXT    |
| sunlight          | TEXT    |
| water_requirement | TEXT    |
| heat_tolerance    | INTEGER |
| maintenance_level | TEXT    |
| description       | TEXT    |
| image_url         | TEXT    |

---

Example:

```json
{
"name":"ต้นแก้ว",

"heat_tolerance":90,

"maintenance_level":"low"
}
```

---

# 13. Recommendation Table

## Purpose

เก็บคำแนะนำ AI

Table:

```sql
recommendations
```

Columns:

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| project_id | UUID      |
| plant_id   | UUID      |
| score      | FLOAT     |
| reason     | TEXT      |
| created_at | TIMESTAMP |

---

# 14. Garden Design Table

## Purpose

เก็บแบบสวนที่ AI สร้าง

Table:

```sql
garden_designs
```

Columns:

| Column          | Type      |
| --------------- | --------- |
| id              | UUID      |
| project_id      | UUID      |
| style           | TEXT      |
| layout          | JSONB     |
| generated_image | TEXT      |
| created_at      | TIMESTAMP |

---

Example Layout

```json
{
"zones":[

"shade",

"flower",

"path"

]
}
```

---

# 15. Reports Table

## Purpose

เก็บรายงาน PDF

Table:

```sql
reports
```

Columns:

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| project_id | UUID      |
| pdf_url    | TEXT      |
| status     | TEXT      |
| created_at | TIMESTAMP |

---

# 16. Tasks Table

## Purpose

จัดการ AI Background Process

Table:

```sql
tasks
```

Columns:

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | UUID      |
| type       | TEXT      |
| status     | TEXT      |
| progress   | INTEGER   |
| result     | JSONB     |
| created_at | TIMESTAMP |

---

Status:

```text
pending

processing

completed

failed
```

---

# 17. GIS Data Table

## Purpose

เก็บข้อมูลพื้นที่

Table:

```sql
gis_layers
```

Columns:

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| name       | TEXT      |
| type       | TEXT      |
| geojson    | JSONB     |
| created_at | TIMESTAMP |

---

# 18. Database Index

เพิ่ม Index เพื่อเพิ่มความเร็ว

## Projects

```sql
CREATE INDEX idx_project_user
ON projects(user_id);
```

---

## Analysis

```sql
CREATE INDEX idx_analysis_project
ON analysis_results(project_id);
```

---

## Tasks

```sql
CREATE INDEX idx_task_status
ON tasks(status);
```

---

# 19. Row Level Security (RLS)

หลักการ:

User เห็นเฉพาะข้อมูลตัวเอง

---

# Example

Projects Policy

```sql
CREATE POLICY
"user_project_access"

ON projects

FOR SELECT

USING

(auth.uid() = user_id);

```

---

# 20. Storage Security

Bucket:

```text
geoheat-storage
```

Folders:

```text
users/{user_id}/images

users/{user_id}/reports

```

---

Policy:

User สามารถ

* Upload ของตัวเอง
* อ่านไฟล์ตัวเอง

---

# 21. Database Trigger

## Auto Update Timestamp

```sql
updated_at

=

NOW()

```

---

## Create Profile After Register

Flow:

```text
New User

↓

Auth Created

↓

Trigger

↓

Create User Profile

```

---

# 22. Database Function

ตัวอย่าง:

## Calculate Average Green Score

```sql
calculate_green_score(project_id)
```

Return:

```json
{
"average":82
}
```

---

# 23. Migration Workflow

การ Update Database

```text
Create Migration

↓

Test Local

↓

Apply Staging

↓

Verify

↓

Apply Production

```

---

# 24. Seed Data

ใช้สำหรับ Demo

ประกอบด้วย:

## Plants

```text
50+ Species
```

## Garden Styles

```text
Tropical

Minimal

Japanese

Vertical

```

---

## Demo Projects

ตัวอย่าง:

```text
Backyard

Balcony

School Area

Community Area

```

---

# 25. Backup Strategy

## Automatic Backup

เปิดใช้งาน

* Daily Backup
* Point Recovery

---

# 26. Database Monitoring

ตรวจสอบ:

* Connection
* Query Time
* Storage Usage
* Failed Transactions

---

# 27. Performance Optimization

ใช้:

* Index
* Query Optimization
* Pagination
* Cache

---

# 28. Data Validation

ทุกข้อมูลต้องตรวจสอบ

Example:

Area Size

```text
>0

<10000 sqm
```

Image

```text
jpg/png/webp

<10MB
```

---

# 29. Database Security Checklist

✓ RLS Enabled

✓ Sensitive Data Protected

✓ API Key ไม่อยู่ใน Client

✓ Backup เปิดใช้งาน

✓ Permission ถูกต้อง

---

# 30. Implementation Order

Claude Code ควรทำตามลำดับ:

## Step 1

Create Supabase Project

## Step 2

Run Migration

## Step 3

Create Tables

## Step 4

Create RLS Policies

## Step 5

Insert Seed Data

## Step 6

Connect Backend

## Step 7

Test CRUD

---

# 31. Definition of Done

Database พร้อมใช้งานเมื่อ:

✓ Tables ครบ

✓ Relationship ถูกต้อง

✓ RLS ทำงาน

✓ Seed Data พร้อม

✓ Backend เชื่อมได้

✓ Backup พร้อม

✓ Production Ready

---

# END OF 28_Database_Implementation_Guide.md
