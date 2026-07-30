# 34_AI_RAG_Knowledge_System_Architecture.md

# GeoHeat AI Green Designer

## AI RAG Knowledge System Architecture Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดสถาปัตยกรรมระบบ RAG (Retrieval-Augmented Generation) สำหรับ GeoHeat AI Green Designer

เพื่อสร้าง AI ที่สามารถ:

* ค้นหาความรู้เฉพาะด้าน
* อ้างอิงข้อมูลจริง
* ลดการตอบผิดจาก AI
* ให้คำแนะนำที่มีเหตุผล
* ปรับแต่งตามพื้นที่และผู้ใช้

---

# 2. RAG Concept

RAG คือระบบที่รวม:

```text
Large Language Model

+

External Knowledge Base

+

Retrieval System

```

เพื่อให้ AI สามารถใช้ข้อมูลเฉพาะของโครงการ

---

# 3. RAG Architecture Overview

```text
                  User


                   |

                   ↓


            User Question


                   |

                   ↓


          Query Understanding


                   |

                   ↓


        Knowledge Retrieval


                   |

        ---------------------

        |          |         |

        ↓          ↓         ↓


 Plant DB    GIS Data   Research


        |

        ↓


   Context Builder


        |

        ↓


      LLM Reasoning


        |

        ↓


 AI Recommendation


```

---

# 4. Why GeoHeat AI Needs RAG

LLM ทั่วไปมีข้อจำกัด:

* ไม่มีข้อมูลเฉพาะพื้นที่
* อาจแนะนำต้นไม้ไม่เหมาะสม
* ไม่รู้ข้อมูล GIS ล่าสุด
* ไม่สามารถอธิบายเหตุผลเชิงพื้นที่

RAG ช่วยให้:

✓ ใช้ข้อมูลประเทศไทย

✓ ใช้ข้อมูลจังหวัด

✓ ใช้ข้อมูลโครงการ

✓ อธิบายที่มาของคำตอบได้

---

# 5. Knowledge Sources

ระบบรวบรวม:

```text
Knowledge Base


├── Plant Knowledge

├── Garden Design Rules

├── Climate Data

├── GIS Information

├── Heat Research

├── Environmental Guidelines

└── User Experience Data

```

---

# 6. RAG Pipeline

```text
Data Collection

↓

Cleaning

↓

Chunking

↓

Embedding

↓

Vector Storage

↓

Retrieval

↓

Context Injection

↓

LLM Response

```

---

# 7. Document Processing

ก่อนนำข้อมูลเข้า AI

ต้องผ่าน:

## Cleaning

กำจัด:

* ข้อมูลซ้ำ
* ข้อมูลผิด
* Format ไม่ตรง

---

## Chunking

แบ่งเอกสารเป็นส่วนเล็ก

Example:

จาก:

"ต้นแก้วเป็นไม้พุ่ม..."

แบ่งเป็น:

```text
Plant Description

Climate

Maintenance

Heat Benefit

```

---

# 8. Embedding System

Embedding คือการแปลงข้อมูลเป็น Vector

ตัวอย่าง:

ข้อความ:

```text
"ต้นไม้ทนแดด เหมาะกับพื้นที่ร้อน"
```

กลายเป็น:

```text
[0.234,0.562,0.812,...]
```

---

# 9. Vector Database

ใช้เก็บ Knowledge Vector

Technology:

## PostgreSQL + pgvector

เหตุผล:

* ใช้ร่วมกับ Supabase ได้
* รองรับ Search
* ลดระบบซับซ้อน

---

# 10. Vector Database Structure

Table:

## knowledge_embeddings

```sql
knowledge_embeddings


id UUID

content TEXT

embedding VECTOR

category TEXT

source TEXT

metadata JSONB

created_at TIMESTAMP

```

---

# 11. Knowledge Categories

แบ่งเป็น:

## Plant Knowledge

ข้อมูลต้นไม้

---

## Environmental Knowledge

ข้อมูลอากาศ

---

## GIS Knowledge

ข้อมูลพื้นที่

---

## Design Knowledge

หลักการออกแบบสวน

---

## Research Knowledge

งานวิจัย

---

# 12. Retrieval System

เมื่อผู้ใช้ถาม:

Example:

"พื้นที่หลังบ้านร้อนมาก"

ระบบค้น:

```text
Query

↓

Embedding

↓

Similarity Search

↓

Top Relevant Knowledge

```

---

# 13. Similarity Search

ใช้:

## Cosine Similarity

เพื่อวัดความใกล้เคียงของข้อมูล

---

# 14. Retrieval Ranking

คะแนน:

```text
Knowledge Score

=

Similarity

+

Location Match

+

Climate Match

+

User Preference

```

---

# 15. Context Builder

หน้าที่:

รวมข้อมูลก่อนส่งให้ AI

Example:

```text
User:

พื้นที่ 20 ตารางเมตร


Location:

Khon Kaen


Weather:

38°C


Plants:

Heat tolerant plants


```

---

# 16. Prompt Construction

รูปแบบ:

```text
System Prompt

+

Retrieved Knowledge

+

User Input

+

Environmental Data

```

---

# 17. AI Response Generation

Output ต้องมี:

## Recommendation

แนะนำอะไร

---

## Reason

ทำไมเลือก

---

## Evidence

อ้างอิงข้อมูล

---

## Action

ผู้ใช้ต้องทำอะไรต่อ

---

# 18. Explainable AI Integration

AI ต้องตอบ:

"ทำไมเลือกต้นนี้"

Example:

```text
เลือกต้นแก้ว

เนื่องจาก:

- ทนแดดสูง
- ดูแลง่าย
- เหมาะกับพื้นที่ร้อน
- ช่วยเพิ่มร่มเงา

```

---

# 19. RAG + Plant Recommendation

Flow:

```text
User Area

↓

Search Suitable Plants

↓

Filter By Climate

↓

Rank Plants

↓

Generate Recommendation

```

---

# 20. RAG + Garden Designer

Input:

```json
{
area:15,

style:"minimal",

maintenance:"low"
}
```

ค้น:

* Garden Pattern
* Plant Combination
* Space Rule

---

# 21. RAG + GIS

ใช้:

```text
Location

↓

Retrieve Local Climate Knowledge

↓

Retrieve Suitable Plants

↓

Generate Design

```

---

# 22. RAG + AR

AR สามารถรับ:

```text
AI Garden Layout

+

Plant Metadata

+

3D Asset Information

```

เพื่อสร้างสวนเสมือนจริง

---

# 23. Hallucination Prevention

ป้องกัน AI สร้างข้อมูลผิด

ใช้:

## Grounded Generation

AI ต้องตอบจาก:

* Retrieved Knowledge
* Verified Data

---

# 24. Confidence Score

ทุกคำตอบมีคะแนน:

Example:

```json
{
"confidence":0.91
}
```

---

# 25. Human Review System

ผู้เชี่ยวชาญสามารถ:

* เพิ่มข้อมูล
* แก้ไขข้อมูล
* Approve Knowledge

---

# 26. Knowledge Management

Admin สามารถ:

เพิ่ม:

* ต้นไม้ใหม่
* งานวิจัยใหม่
* กฎการออกแบบสวน

---

# 27. Backend Architecture

Structure:

```text
backend/


services/


├── rag/

│
├── embedding_service.py

├── retrieval_service.py

├── context_builder.py

└── llm_service.py

```

---

# 28. API Specification

## Ask AI

```
POST /api/ai/chat
```

Request:

```json
{
"question":

"แนะนำสวนสำหรับระเบียง"
}
```

---

Response:

```json
{
"answer":

"ควรใช้สวนแนวตั้ง",

"confidence":0.92
}
```

---

# 29. Performance Optimization

ใช้:

* Vector Index
* Cache
* Async Retrieval
* Metadata Filtering

---

# 30. Security

ป้องกัน:

* Knowledge Injection
* Prompt Injection
* Unauthorized Data Access

---

# 31. Future Development

## Personal AI Garden Agent

AI เรียนรู้:

* พื้นที่ของผู้ใช้
* พฤติกรรม
* ความชอบ

---

## Multi-modal RAG

รองรับ:

* Text
* Image
* Map
* Sensor Data

---

## Scientific Research Assistant

AI ช่วยค้น:

* งานวิจัย
* วิเคราะห์ข้อมูล
* สรุปรายงาน

---

# 32. Implementation Roadmap

## Phase 1

สร้าง:

✓ Plant Knowledge Base

✓ Basic Retrieval

---

## Phase 2

เพิ่ม:

✓ Vector Database

✓ RAG Pipeline

---

## Phase 3

เพิ่ม:

✓ Multi-modal AI

✓ Expert System

---

# 33. Definition of Done

RAG System สมบูรณ์เมื่อ:

✓ AI ค้น Knowledge ได้

✓ ใช้ข้อมูลจริงตอบ

✓ ลด Hallucination

✓ อธิบายเหตุผลได้

✓ เชื่อม Plant/GIS/Environmental Data

---

# END OF 34_AI_RAG_Knowledge_System_Architecture.md

ตอนนี้ GeoHeat AI มี 34 ไฟล์ Documentation แล้ว

ภาพรวม AI Layer ตอนนี้:

                GeoHeat AI Brain


              Large Language Model

                      +

                    RAG

                      |

 ------------------------------------------------

 |              |              |                |

Plant DB     GIS Data     Environment     Research

 |              |              |                |

 ------------------------------------------------

                      |

              AI Recommendation

                      |

          Garden Design + AR + Report