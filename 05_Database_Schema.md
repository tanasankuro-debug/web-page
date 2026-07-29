# Database Schema Specification

# Project

GeoHeat AI Green Designer

Version: 1.0

Database:

PostgreSQL + Supabase + PostGIS

---

# 1. Database Overview

## Objective

ออกแบบฐานข้อมูลเพื่อรองรับ:

- User Management
- Garden Analysis Project
- Image Processing
- AI Result
- GIS Environmental Data
- Garden Recommendation
- Plant Database
- Simulation History

---

# 2. Database Architecture

```
Users
  |
Projects
  |
  +----------------+
  |                |
Images      Analysis Results
                   |
             AI Processing
                   |
  +----------------+
  |                |
Garden Design    Heat Data
  |
Plant Database
```

---

# 3. Entity Relationship Diagram (ER Diagram)

```
+-------------+
|   users     |
+-------------+
      |
      | 1:N
      v
+-------------+
|  projects   |
+-------------+
      |
      +----------------+
      |                |
      v                v
+-------------+ +-----------------+
|   images    | | analysis_result |
+-------------+ +-----------------+
                        |
                        v
                 +----------------+
                 | garden_design  |
                 +----------------+
                        |
                        v
                 +----------------+
                 | garden_plants  |
                 +----------------+
```

---

# 4. Database Tables

# Table 1

# users

## Purpose

เก็บข้อมูลผู้ใช้งาน

## Schema

```sql
users
  id UUID PRIMARY KEY
  email TEXT UNIQUE
  full_name TEXT
  avatar_url TEXT
  role TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
```

Role

Values:

- user
- admin
- organization

---

# Table 2

# projects

## Purpose

เก็บโครงการวิเคราะห์พื้นที่ของผู้ใช้

Example:

"สวนหลังบ้าน"

## Schema

```sql
projects
  id UUID PRIMARY KEY
  user_id UUID
  project_name TEXT
  description TEXT
  location GEOGRAPHY(Point)
  address TEXT
  area_size FLOAT
  status TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
```

Relationship:

users 1 : many projects

---

# Table 3

# project_images

## Purpose

เก็บรูปภาพพื้นที่

## Schema

```sql
project_images
  id UUID PRIMARY KEY
  project_id UUID
  image_url TEXT
  image_type TEXT
  upload_order INTEGER
  created_at TIMESTAMP
```

image_type example:

- before
- scan
- generated_after

---

# Table 4

# ai_analysis_results

## Purpose

เก็บผลจาก Computer Vision

## Schema

```sql
ai_analysis_results
  id UUID PRIMARY KEY
  project_id UUID
  image_id UUID
  total_area FLOAT
  green_area FLOAT
  concrete_area FLOAT
  shadow_area FLOAT
  green_percentage FLOAT
  heat_level TEXT
  confidence_score FLOAT
  created_at TIMESTAMP
```

Example Data:

```json
{
  "total_area": 25,
  "green_area": 5,
  "concrete_area": 20,
  "green_percentage": 20,
  "heat_level": "high"
}
```

---

# Table 5

# detected_objects

## Purpose

เก็บ Object Detection จาก YOLO

## Schema

```sql
detected_objects
  id UUID PRIMARY KEY
  analysis_id UUID
  object_type TEXT
  confidence FLOAT
  bbox JSONB
  area_percentage FLOAT
  created_at TIMESTAMP
```

Example:

```json
{
  "type": "tree",
  "confidence": 0.93,
  "bbox": [120, 200, 400, 600]
}
```

---

# Table 6

# segmentation_results

## Purpose

เก็บผล Mask จาก SAM

## Schema

```sql
segmentation_results
  id UUID PRIMARY KEY
  analysis_id UUID
  class_name TEXT
  percentage FLOAT
  mask_url TEXT
  created_at TIMESTAMP
```

Example:

Concrete 75%

Vegetation 25%

---

# Table 7

# geoheat_environment_data

## Purpose

เก็บข้อมูลสิ่งแวดล้อมจาก GeoHeat

## Schema

```sql
geoheat_environment_data
  id UUID PRIMARY KEY
  location GEOGRAPHY(Point)
  temperature FLOAT
  land_surface_temperature FLOAT
  ndvi FLOAT
  heat_index FLOAT
  risk_level TEXT
  record_date DATE
  created_at TIMESTAMP
```

Data Example:

```json
{
  "temperature": 39,
  "lst": 42,
  "ndvi": 0.18,
  "risk": "high"
}
```

---

# Table 8

# garden_designs

## Purpose

เก็บผลการออกแบบสวนจาก AI

## Schema

```sql
garden_designs
  id UUID PRIMARY KEY
  project_id UUID
  style TEXT
  description TEXT
  estimated_cost FLOAT
  cooling_effect TEXT
  generated_image_url TEXT
  created_at TIMESTAMP
```

Garden Style values:

- tropical
- minimal
- japanese
- edible
- modern

---

# Table 9

# plants

## Purpose

ฐานข้อมูลต้นไม้

## Schema

```sql
plants
  id UUID PRIMARY KEY
  name_th TEXT
  name_en TEXT
  category TEXT
  sun_requirement TEXT
  water_requirement TEXT
  maintenance_level TEXT
  cooling_score FLOAT
  image_url TEXT
  description TEXT
```

Example:

```json
{
  "name": "หมากเหลือง",
  "sun": "high",
  "cooling_score": 8.5
}
```

---

# Table 10

# garden_design_plants

## Purpose

เชื่อมสวนกับต้นไม้ (Many-to-Many)

## Schema

```sql
garden_design_plants
  id UUID PRIMARY KEY
  garden_design_id UUID
  plant_id UUID
  quantity INTEGER
  position JSONB
```

---

# Table 11

# green_scores

## Purpose

เก็บคะแนนพื้นที่สีเขียว

## Schema

```sql
green_scores
  id UUID PRIMARY KEY
  project_id UUID
  green_coverage_score FLOAT
  shade_score FLOAT
  cooling_score FLOAT
  diversity_score FLOAT
  total_score FLOAT
  created_at TIMESTAMP
```

Example:

```json
{
  "green_score": 82,
  "shade": 80,
  "cooling": 85
}
```

---

# Table 12

# simulations

## Purpose

เก็บภาพจำลอง Before / After

## Schema

```sql
simulations
  id UUID PRIMARY KEY
  project_id UUID
  before_image TEXT
  after_image TEXT
  prompt TEXT
  model_used TEXT
  created_at TIMESTAMP
```

---

# Table 13

# user_preferences

## Purpose

เก็บความต้องการผู้ใช้

## Schema

```sql
user_preferences
  id UUID PRIMARY KEY
  user_id UUID
  preferred_style TEXT
  budget_range TEXT
  maintenance_level TEXT
  created_at TIMESTAMP
```

---

# 5. GIS Database Design

ใช้ PostGIS Extension

Spatial Data เก็บ:

- จุดตำแหน่งบ้าน
- Heat Map
- Green Area

Example:

```sql
location GEOGRAPHY(Point, 4326)
```

---

# 6. Supabase Storage Structure

Bucket:

geoheat-storage

```
/users/
  {user_id}/
    images/
    simulations/
    exports/
```

---

# 7. Database Security

ใช้ Supabase Row Level Security (RLS)

Rule Example:

User สามารถ SELECT เฉพาะ Project ของตัวเอง

Policy:

```sql
user_id = auth.uid()
```

---

# 8. Indexing

เพื่อเพิ่มความเร็ว

Create Index:

- projects(location)
- geoheat_environment_data(location)
- analysis_results(project_id)

---

# 9. Data Flow

```
User Upload Image
      |
      v
project_images
      |
      v
AI Processing
      |
      v
ai_analysis_results
      |
      v
garden_designs
      |
      v
green_scores
      |
      v
User Dashboard
```

---

# 10. Future Database Expansion

## AR Measurement

เพิ่ม:

```sql
ar_scans
  id
  project_id
  3d_model_url
  measurement_data
```

## IoT Sensor

เพิ่ม:

```sql
temperature_sensors
  sensor_id
  location
  temperature
  humidity
```

## Community Garden

เพิ่ม:

```sql
public_projects
  likes
  comments
  shares
```

---

# 11. Migration Priority

## Phase 1

Create:

- users
- projects
- images
- analysis_results

## Phase 2

Add:

- plants
- garden_designs
- green_scores

## Phase 3

Add:

- AR
- IoT
- Community

---

# END DOCUMENT
