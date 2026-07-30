# 17_User_Flow_Specification.md

# GeoHeat AI Green Designer

## User Flow Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนด User Journey และ Workflow ของผู้ใช้งาน GeoHeat AI Green Designer ตั้งแต่เริ่มเข้าสู่ระบบจนได้รับผลลัพธ์การออกแบบพื้นที่สีเขียว

เป้าหมายคือทำให้ผู้ใช้สามารถ

* วิเคราะห์พื้นที่จริงได้ง่าย
* เข้าใจปัญหาความร้อนของพื้นที่
* ได้รับคำแนะนำสวนที่เหมาะสม
* เห็นภาพจำลองก่อนปรับปรุง
* นำผลลัพธ์ไปใช้งานจริง

---

# 2. User Types

ระบบรองรับผู้ใช้งานหลัก 3 ประเภท

---

# 2.1 General User

ผู้ใช้งานทั่วไป

สามารถ

* สร้างพื้นที่
* ถ่ายภาพ
* วิเคราะห์พื้นที่
* รับคำแนะนำ
* ออกแบบสวน
* ดูรายงาน

---

# 2.2 Expert User

เช่น

* นักออกแบบภูมิทัศน์
* นักวิจัย
* หน่วยงาน

สามารถ

* วิเคราะห์หลายพื้นที่
* Export Report
* ดูข้อมูล GIS เพิ่มเติม

---

# 2.3 Administrator

สามารถ

* จัดการผู้ใช้
* จัดการ AI Model
* ตรวจสอบระบบ
* ดู Analytics

---

# 3. Overall User Journey

```text
Open Website

↓

Landing Page

↓

Register / Login

↓

Dashboard

↓

Create New Project

↓

Select Area Type

↓

Capture / Upload Image

↓

AI Analysis

↓

Environmental Assessment

↓

Garden Recommendation

↓

Garden Design

↓

AI Visualization

↓

Report Generation

↓

Save Project
```

---

# 4. First Visit Flow

## Step 1: Landing Page

หน้าแรกแสดง

* แนวคิด GeoHeat AI
* ประโยชน์ของระบบ
* ตัวอย่าง Before / After
* ปุ่มเริ่มต้นใช้งาน

Action

```
Start Designing
```

↓

เข้าสู่ Authentication

---

# 5. Authentication Flow

## Register

Input

* Email
* Password
* Name

Process

```text
User Input

↓

Validation

↓

Create Account

↓

Email Verification

↓

Dashboard
```

---

## Login

Process

```text
Login

↓

JWT Authentication

↓

Load User Profile

↓

Dashboard
```

---

# 6. Dashboard Flow

Dashboard เป็นศูนย์กลางของระบบ

ประกอบด้วย

## Overview Card

แสดง

* Green Score
* Heat Risk
* จำนวน Project
* พื้นที่ทั้งหมด

---

## Quick Actions

ปุ่มหลัก

```
+ Create New Garden
```

```
Analyze Area
```

```
View Map
```

```
Generate Report
```

---

# 7. Create Project Flow

เมื่อผู้ใช้สร้างพื้นที่ใหม่

Input

ชื่อ Project

ตัวอย่าง

```
สวนหลังบ้าน
```

---

เลือกประเภทพื้นที่

Options

* ระเบียง
* ข้างบ้าน
* หลังบ้าน
* สวนหน้าบ้าน
* พื้นที่สาธารณะ
* อื่นๆ

---

Input Location

ข้อมูล

* GPS Location
* Manual Location

---

Result

สร้าง Project ใหม่

Status

```
Created
```

---

# 8. Camera / Upload Flow

## Input Method

ผู้ใช้เลือก

Option 1

Camera

```
Open Camera

↓

Capture Image
```

Option 2

Upload

```
Select Image

↓

Upload
```

---

# 9. Image Validation Flow

AI ตรวจสอบภาพ

Process

```text
Image Upload

↓

Image Validation AI

↓

Quality Check
```

---

ถ้าภาพไม่ผ่าน

แสดง

```
ภาพไม่เหมาะสำหรับวิเคราะห์

คำแนะนำ:
- ถ่ายให้เห็นพื้นที่ทั้งหมด
- เพิ่มแสง
- หลีกเลี่ยงภาพเบลอ
```

---

ถ้าผ่าน

ไปขั้นตอน AI Analysis

---

# 10. AI Analysis Flow

## Stage 1

Image Understanding

AI วิเคราะห์

* สิ่งปลูกสร้าง
* ต้นไม้เดิม
* พื้นปูน
* พื้นดิน
* พื้นที่ว่าง

---

## Stage 2

Area Calculation

ระบบคำนวณ

* ขนาดพื้นที่
* พื้นที่สีเขียว
* พื้นที่ใช้งาน

Output

ตัวอย่าง

```
พื้นที่ทั้งหมด

18 ตารางเมตร

พื้นที่สีเขียว

25%
```

---

## Stage 3

Heat Analysis

วิเคราะห์

* ความร้อน
* วัสดุพื้นผิว
* แสงแดด
* จุดสะสมความร้อน

Output

```
Heat Risk

High
```

---

# 11. Analysis Result Flow

หน้า Analysis Result

แสดง

## Current Condition

* ภาพพื้นที่
* Object Detection
* Green Coverage

---

## Environmental Score

แสดง

```
Green Score

62/100
```

---

## Problem

ตัวอย่าง

```
พื้นที่มีพื้นคอนกรีตมาก
ทำให้สะสมความร้อนสูง
```

---

# 12. Garden Recommendation Flow

AI แนะนำรูปแบบสวน

Input

* พื้นที่
* ความร้อน
* งบประมาณ
* ความต้องการผู้ใช้

---

Result

Ranking

อันดับ 1

```
Tropical Garden

Score 92%
```

เหตุผล

```
เหมาะกับพื้นที่ร้อน
เพิ่มร่มเงาได้ดี
```

---

# 13. Plant Recommendation Flow

AI เลือกต้นไม้

แสดง

Plant Card

ประกอบด้วย

* รูปต้นไม้
* ชื่อ
* คะแนนความเหมาะสม
* การดูแล
* ประโยชน์

Example

```
ต้นแก้ว

Suitability 92%

เหมาะสำหรับ:
พื้นที่แดดจัด
```

---

# 14. Garden Designer Flow

ผู้ใช้เข้าสู่ Designer

Input

เลือก

## Garden Style

* Tropical
* Minimal
* Japanese
* Vertical
* Low Maintenance

---

## Budget

ตัวเลือก

* ต่ำ
* กลาง
* สูง

---

## Maintenance

เลือก

* ดูแลง่าย
* ดูแลปานกลาง
* ดูแลได้มาก

---

# 15. AI Garden Generation Flow

Process

```text
User Preference

+

AI Analysis Result

+

Plant Database

↓

Garden Layout AI

↓

AI Landscape Generator

↓

Final Design
```

---

# 16. Garden Result Page

แสดง

## Before

ภาพเดิม

## After

ภาพจำลองสวนใหม่

---

## Design Explanation

AI อธิบาย

* ทำไมเลือกแบบนี้
* ลดความร้อนอย่างไร
* ใช้งบประมาณเท่าไร

---

# 17. Report Flow

ผู้ใช้สร้างรายงาน

Process

```
Generate Report

↓

Collect Data

↓

AI Report Generator

↓

Create PDF

↓

Save
```

---

Report ประกอบด้วย

1. Project Information
2. Area Analysis
3. Heat Assessment
4. Green Score
5. Plant Recommendation
6. Garden Design
7. Maintenance Guide

---

# 18. Project Management Flow

ผู้ใช้สามารถ

ดู Project ทั้งหมด

```text
Projects

├── Garden A
├── Garden B
└── Garden C
```

แต่ละ Project มี

* Images
* Analysis
* Design
* Report

---

# 19. GIS Map Flow

User เปิด Map

แสดง

Layers

* Heat Map
* Green Area
* Temperature
* Nearby Cooling Area
* Hospital Location

---

Action

* Zoom
* Filter
* Compare Area

---

# 20. Notification Flow

ระบบแจ้งเตือนเมื่อ

* AI วิเคราะห์เสร็จ
* Report พร้อม
* Garden Design เสร็จ

---

# 21. Error Handling Flow

## AI Error

แสดง

```
AI Analysis Failed

Try Again
```

---

## Upload Error

แสดง

```
File ไม่ถูกต้อง

รองรับ JPG PNG WEBP
```

---

# 22. Complete User Flow Diagram

```text
Landing

↓

Authentication

↓

Dashboard

↓

Create Project

↓

Camera / Upload

↓

AI Vision Analysis

↓

Heat Analysis

↓

Green Score

↓

Garden Recommendation

↓

Garden Designer

↓

AI Visualization

↓

Report

↓

Save Project

↓

Dashboard
```

---

# 23. UX Principles

ระบบต้อง

## Simple

ผู้ใช้ทั่วไปเข้าใจได้

## Visual

ใช้ภาพมากกว่าข้อความ

## Explainable

ทุก AI Result ต้องมีเหตุผล

## Progressive Disclosure

แสดงข้อมูลทีละขั้น

---

# 24. Performance Requirement

User Flow ต้องรองรับ

* Mobile First
* Camera Access
* Fast Loading
* Responsive Design

---

# 25. Definition of Done

User Flow Specification ถือว่าสมบูรณ์เมื่อ

✓ มี User Journey ครบ

✓ ทุก Feature มี Flow

✓ AI Trigger Point ชัดเจน

✓ Navigation ชัดเจน

✓ รองรับการพัฒนา Frontend

✓ เชื่อมต่อกับ Backend และ AI Architecture ได้

---

# END OF 17_User_Flow_Specification.md
