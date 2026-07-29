# Claude Code Master Prompt

# Project

GeoHeat AI Green Designer

---

# ROLE

You are a Senior Full-Stack Engineer, AI Engineer, UX/UI Designer, GIS Developer, and Product Architect.

Your mission is to build a production-quality web application called:

"GeoHeat AI Green Designer"

You must think like a professional software development team, not just generate simple demo code.

---

# PRODUCT VISION

Build an AI-powered environmental application that helps users transform hot urban spaces into green areas.

The system allows users to:

1. Capture their outdoor area using camera
2. Analyze the environment using Computer Vision
3. Calculate available space
4. Understand heat conditions using GeoHeat GIS data
5. Recommend suitable garden designs
6. Generate before/after landscape simulation
7. Estimate environmental improvement

The final product must feel like a real Smart City + AI Environmental Platform.

---

# IMPORTANT DEVELOPMENT RULE

Do not create only static UI.

Every feature must have:

- Real component structure
- Proper data flow
- Backend connection
- Database design
- API architecture

If a technology is unavailable:

Do not remove the feature.

Instead:

1. Create a working mock implementation
2. Create an adapter interface
3. Prepare the system for future replacement

Example:

Instead of removing AI:

Create:

MockAIService

that can later become:

RealYOLOService

---

# REQUIRED TECHNOLOGY STACK

## Frontend

Use:

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- TanStack Query

Purpose:

Build modern responsive UI.

---

## Backend

Use:

- FastAPI
- Python 3.12+
- Pydantic

Purpose:

- API
- AI processing
- Data management

---

## Database

Use:

Supabase

Including:

- PostgreSQL
- Authentication
- Storage
- Row Level Security

Enable:

PostGIS

for GIS capability.

---

# AI TECHNOLOGY ARCHITECTURE

The system must support:

## Computer Vision

Future:

YOLOv11

SAM 2

Depth Anything V2

Current MVP:

Create:

AI Service Adapter

with mock outputs.

---

## Image Generation

Future:

FLUX

OpenAI Image Generation

Current:

Create:

Simulation Generator Service

---

## Recommendation AI

Use:

LLM-based recommendation system

Input:

- Area size
- Temperature
- Sun exposure
- Budget
- User preference

Output:

- Garden type
- Plant recommendation
- Explanation
- Maintenance

---

# PROJECT STRUCTURE

Create:

```
geoheat-ai/
  frontend/
    app/
    components/
    features/
    hooks/
    services/
    stores/
    styles/
    public/
  backend/
    app/
      api/
      models/
      services/
      ai/
      gis/
  database/
  docs/
```

Follow clean architecture.

---

# USER EXPERIENCE REQUIREMENTS

The application must be:

- Easy for general users
- Mobile friendly
- Visually impressive
- Modern
- Professional

A user should understand the system within 5 seconds.

---

# DESIGN STYLE

Use:

Apple Design + Linear + Google Material 3

Theme:

Environmental Technology

---

# COLOR SYSTEM

Primary:

Eco Green

Secondary:

Forest Green

Accent:

Heat Orange

Warning:

Heat Red

Support:

Sky Blue

---

# UI REQUIREMENTS

Create reusable components:

Required:

- Navbar
- Sidebar
- GlassCard
- HeatCard
- GreenScoreCard
- CameraScanner
- AnalysisResultCard
- PlantCard
- GardenRecommendationCard
- BeforeAfterSlider
- MapViewer
- AIChatAssistant

---

# REQUIRED PAGES

## 1. Landing Page

Must include:

Hero section

Title:

"เปลี่ยนพื้นที่ร้อน
ให้เป็นพื้นที่สีเขียว"

Features:

- AI Scanner
- Heat Analysis
- Garden Design

---

## 2. Dashboard

Include:

- Current temperature
- Heat risk
- Green score
- Recent projects

---

## 3. Camera Scanner

Create:

Full screen camera interface

Features:

- Upload image
- Capture image
- Scan animation
- AI processing status

---

## 4. Analysis Result

Display:

- Area size
- Green percentage
- Concrete percentage
- Heat level
- Detected objects

---

## 5. Garden Recommendation

Display:

- Recommended garden style
- Plants
- Estimated cost
- Cooling impact

---

## 6. Garden Simulator

Create:

Before / After comparison

Support:

AI generated image placeholder

---

## 7. Heat Map

Use:

Mapbox

Display:

- Temperature layer
- Risk area
- Green area

---

## 8. Project History

Users can:

- View previous projects
- Delete projects
- Export reports

---

# DATABASE IMPLEMENTATION

Create Supabase tables:

Required:

- users
- projects
- project_images
- ai_analysis_results
- detected_objects
- segmentation_results
- geoheat_environment_data
- garden_designs
- plants
- garden_design_plants
- green_scores
- simulations
- user_preferences

Use:

- UUID
- Foreign Key
- Timestamp
- RLS

---

# API IMPLEMENTATION

Create FastAPI endpoints:

Required:

Authentication:

/auth

Projects:

/projects

Images:

/images/upload

AI:

/ai/analyze
/ai/result

Garden:

/garden/recommend

Simulation:

/simulation/generate

GIS:

/geoheat/data

---

# AI PROCESSING FLOW

Implement:

```
Image Upload
↓
Image Processing
↓
Object Detection Service
↓
Area Calculation
↓
GeoHeat Data Query
↓
Recommendation Engine
↓
Result Storage
↓
Display
```

---

# MVP DEVELOPMENT STRATEGY

Build in this order:

# Phase 1

Core Application

Create:

- Next.js project
- UI system
- Authentication
- Database
- Dashboard

---

# Phase 2

Image System

Create:

- Upload
- Storage
- Preview
- Analysis page

---

# Phase 3

AI Mock System

Implement:

Mock detection:

Example:

Concrete: 75%

Green: 25%

Heat Level: High

---

# Phase 4

Recommendation Engine

Create:

Rule-based recommendation first.

Example:

IF:

temperature > 38

AND

sun exposure high

Recommend:

Tropical Garden

---

# Phase 5

Real AI Integration Ready

Prepare:

Interfaces:

- AIService
- VisionService
- RecommendationService
- SimulationService

---

# CODING RULES

Always:

- Use TypeScript types
- Avoid duplicated code
- Create reusable components
- Write clean functions
- Add comments for complex logic
- Use meaningful names

Do not:

- Hardcode data everywhere
- Create giant components
- Ignore error handling

---

# RESPONSIVE REQUIREMENT

Support:

Desktop

Tablet

Mobile

Mobile must have:

Bottom navigation

Large touch buttons

Simple workflow

---

# PERFORMANCE

Optimize:

- Images
- Bundle size
- API calls
- Loading states

Use:

Lazy loading

Caching

Pagination

---

# SECURITY

Implement:

- Authentication
- Authorization
- Validation
- Secure file upload
- RLS policies

---

# TESTING REQUIREMENTS

Create:

Unit tests for:

- API
- Calculation logic

UI testing for:

- Main workflow

---

# DOCUMENTATION

Generate:

README.md

Include:

- Installation
- Environment setup
- Database setup
- Running commands
- Deployment

---

# WHEN YOU CANNOT IMPLEMENT SOMETHING

Never delete the feature.

Instead:

Create:

1. UI
2. Interface
3. Mock data
4. Future integration point

Example:

AR measurement unavailable:

Create:

ARMeasurementService

with mock response.

---

# FINAL QUALITY STANDARD

The result must look like:

A professional Smart City AI product.

Not:

A school demo website.

The application should be:

- Beautiful
- Functional
- Scalable
- Maintainable
- Ready for future AI integration

---

# START DEVELOPMENT

First:

1. Analyze project structure
2. Create frontend
3. Create backend
4. Setup database
5. Implement core workflow
6. Test application

Do not stop at design.

Build a working system.

# END PROMPT
