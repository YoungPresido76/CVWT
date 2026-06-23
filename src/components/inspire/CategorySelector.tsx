import { motion } from 'framer-motion'
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '@/lib/mockData'
import type { QuoteCategory } from '@/types'

const CATEGORIES: (QuoteCategory | 'All')[] = [
  'All',
  'Coding',
  'Design',
  'Innovation',
  'Leadership',
  'Productivity',
  'Community',
]

interface CategorySelectorProps {
  value: QuoteCategory | 'All'
  onChange: (cat: QuoteCategory | 'All') => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div
      className="flex flex-wrap gap-2 justify-center"
      role="group"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((cat) => {
        const active = value === cat
        const color = cat === 'All' ? '#8B5CF6' : (CATEGORY_COLORS[cat] ?? '#8B5CF6')
        const emoji = cat === 'All' ? '✦' : (CATEGORY_EMOJIS[cat] ?? '')

        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cvwt-primary"
            style={{
              border: `1px solid ${active ? color + '80' : 'rgba(255,255,255,0.1)'}`,
              background: active ? color + '20' : 'rgba(255,255,255,0.03)',
              color: active ? color : '#9CA3AF',
            }}
            aria-pressed={active}
          >
            <span aria-hidden="true">{emoji}</span>
            {cat}
          </motion.button>
        )
      })}
    </div>
  )
}
