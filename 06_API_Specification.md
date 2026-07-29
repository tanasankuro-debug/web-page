# API Specification

# Project

GeoHeat AI Green Designer

Version: 1.0

---

# 1. API Overview

## Purpose

API Layer เป็นตัวกลางระหว่าง:

Frontend

↓

Backend API

↓

AI Services

↓

Database

---

# 2. API Architecture

```
Frontend (Next.js)
    |
REST API
    |
FastAPI Backend
    |
  | | |
 AI  GIS  Database
Service Service Supabase
```

---

# 3. Base Configuration

## Base URL

Development

```
http://localhost:8000/api/v1
```

Production

```
https://api.geoheat-ai.com/api/v1
```

---

# 4. API Standards

## Request Format

Content-Type:

application/json

---

## Response Format

ทุก API ต้องตอบกลับรูปแบบเดียวกัน

Success:

```json
{
  "success": true,
  "data": {},
  "message": "success"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "description"
  }
}
```

---

# 5. Authentication API

## 5.1 Register User

POST

/auth/register

Purpose:

สร้างบัญชีผู้ใช้

Request:

```json
{
  "email": "user@email.com",
  "password": "password",
  "full_name": "User Name"
}
```

Response:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@email.com"
  }
}
```

## 5.2 Login

POST

/auth/login

Request:

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

Response:

```json
{
  "access_token": "JWT_TOKEN",
  "user_id": "uuid"
}
```

## 5.3 Get Current User

GET

/auth/me

Response:

```json
{
  "id": "uuid",
  "name": "User"
}
```

---

# 6. Project API

## 6.1 Create Project

POST

/projects

Purpose:

สร้างพื้นที่วิเคราะห์ใหม่

Request:

```json
{
  "name": "สวนหลังบ้าน",
  "description": "พื้นที่ทดลอง",
  "location": {
    "lat": 16.432,
    "lng": 102.823
  }
}
```

Response:

```json
{
  "id": "project_uuid",
  "name": "สวนหลังบ้าน"
}
```

## 6.2 Get Projects

GET

/projects

Response:

```json
[
  {
    "id": "001",
    "name": "สวนหน้าบ้าน",
    "score": 82
  }
]
```

## 6.3 Get Project Detail

GET

/projects/{project_id}

Response:

```json
{
  "id": "001",
  "area": 25,
  "green_score": 82,
  "garden": "tropical"
}
```

## 6.4 Delete Project

DELETE

/projects/{project_id}

---

# 7. Image API

## 7.1 Upload Image

POST

/images/upload

Purpose:

Upload รูปพื้นที่

Request: Multipart Form Data

```
image=file
project_id=uuid
type=before
```

Response:

```json
{
  "image_id": "uuid",
  "url": "storage/image.jpg"
}
```

## 7.2 Get Images

GET

/projects/{id}/images

Response:

```json
[
  {
    "url": "image.jpg",
    "type": "before"
  }
]
```

---

# 8. AI Analysis API

## 8.1 Start Image Analysis

POST

/ai/analyze

Purpose:

ส่งรูปเข้า AI Pipeline

Request:

```json
{
  "project_id": "uuid",
  "image_id": "uuid"
}
```

Process:

```
Image
↓
YOLO
↓
SAM
↓
Depth Model
↓
Area Calculation
↓
Save Result
```

Response:

```json
{
  "task_id": "analysis_task_001",
  "status": "processing"
}
```

## 8.2 Get Analysis Status

GET

/ai/analyze/status/{task_id}

Response:

```json
{
  "status": "completed"
}
```

Status values:

- pending
- processing
- completed
- failed

## 8.3 Get Analysis Result

GET

/ai/result/{project_id}

Response:

```json
{
  "area": {
    "total": 25,
    "green": 5,
    "concrete": 20
  },
  "objects": [
    {
      "name": "tree",
      "confidence": 0.94
    }
  ],
  "heat_level": "high"
}
```

---

# 9. Area Measurement API

## 9.1 Manual Measurement

POST

/measurement/manual

Purpose:

คำนวณพื้นที่จากจุดที่ User เลือก

Request:

```json
{
  "points": [
    [100, 200],
    [500, 200],
    [500, 600],
    [100, 600]
  ]
}
```

Response:

```json
{
  "area": 20,
  "unit": "sqm"
}
```

## 9.2 AR Measurement (Future)

POST

/measurement/ar

Request:

```json
{
  "scan_data": "3d_model_url"
}
```

Response:

```json
{
  "width": 5,
  "length": 4,
  "area": 20
}
```

---

# 10. GeoHeat GIS API

## 10.1 Get Heat Data

GET

/geoheat/data

Parameters:

- lat
- lng
- date

Response:

```json
{
  "temperature": 39,
  "lst": 42,
  "ndvi": 0.18,
  "risk": "high"
}
```

## 10.2 Heat Map Layer

GET

/geoheat/map

Response:

```json
{
  "tiles": "map_url"
}
```

---

# 11. Garden Recommendation API

## 11.1 Generate Recommendation

POST

/garden/recommend

Purpose:

AI แนะนำสวน

Request:

```json
{
  "project_id": "uuid",
  "area": 20,
  "budget": 5000,
  "style": "modern"
}
```

Processing:

Area Data + Weather + Plant Database + AI Model

Response:

```json
{
  "garden_type": "Tropical",
  "plants": [
    {
      "name": "หมากเหลือง",
      "quantity": 3
    }
  ],
  "cost": 4500,
  "cooling": "high"
}
```

## 11.2 Get Plant Recommendation

GET

/plants/recommend

Parameters:

- sun
- area
- maintenance

Response:

```json
[
  {
    "name": "Snake Plant",
    "score": 90
  }
]
```

---

# 12. Garden Simulation API

## 12.1 Generate Before/After

POST

/simulation/generate

Request:

```json
{
  "project_id": "uuid",
  "garden_style": "tropical",
  "plants": ["tree", "grass"]
}
```

Process:

Original Image + Design Prompt + AI Image Model

Response:

```json
{
  "before": "image_url",
  "after": "generated_image_url"
}
```

---

# 13. Green Score API

## 13.1 Calculate Score

POST

/green-score/calculate

Request:

```json
{
  "project_id": "uuid"
}
```

Response:

```json
{
  "score": 82,
  "detail": {
    "green": 90,
    "shade": 75,
    "cooling": 80
  }
}
```

---

# 14. History API

## 14.1 Get User History

GET

/history

Response:

```json
[
  {
    "project": "หลังบ้าน",
    "date": "2026-07-30",
    "score": 82
  }
]
```

---

# 15. AI Assistant API

## 15.1 Chat

POST

/assistant/chat

Request:

```json
{
  "message": "พื้นที่นี้ควรปลูกอะไร",
  "project_id": "uuid"
}
```

Response:

```json
{
  "answer": "พื้นที่นี้เหมาะกับไม้ทนแดด"
}
```

---

# 16. Admin API

## Dashboard Statistics

GET

/admin/statistics

Response:

```json
{
  "users": 500,
  "projects": 1200,
  "green_area_added": 3500
}
```

---

# 17. File Processing API

## Export Report

GET

/export/{project_id}

Generate:

- PDF Report
- Analysis Summary
- Garden Plan

---

# 18. Error Codes

- `AUTH_001` — Invalid Token
- `IMAGE_001` — Invalid Image
- `AI_001` — AI Processing Failed
- `GIS_001` — Location Not Found
- `DB_001` — Database Error

---

# 19. API Security

Implement:

Authentication:

JWT

Authorization:

Role Based Access Control

Validation:

Pydantic Schema

Rate Limit:

Prevent abuse

---

# 20. API Development Priority

## Phase 1

Implement:

- Auth
- Project
- Upload Image
- Analysis Mock API

## Phase 2

Implement:

- Recommendation API
- Green Score
- History

## Phase 3

Implement:

- Real AI Model
- AR Measurement
- Simulation AI

---

# END DOCUMENT
