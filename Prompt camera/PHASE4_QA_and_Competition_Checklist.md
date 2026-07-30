# Phase 4 — QA Report & Competition Checklist

# GeoHeat AI Green Designer

Version: 1.0 — 2026-07-30

Companion to `00_MVP_Specification_FINAL.md`. This file is the practical, day-of-event checklist — print it or keep it open on a second screen during the demo.

---

# 1. Demo Checklist (run through right before presenting)

- [ ] Both servers running: `geoheat-ai/frontend` (`npm run dev` or deployed URL) and `geoheat-ai/backend` (`uvicorn app.main:app`)
- [ ] Confirm `geoheat-ai/frontend/.env.local` and `geoheat-ai/backend/.env` point at the **live** Supabase project (`smsohbjhzdtyzbxnzmhj`), not a stale local copy
- [ ] Log in with a **real, working demo account** (not the internal `demo@geoheat-ai.local` service account — that one has no discoverable password and isn't meant to be logged into; register a normal account ahead of time for the live login step)
- [ ] Confirm all 3 demo projects appear in "My Projects" with the **Demo** badge: สวนหลังบ้าน (Tropical), ระเบียงคอนโด (Minimal), ลานชุมชน (Low-Maintenance)
- [ ] Open each demo project once and confirm: image loads, analysis numbers show, Green Score gauge renders, garden recommendation shows plants + before/after images
- [ ] Do **not** click any upload/analyze/style-selector controls on a demo project during rehearsal — they're intentionally hidden for `is_demo` projects, so if you see them, something regressed (see §2 below)
- [ ] Pick which demo project best fits your time slot: **สวนหลังบ้าน** for the fullest before/after visual contrast, **ระเบียงคอนโด** to show it works for small/urban users, **ลานชุมชน** to show it scales beyond one household

# 2. Browser Testing Checklist (do this once, well before the event)

Test in the actual browser/device you'll present with — not just localhost on your dev machine.

- [ ] Landing page loads, hero CTA ("เริ่มวิเคราะห์พื้นที่") goes to project creation — **do not use an old cached page**, this link was fixed in Phase 4 (previously pointed to a dead route)
- [ ] Register a **new** throwaway account start-to-finish (email confirmation may be required — check your Supabase Auth settings; disabling "Confirm email" avoids depending on a live inbox during the demo)
- [ ] Login → Dashboard shows real data, no console errors (open DevTools console and check)
- [ ] Create a new (non-demo) project → appears in My Projects
- [ ] Upload a real photo on that project → Scanner page shows it
- [ ] Click "เริ่มวิเคราะห์ด้วย AI" → redirects to Analysis page with real numbers and a Green Score
- [ ] Garden Recommendation page → pick a style → see plants, cost, before/after
- [ ] Resize the browser window / test on a phone: layout should not break (cards should stack, no horizontal scroll)
- [ ] Test with a slow/throttled connection (DevTools → Network → Slow 3G) to see how loading states behave
- [ ] Confirm logging out and back in works, and that `/dashboard` redirects to `/login` when signed out

# 3. Presentation Checklist

- [ ] Have the **before/after visual contrast** ready as your strongest visual beat — it's the highest-impact moment in the flow
- [ ] Be ready to explain, if asked: the AI analysis is currently a **deterministic mock** standing in for real YOLO/SAM2 models (an intentional MVP decision — GPU hosting has no identified budget), swappable later via the `AIService` adapter interface without rewriting the app
- [ ] Be ready to explain the before/after images are **custom illustrations**, not photographs — a deliberate choice given no safe way to source licensed stock photography or generate images
- [ ] Know your Green Score formula by heart: Vegetation 30% / Shade 25% / Heat Reduction 20% / Diversity 15% / Maintenance 10%
- [ ] Have the 3 demo projects' rough numbers memorized in case a judge asks you to explain a specific figure (see `00_MVP_Specification_FINAL.md` §8.4-§8.7 for the exact seeded values)
- [ ] Know what's explicitly **out of scope for this MVP** and why, in case asked: AR, real AI image generation, satellite GIS/heat-map, AI agent/RAG — all deliberately cut for feasibility within the build window, documented in `00_MVP_Specification_FINAL.md` §2

# 4. Backup Plan If Internet / Live Demo Fails

Ranked by how much of the demo they save:

1. **Record a full screen-capture video walkthrough of the demo flow in advance.** This is the single most valuable backup — if anything at all goes wrong live, switch to the video instead of troubleshooting in front of judges.
2. **Take screenshots of each key screen** (dashboard, analysis result, Green Score, garden recommendation with before/after) as a slide-deck fallback if even video playback isn't possible.
3. **If only the backend is down**: the 3 demo projects' data lives entirely in Supabase, not behind the FastAPI backend, for *reading* — the dashboard/project pages read directly via Supabase, so demo projects may still render even if `uvicorn` isn't running. Live actions (create project, upload, analyze) will fail, but browsing the 3 seeded demo projects should still work.
4. **If Supabase itself is unreachable**: nothing in the live app will work — this is where the video/screenshots become mandatory, not optional.
5. **If deploying rather than running locally**: deploy well before the event and re-test on the actual deployed URL, not just localhost — hosting-specific issues (env vars, CORS) are a common last-minute surprise.

---

# 5. Phase 4 QA Findings (audit results, for the record)

## Bugs found and fixed

| # | Issue | Where | Fix |
|---|---|---|---|
| 1 | Broken link — landing page hero CTA pointed to `/dashboard/scanner`, a route that never existed (Scanner is project-scoped) | `app/page.tsx` | Repointed to `/dashboard/projects/new` |
| 2 | Accessibility — file upload `<input>` had no accessible name for screen readers | `components/projects/image-upload-form.tsx` | Added `aria-label` |
| 3 | UI consistency — custom garden-style picker buttons had no visible keyboard-focus ring, unlike every other interactive element in the app | `components/projects/garden-style-selector.tsx` | Added the same `focus-visible:ring` treatment used elsewhere |
| 4 | Misleading error — if AI analysis succeeded but the immediately-following Green Score calculation failed, the user saw "วิเคราะห์ไม่สำเร็จ" (analysis failed) even though the analysis had actually saved correctly | `components/projects/analyze-button.tsx` | Split into two try/catches — a real analysis failure still shows an error and stops; a green-score-only failure now shows a warning (not "failed") and still navigates to the analysis page, since there's real data to show |

## Checked and confirmed clean (no bug)

- All internal links cross-referenced against actual routes — only the one broken link above found
- All `lucide-react` icon imports valid (confirmed by clean TypeScript build)
- All images have `alt` text
- Signed-URL generation for multiple images correctly parallelized with `Promise.all` (not an accidental-sequential-await bug)
- Client/Server Component split is minimal and correct — only 7 app-specific Client Components, everything else is a Server Component (good for performance)
- No orphaned custom CSS classes
- Backend: `ruff` found zero unused imports / undefined names; error handling verified live (missing auth → 401, malformed JSON → 422, all clean, no unhandled 500s)
- Live console/log check across every route (public 200, protected 307 redirect-to-login, unknown route 404) — zero server warnings or errors
- RLS + Storage RLS re-verified with a third-party test account for demo-project visibility

## Findings noted, deliberately not changed (with reasoning)

- Several backend endpoints (`GET /projects`, `GET /projects/{id}`, `DELETE /projects/{id}`, `GET /ai/result/{id}`, `GET /plants`, `GET /history`, `/assistant/chat`, `/geoheat/data`, `/measurement/manual`, `/simulation/generate`) aren't called by the frontend — by design: the frontend reads most data directly via Supabase (RLS-scoped, no extra hop), and calls the backend only for writes needing business logic. These endpoints remain correct, tested, and available for API consumers/future phases — not deleted.
- `framer-motion` is installed but not yet imported anywhere — it's part of the approved tech stack (`00_MVP_Specification_FINAL.md` §5) for future animation work, not removed.
- 5 shadcn/ui primitives installed in Phase 1 (`avatar`, `dropdown-menu`, `progress`, `sheet`, `tabs`) aren't used by any page yet — standard component-library scaffold, not app-specific dead code, left in place.
- FastAPI's built-in validation-error responses (422) use a different JSON shape than the app's normal envelope, so the frontend shows a generic fallback message rather than the specific validation detail in that one edge case — low-probability with the curated demo flow, not changed to avoid scope creep into backend response normalization.

---

# END OF PHASE4_QA_and_Competition_Checklist.md
