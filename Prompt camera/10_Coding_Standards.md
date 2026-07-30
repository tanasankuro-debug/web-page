# 10_Coding_Standards.md

# GeoHeat AI Green Designer

## Coding Standards & Best Practices

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดมาตรฐานการพัฒนาซอฟต์แวร์ของ GeoHeat AI Green Designer เพื่อให้โค้ดมีคุณภาพ สม่ำเสมอ อ่านง่าย ขยายระบบได้ และพร้อมใช้งานในระดับ Production

ทุกนักพัฒนาและ AI Coding Assistant ต้องปฏิบัติตามมาตรฐานนี้

---

# 2. General Principles

ทุกโค้ดต้องมีคุณสมบัติดังนี้

* Readable
* Maintainable
* Reusable
* Testable
* Performant
* Secure
* Type Safe
* Documented

---

# 3. Project Structure

```
geoheat-ai/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── public/
│
├── backend/
│   ├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── ai/
│   ├── gis/
│   ├── workers/
│   └── tests/
│
├── docs/
├── scripts/
└── docker/
```

---

# 4. Naming Convention

## Files

ใช้ **kebab-case**

ตัวอย่าง

```
project-card.tsx
heat-map.tsx
garden-service.ts
```

---

## Components

ใช้ **PascalCase**

```
ProjectCard
HeatMap
GreenScoreCard
```

---

## Hooks

ใช้ `use` นำหน้า

```
useAuth()
useHeatAnalysis()
useCamera()
```

---

## Variables

ใช้ **camelCase**

```
projectName
greenScore
currentTemperature
```

---

## Constants

ใช้ **UPPER_SNAKE_CASE**

```
MAX_UPLOAD_SIZE
DEFAULT_MAP_ZOOM
API_TIMEOUT
```

---

## Interfaces

ขึ้นต้นด้วย `I`

```
IProject
IUser
IHeatAnalysis
```

---

## Types

ใช้ PascalCase

```
ProjectStatus
HeatLevel
GardenStyle
```

---

## Enums

```
enum HeatLevel {
 LOW,
 MODERATE,
 HIGH,
 EXTREME
}
```

---

# 5. TypeScript Rules

* ห้ามใช้ `any`
* ใช้ `unknown` หากยังไม่ทราบชนิดข้อมูล
* เปิด `strict` mode
* ใช้ Interface สำหรับ Object
* ใช้ Type สำหรับ Union
* Generic ต้องระบุชนิดข้อมูลเสมอ

ตัวอย่าง

```ts
function getProject(id: string): Promise<IProject>
```

---

# 6. React Standards

ใช้ Functional Components เท่านั้น

```tsx
export function ProjectCard() {}
```

ห้ามใช้ Class Component

---

ใช้ Named Export

```tsx
export function Button() {}
```

หลีกเลี่ยง Default Export

---

# 7. Component Rules

หนึ่ง Component ทำหน้าที่เดียว (Single Responsibility)

ทุก Component ต้องมี

* Props Interface
* Loading State
* Error State
* Empty State
* Accessibility
* Responsive Layout

---

# 8. State Management

ใช้

* Zustand สำหรับ Global State
* React Context สำหรับ Theme และ Auth
* TanStack Query สำหรับ Server State

หลีกเลี่ยงการเก็บข้อมูล Server ไว้ใน Global State

---

# 9. API Standards

RESTful API

ตัวอย่าง

```
GET    /projects
POST   /projects
GET    /projects/{id}
PATCH  /projects/{id}
DELETE /projects/{id}
```

Response

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error

```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found"
  }
}
```

---

# 10. Database Standards

* ใช้ UUID เป็น Primary Key
* ทุกตารางมี `created_at`
* ทุกตารางมี `updated_at`
* ใช้ Foreign Key
* เปิด Row Level Security (RLS)
* สร้าง Index ให้คอลัมน์ที่ค้นหาบ่อย

---

# 11. Error Handling

Frontend

* Error Boundary
* Friendly Error Message
* Retry Button

Backend

* HTTP Status ถูกต้อง
* Log Error
* ไม่ส่ง Stack Trace ให้ Client

---

# 12. Logging Standards

ใช้ระดับ Log

* DEBUG
* INFO
* WARNING
* ERROR
* CRITICAL

Log ต้องไม่เปิดเผยข้อมูลสำคัญ เช่น Token หรือ Password

---

# 13. Security Standards

* JWT Authentication
* HTTPS Only
* CSP Header
* Rate Limiting
* Input Validation
* SQL Injection Protection
* XSS Protection
* CSRF Protection (เมื่อเหมาะสม)
* File Upload Validation

---

# 14. File Upload Standards

รองรับ

* JPG
* PNG
* WEBP
* HEIC

ขนาดสูงสุด

20 MB

ตรวจสอบ

* MIME Type
* File Extension
* File Size

ลบ Metadata ที่ไม่จำเป็นก่อนจัดเก็บ

---

# 15. Git Convention

Branch

```
main
develop
feature/*
bugfix/*
hotfix/*
release/*
```

Commit Message

```
feat:
fix:
refactor:
style:
docs:
test:
perf:
build:
ci:
chore:
```

ตัวอย่าง

```
feat: add AI scanner page
fix: resolve map rendering issue
docs: update API specification
```

---

# 16. Code Formatting

ใช้

* ESLint
* Prettier

กฎหลัก

* Indent 2 Spaces
* Semicolon Enabled
* Single Quote
* Trailing Comma (ES5)

---

# 17. Testing Standards

Unit Test

* Vitest

Component Test

* React Testing Library

E2E

* Playwright

เป้าหมาย

* Test Coverage ≥ 90%

---

# 18. Accessibility

ทุกหน้าและทุก Component ต้องผ่าน WCAG 2.2 AA

รองรับ

* Keyboard Navigation
* Screen Reader
* Focus Ring
* ARIA Labels
* Contrast Ratio

---

# 19. Performance

Frontend

* Code Splitting
* Lazy Loading
* Dynamic Import
* Image Optimization

Backend

* Async Processing
* Connection Pool
* Caching
* Database Index

---

# 20. Documentation

ทุก Module ต้องมี

* README.md
* API Documentation
* Architecture Diagram (ถ้ามี)
* Usage Example

ทุก Public Function ต้องมีคำอธิบาย (Doc Comment)

---

# 21. Code Review Checklist

ก่อน Merge ทุก Pull Request

* ไม่มี Type Error
* ไม่มี ESLint Error
* ผ่าน Unit Test
* ผ่าน E2E Test
* ไม่มี Console Error
* Responsive
* Accessibility ผ่าน
* Performance ไม่ลดลง
* เอกสารอัปเดตแล้ว

---

# 22. CI/CD Standards

ทุก Pull Request ต้องผ่าน

* Install Dependencies
* Type Check
* Lint
* Unit Test
* Build
* Security Scan

ห้าม Merge หาก Pipeline ไม่ผ่าน

---

# 23. AI Coding Rules

Claude Code หรือ AI Coding Assistant ต้อง

* ปฏิบัติตาม Coding Standards นี้
* ไม่ใช้ `any`
* ไม่สร้างโค้ดซ้ำ
* ใช้ Component ที่มีอยู่ก่อน
* เพิ่ม Type และ Comment ที่จำเป็น
* ไม่แก้ไข Public API โดยไม่มีเหตุผล
* รักษา Backward Compatibility เมื่อเป็นไปได้

---

# 24. Definition of Done

งานพัฒนาจะถือว่าเสร็จสมบูรณ์เมื่อ

* ผ่าน TypeScript Strict Mode
* ผ่าน ESLint และ Prettier
* ผ่าน Unit Test และ E2E Test
* Responsive ทุกอุปกรณ์
* รองรับ Dark / Light Mode
* ผ่าน Accessibility (WCAG 2.2 AA)
* ไม่มี Critical Bug
* เอกสารอัปเดตครบ
* พร้อม Deploy ขึ้น Production

---

# END OF 10_Coding_Standards.md
