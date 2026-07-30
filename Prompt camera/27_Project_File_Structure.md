# 27_Project_File_Structure.md

# GeoHeat AI Green Designer

## Project File Structure Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดโครงสร้างไฟล์และ Folder ของโปรเจกต์ GeoHeat AI Green Designer

เป้าหมาย:

* ให้ Codebase เป็นระบบ
* รองรับการขยายระบบในอนาคต
* แยกหน้าที่แต่ละ Module ชัดเจน
* รองรับทีมพัฒนา
* ง่ายต่อการ Debug และ Maintenance

---

# 2. Root Project Structure

```text
geoheat-ai/

│

├── frontend/

├── backend/

├── ai-engine/

├── database/

├── docs/

├── tests/

├── assets/

├── scripts/

├── docker/

│

├── .gitignore

├── README.md

├── docker-compose.yml

└── LICENSE

```

---

# 3. Frontend Structure

Technology:

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui

Structure:

```text
frontend/

│

├── app/

│

├── components/

│

├── features/

│

├── hooks/

│

├── lib/

│

├── stores/

│

├── types/

│

├── utils/

│

├── public/

│

├── styles/

│

├── package.json

├── next.config.ts

├── tailwind.config.ts

└── tsconfig.json

```

---

# 4. Frontend App Router Structure

```text
app/

│

├── layout.tsx

├── page.tsx

│

├── (auth)/

│   ├── login/

│   └── register/

│

├── dashboard/

│

├── projects/

│

│   └── [id]/

│

├── scanner/

│

├── analysis/

│

│   └── [id]/

│

├── garden/

│

│   └── [projectId]/

│

├── map/

│

├── reports/

│

└── settings/

```

---

# 5. Component Structure

```text
components/

│

├── ui/

│
├── button.tsx
├── card.tsx
├── modal.tsx
├── input.tsx


│

├── layout/

│
├── navbar.tsx
├── sidebar.tsx
├── mobile-menu.tsx


│

├── dashboard/

│
├── GreenScoreCard.tsx
├── HeatStatusCard.tsx
├── ProjectCard.tsx


│

├── scanner/

│
├── CameraView.tsx
├── UploadZone.tsx
├── ProcessingAnimation.tsx


│

├── garden/

│
├── GardenStyleSelector.tsx
├── PlantCard.tsx
├── DesignPreview.tsx


│

├── gis/

│
├── HeatMap.tsx
├── MapControl.tsx


│

└── charts/

    ├── GreenScoreChart.tsx
    └── HeatChart.tsx

```

---

# 6. Feature-Based Structure

สำหรับ Feature ใหญ่

```text
features/


├── authentication/

│
├── api.ts
├── hooks.ts
├── types.ts


├── projects/

├── scanner/

├── analysis/

├── recommendation/

├── garden/

├── gis/

└── reports/

```

---

# 7. Frontend API Layer

```text
lib/

├── api/

│
├── client.ts

├── auth.ts

├── projects.ts

├── images.ts

├── analysis.ts

├── garden.ts

├── reports.ts

└── gis.ts

```

---

# 8. State Management

ใช้ Zustand

```text
stores/


├── authStore.ts

├── projectStore.ts

├── analysisStore.ts

├── gardenStore.ts

└── uiStore.ts

```

---

# 9. Backend Structure

Technology:

* FastAPI
* Python 3.12
* PostgreSQL

Structure:

```text
backend/


├── app/


│
├── main.py


│
├── api/


│
├── core/


│
├── models/


│
├── schemas/


│
├── services/


│
├── repositories/


│
├── middleware/


│
├── workers/


│
├── utils/


│
└── tests/


│

├── requirements.txt

├── Dockerfile

└── .env

```

---

# 10. Backend API Structure

```text
app/api/


├── auth.py

├── users.py

├── projects.py

├── images.py

├── analysis.py

├── recommendation.py

├── garden.py

├── reports.py

├── gis.py

└── tasks.py

```

---

# 11. Backend Service Layer

```text
services/


├── auth_service.py

├── image_service.py

├── vision_service.py

├── heat_service.py

├── recommendation_service.py

├── garden_service.py

├── report_service.py

└── gis_service.py

```

---

# 12. AI Engine Structure

ใช้สำหรับ AI Processing

```text
ai-engine/


├── models/


│
├── yolo/

├── sam/

├── classifiers/


│

├── pipelines/


│
├── image_analysis.py

├── area_calculation.py

├── heat_prediction.py


│

├── prompts/


│
├── plant_prompt.txt

├── garden_prompt.txt

├── report_prompt.txt


│

├── inference/


│
├── detector.py

├── segmenter.py


│

├── requirements.txt

└── Dockerfile

```

---

# 13. AI Pipeline Structure

```text
AI Pipeline


Image

↓

Preprocessing

↓

Object Detection

↓

Segmentation

↓

Feature Extraction

↓

Heat Analysis

↓

Recommendation

↓

Result

```

---

# 14. Database Structure

```text
database/


├── migrations/


├── seed/


├── schema.sql


├── functions.sql


└── policies.sql

```

---

# 15. Database Seed Data

```text
database/seed/


├── plants.json

├── garden_styles.json

├── heat_categories.json

└── demo_projects.json

```

---

# 16. Documentation Structure

```text
docs/


├── 01_Product_Requirements.md

├── 02_UX_UI_Design.md

├── 03_System_Architecture.md

...

├── 26_Deployment_Architecture.md

└── 27_Project_File_Structure.md

```

---

# 17. Testing Structure

```text
tests/


├── frontend/


├── backend/


├── ai/


├── integration/


└── performance/

```

---

# 18. Assets Structure

```text
assets/


├── images/


│
├── demo/

├── examples/


├── icons/


├── logos/


└── screenshots/

```

---

# 19. Scripts Structure

```text
scripts/


├── setup.sh

├── migrate-db.sh

├── seed-db.sh

├── deploy.sh

└── test.sh

```

---

# 20. Docker Structure

```text
docker/


├── frontend.Dockerfile

├── backend.Dockerfile

├── ai.Dockerfile

└── nginx.conf

```

---

# 21. Environment Configuration

Root

```text
.env.example
```

ประกอบด้วย

```env
DATABASE_URL=

SUPABASE_URL=

SUPABASE_KEY=

JWT_SECRET=

AI_API_KEY=

MAPBOX_TOKEN=

STORAGE_BUCKET=

```

---

# 22. Git Branch Strategy

ใช้

```text
main

↓

production


develop

↓

development


feature/*

↓

new features

```

---

# 23. Naming Convention

## React Component

ใช้ PascalCase

ตัวอย่าง

```text
GreenScoreCard.tsx
```

---

## Function

ใช้ camelCase

ตัวอย่าง

```typescript
calculateGreenScore()
```

---

## Python

ใช้ snake_case

ตัวอย่าง

```python
analyze_image()
```

---

# 24. Code Organization Rule

หลักการ

## ห้าม

* เขียน Logic ใน Component ใหญ่
* รวม API กับ UI
* Hardcode Data

---

## ต้อง

* แยก Service
* ใช้ Reusable Component
* ใช้ Type Definition

---

# 25. Development Workflow

```text
Create Feature


↓

Create Branch


↓

Implement


↓

Test


↓

Pull Request


↓

Merge


↓

Deploy

```

---

# 26. Initial Setup Order

Claude Code ต้องสร้างตามลำดับ

## Step 1

สร้าง Root Structure

## Step 2

สร้าง Frontend

## Step 3

สร้าง Backend

## Step 4

เชื่อม Database

## Step 5

สร้าง AI Engine

## Step 6

Setup Deployment

---

# 27. Definition of Done

Project Structure สมบูรณ์เมื่อ

✓ Folder แยกชัดเจน

✓ Frontend พร้อมพัฒนา

✓ Backend พร้อม API

✓ AI Module แยกอิสระ

✓ Database Version Control

✓ Documentation ครบ

✓ รองรับ Production

---

# END OF 27_Project_File_Structure.md
