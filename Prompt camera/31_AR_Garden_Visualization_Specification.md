# 31_AR_Garden_Visualization_Specification.md

# GeoHeat AI Green Designer

## AR Garden Visualization Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดระบบ AR Garden Visualization สำหรับ GeoHeat AI Green Designer

ระบบนี้ช่วยให้ผู้ใช้สามารถทดลองออกแบบพื้นที่สีเขียวบนพื้นที่จริงผ่านกล้องมือถือ

โดยสามารถ:

* สแกนพื้นที่จริง
* ตรวจจับพื้นผิว
* วางต้นไม้เสมือนจริง
* ทดลองรูปแบบสวน
* ดูผลก่อนและหลังปรับปรุง
* ประเมินผลด้านพื้นที่สีเขียวและการลดความร้อน

---

# 2. AR System Concept

```text
Real Environment

↓

Camera Scan

↓

Computer Vision

↓

Surface Detection

↓

AI Garden Design

↓

AR Placement

↓

User Visualization

```

---

# 3. AR Architecture

```text

                User


                 |

                 ↓


            Mobile Camera


                 |

                 ↓


        AR Processing Engine


     ---------------------------

     |            |             |

     ↓            ↓             ↓


Plane        Object        Lighting

Detection    Detection     Estimation


                 |

                 ↓


          Garden AI Engine


                 |

                 ↓


          AR Garden Preview


```

---

# 4. Technology Stack

## Mobile AR Framework

เลือกใช้:

## WebAR / AR Foundation

---

# Option 1: WebAR (MVP)

Technology:

* WebXR
* Three.js
* MindAR

ข้อดี:

* เปิดผ่าน Browser ได้
* ไม่ต้องติดตั้ง Application
* เหมาะกับ Demo

ข้อจำกัด:

* ความแม่นยำต่ำกว่า Native AR

---

# Option 2: Native AR

Technology:

## ARCore (Android)

## ARKit (iOS)

ข้อดี:

* แม่นยำสูง
* Tracking ดี
* รองรับ Surface Detection

ข้อจำกัด:

* ต้องสร้าง Mobile App

---

# Recommendation

สำหรับ GeoHeat AI MVP:

ใช้:

```text
Web Application

+

WebAR

+

Three.js
```

Future:

```text
React Native

+

ARCore

+

ARKit
```

---

# 5. AR Feature Overview

ระบบประกอบด้วย:

```text
AR Garden System


├── Camera Scanner

├── Surface Detection

├── Plant Placement

├── Garden Object Library

├── Before/After Compare

├── AI Layout Generator

└── Measurement System

```

---

# 6. Camera Scanner Module

## Purpose

ใช้กล้องเพื่อเก็บข้อมูลพื้นที่

Input:

* Camera Image
* Video Stream

Process:

```text
Camera

↓

Frame Processing

↓

Feature Detection

↓

Spatial Understanding

```

---

# 7. Surface Detection

ตรวจจับพื้นผิว:

รองรับ:

* พื้นดิน
* พื้นปูน
* ระเบียง
* สนามหญ้า
* พื้นที่ว่าง

---

Output:

```json
{
"surface":"concrete",

"confidence":0.92,

"area_estimate":18.5

}
```

---

# 8. AR Plane Detection

หน้าที่:

หา Plane จริง

เช่น:

```text
Floor

Wall

Ground

Table

Balcony

```

---

ข้อมูล:

```json
{
"plane_id":1,

"type":"horizontal",

"size":

{
"width":4,

"length":5

}

}
```

---

# 9. Real World Measurement

## Purpose

คำนวณขนาดพื้นที่จริง

Input:

* Camera Depth
* AR Anchor

Output:

```json
{
"width":5,

"length":4,

"area":20
}
```

หน่วย:

```text
Square Meter (m²)
```

---

# 10. AI Garden Layout Generator

## Purpose

สร้าง Layout สวนอัตโนมัติ

Input:

```json
{
"area":20,

"style":"tropical",

"sunlight":"high",

"maintenance":"low"

}
```

---

AI Output:

```json
{
"plants":

[
{
"name":"ต้นแก้ว",

"position":

"x:1,y:2"

}
],

"zones":

[
"shade",

"flower"

]

}
```

---

# 11. AR Plant Placement

ระบบสามารถ:

* เพิ่มต้นไม้
* เปลี่ยนตำแหน่ง
* หมุน
* ปรับขนาด

---

Object:

```text
Plant Model


├── Tree

├── Bush

├── Flower

├── Grass

└── Decoration

```

---

# 12. 3D Asset Library

เก็บ Model:

Structure:

```text
assets/ar/


├── plants/

│
├── trees/

├── bushes/

└── flowers/


├── objects/

│
├── rock

├── pathway

└── furniture

```

---

# 13. Plant Metadata

ทุก Object ต้องมีข้อมูล:

```json
{
"name":"ต้นแก้ว",

"height":2.5,

"shade_level":80,

"heat_reduction":20,

"maintenance":"low"

}
```

---

# 14. Lighting Estimation

เพื่อให้ Object สมจริง

ระบบวิเคราะห์:

* Direction of Light
* Shadow
* Brightness

---

Output:

```json
{
"light":"strong",

"shadow_direction":

"left"

}
```

---

# 15. Before / After Visualization

Feature:

เปรียบเทียบ:

Before:

```text
Concrete Area

Low Green

High Heat
```

After:

```text
More Plants

More Shade

Lower Heat Risk

```

---

# 16. AR + Heat Simulation

ระบบจำลองผลกระทบ

Example:

ก่อน:

```text
Green Coverage: 15%

Heat Risk: High

```

หลัง:

```text
Green Coverage: 45%

Heat Risk: Medium

```

---

# 17. AR User Flow

```text

Open Camera


↓

Scan Area


↓

Detect Space


↓

AI Analyze


↓

Choose Garden Style


↓

Generate Design


↓

View AR Garden


↓

Save Project


```

---

# 18. Frontend AR Components

Structure:

```text
components/ar/


├── ARCamera.tsx

├── ARViewer.tsx

├── PlaneDetector.tsx

├── PlantObject.tsx

├── GardenToolbar.tsx

├── ARMeasureTool.tsx

└── BeforeAfterSlider.tsx

```

---

# 19. Backend AR API

## Create AR Session

```
POST /api/ar/session
```

Response:

```json
{
"session_id":"AR001"
}
```

---

## Save AR Design

```
POST /api/ar/design
```

---

## Load AR Assets

```
GET /api/ar/assets
```

---

# 20. Database Extension

เพิ่ม Table:

## ar_sessions

```sql
ar_sessions

id UUID

project_id UUID

device_type TEXT

created_at TIMESTAMP

```

---

## ar_design_objects

```sql
ar_design_objects


id UUID

session_id UUID

object_type TEXT

position JSONB

rotation JSONB

scale JSONB

```

---

# 21. Performance Optimization

เพื่อให้ AR ลื่น:

ใช้:

* Low Polygon Model
* Texture Compression
* Lazy Loading
* Object Caching

Target:

```text
FPS >30
```

---

# 22. Device Compatibility

รองรับ:

## Mobile

* Android
* iOS

## Browser

* Chrome
* Safari

---

# 23. Accuracy Evaluation

ทดสอบ:

## Measurement Accuracy

พื้นที่จริง:

20 m²

AR:

19.2 m²

Error:

<10%

---

## Placement Accuracy

วัด:

ตำแหน่ง Object

Error:

<10 cm

---

# 24. AI + AR Integration

Flow:

```text
Camera

+

GIS Data

+

AI Analysis


↓

Smart Garden Design


↓

AR Visualization

```

---

# 25. Future Development

## Full AR Mobile App

ใช้:

* ARCore
* ARKit

---

## AI Real-time Garden Assistant

ผู้ใช้ถาม:

"ต้นนี้ควรวางตรงไหน"

AI ตอบแบบ Real-time

---

## AR Heat Simulation

แสดง:

* จุดร้อน
* จุดเย็น
* ทิศทางลม

---

# 26. Implementation Roadmap

## Phase 1 MVP

ทำ:

✓ Camera Upload

✓ 2D Garden Preview

✓ Basic AR Object Placement

---

## Phase 2

เพิ่ม:

✓ Plane Detection

✓ Measurement

✓ 3D Models

---

## Phase 3

เพิ่ม:

✓ Real-time AI

✓ Advanced AR Simulation

---

# 27. Definition of Done

AR System สมบูรณ์เมื่อ:

✓ เปิดกล้องได้

✓ ตรวจจับพื้นที่ได้

✓ วัดขนาดพื้นที่ได้

✓ วางต้นไม้เสมือนได้

✓ เชื่อม AI Design ได้

✓ Save Project ได้

✓ ใช้งานบนมือถือได้

---

# END OF 31_AR_Garden_Visualization_Specification.md
