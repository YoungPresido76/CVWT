import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// ─── Live Client (when env vars are present) ──────────────────────────────────
export let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  })
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// ─── Database Schema Reference ────────────────────────────────────────────────
/*
  SQL — run in Supabase SQL Editor:

  -- Quotes table
  CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Coding','Design','Innovation','Leadership','Productivity','Community')),
    reading_time_seconds INT NOT NULL DEFAULT 30,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Daily Featured
  CREATE TABLE daily_featured (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id),
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Favorites
  CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    quote_id UUID REFERENCES quotes(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, quote_id)
  );

  -- Achievements
  CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_name TEXT NOT NULL,
    achievement_title TEXT NOT NULL,
    achievement_description TEXT NOT NULL,
    category TEXT NOT NULL,
    profile_image_url TEXT,
    card_dimension TEXT NOT NULL DEFAULT 'instagram',
    theme TEXT NOT NULL DEFAULT 'cvwt-neon',
    likes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Certificates
  CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name TEXT NOT NULL,
    award_type TEXT NOT NULL,
    date DATE NOT NULL,
    has_signature BOOLEAN NOT NULL DEFAULT false,
    signatory_name TEXT,
    signatory_title TEXT,
    theme TEXT NOT NULL DEFAULT 'cvwt-neon',
    likes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- User Streaks
  CREATE TABLE user_streaks (
    user_id TEXT PRIMARY KEY,
    current_streak INT NOT NULL DEFAULT 1,
    longest_streak INT NOT NULL DEFAULT 1,
    inspiration_score INT NOT NULL DEFAULT 0,
    last_visit_date DATE NOT NULL DEFAULT CURRENT_DATE
  );

  -- Storage bucket
  -- In Supabase dashboard → Storage → New Bucket → "cvwt-generated" (public)

  -- RLS Policies (achievements public read)
  ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read" ON achievements FOR SELECT USING (true);
  CREATE POLICY "Public insert" ON achievements FOR INSERT WITH CHECK (true);

  ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read" ON certificates FOR SELECT USING (true);
  CREATE POLICY "Public insert" ON certificates FOR INSERT WITH CHECK (true);

  ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read" ON quotes FOR SELECT USING (true);

  ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read" ON favorites FOR SELECT USING (true);
  CREATE POLICY "Public insert" ON favorites FOR INSERT WITH CHECK (true);
  CREATE POLICY "Public delete" ON favorites FOR DELETE USING (true);
*/
