# 18_MVP_Feature_Priority.md

# GeoHeat AI Green Designer

## MVP Feature Priority Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดลำดับความสำคัญของ Feature สำหรับ GeoHeat AI Green Designer เพื่อให้สามารถพัฒนา Minimum Viable Product (MVP) ที่ใช้งานได้จริงก่อน และสามารถขยายระบบในอนาคตได้

เป้าหมายของ MVP คือ

* ผู้ใช้สามารถสร้าง Project ได้
* ผู้ใช้สามารถนำเข้าภาพพื้นที่จริงได้
* ระบบสามารถวิเคราะห์พื้นที่เบื้องต้นได้
* ระบบสามารถแนะนำแนวทางเพิ่มพื้นที่สีเขียวได้
* ผู้ใช้เห็นผลลัพธ์ที่เข้าใจง่าย

---

# 2. MVP Strategy

แนวคิดการพัฒนา

```text
Core Value First

↓

Useful Product

↓

AI Enhancement

↓

Advanced Features
```

ไม่เริ่มจาก Feature ที่ซับซ้อนที่สุด

แต่เริ่มจาก Feature ที่สร้างคุณค่าให้ผู้ใช้มากที่สุด

---

# 3. Feature Priority Levels

แบ่ง Feature เป็น 4 ระดับ

---

# Priority A

## Must Have (MVP Core)

Feature ที่จำเป็นต่อ Product

---

# Priority B

## Should Have

Feature ที่เพิ่มคุณค่ามาก แต่ไม่จำเป็นใน Version แรก

---

# Priority C

## Nice To Have

Feature สำหรับเพิ่มความโดดเด่น

---

# Priority D

## Future Vision

Feature ระดับ Advanced Research

---

# 4. MVP Version 1.0

Target Duration

8–12 Weeks

---

# Priority A Features

---

# 4.1 User Authentication

Priority:

★★★★★

Status:

MVP Required

Features

* Register
* Login
* Logout
* User Profile

Technology

* Supabase Auth

Reason

ระบบต้องสามารถแยกข้อมูลของผู้ใช้แต่ละคนได้

---

# 4.2 Project Management

Priority:

★★★★★

Features

สร้าง Project

ตัวอย่าง

```
สวนหลังบ้าน
ระเบียงคอนโด
พื้นที่ข้างบ้าน
```

สามารถ

* Create
* Edit
* Delete
* View History

Database

projects table

---

# 4.3 Image Upload / Camera Capture

Priority:

★★★★★

Features

ผู้ใช้สามารถ

* เปิดกล้อง
* ถ่ายภาพ
* Upload ภาพ

รองรับ

* JPG
* PNG
* WEBP

Validation

* Resolution
* Blur Detection
* File Size

---

# 4.4 AI Basic Image Analysis

Priority:

★★★★★

MVP Scope

AI สามารถตรวจจับ

* พื้นที่สีเขียว
* พื้นคอนกรีต
* สิ่งปลูกสร้าง
* พื้นที่ว่าง

Output

```
Green Area

35%

Concrete Area

50%

Empty Area

15%
```

---

# 4.5 Area Estimation

Priority:

★★★★☆

ระบบคำนวณพื้นที่

Input

* Image
* User Input Dimension (Optional)

Output

```
Estimated Area

18 m²
```

---

# 4.6 Green Score

Priority:

★★★★★

Feature สำคัญสำหรับ Demo

แสดงคะแนน

0-100

ตัวอย่าง

```
Green Score

72/100

Grade B
```

ประกอบด้วย

* Vegetation Coverage
* Shade
* Heat Reduction Potential

---

# 4.7 Plant Recommendation

Priority:

★★★★★

AI แนะนำต้นไม้

Input

* Area Size
* Sunlight
* Heat Level

Output

Plant Card

ประกอบด้วย

* รูป
* ชื่อ
* เหตุผล
* การดูแล

---

# 4.8 Basic Garden Designer

Priority:

★★★★☆

MVP Version

ผู้ใช้เลือก

Garden Style

* Tropical
* Minimal
* Low Maintenance

AI สร้าง

* Layout Concept
* Plant Placement

---

# 4.9 Dashboard

Priority:

★★★★☆

แสดง

* Project
* Green Score
* Recent Analysis
* Recommendation

---

# 5. MVP User Flow

```text
Login

↓

Dashboard

↓

Create Project

↓

Upload Image

↓

AI Analysis

↓

Green Score

↓

Plant Recommendation

↓

Garden Concept

↓

Save Result
```

---

# 6. Priority B Features

## Version 1.5

---

# 6.1 GIS Heat Map

Priority:

★★★★☆

Features

* Heat Layer
* Temperature Map
* Green Area Map

Benefit

เพิ่มความแตกต่างจากเว็บทั่วไป

---

# 6.2 Location Based Recommendation

Priority:

★★★★☆

ใช้

* GPS
* Weather Data

แนะนำตามพื้นที่จริง

---

# 6.3 PDF Report Generator

Priority:

★★★★☆

สร้างรายงาน

ประกอบด้วย

* Analysis
* Score
* Recommendation
* Design

---

# 6.4 AI Before / After Visualization

Priority:

★★★★★

Feature สำหรับ Demo

Input

ภาพจริง

Output

ภาพสวนหลังปรับปรุง

---

# 7. Priority C Features

## Version 2.0

---

# 7.1 AR Garden Preview

Priority:

★★★☆☆

ใช้กล้องมือถือแสดงสวนเสมือนจริง

Technology

* WebXR
* ARCore
* ARKit

---

# 7.2 Advanced Plant Database

เพิ่มข้อมูล

* Growth Rate
* Carbon Absorption
* Cooling Effect
* Seasonal Data

---

# 7.3 Community Sharing

ผู้ใช้สามารถ

* แชร์สวน
* ดูตัวอย่าง
* Vote Design

---

# 7.4 Cost Estimation

คำนวณ

* ต้นไม้
* วัสดุ
* ค่าแรง

---

# 8. Priority D Features

## Future Research

---

# 8.1 Drone Mapping

ใช้ Drone

สร้าง

* 3D Map
* Large Area Analysis

---

# 8.2 Full 3D Garden Reconstruction

Technology

* NeRF
* Gaussian Splatting

---

# 8.3 Digital Twin

สร้าง Digital Twin ของพื้นที่

สามารถจำลอง

* อุณหภูมิ
* เงา
* การเปลี่ยนแปลงในอนาคต

---

# 8.4 Predictive Cooling Simulation

AI คาดการณ์

```
ถ้าเพิ่มต้นไม้ 5 ต้น

อุณหภูมิอาจลดลงประมาณ X°C
```

---

# 9. MVP Development Timeline

## Sprint 1

Foundation

* Next.js Setup
* Supabase
* Authentication
* Design System

---

## Sprint 2

Core Application

* Dashboard
* Project Management
* Image Upload

---

## Sprint 3

AI Foundation

* Image Analysis
* Green Detection
* Area Estimation

---

## Sprint 4

Recommendation

* Plant Database
* Recommendation AI
* Green Score

---

## Sprint 5

Garden Designer

* Layout Generator
* Design Result

---

## Sprint 6

Polish

* Responsive
* Testing
* Demo Preparation

---

# 10. MVP Success Criteria

MVP สำเร็จเมื่อ

✓ ผู้ใช้สมัครสมาชิกได้

✓ สร้าง Project ได้

✓ Upload รูปได้

✓ AI วิเคราะห์พื้นที่ได้

✓ แสดง Green Score ได้

✓ แนะนำต้นไม้ได้

✓ สร้าง Concept สวนได้

✓ บันทึกผลลัพธ์ได้

✓ ใช้งานบนมือถือได้

---

# 11. Demo Flow สำหรับ Presentation

สำหรับนำเสนอกรรมการ

```text
เปิดเว็บ

↓

สร้างพื้นที่

↓

ถ่ายรูปสวน/ระเบียง

↓

AI วิเคราะห์

↓

แสดง Heat Risk

↓

Green Score

↓

เลือก Garden Style

↓

AI สร้างสวนใหม่

↓

แสดง Before / After

↓

Export Report
```

---

# 12. Development Rule

หลักการสำคัญ

"Build Working Product Before Perfect AI"

ระบบที่ใช้งานได้จริง

สำคัญกว่า

AI ที่ซับซ้อนแต่ยังใช้งานไม่ได้

---

# 13. Definition of Done

MVP ถือว่าสำเร็จเมื่อ

* Core User Flow ทำงานครบ
* AI มีผลลัพธ์ที่เข้าใจได้
* UI พร้อม Demo
* Database พร้อมใช้งาน
* ระบบสามารถ Deploy ได้
* รองรับการพัฒนาต่อใน Version ถัดไป

---

# END OF 18_MVP_Feature_Priority.md
