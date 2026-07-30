# 23_Backend_Implementation_Specification.md

# GeoHeat AI Green Designer

## Backend Implementation Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดรายละเอียดการพัฒนา Backend ของ GeoHeat AI Green Designer

Backend มีหน้าที่เป็นศูนย์กลางในการจัดการ

* API Request
* Authentication
* Database Communication
* AI Processing
* Image Processing
* Recommendation Engine
* Report Generation
* Background Tasks

---

# 2. Backend Technology Stack

## Core Framework

```text
FastAPI

Python 3.12+
```

เหตุผล

* Performance สูง
* รองรับ Async
* เหมาะกับ AI Service
* มี Automatic API Documentation

---

# Database

ใช้

```text
Supabase PostgreSQL
```

สำหรับ

* User Data
* Projects
* Analysis Results
* Plant Database
* Reports

---

# Storage

ใช้

```text
Supabase Storage
```

เก็บ

* User Images
* AI Generated Images
* PDF Reports

---

# Authentication

ใช้

```text
Supabase Auth

JWT Authentication
```

---

# AI Service

ประกอบด้วย

```text
Python AI Service

├── Computer Vision

├── Recommendation Engine

├── LLM Service

└── Image Generation Service
```

---

# 3. Backend Architecture

```text
backend/

│

├── app/

│   ├── main.py

│   │

│   ├── api/

│   │   ├── auth.py

│   │   ├── projects.py

│   │   ├── images.py

│   │   ├── analysis.py

│   │   ├── recommendation.py

│   │   ├── garden.py

│   │   ├── reports.py

│   │   └── gis.py

│   │

│   ├── core/

│   │   ├── config.py

│   │   ├── security.py

│   │   └── database.py

│   │

│   ├── models/

│   │

│   ├── schemas/

│   │

│   ├── services/

│   │   ├── vision_service.py

│   │   ├── heat_service.py

│   │   ├── recommendation_service.py

│   │   ├── garden_service.py

│   │   └── report_service.py

│   │

│   ├── workers/

│   │   └── ai_worker.py

│   │

│   └── utils/

│

└── requirements.txt
```

---

# 4. Application Entry Point

File:

```
app/main.py
```

หน้าที่

* Start FastAPI
* Register Router
* Middleware
* CORS
* Error Handler

Example Flow

```text
Server Start

↓

Load Config

↓

Connect Database

↓

Register API

↓

Ready
```

---

# 5. Configuration Management

File:

```
core/config.py
```

เก็บ Environment Variables

ตัวอย่าง

```env
DATABASE_URL=

SUPABASE_URL=

SUPABASE_KEY=

JWT_SECRET=

AI_API_KEY=

STORAGE_BUCKET=
```

---

# 6. Database Layer

File:

```
core/database.py
```

หน้าที่

* PostgreSQL Connection
* Query Management
* Transaction

---

# 7. API Layer Architecture

รูปแบบ

```text
Request

↓

Router

↓

Validation Schema

↓

Service Layer

↓

Database / AI

↓

Response
```

---

# 8. Authentication Middleware

ทุก Protected API ต้องตรวจสอบ

Flow

```text
Request

↓

JWT Token

↓

Verify User

↓

Allow Access

↓

Process Request
```

---

# 9. Project Service

File:

```
services/project_service.py
```

หน้าที่

จัดการ

* Create Project
* Update Project
* Delete Project
* Get Project

---

API

```
POST /projects

GET /projects

GET /projects/{id}

PUT /projects/{id}

DELETE /projects/{id}
```

---

# 10. Image Processing Service

File:

```
services/image_service.py
```

หน้าที่

* Validate Image
* Resize
* Compress
* Upload Storage
* Create Image Record

Flow

```text
Upload

↓

Validate

↓

Process

↓

Storage

↓

Database
```

---

# 11. AI Vision Service

File:

```
services/vision_service.py
```

หน้าที่

เชื่อม

* YOLO
* SAM/SAM2
* Image Processing

---

Flow

```text
Image

↓

Object Detection

↓

Segmentation

↓

Feature Extraction

↓

Save Result
```

---

Output

```json
{
"objects":[
"tree",
"concrete"
],

"green_area":35
}
```

---

# 12. Heat Analysis Service

File:

```
services/heat_service.py
```

หน้าที่

ประเมินความร้อน

Input

* Surface
* Green Coverage
* Temperature

Output

```json
{
"risk":"High",

"score":82,

"reason":[
"Low vegetation",
"High concrete area"
]
}
```

---

# 13. Recommendation Engine

File:

```
services/recommendation_service.py
```

หน้าที่

เลือกต้นไม้และรูปแบบสวน

---

Architecture

```text
Analysis Result

+

Plant Database

+

User Preference

↓

Ranking Algorithm

↓

Recommendation
```

---

# 14. Garden Design Service

File:

```
services/garden_service.py
```

หน้าที่

สร้าง Concept สวน

Input

* Area
* Style
* Budget
* Maintenance

Output

```json
{
"style":"Tropical",

"layout":[
"Tree Zone",
"Flower Zone"
]
}
```

---

# 15. Generative AI Service

File:

```
services/generation_service.py
```

หน้าที่

สร้างภาพสวน

Flow

```text
Original Image

+

Garden Prompt

↓

Image AI API

↓

Generated Image

↓

Storage
```

---

# 16. Report Generation Service

File:

```
services/report_service.py
```

หน้าที่

สร้าง PDF

ประกอบด้วย

* Analysis
* Score
* Plants
* Garden Design
* Explanation

Flow

```text
Project Data

↓

LLM Summary

↓

PDF Generator

↓

Storage
```

---

# 17. Background Task System

AI บางงานใช้เวลานาน

เช่น

* Image Analysis
* Image Generation
* Report

จึงใช้

```text
Background Worker
```

---

Flow

```text
User Request

↓

Create Task

↓

Queue

↓

AI Worker

↓

Save Result

↓

Notify User
```

---

# 18. Task Status Management

Table:

```
tasks
```

Fields

```text
id

user_id

task_type

status

progress

result

created_at
```

---

Status

```
pending

processing

completed

failed
```

---

# 19. API Response Standard

ทุก API ใช้ Format เดียวกัน

Success

```json
{
"success":true,

"data":{}
}
```

Error

```json
{
"success":false,

"error":{
"code":"ERROR_CODE",

"message":"Description"
}
}
```

---

# 20. Error Handling

รองรับ

## Image Error

* File too large
* Invalid format

## AI Error

* Model unavailable
* Timeout

## Database Error

* Connection Failed

---

# 21. Security Architecture

Backend ต้องมี

## Authentication

JWT Verification

## Authorization

User สามารถเข้าถึงเฉพาะข้อมูลตัวเอง

## Validation

ตรวจสอบ Input ทุกครั้ง

## File Security

ตรวจสอบ

* Type
* Size
* Malware

---

# 22. Performance Optimization

## Database

ใช้

* Index
* Query Optimization

---

## AI

ใช้

* Async Processing
* Cache Result
* Model Loading Once

---

## API

ใช้

* Async Endpoint
* Connection Pool

---

# 23. Logging System

เก็บ

* API Request
* AI Processing Time
* Error Logs
* User Activity

---

# 24. Testing Strategy

## Unit Test

ทดสอบ

* Service
* Function

---

## API Test

ใช้

```
pytest
```

ทดสอบ

* Authentication
* CRUD
* AI Endpoint

---

# 25. Deployment Architecture

Production

```text
User

↓

Vercel

(Frontend)

↓

FastAPI Server

↓

Supabase

(Database)

↓

AI Services
```

---

# 26. Development Order

## Phase 1

Backend Foundation

สร้าง

* FastAPI
* Database
* Auth
* CRUD

---

## Phase 2

Image System

สร้าง

* Upload
* Storage
* Processing

---

## Phase 3

AI Integration

สร้าง

* Vision
* Heat Analysis
* Recommendation

---

## Phase 4

Advanced

สร้าง

* Garden Generator
* Reports
* GIS

---

# 27. Definition of Done

Backend ถือว่าสมบูรณ์เมื่อ

✓ API ทำงานครบ

✓ Database เชื่อมต่อได้

✓ Authentication พร้อม

✓ AI Pipeline ทำงานได้

✓ Background Task ทำงาน

✓ Security ผ่าน

✓ พร้อม Deploy

---

# END OF 23_Backend_Implementation_Specification.md
