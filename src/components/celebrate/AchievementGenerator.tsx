import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, X, Download, Share2, Save, ChevronDown, User
} from 'lucide-react'
import { AchievementPreview } from './AchievementPreview'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { GlowButton } from '@/components/ui/GlowButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { downloadAsPng, downloadAsJpg, copyToClipboard } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/lib/mockData'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import type { AchievementFormData, AchievementCategory, CardDimension, AppTheme, Achievement } from '@/types'

const CATEGORIES: AchievementCategory[] = [
  'Developer', 'Designer', 'Community Builder', 'Contributor', 'Innovator',
]
const DIMENSIONS: { value: CardDimension; label: string }[] = [
  { value: 'instagram', label: 'Instagram (1:1)' },
  { value: 'linkedin', label: 'LinkedIn Post' },
  { value: 'twitter', label: 'Twitter / X Post' },
]

interface AchievementGeneratorProps {
  onSaved?: (achievement: Achievement) => void
}

const INITIAL_FORM: AchievementFormData = {
  member_name: '',
  achievement_title: '',
  achievement_description: '',
  category: 'Developer',
  card_dimension: 'instagram',
}

export function AchievementGenerator({ onSaved }: AchievementGeneratorProps) {
  const [form, setForm] = useState<AchievementFormData>(INITIAL_FORM)
  const [theme, setTheme] = useState<AppTheme>('cvwt-neon')
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const exportRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Toast helper ─────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

  // ── Image upload ─────────────────────────────────────────────────────────────
  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { showToast('Please upload an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5 MB.'); return }
    const url = URL.createObjectURL(file)
    setForm((f) => ({ ...f, profile_image: file, profile_image_url: url }))
  }, [showToast])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }, [handleImageFile])

  // ── Download ──────────────────────────────────────────────────────────────────
  const handleDownloadPng = useCallback(async () => {
    if (!exportRef.current) return
    setDownloading(true)
    try {
      await downloadAsPng(exportRef.current, `cvwt-achievement-${form.member_name || 'card'}`)
      showToast('PNG downloaded!')
    } catch { showToast('Download failed. Please try again.') }
    finally { setDownloading(false) }
  }, [form.member_name, showToast])

  const handleDownloadJpg = useCallback(async () => {
    if (!exportRef.current) return
    setDownloading(true)
    try {
      await downloadAsJpg(exportRef.current, `cvwt-achievement-${form.member_name || 'card'}`)
      showToast('JPG downloaded!')
    } catch { showToast('Download failed. Please try again.') }
    finally { setDownloading(false) }
  }, [form.member_name, showToast])

  // ── Share ─────────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const text = `🏆 ${form.member_name} was recognized for "${form.achievement_title}" at CVWT Design Fest! #CVWTCelebrate`
    const ok = await copyToClipboard(text)
    if (ok) { setCopied(true); showToast('Share text copied!'); setTimeout(() => setCopied(false), 2000) }
  }, [form.member_name, form.achievement_title, showToast])

  // ── Save to gallery ───────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!form.member_name || !form.achievement_title) {
      showToast('Please fill in Name and Achievement Title.')
      return
    }
    setSaving(true)
    const newItem: Achievement = {
      id: crypto.randomUUID(),
      ...form,
      theme,
      likes: 0,
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('achievements').insert({
        member_name: form.member_name,
        achievement_title: form.achievement_title,
        achievement_description: form.achievement_description,
        category: form.category,
        profile_image_url: form.profile_image_url ?? null,
        card_dimension: form.card_dimension,
        theme,
        likes: 0,
      })
      if (error) { showToast('Save failed: ' + error.message); setSaving(false); return }
    }

    onSaved?.(newItem)
    showToast('🎉 Saved to gallery!')
    setSaving(false)
  }, [form, theme, onSaved, showToast])

  const catColor = CATEGORY_COLORS[form.category] ?? '#8B5CF6'
  const isFormValid = form.member_name.trim() && form.achievement_title.trim()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

      {/* ── LEFT: Form ─────────────────────────────────────────────────────────── */}
      <GlassCard padding="lg" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Achievement Details</h2>
          <ThemeSwitcher value={theme} onChange={setTheme} />
        </div>

        {/* Member name */}
        <div>
          <label htmlFor="ach-name" className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Member Name *
          </label>
          <input
            id="ach-name"
            type="text"
            value={form.member_name}
            onChange={(e) => setForm((f) => ({ ...f, member_name: e.target.value }))}
            placeholder="e.g. Alex Rivera"
            maxLength={60}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors"
            aria-required="true"
          />
        </div>

        {/* Achievement title */}
        <div>
          <label htmlFor="ach-title" className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Achievement Title *
          </label>
          <input
            id="ach-title"
            type="text"
            value={form.achievement_title}
            onChange={(e) => setForm((f) => ({ ...f, achievement_title: e.target.value }))}
            placeholder="e.g. Top Community Builder"
            maxLength={80}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors"
            aria-required="true"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="ach-desc" className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            id="ach-desc"
            value={form.achievement_description}
            onChange={(e) => setForm((f) => ({ ...f, achievement_description: e.target.value }))}
            placeholder="Describe the achievement in one sentence…"
            maxLength={160}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors resize-none"
          />
          <p className="text-right text-xs text-white/25 mt-1">{form.achievement_description.length}/160</p>
        </div>

        {/* Category */}
        <div>
          <p className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Category
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Achievement category">
            {CATEGORIES.map((cat) => {
              const active = form.category === cat
              const cc = CATEGORY_COLORS[cat] ?? '#8B5CF6'
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cvwt-primary"
                  style={{
                    border: `1px solid ${active ? cc + 'aa' : 'rgba(255,255,255,0.1)'}`,
                    background: active ? cc + '22' : 'rgba(255,255,255,0.03)',
                    color: active ? cc : '#9CA3AF',
                  }}
                  aria-pressed={active}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Card dimension */}
        <div>
          <label htmlFor="ach-dim" className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Card Size
          </label>
          <div className="relative">
            <select
              id="ach-dim"
              value={form.card_dimension}
              onChange={(e) => setForm((f) => ({ ...f, card_dimension: e.target.value as CardDimension }))}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors"
            >
              {DIMENSIONS.map((d) => (
                <option key={d.value} value={d.value} className="bg-cvwt-surface">
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cvwt-muted" aria-hidden="true" />
          </div>
        </div>

        {/* Profile image upload */}
        <div>
          <p className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Profile Photo (optional)
          </p>
          {form.profile_image_url ? (
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <img
                src={form.profile_image_url}
                alt="Profile preview"
                className="h-14 w-14 rounded-full object-cover"
                style={{ outline: `2px solid ${catColor}` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {form.profile_image?.name ?? 'Uploaded image'}
                </p>
                <p className="text-xs text-cvwt-muted">Click × to remove</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, profile_image: undefined, profile_image_url: undefined }))}
                className="rounded-lg p-1.5 text-cvwt-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                aria-label="Remove profile photo"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-cvwt-primary/60 bg-cvwt-primary/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click() }}
              aria-label="Upload profile photo"
            >
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                <User size={18} className="text-cvwt-muted" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-sm text-white font-medium">Drop image here</p>
                <p className="text-xs text-cvwt-muted mt-0.5">or click to browse · PNG, JPG up to 5 MB</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cvwt-primary">
                <Upload size={12} aria-hidden="true" />
                Choose file
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload profile image"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageFile(file)
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <GlowButton
            variant="primary"
            className="flex-1"
            onClick={handleSave}
            loading={saving}
            disabled={!isFormValid || saving}
            icon={<Save size={14} />}
          >
            Save to Gallery
          </GlowButton>
          <GlowButton
            variant="ghost"
            onClick={handleShare}
            icon={copied ? undefined : <Share2 size={14} />}
            aria-label="Copy share text"
          >
            {copied ? '✓ Copied' : 'Share'}
          </GlowButton>
        </div>
      </GlassCard>

      {/* ── RIGHT: Preview ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-cvwt-muted uppercase tracking-wider">
            Live Preview
          </h3>
          <div className="flex gap-2">
            <GlowButton
              variant="secondary"
              size="sm"
              onClick={handleDownloadPng}
              loading={downloading}
              disabled={downloading}
              icon={<Download size={13} />}
            >
              PNG
            </GlowButton>
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={handleDownloadJpg}
              loading={downloading}
              disabled={downloading}
              icon={<Download size={13} />}
            >
              JPG
            </GlowButton>
          </div>
        </div>

        {/* Preview card wrapper */}
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10"
          style={{ aspectRatio: form.card_dimension === 'instagram' ? '1/1' : '1200/628' }}
        >
          <AchievementPreview data={form} exportMode={false} />
        </div>

        {/* Export-size hidden div for html-to-image */}
        <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none" aria-hidden="true">
          <AchievementPreview ref={exportRef} data={form} exportMode={true} />
        </div>

        {/* Dimension labels */}
        <div className="flex items-center justify-center gap-4">
          {DIMENSIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => setForm((f) => ({ ...f, card_dimension: d.value }))}
              className={`text-xs font-medium transition-colors ${
                form.card_dimension === d.value ? 'text-cvwt-primary' : 'text-cvwt-muted hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-white/10 bg-cvwt-surface/95 px-5 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-xl"
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
