-- =============================================================
-- Heat Safe KK · Park Vote Table
-- รันใน Supabase Dashboard → SQL Editor
-- =============================================================

CREATE TABLE IF NOT EXISTS park_votes (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  park_type   text        NOT NULL
                          CHECK (park_type IN (
                            'pocket_park','green_walkway',
                            'sponge_park','green_roof','sponge_plaza'
                          )),
  district    text        NOT NULL CHECK (char_length(district) BETWEEN 1 AND 60),
  fingerprint text        NOT NULL CHECK (char_length(fingerprint) BETWEEN 4 AND 80),
  created_at  timestamptz DEFAULT now()
);

-- หนึ่ง fingerprint = หนึ่งโหวตเท่านั้น
ALTER TABLE park_votes
  ADD CONSTRAINT park_votes_fingerprint_unique UNIQUE (fingerprint);

-- Row Level Security
ALTER TABLE park_votes ENABLE ROW LEVEL SECURITY;

-- ทุกคนอ่านได้ (แสดงผลโหวต)
CREATE POLICY "public_select" ON park_votes
  FOR SELECT USING (true);

-- ทุกคนเพิ่มได้ (ส่งโหวต) แต่ server-side ยืนยัน unique fingerprint อีกครั้ง
CREATE POLICY "public_insert" ON park_votes
  FOR INSERT WITH CHECK (true);
