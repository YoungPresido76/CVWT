import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, FileText } from 'lucide-react'
import { AchievementGenerator } from '@/components/celebrate/AchievementGenerator'
import { CertificateGenerator } from '@/components/celebrate/CertificateGenerator'
import type { Achievement, Certificate } from '@/types'

type Tab = 'achievement' | 'certificate'

interface CelebratePageProps {
  onAchievementSaved?: (a: Achievement) => void
  onCertificateSaved?: (c: Certificate) => void
}

export function CelebratePage({ onAchievementSaved, onCertificateSaved }: CelebratePageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('achievement')

  return (
    <main className="relative min-h-screen pt-28 px-4 pb-20 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-extrabold text-white mb-2"
        >
          Celebrate
        </motion.h1>
        <p className="text-cvwt-muted text-sm max-w-xl">
          Generate premium achievement cards and professional certificates to recognize outstanding CVWT community members.
        </p>
      </div>

      {/* ── Tab switcher ────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 mb-10 w-fit"
        role="tablist"
        aria-label="Generator type"
      >
        {([
          { value: 'achievement' as Tab, label: 'Achievement Card', icon: Trophy },
          { value: 'certificate' as Tab, label: 'Certificate', icon: FileText },
        ] as const).map(({ value, label, icon: Icon }) => {
          const active = activeTab === value
          return (
            <button
              key={value}
              role="tab"
              id={`tab-${value}`}
              aria-selected={active}
              aria-controls={`panel-${value}`}
              onClick={() => setActiveTab(value)}
              className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cvwt-primary ${
                active ? 'text-white' : 'text-cvwt-muted hover:text-white'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="celebrate-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cvwt-primary/20 to-cvwt-secondary/20 border border-cvwt-primary/30"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon size={15} aria-hidden="true" />
              <span className="relative">{label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Panels ──────────────────────────────────────────────────────────────── */}
      <div
        role="tabpanel"
        id="panel-achievement"
        aria-labelledby="tab-achievement"
        hidden={activeTab !== 'achievement'}
      >
        {activeTab === 'achievement' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <AchievementGenerator onSaved={onAchievementSaved} />
          </motion.div>
        )}
      </div>

      <div
        role="tabpanel"
        id="panel-certificate"
        aria-labelledby="tab-certificate"
        hidden={activeTab !== 'certificate'}
      >
        {activeTab === 'certificate' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <CertificateGenerator onSaved={onCertificateSaved} />
          </motion.div>
        )}
      </div>
    </main>
  )
}
