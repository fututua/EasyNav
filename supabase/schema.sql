-- ============================================================
-- EasyNav Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1. Click stats
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS click_stats (
  site_id    TEXT PRIMARY KEY,
  count      INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atomic increment via RPC (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_click(p_site_id TEXT)
RETURNS INTEGER AS $$
DECLARE new_count INTEGER;
BEGIN
  INSERT INTO click_stats (site_id, count)
  VALUES (p_site_id, 1)
  ON CONFLICT (site_id)
  DO UPDATE SET count = click_stats.count + 1, updated_at = NOW()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE click_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON click_stats;
DROP POLICY IF EXISTS "public insert" ON click_stats;
DROP POLICY IF EXISTS "public update" ON click_stats;
CREATE POLICY "public read" ON click_stats FOR SELECT USING (true);

-- ------------------------------------------------------------
-- 2. Tree hole (文字 + 图片，MVP 预留结构)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tree_hole (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  content    TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  image_url  TEXT,                          -- 可选配图（Supabase Storage 公开 URL）
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tree_hole ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON tree_hole;
DROP POLICY IF EXISTS "public insert" ON tree_hole;
CREATE POLICY "public read" ON tree_hole FOR SELECT USING (true);
CREATE POLICY "public insert" ON tree_hole FOR INSERT WITH CHECK (true);
-- 不允许匿名修改/删除，管理员通过 Dashboard 处理
