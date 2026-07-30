# 35_AI_Agent_System_Architecture.md

# GeoHeat AI Green Designer

## AI Agent System Architecture Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดสถาปัตยกรรมระบบ AI Agent ของ GeoHeat AI Green Designer

เพื่อสร้าง AI ที่สามารถ:

* วิเคราะห์ปัญหา
* วางแผนการทำงาน
* เรียกใช้เครื่องมือ
* ประมวลผลข้อมูลหลายแหล่ง
* สร้างคำแนะนำอัตโนมัติ
* ปรับปรุงผลลัพธ์ตาม Feedback

---

# 2. AI Agent Concept

AI Agent แตกต่างจาก Chatbot ทั่วไป

Chatbot:

```text
User

↓

Question

↓

Answer
```

AI Agent:

```text
User Goal

↓

Planning

↓

Tool Selection

↓

Data Collection

↓

Reasoning

↓

Action

↓

Result

```

---

# 3. GeoHeat AI Agent Overview

```text
                    User


                     |

                     ↓


              AI Agent Core


 ------------------------------------------------


 |             |              |                |


Planner    Memory       Tool Agent       Reasoner


 |             |              |                |


 ------------------------------------------------


                     |

                     ↓


              Final Solution

```

---

# 4. AI Agent Components

ระบบประกอบด้วย:

```text
AI Agent


├── Planner

├── Reasoning Engine

├── Tool Manager

├── Memory System

├── Knowledge Retrieval

├── Feedback Learning

└── Response Generator

```

---

# 5. Agent Workflow

```text
User Request


↓

Understand Goal


↓

Create Plan


↓

Select Tools


↓

Execute Tasks


↓

Evaluate Result


↓

Generate Answer

```

---

# 6. Planner Module

หน้าที่:

วางแผนขั้นตอนการทำงาน

Example:

User:

"ออกแบบสวนลดความร้อน"

AI Plan:

```text
Step 1

Analyze Image


Step 2

Calculate Area


Step 3

Check Climate


Step 4

Find Plants


Step 5

Generate Design


Step 6

Create Report

```

---

# 7. Reasoning Engine

หน้าที่:

วิเคราะห์ข้อมูล

Input:

* Image Analysis
* GIS Data
* Weather Data
* Plant Knowledge

Output:

Decision

---

Example:

```json
{
"problem":

"พื้นที่คอนกรีตมาก"


"solution":

"เพิ่มไม้ให้ร่มเงา"
}
```

---

# 8. Tool Calling System

AI สามารถเรียกใช้ Tools

```text
AI Agent


↓

Tool Selection


↓

Execute Function


↓

Receive Result

```

---

# 9. Available AI Tools

## 9.1 Computer Vision Tool

ใช้:

วิเคราะห์ภาพ

Function:

```text
analyze_image()
```

Output:

* Object
* Surface
* Area

---

# 9.2 GIS Tool

ใช้:

วิเคราะห์พื้นที่

Function:

```text
analyze_location()
```

Output:

* Heat Risk
* Green Score
* Climate

---

# 9.3 Plant Search Tool

ใช้:

ค้นต้นไม้

Function:

```text
recommend_plants()
```

---

# 9.4 Garden Generator Tool

ใช้:

สร้างแบบสวน

Function:

```text
generate_garden_design()
```

---

# 9.5 AR Visualization Tool

ใช้:

สร้างข้อมูล AR

Function:

```text
create_ar_scene()
```

---

# 9.6 Report Generator Tool

สร้างรายงาน

Function:

```text
generate_report()
```

---

# 10. Agent Decision Flow

ตัวอย่าง:

```text
Input:

รูปพื้นที่หลังบ้าน


↓

Agent:

ต้องรู้พื้นที่


↓

Call:

Computer Vision


↓

ได้พื้นที่ 25 m²


↓

Call:

GIS


↓

พบ Heat Risk สูง


↓

Call:

Plant Database


↓

เลือกต้นไม้


↓

Generate Design

```

---

# 11. Multi-Agent Architecture

ในอนาคตสามารถแยก Agent

```text
AI Supervisor


|

---------------------------------

|          |          |          |

GIS      Plant     Design      AR

Agent    Agent     Agent      Agent

```

---

# 12. Specialized Agents

## 12.1 GIS Agent

หน้าที่:

* วิเคราะห์แผนที่
* วิเคราะห์ความร้อน
* วิเคราะห์พื้นที่สีเขียว

---

## 12.2 Plant Agent

หน้าที่:

* ค้นต้นไม้
* วิเคราะห์ความเหมาะสม
* จัดชุดพืช

---

## 12.3 Garden Designer Agent

หน้าที่:

* ออกแบบ Layout
* จัด Zone

---

## 12.4 Environmental Agent

หน้าที่:

* วิเคราะห์อากาศ
* Heat Risk

---

## 12.5 Report Agent

หน้าที่:

* สร้างรายงาน
* สรุปผล

---

# 13. Memory System

AI ต้องจดจำ:

## Short-term Memory

ข้อมูล Session ปัจจุบัน

เช่น:

* รูปที่กำลังวิเคราะห์
* พื้นที่

---

## Long-term Memory

ข้อมูลผู้ใช้

เช่น:

* ความชอบ
* รูปแบบสวนที่ชอบ

---

# 14. Memory Database

Table:

## user_ai_memory

```sql
id UUID

user_id UUID

memory_type TEXT

content JSONB

created_at TIMESTAMP

```

---

# 15. Feedback Learning System

เมื่อผู้ใช้:

* เปลี่ยนต้นไม้
* ไม่ชอบแบบ
* ให้คะแนน

AI เก็บข้อมูล

```text
Feedback

↓

Memory

↓

Improve Recommendation

```

---

# 16. Agent + RAG Integration

Flow:

```text
User Request

↓

AI Agent

↓

RAG Retrieval

↓

Knowledge

↓

Reasoning

↓

Answer

```

---

# 17. Agent + GIS Integration

Example:

คำถาม:

"ทำสวนตรงไหนดี"

Agent:

1. รับ Location

2. เรียก GIS Tool

3. วิเคราะห์ Heat Map

4. แนะนำพื้นที่

---

# 18. Agent + Computer Vision Integration

Example:

รูป:

พื้นที่ระเบียง

AI:

```text
Detected:

Concrete 80%

Green 20%

Area 6 m²

```

---

# 19. Agent + AR Integration

Agent สร้าง:

```json
{
"objects":[

{
"type":"tree",

"position":[1,2,0]

}

]
}
```

เพื่อส่งให้ AR Engine

---

# 20. Agent Prompt Architecture

Structure:

```text
System Role

+

Available Tools

+

Knowledge Context

+

User Goal

+

Constraints

```

---

# 21. Safety Rules

AI Agent ต้อง:

✓ ไม่สร้างข้อมูลเท็จ

✓ แจ้งข้อจำกัด

✓ ไม่แนะนำพืชอันตราย

✓ ไม่รับรองผลเกินจริง

---

# 22. Error Recovery

กรณี Tool Error:

AI ต้อง:

1. Retry

2. ใช้ข้อมูลสำรอง

3. แจ้งผู้ใช้

---

# 23. Agent API Architecture

Endpoint:

## Start Agent Task

```text
POST /api/agent/run
```

Request:

```json
{
"task":

"design garden",

"image_id":

"IMG001"

}
```

---

Response:

```json
{
"status":

"completed",

"result_id":

"GD001"
}
```

---

# 24. Backend Structure

```text
backend/


services/


├── agent/


│
├── planner.py

├── tool_manager.py

├── memory.py

├── reasoning.py

└── executor.py

```

---

# 25. Performance Optimization

ใช้:

* Task Queue
* Async Processing
* Result Cache
* Background Worker

---

# 26. Monitoring

ติดตาม:

* Agent Success Rate
* Tool Usage
* Response Time
* User Satisfaction

---

# 27. Future Development

## Autonomous Garden Assistant

AI สามารถ:

* ตรวจสุขภาพต้นไม้
* แจ้งเตือนดูแล
* แนะนำการปรับปรุง

---

## Voice AI Agent

ผู้ใช้พูด:

"ช่วยออกแบบสวน"

AI ทำงานทันที

---

## IoT Agent

เชื่อม:

* Sensor
* ระบบน้ำ
* อุปกรณ์อัจฉริยะ

---

# 28. Implementation Roadmap

## Phase 1 MVP

สร้าง:

✓ Single AI Agent

✓ Tool Calling

✓ RAG Integration

---

## Phase 2

เพิ่ม:

✓ Memory

✓ Feedback Learning

---

## Phase 3

เพิ่ม:

✓ Multi-Agent System

✓ Autonomous Operation

---

# 29. Definition of Done

AI Agent สมบูรณ์เมื่อ:

✓ วางแผนงานได้

✓ เรียก Tool ได้

✓ ใช้ Knowledge ได้

✓ วิเคราะห์หลายข้อมูลได้

✓ สร้างผลลัพธ์อัตโนมัติ

✓ เรียนรู้จาก Feedback

---

# END OF 35_AI_Agent_System_Architecture.md

ตอนนี้ GeoHeat AI มี 35 ไฟล์ Documentation แล้ว

Architecture ตอนนี้:

                GeoHeat AI Brain


             AI Agent Layer

                    |

        ----------------------------

        |            |             |

       RAG        Tools        Memory

        |            |             |

        ↓            ↓             ↓


 Plant DB      GIS       User Data


        |

        ↓


AI Decision Engine


        |

 ----------------------------

 |             |            |

Garden       AR        Report

Design    Visualization Generation