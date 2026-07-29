# System Architecture Specification

# Project

GeoHeat AI Green Designer

Version: 1.0

---

# 1. System Overview

## Architecture Goal

สร้าง Web Application ที่สามารถ:

- วิเคราะห์พื้นที่จากภาพถ่าย
- ประเมินพื้นที่ว่าง
- วิเคราะห์สภาพความร้อน
- แนะนำการออกแบบพื้นที่สีเขียว
- จำลองผลลัพธ์ก่อนและหลังปรับปรุง

โดยใช้:

- Web Technology
- Artificial Intelligence
- Computer Vision
- GIS
- Cloud Infrastructure

---

# 2. High Level Architecture

```
                USER
                 |
          Web Application
                 |
    ----------------------------
    |                          |
Frontend                  Backend API
Next.js                    FastAPI
    |                          |
    |                  AI Processing
    |                          |
    |              -------------------
    |              |       |         |
    |            Vision   GIS    LLM AI
    |
                 |
          Database Layer
             Supabase
                 |
          External Services
```

---

# 3. Technology Stack

# Frontend

Framework:

Next.js 15

Language:

TypeScript

Styling:

Tailwind CSS

UI Component:

shadcn/ui

Animation:

Framer Motion

State Management:

Zustand

Data Fetching:

TanStack Query

Maps:

Mapbox GL JS

3D Visualization:

Three.js

AR Future:

WebXR

---

# Backend

Framework:

FastAPI

Language:

Python 3.12+

Purpose:

- API Management
- AI Processing
- Image Analysis
- Recommendation Engine
- Data Processing

Libraries:

FastAPI

Pydantic

OpenCV

NumPy

Pillow

GeoPandas

Shapely

---

# Database

Platform:

Supabase

Database:

PostgreSQL

Extensions:

PostGIS

Used for:

- Geographic Data
- User Data
- Project History
- Analysis Result

---

# Storage

Supabase Storage

Used for:

- User images
- Generated garden images
- AI analysis results

---

# Authentication

Supabase Authentication

Methods:

- Email Login
- Google Login

---

# 4. Application Layers

System consists of 6 layers

---

# Layer 1

# Presentation Layer

Responsibility:

User Interface

Contains:

- Dashboard
- Camera Interface
- Map
- Garden Simulator
- Reports

Technology:

Next.js

---

# Layer 2

# Application Layer

Responsibility:

Business Logic

Examples:

- User workflow
- Project management
- Recommendation logic

Technology:

FastAPI

---

# Layer 3

# AI Processing Layer

Responsibility:

Image understanding and generation

Components:

## Object Detection

Technology:

YOLOv11

Detect:

- Trees
- Concrete
- Grass
- Buildings

---

## Image Segmentation

Technology:

SAM 2

Purpose:

Separate image objects

Example:

Concrete area:

70%

Green area:

30%

---

## Depth Estimation

Technology:

Depth Anything V2

Purpose:

Estimate:

- Distance
- Depth
- Spatial relationship

---

# Layer 4

# GIS Intelligence Layer

Purpose:

Combine GeoHeat data

Sources:

- Temperature data
- Satellite imagery
- Location data

Technology:

PostGIS

Google Earth Engine

Mapbox

---

# Layer 5

# Recommendation Engine

Purpose:

Generate garden recommendations

Input:

Area Size

Temperature

Sun Exposure

Existing Plants

Budget

User Preference

Processing:

AI Model + Rule Based System

Output:

Garden Type

Plant Recommendation

Budget

Expected Cooling Effect

---

# Layer 6

# Data Layer

Database:

PostgreSQL

Storage:

Supabase Storage

---

# 5. Complete Data Flow

## User Analysis Flow

```
User
↓
Upload Image
↓
Frontend Compress Image
↓
Upload Storage
↓
Send Image URL
↓
FastAPI
↓
Computer Vision Model
↓
Object Detection
↓
Image Segmentation
↓
Area Calculation
↓
GIS Data Query
↓
Recommendation Engine
↓
Generate Result
↓
Save Database
↓
Display Result
```

---

# 6. AI Pipeline Architecture

## Input

Image

Example:

House Balcony

---

## Step 1

Image Preprocessing

Process:

- Resize
- Normalize
- Remove Noise

Tool:

OpenCV

---

## Step 2

Object Detection

YOLOv11

Output:

```json
{
  "objects": [
    {
      "type": "concrete",
      "confidence": 0.94
    },
    {
      "type": "tree",
      "confidence": 0.91
    }
  ]
}
```

## Step 3

Segmentation

SAM 2

Output:

Mask:

Concrete Area

Green Area

## Step 4

Area Estimation

Calculate:

Total Area

=

Detected Width

x

Detected Length

Output:

Total:

20 m²

Green:

4 m²

Available:

16 m²

## Step 5

Environmental Analysis

Query:

GeoHeat Database

Data:

Temperature

Heat Index

Vegetation

## Step 6

Recommendation

AI generates:

Garden Type

Plant List

Budget

Design

---

# 7. Database Architecture

## Main Tables

### users

Purpose:

Store user information

Fields:

id

email

name

created_at

### projects

Purpose:

Store garden projects

Fields:

id

user_id

project_name

location

created_at

### images

Purpose:

Store uploaded images

Fields:

id

project_id

image_url

type

### analysis_results

Purpose:

Store AI analysis

Fields:

id

project_id

area_size

green_percentage

heat_score

green_score

### garden_designs

Purpose:

Store recommendation

Fields:

id

project_id

style

plants

estimated_cost

cooling_effect

### geoheat_data

Purpose:

Store environmental data

Fields:

id

location

temperature

lst

ndvi

---

# 8. API Architecture

Base URL:

/api/v1

### Authentication API

POST

/auth/login

### Project API

GET

/projects

POST

/projects/create

### Image API

POST

/images/upload

### AI Analysis API

POST

/analysis/start

Response:

```json
{
  "area": 25,
  "green": 20,
  "heat": "high"
}
```

### Recommendation API

POST

/garden/recommend

### Simulation API

POST

/garden/generate

---

# 9. Folder Architecture

```
geoheat-ai/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── services/
│   └── styles/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── ai/
│   │   ├── gis/
│   │   └── utils/
│
├── database/
│
├── docs/
```

---

# 10. Current MVP Architecture

เนื่องจาก AI Model จริงมีความซับซ้อน

MVP จะใช้ Hybrid System

Implemented:

Frontend:

Complete

Backend:

Complete

Database:

Complete

AI:

Mock + API Ready

Example:

Instead of:

YOLO Model

ใช้:

Mock Detection JSON

เพื่อให้ระบบทำงานได้

Future:

Replace Mock

ด้วย AI Model จริง

---

# 11. Future AR Architecture

AR Measurement

Technology:

WebXR

ARCore

ARKit

Flow:

```
Camera
↓
AR Tracking
↓
3D Space Mapping
↓
Measurement
↓
Area Calculation
```

---

# 12. Cloud Architecture

Production:

Frontend:

Vercel

Backend:

Railway / AWS

Database:

Supabase

AI Server:

GPU Cloud

Storage:

Supabase Storage

---

# 13. Scalability

System supports:

- More users
- More AI models
- More cities
- More GIS layers

---

# 14. Security Architecture

Implement:

- HTTPS
- JWT Authentication
- Row Level Security
- Image Permission
- API Rate Limit
- Input Validation

---

# 15. Performance Optimization

Frontend:

- Lazy Loading
- Image Optimization
- Code Splitting

Backend:

- Async Processing
- Queue System

AI:

- Model Cache
- Batch Processing

---

# 16. System Development Priority

## Phase 1

Core Web App

- UI
- Authentication
- Database
- Upload Image

## Phase 2

AI Integration

- Object Detection
- Segmentation
- Recommendation

## Phase 3

Advanced Simulation

- Image Generation
- AR Measurement

---

# END DOCUMENT
