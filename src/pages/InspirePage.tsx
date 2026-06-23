import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Heart, Image as ImageIcon, Download, Copy, Check,
  Smartphone, Monitor, Share2
} from 'lucide-react'
import { DailyQuote } from '@/components/inspire/DailyQuote'
import { CategorySelector } from '@/components/inspire/CategorySelector'
import { FavoritesDrawer } from '@/components/inspire/FavoritesDrawer'
import { QuoteCard } from '@/components/inspire/QuoteCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { downloadAsPng, copyToClipboard } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/lib/mockData'
import type { Quote, QuoteCategory } from '@/types'

interface InspirePageProps {
  featuredQuote: Quote
  currentQuote: Quote
  favoriteQuotes: Quote[]
  favorites: Set<string>
  selectedCategory: QuoteCategory | 'All'
  onCategoryChange: (cat: QuoteCategory | 'All') => void
  onGenerateRandom: () => void
  onToggleFavorite: (id: string) => void
  isAnimating: boolean
  loading: boolean
}

type WallpaperSize = 'mobile' | 'social' | 'desktop'

const WALLPAPER_OPTS: { value: WallpaperSize; label: string; icon: React.ElementType; dims: string }[] = [
  { value: 'mobile', label: 'Mobile', icon: Smartphone, dims: '1080×1920' },
  { value: 'social', label: 'Social', icon: Share2, dims: '1080×1080' },
  { value: 'desktop', label: 'Desktop', icon: Monitor, dims: '1920×1080' },
]

export function InspirePage({
  featuredQuote,
  currentQuote,
  favoriteQuotes,
  favorites,
  selectedCategory,
  onCategoryChange,
  onGenerateRandom,
  onToggleFavorite,
  isAnimating,
  loading,
}: InspirePageProps) {
  const [favOpen, setFavOpen] = useState(false)
  const [wallpaperSize, setWallpaperSize] = useState<WallpaperSize>('social')
  const [downloading, setDownloading] = useState(false)
  const [copiedQuote, setCopiedQuote] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const exportRef = useRef<HTMLDivElement>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleDownloadWallpaper = async () => {
    if (!exportRef.current) return
    setDownloading(true)
    try {
      await downloadAsPng(exportRef.current, `cvwt-quote-${wallpaperSize}`)
      showToast('Wallpaper downloaded!')
    } catch { showToast('Download failed.') }
    finally { setDownloading(false) }
  }

  const handleCopyQuote = async () => {
    const ok = await copyToClipboard(`"${currentQuote.text}" — ${currentQuote.author}`)
    if (ok) { setCopiedQuote(true); showToast('Quote copied!'); setTimeout(() => setCopiedQuote(false), 2000) }
  }

  const catColor = CATEGORY_COLORS[currentQuote.category] ?? '#8B5CF6'

  return (
    <main className="relative min-h-screen pt-28 px-4 pb-20 max-w-6xl mx-auto">

      {/* ── Page header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-extrabold text-white"
          >
            Daily Inspiration
          </motion.h1>
          <p className="text-cvwt-muted mt-1 text-sm">
            Curated wisdom for developers, designers, and builders.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setFavOpen(true)}
            className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            aria-label={`Open favorites, ${favoriteQuotes.length} saved`}
          >
            <Heart size={15} className="text-cvwt-secondary" aria-hidden="true" />
            Saved
            {favoriteQuotes.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cvwt-secondary px-1 text-[10px] font-bold text-white">
                {favoriteQuotes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Featured daily quote ────────────────────────────────────────────────── */}
      <section className="mb-16" aria-label="Today's featured quote">
        <DailyQuote
          quote={featuredQuote}
          isFavorited={favorites.has(featuredQuote.id)}
          onToggleFavorite={() => onToggleFavorite(featuredQuote.id)}
        />
      </section>

      {/* ── Category filter ─────────────────────────────────────────────────────── */}
      <section className="mb-10" aria-label="Filter by category">
        <CategorySelector value={selectedCategory} onChange={onCategoryChange} />
      </section>

      {/* ── Random inspiration generator ────────────────────────────────────────── */}
      <section aria-label="Quote generator" className="mb-16">
        <GlassCard padding="none" className="overflow-hidden">
          {/* Random quote display */}
          <div className="relative p-8 md:p-12">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${catColor}60, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            <div className="relative flex flex-col md:flex-row md:items-start gap-6">
              {/* Quote content */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuote.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -5 : 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block"
                      style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}40` }}
                    >
                      {currentQuote.category}
                    </span>
                    <blockquote className="font-display text-2xl md:text-3xl font-semibold text-white leading-snug mb-4">
                      "{currentQuote.text}"
                    </blockquote>
                    <p className="text-cvwt-muted">— {currentQuote.author}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quick actions */}
              <div className="flex md:flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => onToggleFavorite(currentQuote.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium transition-all hover:bg-white/10"
                  style={{ color: favorites.has(currentQuote.id) ? '#EC4899' : '#9CA3AF' }}
                  aria-label={favorites.has(currentQuote.id) ? 'Remove from favorites' : 'Save to favorites'}
                  aria-pressed={favorites.has(currentQuote.id)}
                >
                  <Heart
                    size={13}
                    className={favorites.has(currentQuote.id) ? 'fill-cvwt-secondary' : ''}
                    aria-hidden="true"
                  />
                  {favorites.has(currentQuote.id) ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleCopyQuote}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-cvwt-muted hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Copy quote to clipboard"
                >
                  {copiedQuote ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  {copiedQuote ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Generate button */}
          <div className="border-t border-white/10 bg-white/[0.02] px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-cvwt-muted">
              {selectedCategory === 'All' ? 'Showing all categories' : `Filtered: ${selectedCategory}`}
            </p>
            <GlowButton
              variant="primary"
              size="lg"
              onClick={onGenerateRandom}
              loading={loading}
              icon={<Zap size={15} />}
            >
              Give Me Inspiration
            </GlowButton>
          </div>
        </GlassCard>
      </section>

      {/* ── Wallpaper generator ──────────────────────────────────────────────────── */}
      <section aria-label="Wallpaper generator" className="mb-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-white mb-1">Quote Wallpaper</h2>
          <p className="text-sm text-cvwt-muted">Turn any quote into a shareable wallpaper or card.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Controls */}
          <GlassCard padding="lg">
            <p className="text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-4">
              Format
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {WALLPAPER_OPTS.map(({ value, label, icon: Icon, dims }) => {
                const active = wallpaperSize === value
                return (
                  <button
                    key={value}
                    onClick={() => setWallpaperSize(value)}
                    className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all"
                    style={{
                      border: `1px solid ${active ? '#8B5CF680' : 'rgba(255,255,255,0.1)'}`,
                      background: active ? '#8B5CF620' : 'rgba(255,255,255,0.03)',
                      color: active ? '#8B5CF6' : '#9CA3AF',
                    }}
                    aria-pressed={active}
                    aria-label={`${label} wallpaper — ${dims}`}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span className="text-xs font-semibold">{label}</span>
                    <span className="text-[10px] opacity-60">{dims}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <GlowButton
                variant="primary"
                className="flex-1"
                onClick={handleDownloadWallpaper}
                loading={downloading}
                icon={<Download size={14} />}
              >
                Download Wallpaper
              </GlowButton>
              <GlowButton
                variant="ghost"
                onClick={handleCopyQuote}
                icon={copiedQuote ? <Check size={14} /> : <Copy size={14} />}
                aria-label="Copy quote text"
              >
                Copy Text
              </GlowButton>
            </div>
          </GlassCard>

          {/* Preview */}
          <div className="flex flex-col gap-3">
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#030712]"
              style={{
                aspectRatio: wallpaperSize === 'mobile'
                  ? '9/16'
                  : wallpaperSize === 'desktop' ? '16/9' : '1/1',
              }}
            >
              {/* Scaled preview */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div
                  style={{
                    transform: `scale(${
                      wallpaperSize === 'mobile' ? 0.25
                      : wallpaperSize === 'desktop' ? 0.2 : 0.22
                    })`,
                    transformOrigin: 'center center',
                    pointerEvents: 'none',
                  }}
                >
                  <QuoteCard quote={currentQuote} size={wallpaperSize} />
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl" aria-hidden="true" />
            </div>
            <p className="text-xs text-center text-cvwt-muted">
              Preview — actual export is full resolution
            </p>
          </div>
        </div>

        {/* Hidden export node */}
        <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none" aria-hidden="true">
          <QuoteCard ref={exportRef} quote={currentQuote} size={wallpaperSize} />
        </div>
      </section>

      {/* Favorites drawer */}
      <FavoritesDrawer
        open={favOpen}
        onClose={() => setFavOpen(false)}
        favorites={favoriteQuotes}
        onRemove={onToggleFavorite}
        onSelect={() => { /* quote selection handled by parent */ }}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-white/10 bg-cvwt-surface/95 px-5 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-xl"
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
