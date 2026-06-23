import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Trash2 } from 'lucide-react'
import { CATEGORY_COLORS } from '@/lib/mockData'
import type { Quote } from '@/types'

interface FavoritesDrawerProps {
  open: boolean
  onClose: () => void
  favorites: Quote[]
  onRemove: (id: string) => void
  onSelect: (quote: Quote) => void
}

export function FavoritesDrawer({
  open,
  onClose,
  favorites,
  onRemove,
  onSelect,
}: FavoritesDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Saved quotes"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-cvwt-secondary fill-cvwt-secondary" aria-hidden="true" />
                <h2 className="font-display font-semibold text-white">Saved Quotes</h2>
                <span className="rounded-full bg-cvwt-primary/20 px-2 py-0.5 text-xs text-cvwt-primary font-bold">
                  {favorites.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-cvwt-muted hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close favorites"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-cvwt-secondary/10 flex items-center justify-center">
                    <Heart size={28} className="text-cvwt-secondary/50" />
                  </div>
                  <div>
                    <p className="font-medium text-white">No saved quotes yet</p>
                    <p className="text-sm text-cvwt-muted mt-1">
                      Tap the heart on any quote to save it here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {favorites.map((quote) => {
                    const catColor = CATEGORY_COLORS[quote.category] ?? '#8B5CF6'
                    return (
                      <motion.div
                        key={quote.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer hover:bg-white/[0.06] transition-colors"
                        onClick={() => { onSelect(quote); onClose() }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') { onSelect(quote); onClose() } }}
                      >
                        <div
                          className="h-0.5 w-8 rounded-full mb-3"
                          style={{ background: catColor }}
                          aria-hidden="true"
                        />
                        <p className="text-sm text-white leading-relaxed line-clamp-3 pr-8">
                          "{quote.text}"
                        </p>
                        <p className="mt-2 text-xs text-cvwt-muted">— {quote.author}</p>
                        <span
                          className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ background: catColor + '20', color: catColor }}
                        >
                          {quote.category}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemove(quote.id)
                          }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-cvwt-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                          aria-label={`Remove "${quote.text.slice(0, 30)}..." from favorites`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
