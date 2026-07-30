# 26_Deployment_Architecture.md

# GeoHeat AI Green Designer

## Deployment Architecture Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดสถาปัตยกรรมการ Deploy ระบบ GeoHeat AI Green Designer เพื่อให้สามารถใช้งานจริงบน Internet ได้

ครอบคลุม

* Frontend Deployment
* Backend Deployment
* Database Deployment
* AI Service Deployment
* Storage
* Domain
* Environment Configuration
* CI/CD
* Monitoring

---

# 2. Production Architecture Overview

```text
                         User

                          |

                          ↓


                  Web Browser

                          |

                          ↓


              Next.js Frontend

                  (Vercel)

                          |

                          ↓


              FastAPI Backend

             (Cloud Server)

                          |

        --------------------------------

        |              |              |

        ↓              ↓              ↓


   Supabase       AI Service       Storage

 PostgreSQL       Models          Images/PDF


```

---

# 3. Deployment Stack Selection

## Frontend

ใช้:

## Vercel

เหตุผล

* รองรับ Next.js โดยตรง
* Deploy อัตโนมัติ
* CDN เร็ว
* SSL ฟรี
* Setup ง่าย

---

## Backend

ใช้:

## Cloud Server / Container

ตัวเลือก

### MVP

* Render
* Railway
* Fly.io

### Production

* AWS EC2
* Google Cloud Run
* Azure

---

## Database

ใช้:

## Supabase PostgreSQL

เหตุผล

* PostgreSQL มาตรฐาน
* Authentication พร้อม
* Storage พร้อม
* Realtime พร้อม
* มี Dashboard จัดการง่าย

---

## AI Service

แบ่งเป็น 2 แบบ

## Lightweight AI

เช่น

* Recommendation
* LLM

Deploy บน Backend

---

## Heavy AI

เช่น

* YOLO
* SAM2
* Image Generation

Deploy แยก

```text
AI Server

GPU Support

Model Hosting
```

---

# 4. Production Environment

แบ่งเป็น 3 Environment

```text
Development

↓

Staging

↓

Production
```

---

# 5. Development Environment

ใช้สำหรับ Coding

ประกอบด้วย

Frontend

```text
localhost:3000
```

Backend

```text
localhost:8000
```

Database

Supabase Development Project

---

# 6. Staging Environment

ใช้ทดสอบก่อนขึ้นจริง

ตัวอย่าง

Frontend

```text
staging.geoheat-ai.com
```

Backend

```text
api-staging.geoheat-ai.com
```

---

# 7. Production Environment

ระบบใช้งานจริง

Domain

```text
geoheat-ai.com
```

API

```text
api.geoheat-ai.com
```

---

# 8. Frontend Deployment

## Platform

Vercel

---

# Deployment Flow

```text
Developer

↓

GitHub Repository

↓

Vercel Build

↓

Deploy

↓

Production Website

```

---

# 9. Frontend Build Configuration

Environment Variables

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_KEY=

NEXT_PUBLIC_MAPBOX_TOKEN=
```

---

# 10. Backend Deployment

## Container Architecture

ใช้ Docker

Structure

```text
Backend Container


FastAPI

+

Python Runtime

+

AI Libraries

+

Dependencies

```

---

# 11. Docker Architecture

Dockerfile

```dockerfile
FROM python:3.12

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY .

CMD uvicorn app.main:app
```

---

# 12. Backend Environment Variables

```env
DATABASE_URL=

SUPABASE_URL=

SUPABASE_KEY=

JWT_SECRET=

OPENAI_API_KEY=

AI_MODEL_PATH=

STORAGE_BUCKET=
```

---

# 13. Database Deployment

Platform:

Supabase

---

Database Structure

```text
Supabase


├── PostgreSQL

├── Authentication

├── Storage

├── Realtime

└── Row Level Security

```

---

# 14. Storage Architecture

ใช้ Supabase Storage

Bucket

```text
geoheat-storage


├── user-images

├── generated-images

└── reports

```

---

# 15. AI Deployment Architecture

## MVP

```text
FastAPI Backend

        |

        ↓

AI Service

        |

        ↓

External AI API

```

ใช้สำหรับ

* LLM
* Image Generation

---

# Advanced Version

```text
FastAPI

↓

AI Worker

↓

GPU Server

↓

YOLO / SAM2

```

---

# 16. Background Worker Deployment

สำหรับงานหนัก

เช่น

* วิเคราะห์ภาพ
* Generate Image
* Generate Report

Architecture

```text
User

↓

API

↓

Task Queue

↓

Worker

↓

Database

↓

Notification

```

---

# 17. CI/CD Pipeline

ใช้

GitHub Actions

Flow

```text
Code Push

↓

Run Test

↓

Build

↓

Deploy

↓

Health Check

```

---

# 18. Git Repository Structure

```text
geoheat-ai/


├── frontend/

│

├── backend/

│

├── ai-models/

│

├── database/

│

├── docs/

│

└── .github/

    └── workflows/

```

---

# 19. Deployment Workflow

Developer

```text
Write Code

↓

Git Commit

↓

Push GitHub

↓

CI Test

↓

Build

↓

Deploy

↓

Monitor

```

---

# 20. Monitoring System

ตรวจสอบ

## Application

* Error Rate
* Response Time
* API Status

---

## AI

* Processing Time
* Failed Requests
* Model Accuracy

---

## Database

* Connection
* Query Performance
* Storage Usage

---

# 21. Logging Architecture

เก็บ

```text
Logs


├── API Logs

├── AI Logs

├── Error Logs

└── User Activity Logs

```

---

# 22. Backup Strategy

## Database

Backup

* Daily Backup
* Point Recovery

---

## Images

Backup

* Storage Replication

---

# 23. Security Deployment

ต้องมี

## HTTPS

ทุก Connection

---

## Environment Security

ห้าม Commit

```text
.env
API Keys
Secrets
```

---

## Access Control

ใช้

* JWT
* RLS
* Role Permission

---

# 24. Scaling Strategy

## Level 1

Small Users

```text
Single Backend

Supabase

Vercel

```

---

## Level 2

More Users

เพิ่ม

* Multiple Backend Instance
* Load Balancer
* AI Queue

---

## Level 3

Large Scale

เพิ่ม

* Kubernetes
* GPU Cluster
* Distributed AI

---

# 25. Cost Optimization

แนวทาง

## ใช้ Free Tier สำหรับ MVP

* Vercel
* Supabase
* Cloud Hosting

---

## ลด AI Cost

* Cache Result
* ใช้ Model เล็กก่อน
* วิเคราะห์เฉพาะเมื่อจำเป็น

---

# 26. Disaster Recovery Plan

กรณีระบบล่ม

ขั้นตอน

```text
Detect Error

↓

Restore Service

↓

Recover Database

↓

Verify System

```

---

# 27. Production Checklist

ก่อน Deploy จริง

## Frontend

✓ Build สำเร็จ

✓ Responsive

✓ HTTPS

## Backend

✓ API ทำงาน

✓ Security ผ่าน

## Database

✓ Backup

✓ RLS เปิดใช้งาน

## AI

✓ Model พร้อม

✓ API Key ถูกต้อง

---

# 28. Deployment Roadmap

## Phase 1 MVP

Deploy

* Vercel
* Supabase
* Backend Cloud

---

## Phase 2

เพิ่ม

* AI Worker
* Queue System

---

## Phase 3

เพิ่ม

* GPU AI Server
* Advanced GIS
* AR System

---

# 29. Definition of Done

Deployment Architecture สมบูรณ์เมื่อ

✓ ระบบ Online ได้

✓ Frontend เชื่อม Backend

✓ Database พร้อม

✓ AI Service ทำงาน

✓ Security พร้อม

✓ Monitoring พร้อม

✓ สามารถ Scale ได้

---

# END OF 26_Deployment_Architecture.md
