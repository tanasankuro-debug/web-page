# Product Requirements Document (PRD)

# Project Name

GeoHeat AI Green Designer

## Version

v1.0

## Product Type

AI-Powered Urban Heat Mitigation Web Application

## Platform

Responsive Web Application
(Web + Mobile Browser)

---

# 1. Product Overview

## 1.1 Background

ปัญหาปรากฏการณ์ความร้อนในเมือง (Urban Heat) เกิดจากการเพิ่มขึ้นของพื้นที่คอนกรีต อาคาร ถนน และการลดลงของพื้นที่สีเขียว ส่งผลให้อุณหภูมิในเขตเมืองสูงขึ้นและส่งผลกระทบต่อคุณภาพชีวิตของประชาชน

GeoHeat เป็น Web Application ที่รวบรวม วิเคราะห์ และนำเสนอข้อมูลด้านความร้อนในพื้นที่เมืองผ่านเทคโนโลยี GIS, Remote Sensing และข้อมูลภูมิสารสนเทศ เพื่อช่วยให้ประชาชนเข้าใจสถานการณ์ความร้อนในพื้นที่ของตนเอง

ระบบ GeoHeat AI Green Designer เป็นฟีเจอร์ต่อยอดที่เปลี่ยนจากระบบ "วิเคราะห์ปัญหา" ไปสู่ระบบ "ช่วยออกแบบแนวทางแก้ไข"

โดยใช้ Artificial Intelligence, Computer Vision และ GIS เพื่อช่วยประชาชนออกแบบพื้นที่สีเขียว เช่น สวนหย่อม ระเบียงบ้าน หลังบ้าน หรือพื้นที่ว่าง เพื่อช่วยลดความร้อนในพื้นที่อยู่อาศัย

---

# 2. Product Vision

สร้างแพลตฟอร์มอัจฉริยะที่ช่วยให้ประชาชนสามารถเปลี่ยนพื้นที่ร้อนให้กลายเป็นพื้นที่สีเขียวได้ง่ายขึ้น

จาก

"พื้นที่นี้ร้อนแค่ไหน?"

เปลี่ยนเป็น

"ฉันควรปรับพื้นที่อย่างไรเพื่อช่วยลดความร้อน?"

---

# 3. Product Goals

## Main Goals

1. วิเคราะห์พื้นที่จริงจากภาพถ่ายของผู้ใช้งาน
2. ประเมินพื้นที่สำหรับการออกแบบสวน
3. แนะนำรูปแบบสวนที่เหมาะสม
4. จำลองภาพพื้นที่หลังปรับปรุง
5. ประเมินผลกระทบด้านความร้อนหลังเพิ่มพื้นที่สีเขียว

---

# 4. Target Users

## Primary Users

### 1. ประชาชนทั่วไป

ผู้ที่ต้องการปรับปรุงพื้นที่บ้าน

Examples:

- ระเบียง
- หน้าบ้าน
- หลังบ้าน
- ดาดฟ้า
- ลานปูน

### 2. เจ้าของบ้าน

Need:

- ลดความร้อน
- เพิ่มความสวยงาม
- ประหยัดพลังงาน

### 3. หน่วยงานท้องถิ่น

ใช้ข้อมูลเพื่อ

- ส่งเสริมพื้นที่สีเขียว
- วางแผนเมือง
- วิเคราะห์พื้นที่เสี่ยง

---

# 5. Core Features

# Feature 1

# AI Area Scanner

## Description

ระบบใช้กล้องมือถือในการวิเคราะห์พื้นที่จริง

## User Flow

User:

1. เปิด Camera Scanner
2. ถ่ายภาพพื้นที่
3. ระบบประมวลผลภาพ
4. แสดงผลวิเคราะห์

## AI Analysis

ระบบตรวจจับ

- พื้นปูน
- หญ้า
- ต้นไม้
- อาคาร
- กำแพง
- สิ่งกีดขวาง

## Output Example

พื้นที่ทั้งหมด:

20 ตารางเมตร

พื้นที่คอนกรีต:

16 ตารางเมตร

พื้นที่สีเขียว:

4 ตารางเมตร

พื้นที่ที่สามารถปรับปรุง:

12 ตารางเมตร

---

# Feature 2

# Smart Area Measurement

## Purpose

คำนวณขนาดพื้นที่สำหรับออกแบบสวน

## Technology Options

### Current Version

User-assisted Measurement

Process:

1. User ถ่ายภาพ
2. User ระบุจุดขอบเขตพื้นที่
3. AI คำนวณพื้นที่

### Future Version

AR Measurement

Technology:

- WebXR
- ARCore
- ARKit

สามารถ:

- Scan พื้นที่
- สร้าง 3D Model
- วัดความกว้าง
- วัดความยาว
- คำนวณพื้นที่

---

# Feature 3

# AI Garden Recommendation

## Description

ระบบแนะนำรูปแบบสวนที่เหมาะสม

## Input Data

- ขนาดพื้นที่
- ปริมาณแสง
- อุณหภูมิ
- พื้นผิว
- งบประมาณ
- ความต้องการผู้ใช้

## Garden Types

### Tropical Garden

เหมาะกับ:

- ประเทศเขตร้อน
- แดดแรง

Recommended plants:

- หมากเหลือง
- เฟิร์น
- พลูด่าง

---

### Minimal Garden

เหมาะกับ:

- พื้นที่เล็ก
- ระเบียง

Recommended:

- ไม้อวบน้ำ
- กระถาง

---

### Japanese Garden

เหมาะกับ:

- พื้นที่พักผ่อน

---

### Edible Garden

สวนกินได้

Recommended:

- สมุนไพร
- ผักสวนครัว

---

# Feature 4

# AI Before / After Simulation

## Description

สร้างภาพจำลองพื้นที่หลังปรับปรุง

Input:

ภาพพื้นที่จริง

Output:

ภาพสวนใหม่

Example:

Before:

พื้นที่ปูน 90%

After:

เพิ่ม

- ต้นไม้
- พื้นหญ้า
- พื้นที่พักผ่อน

Technology:

- Generative AI
- Image-to-Image Model

---

# Feature 5

# Green Score

## Description

คะแนนความเป็นมิตรต่อสิ่งแวดล้อม

Score:

0-100

Factors:

## Green Coverage

เปอร์เซ็นต์พื้นที่สีเขียว

## Heat Exposure

การรับความร้อน

## Shade Coverage

พื้นที่ร่มเงา

## Plant Diversity

ความหลากหลายของพืช

Example:

Before:

Green Score

35/100

After:

Green Score

82/100

---

# Feature 6

# Heat Reduction Estimation

## Purpose

ประเมินผลกระทบหลังเพิ่มพื้นที่สีเขียว

Input:

- ข้อมูล GeoHeat
- พื้นที่สีเขียว
- ประเภทต้นไม้

Output:

Estimated:

Surface Temperature Reduction:

1-3°C

Heat Exposure Reduction:

15%

หมายเหตุ:

ค่าประเมินเป็นแบบจำลอง ไม่ใช่ค่าการวัดจริง

---

# Feature 7

# Smart Budget Calculator

## Description

คำนวณค่าใช้จ่าย

Example:

พื้นที่:

15 ตารางเมตร

Recommended:

ต้นไม้:

5 ต้น

ดิน:

10 ถุง

กระถาง:

6 ใบ

Estimated Cost:

5,000 บาท

---

# Feature 8

# Green Maintenance Assistant

AI แนะนำการดูแล

เช่น

- ตารางรดน้ำ
- การใส่ปุ๋ย
- การตัดแต่ง

---

# 6. System Workflow
User

↓

Upload Image

↓

Computer Vision Analysis

↓

Area Detection

↓

GIS Environmental Data

↓

AI Recommendation Engine

↓

Garden Design

↓

Before/After Simulation

↓

Green Score

↓

Save Result

---

# 7. Technology Requirements

## Frontend

Framework:

Next.js

Language:

TypeScript

UI:

Tailwind CSS

shadcn/ui

Animation:

Framer Motion

3D:

Three.js

---

## Backend

Framework:

FastAPI

Language:

Python

Purpose:

- AI Processing
- Image Analysis
- Recommendation Engine

---

## Database

Supabase

Services:

- PostgreSQL
- Authentication
- Storage
- Realtime

---

# AI Technologies

## Object Detection

YOLOv11

## Image Segmentation

SAM 2

## Depth Estimation

Depth Anything V2

## Image Generation

FLUX / OpenAI Image Generation

## Language Model

GPT / Gemini

---

# 8. User Experience Requirements

## Design Direction

Style:

Modern Environmental Technology

Reference:

- Apple Design
- Linear
- Google Material 3

Theme:

Green + Dark + Glassmorphism

---

# 9. Performance Requirements

System must:

- Load homepage < 3 seconds
- Support mobile devices
- Responsive design
- Optimize image upload
- Handle AI processing asynchronously

---

# 10. Security Requirements

Implement:

- Authentication
- User permission
- Secure image storage
- Data privacy

---

# 11. MVP Scope

## Implement Now

✅ Upload image

✅ AI image analysis mock system

✅ Area estimation

✅ Garden recommendation

✅ Green Score

✅ Dashboard

✅ Before/After UI

---

# 12. Future Development

## Phase 2

AR Measurement

WebXR

Real-time camera scanning

## Phase 3

AI 3D Garden Simulation

## Phase 4

Community Garden Sharing

## Phase 5

Integration with Smart City Data

---

# 13. Success Metrics

Measure:

User satisfaction

System usability

Number of analyzed areas

Number of recommended gardens

Increase in green awareness

---

# End of Document
