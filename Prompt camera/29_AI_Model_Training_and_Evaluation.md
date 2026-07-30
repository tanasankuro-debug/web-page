# 29_AI_Model_Training_and_Evaluation.md

# GeoHeat AI Green Designer

## AI Model Training and Evaluation Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดแนวทางการพัฒนา ฝึกสอน และประเมินประสิทธิภาพของ AI Model ในระบบ GeoHeat AI Green Designer

ครอบคลุม:

* Dataset Preparation
* Image Annotation
* Model Selection
* Training Pipeline
* Model Evaluation
* Performance Optimization
* Model Deployment

---

# 2. AI System Overview

GeoHeat AI ใช้ AI หลายส่วนร่วมกัน

```text
AI System


Image Input

↓

Computer Vision Model

↓

Feature Extraction

↓

Environmental Analysis

↓

Recommendation AI

↓

Generative AI

↓

User Result

```

---

# 3. AI Model Components

ระบบประกอบด้วย 5 AI Modules

---

# 3.1 Object Detection Model

หน้าที่:

ตรวจจับองค์ประกอบในภาพ

Detect:

* ต้นไม้
* หญ้า
* พื้นคอนกรีต
* อาคาร
* พื้นที่ว่าง
* สิ่งปลูกสร้าง

Technology:

```text
YOLOv8 / YOLOv9
```

Output:

```json
{
"object":"tree",
"confidence":0.94,
"position":[x,y,w,h]
}
```

---

# 3.2 Image Segmentation Model

หน้าที่:

แบ่งพื้นที่ในภาพ

Technology:

```text
SAM / SAM2
```

Output:

```text
Green Area

Concrete Area

Building Area

Empty Area
```

---

# 3.3 Heat Analysis Model

หน้าที่:

ประเมินความเสี่ยงความร้อน

Input:

* Surface Ratio
* Green Coverage
* Shade
* Location
* Temperature

Output:

```json
{
"heat_score":82,
"risk":"High"
}
```

---

# 3.4 Recommendation Model

หน้าที่:

แนะนำต้นไม้และรูปแบบสวน

ใช้:

* Rule Based System
* Machine Learning Ranking
* LLM Reasoning

---

# 3.5 Generative AI Model

หน้าที่:

สร้างภาพสวนหลังปรับปรุง

Technology:

* Image Generation Model
* Diffusion Model

---

# 4. Dataset Strategy

## Dataset Sources

แบ่งเป็น 3 ประเภท

---

# 4.1 Public Dataset

ใช้ Dataset เปิด

ตัวอย่าง:

* COCO Dataset
* ADE20K
* Cityscapes

ใช้สำหรับ:

Pre-training

---

# 4.2 Custom GeoHeat Dataset

Dataset หลักของโครงการ

เก็บภาพจาก:

* บ้านพัก
* ระเบียง
* หลังบ้าน
* โรงเรียน
* พื้นที่ชุมชน

---

# 4.3 Synthetic Dataset

สร้างภาพเพิ่มเติมด้วย AI

ใช้เพิ่มความหลากหลาย

---

# 5. Dataset Structure

```text
dataset/


├── images/


│
├── train/

├── validation/

└── test/


├── annotations/


├── labels/

└── masks/

```

---

# 6. Data Collection Guidelines

ภาพต้องมี:

✓ มุมมองพื้นที่จริง

✓ เห็นพื้นผิวชัดเจน

✓ มีแสงธรรมชาติ

✓ ความละเอียดเพียงพอ

---

# หลีกเลี่ยง

* ภาพเบลอ
* ภาพมืดเกินไป
* ภาพที่ไม่มีพื้นที่วิเคราะห์

---

# 7. Image Annotation Process

ใช้เครื่องมือ:

* Roboflow
* Label Studio

---

# Object Labels

กำหนด Class:

```text
0 tree

1 grass

2 concrete

3 building

4 soil

5 water

6 shadow

7 furniture

```

---

# Segmentation Labels

```text
Green Zone

Hard Surface

Structure

Open Space

```

---

# 8. Dataset Split

แบ่งข้อมูล

```text
Training

70%


Validation

20%


Testing

10%

```

---

# 9. Data Augmentation

เพิ่มความหลากหลาย

Techniques:

* Rotation
* Brightness Adjustment
* Crop
* Flip
* Blur Simulation

Purpose:

ทำให้ Model รองรับสภาพจริง

---

# 10. Training Pipeline

```text
Dataset

↓

Preprocessing

↓

Augmentation

↓

Model Training

↓

Validation

↓

Hyperparameter Tuning

↓

Export Model

```

---

# 11. Object Detection Training

Parameters

Example:

```yaml
epochs: 100

batch_size: 16

image_size: 640

optimizer: AdamW

learning_rate: 0.001
```

---

# 12. Segmentation Training

Evaluation Focus:

* Boundary Accuracy
* Area Accuracy

---

# 13. Model Evaluation Metrics

## Object Detection

ใช้:

### Precision

วัดความถูกต้องของสิ่งที่ตรวจพบ

Formula:

```
Precision =
True Positive /
(True Positive + False Positive)
```

---

### Recall

วัดความสามารถในการค้นหาวัตถุทั้งหมด

---

### mAP

Mean Average Precision

Target:

```
mAP > 0.85
```

---

# 14. Segmentation Evaluation

ใช้:

## IoU

Intersection over Union

Formula:

```
IoU =
Intersection /
Union
```

Target:

```
IoU > 0.75
```

---

# 15. Area Estimation Evaluation

ทดสอบ:

พื้นที่จริง

เทียบกับ

AI Estimate

Formula:

```
Error Percentage

=

|Actual - Prediction|

/

Actual ×100
```

Target:

```
Error <15%
```

---

# 16. Heat Analysis Evaluation

ประเมินจาก:

* Sensor Temperature
* Satellite Data
* Field Measurement

---

Metrics:

## MAE

Mean Absolute Error

## RMSE

Root Mean Square Error

---

Target:

```
MAE < 2°C
```

---

# 17. Recommendation Evaluation

ให้ผู้เชี่ยวชาญประเมิน

Criteria:

| Criteria    | Score |
| ----------- | ----- |
| ความเหมาะสม | 1-5   |
| ดูแลรักษา   | 1-5   |
| ลดความร้อน  | 1-5   |
| ความสวยงาม  | 1-5   |

Target:

Average ≥4

---

# 18. Explainable AI Evaluation

ตรวจสอบว่า AI สามารถอธิบายได้

ต้องตอบได้:

* ใช้ข้อมูลอะไร
* วิเคราะห์อย่างไร
* ทำไมเลือกคำแนะนำนี้

---

# 19. Model Improvement Cycle

```text
Collect Data

↓

Train Model

↓

Evaluate

↓

Analyze Error

↓

Improve Dataset

↓

Retrain

```

---

# 20. Error Analysis

วิเคราะห์กรณีผิด

ตัวอย่าง:

## False Detection

AI คิดว่า:

พื้นปูน = หญ้า

แก้ไข:

เพิ่ม Dataset พื้นผิวปูน

---

## Missing Detection

AI ไม่พบต้นไม้

แก้ไข:

เพิ่มภาพต้นไม้หลายมุม

---

# 21. Model Version Control

จัดการ Version

```text
models/


├── detection_v1.pt

├── segmentation_v1.pt

├── heat_model_v1.pkl

└── recommendation_v1.json

```

---

# 22. Model Deployment

Flow:

```text
Trained Model

↓

Export

↓

AI Service

↓

FastAPI Endpoint

↓

Frontend

```

---

# 23. AI Performance Optimization

เทคนิค:

## Model Compression

* Quantization
* Pruning

---

## Inference Optimization

* Batch Processing
* GPU Acceleration
* Cache Result

---

# 24. AI Monitoring

ติดตาม:

* Accuracy Change
* Processing Time
* User Feedback
* Failure Cases

---

# 25. Human Feedback Loop

ใช้ Feedback จากผู้ใช้

เช่น:

"คำแนะนำไม่เหมาะสม"

นำข้อมูลกลับไป:

```text
Feedback

↓

Dataset

↓

Retraining

↓

Better AI

```

---

# 26. AI Ethics

AI ต้อง:

✓ ไม่สร้างข้อมูลเท็จ

✓ แจ้งข้อจำกัด

✓ ไม่รับรองผล 100%

✓ เคารพข้อมูลผู้ใช้

---

# 27. Future AI Development

เพิ่มในอนาคต:

## Climate Prediction Model

คาดการณ์ความร้อนในอนาคต

---

## AR Garden Preview

ทดลองวางสวนแบบ Real-time

---

## Personalized Garden AI

เรียนรู้ความชอบผู้ใช้

---

# 28. Implementation Roadmap

## Phase 1

ใช้ Pre-trained Model

* YOLO
* SAM
* LLM

---

## Phase 2

สร้าง Dataset ของ GeoHeat

---

## Phase 3

Fine-tune Model

---

## Phase 4

Deploy AI Model จริง

---

# 29. Definition of Done

AI Model ถือว่าสมบูรณ์เมื่อ:

✓ Dataset พร้อม

✓ Model ผ่าน Evaluation

✓ Accuracy ตามเป้าหมาย

✓ Explainable AI ทำงาน

✓ API เชื่อมต่อได้

✓ Production Ready

---

# END OF 29_AI_Model_Training_and_Evaluation.md
