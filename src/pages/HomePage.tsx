import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Trophy, FileText, ArrowRight, Zap } from 'lucide-react'
import { DailyQuote } from '@/components/inspire/DailyQuote'
import { GlowButton } from '@/components/ui/GlowButton'
import type { Quote } from '@/types'

interface HomePageProps {
  featuredQuote: Quote
  isFavorited: boolean
  onToggleFavorite: () => void
}

const FEATURE_CARDS = [
  {
    to: '/inspire',
    icon: Sparkles,
    color: '#8B5CF6',
    title: 'Daily Inspiration',
    desc: 'Discover curated quotes for developers, designers, and builders. Generate shareable wallpapers.',
    label: 'Get Inspired',
  },
  {
    to: '/celebrate',
    icon: Trophy,
    color: '#EC4899',
    title: 'Achievement Cards',
    desc: 'Generate premium social-media-ready cards celebrating community members.',
    label: 'Create Card',
  },
  {
    to: '/celebrate',
    icon: FileText,
    color: '#3B82F6',
    title: 'Certificates',
    desc: 'Issue professional gold-foil certificates for outstanding contributors.',
    label: 'Issue Certificate',
  },
]

const STAT_ITEMS = [
  { value: '500+', label: 'Cards Generated' },
  { value: '12', label: 'Award Categories' },
  { value: '5', label: 'Premium Themes' },
  { value: '3', label: 'Export Formats' },
]

export function HomePage({ featuredQuote, isFavorited, onToggleFavorite }: HomePageProps) {
  const featRef = useRef<HTMLElement>(null)

  return (
    <main className="relative min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 pt-36 pb-20"
        aria-label="Hero"
      >
        {/* Ambient orbs */}
        <div className="absolute top-24 left-1/4 h-96 w-96 rounded-full bg-cvwt-primary/15 blur-[120px] pointer-events-none animate-float" aria-hidden="true" />
        <div className="absolute top-32 right-1/4 h-80 w-80 rounded-full bg-cvwt-secondary/10 blur-[100px] pointer-events-none animate-float-delayed" aria-hidden="true" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cvwt-primary/30 bg-cvwt-primary/10 px-4 py-1.5 text-xs font-semibold text-cvwt-primary"
        >
          <Zap size={12} aria-hidden="true" />
          CVWT Design Fest 2025
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-4xl"
        >
          <span className="text-white">Inspire.</span>{' '}
          <span
            className="bg-gradient-to-r from-cvwt-primary via-cvwt-secondary to-cvwt-accent bg-clip-text text-transparent"
            style={{ backgroundSize: '200%', animation: 'gradient-shift 6s ease infinite' }}
          >
            Appreciate.
          </span>
          <br />
          <span className="text-white">Celebrate.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-cvwt-muted leading-relaxed"
        >
          The community platform for CVWT members. Generate premium achievement cards,
          issue certificates, and discover daily inspiration.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <GlowButton
            variant="primary"
            size="lg"
            onClick={() => featRef.current?.scrollIntoView({ behavior: 'smooth' })}
            icon={<Sparkles size={16} />}
          >
            Explore Inspiration
          </GlowButton>
          <Link to="/celebrate">
            <GlowButton variant="ghost" size="lg" icon={<Trophy size={16} />}>
              Generate Achievement
            </GlowButton>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-14 flex flex-wrap justify-center gap-8"
        >
          {STAT_ITEMS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-cvwt-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Daily Featured Quote ────────────────────────────────────────────────── */}
      <section
        ref={featRef}
        className="px-4 pb-20 max-w-5xl mx-auto"
        aria-label="Today's featured quote"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cvwt-muted mb-3">
            <Sparkles size={12} aria-hidden="true" />
            Today's Spark
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Daily Inspiration</h2>
        </motion.div>

        <DailyQuote
          quote={featuredQuote}
          isFavorited={isFavorited}
          onToggleFavorite={onToggleFavorite}
        />

        <div className="mt-6 text-center">
          <Link to="/inspire">
            <GlowButton variant="secondary" size="md" icon={<ArrowRight size={14} />}>
              Explore All Quotes
            </GlowButton>
          </Link>
        </div>
      </section>

      {/* ── Feature cards ───────────────────────────────────────────────────────── */}
      <section className="px-4 pb-24 max-w-6xl mx-auto" aria-label="Platform features">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Everything you need to
            <span className="bg-gradient-to-r from-cvwt-primary to-cvwt-secondary bg-clip-text text-transparent"> celebrate</span>
          </h2>
          <p className="text-cvwt-muted max-w-xl mx-auto">
            A complete platform for community recognition, inspiration, and celebration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURE_CARDS.map(({ to, icon: Icon, color, title, desc, label }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                to={to}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                style={{ boxShadow: `0 0 0 0 ${color}00` }}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: color + '20', border: `1px solid ${color}30` }}
                >
                  <Icon size={22} style={{ color }} aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-cvwt-muted leading-relaxed flex-1">{desc}</p>
                <div
                  className="mt-5 flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                  style={{ color }}
                >
                  {label}
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
