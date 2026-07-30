# 22_Frontend_Implementation_Specification.md

# GeoHeat AI Green Designer

## Frontend Implementation Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดแนวทางการพัฒนา Frontend ของ GeoHeat AI Green Designer

เป้าหมายคือสร้าง Web Application ที่มี

* Modern UI
* Responsive Design
* AI Interaction
* GIS Visualization
* Smooth User Experience
* Production Ready Architecture

---

# 2. Frontend Technology Stack

## Core Framework

```text
Next.js 15
React 19
TypeScript
```

---

## Styling

```text
Tailwind CSS

shadcn/ui

Framer Motion
```

---

## State Management

ใช้

```text
Zustand
```

สำหรับ

* User State
* Project State
* Analysis State
* UI State

---

## Data Fetching

ใช้

```text
TanStack Query
```

สำหรับ

* API Request
* Cache
* Loading State
* Error Handling

---

## Form Handling

ใช้

```text
React Hook Form

+

Zod Validation
```

---

## Visualization

ใช้

```text
Chart.js

Recharts

Mapbox GL JS
```

---

# 3. Frontend Architecture

```text
frontend/

app/

├── page.tsx

├── dashboard/

├── projects/

├── scanner/

├── analysis/

├── garden/

├── map/

├── reports/


components/

├── ui/

├── layout/

├── dashboard/

├── scanner/

├── ai/

├── garden/

├── gis/

└── charts/


lib/

├── api/

├── utils/

├── constants/


hooks/

stores/

types/

```

---

# 4. Application Layout

ทุกหน้าหลัง Login ใช้ Layout เดียวกัน

```text
--------------------------------

Navbar

--------------------------------

Sidebar

        Content Area


--------------------------------

```

---

# 5. Global UI System

## Theme

หลักการออกแบบ

### Primary Color

Green

สื่อถึง

* ธรรมชาติ
* Sustainability
* Environment

### Secondary

Blue

สื่อถึง

* Temperature
* GIS
* Data

### Accent

Orange

สื่อถึง

* Heat
* Warning

---

# 6. Global Components

---

# 6.1 Navbar

Component

```text
Navbar.tsx
```

ประกอบด้วย

* Logo
* Search
* Notification
* Profile

State

```typescript
{
user,
notificationCount
}
```

---

# 6.2 Sidebar

Menu

```text
Dashboard

Projects

AI Scanner

Garden Designer

Heat Map

Reports

Settings
```

Responsive

Desktop:

Sidebar Fixed

Mobile:

Drawer

---

# 6.3 GlassCard

ใช้เป็น Component หลัก

Props

```typescript
{
title,
description,
children,
icon,
variant
}
```

ใช้สำหรับ

* Score Card
* AI Result
* Recommendation Card

---

# 7. Landing Page

Route

```text
/
```

Purpose

แนะนำระบบ

Components

```text
HeroSection

FeatureSection

BeforeAfterSection

AIExplanation

CTASection
```

---

# Hero Section

แสดง

Title

```
Design Cooler Green Spaces With AI
```

Button

```
Start Designing
```

Animation

* Fade In
* Floating Elements

---

# 8. Authentication Pages

Routes

```text
/login

/register
```

---

## Login Component

Fields

* Email
* Password

Actions

```text
Login

Google Login
```

---

# 9. Dashboard Page

Route

```text
/dashboard
```

Purpose

ศูนย์กลางระบบ

---

# Dashboard Layout

```text
Dashboard Header


↓

Overview Cards


↓

Quick Actions


↓

Recent Projects


↓

AI Recommendation
```

---

# Components

## GreenScoreCard

แสดง

```text
Green Score

82/100
```

---

## HeatStatusCard

แสดง

```text
Heat Risk

High
```

---

## ProjectCard

ข้อมูล

* Image
* Name
* Score
* Date

---

# API Integration

เมื่อเปิดหน้า

เรียก

```http
GET /projects

GET /dashboard/statistics
```

---

# 10. Project Page

Route

```text
/projects/[id]
```

Purpose

ดูรายละเอียดพื้นที่

---

Components

```text
ProjectHeader

ImageGallery

AnalysisSummary

RecommendationPreview

DesignPreview
```

---

# 11. AI Scanner Page

Route

```text
/scanner
```

Purpose

ถ่ายภาพและวิเคราะห์

---

# Scanner Flow

```text
Select Camera

↓

Capture Image

↓

Preview

↓

Upload

↓

Processing

↓

Result
```

---

Components

## CameraView

Features

* Camera Access
* Capture Button
* Flash Control

---

## UploadZone

รองรับ

* Drag Drop
* File Upload

---

## ProcessingAnimation

แสดง

```
AI is analyzing your space...
```

Animation

* Progress Ring
* Loading Particles

---

# API

Upload

```http
POST /images/upload
```

Analysis

```http
POST /analysis/start
```

---

# 12. Analysis Result Page

Route

```text
/analysis/[id]
```

---

Components

## ImageAnalysisViewer

แสดง

* Original Image
* AI Detection Layer

---

## GreenCoverageChart

Chart

ข้อมูล

```text
Green

Concrete

Empty
```

---

## HeatRiskCard

แสดง

* Risk Level
* Explanation

---

## GreenScoreGauge

Circular Progress

---

# 13. Garden Designer Page

Route

```text
/garden/[projectId]
```

---

Purpose

ออกแบบสวน

---

# Layout

```text
Left Panel

Settings


Right Panel

Preview
```

---

# Settings

Components

## GardenStyleSelector

Options

* Tropical
* Minimal
* Japanese
* Vertical

---

## BudgetSelector

Low

Medium

High

---

## MaintenanceSelector

Easy

Medium

Advanced

---

# API

Generate Design

```http
POST /garden/design
```

---

# 14. AI Visualization Page

Route

```text
/garden/result/[id]
```

---

Components

## BeforeAfterSlider

แสดง

Before

↓

After

---

## DesignExplanation

AI Explanation

---

## PlantList

Plant Cards

---

# 15. GIS Map Page

Route

```text
/map
```

---

Components

## HeatMap

ใช้

Mapbox

---

Layers

```text
Temperature

Green Area

Cooling Zone

Hospital
```

---

Controls

* Zoom
* Layer Toggle
* Search Location

---

# API

```http
GET /gis/heat-map

GET /gis/cooling-area
```

---

# 16. Report Page

Route

```text
/reports
```

---

Components

## ReportCard

แสดง

* Date
* Project
* Status

---

## PDFViewer

Preview Report

---

API

Generate

```http
POST /reports/generate
```

Download

```http
GET /reports/{id}
```

---

# 17. Global Loading System

ทุก Async Operation ต้องมี

## Skeleton Loading

ใช้สำหรับ

* Dashboard
* Cards
* Charts

---

## AI Processing Loading

ใช้

* Progress Bar
* Status Text

---

# 18. Error Handling UI

สร้าง Component

```text
ErrorState.tsx
```

รองรับ

* API Error
* Upload Error
* AI Error
* Network Error

---

# 19. Mobile Responsive Design

Breakpoint

```text
Mobile

<640px


Tablet

640-1024px


Desktop

>1024px
```

---

Mobile Priority

ต้องรองรับ

* Camera
* Touch
* Swipe
* Bottom Navigation

---

# 20. Accessibility

ต้องมี

* Keyboard Navigation
* Alt Text
* Contrast Ratio
* Screen Reader Support

---

# 21. Performance Optimization

Frontend ต้องใช้

* Dynamic Import
* Lazy Loading
* Image Optimization
* Component Memoization

---

# 22. Frontend Development Order

## Sprint 1

Foundation

สร้าง

* Next.js Setup
* Theme
* Layout
* Components

---

## Sprint 2

Authentication

สร้าง

* Login
* Register
* User State

---

## Sprint 3

Dashboard

สร้าง

* Cards
* Projects
* Statistics

---

## Sprint 4

AI Scanner

สร้าง

* Camera
* Upload
* Analysis UI

---

## Sprint 5

Garden Designer

สร้าง

* Selection
* Preview
* Result

---

## Sprint 6

GIS + Reports

สร้าง

* Map
* PDF
* Analytics

---

# 23. Definition of Done

Frontend Implementation สมบูรณ์เมื่อ

✓ ทุกหน้าใช้งานได้

✓ Responsive ทุก Device

✓ เชื่อม API ได้

✓ State Management พร้อม

✓ Component Reusable

✓ UI ตรง Design System

✓ พร้อมเชื่อม AI Backend

---

# END OF 22_Frontend_Implementation_Specification.md
