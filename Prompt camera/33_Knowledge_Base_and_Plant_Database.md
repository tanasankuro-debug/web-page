# 33_Knowledge_Base_and_Plant_Database.md

# GeoHeat AI Green Designer

## Knowledge Base and Plant Database Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดโครงสร้างฐานความรู้ (Knowledge Base) และฐานข้อมูลพืช (Plant Database) สำหรับระบบ GeoHeat AI Green Designer

เพื่อให้ AI สามารถ:

* แนะนำต้นไม้ที่เหมาะสม
* ออกแบบสวนตามพื้นที่จริง
* วิเคราะห์ผลกระทบต่อความร้อน
* ประเมินความเหมาะสมของพืช
* อธิบายเหตุผลของคำแนะนำ

---

# 2. Knowledge Base Architecture

```text id="q3w8na"
Plant Knowledge Base


        |

        ↓


Plant Database


        |

        ↓


AI Recommendation Engine


        |

        ↓


Personalized Garden Design

```

---

# 3. Knowledge Base Components

ระบบประกอบด้วยข้อมูล:

```text id="zq8k1d"
Knowledge Base


├── Plant Database

├── Climate Knowledge

├── Garden Style Knowledge

├── Maintenance Knowledge

├── Heat Reduction Knowledge

└── Environmental Knowledge

```

---

# 4. Plant Database Overview

Database:

```text id="2b7kqf"
plants
```

เก็บข้อมูล:

* ชื่อพืช
* ลักษณะ
* สภาพแวดล้อมที่เหมาะสม
* การดูแล
* ความสามารถลดความร้อน
* ขนาดเมื่อโตเต็มที่

---

# 5. Plant Database Schema

Table:

```sql id="w6y4d2"
plants
```

Columns:

| Field           | Type      | Description     |
| --------------- | --------- | --------------- |
| id              | UUID      | รหัสต้นไม้      |
| name            | TEXT      | ชื่อทั่วไป      |
| scientific_name | TEXT      | ชื่อวิทยาศาสตร์ |
| category        | TEXT      | ประเภท          |
| description     | TEXT      | รายละเอียด      |
| image_url       | TEXT      | รูปภาพ          |
| created_at      | TIMESTAMP | วันที่เพิ่ม     |

---

# 6. Plant Classification

แบ่งประเภท:

## Tree

ต้นไม้ขนาดใหญ่

ตัวอย่าง:

* ต้นหูกระจง
* ต้นปีบ
* ต้นแคนา

---

## Shrub

ไม้พุ่ม

ตัวอย่าง:

* โมก
* แก้ว
* ชาฮกเกี้ยน

---

## Ground Cover

พืชคลุมดิน

ตัวอย่าง:

* หญ้านวลน้อย
* ถั่วบราซิล

---

## Indoor / Balcony Plant

พืชพื้นที่จำกัด

ตัวอย่าง:

* ลิ้นมังกร
* พลูด่าง
* เดหลี

---

# 7. Environmental Properties

ทุกต้นไม้ต้องมีข้อมูล:

## Heat Tolerance

ความสามารถทนร้อน

Range:

```text id="j9t2wp"
0-100
```

Example:

```json id="5j8fpk"
{
"heat_tolerance":90
}
```

---

## Sunlight Requirement

ประเภทแสง:

```text id="5v4jma"
Full Sun

Partial Sun

Shade

Indoor
```

---

## Water Requirement

ระดับน้ำ:

```text id="j1v6qr"
Low

Medium

High
```

---

## Maintenance Level

การดูแล:

```text id="w4f0gr"
Easy

Medium

Hard
```

---

# 8. Plant Size Information

เก็บ:

## Height

ความสูงเมื่อโตเต็มที่

ตัวอย่าง:

```json id="wq9s20"
{
"max_height":"3m"
}
```

---

## Width

ขนาดทรงพุ่ม

ใช้สำหรับคำนวณพื้นที่

---

# 9. Space Requirement

AI ต้องรู้ว่าเหมาะกับพื้นที่เท่าไร

Example:

```json id="m3g8nv"
{
"minimum_area":2,

"recommended_area":10
}
```

---

# 10. Heat Reduction Capability

กำหนดความสามารถลดความร้อน

Metric:

```text id="5qj8od"
Cooling Score

0-100
```

พิจารณาจาก:

* Shade
* Leaf Area
* Evapotranspiration

---

# 11. Carbon Absorption Data

เก็บข้อมูล:

* Carbon Absorption
* Oxygen Production

Example:

```json id="d3p9lm"
{
"carbon_score":75
}
```

---

# 12. Plant Location Suitability

ระบุพื้นที่เหมาะสม:

```text id="6f0t6n"
Balcony

Front Yard

Backyard

Roof Garden

School Area

Community Area
```

---

# 13. Plant Database Example

## ต้นแก้ว

```json id="f0d3k2"
{
"name":"ต้นแก้ว",

"category":"Shrub",

"heat_tolerance":90,

"maintenance":"Easy",

"sunlight":"Full Sun",

"cooling_score":75
}
```

---

## ลิ้นมังกร

```json id="j9w3qv"
{
"name":"ลิ้นมังกร",

"category":"Indoor",

"heat_tolerance":95,

"water_requirement":"Low",

"maintenance":"Easy"
}
```

---

# 14. Climate Knowledge Base

ข้อมูลสภาพอากาศ:

เช่น:

## Hot Climate

ลักษณะ:

* อุณหภูมิสูง
* แดดแรง
* น้ำระเหยเร็ว

คำแนะนำ:

* เลือกต้นไม้ทนแดด
* เพิ่มไม้ให้ร่มเงา

---

# 15. Garden Style Knowledge

Database:

```text id="4m6h7q"
garden_styles
```

---

## Tropical Garden

เหมาะกับ:

* อากาศร้อน
* ต้องการความร่มรื่น

---

## Minimal Garden

เหมาะกับ:

* พื้นที่เล็ก
* ดูแลง่าย

---

## Vertical Garden

เหมาะกับ:

* ระเบียง
* พื้นที่จำกัด

---

# 16. Recommendation Logic

AI Ranking:

```text id="8y9m0v"
Plant Score


=

Climate Match

+

Space Match

+

Maintenance Match

+

Heat Reduction

+

User Preference

```

---

# 17. Plant Recommendation Example

Input:

```json id="z7x3q1"
{
"area":8,

"sunlight":"high",

"maintenance":"low",

"heat":"high"
}
```

AI:

```json id="4g8s9f"
[
{
"plant":"ลิ้นมังกร",

"score":92,

"reason":

"ทนแดด ดูแลง่าย เหมาะกับพื้นที่จำกัด"
}
]
```

---

# 18. Garden Composition Rules

AI ต้องคำนึงถึง:

## Layer Design

ประกอบด้วย:

```text id="n2f4bc"
Large Tree

↓

Shrub

↓

Ground Cover

```

---

# 19. Plant Diversity Rule

หลีกเลี่ยง:

ปลูกชนิดเดียวทั้งหมด

แนะนำ:

* ไม้ให้ร่มเงา
* ไม้พุ่ม
* ไม้คลุมดิน

---

# 20. Maintenance Knowledge

AI ประเมิน:

## เวลาในการดูแล

```text id="j2g7bk"
Low

<15 นาที/สัปดาห์


Medium

15-60 นาที/สัปดาห์


High

>60 นาที/สัปดาห์
```

---

# 21. Plant Database API

## Get Plants

```text id="3m8r1q"
GET /api/plants
```

---

## Search Plant

```text id="a7d9ps"
GET /api/plants/search
```

---

## Recommend Plants

```text id="h8f2qz"
POST /api/plants/recommend
```

---

# 22. AI Retrieval System

ใช้แนวคิด:

## RAG (Retrieval Augmented Generation)

Flow:

```text id="q8k4pa"
User Request

↓

Search Knowledge Base

↓

Retrieve Plant Data

↓

AI Reasoning

↓

Response

```

---

# 23. Vector Database (Future)

รองรับ:

* Semantic Search
* Similar Plant Search

Technology:

* pgvector
* Pinecone
* ChromaDB

---

# 24. Data Source Management

ข้อมูลมาจาก:

* กรมป่าไม้
* ฐานข้อมูลพฤกษศาสตร์
* งานวิจัย
* ผู้เชี่ยวชาญ

---

# 25. Knowledge Validation

ทุกข้อมูลต้องตรวจสอบ:

✓ ชื่อถูกต้อง

✓ เหมาะกับภูมิอากาศไทย

✓ ข้อมูลการดูแลถูกต้อง

✓ ไม่สร้างข้อมูลเกินจริง

---

# 26. Continuous Improvement

เพิ่มข้อมูลจาก:

* User Feedback
* Plant Success Rate
* Expert Review

---

# 27. Future Expansion

เพิ่ม:

## Smart Plant Care

AI แจ้งเตือน:

* รดน้ำ
* ใส่ปุ๋ย
* ตัดแต่ง

---

## Disease Detection

วิเคราะห์โรคจากภาพใบไม้

---

## Local Plant Recommendation

แนะนำพืชพื้นถิ่นแต่ละจังหวัด

---

# 28. Implementation Roadmap

## Phase 1

สร้าง:

✓ Plant Database

✓ Basic Recommendation

---

## Phase 2

เพิ่ม:

✓ RAG System

✓ Expert Knowledge

---

## Phase 3

เพิ่ม:

✓ Personal AI Garden Assistant

---

# 29. Definition of Done

Knowledge Base สมบูรณ์เมื่อ:

✓ มีฐานข้อมูลพืช

✓ AI ค้นข้อมูลได้

✓ Recommendation มีเหตุผล

✓ รองรับพื้นที่จริง

✓ ขยายข้อมูลเพิ่มได้

---

# END OF 33_Knowledge_Base_and_Plant_Database.md

โครงสร้างระบบตอนนี้:
GeoHeat AI

🌍 GIS Intelligence
 ├── Heat Map
 ├── NDVI/NDBI
 └── Spatial Analysis

🤖 AI Intelligence
 ├── Computer Vision
 ├── Recommendation AI
 ├── Generative AI
 └── RAG Knowledge Base

🌱 Garden Intelligence
 ├── Plant Database
 ├── Garden Designer
 └── AR Visualization

📊 Environmental Intelligence
 ├── Weather
 ├── AQI
 ├── Satellite
 └── Climate Data