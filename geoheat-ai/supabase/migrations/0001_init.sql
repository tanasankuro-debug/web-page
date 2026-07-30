-- ============================================================================
-- GeoHeat AI Green Designer — MVP Database Migration
-- Source: Prompt camera/00_MVP_Specification_FINAL.md
-- Target: Supabase PostgreSQL. No PostGIS. Run once, in full, in SQL Editor.
-- ============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ── Shared trigger: keep updated_at current ─────────────────────────────
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- users: extends auth.users with app profile fields.
create table users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on users
  for each row execute procedure set_updated_at();

-- Auto-create a users row whenever someone signs up via Supabase Auth.
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- projects
create table projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  name          text not null,
  description   text,
  address       text,
  latitude      float8,
  longitude     float8,
  area_size     float8,
  status        text not null default 'draft'
                  check (status in ('draft', 'analyzed', 'completed')),
  is_demo       boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on projects
  for each row execute procedure set_updated_at();

-- project_images
create table project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  user_id     uuid not null references users(id) on delete cascade,
  image_url   text not null,
  image_type  text not null default 'before'
                check (image_type in ('before', 'template_after')),
  created_at  timestamptz not null default now()
);

-- analysis_results
create table analysis_results (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects(id) on delete cascade,
  user_id           uuid not null references users(id) on delete cascade,
  image_id          uuid references project_images(id) on delete set null,
  total_area        float8,
  green_area        float8,
  concrete_area     float8,
  green_percentage  float8,
  heat_level        text check (heat_level in ('low', 'moderate', 'high', 'extreme')),
  detected_objects  jsonb not null default '[]',
  created_at        timestamptz not null default now()
);

-- green_scores
create table green_scores (
  id                     uuid primary key default gen_random_uuid(),
  project_id             uuid not null references projects(id) on delete cascade,
  user_id                uuid not null references users(id) on delete cascade,
  stage                  text not null default 'current'
                           check (stage in ('current', 'projected')),
  vegetation_score       float8 not null check (vegetation_score between 0 and 100),
  shade_score            float8 not null check (shade_score between 0 and 100),
  heat_reduction_score   float8 not null check (heat_reduction_score between 0 and 100),
  diversity_score        float8 not null check (diversity_score between 0 and 100),
  maintenance_score      float8 not null check (maintenance_score between 0 and 100),
  total_score            float8 not null check (total_score between 0 and 100),
  created_at             timestamptz not null default now()
);

-- plants: shared reference table, not user-owned.
create table plants (
  id                    uuid primary key default gen_random_uuid(),
  name_th               text not null,
  name_en               text,
  scientific_name       text,
  category              text not null
                          check (category in ('tree', 'shrub', 'ground_cover', 'succulent', 'vine', 'indoor')),
  sunlight_requirement  text check (sunlight_requirement in ('full_sun', 'partial_sun', 'shade')),
  water_requirement     text check (water_requirement in ('low', 'medium', 'high')),
  maintenance_level     text check (maintenance_level in ('low', 'medium', 'high')),
  heat_tolerance        float8 check (heat_tolerance between 0 and 100),
  cooling_score         float8 check (cooling_score between 0 and 100),
  max_height_m          float8,
  min_area_sqm          float8,
  image_url             text,
  description           text,
  created_at            timestamptz not null default now()
);

-- recommendations: AI-suggested garden option(s) for a project.
create table recommendations (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects(id) on delete cascade,
  user_id          uuid not null references users(id) on delete cascade,
  style            text not null check (style in ('tropical', 'minimal', 'low_maintenance')),
  plants           jsonb not null default '[]',  -- [{plant_id, name_th, quantity}]
  estimated_cost   float8,
  cooling_effect   text check (cooling_effect in ('low', 'medium', 'high')),
  reasoning        text,
  created_at       timestamptz not null default now()
);

-- garden_designs: the user's saved/chosen design (may originate from a recommendation).
create table garden_designs (
  id                     uuid primary key default gen_random_uuid(),
  project_id             uuid not null references projects(id) on delete cascade,
  user_id                uuid not null references users(id) on delete cascade,
  recommendation_id      uuid references recommendations(id) on delete set null,
  style                  text not null check (style in ('tropical', 'minimal', 'low_maintenance')),
  description            text,
  estimated_cost         float8,
  cooling_effect         text check (cooling_effect in ('low', 'medium', 'high')),
  template_after_image   text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create trigger garden_designs_set_updated_at
  before update on garden_designs
  for each row execute procedure set_updated_at();

-- reports: generated exports for a project.
create table reports (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  user_id       uuid not null references users(id) on delete cascade,
  format        text not null default 'pdf' check (format in ('pdf', 'json')),
  file_url      text,
  generated_at  timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index idx_projects_user_id on projects(user_id);
create index idx_projects_created_at on projects(created_at);

create index idx_project_images_project_id on project_images(project_id);
create index idx_project_images_user_id on project_images(user_id);

create index idx_analysis_results_project_id on analysis_results(project_id);
create index idx_analysis_results_user_id on analysis_results(user_id);
create index idx_analysis_results_created_at on analysis_results(created_at);

create index idx_green_scores_project_id on green_scores(project_id);
create index idx_green_scores_user_id on green_scores(user_id);

create index idx_recommendations_project_id on recommendations(project_id);
create index idx_recommendations_user_id on recommendations(user_id);

create index idx_garden_designs_project_id on garden_designs(project_id);
create index idx_garden_designs_user_id on garden_designs(user_id);

create index idx_reports_project_id on reports(project_id);
create index idx_reports_user_id on reports(user_id);

create index idx_plants_category on plants(category);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table users enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table analysis_results enable row level security;
alter table green_scores enable row level security;
alter table plants enable row level security;
alter table recommendations enable row level security;
alter table garden_designs enable row level security;
alter table reports enable row level security;

-- users: read/update own row only.
create policy "users select own" on users
  for select using (auth.uid() = id);
create policy "users update own" on users
  for update using (auth.uid() = id);

-- projects: own rows, plus demo projects (is_demo = true) readable by anyone
-- signed in — required by the approved Demo Mode Specification (§8 of the
-- final spec) so the competition demo doesn't depend on a specific account.
create policy "projects select own or demo" on projects
  for select using (auth.uid() = user_id or is_demo = true);
create policy "projects insert own" on projects
  for insert with check (auth.uid() = user_id);
create policy "projects update own" on projects
  for update using (auth.uid() = user_id);
create policy "projects delete own" on projects
  for delete using (auth.uid() = user_id);

-- project_images: own rows, plus rows belonging to a demo project.
create policy "project_images select own or demo" on project_images
  for select using (
    auth.uid() = user_id
    or exists (select 1 from projects p where p.id = project_id and p.is_demo)
  );
create policy "project_images insert own" on project_images
  for insert with check (auth.uid() = user_id);
create policy "project_images delete own" on project_images
  for delete using (auth.uid() = user_id);

-- analysis_results: own rows, plus rows belonging to a demo project.
create policy "analysis_results select own or demo" on analysis_results
  for select using (
    auth.uid() = user_id
    or exists (select 1 from projects p where p.id = project_id and p.is_demo)
  );
create policy "analysis_results insert own" on analysis_results
  for insert with check (auth.uid() = user_id);

-- green_scores: own rows, plus rows belonging to a demo project.
create policy "green_scores select own or demo" on green_scores
  for select using (
    auth.uid() = user_id
    or exists (select 1 from projects p where p.id = project_id and p.is_demo)
  );
create policy "green_scores insert own" on green_scores
  for insert with check (auth.uid() = user_id);

-- plants: shared reference data — readable by any signed-in user, not owned.
create policy "plants select all authenticated" on plants
  for select using (auth.role() = 'authenticated');

-- recommendations: own rows, plus rows belonging to a demo project.
create policy "recommendations select own or demo" on recommendations
  for select using (
    auth.uid() = user_id
    or exists (select 1 from projects p where p.id = project_id and p.is_demo)
  );
create policy "recommendations insert own" on recommendations
  for insert with check (auth.uid() = user_id);

-- garden_designs: own rows, plus rows belonging to a demo project.
create policy "garden_designs select own or demo" on garden_designs
  for select using (
    auth.uid() = user_id
    or exists (select 1 from projects p where p.id = project_id and p.is_demo)
  );
create policy "garden_designs insert own" on garden_designs
  for insert with check (auth.uid() = user_id);
create policy "garden_designs update own" on garden_designs
  for update using (auth.uid() = user_id);

-- reports: strictly own rows only (not exposed for demo projects).
create policy "reports select own" on reports
  for select using (auth.uid() = user_id);
create policy "reports insert own" on reports
  for insert with check (auth.uid() = user_id);

-- ============================================================================
-- STORAGE
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('geoheat-storage', 'geoheat-storage', false)
on conflict (id) do nothing;

-- Authenticated users can upload into their own folder: users/{user_id}/...
create policy "storage insert own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'geoheat-storage'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- Users can read their own uploaded images, plus shared demo/ assets
-- (needed for the approved Demo Mode Specification).
create policy "storage select own or demo"
  on storage.objects for select
  using (
    bucket_id = 'geoheat-storage'
    and (
      (storage.foldername(name))[1] = 'demo'
      or (
        (storage.foldername(name))[1] = 'users'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
    )
  );

create policy "storage delete own folder"
  on storage.objects for delete
  using (
    bucket_id = 'geoheat-storage'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================================================
-- SEED DATA — plants (22 entries covering all 3 MVP garden styles)
-- ============================================================================
insert into plants
  (name_th, name_en, scientific_name, category, sunlight_requirement, water_requirement, maintenance_level, heat_tolerance, cooling_score, max_height_m, min_area_sqm, description)
values
  ('หมากเหลือง', 'Golden Cane Palm', 'Dypsis lutescens', 'tree', 'full_sun', 'medium', 'low', 85, 80, 4, 1.5, 'ปาล์มโตเร็ว ให้ร่มเงาดี เหมาะปลูกเป็นแนวกันแดด'),
  ('เฟิร์น', 'Boston Fern', 'Nephrolepis exaltata', 'ground_cover', 'shade', 'high', 'medium', 40, 60, 0.6, 0.3, 'ใบเขียวชอุ่ม ช่วยเพิ่มความชื้นในพื้นที่ร่ม'),
  ('พลูด่าง', 'Golden Pothos', 'Epipremnum aureum', 'vine', 'partial_sun', 'medium', 'low', 60, 55, 1, 0.2, 'ไม้เลื้อยดูแลง่าย ทนสภาพแวดล้อมหลากหลาย'),
  ('ไม้อวบน้ำ', 'Echeveria', 'Echeveria spp.', 'succulent', 'full_sun', 'low', 'low', 95, 30, 0.2, 0.1, 'ทนแล้งสูง เหมาะกับพื้นที่ระเบียงขนาดเล็ก'),
  ('ไทรเกาหลี', 'Ficus', 'Ficus annulata', 'tree', 'full_sun', 'medium', 'medium', 80, 85, 6, 2, 'ทรงพุ่มหนา ให้ร่มเงาและลดอุณหภูมิได้ดี'),
  ('โมก', 'Wrightia', 'Wrightia religiosa', 'shrub', 'full_sun', 'medium', 'low', 75, 65, 2, 0.8, 'ดอกหอม ทรงพุ่มเป็นระเบียบ ดูแลง่าย'),
  ('เข็ม', 'Ixora', 'Ixora coccinea', 'shrub', 'full_sun', 'medium', 'low', 80, 55, 1.5, 0.5, 'ไม้พุ่มดอกสีสันสดใส เหมาะปลูกเป็นแนวรั้ว'),
  ('ทองอุไร', 'Yellow Bells', 'Tecoma stans', 'shrub', 'full_sun', 'low', 'low', 85, 60, 3, 1, 'ทนแล้ง ออกดอกดกตลอดปี'),
  ('ตะบองเพชร', 'Cactus', 'Cactaceae spp.', 'succulent', 'full_sun', 'low', 'low', 98, 20, 1, 0.15, 'ทนแล้งสูงสุด เหมาะพื้นที่แดดจัดไม่มีร่มเงา'),
  ('หญ้ามาเลเซีย', 'Malaysian Grass', 'Zoysia matrella', 'ground_cover', 'full_sun', 'medium', 'medium', 70, 50, 0.1, 1, 'หญ้าปูสนามยอดนิยม ทนแดดและการเดินเหยียบ'),
  ('บอนสี', 'Caladium', 'Caladium bicolor', 'ground_cover', 'shade', 'high', 'medium', 45, 45, 0.5, 0.3, 'ใบลวดลายสวยงาม เหมาะปลูกในที่ร่ม'),
  ('ว่านหางจระเข้', 'Aloe Vera', 'Aloe vera', 'succulent', 'full_sun', 'low', 'low', 90, 25, 0.5, 0.2, 'ทนแล้ง ดูแลง่าย ใช้ประโยชน์ได้หลากหลาย'),
  ('ลีลาวดี', 'Frangipani', 'Plumeria spp.', 'tree', 'full_sun', 'low', 'low', 88, 70, 5, 2, 'ดอกหอม ทนแล้ง เหมาะเป็นไม้ประธานสวน'),
  ('จามจุรี', 'Rain Tree', 'Samanea saman', 'tree', 'full_sun', 'medium', 'high', 75, 95, 15, 8, 'ทรงพุ่มใหญ่ ให้ร่มเงากว้าง ลดความร้อนได้สูงสุด'),
  ('หมากผู้หมากเมีย', 'Cordyline', 'Cordyline fruticosa', 'shrub', 'partial_sun', 'medium', 'low', 65, 50, 1.5, 0.4, 'ใบสีสันสวยงาม ปลูกง่ายทนทาน'),
  ('เศรษฐีเรือนใน', 'Chinese Evergreen', 'Aglaonema spp.', 'indoor', 'shade', 'medium', 'low', 30, 40, 0.6, 0.2, 'เหมาะปลูกในอาคารหรือพื้นที่แสงน้อย'),
  ('กล้วยไม้', 'Orchid', 'Orchidaceae spp.', 'indoor', 'partial_sun', 'medium', 'high', 50, 30, 0.4, 0.1, 'ไม้ประดับสวยงาม ต้องการการดูแลเฉพาะทาง'),
  ('แก้ว', 'Orange Jasmine', 'Murraya paniculata', 'shrub', 'full_sun', 'medium', 'medium', 78, 60, 3, 1, 'พุ่มหนาแน่น ดอกหอม ใช้ปลูกเป็นแนวรั้วได้ดี'),
  ('มะลิ', 'Jasmine', 'Jasminum sambac', 'shrub', 'full_sun', 'medium', 'medium', 70, 45, 1, 0.4, 'ดอกหอม นิยมปลูกประดับสวนไทย'),
  ('สับปะรดสี', 'Bromeliad', 'Bromeliaceae spp.', 'ground_cover', 'partial_sun', 'medium', 'low', 55, 35, 0.4, 0.2, 'ใบสีสันสด ทนทาน เหมาะจัดสวนแนวตั้ง'),
  ('ปาล์มขวด', 'Bottle Palm', 'Hyophorbe lagenicaulis', 'tree', 'full_sun', 'medium', 'low', 85, 75, 3, 1.5, 'ลำต้นรูปทรงเด่น เหมาะเป็นไม้ประธาน'),
  ('เฟื่องฟ้า', 'Bougainvillea', 'Bougainvillea spp.', 'vine', 'full_sun', 'low', 'low', 90, 65, 2, 0.6, 'ทนแล้งสูง ดอกดกสีสันสดใส ปลูกเป็นซุ้มหรือรั้ว');
