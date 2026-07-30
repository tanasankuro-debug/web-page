# 08_Component_Library.md

# Part 1 — Design System, Theme, Tokens, Layout & Base Components

Project: GeoHeat AI Green Designer
Version: 1.0
Target Framework:
- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide Icons

---

# 1. Design Philosophy

GeoHeat AI Green Designer ต้องเป็น Web Application ระดับ Production

Design Goal

- Modern
- Premium
- Scientific
- Environmental
- AI Product
- Easy to understand
- Beautiful
- Fast

UI ต้องทำให้ผู้ใช้เข้าใจได้ภายใน 5 วินาที

ไม่ใช่ Dashboard ธรรมดา

แต่ต้องเหมือน Product จริงของบริษัท Technology

---

# 2. Design Principles

ทุก Component ต้องมี

✓ Reusable
✓ Typed
✓ Responsive
✓ Accessible
✓ Animated
✓ Theme-aware
✓ Error State
✓ Loading State
✓ Empty State
✓ Skeleton
✓ Keyboard Support
✓ Mobile Friendly

---

# 3. Theme System

Theme ต้องรองรับ

- Light Mode
- Dark Mode
- System Mode

ใช้ next-themes

ห้าม Hardcode สี

ใช้ Design Token เท่านั้น

---

# 4. Color Tokens

## Primary

Eco Green

- 500 `#22C55E`
- 600 `#16A34A`
- 700 `#15803D`

Forest

- 500 `#166534`
- 600 `#14532D`
- 700 `#052E16`

Heat Orange: `#F97316`

Heat Red: `#EF4444`

Sky Blue: `#0EA5E9`

Yellow: `#FACC15`

Background

- Light `#F8FAFC`
- Dark `#020617`

Card

- Light `#FFFFFF`
- Dark `#0F172A`

Border

- Light `#E2E8F0`
- Dark `#334155`

Success: `#22C55E`

Warning: `#F59E0B`

Danger: `#EF4444`

Info: `#3B82F6`

---

# 5. Typography

Primary Font: Prompt

Secondary: Inter

Fallback: sans-serif

Heading

- Hero 64 Bold
- H1 48 Bold
- H2 36 SemiBold
- H3 30 SemiBold
- H4 24 Medium
- Body Large 18 Regular
- Body 16 Regular
- Small 14 Regular
- Caption 12 Regular

---

# 6. Spacing System

Base: 8px

Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

---

# 7. Radius

xs 4, sm 8, md 12, lg 16, xl 20, 2xl 24, 3xl 32, Full 999

---

# 8. Shadow

- Small — Card
- Medium — Modal
- Large — Floating
- Extra Large — Hero

---

# 9. Glassmorphism Standard

Glass Card

- Background: white/70
- Dark: slate900/70
- Blur: 20px
- Border: 1px
- Shadow: Large
- Radius: 24

---

# 10. Animation Standard

Use Framer Motion

- Page 0.30s
- Card 0.20s
- Hover Scale 1.02
- Button 0.15s
- Modal 0.25s
- Drawer 0.30s
- Toast 0.20s
- Loading Infinite

No animation longer than 500ms

---

# 11. Responsive Breakpoints

- Mobile 0-639
- Tablet 640-1023
- Laptop 1024-1439
- Desktop 1440+
- Ultra Wide 1920+

---

# 12. Container

- Maximum Width: 1440px
- Center: Auto
- Padding: 24 Desktop / 16 Tablet / 12 Mobile

---

# 13. Grid System

- Desktop 12 Columns
- Tablet 8 Columns
- Mobile 4 Columns
- Gap 24

---

# 14. Layout Structure

App: Navbar → Sidebar → Content → Footer

Mobile: Top Bar → Content → Bottom Navigation

---

# 15. Folder Structure

```
components/
  ui/
  layout/
  cards/
  forms/
  buttons/
  dialogs/
  map/
  charts/
  ai/
  garden/
  heat/
  scanner/
  common/
  feedback/
```

---

# 16. Base Component Rules

Every Component Must Have:

TypeScript Interface, Props, Default Props, Accessibility, Animation,
Loading, Error, Empty, Dark Mode, Responsive, Storybook Ready

---

# 17. Button Component

Name: Button

Variants: Primary, Secondary, Outline, Ghost, Destructive, Success, Heat, Gradient

Sizes: xs, sm, md, lg, xl

Props: variant, size, loading, disabled, iconLeft, iconRight, fullWidth, animation

Example:

```tsx
<Button variant="primary" size="lg" />
```

Hover: Scale, Shadow, Gradient

Disabled: Opacity 40%, Cursor not-allowed

Loading: Spinner, Button Disabled

---

# 18. Icon Button

Component: IconButton

Shape: Circle, Rounded, Square

States: Hover, Focus, Pressed, Disabled, Loading

---

# 19. Card Component

Component: GlassCard

Props: title, subtitle, icon, footer, loading, children

Variants: Glass, Solid, Outline, Heat, Success

Padding: 24

Radius: 24

Shadow: Blur

---

# 20. Section Component

Purpose: Standard Page Section

Props: title, description, action, children

Spacing: 64

---

# 21. Page Header

Contains: Title, Subtitle, Breadcrumb, Action Button

Responsive

---

# 22. Divider

Horizontal, Vertical, Gradient, Animated

---

# 23. Badge

Variants: Success, Heat, Warning, Danger, Neutral

Rounded: Small, Medium, Large

---

# 24. Chip

Interactive, Selectable, Removable, Filter Chip

---

# 25. Avatar

Sizes: 32, 40, 48, 64, 96

Support: Image, Fallback, Initial

---

# 26. Tooltip

Delay: 300ms

Arrow: True

Animation: Fade

---

# 27. Popover

Animation: Scale + Fade

Close on outside click

ESC Support

---

# 28. Modal

Component: AppModal

Props: open, title, description, children, footer, loading

Size: sm, md, lg, xl, fullscreen

Animation: Fade, Scale

---

# 29. Drawer

Desktop: Right Side

Mobile: Bottom Sheet

---

# 30. Tabs

Animated Indicator, Keyboard Navigation, Lazy Render

---

# 31. Accordion

Smooth Height Animation, Support Multiple

---

# 32. Alert

Variants: Info, Warning, Danger, Success

---

# 33. Toast

Top Right, Mobile Bottom, Auto Close, Progress Bar

---

# 34. Skeleton

Types: Card, Table, Avatar, Chart, Heat Map, Plant Card

---

# 35. Empty State

Illustration, Title, Description, CTA, Animation

---

# 36. Error State

Icon, Title, Description, Retry Button

---

# 37. Loading State

Spinner, Progress, Skeleton, Processing Animation

---

# 38. Search Box

Rounded, Glass Style, Search Icon, Clear Button, Loading Indicator

---

# 39. Input Component

Support: Text, Number, Email, Password, Search

Props: label, placeholder, error, helperText, required, disabled, prefix, suffix

---

# 40. TextArea

Auto Resize, Character Counter, Validation

---

# 41. Select

Searchable, Keyboard, Multi Select

---

# 42. Checkbox

Animated, Accessible

---

# 43. Switch

Smooth Animation, Theme Aware

---

# 44. Radio Group

Keyboard Support

---

# 45. Progress Bar

Linear, Circular, Animated, Gradient

---

# 46. Circular Progress

Use: Green Score, Heat Score, AI Confidence

---

# 47. Status Indicator

Online, Offline, Processing, Completed, Failed, Pending

Animated Pulse

---

# 48. Accessibility

Every Component Must Have:

ARIA Label, Tab Navigation, Visible Focus Ring, Keyboard Support,
Screen Reader Friendly, Color Contrast AA, Reduced Motion Support

---

# 49. Motion Guideline

Never Animate Everything

Animate Only: Hover, Page Transition, Modal, Drawer, Cards, Important Feedback

Respect `prefers-reduced-motion`

---

# 50. Performance Rules

Lazy Load Heavy Components: Map, Charts, 3D, Camera, AI

Memoize Large Lists

Virtualize When Needed

---

# 51. Component Naming Convention

Good: GlassCard, HeatStatusCard, GreenScoreCard, CameraScanner,
AIAnalysisCard, GardenCard, ProjectCard, MapToolbar, ThemeSwitcher

Bad: Card2, CardNew, Box, Container2

---

# 52. Export Convention

Each Component: index.ts, Component.tsx, types.ts, hooks.ts, constants.ts,
README.md, stories.tsx

---

# 53. Definition of Done

A Component is complete only when:

✓ Fully Typed
✓ Responsive
✓ Dark Mode
✓ Light Mode
✓ Accessible
✓ Keyboard Support
✓ Loading State
✓ Empty State
✓ Error State
✓ Animation
✓ Unit Test Ready
✓ Storybook Ready
✓ No Console Errors
✓ Reusable
✓ Production Ready

---

END OF PART 1

# 08_Component_Library.md

## Part 2 — Navigation Components & Dashboard Components

Project: **GeoHeat AI Green Designer**
Version: **1.0**

---

# 45. Navigation System

Navigation ของระบบต้องรองรับ

* Desktop
* Tablet
* Mobile
* Touch Device
* Keyboard Navigation

ทุก Navigation Component ต้องรองรับ

* Active State
* Hover State
* Focus State
* Disabled State
* Loading State
* Collapse State
* Dark / Light Mode

Animation ใช้ Framer Motion

---

# 46. Top Navigation (Navbar)

Component

Navbar

Purpose

Navigation หลักของระบบ

Height

72px

Position

Sticky Top

Blur Background

Glass Effect

Layout

Left

* Logo
* Project Name

Center

* Search
* Quick Navigation

Right

* Notification
* Theme Switch
* User Avatar

Responsive

Desktop

แสดงครบทุกเมนู

Tablet

ซ่อน Search

Mobile

แสดงเฉพาะ

* Menu Button
* Logo
* Notification
* Avatar

---

# 47. Sidebar

Component

AppSidebar

Purpose

Navigation หลักของ Dashboard

Width

Expanded

280px

Collapsed

80px

Animation

Collapse

250ms

Menu

🏠 Dashboard

📷 AI Scanner

🌳 Garden Designer

🔥 Heat Map

📊 Analysis

🌱 Plant Library

📁 Projects

📈 Reports

⚙ Settings

❓ Help

Bottom

Profile

Logout

State

Expanded

Collapsed

Floating (Mobile)

---

# 48. Mobile Bottom Navigation

Component

BottomNavigation

Items

Home

Scanner

Garden

Map

Profile

Height

72px

Safe Area Support

Yes

Animation

Icon Scale

Badge

Notification Support

---

# 49. Breadcrumb

Component

Breadcrumb

Purpose

แสดงตำแหน่งหน้าปัจจุบัน

Example

Dashboard

>

Projects

>

Backyard Analysis

Support

Dynamic Route

Responsive

---

# 50. Search Command

Component

CommandPalette

Shortcut

Ctrl + K

Features

* Search Project
* Search Plant
* Search Page
* Search Command

Animation

Scale + Fade

---

# 51. Notification Center

Component

NotificationPanel

Types

Information

Warning

Success

Error

AI Completed

Analysis Ready

Garden Generated

Unread Badge

Support Infinite Scroll

---

# 52. User Menu

Component

UserDropdown

Items

Profile

Settings

Appearance

Language

Help

Logout

---

# 53. Theme Switcher

Modes

Light

Dark

System

Animation

Sun / Moon Morph

---

# 54. Dashboard Layout

Desktop

Navbar

↓

Sidebar

↓

Dashboard Grid

↓

Footer

Mobile

Top Bar

↓

Dashboard Cards

↓

Bottom Navigation

---

# 55. Dashboard Grid

Desktop

12 Columns

Tablet

8 Columns

Mobile

1 Column

Gap

24px

Cards

Responsive

---

# 56. Dashboard Hero

Component

DashboardHero

Purpose

สรุปภาพรวมของระบบ

ประกอบด้วย

Greeting

Current Date

Weather Summary

Heat Status

Green Score

Quick Action

Background

Animated Gradient

Glass Overlay

---

# 57. Heat Status Card

Component

HeatStatusCard

Purpose

แสดงข้อมูลอุณหภูมิ

Fields

Current Temperature

Heat Index

Heat Level

Risk

Status Color

Animation

Temperature Count Up

Heat Pulse

---

# 58. Green Score Card

Component

GreenScoreCard

Purpose

แสดงคะแนนพื้นที่สีเขียว

Elements

Circular Progress

Current Score

Trend

Recommendation

Animation

Progress Fill

Count Up

---

# 59. Environmental Summary Card

Component

EnvironmentCard

Fields

Temperature

Humidity

Wind Speed

UV Index

Air Quality

Refresh

Realtime Ready

---

# 60. AI Status Card

Component

AIStatusCard

Purpose

แสดงสถานะ AI

States

Idle

Uploading

Processing

Analyzing

Generating

Completed

Failed

Progress Bar

Estimated Time

---

# 61. Quick Action Card

Component

QuickActions

Buttons

Analyze New Area

Open Camera

Upload Image

Generate Garden

Heat Map

History

Animation

Hover Lift

---

# 62. Recent Projects Card

Component

RecentProjects

Display

Thumbnail

Project Name

Date

Green Score

Status

Actions

Open

Delete

Export

Pagination

Lazy Loading

---

# 63. Project Card

Component

ProjectCard

Props

Project Image

Name

Location

Created Date

Heat Level

Green Score

Actions

Hover

Image Zoom

Glass Overlay

---

# 64. Statistics Card

Component

StatisticsCard

Purpose

Dashboard KPI

Examples

Projects

Analysis

Trees Recommended

Average Green Score

Animation

Count Up

---

# 65. Activity Timeline

Component

ActivityTimeline

Items

Project Created

Image Uploaded

Analysis Completed

Garden Generated

Realtime Update Ready

---

# 66. Heat Trend Chart

Component

HeatTrendChart

Library

Chart.js

Display

Temperature

Heat Index

NDVI

Time Filter

Day

Week

Month

Year

---

# 67. Green Progress Chart

Component

GreenCoverageChart

Display

Concrete

Grass

Tree

Water

Animated Doughnut Chart

---

# 68. Risk Level Indicator

Component

RiskIndicator

Levels

Low

Moderate

High

Extreme

Colors

Green

Yellow

Orange

Red

Animation

Pulse

---

# 69. Recommendation Widget

Component

RecommendationWidget

Purpose

AI Suggestions

Examples

ปลูกต้นไม้เพิ่ม

ลดพื้นคอนกรีต

เพิ่มร่มเงา

Button

View Detail

---

# 70. Weather Widget

Component

WeatherWidget

Fields

Temperature

Humidity

Rain Chance

Wind

UV

Icon Animation

---

# 71. Map Preview Card

Component

MiniMapCard

Technology

Mapbox

Features

Current Location

Heat Layer Preview

Quick Open

---

# 72. Plant Recommendation Preview

Component

PlantPreviewCard

Display

Plant Image

Plant Name

Cooling Score

Difficulty

Estimated Cost

---

# 73. Dashboard Filter Bar

Component

DashboardFilters

Filters

Date

Location

Project

Heat Level

Garden Style

Responsive

Horizontal Scroll (Mobile)

---

# 74. Empty Dashboard

Illustration

Message

"เริ่มต้นวิเคราะห์พื้นที่แรกของคุณ"

CTA

เริ่มวิเคราะห์

---

# 75. Dashboard Loading

Components

Skeleton Hero

Skeleton Cards

Skeleton Charts

Skeleton Projects

---

# 76. Dashboard Error

Display

Illustration

Title

Description

Retry Button

Contact Support

---

# 77. Realtime Update

Support

Supabase Realtime

Realtime Cards

Project Update

Analysis Update

Notification

Live Green Score

---

# 78. Accessibility

ทุก Dashboard Component ต้องรองรับ

* Keyboard Navigation
* Screen Reader
* Focus Ring
* ARIA Labels
* High Contrast

---

# 79. Motion Rules

Hover

Scale 1.02

Card Lift

8px

Fade Duration

200ms

Page Transition

300ms

Reduced Motion

Respect OS Setting

---

# 80. Definition of Done

Navigation และ Dashboard Component จะถือว่าเสร็จสมบูรณ์เมื่อ

* Responsive ทุกอุปกรณ์
* Dark / Light Mode
* Reusable
* TypeScript ครบ
* Storybook Ready
* Accessible
* Animated
* รองรับ Realtime
* Production Ready

---

**END OF PART 2**

# 08_Component_Library.md

# Part 3 — AI Scanner, Camera, Upload & Analysis Components

Project: **GeoHeat AI Green Designer**
Version: **1.0**

---

# 81. AI Scanner Module

## Purpose

AI Scanner เป็นหัวใจหลักของระบบ GeoHeat AI Green Designer ใช้สำหรับวิเคราะห์พื้นที่จริงจากภาพถ่ายเพื่อนำไปคำนวณพื้นที่ ประเมินสภาพแวดล้อม และสร้างคำแนะนำการออกแบบสวน

Workflow

Camera / Upload

↓

Image Validation

↓

AI Processing

↓

Object Detection

↓

Segmentation

↓

Depth Estimation

↓

Area Calculation

↓

GeoHeat Analysis

↓

Garden Recommendation

↓

Simulation

---

# 82. Camera Scanner

Component

CameraScanner

## Features

* เปิดกล้องหลังเป็นค่าเริ่มต้น
* รองรับ Camera API
* รองรับ Upload รูปจากเครื่อง
* Live Preview
* Auto Focus
* Grid Overlay
* Horizon Guide
* Flash (Mobile)
* Camera Switch
* Capture Button

Props

* cameraMode
* facingMode
* quality
* autoCapture
* overlay
* onCapture
* onError

States

* Idle
* Initializing
* Ready
* Capturing
* Uploading
* Failed

---

# 83. Camera Overlay

Component

CameraOverlay

Purpose

ช่วยให้ผู้ใช้ถ่ายภาพได้มุมที่เหมาะสม

Elements

* Rule of Thirds Grid
* Boundary Frame
* Measurement Guide
* Horizon Line
* Scan Animation
* Target Area Highlight

Animation

Scanning Beam

Opacity Pulse

---

# 84. Image Upload

Component

ImageUploader

Supported Formats

* JPG
* JPEG
* PNG
* WEBP
* HEIC

Maximum Size

20 MB

Features

* Drag & Drop
* Browse File
* Mobile Upload
* Image Compression
* EXIF Rotation
* Preview
* Remove
* Replace

Validation

* File Type
* File Size
* Resolution

---

# 85. Image Preview

Component

ImagePreview

Features

* Zoom
* Pan
* Rotate
* Reset
* Fullscreen
* Compare Before / After

Support

Mouse

Touch Gesture

Trackpad

---

# 86. Image Validation Card

Component

ImageValidationCard

Checks

* Blur Detection
* Brightness
* Resolution
* Camera Angle
* Object Visibility
* Shadow Coverage

Display

Score

Suggestion

Retry Button

---

# 87. Upload Progress

Component

UploadProgress

Display

* Upload Percentage
* Remaining Time
* File Name
* File Size
* Upload Speed

Animation

Linear Progress

---

# 88. AI Processing Screen

Component

AIProcessingScreen

Purpose

แสดงสถานะระหว่าง AI วิเคราะห์

Steps

1. Uploading Image
2. Preparing Image
3. Detecting Objects
4. Segmenting Area
5. Calculating Area
6. Reading GeoHeat Data
7. Generating Recommendation
8. Creating Simulation

Animation

Lottie

Progress Timeline

Estimated Time

---

# 89. AI Progress Timeline

Component

ProcessingTimeline

Status

Pending

Processing

Completed

Failed

Animated Connector

---

# 90. Object Detection Overlay

Component

ObjectDetectionOverlay

Purpose

แสดงผลการตรวจจับวัตถุ

Supported Objects

* Tree
* Grass
* Concrete
* Building
* Wall
* Roof
* Car
* Water
* Pavement
* Plant Pot

Display

Bounding Box

Confidence

Object Label

Color Legend

---

# 91. Segmentation Overlay

Component

SegmentationOverlay

Purpose

แสดงพื้นที่แต่ละประเภท

Classes

Vegetation

Concrete

Water

Building

Shadow

Road

Display

Colored Mask

Opacity Slider

Legend

---

# 92. Area Measurement Overlay

Component

AreaMeasurementOverlay

Purpose

แสดงผลการคำนวณพื้นที่

Display

Total Area

Green Area

Concrete Area

Shadow Area

Unit

Square Meter

Features

Measurement Label

Boundary Polygon

Editable Points

---

# 93. AI Confidence Panel

Component

ConfidencePanel

Fields

Overall Confidence

Detection Confidence

Segmentation Confidence

Depth Confidence

Visualization

Circular Progress

Status Color

---

# 94. Analysis Result Card

Component

AnalysisResultCard

Sections

Overview

Detected Objects

Area Summary

Heat Summary

Recommendation

Export

---

# 95. Environmental Analysis Card

Component

EnvironmentalAnalysisCard

Display

* Temperature
* Heat Index
* NDVI
* Green Coverage
* Urban Heat Risk

Risk Level

Low

Moderate

High

Extreme

---

# 96. AI Recommendation Panel

Component

RecommendationPanel

Display

* Suggested Garden Type
* Cooling Potential
* Estimated Budget
* Maintenance Level
* Plant Suggestions

CTA

Generate Design

---

# 97. Before / After Preview

Component

BeforeAfterSlider

Features

Interactive Slider

Fullscreen

Zoom

Reset

Download

---

# 98. Image Comparison Viewer

Component

ComparisonViewer

Modes

Side by Side

Overlay

Split View

Swipe

---

# 99. Analysis History

Component

AnalysisHistory

Display

* Date
* Thumbnail
* Heat Score
* Green Score
* Status

Actions

Open

Duplicate

Delete

Export

---

# 100. Error Handling

Possible Errors

* Camera Permission Denied
* Upload Failed
* Unsupported Format
* AI Timeout
* Analysis Failed
* Network Error

Display

Illustration

Description

Retry

Support

---

# 101. Empty State

Title

ยังไม่มีการวิเคราะห์พื้นที่

CTA

เริ่มสแกนพื้นที่

Illustration

Environmental AI Theme

---

# 102. Loading State

Skeleton

Camera

Cards

Charts

Progress

Animated AI Processing

---

# 103. Export Panel

Component

ExportPanel

Formats

PDF

PNG

CSV

JSON

Share Link

---

# 104. Accessibility

รองรับ

* Keyboard Navigation
* Screen Reader
* Focus Management
* ARIA Labels
* Color Contrast AA
* Reduced Motion

---

# 105. Motion Specification

Hover Scale

1.02

Overlay Fade

200ms

Progress Animation

Smooth Linear

Analysis Transition

300ms

Result Reveal

Stagger Animation

---

# 106. Performance

Lazy Load

* Camera
* AI Overlay
* Comparison Viewer

Optimize

* Image Compression
* Progressive Loading
* Virtual Rendering

---

# 107. Security

Validate

* MIME Type
* File Size
* Image Integrity

Sanitize Metadata

Protect Upload Endpoint

Signed URLs

---

# 108. Definition of Done

AI Scanner Module ถือว่าเสร็จสมบูรณ์เมื่อ

* Camera ใช้งานได้ทั้ง Desktop และ Mobile
* รองรับ Upload และ Capture
* มี Image Validation
* มี AI Processing UI
* แสดง Object Detection Overlay
* แสดง Segmentation Overlay
* แสดง Area Measurement
* แสดง Analysis Result
* รองรับ Export
* Responsive ทุกอุปกรณ์
* Dark / Light Mode
* Accessible
* Reusable
* Storybook Ready
* Production Ready

---

**END OF PART 3**

# 08_Component_Library.md

# Part 4 — Garden Designer, Plant Recommendation & AI Landscape Generator

Project: **GeoHeat AI Green Designer**
Version: **1.0**

---

# 109. Garden Designer Module

## Purpose

Garden Designer เป็นระบบ AI ที่ช่วยออกแบบพื้นที่สีเขียวโดยอัตโนมัติจากผลการวิเคราะห์ภาพถ่าย พื้นที่จริง สภาพอากาศ และข้อมูลสิ่งแวดล้อม เพื่อสร้างแบบสวนที่เหมาะสมที่สุดกับผู้ใช้งาน

Workflow

Analysis Result

↓

Environmental Analysis

↓

User Preferences

↓

Plant Selection

↓

Layout Generation

↓

Cost Estimation

↓

Cooling Simulation

↓

Landscape Rendering

↓

Export Design

---

# 110. Garden Designer Dashboard

Component

GardenDesignerDashboard

Purpose

เป็นหน้าหลักสำหรับสร้างและปรับแต่งแบบสวน

Sections

* Current Analysis Summary
* AI Recommendation
* Garden Style
* Plant Selection
* Budget Summary
* Estimated Cooling Effect
* 3D Preview (Future)
* Generate Button

---

# 111. Garden Style Selector

Component

GardenStyleSelector

Supported Styles

* Tropical Garden
* Modern Garden
* Japanese Garden
* Minimal Garden
* Zen Garden
* English Garden
* Vertical Garden
* Courtyard Garden
* Edible Garden
* Eco Garden
* Smart Garden

Display

Image Preview

Description

Difficulty

Cooling Score

Maintenance Level

Estimated Cost

Animation

Card Hover

Selection Glow

---

# 112. Plant Recommendation Panel

Component

PlantRecommendationPanel

Purpose

แนะนำต้นไม้ที่เหมาะสมกับพื้นที่

AI วิเคราะห์จาก

* Temperature
* Heat Index
* NDVI
* Area Size
* Sunlight
* Shadow
* Budget
* Maintenance Preference

Sort

* Cooling Score
* Cost
* Maintenance
* Growth Speed

---

# 113. Plant Card

Component

PlantCard

Display

Plant Image

Thai Name

Scientific Name

Cooling Score

Maintenance

Growth Rate

Water Requirement

Sun Requirement

Estimated Price

Carbon Absorption

Biodiversity Score

Buttons

View Detail

Compare

Add to Design

Favorite

---

# 114. Plant Detail Dialog

Component

PlantDetailDialog

Sections

* Overview
* Gallery
* Characteristics
* Growth Information
* Care Guide
* Advantages
* Disadvantages
* Cooling Performance
* Similar Plants

---

# 115. Plant Comparison

Component

PlantComparison

Compare

2–4 Plants

Columns

Cooling

Cost

Height

Shade

Maintenance

Water

Sunlight

Growth Speed

Expected Lifespan

---

# 116. Garden Layout Generator

Component

GardenLayoutGenerator

Purpose

AI จัดวางตำแหน่งต้นไม้และองค์ประกอบภายในพื้นที่

Layout Elements

* Trees
* Grass
* Shrubs
* Walkway
* Seating Area
* Water Feature
* Flower Bed
* Decorative Rock

Display

Top View

2D Layout

Future

3D Layout

---

# 117. Interactive Garden Canvas

Component

GardenCanvas

Features

Drag & Drop

Resize

Rotate

Snap Grid

Undo

Redo

Zoom

Pan

History

Auto Save

---

# 118. AI Landscape Generator

Component

LandscapeGenerator

Purpose

สร้างภาพจำลอง Before / After

Input

* Original Image
* Garden Layout
* Selected Plants
* Style
* Season
* Lighting

Output

AI Rendered Image

Support

HD

4K (Future)

---

# 119. Before / After Studio

Component

BeforeAfterStudio

Modes

Split

Slider

Fade

Side by Side

Overlay

Actions

Download

Fullscreen

Share

Regenerate

---

# 120. Cooling Effect Card

Component

CoolingEffectCard

Display

Estimated Temperature Reduction

Shade Increase

Green Coverage Increase

Air Quality Improvement

Carbon Reduction

Visualization

Gauge

Progress

Trend

---

# 121. Budget Estimator

Component

BudgetEstimator

Display

Plant Cost

Material Cost

Labor Cost

Maintenance Cost

Total Cost

Budget Status

Within Budget

Over Budget

Saving Suggestions

---

# 122. Maintenance Panel

Component

MaintenancePanel

Display

Daily

Weekly

Monthly

Seasonal

Estimated Working Hours

Difficulty

Low

Medium

High

---

# 123. Garden Timeline

Component

GardenTimeline

Display

Month 1

Month 3

Month 6

Year 1

Year 3

Growth Animation

Expected Appearance

---

# 124. Sustainability Score

Component

SustainabilityScore

Metrics

Cooling

Carbon

Biodiversity

Water Efficiency

Maintenance

Overall Score

Visualization

Radar Chart

---

# 125. AI Explanation Panel

Component

AIExplanationPanel

Purpose

อธิบายเหตุผลที่ AI เลือกแบบสวนและต้นไม้

Display

Reason

Environmental Factors

Benefits

Trade-offs

Confidence Score

---

# 126. Recommendation Alternatives

Component

AlternativeRecommendations

Display

Option A

Option B

Option C

เปรียบเทียบ

Cooling

Cost

Maintenance

Appearance

---

# 127. Design Version History

Component

DesignHistory

Display

Version

Created Date

Style

Cooling Score

Actions

Restore

Duplicate

Delete

Compare

---

# 128. Export Design

Component

DesignExport

Formats

PDF

PNG

JPEG

JSON

DXF (Future)

Include

Plant List

Cost Summary

Maintenance Guide

AI Report

---

# 129. Share Design

Component

ShareDesign

Support

Public Link

Private Link

QR Code

Social Media

Copy Link

---

# 130. Favorite Designs

Component

FavoriteDesigns

Features

Save

Tag

Folder

Search

Sort

---

# 131. Loading State

Components

Skeleton Garden Card

Skeleton Plant Card

Skeleton Canvas

Skeleton AI Render

---

# 132. Empty State

Illustration

Title

"เริ่มสร้างสวนแรกของคุณ"

Description

CTA

สร้างแบบสวน

---

# 133. Error State

Display

Illustration

Error Description

Retry Button

Contact Support

---

# 134. Accessibility

ทุก Component ต้องรองรับ

* Keyboard Navigation
* Screen Reader
* ARIA Labels
* Focus Ring
* High Contrast
* Reduced Motion

---

# 135. Motion Specification

Card Hover

Scale 1.02

Plant Selection

Glow Animation

Canvas Interaction

Smooth Zoom

AI Generation

Progress Timeline

Before / After

Crossfade

---

# 136. Performance

Lazy Load

* Plant Gallery
* AI Render
* Garden Canvas

Optimize

* Image Compression
* Incremental Loading
* Cached Recommendations

---

# 137. Definition of Done

Garden Designer Module ถือว่าเสร็จสมบูรณ์เมื่อ

* AI สามารถแนะนำรูปแบบสวน
* แนะนำต้นไม้ตามข้อมูลสิ่งแวดล้อม
* เปรียบเทียบต้นไม้ได้
* จัดวาง Layout ได้
* แสดงต้นทุนโดยประมาณ
* คำนวณผลกระทบด้านสิ่งแวดล้อม
* สร้างภาพ Before / After
* Export รายงานได้
* Responsive ทุกอุปกรณ์
* Dark / Light Mode
* Accessible
* Storybook Ready
* Reusable
* Production Ready

---

**END OF PART 4**

# 08_Component_Library.md

# Part 5A — GIS, Heat Map, Map Controls & Spatial Analysis Components

Project: **GeoHeat AI Green Designer**
Version: **1.0**

---

# 138. GIS Module

## Purpose

GIS Module เป็นระบบหลักสำหรับแสดงผลข้อมูลเชิงพื้นที่ (Spatial Data) และข้อมูลสิ่งแวดล้อม เพื่อช่วยให้ผู้ใช้เข้าใจพื้นที่ของตนเองและผลกระทบจากความร้อนในรูปแบบแผนที่แบบ Interactive

รองรับการทำงานร่วมกับ

* Mapbox GL JS
* PostGIS
* GeoJSON
* Vector Tile
* Raster Tile
* Supabase Realtime
* GeoHeat Dataset

Workflow

Map Initialization

↓

Load Base Map

↓

Load GeoHeat Layer

↓

Load Environmental Layers

↓

Load User Project Layer

↓

Spatial Analysis

↓

Recommendation Overlay

↓

Realtime Update

---

# 139. Interactive Map

Component

InteractiveMap

Purpose

แผนที่หลักของระบบ

Technology

* Mapbox GL JS
* MapLibre (Future)

Features

* Pan
* Zoom
* Rotate
* Pitch
* Double Click Zoom
* Touch Gesture
* Mouse Wheel Zoom
* Keyboard Navigation

Support

Desktop

Tablet

Mobile

Dark / Light Theme

---

# 140. Base Map Selector

Component

BaseMapSelector

Supported Maps

* Standard
* Satellite
* Satellite Hybrid
* Terrain
* Light
* Dark
* Outdoor
* Streets

Display

Thumbnail Preview

Map Name

Current Selection

Animation

Fade Transition

---

# 141. Heat Map Layer

Component

HeatMapLayer

Purpose

แสดงระดับความร้อนของพื้นที่

Color Scale

* Blue
* Cyan
* Green
* Yellow
* Orange
* Red
* Dark Red

Display

Gradient Overlay

Opacity Control

Realtime Update

Legend

Temperature Unit

°C

---

# 142. Green Coverage Layer

Component

GreenCoverageLayer

Purpose

แสดงพื้นที่สีเขียว

Classes

* Dense Forest
* Trees
* Grass
* Agriculture
* Sparse Vegetation
* No Vegetation

Display

Polygon Overlay

Opacity Slider

Legend

Coverage Percentage

---

# 143. Land Surface Temperature Layer

Component

LSTLayer

Purpose

แสดงอุณหภูมิพื้นผิวดิน

Data Source

Satellite

Interpolation

Raster Tile

Visualization

Heat Gradient

Contour (Future)

---

# 144. NDVI Layer

Component

NDVILayer

Purpose

แสดงค่าดัชนีพืชพรรณ

Range

-1 ถึง 1

Color

Brown

↓

Yellow

↓

Green

Display

Legend

Value Range

Description

---

# 145. Urban Heat Island Layer

Component

UHILayer

Purpose

แสดงพื้นที่เสี่ยงเกาะความร้อน

Levels

Low

Moderate

High

Extreme

Overlay

Semi Transparent

Pulse Animation

---

# 146. Shadow Analysis Layer

Component

ShadowLayer

Purpose

วิเคราะห์พื้นที่ร่มเงา

Display

Morning

Afternoon

Evening

Shadow Polygon

Future

Season Simulation

---

# 147. Environmental Layer

Component

EnvironmentLayer

Display

Humidity

Wind

Rainfall

UV

Air Quality

Cloud

Toggle

Independent Layer

---

# 148. User Project Layer

Component

ProjectLayer

Purpose

แสดงตำแหน่งโครงการของผู้ใช้

Display

Marker

Polygon

Thumbnail

Status

Selected Project Highlight

---

# 149. Recommended Garden Layer

Component

GardenRecommendationLayer

Purpose

แสดงตำแหน่งต้นไม้และสวนที่ AI แนะนำ

Elements

Trees

Shrubs

Grass

Water Feature

Walkway

Icons

Interactive Popup

---

# 150. Layer Control Panel

Component

LayerPanel

Features

Show / Hide Layer

Opacity Slider

Layer Order

Legend

Reset

Collapse

Animation

Slide

---

# 151. Map Toolbar

Component

MapToolbar

Buttons

Zoom In

Zoom Out

Reset View

Locate Me

Compass

Fullscreen

Measure

Screenshot

Layer

Search

---

# 152. Mini Map

Component

MiniMap

Purpose

แสดงตำแหน่งปัจจุบัน

Features

Realtime View

Viewport Indicator

Toggle

---

# 153. Legend Panel

Component

LegendPanel

Display

Color

Meaning

Temperature

Risk

Vegetation

NDVI

Interactive

Collapse

Expand

---

# 154. Scale Bar

Component

ScaleBar

Units

Meters

Kilometers

Automatic Scaling

---

# 155. Coordinate Display

Component

CoordinatePanel

Display

Latitude

Longitude

Elevation (Future)

Copy Button

---

# 156. Search Location

Component

LocationSearch

Support

Address

Place Name

Coordinate

Autocomplete

Recent Search

Favorite Location

---

# 157. Marker Component

Component

MapMarker

Types

Current Location

Project

Recommendation

Heat Point

Warning

Hospital

Park

Custom Icon

Animation

Drop

Bounce

Pulse

---

# 158. Popup Card

Component

MapPopup

Display

Image

Title

Description

Temperature

Green Score

Action Button

Animation

Fade + Scale

---

# 159. Spatial Analysis Panel

Component

SpatialAnalysisPanel

Purpose

แสดงผลการวิเคราะห์เชิงพื้นที่

Metrics

Area

Perimeter

Green Coverage

Concrete Ratio

Tree Count

Heat Exposure

Cooling Potential

---

# 160. Distance Measurement Tool

Component

DistanceTool

Purpose

วัดระยะทาง

Units

Meters

Kilometers

Features

Multiple Points

Undo

Reset

Live Distance

---

# 161. Area Measurement Tool

Component

AreaTool

Purpose

คำนวณพื้นที่

Output

Square Meter

Square Kilometer

Polygon Drawing

Editable Vertex

Snap

---

# 162. Buffer Analysis

Component

BufferTool

Purpose

สร้างพื้นที่รัศมี

Radius

10m

25m

50m

100m

Custom

Visualization

Circle Overlay

---

# 163. Spatial Query Panel

Component

SpatialQuery

Queries

Within Area

Intersect

Nearest Object

Nearby Trees

Nearby Hospital

Nearby Park

---

# 164. Time Slider

Component

TimeSlider

Purpose

ดูข้อมูลย้อนหลัง

Ranges

Hour

Day

Week

Month

Year

Animation

Timeline

---

# 165. Realtime Layer

Component

RealtimeMapLayer

Purpose

อัปเดตข้อมูลทันที

Technology

Supabase Realtime

Refresh

Automatic

---

# 166. GIS Loading State

Components

Skeleton Map

Skeleton Layer

Skeleton Legend

Loading Spinner

Tile Loading Indicator

---

# 167. GIS Empty State

Illustration

No GIS Data

Description

CTA

Refresh Data

---

# 168. GIS Error State

Display

Map Error

Tile Error

Connection Error

Retry Button

Fallback Map

---

# 169. Accessibility

ทุก GIS Component ต้องรองรับ

* Keyboard Navigation
* Screen Reader
* High Contrast
* Focus Ring
* Reduced Motion

---

# 170. Motion Specification

Map Transition

300ms

Layer Fade

200ms

Marker Drop

250ms

Popup Fade

200ms

Toolbar Hover

Scale 1.02

---

# 171. Performance

Use

* Vector Tiles
* Lazy Layer Loading
* Tile Cache
* Cluster Marker
* WebGL Rendering

Optimize

* Large Dataset
* Spatial Index
* Incremental Rendering

---

# 172. Security

Validate

GeoJSON

Coordinate Range

User Permission

Signed Tile Access

Row Level Security

---

# 173. Definition of Done

GIS Module ถือว่าเสร็จสมบูรณ์เมื่อ

* รองรับ Interactive Map
* รองรับ Heat Map
* รองรับ Green Coverage Layer
* รองรับ NDVI และ LST Layer
* รองรับ Layer Control
* รองรับ Spatial Analysis
* รองรับ Distance และ Area Measurement
* รองรับ Search และ Marker
* รองรับ Realtime Update
* Responsive ทุกอุปกรณ์
* Dark / Light Mode
* Accessible
* Storybook Ready
* Reusable
* Production Ready

---

**END OF PART 5A**

# 08_Component_Library.md

# Part 5B — Charts, Analytics, Green Score, Environmental KPI & Reports Components

Project: **GeoHeat AI Green Designer**
Version: **1.0**

---

# 174. Analytics Module

## Purpose

Analytics Module เป็นศูนย์กลางการวิเคราะห์ข้อมูลของระบบ GeoHeat AI Green Designer ใช้สรุปผลข้อมูลจาก AI, GIS และฐานข้อมูล เพื่อแสดงผลในรูปแบบ Dashboard, Charts, KPI และรายงานที่เข้าใจง่าย

ข้อมูลที่รองรับ

* AI Analysis
* GeoHeat Data
* Green Coverage
* Heat Index
* Plant Recommendation
* User Projects
* Environmental Metrics
* Historical Trends

---

# 175. Analytics Dashboard

Component

AnalyticsDashboard

Sections

* KPI Overview
* Heat Trend
* Green Score
* AI Statistics
* Environmental Metrics
* Recent Reports
* Recommendations

Responsive

Desktop

Tablet

Mobile

---

# 176. KPI Overview Cards

Component

KPIOverview

Metrics

* Total Projects
* Total Analysis
* Average Green Score
* Average Temperature
* Cooling Potential
* Carbon Reduction

Animation

Count Up

Glass Effect

Realtime

---

# 177. Heat Trend Chart

Component

HeatTrendChart

Library

Chart.js

Chart Types

* Line
* Area

Filters

Today

Week

Month

Year

Display

Temperature

Heat Index

LST

---

# 178. Green Score Chart

Component

GreenScoreChart

Purpose

แสดงแนวโน้มคะแนนพื้นที่สีเขียว

Chart Types

* Line
* Area

Metrics

* Green Score
* Green Coverage
* Tree Density

Trend Indicator

Increase

Decrease

Stable

---

# 179. Green Score Gauge

Component

GreenScoreGauge

Display

Current Score

0–100

Levels

Excellent

Good

Moderate

Poor

Critical

Visualization

Circular Gauge

Animated Fill

---

# 180. Environmental KPI Panel

Component

EnvironmentalKPIPanel

Metrics

* Air Temperature
* Surface Temperature
* Humidity
* UV Index
* Wind Speed
* Air Quality Index (AQI)
* Green Coverage
* NDVI
* Carbon Storage

Status Colors

Normal

Warning

Critical

---

# 181. Heat Distribution Chart

Component

HeatDistributionChart

Chart Type

Heat Histogram

Display

Temperature Range

Area Percentage

Peak Heat Zone

---

# 182. Vegetation Analysis Chart

Component

VegetationChart

Metrics

* Trees
* Grass
* Shrubs
* Water
* Bare Soil
* Concrete

Chart Types

Pie

Bar

Treemap (Future)

---

# 183. Land Cover Summary

Component

LandCoverSummary

Display

Percentage

Area (m²)

Coverage Ratio

Legend

Interactive

---

# 184. AI Performance Panel

Component

AIPerformancePanel

Metrics

* Detection Accuracy
* Segmentation Accuracy
* Recommendation Confidence
* Processing Time
* Images Processed

Realtime Update

Supported

---

# 185. Recommendation Statistics

Component

RecommendationStatistics

Display

* Recommended Garden Types
* Most Recommended Plants
* Estimated Cooling Impact
* Budget Distribution

Charts

Bar

Pie

---

# 186. Project Comparison

Component

ProjectComparison

Compare

2–5 Projects

Metrics

* Green Score
* Heat Score
* Area Size
* Cost
* Cooling Effect
* Carbon Reduction

Visualization

Radar Chart

Table

---

# 187. Sustainability Score Card

Component

SustainabilityScoreCard

Indicators

* Environmental Impact
* Carbon Reduction
* Biodiversity
* Water Efficiency
* Maintenance Efficiency

Overall Score

0–100

---

# 188. Carbon Reduction Card

Component

CarbonReductionCard

Display

Estimated CO₂ Reduction

Equivalent Trees

Annual Impact

Trend

---

# 189. Cooling Potential Card

Component

CoolingPotentialCard

Display

Estimated Temperature Reduction

Expected Shade

Cooling Efficiency

Visualization

Progress Gauge

---

# 190. Report Center

Component

ReportCenter

Features

* View Reports
* Search
* Filter
* Download
* Delete
* Share

Supported Formats

PDF

CSV

JSON

PNG

---

# 191. Report Viewer

Component

ReportViewer

Sections

Executive Summary

Environmental Analysis

AI Results

Charts

Heat Map Snapshot

Garden Recommendation

Cost Summary

Conclusion

---

# 192. Report Generator

Component

ReportGenerator

Templates

Quick Report

Detailed Report

Executive Report

Research Report

Generate

Background Task

Notification

เมื่อสร้างเสร็จ

---

# 193. Export Manager

Component

ExportManager

Export Types

* PDF
* CSV
* Excel (Future)
* JSON
* PNG

Options

Include Charts

Include Maps

Include AI Recommendation

---

# 194. Analytics Filter Bar

Component

AnalyticsFilters

Filters

* Date Range
* Project
* Location
* Heat Level
* Green Score
* Garden Style

Support

Multi Select

Reset

Save Filter

---

# 195. Realtime Analytics

Component

RealtimeAnalytics

Technology

Supabase Realtime

Updates

* KPI
* Charts
* Reports
* Notifications

Refresh Strategy

Automatic

---

# 196. Insight Panel

Component

InsightPanel

Purpose

AI สรุป Insight อัตโนมัติ

Examples

* พื้นที่นี้มีคอนกรีตมากเกินไป
* ควรเพิ่มต้นไม้ขนาดใหญ่
* ลดอุณหภูมิได้ประมาณ 2.8°C
* Green Score เพิ่มขึ้น 24%

---

# 197. Trend Analysis

Component

TrendAnalysis

Metrics

Daily

Weekly

Monthly

Yearly

Comparison

Previous Period

Average

Forecast (Future)

---

# 198. Forecast Panel

Component

ForecastPanel

Purpose

คาดการณ์ผลลัพธ์หลังปรับปรุงพื้นที่

Display

Estimated Green Score

Temperature Reduction

Growth Timeline

Maintenance Cost

Confidence

---

# 199. Empty State

Illustration

"No analytics available"

Description

เริ่มวิเคราะห์พื้นที่เพื่อสร้างข้อมูล

CTA

Start Analysis

---

# 200. Loading State

Components

Skeleton KPI

Skeleton Charts

Skeleton Report

Skeleton Insight

Animated Placeholder

---

# 201. Error State

Display

Illustration

Title

Description

Retry Button

Fallback Data

---

# 202. Accessibility

ทุก Analytics Component ต้องรองรับ

* Keyboard Navigation
* Screen Reader
* ARIA Labels
* Focus Ring
* High Contrast
* Reduced Motion

---

# 203. Motion Specification

Card Hover

Scale 1.02

Chart Fade

250ms

Count Up Animation

800ms

Report Transition

300ms

Loading Pulse

Infinite

---

# 204. Performance

Use

* Lazy Loading
* Memoization
* Virtual Lists
* Incremental Rendering
* Cached Queries

Optimize

* Large Dataset
* Chart Rendering
* Report Generation

---

# 205. Security

Validate

* Report Access
* Export Permission
* User Authorization
* Signed Download URL

Comply With

Row Level Security (RLS)

---

# 206. Definition of Done

Analytics Module ถือว่าเสร็จสมบูรณ์เมื่อ

* แสดง KPI แบบ Realtime
* รองรับ Heat Trend และ Green Score Charts
* แสดง Environmental KPI
* วิเคราะห์ข้อมูล AI และ GIS
* เปรียบเทียบโครงการได้
* สร้างและ Export รายงานได้
* รองรับ Responsive ทุกอุปกรณ์
* รองรับ Dark / Light Mode
* Accessible
* Storybook Ready
* Reusable
* Production Ready

---

**END OF PART 5B**

# 08_Component_Library.md

# Part 6 — Forms, Tables, Modals, Feedback, Animation Standards, Storybook & Component Export Rules

Project: **GeoHeat AI Green Designer**
Version: **1.0**

---

# 207. Forms System

## Purpose

ระบบ Form เป็นหัวใจสำคัญของการรับข้อมูลผู้ใช้ เช่น การสร้างโครงการ การอัปโหลดรูปภาพ การตั้งค่าการออกแบบสวน และการกำหนดเงื่อนไขการวิเคราะห์ AI

Technology

* React Hook Form
* Zod Validation
* TypeScript
* shadcn/ui

Features

* Real-time Validation
* Auto Save
* Draft Recovery
* Error Summary
* Keyboard Navigation
* Mobile Friendly

---

# 208. Form Layout

Desktop

* 2 Columns
* Label Left
* Input Right

Tablet

* Responsive Grid

Mobile

* Single Column

Spacing

24px

---

# 209. Form Components

รองรับ

* Text Input
* Number Input
* Email
* Password
* Search
* TextArea
* Select
* Multi Select
* Radio
* Checkbox
* Switch
* Date Picker
* Time Picker
* File Upload
* Image Upload
* Color Picker (Future)

---

# 210. Validation Rules

Validation

* Required
* Min Length
* Max Length
* Pattern
* Numeric Range
* File Type
* File Size
* Duplicate Detection

Display

* Inline Error
* Success State
* Helper Text

---

# 211. Multi-Step Form

Component

WizardForm

Steps

1. Project Information
2. Upload Images
3. AI Analysis
4. Garden Preferences
5. Confirmation

Features

* Previous / Next
* Save Draft
* Resume Later
* Progress Indicator

---

# 212. Data Table

Component

DataTable

Technology

TanStack Table

Features

* Sorting
* Filtering
* Pagination
* Sticky Header
* Column Resize
* Column Visibility
* Export
* Search
* Row Selection

Responsive

Desktop

Full Table

Mobile

Card View

---

# 213. Table Toolbar

Actions

* Search
* Filter
* Export
* Refresh
* Bulk Delete
* Column Settings

---

# 214. Table Empty State

Illustration

"No Data"

CTA

Create New Project

---

# 215. Table Loading

Skeleton Rows

Animated Placeholder

---

# 216. Modal System

Component

AppModal

Variants

* Confirmation
* Form
* Alert
* Image Preview
* AI Processing
* Fullscreen

Animation

Fade

Scale

Backdrop Blur

---

# 217. Dialog

รองรับ

* Confirm
* Warning
* Delete
* Success
* Error

Buttons

Primary

Secondary

Danger

---

# 218. Bottom Sheet

Mobile Only

Features

* Swipe Down
* Snap Points
* Scroll Lock
* Gesture Support

---

# 219. Drawer

Desktop

Right Panel

Mobile

Bottom Drawer

Animation

Slide

---

# 220. Notification System

Component

NotificationCenter

Types

* Success
* Error
* Warning
* Information
* AI Completed
* Upload Finished

Features

* Mark as Read
* Filter
* Group
* Realtime

---

# 221. Toast System

Technology

Sonner

Positions

* Top Right
* Bottom Center

Types

* Success
* Error
* Warning
* Loading

Duration

4 Seconds

Actions

Undo

Retry

Dismiss

---

# 222. Global Loading Overlay

Component

LoadingOverlay

Display

Logo

Progress

Status Message

Blur Background

Prevent Interaction

---

# 223. Skeleton Library

Components

* Card
* Table
* Chart
* Map
* Plant Card
* Dashboard
* Analysis Panel
* AI Result
* Gallery
* Form

---

# 224. Animation System

Technology

Framer Motion

Animation Types

* Fade
* Slide
* Scale
* Stagger
* Morph
* Count Up
* Pulse
* Floating
* Shimmer

---

# 225. Page Transition

Animation

Fade + Slide

Duration

300ms

Support

Next.js App Router

---

# 226. Hover Interaction

Buttons

Scale 1.02

Cards

Lift 8px

Images

Zoom

Links

Underline Animation

---

# 227. Feedback Animation

Success

Check Animation

Error

Shake

Warning

Pulse

Loading

Spinner

AI Processing

Timeline Animation

---

# 228. Empty States

Illustration Required

Title

Description

Primary CTA

Secondary CTA

Responsive

Dark Mode

---

# 229. Error Pages

Support

* 404
* 403
* 500
* Network Error
* Maintenance

Include

Illustration

Retry

Home Button

Support Link

---

# 230. Accessibility Standards

ทุก Component ต้องผ่าน

WCAG 2.2 AA

รองรับ

* Keyboard Navigation
* Screen Reader
* ARIA Labels
* Focus Management
* Color Contrast
* Reduced Motion
* Touch Target ≥ 44px

---

# 231. Performance Standards

Code Splitting

Dynamic Import

Lazy Loading

Memoization

Virtualization

Optimized Images

WebP / AVIF

Caching

Prefetch

---

# 232. Storybook Standards

ทุก Component ต้องมี

Stories

* Default
* Loading
* Error
* Empty
* Disabled
* Dark Mode
* Mobile
* Tablet
* Desktop

Documentation

* Props
* Events
* Examples
* Accessibility Notes

---

# 233. Testing Standards

Unit Test

Vitest

Component Test

React Testing Library

E2E

Playwright

Coverage Goal

≥ 90%

---

# 234. Component Documentation

ทุก Component ต้องมี

README.md

ประกอบด้วย

* Purpose
* Props
* Events
* States
* Accessibility
* Example Usage
* Screenshots (Optional)

---

# 235. Export Convention

components/

```
Button/
├── Button.tsx
├── Button.types.ts
├── Button.test.tsx
├── Button.stories.tsx
├── Button.module.css (ถ้าจำเป็น)
├── hooks.ts
├── constants.ts
├── README.md
└── index.ts
```

ทุก Component ต้อง Export ผ่าน

index.ts

ห้าม Import จากไฟล์ภายในโดยตรง

---

# 236. Naming Convention

Components

PascalCase

Examples

* GlassCard
* AIScanner
* HeatMapLayer
* GreenScoreGauge

Hooks

camelCase

Examples

* useCamera
* useHeatAnalysis
* useProject

Constants

UPPER_SNAKE_CASE

Examples

* MAX_UPLOAD_SIZE
* DEFAULT_MAP_ZOOM

---

# 237. Folder Architecture

```
components/
├── ui/
├── layout/
├── forms/
├── dashboard/
├── analytics/
├── gis/
├── ai/
├── garden/
├── scanner/
├── reports/
├── feedback/
├── charts/
├── common/
└── shared/
```

---

# 238. Quality Checklist

ก่อน Merge ทุก Component ต้องผ่าน

* TypeScript ไม่มี Error
* ESLint ผ่าน
* Prettier ผ่าน
* Responsive
* Dark / Light Mode
* Keyboard Navigation
* Screen Reader
* Storybook
* Unit Test
* ไม่มี Console Error
* Performance ผ่าน Lighthouse
* Accessibility ผ่าน Lighthouse

---

# 239. Production Checklist

ก่อน Deploy

* Build ผ่าน
* ไม่มี Type Error
* ไม่มี Warning สำคัญ
* Environment Variables ครบ
* API เชื่อมต่อได้
* Database เชื่อมต่อได้
* Authentication ทำงานได้
* Upload ใช้งานได้
* AI Pipeline ทำงานได้
* Realtime ทำงานได้

---

# 240. Definition of Done

Component Library ถือว่าเสร็จสมบูรณ์เมื่อ

* Component ทุกตัวมีมาตรฐานเดียวกัน
* รองรับการนำกลับมาใช้ซ้ำ (Reusable)
* รองรับ Responsive ทุกอุปกรณ์
* รองรับ Dark / Light Theme
* มี Loading, Empty และ Error State
* รองรับ Animation ตามมาตรฐาน
* ผ่าน Accessibility (WCAG 2.2 AA)
* มี Storybook และเอกสารประกอบ
* ผ่าน Unit Test และ E2E Test
* พร้อมใช้งานใน Production
* สอดคล้องกับ Design System ของ GeoHeat AI Green Designer

---

# END OF 08_Component_Library.md

เอกสารฉบับนี้เป็นมาตรฐานกลางสำหรับการพัฒนา Component ทั้งหมดของระบบ GeoHeat AI Green Designer โดยทุกทีมพัฒนาและ AI Coding Assistant (เช่น Claude Code) ต้องอ้างอิงข้อกำหนดนี้ในการสร้าง ปรับปรุง และดูแลรักษา Component เพื่อให้ระบบมีความสม่ำเสมอ ขยายต่อได้ง่าย และพร้อมใช้งานในระดับ Production
