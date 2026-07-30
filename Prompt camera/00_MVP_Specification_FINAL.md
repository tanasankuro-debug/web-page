# 00_MVP_Specification_FINAL.md

# GeoHeat AI Green Designer

## FINAL MVP Specification — Single Source of Truth

Version: **1.0 (FINAL)**

Status: **Authoritative.** Where this document conflicts with any of `01_...` through `45_...`, this document wins. Those docs remain valid as reference material, research framing, and post-MVP roadmap — they are not literal build requirements unless restated here.

Prepared by: Claude Code, following a full read of all 45 prior spec documents and a reconciliation pass to resolve internal contradictions found between them.

Context: University portfolio / innovation-competition project. Small team, no GPU/cloud budget, target build window 8–12 weeks (per `18_MVP_Feature_Priority.md`). This document optimizes for **a working, demo-ready, honestly-scoped product**, not maximum feature coverage.

---

# 1. MVP Feature List (Build This)

## 1.1 Core (must work for the demo to succeed)

| # | Feature | Notes |
|---|---|---|
| 1 | Authentication | Supabase Auth, email/password. Google OAuth if time allows — not required. |
| 2 | Project Management | Create/view/delete a project (name, description, location). |
| 3 | Image Upload | JPG/PNG/WEBP, browser-side compression, one photo per analysis for MVP (multi-image is post-MVP). |
| 4 | AI Area Analysis | Runs against `MockAIService` (already built) — returns total/green/concrete area breakdown, detected-object list, heat level. **Not real YOLO/SAM2 for MVP** (see §2). |
| 5 | Green Score | Single canonical formula (§4), displayed with the circular gauge component already built. |
| 6 | Plant Recommendation | Rule-based (temperature + sun exposure + area size → style + plant list), not LLM-generated prose. Explanation text can be templated ("Recommended because..."), not free-form AI generation. |
| 7 | Garden Style Selector | Exactly 3 styles for MVP: **Tropical, Minimal, Low-Maintenance** (per `18_MVP_Feature_Priority.md` Priority A). Not the full 10+ style list from other docs. |
| 8 | Before/After Preview | **Template-based, not AI-generated.** Show the user's uploaded photo next to a pre-made "after" illustration/photo matched to the chosen garden style (3 static template images, one per style). This satisfies the demo's "before/after" narrative (rated ★★★★★ for demo impact in doc 18) without requiring image-generation AI, GPU hosting, or per-request cost. |
| 9 | Dashboard | Heat status, Green Score, quick actions, recent projects — already built as UI shell, needs real data wiring. |
| 10 | Project History | List of past projects with score/date — a view over the Projects table, no new infrastructure. |

## 1.2 Build if time remains (not required for demo)

- Basic PDF/print export of a project's result page (browser print stylesheet is enough; no dedicated PDF-generation service).
- Simple budget estimate (plant count × flat per-category price — arithmetic, not AI).
- Google OAuth login.

---

# 2. Features Removed / Deferred (Explicitly Out of MVP)

Cutting these is a decision, not an oversight — each was flagged during the 45-doc review as either contradicting the 8–12 week timeline, requiring infrastructure/budget this project doesn't have, or explicitly ranked lower priority by the docs' own Priority system.

| Feature | Source doc(s) | Why deferred |
|---|---|---|
| Real YOLO/SAM2 inference | 04, 12, 20, 23, 29 | Requires GPU hosting with no identified free-tier option (flagged gap in doc 26). `MockAIService` behind the existing `AIService` adapter stays as the real implementation for MVP — this is a design choice, not a placeholder to apologize for. |
| AI image generation (FLUX/OpenAI/Stable Diffusion) | 04, 12, 24 | Ranked v1.5/Priority B in doc 18 itself. Replaced by template-based before/after (§1.1 item 8) for MVP. |
| AR Garden Preview (WebXR/ARCore/ARKit) | 31, 38, 39, 40 | Doc 18 ranks this Priority C/v2.0. Despite 900 lines of spec in doc 31 and appearing in the doc-39 demo script, it is cut from both the build **and** the demo plan — doc 40 itself pre-plans a fallback for "AR not working," which is a sign it shouldn't be relied on at all. |
| AI Agent / Tool-Calling framework | 35 | Doc 35 calls this its own "Phase 1 MVP," contradicting doc 18 (the authoritative MVP doc), which has no agent system in Priority A. A multi-week effort on its own; cut entirely for MVP. |
| RAG / Vector DB (pgvector) knowledge system | 33, 34 | Same reasoning as above — explicitly Phase 2+ in docs 33/34 themselves. |
| Satellite NDVI/LST GIS pipeline (Sentinel-2, Landsat) | 30, 32 | A remote-sensing data pipeline is a project on its own. Mapbox/PostGIS heat-map is deferred to post-MVP; MVP heat data can be a static/manual lookup table by location if a map is wanted at all. |
| Weather/Air-Quality API integration | 32 | Deferred with GIS; not needed for the core analyze→recommend→visualize loop. |
| GeoHeat Score, Environmental Comfort Score | 30, 32 | Redundant with Green Score (§4). Dropped as separate user-facing metrics. Their underlying signals (heat level, NDVI-like green ratio) already feed into Green Score's inputs — no information is lost, just the duplicate scoring UI. |
| Redis / Celery background workers, task queue | 15 (as Future) vs. 20/21/23 (assumed present) | MVP stays synchronous — the mock AI call returns immediately, so there's no latency problem to queue around. Revisit only if real model inference is ever added. |
| Full MLOps (model registry, drift detection, automated retraining) | 43 | Enterprise practice, not applicable — there's no trained model to retrain. |
| 90%+ automated test coverage, k6 load testing at 1000 users | 13, 25 | Unrealistic for team size/timeline. MVP testing bar: manual QA of the golden path + a handful of unit tests on the Green Score/recommendation logic (pure functions, cheap to test, already written in a testable style in the backend). |
| Expert User role, multi-tenant/org accounts, community sharing | 17, 45 | Single user role (per project owner) is sufficient for MVP. |
| Multiple duplicate `plants` schemas | 19, 28, 33 | Resolved to one schema (§3). |
| Two Deployment Architecture docs (11, 26) | — | Superseded by this doc's stack (§5) and existing scaffold; treat 11/26 as historical reference only. |

---

# 3. Final Database Schema

Reconciles docs 05, 19, 28, 33 into one schema. Matches (and lightly extends) what the FastAPI backend's Pydantic models already assume — no incompatible rework needed, just additive Supabase tables once unblocked.

```sql
-- Auth: Supabase's built-in auth.users is the source of truth for login.
-- This table extends it with app-specific profile fields.
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  avatar_url    text,
  created_at    timestamptz not null default now()
);

create table projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  name          text not null,
  description   text,
  location      geography(point, 4326),   -- nullable; GIS is optional for MVP
  address       text,
  area_size     float,
  status        text not null default 'draft',  -- draft | analyzed | completed
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  image_url     text not null,
  image_type    text not null default 'before',  -- before | template_after
  created_at    timestamptz not null default now()
);

create table ai_analysis_results (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects(id) on delete cascade,
  image_id          uuid references project_images(id),
  total_area        float,
  green_area        float,
  concrete_area     float,
  green_percentage  float,
  heat_level        text,          -- low | moderate | high | extreme
  detected_objects  jsonb,         -- [{type, confidence, bbox}] — kept as JSON, no separate table (MVP doesn't need to query individual detections)
  created_at        timestamptz not null default now()
);

create table green_scores (
  id                     uuid primary key default gen_random_uuid(),
  project_id             uuid not null references projects(id) on delete cascade,
  vegetation_score       float not null,   -- 0-100, weight 0.30
  shade_score            float not null,   -- 0-100, weight 0.25
  heat_reduction_score   float not null,   -- 0-100, weight 0.20
  diversity_score        float not null,   -- 0-100, weight 0.15
  maintenance_score      float not null,   -- 0-100, weight 0.10
  total_score            float not null,   -- computed, see §4
  created_at             timestamptz not null default now()
);

create table plants (
  id                  uuid primary key default gen_random_uuid(),
  name_th             text not null,
  name_en             text,
  scientific_name      text,
  category            text,        -- tree | shrub | ground_cover | indoor
  sun_requirement      text,        -- full_sun | partial_sun | shade
  water_requirement    text,        -- low | medium | high
  maintenance_level    text,        -- easy | medium | hard
  heat_tolerance       float,       -- 0-100
  cooling_score        float,       -- 0-100
  max_height_m         float,
  min_area_sqm         float,
  image_url            text,
  description          text
);

create table garden_designs (
  id                    uuid primary key default gen_random_uuid(),
  project_id            uuid not null references projects(id) on delete cascade,
  style                 text not null,   -- tropical | minimal | low_maintenance
  description           text,
  estimated_cost         float,
  cooling_effect         text,           -- low | medium | high
  template_after_image   text,           -- static template image url, §1.1 item 8
  created_at             timestamptz not null default now()
);

create table garden_design_plants (
  id                uuid primary key default gen_random_uuid(),
  garden_design_id  uuid not null references garden_designs(id) on delete cascade,
  plant_id          uuid not null references plants(id),
  quantity          integer not null default 1
);
```

**Explicitly not created for MVP**: `detected_objects`/`segmentation_results` as separate tables (folded into `ai_analysis_results.detected_objects` jsonb), `geoheat_environment_data`, `simulations` (replaced by `garden_designs.template_after_image`), `ar_sessions`/`ar_design_objects`, `knowledge_embeddings`, `tasks`, `user_ai_memory`, `user_preferences`. Add these later only when the feature they support is actually being built.

RLS: every table with a `project_id` or `user_id` column gets `auth.uid() = user_id` (directly or via a join to `projects.user_id`) — per doc 05/14's standard, unchanged.

---

# 4. Final Green Score Formula

**Adopting docs 16/19's version as canonical** (it's the more complete, named-factor version, and Product/UX docs 01-02 already reference "Green Score" in this shape):

```
Green Score = (Vegetation Coverage × 0.30)
            + (Shade Coverage       × 0.25)
            + (Heat Reduction       × 0.20)
            + (Plant Diversity      × 0.15)
            + (Maintenance/Sustainability × 0.10)
```

Each component is a 0-100 sub-score; the result is 0-100.

**This changes the already-built backend.** `geoheat-ai/backend/app/services/green_score.py` currently implements a different formula (Green 40% / Shade 25% / Cooling 25% / Diversity 10%, from doc 04) — that will be updated to match this formula exactly when implementation resumes (§7, Phase 1 task). No other code changes are implied by this.

For MVP, sub-score inputs are derived deterministically from the mock analysis output (e.g., `vegetation_score` scales with `green_percentage`, `heat_reduction_score` scales inversely with `heat_level`) rather than from real sensor/model data — consistent with §2's decision to keep AI mocked.

---

# 5. Final Technology Stack

## In scope for MVP (already scaffolded, keep building on it)

**Frontend** (`geoheat-ai/frontend/`): Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui (**note: this shadcn version runs on Base UI, not Radix** — use `render={<Link/>}`, not `asChild`), Framer Motion, Zustand, TanStack Query, Lucide icons, `@supabase/supabase-js` + `@supabase/ssr`.

**Backend** (`geoheat-ai/backend/`): FastAPI, Python 3.12, Pydantic, Uvicorn, `python-multipart`. Supabase Python client installed, not yet connected (blocked on your Supabase quota action).

**Database**: Supabase (Postgres + Auth + Storage + RLS). PostGIS extension can stay enabled (cheap, already assumed in schema) even though active GIS features are deferred.

## Explicitly excluded from MVP stack

Mapbox GL JS, active PostGIS spatial queries, Redis, Celery, pgvector, real YOLO/SAM2 model runtime, WebXR/Three.js/MindAR, OpenAI/Stability image-generation APIs, Chart.js/Recharts (no analytics dashboards in MVP — just the Green Score gauge and heat status card already built), Sentry/OWASP ZAP/Snyk (revisit only if this goes beyond a demo/competition context).

---

# 6. Final Folder Structure

Matches what's already built — no restructuring needed, just filling in gaps. (Doc 27's separate `ai-engine/` deployable unit and `repositories/` layer are **not** adopted for MVP; the mock AI service living inside `backend/app/services/ai/` is sufficient at this scale.)

```
web-page/                          # existing static site (unrelated to this feature)
Prompt camera/                     # the 45 spec docs + this final spec
geoheat-ai/
  frontend/
    src/
      app/
        page.tsx                  # landing (built)
        (auth)/login, register     # built, needs live Supabase
        dashboard/
          page.tsx                # built, needs real data
          scanner/                # NEW: camera/upload page
          analysis/[projectId]/    # NEW: analysis result page
          garden/[projectId]/      # NEW: garden recommendation + before/after
          projects/                # NEW: project history list
      components/
        ui/                       # shadcn primitives + GlassCard, ScoreCircle (built)
        layout/                   # Navbar, Sidebar (built)
        auth/                     # AuthForm (built)
        scanner/                  # NEW
        garden/                   # NEW
      lib/supabase/               # client.ts, server.ts (built)
  backend/
    app/
      api/v1/                     # all routers built (projects, images, ai, measurement, geoheat, garden, simulation, green_score, history, assistant)
      core/config.py              # built
      models/schemas.py           # built — extend per §3 schema additions
      services/
        ai/                       # base.py (AIService), mock_service.py (built)
        recommendation.py         # built — rule-based
        green_score.py            # built — formula update per §4
    requirements.txt / .env.example / README.md   # built
```

---

# 7. Development Order

Phased to build on what already exists, not restart from zero.

**Phase 0 — Unblock (prerequisite, not started)**
Free a Supabase project slot (your action, dashboard-only). Nothing in Phase 1+ that touches real data can proceed without this.

**Phase 1 — Reconcile & Connect**
- Update `green_score.py` to the final formula (§4).
- Apply the final schema (§3) as a Supabase migration once unblocked.
- Wire frontend dashboard to real backend/Supabase data (replace mock arrays).
- Wire login/register pages to a real Supabase project.

**Phase 2 — Core User Flow**
- Build Scanner page (upload + calls `/ai/analyze`).
- Build Analysis Result page (calls `/ai/result`).
- Build Garden Recommendation page (calls `/garden/recommend`, shows 3-style selector).
- Build Before/After template preview (static images per style, §1.1 item 8).

**Phase 3 — Polish for Demo**
- Real plant seed data (aim for enough variety to look credible, not literally "50+" unless time allows).
- 2-3 pre-baked demo projects so the live demo doesn't depend on live typing/upload.
- Project history page.
- Green Score gauge + dashboard visuals polished.

**Phase 4 — Buffer**
- Whatever's left from §1.2 (PDF export, budget estimate, Google login) only if Phases 1-3 finished with time to spare.

Each phase ends with a check-in before starting the next, same as the Phase-1 frontend/backend scaffold earlier in this build.

---

# 8. Demo Mode Specification

**Approved as an addition to this spec (2026-07-30), before Phase 0 implementation began.**

## 8.1 Purpose

The competition demo must work reliably without depending on live AI processing or external API availability. This is achieved by **pre-seeding complete, finished data for a fixed set of demo projects directly into the database**, not by adding a special "demo code path." The dashboard, analysis, garden-recommendation, and history pages read demo projects exactly the same way they read any real project — there is no separate rendering logic to build or maintain. Live analysis (via `MockAIService`, itself already instant/local per §2) remains available for anyone who wants to try a real upload during or after the demo; it just isn't what the rehearsed demo relies on.

## 8.2 Demo Projects (3, matching the three MVP garden styles)

| # | Project name | Scenario | Area | Garden style | Rationale |
|---|---|---|---|---|---|
| 1 | สวนหลังบ้าน (Backyard) | Home backyard, concrete-heavy, high heat | 20 m² | Tropical | Largest single-family scenario; strongest before/after visual contrast |
| 2 | ระเบียงคอนโด (Condo Balcony) | Small urban balcony, very limited space | 5 m² | Minimal | Demonstrates the app works for small/urban users, not just houses |
| 3 | ลานชุมชน (Community Open Space) | Shared outdoor area, moderate heat, larger scale | 100 m² | Low-Maintenance | Shows scalability beyond a single household; matches doc 40's "Community Green Area" demo persona |

These names/sizes match what's already in the dashboard's mock `recentProjects` array (`geoheat-ai/frontend/src/app/dashboard/page.tsx`) — Phase 1 replaces that mock array with real reads from these seeded rows, so the visible dashboard content won't change from what's already been demoed to you.

## 8.3 Sample Images

Two image roles per §1.1 item 8 (template-based before/after, not AI-generated):

- **"Before" photos** — one real or stock photo per demo project (3 total), stored in Supabase Storage under `demo/before/{project-slug}.jpg`. Source: royalty-free stock photography chosen to plausibly match each scenario (concrete backyard / small balcony / open paved lot) — sourcing these is a content task for Phase 3, not a technical one.
- **"After" template photos** — one per garden style (3 total, reused across any project using that style), stored under `demo/after/{style}.jpg` (`tropical`, `minimal`, `low_maintenance`). Same images a real (non-demo) user would see after choosing that style — demo projects don't get bespoke after-images, reinforcing that this is the same code path as the real flow.

## 8.4 Sample AI Analysis Results

Fixed, hand-authored `ai_analysis_results` rows (matching the schema in §3) — not generated by calling `MockAIService` at demo time, so the numbers are stable and reviewable ahead of the event:

| Project | total_area | green_area | concrete_area | green_percentage | heat_level | detected_objects (summary) |
|---|---|---|---|---|---|---|
| สวนหลังบ้าน | 20 m² | 3 m² | 15 m² | 15% | high | concrete (0.95), tree ×1 (0.88), wall (0.91) |
| ระเบียงคอนโด | 5 m² | 0.5 m² | 4 m² | 10% | high | concrete (0.93), pot ×2 (0.80) |
| ลานชุมชน | 100 m² | 20 m² | 70 m² | 20% | extreme | concrete (0.97), building (0.90), tree ×2 (0.85) |

`detected_objects` stored as the `jsonb` array the schema already expects (`[{type, confidence, bbox}]`) — bbox values can be arbitrary plausible placeholders since no real image coordinates exist for stock photos.

## 8.5 Sample Green Score

Computed with the §4 formula, authored directly (not derived live) so the "before → after" narrative is guaranteed to look good on demo day:

| Project | Vegetation | Shade | Heat Reduction | Diversity | Maintenance | **Total (current)** | **Total (projected after design)** |
|---|---|---|---|---|---|---|---|
| สวนหลังบ้าน | 20 | 15 | 10 | 20 | 60 | **~19** | **~78** |
| ระเบียงคอนโด | 15 | 10 | 15 | 10 | 70 | **~17** | **~65** |
| ลานชุมชน | 30 | 20 | 15 | 25 | 50 | **~24** | **~72** |

"Projected after" is a second `green_scores` row per project (or a `stage` column: `current` vs `projected`) representing what the score would be if the recommended garden design were implemented — this is a display/content decision, not a new AI capability: the projected numbers are authored the same way the current ones are, just chosen to tell a credible "meaningfully better" story (mirrors doc 37's own example of a 35→75 improvement).

## 8.6 Sample Plant Recommendations

One fixed plant list per garden style (matches the 3 approved MVP styles exactly):

- **Tropical** (สวนหลังบ้าน): หมากเหลือง ×3, เฟิร์น ×4, พลูด่าง ×5
- **Minimal** (ระเบียงคอนโด): ไม้อวบน้ำ (succulent) ×6
- **Low-Maintenance** (ลานชุมชน): ไม้ทนแล้ง/ทนแดด — to be selected from the final `plants` table once Phase 1 seed data is written; placeholder until then.

**Action item surfaced by writing this section:** `geoheat-ai/backend/app/services/recommendation.py` currently defines styles `tropical`, `minimal`, `japanese`, `edible` — not the three approved MVP styles (Tropical/Minimal/**Low-Maintenance**). This needs to change from `japanese`/`edible` to `low_maintenance` as part of Phase 1 (§7), alongside the already-planned Green Score formula fix. Flagging here so it isn't missed once Phase 1 starts.

## 8.7 Sample Garden Designs

One `garden_designs` row per demo project, referencing the matching style's template after-image (§8.3) and plant list (§8.6):

| Project | Style | Estimated cost | Cooling effect | template_after_image |
|---|---|---|---|---|
| สวนหลังบ้าน | Tropical | ฿6,500 | High | `demo/after/tropical.jpg` |
| ระเบียงคอนโด | Minimal | ฿2,000 | Medium | `demo/after/minimal.jpg` |
| ลานชุมชน | Low-Maintenance | ฿12,000 | Medium | `demo/after/low_maintenance.jpg` |

## 8.8 Reliability Notes (non-technical, operational)

- Because demo data lives in the database rather than being computed at click-time, the only live dependency during the demo is reaching Supabase + the deployed/local app itself — there is no external AI API call anywhere in the approved MVP scope (§5) to fail.
- Doc 40's own risk mitigation (record a short video walkthrough as an absolute fallback for total connectivity loss) is still worth doing before the event, but is a logistics step, not something this app needs to build.

---

# END OF 00_MVP_Specification_FINAL.md
