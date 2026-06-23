import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Share2, Save, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react'
import { CertificatePreview } from './CertificatePreview'
import { GlowButton } from '@/components/ui/GlowButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { downloadAsPng, downloadAsJpg, copyToClipboard, getTodayISODate } from '@/lib/utils'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import type { CertificateFormData, CertificateType, Certificate } from '@/types'

const CERTIFICATE_TYPES: CertificateType[] = [
  'Member Appreciation',
  'Top Contributor',
  'Design Excellence',
  'Innovation Award',
  'Community Impact',
]

interface CertificateGeneratorProps {
  onSaved?: (cert: Certificate) => void
}

const INITIAL_FORM: CertificateFormData = {
  recipient_name: '',
  award_type: 'Member Appreciation',
  date: getTodayISODate(),
  has_signature: true,
  signatory_name: '',
  signatory_title: 'CVWT Community Lead',
}

export function CertificateGenerator({ onSaved }: CertificateGeneratorProps) {
  const [form, setForm] = useState<CertificateFormData>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const exportRef = useRef<HTMLDivElement>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

  // ── Download ──────────────────────────────────────────────────────────────────
  const handleDownloadPng = useCallback(async () => {
    if (!exportRef.current) return
    setDownloading(true)
    try {
      await downloadAsPng(exportRef.current, `cvwt-certificate-${form.recipient_name || 'cert'}`)
      showToast('Certificate PNG downloaded!')
    } catch { showToast('Download failed. Please try again.') }
    finally { setDownloading(false) }
  }, [form.recipient_name, showToast])

  const handleDownloadJpg = useCallback(async () => {
    if (!exportRef.current) return
    setDownloading(true)
    try {
      await downloadAsJpg(exportRef.current, `cvwt-certificate-${form.recipient_name || 'cert'}`)
      showToast('Certificate JPG downloaded!')
    } catch { showToast('Download failed. Please try again.') }
    finally { setDownloading(false) }
  }, [form.recipient_name, showToast])

  // ── Share ─────────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const text = `🏅 ${form.recipient_name} received a "${form.award_type}" certificate at CVWT Design Fest! #CVWTCelebrate`
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      showToast('Share text copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }, [form, showToast])

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!form.recipient_name.trim()) { showToast('Please enter a recipient name.'); return }
    setSaving(true)

    const newItem: Certificate = {
      id: crypto.randomUUID(),
      ...form,
      theme: 'cvwt-neon',
      likes: 0,
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('certificates').insert({
        recipient_name: form.recipient_name,
        award_type: form.award_type,
        date: form.date,
        has_signature: form.has_signature,
        signatory_name: form.signatory_name || null,
        signatory_title: form.signatory_title || null,
        theme: 'cvwt-neon',
        likes: 0,
      })
      if (error) { showToast('Save failed: ' + error.message); setSaving(false); return }
    }

    onSaved?.(newItem)
    showToast('🎉 Certificate saved to gallery!')
    setSaving(false)
  }, [form, onSaved, showToast])

  const isFormValid = form.recipient_name.trim()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

      {/* ── LEFT: Form ─────────────────────────────────────────────────────────── */}
      <GlassCard padding="lg" className="flex flex-col gap-6">
        <h2 className="font-display text-lg font-bold text-white">Certificate Details</h2>

        {/* Recipient */}
        <div>
          <label htmlFor="cert-name" className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Recipient Name *
          </label>
          <input
            id="cert-name"
            type="text"
            value={form.recipient_name}
            onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))}
            placeholder="e.g. Jordan Smith"
            maxLength={80}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors"
            aria-required="true"
          />
        </div>

        {/* Award type */}
        <div>
          <label htmlFor="cert-type" className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Award Type
          </label>
          <div className="relative">
            <select
              id="cert-type"
              value={form.award_type}
              onChange={(e) => setForm((f) => ({ ...f, award_type: e.target.value as CertificateType }))}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors"
            >
              {CERTIFICATE_TYPES.map((t) => (
                <option key={t} value={t} className="bg-cvwt-surface">{t}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cvwt-muted" aria-hidden="true" />
          </div>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="cert-date" className="block text-xs font-semibold text-cvwt-muted uppercase tracking-widest mb-2">
            Date
          </label>
          <input
            id="cert-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors [color-scheme:dark]"
          />
        </div>

        {/* Signature toggle */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-cvwt-muted uppercase tracking-widest">
              Include Signature
            </span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, has_signature: !f.has_signature }))}
              className="text-cvwt-primary hover:text-cvwt-primary/80 transition-colors"
              aria-label={form.has_signature ? 'Disable signature' : 'Enable signature'}
              aria-pressed={form.has_signature}
            >
              {form.has_signature
                ? <ToggleRight size={28} />
                : <ToggleLeft size={28} className="text-cvwt-muted" />
              }
            </button>
          </div>

          <AnimatePresence>
            {form.has_signature && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-3"
              >
                <div>
                  <label htmlFor="sig-name" className="block text-xs text-cvwt-muted mb-1.5">
                    Signatory Name
                  </label>
                  <input
                    id="sig-name"
                    type="text"
                    value={form.signatory_name ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, signatory_name: e.target.value }))}
                    placeholder="e.g. Dr. Sarah Kim"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="sig-title" className="block text-xs text-cvwt-muted mb-1.5">
                    Signatory Title
                  </label>
                  <input
                    id="sig-title"
                    type="text"
                    value={form.signatory_title ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, signatory_title: e.target.value }))}
                    placeholder="e.g. CVWT Community Lead"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cvwt-primary/60 focus:outline-none focus:ring-1 focus:ring-cvwt-primary/40 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
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
            icon={<Share2 size={14} />}
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
            Certificate Preview
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

        {/* Live preview — aspect ratio 1400×990 ≈ 1.414:1 */}
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10"
          style={{ aspectRatio: '1400/990' }}
        >
          <CertificatePreview data={form} exportMode={false} />
        </div>

        {/* Hidden export-size node */}
        <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none" aria-hidden="true">
          <CertificatePreview ref={exportRef} data={form} exportMode={true} />
        </div>

        <p className="text-xs text-center text-cvwt-muted">
          Gold-foil certificate · 1400 × 990 px export
        </p>
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
