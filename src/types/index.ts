// ─── Quote Types ─────────────────────────────────────────────────────────────

export type QuoteCategory =
  | 'Coding'
  | 'Design'
  | 'Innovation'
  | 'Leadership'
  | 'Productivity'
  | 'Community'

export interface Quote {
  id: string
  text: string
  author: string
  category: QuoteCategory
  reading_time_seconds: number
  is_featured: boolean
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  quote_id: string
  created_at: string
  quote?: Quote
}

export interface DailyFeatured {
  id: string
  quote_id: string
  date: string
  quote?: Quote
}

// ─── Achievement Types ────────────────────────────────────────────────────────

export type AchievementCategory =
  | 'Developer'
  | 'Designer'
  | 'Community Builder'
  | 'Contributor'
  | 'Innovator'

export type CardDimension = 'instagram' | 'linkedin' | 'twitter'

export interface Achievement {
  id: string
  member_name: string
  achievement_title: string
  achievement_description: string
  category: AchievementCategory
  profile_image_url?: string
  card_dimension: CardDimension
  theme: AppTheme
  created_at: string
  likes: number
}

export interface AchievementFormData {
  member_name: string
  achievement_title: string
  achievement_description: string
  category: AchievementCategory
  profile_image?: File
  profile_image_url?: string
  card_dimension: CardDimension
}

// ─── Certificate Types ────────────────────────────────────────────────────────

export type CertificateType =
  | 'Member Appreciation'
  | 'Top Contributor'
  | 'Design Excellence'
  | 'Innovation Award'
  | 'Community Impact'

export interface Certificate {
  id: string
  recipient_name: string
  award_type: CertificateType
  date: string
  has_signature: boolean
  signatory_name?: string
  signatory_title?: string
  theme: AppTheme
  created_at: string
  likes: number
}

export interface CertificateFormData {
  recipient_name: string
  award_type: CertificateType
  date: string
  has_signature: boolean
  signatory_name?: string
  signatory_title?: string
}

// ─── Theme Types ──────────────────────────────────────────────────────────────

export type AppTheme =
  | 'cvwt-neon'
  | 'purple-galaxy'
  | 'cyber-dark'
  | 'glassmorphism'
  | 'minimal-white'

export interface ThemeConfig {
  id: AppTheme
  name: string
  description: string
  gradient: string
  cardGradient: string
  textColor: string
  accentColor: string
  borderColor: string
}

// ─── Gallery Types ────────────────────────────────────────────────────────────

export type GalleryFilter = 'recent' | 'popular' | 'achievements' | 'certificates' | 'quotes'

export type GalleryItem =
  | { type: 'achievement'; data: Achievement }
  | { type: 'certificate'; data: Certificate }

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AppUser {
  id: string
  email?: string
  name?: string
  avatar_url?: string
  is_guest: boolean
}

// ─── Streak Types ─────────────────────────────────────────────────────────────

export interface UserStreak {
  user_id: string
  current_streak: number
  longest_streak: number
  inspiration_score: number
  last_visit_date: string
}
