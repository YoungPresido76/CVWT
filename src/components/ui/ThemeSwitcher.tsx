import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { THEMES } from '@/lib/mockData'
import type { AppTheme } from '@/types'

interface ThemeSwitcherProps {
  value: AppTheme
  onChange: (theme: AppTheme) => void
}

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false)
  const current = THEMES.find((t) => t.id === value) ?? THEMES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition-all"
        aria-label="Switch card theme"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{ background: current.gradient }}
          aria-hidden="true"
        />
        <Palette size={13} aria-hidden="true" />
        <span>{current.name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/10 bg-cvwt-surface/95 backdrop-blur-xl p-2"
              role="listbox"
              aria-label="Select theme"
            >
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => { onChange(theme.id); setOpen(false) }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs hover:bg-white/5 transition-colors"
                  role="option"
                  aria-selected={value === theme.id}
                >
                  <div
                    className="h-6 w-6 rounded-lg flex-shrink-0"
                    style={{ background: theme.gradient }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white">{theme.name}</div>
                    <div className="text-cvwt-muted truncate">{theme.description}</div>
                  </div>
                  {value === theme.id && (
                    <Check size={13} className="text-cvwt-primary flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
