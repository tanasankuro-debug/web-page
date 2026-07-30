# 21_API_Integration_Flow.md

# GeoHeat AI Green Designer

## API Integration Flow Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดการเชื่อมต่อ API ระหว่างส่วนต่าง ๆ ของระบบ GeoHeat AI Green Designer

เพื่อให้ระบบสามารถทำงานร่วมกันระหว่าง

* Frontend Application
* Backend API
* Authentication System
* Database
* File Storage
* AI Processing Service
* GIS Service

---

# 2. System Communication Architecture

```text
User

↓

Next.js Frontend

↓

FastAPI Backend

↓

--------------------------------

Authentication Service

Database

Storage

AI Engine

GIS Engine

--------------------------------

↓

Response

↓

Frontend Display
```

---

# 3. API Architecture

Base URL

Development:

```text
http://localhost:8000/api/v1
```

Production:

```text
https://api.geoheat-ai.com/api/v1
```

---

# 4. API Authentication

ใช้

* Supabase Authentication
* JWT Token

Flow

```text
User Login

↓

Supabase Auth

↓

Receive JWT Token

↓

Frontend Store Token

↓

Send Token With API Request
```

---

Header

```http
Authorization: Bearer {access_token}
```

---

# 5. API Module Structure

```text
/api/v1


/auth

/users

/projects

/images

/analysis

/recommendation

/garden

/reports

/gis

/ai
```

---

# 6. Authentication API

---

# 6.1 Register User

Endpoint

```http
POST /auth/register
```

Request

```json
{
"name":"User Name",
"email":"user@email.com",
"password":"password"
}
```

Response

```json
{
"success":true,
"user_id":"123"
}
```

---

# 6.2 Login

Endpoint

```http
POST /auth/login
```

Response

```json
{
"access_token":"JWT_TOKEN",
"user":{
"id":"123",
"name":"User"
}
}
```

---

# 7. Project API

ใช้จัดการพื้นที่ของผู้ใช้

---

# 7.1 Create Project

```http
POST /projects
```

Request

```json
{
"name":"สวนหลังบ้าน",
"area_type":"backyard",
"location":{
"lat":16.432,
"lng":102.823
}
}
```

Response

```json
{
"project_id":"P001",
"status":"created"
}
```

---

# 7.2 Get User Projects

```http
GET /projects
```

Response

```json
[
{
"id":"P001",
"name":"สวนหลังบ้าน",
"score":78
}
]
```

---

# 7.3 Get Project Detail

```http
GET /projects/{id}
```

Return

* Images
* Analysis
* Recommendation
* Design
* Reports

---

# 8. Image Upload API

---

# 8.1 Upload Image

Endpoint

```http
POST /images/upload
```

Type:

multipart/form-data

Input

```
image:
project_id:
```

---

Process

```text
Frontend

↓

Upload Image

↓

Storage

↓

Save URL Database

↓

Return Image ID
```

Response

```json
{
"image_id":"IMG001",
"url":"storage/image.jpg"
}
```

---

# 9. AI Image Analysis API

---

# 9.1 Start Analysis

Endpoint

```http
POST /analysis/start
```

Request

```json
{
"image_id":"IMG001"
}
```

---

Process

```text
Image

↓

YOLO Detection

↓

SAM Segmentation

↓

Area Calculation

↓

Heat Analysis

↓

Save Result
```

---

Response

```json
{
"analysis_id":"A001",
"status":"processing"
}
```

---

# 9.2 Get Analysis Result

Endpoint

```http
GET /analysis/{id}
```

Response

```json
{
"green_percentage":35,

"heat_risk":"High",

"objects":[
"tree",
"concrete"
]
}
```

---

# 10. Green Score API

Endpoint

```http
GET /analysis/{id}/green-score
```

Response

```json
{
"score":78,

"grade":"B",

"factors":
{
"vegetation":70,
"shade":60,
"heat_reduction":80
}
}
```

---

# 11. Plant Recommendation API

---

# 11.1 Request Recommendation

Endpoint

```http
POST /recommendation/plants
```

Request

```json
{
"project_id":"P001",

"conditions":
{
"area":20,
"sun":"high",
"heat":"high"
}
}
```

---

Process

```text
Project Data

+

Plant Database

+

AI Reasoning

↓

Plant Ranking
```

---

Response

```json
{
"plants":[

{
"name":"ต้นแก้ว",
"score":92,
"reason":"ทนแดดและดูแลง่าย"
},

{
"name":"ต้นโมก",
"score":88
}

]
}
```

---

# 12. Garden Design API

---

# 12.1 Generate Garden Concept

Endpoint

```http
POST /garden/design
```

Request

```json
{
"project_id":"P001",

"style":"tropical",

"budget":"medium",

"maintenance":"low"
}
```

---

Process

```text
Analysis Data

+

User Preference

+

Plant Database

↓

Garden AI

↓

Layout
```

---

Response

```json
{
"design_id":"G001",

"style":"Tropical Garden",

"layout":
[
"Tree Zone",
"Relax Zone"
]
}
```

---

# 13. AI Image Generation API

---

Endpoint

```http
POST /garden/generate-image
```

Request

```json
{
"design_id":"G001",

"image_id":"IMG001"
}
```

---

Process

```text
Original Image

+

Garden Prompt

↓

Image Generation AI

↓

Save Result
```

---

Response

```json
{
"image_url":
"after-design.png"
}
```

---

# 14. Report API

---

# 14.1 Generate Report

Endpoint

```http
POST /reports/generate
```

Request

```json
{
"project_id":"P001"
}
```

---

Process

```text
Project Data

↓

AI Report Generator

↓

PDF Creation

↓

Storage
```

---

Response

```json
{
"report_url":"report.pdf"
}
```

---

# 15. GIS API

---

# 15.1 Get Heat Map

Endpoint

```http
GET /gis/heat-map
```

Response

```json
{
"layers":[

{
"type":"heat",
"url":"tile-url"
}

]
}
```

---

# 15.2 Get Nearby Cooling Area

Endpoint

```http
GET /gis/cooling-area
```

Input

```
latitude
longitude
```

Return

* Parks
* Green Spaces
* Hospitals

---

# 16. AI Processing Status API

สำหรับงานที่ใช้เวลานาน

Endpoint

```http
GET /tasks/{task_id}
```

Response

```json
{
"status":"processing",

"progress":65
}
```

Status

```text
waiting

processing

completed

failed
```

---

# 17. Real-time Update System

ใช้

Supabase Realtime

Example

```text
AI Started

↓

Frontend Receive Event

↓

Update Progress Bar

↓

Show Result
```

---

# 18. Error Response Standard

ทุก API ใช้รูปแบบเดียวกัน

```json
{
"success":false,

"error":{
"code":"IMAGE_INVALID",

"message":
"Image quality is too low"
}
}
```

---

# 19. API Security

ทุก API ต้องมี

* JWT Authentication
* Rate Limit
* Input Validation
* File Validation
* Permission Check

---

# 20. API Performance Rules

Target

| API              | Response |
| ---------------- | -------- |
| User API         | <300ms   |
| Project API      | <500ms   |
| Upload           | <5s      |
| Analysis Request | <1s      |
| AI Result        | Async    |

---

# 21. Complete API Flow Example

Scenario:

User ออกแบบสวน

```text
User

↓

Create Project API

↓

Upload Image API

↓

Start Analysis API

↓

AI Processing

↓

Get Result API

↓

Plant Recommendation API

↓

Garden Design API

↓

Generate Image API

↓

Generate Report API

↓

Dashboard Update
```

---

# 22. Future API Expansion

เพิ่มในอนาคต

## AR API

```text
/ar/preview
```

## Weather API

```text
/weather/current
```

## Carbon Calculation API

```text
/environment/carbon
```

## Community API

```text
/community/share
```

---

# 23. Definition of Done

API Integration Flow สมบูรณ์เมื่อ

✓ ทุก Feature มี API

✓ Frontend เชื่อม Backend ได้

✓ AI Pipeline เชื่อมได้

✓ Database Integration พร้อม

✓ Error Handling ชัดเจน

✓ Security พร้อม

✓ รองรับ Production

---

# END OF 21_API_Integration_Flow.md
