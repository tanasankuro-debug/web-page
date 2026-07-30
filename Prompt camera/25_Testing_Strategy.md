# 25_Testing_Strategy.md

# GeoHeat AI Green Designer

## Testing Strategy Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดแผนการทดสอบระบบ GeoHeat AI Green Designer เพื่อประเมิน

* ความถูกต้องของระบบ
* ประสิทธิภาพของ AI
* ความเสถียรของ Web Application
* ประสบการณ์ผู้ใช้งาน
* ความพร้อมสำหรับการใช้งานจริง

---

# 2. Testing Objectives

เป้าหมายของการทดสอบ

1. ตรวจสอบว่า Feature ทำงานตาม Requirement
2. ตรวจสอบว่า AI ให้ผลลัพธ์ที่เหมาะสม
3. ตรวจสอบความแม่นยำของการวิเคราะห์ภาพ
4. ตรวจสอบความเร็วของระบบ
5. ตรวจสอบความง่ายต่อการใช้งาน
6. ตรวจสอบความปลอดภัยของข้อมูล

---

# 3. Testing Strategy Overview

ระบบแบ่งการทดสอบเป็น 7 ส่วน

```text
Testing

│

├── Functional Testing

├── AI Model Testing

├── Integration Testing

├── Performance Testing

├── Security Testing

├── Usability Testing

└── User Acceptance Testing
```

---

# 4. Functional Testing

## Purpose

ตรวจสอบ Feature หลักของระบบ

---

# 4.1 Authentication Testing

## Test Case

| Test                       | Expected Result      |
| -------------------------- | -------------------- |
| Register ด้วยข้อมูลถูกต้อง | สร้าง Account สำเร็จ |
| Login ถูกต้อง              | เข้าสู่ระบบได้       |
| Password ผิด               | แจ้ง Error           |
| Logout                     | ออกจากระบบ           |

---

# 4.2 Project Management Testing

Test

* สร้าง Project
* แก้ไข Project
* ลบ Project
* เปิดดูรายละเอียด

Expected

ข้อมูลถูกบันทึกและแสดงถูกต้อง

---

# 4.3 Image Upload Testing

Test

รองรับ

* JPG
* PNG
* WEBP

ตรวจสอบ

* File Size
* Resolution
* Invalid File

Expected

ระบบแจ้งเตือนเมื่อไม่ผ่าน

---

# 4.4 AI Analysis Flow Testing

Flow

```text
Upload Image

↓

Analysis

↓

Result

↓

Recommendation
```

Expected

ทุกขั้นตอนทำงานต่อเนื่อง

---

# 5. AI Model Testing

## Purpose

ตรวจสอบคุณภาพของ AI

---

# 5.1 Computer Vision Accuracy Test

Dataset

แบ่งภาพทดสอบ

| Category   | จำนวน |
| ---------- | ----- |
| สวน        | 20    |
| พื้นปูน    | 20    |
| ระเบียง    | 20    |
| หลังบ้าน   | 20    |
| พื้นที่ผสม | 20    |

Total

100 Images

---

# Evaluation

วัด

## Detection Accuracy

Formula

```
Accuracy = Correct Detection / Total Detection
```

Target

> 85%

---

# 5.2 Segmentation Testing

ตรวจสอบ

* Green Area
* Concrete Area
* Empty Area

Metric

## IoU (Intersection over Union)

Target

> 0.75

---

# 5.3 Area Estimation Testing

ทดสอบพื้นที่จริง

Example

พื้นที่จริง:

20 ตารางเมตร

AI Estimate:

19.2 ตารางเมตร

Error

```text
|Actual - AI| / Actual × 100
```

Target

Error <15%

---

# 5.4 Recommendation Testing

ตรวจสอบ

AI แนะนำต้นไม้เหมาะสมหรือไม่

Evaluation

คะแนนจากผู้เชี่ยวชาญ

Scale

1-5

Target

Average ≥4

---

# 6. Integration Testing

## Purpose

ตรวจสอบการเชื่อมต่อระหว่างระบบ

---

# Test Flow

```text
Frontend

↓

API

↓

Backend

↓

Database

↓

AI Service

↓

Response
```

---

# Components Tested

* Next.js
* FastAPI
* Supabase
* AI Service
* Storage

---

# 7. API Testing

Tool

* Postman
* Swagger UI
* Pytest

---

Test

## Success Case

Request ถูกต้อง

Expected

200 OK

---

## Error Case

Request ผิด

Expected

400 / 401 / 500

---

# 8. Performance Testing

## Purpose

วัดความเร็วระบบ

---

# 8.1 Frontend Performance

Metrics

* First Load
* Page Response
* Image Loading

Target

```text
Initial Load <3 seconds
```

---

# 8.2 API Performance

Target

| API            | Response |
| -------------- | -------- |
| Authentication | <500ms   |
| Project API    | <500ms   |
| Image Upload   | <5s      |
| Normal Query   | <1s      |

---

# 8.3 AI Processing Performance

Target

| Process           | Time |
| ----------------- | ---- |
| Image Detection   | <5s  |
| Recommendation    | <3s  |
| Report Generation | <30s |
| Image Generation  | <60s |

---

# 9. Stress Testing

Purpose

ทดสอบเมื่อมีผู้ใช้จำนวนมาก

Scenario

```text
100 Users

↓

Upload Images

↓

Run Analysis
```

ตรวจสอบ

* Server Stability
* Database Performance
* API Failure

---

# 10. Security Testing

## Purpose

ป้องกันข้อมูลผู้ใช้

---

# 10.1 Authentication Security

ตรวจสอบ

* JWT Validation
* Token Expiration
* Unauthorized Access

---

# 10.2 Database Security

ตรวจสอบ

* Row Level Security
* User Data Isolation

---

# 10.3 File Security

ตรวจสอบ

* File Type
* File Size
* Malicious Upload

---

# 10.4 API Security

ตรวจสอบ

* Rate Limit
* Input Validation
* SQL Injection Prevention

---

# 11. Usability Testing

## Purpose

วัดความง่ายในการใช้งาน

---

# Participants

Target

20-30 Users

แบ่งเป็น

* นักเรียน
* บุคคลทั่วไป
* ผู้สนใจด้านสิ่งแวดล้อม

---

# Tasks

ให้ผู้ใช้ทำ

1. สมัครสมาชิก
2. สร้าง Project
3. Upload ภาพ
4. วิเคราะห์พื้นที่
5. เลือกแบบสวน
6. ดู Report

---

# Measurement

ใช้แบบสอบถาม Likert Scale

ระดับ

1 = น้อยที่สุด

5 = มากที่สุด

---

# Evaluation Topics

## Ease of Use

"ระบบใช้งานง่าย"

## Understanding

"ผลลัพธ์เข้าใจง่าย"

## Design

"หน้าตาระบบเหมาะสม"

## Satisfaction

"พึงพอใจต่อระบบ"

---

# 12. User Acceptance Testing (UAT)

## Purpose

ตรวจสอบว่าระบบตอบโจทย์ผู้ใช้งานจริง

---

# UAT Scenario

| Scenario         | Result       |
| ---------------- | ------------ |
| วิเคราะห์พื้นที่ | ผ่าน/ไม่ผ่าน |
| รับคำแนะนำสวน    | ผ่าน/ไม่ผ่าน |
| ดู Heat Map      | ผ่าน/ไม่ผ่าน |
| สร้าง Report     | ผ่าน/ไม่ผ่าน |

---

# Acceptance Criteria

ระบบผ่านเมื่อ

✓ Feature หลักทำงานครบ

✓ ไม่มี Critical Bug

✓ ผู้ใช้พึงพอใจ ≥80%

✓ AI Recommendation ได้คะแนน ≥4/5

---

# 13. AI Explainability Testing

ตรวจสอบว่า AI

ไม่เพียงแค่ตอบ

แต่ต้องอธิบายได้

Example

ไม่ควร:

```text
แนะนำต้นโมก
```

ควร:

```text
แนะนำต้นโมกเนื่องจากพื้นที่
มีแดดมากและต้องการต้นไม้
ที่ทนความร้อนและดูแลง่าย
```

---

# 14. Mobile Testing

ทดสอบ

Devices

* Smartphone
* Tablet
* Desktop

Browser

* Chrome
* Safari
* Edge

---

# 15. Regression Testing

ทุกครั้งที่เพิ่ม Feature

ต้องตรวจสอบ

* Feature เดิม
* API เดิม
* Database เดิม

---

# 16. Bug Severity Classification

## Critical

ระบบใช้งานไม่ได้

ตัวอย่าง

* Login ไม่ได้
* Database Error

---

## High

Feature สำคัญเสีย

ตัวอย่าง

* AI วิเคราะห์ไม่ได้

---

## Medium

Feature รองเสีย

---

## Low

UI Minor Issue

---

# 17. Testing Tools

## Frontend

* React Testing Library
* Playwright

## Backend

* Pytest

## API

* Postman

## Performance

* Lighthouse
* k6

## Security

* OWASP Testing Guide

---

# 18. Testing Timeline

## Phase 1

Basic Testing

* UI
* API
* Database

---

## Phase 2

AI Testing

* Vision
* Recommendation

---

## Phase 3

User Testing

* Survey
* Feedback

---

## Phase 4

Final Validation

* Demo Test
* Deployment Test

---

# 19. Final Quality Checklist

ก่อน Release ต้องผ่าน

## Function

✓ ทุก Feature ทำงาน

## AI

✓ ผลลัพธ์สมเหตุสมผล

## Performance

✓ โหลดเร็ว

## Security

✓ ข้อมูลปลอดภัย

## UX

✓ ใช้งานง่าย

## Deployment

✓ เปิดใช้งานจริงได้

---

# 20. Definition of Done

ระบบ GeoHeat AI ถือว่าพร้อมใช้งานเมื่อ

✓ ผ่าน Functional Test

✓ ผ่าน AI Accuracy Test

✓ ผ่าน Performance Test

✓ ผ่าน Security Test

✓ ผ่าน User Acceptance Test

✓ พร้อม Demo และ Deploy

---

# END OF 25_Testing_Strategy.md
