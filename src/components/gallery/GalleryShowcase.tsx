import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Clock, Trophy, Award, LayoutGrid, Flame, Timer } from 'lucide-react'
import { CATEGORY_COLORS, MOCK_ACHIEVEMENTS, MOCK_CERTIFICATES } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import type { Achievement, Certificate, GalleryFilter } from '@/types'

interface GalleryShowcaseProps {
  achievements: Achievement[]
  certificates: Certificate[]
  filter: GalleryFilter
  onFilterChange: (f: GalleryFilter) => void
  loading: boolean
  error: string | null
}

const FILTER_TABS: { value: GalleryFilter; label: string; icon: React.ElementType }[] = [
  { value: 'recent', label: 'Recent', icon: Timer },
  { value: 'popular', label: 'Popular', icon: Flame },
  { value: 'achievements', label: 'Achievements', icon: Trophy },
  { value: 'certificates', label: 'Certificates', icon: Award },
]

// ── Achievement mini-card ──────────────────────────────────────────────────────
function AchievementCard({ item }: { item: Achievement }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(item.likes)
  const catColor = CATEGORY_COLORS[item.category] ?? '#8B5CF6'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-all duration-300"
      style={{ boxShadow: `0 0 0 0 ${catColor}00` }}
      whileHover={{ y: -2 }}
    >
      {/* Card visual */}
      <div
        className="aspect-square relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${catColor}30 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, #EC489930 0%, transparent 60%), #030712`,
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        {/* Top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${catColor}, #EC4899)` }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
          {/* Avatar */}
          <div
            className="mb-3 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-black text-white"
            style={{
              background: item.profile_image_url ? 'transparent' : `linear-gradient(135deg, ${catColor}, #EC4899)`,
              border: `2px solid ${catColor}60`,
              boxShadow: `0 0 16px ${catColor}40`,
              overflow: 'hidden',
            }}
          >
            {item.profile_image_url ? (
              <img src={item.profile_image_url} alt={item.member_name} className="h-full w-full object-cover" />
            ) : (
              item.member_name.charAt(0).toUpperCase()
            )}
          </div>

          <p
            className="text-sm font-bold text-white mb-1 leading-tight"
            style={{ fontFamily: '"Space Grotesk", Inter, sans-serif' }}
          >
            {item.member_name}
          </p>
          <p
            className="text-xs font-semibold leading-snug mb-2"
            style={{ color: catColor }}
          >
            {item.achievement_title}
          </p>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}40` }}
          >
            {item.category}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-cvwt-muted">
          <Clock size={11} aria-hidden="true" />
          <time dateTime={item.created_at}>
            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </time>
        </div>
        <button
          onClick={() => {
            if (!liked) { setLikeCount((n) => n + 1); setLiked(true) }
            else { setLikeCount((n) => n - 1); setLiked(false) }
          }}
          className="flex items-center gap-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cvwt-primary rounded"
          aria-label={liked ? 'Unlike' : 'Like this achievement'}
          aria-pressed={liked}
        >
          <Heart
            size={13}
            className={`transition-all ${liked ? 'fill-cvwt-secondary text-cvwt-secondary' : 'text-cvwt-muted group-hover:text-white'}`}
          />
          <span className={liked ? 'text-cvwt-secondary' : 'text-cvwt-muted'}>{likeCount}</span>
        </button>
      </div>
    </motion.article>
  )
}

// ── Certificate mini-card ─────────────────────────────────────────────────────
function CertificateCard({ item }: { item: Certificate }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(item.likes)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      {/* Certificate visual */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '4/3',
          background: 'linear-gradient(135deg, #0a0118 0%, #0d0228 100%)',
        }}
      >
        {/* Outer border */}
        <div className="absolute inset-2 border border-yellow-500/20 rounded-lg" aria-hidden="true" />
        <div className="absolute inset-3 border border-yellow-500/10 rounded-md" aria-hidden="true" />

        {/* Corner ornaments */}
        {[
          { top: '10px', left: '10px' },
          { top: '10px', right: '10px', transform: 'scaleX(-1)' },
          { bottom: '10px', left: '10px', transform: 'scaleY(-1)' },
          { bottom: '10px', right: '10px', transform: 'scale(-1)' },
        ].map((style, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...style,
              width: '12px',
              height: '12px',
              background: 'rgba(212,175,55,0.5)',
              clipPath: 'polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%)',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cvwt-primary to-cvwt-secondary flex items-center justify-center mb-2 text-xs font-black text-white">
            C
          </div>
          <p className="text-[9px] uppercase tracking-widest text-yellow-500/60 mb-1">Certificate of</p>
          <p
            className="text-sm font-bold leading-snug mb-1"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #F9E88A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {item.award_type}
          </p>
          <div className="w-10 h-px bg-yellow-500/30 my-1.5" aria-hidden="true" />
          <p className="text-xs font-medium text-white/80 italic">{item.recipient_name}</p>
          <p className="text-[9px] text-white/30 mt-1">{formatDate(item.date)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-cvwt-muted">
          <Award size={11} aria-hidden="true" />
          <span className="truncate max-w-[100px]">{item.award_type}</span>
        </div>
        <button
          onClick={() => {
            if (!liked) { setLikeCount((n) => n + 1); setLiked(true) }
            else { setLikeCount((n) => n - 1); setLiked(false) }
          }}
          className="flex items-center gap-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cvwt-primary rounded"
          aria-label={liked ? 'Unlike' : 'Like'}
          aria-pressed={liked}
        >
          <Heart
            size={13}
            className={`transition-all ${liked ? 'fill-cvwt-secondary text-cvwt-secondary' : 'text-cvwt-muted group-hover:text-white'}`}
          />
          <span className={liked ? 'text-cvwt-secondary' : 'text-cvwt-muted'}>{likeCount}</span>
        </button>
      </div>
    </motion.article>
  )
}

// ── Main Gallery ──────────────────────────────────────────────────────────────
export function GalleryShowcase({
  achievements,
  certificates,
  filter,
  onFilterChange,
  loading,
  error,
}: GalleryShowcaseProps) {
  const showAchievements = filter === 'recent' || filter === 'popular' || filter === 'achievements'
  const showCertificates = filter === 'recent' || filter === 'popular' || filter === 'certificates'

  const displayedAchievements = showAchievements ? achievements : []
  const displayedCertificates = showCertificates ? certificates : []
  const totalItems = displayedAchievements.length + displayedCertificates.length

  return (
    <section aria-label="Community gallery">
      {/* Filter tabs */}
      <div
        className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 mb-8 w-fit"
        role="tablist"
        aria-label="Gallery filter"
      >
        {FILTER_TABS.map(({ value, label, icon: Icon }) => {
          const active = filter === value
          return (
            <button
              key={value}
              role="tab"
              aria-selected={active}
              onClick={() => onFilterChange(value)}
              className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cvwt-primary ${
                active ? 'text-white' : 'text-cvwt-muted hover:text-white'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="gallery-tab"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon size={14} aria-hidden="true" />
              <span className="relative">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 mb-6 text-sm text-red-400">
          Failed to load gallery: {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && totalItems === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-cvwt-primary/10 flex items-center justify-center">
            <LayoutGrid size={32} className="text-cvwt-primary/50" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display font-semibold text-white text-lg">Nothing here yet</p>
            <p className="text-sm text-cvwt-muted mt-1">
              Generate your first achievement or certificate to see it appear here.
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && totalItems > 0 && (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {displayedAchievements.map((item) => (
              <AchievementCard key={`ach-${item.id}`} item={item} />
            ))}
            {displayedCertificates.map((item) => (
              <CertificateCard key={`cert-${item.id}`} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
