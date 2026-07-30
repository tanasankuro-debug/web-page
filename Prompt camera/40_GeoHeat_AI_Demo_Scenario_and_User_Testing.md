# 40_GeoHeat_AI_Demo_Scenario_and_User_Testing.md

# GeoHeat AI Green Designer

## Demo Scenario and User Testing Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดรูปแบบการ Demo ระบบ GeoHeat AI Green Designer และกระบวนการทดสอบผู้ใช้งานจริง

เพื่อประเมิน:

* ความเข้าใจของผู้ใช้
* ความง่ายในการใช้งาน
* ประสิทธิภาพของระบบ
* ประโยชน์ที่ได้รับจาก AI

---

# 2. Demo Objective

เป้าหมายของ Demo:

แสดงให้เห็นว่า GeoHeat AI สามารถ:

```text
ภาพพื้นที่จริง

↓

วิเคราะห์พื้นที่

↓

เข้าใจสภาพแวดล้อม

↓

แนะนำต้นไม้

↓

ออกแบบสวน

↓

แสดงผลลัพธ์

```

---

# 3. Demo Storyline

ใช้รูปแบบ:

```text
Problem

↓

User Situation

↓

AI Solution

↓

Result

↓

Impact

```

---

# 4. Demo Persona

## Persona 1: เจ้าของบ้าน

ชื่อสมมติ:

"คุณต้น"

---

สถานการณ์:

มีพื้นที่ข้างบ้านว่าง 20 ตารางเมตร

ปัญหา:

* พื้นที่ร้อน
* พื้นคอนกรีตมาก
* ไม่รู้จะปลูกต้นอะไร

---

Goal:

ต้องการสวนที่:

* ลดความร้อน
* ดูแลง่าย
* เหมาะกับพื้นที่

---

# 5. Demo Scenario 1

# Small Space Garden Design

## User Input

ผู้ใช้:

ถ่ายภาพพื้นที่ข้างบ้าน

ข้อมูลเพิ่มเติม:

```json
{
"area_type":"side_house",

"area_size":"20 m²",

"maintenance":"low",

"style":"modern"
}

```

---

# Step 1: Image Upload

ระบบ:

รับภาพจากกล้อง

---

AI วิเคราะห์:

* พื้นที่ใช้งาน
* พื้นผิว
* สิ่งกีดขวาง
* พื้นที่ว่าง

---

Output:

```json
{
"surface":"concrete",

"green_area":"10%",

"estimated_area":"20m²"
}

```

---

# Step 2: Environmental Analysis

ระบบเรียก:

* GIS Data
* Weather Data

วิเคราะห์:

```text
Temperature: 38°C

Heat Risk: High

Vegetation: Low

```

---

# Step 3: AI Recommendation

AI ค้นข้อมูลจาก:

* Plant Database
* RAG Knowledge

Output:

ตัวอย่าง:

## ต้นแก้ว

เหตุผล:

* ทนแดด
* ดูแลง่าย
* เหมาะกับอากาศร้อน

---

## ลิ้นมังกร

เหตุผล:

* ใช้น้ำน้อย
* เหมาะกับพื้นที่จำกัด

---

# Step 4: Garden Generation

AI สร้าง:

* Layout
* Plant Position
* Garden Style

Output:

```text
Zone A

ไม้พุ่ม


Zone B

พื้นที่พักผ่อน


Zone C

ไม้กระถาง

```

---

# Step 5: AR Preview

ผู้ใช้:

เปิดกล้อง

เห็น:

* ต้นไม้จำลอง
* ตำแหน่งจริง
* ขนาดโดยประมาณ

---

# Step 6: AI Report

ระบบสร้าง:

## Garden Report

ประกอบด้วย:

* วิเคราะห์พื้นที่
* รายการต้นไม้
* วิธีดูแล
* Green Score

---

# 6. Demo Scenario 2

# Balcony Garden

## User

นักเรียน/นักศึกษา

พื้นที่:

5 ตารางเมตร

---

Problem:

* ระเบียงร้อน
* ไม่มีพื้นที่ปลูกต้นไม้

---

AI Solution:

แนะนำ:

* Vertical Garden
* ไม้กระถาง
* พืชทนแดด

---

# 7. Demo Scenario 3

# Community Green Area

## User

ชุมชน

พื้นที่:

100 ตารางเมตร

---

AI วิเคราะห์:

* Heat Risk
* พื้นที่ว่าง
* จุดเหมาะสม

---

Output:

Community Garden Plan

---

# 8. Demo Script

## Opening

พูด:

"ปัจจุบันหลายพื้นที่มีปัญหาความร้อนสะสม แต่ประชาชนจำนวนมากไม่รู้ว่าพื้นที่ของตัวเองควรเพิ่มพื้นที่สีเขียวอย่างไร GeoHeat AI จึงถูกพัฒนาขึ้นเพื่อช่วยวิเคราะห์และออกแบบพื้นที่สีเขียวเฉพาะบุคคล"

---

# Demo Flow

## นาทีที่ 0-1

แนะนำปัญหา

---

## นาทีที่ 1-3

ถ่ายภาพและวิเคราะห์

---

## นาทีที่ 3-5

AI Recommendation

---

## นาทีที่ 5-7

Garden Design + AR

---

## นาทีที่ 7-8

Report และผลลัพธ์

---

# 9. User Testing Framework

ใช้:

## Usability Testing

เพื่อประเมิน:

* ใช้งานง่ายหรือไม่
* เข้าใจผลลัพธ์หรือไม่
* สามารถทำงานสำเร็จหรือไม่

---

# 10. Test Participants

กลุ่มตัวอย่าง:

## General User

จำนวน:

30 คน

---

ประกอบด้วย:

* นักเรียน
* นักศึกษา
* บุคคลทั่วไป

---

# 11. Testing Tasks

ผู้ใช้ต้องทำ:

## Task 1

เข้าสู่ระบบ

---

## Task 2

เพิ่มพื้นที่ใหม่

---

## Task 3

อัปโหลดภาพ

---

## Task 4

ดูผลวิเคราะห์

---

## Task 5

เลือกแบบสวน

---

## Task 6

ดูรายงาน

---

# 12. Task Success Rate

วัด:

```text
Success Rate

=

จำนวนผู้ทำสำเร็จ

/

จำนวนทั้งหมด ×100

```

---

Target:

```text
≥90%

```

---

# 13. User Satisfaction Survey

ใช้:

Likert Scale 5 ระดับ

---

หัวข้อ:

| รายการ                | คะแนน |
| --------------------- | ----- |
| ความง่ายในการใช้งาน   | 1-5   |
| ความเร็วของระบบ       | 1-5   |
| ความเข้าใจผลลัพธ์     | 1-5   |
| ความเหมาะสมของคำแนะนำ | 1-5   |
| ประโยชน์ของระบบ       | 1-5   |

---

# 14. System Usability Scale (SUS)

ใช้มาตรฐาน:

System Usability Scale

คะแนน:

0-100

---

Interpretation:

| Score | Meaning          |
| ----- | ---------------- |
| >80   | Excellent        |
| 68-80 | Good             |
| <68   | Need Improvement |

---

# 15. User Feedback Collection

เก็บ:

## Positive Feedback

เช่น:

"ช่วยเลือกต้นไม้ได้ง่ายขึ้น"

---

## Improvement Feedback

เช่น:

"อยากให้มีต้นไม้ท้องถิ่นเพิ่ม"

---

# 16. User Testing Data Storage

Database:

## user_testing_results

```sql
id UUID

user_type TEXT

task_result BOOLEAN

satisfaction_score FLOAT

feedback TEXT

created_at TIMESTAMP

```

---

# 17. Evaluation Metrics

สรุป:

## Technical

* Processing Time
* Accuracy

---

## Usability

* SUS Score
* Task Success Rate

---

## Satisfaction

* Average Rating

---

# 18. Failure Scenario Testing

ทดสอบกรณี:

## ภาพไม่ชัด

ระบบ:

แจ้ง:

"กรุณาถ่ายภาพใหม่"

---

## ไม่มีข้อมูลพื้นที่

ระบบ:

ถามข้อมูลเพิ่มเติม

---

## API ไม่ตอบสนอง

ระบบ:

ใช้ข้อมูลสำรอง

---

# 19. Judge Demo Preparation

เตรียม:

✓ Demo Account

✓ Sample Images

✓ Backup Video

✓ Backup Dataset

✓ Stable Internet

---

# 20. Demo Risk Management

ปัญหา:

## Internet Error

Solution:

ใช้ Video Backup

---

## AI Processing ช้า

Solution:

เตรียม Result Cache

---

## AR ไม่ทำงาน

Solution:

แสดง Simulation

---

# 21. Success Criteria

Demo สำเร็จเมื่อ:

✓ ผู้ชมเข้าใจปัญหา

✓ เห็นกระบวนการ AI

✓ เห็นผลลัพธ์จริง

✓ เข้าใจคุณค่าของระบบ

---

# 22. Future User Testing

เพิ่ม:

## Long-term Study

ติดตาม:

* หลังใช้งาน 1 เดือน
* การเปลี่ยนแปลงพื้นที่จริง

---

## Real Environmental Measurement

วัด:

ก่อนและหลังเพิ่มพื้นที่สีเขียว

---

# END OF 40_GeoHeat_AI_Demo_Scenario_and_User_Testing.md

ตอนนี้ GeoHeat AI มี 40 ไฟล์ Documentation แล้ว

ภาพรวมล่าสุด:

GeoHeat AI

01-08  System Foundation
09-15 Development & Security
16-25 AI + Implementation
26-32 Deployment + GIS + Environment
33-36 Knowledge + Agent + Evaluation
37-38 Research + Innovation
39-40 Pitch + Demo Validation