# 19_Database_Seed_Data.md

# GeoHeat AI Green Designer

## Database Seed Data Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดข้อมูลเริ่มต้น (Seed Data) สำหรับระบบ GeoHeat AI Green Designer

เป้าหมายคือทำให้ระบบสามารถทำงานได้ทันทีหลังติดตั้ง โดยมีข้อมูลพื้นฐานสำหรับ

* Plant Recommendation
* Garden Design
* Heat Analysis
* Green Score
* Environmental Assessment
* AI Decision Engine

---

# 2. Seed Data Architecture

```text
Seed Database

        |
        |
        ├── Plant Database
        |
        ├── Garden Style Database
        |
        ├── Heat Classification
        |
        ├── Green Score Criteria
        |
        ├── Material Database
        |
        ├── Climate Data
        |
        └── Recommendation Rules
```

---

# 3. Plant Database

Table:

```
plants
```

Purpose:

เก็บข้อมูลพืชสำหรับ AI Recommendation

---

## Schema

```sql
plants

id

name_th

name_en

category

sun_requirement

water_requirement

maintenance_level

heat_reduction_score

shade_score

growth_size

suitable_area

description

image_url
```

---

# 4. Initial Plant Dataset

## 4.1 ต้นแก้ว

```json
{
"name":"ต้นแก้ว",
"category":"Shrub",
"sun":"Full Sun",
"maintenance":"Low",
"heat_score":80,
"shade_score":60,
"suitable_area":"Small-Medium"
}
```

Reason

* ทนแดด
* ดูแลง่าย
* เหมาะกับบ้านพักอาศัย

---

## 4.2 ต้นโมก

```json
{
"name":"ต้นโมก",
"category":"Shrub",
"sun":"Full Sun",
"maintenance":"Medium",
"heat_score":85,
"shade_score":70
}
```

Reason

* เพิ่มพื้นที่สีเขียว
* มีทรงพุ่ม
* ลดความร้อนบริเวณบ้าน

---

## 4.3 ต้นไทรเกาหลี

```json
{
"name":"ไทรเกาหลี",
"category":"Tree",
"sun":"Full Sun",
"maintenance":"Medium",
"heat_score":90,
"shade_score":90
}
```

Reason

* ให้ร่มเงา
* เหมาะสำหรับพื้นที่กว้าง

---

## 4.4 พลูด่าง

```json
{
"name":"พลูด่าง",
"category":"Indoor Plant",
"sun":"Low Light",
"maintenance":"Low",
"heat_score":60
}
```

เหมาะกับ

* ระเบียง
* พื้นที่แสงน้อย

---

## 4.5 เฟิร์น

```json
{
"name":"เฟิร์น",
"category":"Ground Plant",
"sun":"Shade",
"maintenance":"Medium"
}
```

เหมาะกับ

* สวนร่ม
* พื้นที่ชื้น

---

# 5. Garden Style Database

Table:

```
garden_styles
```

---

## Schema

```sql
garden_styles

id

name

description

suitable_area

maintenance

heat_reduction

recommended_plants

image_url
```

---

# 6. Garden Style Seed Data

## Tropical Garden

```json
{
"name":"Tropical Garden",
"area":"Medium-Large",
"maintenance":"Medium",
"heat_reduction":95
}
```

Concept

* ต้นไม้หลายระดับ
* เน้นร่มเงา
* ลดอุณหภูมิ

---

## Minimal Garden

```json
{
"name":"Minimal Garden",
"area":"Small-Medium",
"maintenance":"Low",
"heat_reduction":70
}
```

Concept

* เรียบง่าย
* ดูแลง่าย
* ใช้พื้นที่น้อย

---

## Vertical Garden

```json
{
"name":"Vertical Garden",
"area":"Small",
"maintenance":"Medium",
"heat_reduction":75
}
```

เหมาะกับ

* ระเบียง
* คอนโด

---

## Japanese Garden

```json
{
"name":"Japanese Garden",
"area":"Medium",
"maintenance":"Medium",
"heat_reduction":80
}
```

---

# 7. Heat Classification Database

Table:

```
heat_levels
```

---

Schema

```sql
heat_levels

id

level

temperature_range

risk

recommendation
```

---

Dataset

## Low

```
Temperature:
<30°C

Risk:
Low

Action:
Maintain vegetation
```

---

## Medium

```
30-35°C

Risk:
Moderate

Action:
Increase shade
```

---

## High

```
35-40°C

Risk:
High

Action:
Add trees and green coverage
```

---

## Extreme

```
>40°C

Risk:
Very High

Action:
Major cooling improvement
```

---

# 8. Green Score Criteria Database

Table:

```
green_score_rules
```

---

Schema

```sql
green_score_rules

factor

weight

description
```

---

Dataset

| Factor              | Weight |
| ------------------- | ------ |
| Vegetation Coverage | 30     |
| Shade Coverage      | 25     |
| Heat Reduction      | 20     |
| Plant Diversity     | 15     |
| Maintenance         | 10     |

---

# 9. Material Heat Database

Table:

```
surface_materials
```

---

Purpose:

วิเคราะห์พื้นผิวสะสมความร้อน

---

Dataset

## Concrete

```
heat_absorption: High
cooling_priority: High
```

## Grass

```
heat_absorption: Low
cooling_priority: Low
```

## Wood

```
heat_absorption: Medium
```

## Tile

```
heat_absorption: Medium-High
```

---

# 10. Area Type Database

Table:

```
area_types
```

---

Dataset

## Balcony

Properties:

```json
{
"max_size":"1-10 sqm",
"recommended":"Vertical Garden"
}
```

---

## Backyard

```json
{
"size":"10-100 sqm",
"recommended":"Tropical Garden"
}
```

---

## Side Yard

```json
{
"recommended":"Minimal Garden"
}
```

---

# 11. Recommendation Rules Database

Table:

```
recommendation_rules
```

---

Example

Rule:

พื้นที่เล็ก + แดดมาก

Input

```
Area <10 sqm

Sun = High
```

Output

```
Recommend:

Vertical Garden

Plants:

พลูด่าง
เฟิร์น
```

---

Rule:

พื้นที่ใหญ่ + Heat สูง

Output

```
Recommend:

Tropical Garden

Plants:

ไทรเกาหลี
โมก
แก้ว
```

---

# 12. AI Knowledge Base Structure

```text
User Data

+

Image Analysis

+

Environment Data

+

Seed Database

↓

AI Decision Engine

↓

Recommendation
```

---

# 13. Demo Dataset

สำหรับ Presentation

สร้างตัวอย่าง Project

## Project 1

ชื่อ:

สวนหลังบ้านบ้านพัก

Data

```
Area:
25 sqm

Heat:
High

Green Coverage:
20%

Material:
Concrete
```

AI Result

```
Garden:

Tropical Garden

Green Score:

78/100

Plants:

โมก
ไทรเกาหลี
ต้นแก้ว
```

---

## Project 2

ชื่อ:

ระเบียงคอนโด

Data

```
Area:
5 sqm

Sun:
Medium
```

Result

```
Garden:

Vertical Garden

Plants:

พลูด่าง
เฟิร์น
```

---

# 14. Future Dataset Expansion

เพิ่มในอนาคต

## Plant Intelligence

* Carbon Absorption
* Oxygen Production
* Seasonal Growth
* Disease Risk

## Climate Intelligence

* Weather History
* Satellite Data
* Urban Heat Data

## Local Dataset

* จังหวัด
* พันธุ์ไม้ท้องถิ่น
* สภาพอากาศเฉพาะพื้นที่

---

# 15. Seed Data Import Process

Workflow

```text
Create Database

↓

Run Migration

↓

Insert Seed Data

↓

Verify Relations

↓

Enable AI Usage
```

---

# 16. Definition of Done

Database Seed Data ถือว่าสมบูรณ์เมื่อ

✓ มีข้อมูลต้นไม้เริ่มต้น

✓ มีประเภทสวน

✓ มี Heat Classification

✓ มี Green Score Rule

✓ AI สามารถ Query ข้อมูลได้

✓ Demo มีข้อมูลพร้อมใช้งาน

---

# END OF 19_Database_Seed_Data.md
