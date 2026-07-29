# GeoHeat AI Green Designer — Backend

FastAPI service implementing `API_SPECIFICATION_geoheat_ai_green_designer.md`.
Currently runs entirely on mock data / the `MockAIService` adapter — see
`AI_WORKFLOW_geoheat_ai_green_designer.md` section 17 for the plan to swap
in real YOLO/SAM/FLUX services later without changing the routes.

## Setup

```bash
python -m venv .venv
.venv/Scripts/activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env          # fill in Supabase credentials once available
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Notes

- Auth is handled client-side by Supabase Auth (see frontend
  `lib/supabase/`); this backend does not yet issue or verify its own JWTs.
- `projects`/`ai_analysis` endpoints use in-memory stores until the
  Supabase `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are set and the
  schema from `DATABASE_SCHEMA_geoheat_ai_green_designer.md` is applied.
