# 20_AI_Model_Integration_Plan.md

# GeoHeat AI Green Designer

## AI Model Integration Plan

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดแผนการนำ AI Model มาเชื่อมต่อกับระบบ GeoHeat AI Green Designer

เป้าหมายคือสร้าง AI Pipeline ที่สามารถ

* วิเคราะห์ภาพพื้นที่จริง
* ตรวจจับองค์ประกอบในพื้นที่
* ประเมินพื้นที่สีเขียว
* วิเคราะห์ความร้อน
* คำนวณพื้นที่
* แนะนำรูปแบบสวน
* แนะนำต้นไม้
* สร้างภาพจำลอง
* สร้างรายงานอัตโนมัติ

---

# 2. AI System Overview

Architecture

```text
User Image

↓

Image Processing

↓

Computer Vision Model

↓

Environmental Analysis

↓

AI Decision Engine

↓

Recommendation AI

↓

Generative AI

↓

Report Generation
```

---

# 3. AI Model Categories

ระบบแบ่ง AI เป็น 6 ส่วนหลัก

| Module             | Purpose         |
| ------------------ | --------------- |
| Computer Vision AI | วิเคราะห์ภาพ    |
| Segmentation AI    | แยกพื้นที่      |
| Measurement AI     | คำนวณขนาด       |
| Recommendation AI  | แนะนำสวน/ต้นไม้ |
| Generative AI      | สร้างภาพจำลอง   |
| Report AI          | สรุปผล          |

---

# 4. Computer Vision AI

## Purpose

ตรวจสอบสิ่งที่อยู่ในภาพ

สามารถตรวจจับ

* ต้นไม้
* พื้นหญ้า
* พื้นปูน
* อาคาร
* ผนัง
* เฟอร์นิเจอร์
* พื้นที่ว่าง

---

# 5. Recommended Model

## MVP Version

ใช้

### YOLOv8 / YOLO11

สำหรับ Object Detection

เหตุผล

* เร็ว
* รองรับ Real-time
* ใช้งานบน Server ได้ง่าย
* มี Community ขนาดใหญ่

---

Input

```text
Image
```

↓

Model

```text
YOLO
```

↓

Output

```json
{
"objects":[
{
"class":"tree",
"confidence":0.92
},
{
"class":"concrete",
"confidence":0.88
}
]
}
```

---

# 6. Image Segmentation Model

## Purpose

แยกพื้นที่ในภาพ

ตัวอย่าง

* พื้นที่สีเขียว
* พื้นคอนกรีต
* พื้นที่ว่าง

---

# Recommended Model

## Segment Anything Model (SAM / SAM2)

เหตุผล

* Segment Object ได้ละเอียด
* ใช้กับภาพหลากหลาย
* เหมาะกับ Landscape Analysis

---

Output

```json
{
"green_area":"35%",
"hard_surface":"50%",
"empty_area":"15%"
}
```

---

# 7. Area Measurement System

## Purpose

คำนวณพื้นที่จริง

Input

* Image
* Reference Object
* User Dimension

---

# MVP Approach

ใช้ User Calibration

ตัวอย่าง

ผู้ใช้กรอก

```
ความกว้างพื้นที่

5 เมตร
```

AI คำนวณ

```
พื้นที่ประมาณ

20 ตารางเมตร
```

---

# Future Approach

ใช้ Depth AI

Technology

* MiDaS
* Depth Anything
* AR Depth API

เพื่อสร้าง

3D Spatial Understanding

---

# 8. AI Heat Analysis Model

## Purpose

ประเมินความเสี่ยงความร้อน

Input

* Surface Type
* Green Coverage
* Location
* Temperature Data

---

Logic

```text
Concrete %

+

Low Shade

+

High Temperature

↓

High Heat Risk
```

---

Output

```json
{
"heatRisk":"High",
"score":82,
"reason":[
"Concrete surface",
"Low vegetation"
]
}
```

---

# 9. Plant Recommendation AI

## Purpose

เลือกต้นไม้ที่เหมาะสม

---

# Architecture

```text
User Data

+

Image Analysis

+

Plant Database

+

Climate Data

↓

Recommendation Engine

↓

Plant Ranking
```

---

# Technology

ใช้ Hybrid AI

ประกอบด้วย

## Rule Based System

สำหรับ

* ความปลอดภัย
* ความเหมาะสมพื้นฐาน

-

## LLM Reasoning

สำหรับ

* อธิบายเหตุผล
* ปรับคำแนะนำ

---

# Ranking Formula

```
Plant Score =

Climate Compatibility

+

Heat Reduction

+

Area Compatibility

+

Maintenance

+

User Preference
```

---

# 10. Garden Design AI

## Purpose

ออกแบบสวน

Input

* Area
* Garden Style
* Plant Selection

---

Process

```text
Analysis Result

↓

Layout Generator

↓

Design Concept

↓

Visualization
```

---

Output

```json
{
"style":"Tropical Garden",
"zones":[
"Tree Zone",
"Flower Zone",
"Relax Zone"
]
}
```

---

# 11. Image Generation AI

## Purpose

สร้างภาพ Before / After

---

Recommended Models

## MVP

ใช้ API

* OpenAI Image Generation
* Stable Diffusion API

---

Input

```text
Original Image

+

Garden Design Prompt
```

---

Prompt Structure

```
Transform this outdoor area into
a realistic green garden.

Keep original architecture.

Add suitable plants,
shade elements,
and natural materials.
```

---

Output

Before

↓

After Visualization

---

# 12. Large Language Model Integration

## Purpose

ใช้สำหรับ Reasoning

Tasks

* อธิบายผลวิเคราะห์
* สรุปรายงาน
* ตอบคำถามผู้ใช้
* ให้คำแนะนำ

---

Recommended Models

MVP

* GPT API
* Claude API
* Gemini API

---

Architecture

```text
Application

↓

LLM API

↓

Prompt Template

↓

Response

↓

Database
```

---

# 13. AI Prompt Management

Prompt ต้องเก็บแยก

Structure

```
/ai-prompts

├── plant-recommendation.txt

├── garden-design.txt

├── report-generator.txt

├── heat-analysis.txt
```

---

# 14. AI Pipeline Workflow

Full Process

```text
User Upload Image

↓

Image Validation

↓

Object Detection

↓

Segmentation

↓

Area Calculation

↓

Heat Analysis

↓

Green Score

↓

Plant Recommendation

↓

Garden Design

↓

Image Generation

↓

Report Generation
```

---

# 15. Backend AI Service Architecture

```text
FastAPI Backend


/api

/api/analyze-image

/api/recommend-plants

/api/generate-garden

/api/create-report


↓

AI Services


vision_service.py

recommendation_service.py

generation_service.py

report_service.py
```

---

# 16. AI Processing Queue

งาน AI ใช้เวลานาน

จึงใช้ Queue

```text
User Request

↓

Task Queue

↓

AI Worker

↓

Result Database

↓

Notification
```

---

# 17. AI Result Database

Table:

```
ai_analysis_results
```

เก็บ

* image_id
* model_name
* confidence
* result_json
* created_at

---

# 18. Model Performance Requirements

## Computer Vision

Target

Accuracy:

> 85%

Response:

<5 seconds

---

## Recommendation AI

Target

User satisfaction:

> 85%

---

## Image Generation

Target

Generation:

<30 seconds

---

# 19. AI Development Phases

## Phase 1 MVP

ใช้

* YOLO
* SAM2
* LLM API
* Plant Database

---

## Phase 2

เพิ่ม

* Depth Estimation
* Better Area Measurement
* More Accurate Heat Model

---

## Phase 3

เพิ่ม

* AR Preview
* 3D Reconstruction
* Digital Twin

---

# 20. AI Cost Optimization

แนวทางลดค่าใช้จ่าย

## Cache Result

ภาพเดิมไม่ต้องวิเคราะห์ใหม่

## Model Selection

ใช้ Model เล็กก่อน

## Batch Processing

รวมงาน AI

---

# 21. AI Security

ต้องป้องกัน

* Image Privacy
* Prompt Injection
* Data Leakage

---

# 22. AI Testing

ทดสอบ

## Image Test

ภาพ

* สวน
* ระเบียง
* หลังบ้าน
* พื้นปูน

## Recommendation Test

ตรวจสอบ

* ความเหมาะสม
* เหตุผล

---

# 23. Definition of Done

AI Model Integration ถือว่าสมบูรณ์เมื่อ

✓ มี AI Pipeline ชัดเจน

✓ ทุก Model มีหน้าที่

✓ มี Input / Output

✓ เชื่อม Backend ได้

✓ มีแผน MVP

✓ รองรับการขยายระบบ

---

# END OF 20_AI_Model_Integration_Plan.md
