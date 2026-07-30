# 13_Testing_QA.md

# GeoHeat AI Green Designer

## Testing & Quality Assurance Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดมาตรฐานการทดสอบระบบ GeoHeat AI Green Designer เพื่อให้มั่นใจว่าระบบ

* ทำงานถูกต้อง
* มีประสิทธิภาพ
* ปลอดภัย
* รองรับผู้ใช้งานจริง
* ให้ผลลัพธ์ AI ที่มีความแม่นยำ
* พร้อมใช้งานระดับ Production

---

# 2. Testing Strategy

ระบบแบ่งการทดสอบออกเป็น 7 ระดับ

```text
Unit Testing

↓

Component Testing

↓

Integration Testing

↓

AI Model Testing

↓

GIS Testing

↓

Performance Testing

↓

User Acceptance Testing
```

---

# 3. Testing Environment

## Development

Purpose

ทดสอบระหว่างพัฒนา

Environment

* Local Machine
* Mock Data
* Development Database

---

## Staging

Purpose

จำลอง Production

ใช้

* Real Database Structure
* Real API
* Test Account

---

## Production

Purpose

ตรวจสอบหลัง Deploy

Monitoring Only

---

# 4. Unit Testing

## Purpose

ทดสอบ Function และ Logic ขนาดเล็ก

Technology

Frontend

* Vitest

Backend

* Pytest

---

# 5. Frontend Unit Test

Test Areas

## Components

ทดสอบ

* Rendering
* Props
* State
* Event
* Error Handling

Example

```text
GreenScoreCard

Input:
score = 85

Expected:
Display Grade A
```

---

## Hooks

ทดสอบ

* useAuth()
* useCamera()
* useHeatAnalysis()

ตรวจสอบ

* Return Value
* Side Effect
* Error

---

## Utilities

ทดสอบ

* Calculation
* Formatter
* Validator

---

# 6. Backend Unit Test

Test Areas

* API Service
* Database Service
* AI Pipeline
* GIS Calculation
* Authentication

---

Example

```text
Calculate Green Score

Input:
Green Area = 70%

Expected:
Score >= 70
```

---

# 7. Component Testing

## Purpose

ทดสอบ UI Component จริง

Technology

React Testing Library

---

Test Components

* Button
* Form
* Modal
* Dashboard Card
* Chart
* Map Control
* AI Scanner

---

Test Cases

* Component แสดงถูกต้อง
* User Interaction ทำงาน
* Accessibility ผ่าน
* Responsive ถูกต้อง

---

# 8. Integration Testing

## Purpose

ทดสอบการทำงานร่วมกันของ Module

---

# 9. Authentication Testing

Test

* Register
* Login
* Logout
* Google OAuth
* Session Expiration
* Protected Route

Expected

ผู้ใช้ที่ไม่ได้ Login ไม่สามารถเข้าหน้าส่วนตัวได้

---

# 10. Database Testing

ตรวจสอบ

* CRUD Operation
* Relationship
* RLS Policy
* Permission

Test

User A

ไม่สามารถเข้าถึงข้อมูล

User B

---

# 11. API Testing

Technology

* Postman
* Pytest

---

Test

GET

POST

PATCH

DELETE

---

ตรวจสอบ

* Status Code
* Response Format
* Validation
* Error Message

---

# 12. AI Model Testing

## Purpose

ตรวจสอบความแม่นยำของ AI

---

# 13. Image Validation Testing

Test Input

* ภาพชัด
* ภาพเบลอ
* ภาพมืด
* ภาพผิดประเภท

Expected

AI สามารถแยกภาพที่ใช้ได้และไม่ได้

---

# 14. Object Detection Testing

Classes

* Tree
* Grass
* Concrete
* Building
* Water

Metrics

* Precision
* Recall
* mAP

Target

mAP ≥ 85%

---

# 15. Segmentation Testing

Metrics

* IoU
* Pixel Accuracy

Target

IoU ≥ 80%

---

# 16. Area Measurement Testing

เปรียบเทียบ

AI Calculation

vs

Manual Measurement

Tolerance

ผิดพลาดไม่เกิน 10%

---

# 17. Plant Recommendation Testing

ตรวจสอบ

Input

* พื้นที่
* อุณหภูมิ
* งบประมาณ
* แสง

Expected

ผลลัพธ์เหมาะสมกับเงื่อนไข

---

# 18. AI Explainability Testing

ตรวจสอบว่า AI สามารถอธิบายได้

ตัวอย่าง

"แนะนำต้นไม้ชนิดนี้เนื่องจากพื้นที่มีอุณหภูมิสูงและต้องการร่มเงา"

---

# 19. GIS Testing

## Map Testing

ตรวจสอบ

* Map Loading
* Zoom
* Layer Switching
* Marker
* Popup

---

# 20. Heat Map Testing

ตรวจสอบ

* Color Accuracy
* Data Matching
* Layer Rendering

---

# 21. Spatial Analysis Testing

ทดสอบ

* Distance Measurement
* Area Calculation
* Buffer Analysis
* Coordinate Accuracy

---

# 22. Performance Testing

## Purpose

วัดประสิทธิภาพระบบ

---

# 23. Frontend Performance

Metrics

* First Contentful Paint
* Largest Contentful Paint
* Total Blocking Time
* Cumulative Layout Shift

Target

Lighthouse Score

≥ 90

---

# 24. Backend Performance

Test

* API Response Time
* Concurrent Request
* Database Query

Target

Average Response

< 300ms

---

# 25. AI Performance Testing

Measure

* Processing Time
* Queue Time
* Failure Rate

Target

Complete AI Pipeline

≤ 10 seconds

---

# 26. Load Testing

Technology

* k6
* Apache JMeter

Test Scenario

100 Users

500 Users

1000 Users

ตรวจสอบ

* Response Time
* Error Rate
* Server Resource

---

# 27. Security Testing

ตรวจสอบ

## Authentication

* JWT
* Session
* Permission

---

## Input Security

* SQL Injection
* XSS
* File Upload Attack

---

## API Security

* Rate Limit
* Unauthorized Access
* Invalid Token

---

# 28. Mobile Testing

Devices

* iOS
* Android

Browser

* Chrome
* Safari
* Edge

ตรวจสอบ

* Camera Permission
* Upload
* Responsive
* Touch Interaction

---

# 29. Accessibility Testing

Standard

WCAG 2.2 AA

ตรวจสอบ

* Keyboard
* Screen Reader
* Contrast
* Focus
* ARIA

Tools

* Lighthouse
* Axe

---

# 30. User Acceptance Testing (UAT)

## Purpose

ตรวจสอบจากมุมมองผู้ใช้งานจริง

---

# Test Scenario 1

Create Project

Steps

1. Login
2. Create Project
3. Upload Image
4. Start AI Analysis

Expected

Project ถูกสร้างสำเร็จ

---

# Test Scenario 2

AI Garden Design

Steps

1. Select Area
2. Choose Style
3. Generate Garden

Expected

ได้รับแบบสวนพร้อมคำแนะนำ

---

# Test Scenario 3

GIS Analysis

Steps

1. Open Map
2. Enable Heat Layer
3. View Green Score

Expected

ข้อมูลแสดงถูกต้อง

---

# Test Scenario 4

Report Generation

Steps

1. Generate Report
2. Export PDF

Expected

ได้รับรายงานสมบูรณ์

---

# 31. Bug Classification

## Critical

ระบบใช้งานไม่ได้

ตัวอย่าง

* Login ไม่ได้
* Database Error

Priority

Fix Immediately

---

## High

Feature หลักผิดพลาด

ตัวอย่าง

* AI วิเคราะห์ไม่ได้

---

## Medium

Feature รองผิดพลาด

---

## Low

UI Issue

---

# 32. Bug Report Template

```text
Title:

Environment:

Steps:

Expected Result:

Actual Result:

Screenshot:

Severity:

Priority:
```

---

# 33. Regression Testing

ทุก Release ต้องทดสอบ

* Existing Features
* Database Migration
* API Compatibility
* AI Pipeline

---

# 34. Test Coverage Target

Frontend

≥ 90%

Backend

≥ 90%

Critical Feature

100%

---

# 35. Release Checklist

ก่อน Deploy Production

✓ Unit Test ผ่าน

✓ Integration Test ผ่าน

✓ AI Accuracy ผ่าน

✓ Security Test ผ่าน

✓ Performance Test ผ่าน

✓ UAT ผ่าน

✓ Documentation Update

---

# 36. Definition of Done

Testing & QA ถือว่าเสร็จสมบูรณ์เมื่อ

* ระบบผ่าน Test ทุกระดับ
* ไม่มี Critical Bug
* AI มี Accuracy ตามเป้าหมาย
* Performance ผ่านเกณฑ์
* Security ผ่านมาตรฐาน
* ผู้ใช้จริงสามารถใช้งานได้
* พร้อม Deploy Production

---

# END OF 13_Testing_QA.md
