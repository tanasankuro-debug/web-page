# 30_GIS_Integration_Specification.md

# GeoHeat AI Green Designer

## GIS Integration Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดระบบ GIS Integration ของ GeoHeat AI Green Designer

เพื่อให้ระบบสามารถวิเคราะห์ข้อมูลเชิงพื้นที่ เช่น

* อุณหภูมิพื้นผิว
* พื้นที่สีเขียว
* พื้นที่สิ่งปลูกสร้าง
* พื้นที่เสี่ยงความร้อน
* ตำแหน่งพื้นที่ที่เหมาะสมสำหรับการเพิ่มพื้นที่สีเขียว

---

# 2. GIS Role in GeoHeat AI

GIS ทำหน้าที่เป็น Spatial Intelligence Layer

```text
Location

↓

GIS Data

↓

Spatial Analysis

↓

Heat Information

↓

AI Recommendation

↓

Garden Design

```

---

# 3. GIS System Architecture

```text
                    User


                     |

                     ↓


              Interactive Map


                     |

                     ↓


              GIS Processing Layer


        ----------------------------

        |            |             |

        ↓            ↓             ↓


 Satellite     Spatial        User Data

 Data          Analysis       Data


        |

        ↓


    AI Recommendation

```

---

# 4. GIS Technology Stack

## Frontend Map

ใช้:

## Mapbox GL JS

หน้าที่:

* Interactive Map
* Layer Control
* Marker
* Polygon
* Heat Layer

---

## Spatial Database

ใช้:

## PostgreSQL + PostGIS

หน้าที่:

* Geographic Data Storage
* Spatial Query
* Distance Calculation

---

## GIS Data Format

รองรับ:

* GeoJSON
* Raster Data
* Vector Data
* Shapefile

---

# 5. Map Architecture

## Map Component

```text
MapContainer


├── Base Map Layer

├── Heat Layer

├── Green Area Layer

├── Building Layer

├── User Project Layer

└── Analysis Layer

```

---

# 6. Base Map Layer

ข้อมูลพื้นฐาน:

* ถนน
* อาคาร
* สถานที่สำคัญ
* พื้นที่ชุมชน

Source:

* OpenStreetMap
* Mapbox

---

# 7. Satellite Data Integration

## Purpose

ใช้ข้อมูลดาวเทียมเพื่อวิเคราะห์พื้นที่

---

# Data Sources

## Sentinel-2

ใช้สำหรับ:

* Vegetation Analysis
* NDVI

---

## Landsat

ใช้สำหรับ:

* Land Surface Temperature
* Thermal Analysis

---

# 8. NDVI Analysis

## Normalized Difference Vegetation Index

ใช้วิเคราะห์พื้นที่สีเขียว

Formula:

```text
NDVI =

(NIR - RED)

/

(NIR + RED)

```

---

# NDVI Interpretation

| ค่า     | ความหมาย            |
| ------- | ------------------- |
| <0      | น้ำ / สิ่งปลูกสร้าง |
| 0-0.2   | พื้นที่โล่ง         |
| 0.2-0.5 | พืชปานกลาง          |
| >0.5    | พืชหนาแน่น          |

---

# NDVI Layer Example

```json
{
"type":"Feature",

"properties":{

"ndvi":0.65,

"class":"high_green"

}

}
```

---

# 9. NDBI Analysis

## Normalized Difference Built-up Index

ใช้วิเคราะห์พื้นที่สิ่งปลูกสร้าง

Formula:

```text
NDBI =

(SWIR - NIR)

/

(SWIR + NIR)

```

---

# NDBI Interpretation

| ค่า | ความหมาย           |
| --- | ------------------ |
| ต่ำ | พื้นที่ธรรมชาติ    |
| สูง | พื้นที่อาคาร/เมือง |

---

# 10. Land Surface Temperature (LST)

ใช้วิเคราะห์ความร้อนพื้นผิว

Input:

* Thermal Band
* Satellite Image

Output:

```json
{
"temperature":39.5,

"risk":"High"

}
```

---

# 11. Urban Heat Analysis

วิเคราะห์:

* พื้นที่ร้อน
* พื้นที่เย็น
* Heat Island Pattern

---

# Heat Risk Classification

```text
Low

Medium

High

Extreme
```

---

# 12. GeoHeat Composite Index

สร้างคะแนนรวม

## GeoHeat Score

Formula:

```text
GeoHeat Score

=

Heat Factor

+

Built-up Factor

-

Green Factor

```

---

# Components

## Heat Factor

อุณหภูมิพื้นผิว

## Built-up Factor

สิ่งปลูกสร้าง

## Green Factor

พื้นที่สีเขียว

---

# 13. Spatial Analysis Functions

## 13.1 Distance Analysis

ตัวอย่าง:

หา:

"พื้นที่สีเขียวที่ใกล้ที่สุด"

Algorithm:

```text
User Location

↓

Search Radius

↓

Find Green Area

↓

Return Distance

```

---

# 13.2 Buffer Analysis

ตัวอย่าง:

สร้างพื้นที่รอบจุด

```text
Point

↓

500 meter Buffer

↓

Analyze Environment

```

---

# 13.3 Overlay Analysis

รวมข้อมูลหลาย Layer

Example:

```text
Heat Layer

+

Green Layer

+

Building Layer

↓

Risk Map

```

---

# 14. GeoJSON Structure

ตัวอย่างพื้นที่

```json
{
"type":"Feature",

"geometry":{

"type":"Polygon",

"coordinates":[]

},

"properties":{

"heat_score":80,

"green_score":30

}

}
```

---

# 15. GIS Database Design

Table:

```text
gis_layers
```

Columns:

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| name       | TEXT      |
| type       | TEXT      |
| geometry   | GEOGRAPHY |
| metadata   | JSONB     |
| created_at | TIMESTAMP |

---

# 16. Spatial Index

ใช้:

```sql
CREATE INDEX

gis_geometry_index

ON gis_layers

USING GIST(geometry);

```

---

# 17. GIS API Design

## Get Heat Map

Endpoint:

```
GET /api/gis/heat-map
```

Response:

```json
{
"layer":"heat",

"data":[]
}
```

---

# Get Green Area

```
GET /api/gis/green-area
```

---

# Analyze Location

```
POST /api/gis/analyze
```

Input:

```json
{
"latitude":16.432,

"longitude":102.823
}
```

---

# 18. Frontend GIS Components

Structure:

```text
components/gis/


├── MapView.tsx

├── HeatLayer.tsx

├── NDVILayer.tsx

├── GreenLayer.tsx

├── MapControl.tsx

├── LocationPicker.tsx

└── AnalysisPopup.tsx

```

---

# 19. Map Interaction

User สามารถ:

✓ Zoom

✓ Search Location

✓ เลือกพื้นที่

✓ ดู Heat Map

✓ เปิด/ปิด Layer

✓ ดูข้อมูลพื้นที่

---

# 20. AI + GIS Integration

Flow:

```text
GIS Data

+

Camera Analysis

+

User Preference


↓

AI Decision Engine


↓

Garden Recommendation

```

---

# 21. Example AI Decision

Input:

```json
{
"heat":"high",

"ndvi":0.15,

"building_density":"high",

"area_size":20

}
```

AI Output:

```json
{
"recommendation":

"เพิ่มไม้พุ่มและไม้ให้ร่มเงา",

"reason":

"พื้นที่มีความร้อนสูงและพื้นที่สีเขียวน้อย"

}
```

---

# 22. GIS Visualization

แสดงผล:

## Heat Map

แสดงบริเวณร้อน

---

## Green Map

แสดงพื้นที่สีเขียว

---

## Improvement Map

แสดงพื้นที่ที่ควรเพิ่มต้นไม้

---

# 23. Real-time Data Update

รองรับ:

* Weather API
* Temperature Sensor
* User Reports

---

# 24. GIS Data Pipeline

```text
Satellite Data

↓

Preprocessing

↓

GIS Database

↓

Spatial Analysis

↓

API

↓

Web Application

```

---

# 25. GIS Performance Optimization

ใช้:

* Tile Cache
* Spatial Index
* Data Simplification
* Lazy Loading

---

# 26. Security

ป้องกัน:

* Unauthorized GIS Data Access
* API Abuse
* Location Privacy

---

# 27. Future Development

เพิ่ม:

## AR GIS

ดูพื้นที่จริงผ่านกล้อง

---

## Climate Simulation

จำลองผลก่อน-หลังเพิ่มพื้นที่สีเขียว

---

## City Scale Heat Monitoring

วิเคราะห์ระดับเมือง

---

# 28. Implementation Roadmap

## Phase 1

สร้าง:

* Map System
* GeoJSON
* Basic Layers

---

## Phase 2

เพิ่ม:

* NDVI
* Heat Map
* Satellite Data

---

## Phase 3

เชื่อม:

* AI Recommendation
* Prediction Model

---

# 29. Definition of Done

GIS System สมบูรณ์เมื่อ:

✓ Map ทำงาน

✓ Layer แสดงผลได้

✓ Spatial Query ทำงาน

✓ Satellite Data เชื่อมได้

✓ AI ใช้ข้อมูล GIS ได้

✓ Performance ผ่าน

---

# END OF 30_GIS_Integration_Specification.md
