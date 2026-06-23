# CVWT Inspire & Celebrate

> **Inspire. Appreciate. Celebrate.**

A premium community platform for CVWT Design Fest members to discover daily inspiration, generate achievement cards, issue professional certificates, and browse a community gallery — all built with a futuristic, Linear-inspired UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌟 Daily Inspiration | Auto-rotating featured quotes with category filters |
| ⚡ Random Generator | Instant quote refresh with smooth animations |
| ❤️ Favorites | Save & manage favourite quotes per session/user |
| 🏆 Achievement Cards | Instagram, LinkedIn & Twitter-ready card export |
| 📜 Certificates | Gold-foil professional certificate generator |
| 🎨 Theme Engine | 5 premium themes (CVWT Neon, Purple Galaxy, Cyber Dark, Glassmorphism, Minimal White) |
| 🖼️ Wallpaper Generator | Mobile, Social & Desktop wallpapers from any quote |
| 🗂️ Community Gallery | Browse all generated cards with like & filter |
| 📥 PNG/JPG Export | High-res 2× pixel ratio export via html-to-image |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-org/cvwt-inspire-celebrate.git
cd cvwt-inspire-celebrate
npm install
```

### 2. Environment variables

Copy `.env.example` → `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note:** The app runs in full mock/offline mode if env vars are absent — all features work without a database.

### 3. Run locally

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## 🗄️ Database Schema (Supabase)

Run the following SQL in your Supabase SQL Editor:

```sql
-- Quotes
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
```

### RLS Policies

```sql
-- Achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public insert" ON achievements FOR INSERT WITH CHECK (true);

-- Certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public insert" ON certificates FOR INSERT WITH CHECK (true);

-- Quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON quotes FOR SELECT USING (true);

-- Favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON favorites FOR SELECT USING (true);
CREATE POLICY "Public insert" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete" ON favorites FOR DELETE USING (true);
```

### Storage Bucket

In Supabase Dashboard → Storage → New Bucket:
- Name: `cvwt-generated`
- Public: ✅

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — `vercel.json` handles SPA routing automatically

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/         # Navbar, ParticleField
│   ├── inspire/        # DailyQuote, QuoteCard, CategorySelector, FavoritesDrawer
│   ├── celebrate/      # AchievementGenerator, CertificateGenerator, previews
│   ├── gallery/        # GalleryShowcase
│   └── ui/             # GlowButton, GlassCard, ThemeSwitcher
├── hooks/              # useAuth, useQuotes, useGallery
├── lib/                # supabaseClient, mockData, utils
├── pages/              # HomePage, InspirePage, CelebratePage, GalleryPage
└── types/              # Shared TypeScript interfaces
```

---

## 🎨 Design System

- **Background:** `#030712`
- **Surface:** `#111827`
- **Primary:** `#8B5CF6` (purple)
- **Secondary:** `#EC4899` (pink)
- **Accent:** `#3B82F6` (blue)
- **Fonts:** Inter + Space Grotesk

---

## 📄 License

MIT — CVWT Design Fest 2025
