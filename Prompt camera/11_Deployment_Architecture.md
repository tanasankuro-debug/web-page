# 11_Deployment_Architecture.md

# GeoHeat AI Green Designer

## Deployment Architecture

Version: **1.0**

Target Environment: **Production**

---

# 1. Deployment Goals

GeoHeat AI Green Designer ต้องสามารถ Deploy ได้ในระดับ Production โดยรองรับ

* High Availability
* Scalability
* Security
* Low Latency
* Monitoring
* Automatic Backup
* Continuous Deployment

Deployment ต้องรองรับผู้ใช้งานพร้อมกันหลายร้อยถึงหลายพันคนในอนาคต

---

# 2. System Architecture

```text
                    Internet
                        │
                Cloudflare CDN
                        │
          ┌─────────────┴─────────────┐
          │                           │
     Vercel Frontend             API Domain
                                     │
                                FastAPI Backend
                                     │
                  ┌──────────────────┴──────────────────┐
                  │                                     │
             Supabase PostgreSQL                 AI Worker
                  │                                     │
         Storage / Auth / Realtime         YOLO • SAM2 • Depth AI
```

---

# 3. Infrastructure Stack

## Frontend

Platform

* Vercel

Technology

* Next.js 15
* TypeScript
* Tailwind CSS
* shadcn/ui

---

## Backend

Platform

* Railway
* Fly.io
* Render
* Docker VPS (Alternative)

Technology

* FastAPI
* Uvicorn
* Python 3.12

---

## Database

Platform

Supabase PostgreSQL

Extensions

* PostGIS
* pgvector (Future)

---

## Storage

Supabase Storage

Buckets

* uploads
* processed-images
* ai-results
* reports
* exports

---

## Authentication

Supabase Auth

รองรับ

* Email
* Google
* Magic Link (Future)

---

# 4. Domain Structure

Frontend

```text
https://geoheat.ai
```

API

```text
https://api.geoheat.ai
```

Documentation

```text
https://docs.geoheat.ai
```

---

# 5. Environment Variables

Frontend

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_MAPBOX_TOKEN
NEXT_PUBLIC_API_URL
```

Backend

```text
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
JWT_SECRET
MAPBOX_SECRET
OPENAI_API_KEY
REDIS_URL
```

ห้าม Commit ไฟล์ `.env`

---

# 6. CI/CD Pipeline

GitHub Push

↓

GitHub Actions

↓

Type Check

↓

Lint

↓

Unit Test

↓

Build

↓

Deploy Preview

↓

Production Approval

↓

Production Deploy

---

# 7. Monitoring

Tools

* Sentry
* Better Stack
* UptimeRobot

Monitor

* API Response Time
* Error Rate
* CPU
* RAM
* Storage
* Database
* AI Queue

---

# 8. Logging

Frontend

* Console Error → Sentry

Backend

* Structured JSON Logs
* Request Logs
* Error Logs
* AI Processing Logs

Retention

90 Days

---

# 9. Performance Targets

Frontend

* First Contentful Paint < 1.8 s
* Largest Contentful Paint < 2.5 s
* Time to Interactive < 3 s

Backend

* API Response < 300 ms
* AI Queue เริ่มประมวลผล < 1 s

---

# 10. Security

รองรับ

* HTTPS
* TLS 1.3
* HSTS
* CSP
* Rate Limiting
* JWT Validation
* Row Level Security
* Signed URLs
* CORS Policy

---

# 11. Backup Strategy

Database

* Daily Backup
* Point-in-Time Recovery

Storage

* Weekly Snapshot

Configuration

* Git Repository
* Infrastructure as Code (Future)

---

# 12. Scaling Strategy

Frontend

* Vercel Edge Network

Backend

* Horizontal Scaling

Database

* Read Replica (Future)

AI Worker

* Queue-based Processing
* Auto Scaling

---

# 13. Disaster Recovery

Recovery Targets

* RPO ≤ 24 ชั่วโมง
* RTO ≤ 2 ชั่วโมง

Procedure

* Restore Database
* Restore Storage
* Redeploy Services
* Verify Health Checks

---

# 14. Health Checks

Endpoints

```text
GET /health
GET /ready
GET /live
```

ตรวจสอบ

* Database
* Storage
* AI Service
* External APIs

---

# 15. Release Strategy

Environment

* Development
* Staging
* Production

Deployment

Blue-Green Deployment (Future)

Rollback

One-click Rollback ผ่านแพลตฟอร์มที่รองรับ

---

# 16. Cost Planning

Production ควรเริ่มจาก

* Vercel Pro
* Supabase Pro
* Railway / Fly.io
* Cloudflare

รองรับการขยายเมื่อจำนวนผู้ใช้เพิ่มขึ้น โดยไม่ต้องเปลี่ยนสถาปัตยกรรมหลัก

---

# 17. Definition of Done

Deployment Architecture ถือว่าเสร็จสมบูรณ์เมื่อ

* Deploy Frontend ได้
* Deploy Backend ได้
* Database เชื่อมต่อได้
* Storage ทำงานได้
* Authentication ทำงานได้
* Monitoring พร้อมใช้งาน
* Backup และ Recovery พร้อม
* รองรับ Production และการขยายระบบในอนาคต

---

# END OF 11_Deployment_Architecture.md
