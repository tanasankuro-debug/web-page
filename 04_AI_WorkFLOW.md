# AI Workflow Specification

# Project

GeoHeat AI Green Designer

Version: 1.0

---

# 1. AI System Overview

## Objective

สร้างระบบ AI ที่สามารถวิเคราะห์พื้นที่จริงจากภาพถ่ายของผู้ใช้งาน

เพื่อ:

- ตรวจสอบลักษณะพื้นที่
- คำนวณพื้นที่
- วิเคราะห์ความร้อน
- แนะนำการเพิ่มพื้นที่สีเขียว
- จำลองพื้นที่หลังปรับปรุง

---

# 2. AI Pipeline Overview

```
User Camera
  |
  v
Image Capture
  |
  v
Image Preprocessing
  |
  v
Computer Vision Analysis
  |
  +----------------+
  |                |
  v                v
Object Detection  Image Segmentation
(YOLO)            (SAM)
  |
  v
Area Calculation
  |
  v
Environmental Analysis
(GIS + GeoHeat Data)
  |
  v
AI Recommendation Engine
  |
  v
Garden Simulation
  |
  v
Final Result
```

---

# 3. Image Input Workflow

## User Input

Supported:

- Camera Capture
- Upload Image
- Multiple Image Upload

Recommended:

Minimum:

1 image

Better accuracy:

3-5 images

Example:

Front View

Side View

Top View

---

# 4. Image Preprocessing

## Purpose

เตรียมภาพก่อนเข้าสู่ AI Model

---

## Processing

### Resize

ปรับขนาดภาพ

Example:

1024x1024

---

### Normalization

ปรับค่า Pixel

---

### Noise Reduction

ลด:

- Blur
- Noise
- Low Light

Technology:

OpenCV

---

# 5. Computer Vision Workflow

# 5.1 Object Detection

## Model

YOLOv11

## Purpose

ตรวจจับสิ่งต่าง ๆ ในภาพ

---

## Detect Classes

### Environment

- Tree
- Grass
- Plant
- Soil

### Structure

- Concrete
- Wall
- Roof
- Building

### Object

- Furniture
- Pot
- Vehicle

---

## Output Example

```json
{
  "objects": [
    {
      "class": "concrete",
      "confidence": 0.95,
      "bbox": [120, 200, 500, 700]
    },
    {
      "class": "tree",
      "confidence": 0.91
    }
  ]
}
```

---

# 5.2 Image Segmentation

## Model

SAM 2

Segment Anything Model

## Purpose

แยกพื้นที่แต่ละประเภท

Example:

Original Image

↓

Segmentation

- Concrete Area
- Green Area
- Shadow Area
- Building Area

## Output

Mask Image

Example:

```json
{
  "concrete_percentage": 75,
  "green_percentage": 25
}
```

---

# 5.3 Depth Estimation

## Model

Depth Anything V2

## Purpose

ประเมินความลึกจากภาพ

ใช้สำหรับ:

- ระยะห่าง
- ขนาดพื้นที่
- ความสัมพันธ์ของวัตถุ

---

# 6. Area Calculation Workflow

## Current MVP Method

ใช้ User Assisted Measurement

Process:

1. User แตะขอบเขตพื้นที่
2. AI วิเคราะห์พื้นผิว
3. Calculate Area

Example:

Input:

4 จุด

A, B, C, D

Output:

Width:

5 meter

Length:

4 meter

Area:

20 square meter

## Future Advanced Method

AR Measurement

Technology:

- WebXR
- ARCore
- ARKit

Workflow:

```
Camera
↓
AR Tracking
↓
Plane Detection
↓
3D Mapping
↓
Distance Measurement
↓
Area Calculation
```

---

# 7. GeoHeat Environmental Intelligence

หลังจากวิเคราะห์พื้นที่

ระบบเชื่อมข้อมูล GeoHeat

Input:

Location

Query:

GeoHeat Database

Data:

- Temperature
- Land Surface Temperature
- NDVI
- Green Coverage
- Heat Risk

Example:

```json
{
  "temperature": 39,
  "lst": 42,
  "ndvi": 0.18,
  "heat_level": "high"
}
```

---

# 8. Sun Exposure Analysis

## Objective

วิเคราะห์ว่าพื้นที่ได้รับแดดมากน้อยแค่ไหน

Input:

- Location
- Time
- Date
- Building Direction

Process:

Solar Calculation

Output:

Sun Exposure:

7 hours/day

Recommended:

Heat Resistant Plants

---

# 9. AI Garden Recommendation Engine

## Purpose

เลือกสวนที่เหมาะสมที่สุด

Input:

- Area Size
- Temperature
- Sun Exposure
- Available Budget
- User Preference
- Maintenance Level

## Recommendation Logic

### Rule Based Layer

Example:

IF

temperature > 38°C

AND

sun_exposure > 6 hours

THEN

recommend:

Tropical Garden

### AI Layer

LLM Generate:

- Explanation
- Plant List
- Design Concept
- Maintenance

## Output Example

```json
{
  "garden_type": "Tropical Garden",
  "plants": ["Golden Palm", "Fern", "Snake Plant"],
  "budget": 6500,
  "cooling_effect": "High"
}
```

---

# 10. Plant Knowledge Database

Database stores:

Plant Information

Example:

Plant:

Golden Palm

Type:

Tree

Sun:

High

Water:

Medium

Cooling:

High

Maintenance:

Low

---

# 11. AI Before / After Simulation

## Purpose

สร้างภาพจำลองพื้นที่หลังปรับปรุง

Input:

- Original Image
- Garden Design
- Plant Selection

AI Model:

Image Generation Model

Options:

- FLUX
- OpenAI Image Generation

Prompt Template:

```
Transform this outdoor area into a tropical garden.
Keep original architecture.
Add suitable plants.
Maintain realistic lighting.
Create realistic landscape design.
```

Output:

Before:

Original

After:

AI Generated Garden

---

# 12. Green Score Algorithm

Score:

0-100

Calculation Factors:

Green Coverage

Weight:

40%

Shade Improvement

Weight:

25%

Heat Reduction

Weight:

25%

Plant Diversity

Weight:

10%

Formula:

Green Score

=

Green Coverage + Shade + Cooling + Diversity

---

# 13. Heat Reduction Estimation Model

Purpose:

Estimate cooling impact

Input:

- Green Area Increase
- Tree Coverage
- Surface Type

Example:

Before:

Concrete:

90%

After:

Green:

50%

Estimated:

Surface Temperature Reduction:

1-3°C

Important:

This is prediction model.

Not actual measurement.

---

# 14. AI Assistant Workflow

Feature:

Chat Assistant

User:

"พื้นที่หลังบ้านร้อนมาก"

AI:

Analyze previous project

Response:

"พื้นที่ของคุณมีพื้นปูน 85%

แนะนำเพิ่มต้นไม้ใหญ่ด้านทิศตะวันตก"

---

# 15. AI Processing Architecture

```
Frontend
|
Upload Image
|
Backend API
|
AI Queue
|
Computer Vision Worker
|
Recommendation Engine
|
Database
|
Frontend Result
```

---

# 16. MVP AI Implementation

Because real AI models require GPU

Initial Development:

Implement

✅ Image Upload

✅ AI Analysis UI

✅ Mock Detection Result

✅ Recommendation System

✅ Green Score

✅ Simulation Placeholder

Replace Later

Mock:

```json
{
  "concrete": 70,
  "green": 30
}
```

Replace:

- YOLO Model
- SAM Model
- Real AI API

---

# 17. AI Model Migration Strategy

Architecture must use Adapter Pattern

Example:

```
AIService
 |
 |
MockAIService
RealAIService
```

Future:

Change model without rewriting system

---

# 18. Accuracy Improvement

Future:

Add:

- More training images
- Local plant dataset
- Thailand environment dataset
- Citizen feedback

---

# 19. AI Ethics

System must:

- Explain recommendation reason
- Avoid misleading prediction
- Protect user images
- Allow image deletion

---

# END DOCUMENT
