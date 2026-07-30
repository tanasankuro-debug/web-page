# 37_Research_Methodology_and_Scientific_Validation.md

# GeoHeat AI Green Designer

## Research Methodology and Scientific Validation Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดระเบียบวิธีวิจัยและกระบวนการตรวจสอบความถูกต้องทางวิทยาศาสตร์ของระบบ GeoHeat AI Green Designer

เพื่อยืนยันว่า:

* ระบบสามารถวิเคราะห์พื้นที่ได้จริง
* AI สามารถให้คำแนะนำที่เหมาะสม
* การออกแบบสวนมีประโยชน์ด้านสิ่งแวดล้อม
* ผลลัพธ์สามารถวัดและประเมินได้

---

# 2. Research Concept

GeoHeat AI ใช้แนวคิด:

```text
Problem

↓

Data Collection

↓

AI Analysis

↓

Garden Recommendation

↓

Environmental Improvement

↓

Validation

```

---

# 3. Research Objective

## Objective 1

พัฒนาระบบ AI สำหรับวิเคราะห์พื้นที่และออกแบบพื้นที่สีเขียว

---

## Objective 2

ศึกษาความสามารถของ AI ในการแนะนำรูปแบบสวนที่เหมาะสมกับพื้นที่

---

## Objective 3

ประเมินประสิทธิภาพของระบบด้วยตัวชี้วัดเชิงปริมาณและคุณภาพ

---

## Objective 4

ศึกษาความพึงพอใจของผู้ใช้งานต่อระบบ

---

# 4. Research Questions

## RQ1

AI สามารถวิเคราะห์พื้นที่จากภาพถ่ายได้แม่นยำเพียงใด?

---

## RQ2

AI สามารถแนะนำต้นไม้ที่เหมาะสมกับสภาพแวดล้อมได้หรือไม่?

---

## RQ3

การเพิ่มพื้นที่สีเขียวด้วย AI Design สามารถช่วยลดความเสี่ยงความร้อนได้หรือไม่?

---

## RQ4

ผู้ใช้สามารถใช้งานระบบและเข้าใจคำแนะนำได้ง่ายหรือไม่?

---

# 5. Research Framework

```text
Input Variables


- Image Data

- Location Data

- Environmental Data

- User Requirement


          ↓


AI Processing


- Computer Vision

- GIS Analysis

- RAG

- AI Agent


          ↓


Output


- Area Analysis

- Plant Recommendation

- Garden Design

- Environmental Score

```

---

# 6. Research Variables

## Independent Variables

ตัวแปรต้น:

* การใช้ระบบ GeoHeat AI
* ข้อมูลภาพพื้นที่
* ข้อมูลสิ่งแวดล้อม

---

## Dependent Variables

ตัวแปรตาม:

* ความแม่นยำของ AI
* คุณภาพคำแนะนำ
* Green Score
* User Satisfaction

---

## Control Variables

ควบคุม:

* อุปกรณ์ถ่ายภาพ
* สภาพแสง
* วิธีประเมิน
* Dataset

---

# 7. Research Methodology

ใช้รูปแบบ:

## Research and Development (R&D)

แบ่งเป็น:

```text
Phase 1

Problem Analysis


Phase 2

System Development


Phase 3

Testing


Phase 4

Evaluation


Phase 5

Improvement

```

---

# 8. Phase 1: Problem Analysis

ศึกษาปัญหา:

* อุณหภูมิเมืองสูงขึ้น
* พื้นที่สีเขียวไม่เพียงพอ
* ประชาชนไม่รู้วิธีเพิ่มพื้นที่สีเขียว

---

# 9. Data Collection

ข้อมูลที่ใช้:

## Image Data

ประเภท:

* ระเบียง
* หลังบ้าน
* ข้างบ้าน
* พื้นที่ว่าง

---

## Environmental Data

เช่น:

* Temperature
* Humidity
* PM2.5
* Solar Radiation

---

## GIS Data

เช่น:

* Land Cover
* NDVI
* Heat Map

---

# 10. Dataset Preparation

ขั้นตอน:

```text
Collect Data

↓

Label Data

↓

Clean Data

↓

Split Dataset

↓

Training / Testing

```

---

# 11. Ground Truth Creation

เพื่อใช้เปรียบเทียบ

ตัวอย่าง:

พื้นที่จริง:

```text
พื้นที่จริง = 20 ตารางเมตร
```

AI:

```text
พื้นที่ AI = 19.2 ตารางเมตร
```

คำนวณ Error

---

# 12. Computer Vision Validation

ทดสอบ:

## Area Detection

วัด:

* Accuracy
* IoU
* Error Percentage

---

Target:

```text
Area Error < 10%

```

---

# 13. GIS Validation

ตรวจสอบ:

## Heat Analysis

เปรียบเทียบ:

AI Heat Prediction

กับ:

* Satellite Data
* Temperature Measurement

---

Metrics:

## MAE

Mean Absolute Error

---

# 14. Plant Recommendation Validation

ใช้:

## Expert Evaluation

ผู้ประเมิน:

* นักภูมิทัศน์
* ผู้เชี่ยวชาญด้านพืช

---

Evaluation:

คะแนน 1-5

หัวข้อ:

| ด้าน                    | คะแนน |
| ----------------------- | ----- |
| เหมาะกับอากาศ           | 1-5   |
| เหมาะกับพื้นที่         | 1-5   |
| ดูแลรักษา               | 1-5   |
| ประโยชน์ด้านสิ่งแวดล้อม | 1-5   |

---

# 15. Garden Design Validation

ประเมิน:

## Functional Test

ตรวจสอบ:

* ใช้งานจริงได้
* ไม่เกินพื้นที่

---

## Environmental Test

ตรวจสอบ:

* เพิ่มพื้นที่สีเขียว
* เพิ่มร่มเงา

---

## Design Test

ตรวจสอบ:

* ความสวยงาม
* ความสมดุล

---

# 16. Experimental Design

รูปแบบ:

## Before-After Experiment

เปรียบเทียบ:

ก่อนออกแบบสวน:

```text
Green Score = 35
```

หลังออกแบบ:

```text
Green Score = 75
```

---

# 17. Green Score Evaluation

Formula:

```text
Green Score


=

Vegetation Area

+

Shade Coverage

+

Plant Diversity

+

Environmental Benefit

```

---

# 18. User Testing

กลุ่มตัวอย่าง:

* นักเรียน
* ประชาชนทั่วไป
* ผู้ใช้งานที่สนใจพื้นที่สีเขียว

---

# 19. Usability Evaluation

ใช้:

System Usability Scale (SUS)

ประเมิน:

* ความง่ายในการใช้งาน
* ความเข้าใจระบบ
* ความสะดวก

---

# 20. Satisfaction Survey

Likert Scale:

1-5

หัวข้อ:

* ความสวยงาม
* ความถูกต้อง
* ความน่าเชื่อถือ
* ประโยชน์ของระบบ

---

# 21. Statistical Analysis

ใช้:

## Mean

ค่าเฉลี่ย

Formula:

```text
x̄ = Σx / n

```

---

## Standard Deviation

วัดการกระจายของข้อมูล

---

## Percentage

ใช้แสดงผล:

* Accuracy
* Satisfaction

---

# 22. Hypothesis Testing

ตัวอย่าง:

## H0

ระบบไม่มีผลต่อการเพิ่มความเข้าใจในการออกแบบสวน

## H1

ระบบช่วยเพิ่มความเข้าใจในการออกแบบสวน

---

# 23. Reliability Testing

ตรวจสอบ:

## Questionnaire Reliability

ใช้:

Cronbach's Alpha

Target:

```text
α ≥ 0.70

```

---

# 24. Scientific Validation Framework

```text
AI Result

↓

Compare With Reality

↓

Calculate Error

↓

Analyze Significance

↓

Accept / Improve Model

```

---

# 25. Result Reporting

รายงาน:

## Technical Result

* AI Accuracy
* Processing Time
* Error Rate

---

## Environmental Result

* Green Score Change
* Heat Risk Reduction

---

## User Result

* Satisfaction
* Usability

---

# 26. Limitations

ข้อจำกัด:

* ภาพถ่ายขึ้นกับคุณภาพกล้อง
* สภาพอากาศเปลี่ยนแปลง
* ข้อมูลพืชมีจำนวนจำกัด
* การลดอุณหภูมิจริงต้องใช้การทดลองระยะยาว

---

# 27. Future Research

พัฒนา:

## Real Sensor Validation

ติดตั้ง:

* Temperature Sensor
* Soil Sensor

---

## Long-term Monitoring

ติดตาม:

* ก่อนปลูก
* หลังปลูก
* การเปลี่ยนแปลงรายเดือน

---

## City Scale Study

ขยาย:

จากบ้าน

→ ชุมชน

→ เมือง

---

# 28. Research Timeline

```text
Month 1

Problem Study


Month 2-3

Data Collection


Month 4-6

System Development


Month 7

Testing


Month 8

Evaluation


Month 9

Report

```

---

# 29. Definition of Done

Research Validation สมบูรณ์เมื่อ:

✓ มี Research Framework

✓ มีตัวแปรชัดเจน

✓ มี Dataset

✓ มีวิธีประเมิน

✓ มี Statistical Analysis

✓ มีผลการทดลองรองรับ

---

# END OF 37_Research_Methodology_and_Scientific_Validation.md

ตอนนี้ GeoHeat AI มี 37 ไฟล์ Documentation แล้ว

โครงสร้างเริ่มครบระดับงานวิจัย:

GeoHeat AI

Software System
      +
Artificial Intelligence
      +
GIS Science
      +
Environmental Science
      +
Research Validation