# 14_Security_Architecture.md

# GeoHeat AI Green Designer

## Security Architecture Specification

Version: **1.0**

---

# 1. Purpose

เอกสารนี้กำหนดมาตรฐานด้านความปลอดภัยของระบบ GeoHeat AI Green Designer เพื่อป้องกัน

* Unauthorized Access
* Data Leakage
* Account Abuse
* Malicious Upload
* API Attack
* AI System Abuse
* Privacy Violation

ระบบต้องมี Security ที่พร้อมใช้งานระดับ Production

---

# 2. Security Principles

ระบบใช้หลักการ

## Defense in Depth

สร้างความปลอดภัยหลายชั้น

```text
User

↓

Frontend Security

↓

API Security

↓

Authentication

↓

Authorization

↓

Database Security

↓

Storage Security

↓

Monitoring
```

---

## Least Privilege

ผู้ใช้และ Service แต่ละส่วนได้รับสิทธิ์เท่าที่จำเป็นเท่านั้น

---

## Zero Trust

ทุก Request ต้องตรวจสอบ

* Identity
* Permission
* Token
* Data Access

---

# 3. Security Architecture Overview

```text
                 User
                  |
                  ▼
             HTTPS / TLS
                  |
                  ▼
           Next.js Frontend
                  |
                  ▼
          Authentication Layer
                  |
                  ▼
           FastAPI Backend
                  |
        ┌─────────┴─────────┐
        ▼                   ▼
 Supabase Database      AI Service
        |
        ▼
   Storage Security
```

---

# 4. Authentication Security

Technology

* Supabase Auth
* JWT
* OAuth 2.0

---

# 5. Authentication Methods

Supported

## Email Authentication

Requirements

* Email Verification
* Secure Password Hash
* Password Reset

---

## Google OAuth

Security

* OAuth Token Validation
* HTTPS Callback
* State Verification

---

# 6. Password Policy

Minimum

* 8 Characters
* Uppercase
* Lowercase
* Number
* Special Character

ห้ามเก็บ Password แบบ Plain Text

---

# 7. Session Management

JWT Token

ประกอบด้วย

* User ID
* Role
* Expiration Time

---

Security Rules

* Short Access Token Lifetime
* Secure Refresh Token
* Automatic Expiration
* Logout ต้อง Revoke Session

---

# 8. Authorization System

Role Based Access Control (RBAC)

---

Roles

## User

สามารถ

* สร้าง Project
* Upload Image
* วิเคราะห์ AI
* ดู Report ของตัวเอง

---

## Admin

สามารถ

* Manage Users
* View System Analytics
* Manage AI Models
* Monitor Logs

---

## Developer

สามารถ

* Access Development Tools
* Debug System

---

# 9. Row Level Security (RLS)

Database ต้องเปิด RLS ทุก Table

Example

User สามารถอ่านข้อมูลของตัวเองเท่านั้น

```sql
user_id = auth.uid()
```

---

Protected Tables

* users
* projects
* project_images
* analyses
* reports
* recommendations

---

# 10. API Security

Backend ใช้

* FastAPI Security Middleware
* JWT Validation
* Request Validation

---

ทุก API ต้องตรวจสอบ

* Authentication
* Authorization
* Input Format
* Rate Limit

---

# 11. API Rate Limiting

Purpose

ป้องกัน

* Bot Attack
* API Abuse
* AI Cost Abuse

---

Example

Normal API

100 requests/minute

AI Analysis API

10 requests/minute

---

# 12. Input Validation

ทุก Input ต้อง Validate

ตรวจสอบ

* Type
* Length
* Format
* Range

---

ตัวอย่าง

Area Size

ไม่อนุญาต

```
-100 m²
```

---

# 13. File Upload Security

ระบบรับไฟล์จากกล้องและผู้ใช้

ต้องตรวจสอบ

## File Type

Allowed

* JPG
* JPEG
* PNG
* WEBP
* HEIC

---

## File Size

Maximum

20 MB

---

## File Content

ตรวจสอบ

* MIME Type
* File Signature
* Malware Scan (Future)

---

# 14. Image Privacy Protection

รูปภาพจากผู้ใช้ต้องได้รับการป้องกัน

Security

* Private Storage Bucket
* Signed URL
* Expiration Time
* Access Permission

---

# 15. Storage Security

Supabase Storage Rules

แบ่ง Bucket

```text
uploads

processed-images

ai-results

reports
```

---

Permission

User

เข้าถึงเฉพาะไฟล์ตัวเอง

Admin

เข้าถึงตาม Permission

---

# 16. Database Security

ใช้

* PostgreSQL Security
* RLS
* Prepared Query
* Parameterized Query

ป้องกัน

* SQL Injection
* Unauthorized Query

---

# 17. Data Encryption

Encryption In Transit

ใช้

* HTTPS
* TLS 1.3

---

Encryption At Rest

ใช้

* Database Encryption
* Storage Encryption

---

# 18. Location Data Security

ข้อมูล GPS เป็นข้อมูลสำคัญ

Protection

* จำกัด Permission
* ไม่เปิดเผย Public
* ใช้เฉพาะ Feature ที่จำเป็น

---

# 19. GIS Data Security

ป้องกัน

* Unauthorized Map Access
* Data Scraping
* Sensitive Location Exposure

---

ใช้

* Token Based Access
* Layer Permission
* API Validation

---

# 20. AI Security

## AI Input Protection

ตรวจสอบ

* Image Size
* Image Format
* Malicious Content

---

## AI Output Protection

ตรวจสอบ

* Confidence Score
* Invalid Result
* Model Error

---

# 21. AI Abuse Prevention

ป้องกัน

* Spam Analysis Request
* Automated Upload
* Excessive Processing

ใช้

* Rate Limit
* Queue System
* User Quota

---

# 22. Secret Management

ห้ามเก็บ

* API Key
* Database Password
* Token

ใน Code

---

ใช้

Environment Variables

```text
.env

.env.production
```

---

# 23. Security Headers

Frontend ต้องรองรับ

* Content Security Policy
* X-Frame-Options
* X-Content-Type-Options
* Referrer Policy
* HSTS

---

# 24. CORS Policy

อนุญาตเฉพาะ Domain ที่กำหนด

Example

Allowed

```
https://geoheat.ai
```

Blocked

```
unknown-domain.com
```

---

# 25. Logging & Audit Trail

เก็บ Log

* Login
* Logout
* Upload
* AI Request
* Data Export
* Permission Change

---

Audit Record

ประกอบด้วย

* User ID
* Action
* Timestamp
* IP Address
* Result

---

# 26. Monitoring & Detection

Tools

* Sentry
* Supabase Logs
* Cloud Monitoring

ตรวจสอบ

* Failed Login
* API Abuse
* Error Spike
* Suspicious Activity

---

# 27. Backup Security

Backup ต้อง

* Encrypt
* จำกัด Access
* ตรวจสอบ Restore ได้

---

# 28. Dependency Security

ตรวจสอบ Package

Tools

* npm audit
* Snyk
* Dependabot

---

# 29. OWASP Protection

ระบบต้องป้องกัน OWASP Top 10

รองรับ

## A01 Broken Access Control

ใช้ RLS + RBAC

---

## A02 Cryptographic Failures

ใช้ TLS + Encryption

---

## A03 Injection

ใช้ Validation

---

## A04 Insecure Design

ใช้ Security by Design

---

## A05 Security Misconfiguration

ใช้ Environment Configuration

---

## A06 Vulnerable Components

ใช้ Dependency Scan

---

## A07 Authentication Failures

ใช้ Secure Authentication

---

## A08 Software Integrity Failures

ใช้ CI/CD Security

---

## A09 Logging Failures

ใช้ Audit Log

---

## A10 SSRF

Validate External Request

---

# 30. Security Testing

ทดสอบ

* Authentication Attack
* Authorization Attack
* SQL Injection
* XSS
* File Upload Attack
* API Abuse
* Session Attack

---

Tools

* OWASP ZAP
* Burp Suite
* Snyk

---

# 31. Incident Response

เมื่อพบปัญหา

Step 1

Detect

↓

Step 2

Analyze

↓

Step 3

Contain

↓

Step 4

Fix

↓

Step 5

Monitor

---

# 32. Security Checklist Before Release

✓ HTTPS Enabled

✓ Authentication Tested

✓ RLS Enabled

✓ API Protected

✓ File Upload Secured

✓ Secrets Protected

✓ Security Headers Enabled

✓ Dependency Scan Passed

✓ Backup Tested

✓ Audit Logging Enabled

---

# 33. Definition of Done

Security Architecture ถือว่าสมบูรณ์เมื่อ

* ระบบมี Authentication และ Authorization
* Database ปลอดภัยด้วย RLS
* API มี Protection
* File Upload ปลอดภัย
* AI Pipeline มีการป้องกัน Abuse
* ข้อมูล GPS และ GIS ได้รับการปกป้อง
* ผ่าน Security Testing
* พร้อมใช้งาน Production

---

# END OF 14_Security_Architecture.md
