import { motion } from 'framer-motion'
import { Star, Clock, Heart } from 'lucide-react'
import { formatReadingTime } from '@/lib/utils'
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '@/lib/mockData'
import type { Quote } from '@/types'

interface DailyQuoteProps {
  quote: Quote
  isFavorited: boolean
  onToggleFavorite: () => void
}

export function DailyQuote({ quote, isFavorited, onToggleFavorite }: DailyQuoteProps) {
  const catColor = CATEGORY_COLORS[quote.category] ?? '#8B5CF6'
  const catEmoji = CATEGORY_EMOJIS[quote.category] ?? '✦'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-3xl mx-auto"
    >
      {/* Ambient glow behind card */}
      <div
        className="absolute -inset-px rounded-3xl opacity-30 blur-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${catColor}55, transparent)` }}
        aria-hidden="true"
      />

      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-yellow-400" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
              Daily Inspiration
            </span>
          </div>
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ${
                isFavorited ? 'fill-cvwt-secondary text-cvwt-secondary scale-110' : 'text-cvwt-muted hover:text-white'
              }`}
            />
          </button>
        </div>

        {/* Quote text */}
        <blockquote className="mb-8">
          {/* Decorative opening quote mark */}
          <div
            className="font-display text-7xl md:text-8xl leading-none mb-4 select-none"
            style={{ color: catColor, opacity: 0.4 }}
            aria-hidden="true"
          >
            "
          </div>
          <p className="font-display text-2xl md:text-4xl font-medium text-white leading-snug -mt-8 md:-mt-10">
            {quote.text}
          </p>
        </blockquote>

        {/* Author & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">— {quote.author}</div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                borderColor: catColor + '55',
                backgroundColor: catColor + '15',
                color: catColor,
              }}
            >
              <span aria-hidden="true">{catEmoji}</span>
              {quote.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-cvwt-muted">
              <Clock size={11} aria-hidden="true" />
              {formatReadingTime(quote.reading_time_seconds)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
