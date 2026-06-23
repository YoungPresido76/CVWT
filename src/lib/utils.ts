import { toPng, toJpeg } from 'html-to-image'
import type { AppTheme, CardDimension } from '@/types'
import { THEMES } from './mockData'

// ─── Theme Utils ──────────────────────────────────────────────────────────────

export function getThemeConfig(themeId: AppTheme) {
  return THEMES.find((t) => t.id === themeId) ?? THEMES[0]
}

// ─── Card Dimensions ──────────────────────────────────────────────────────────

export const CARD_DIMENSIONS: Record<CardDimension, { width: number; height: number; label: string }> = {
  instagram: { width: 1080, height: 1080, label: 'Instagram (1:1)' },
  linkedin: { width: 1200, height: 628, label: 'LinkedIn Post' },
  twitter: { width: 1200, height: 675, label: 'Twitter / X Post' },
}

// ─── Download Helpers ─────────────────────────────────────────────────────────

export async function downloadAsPng(elementRef: HTMLElement, filename: string): Promise<void> {
  try {
    const dataUrl = await toPng(elementRef, {
      quality: 1,
      pixelRatio: 2,
      cacheBust: true,
    })
    triggerDownload(dataUrl, `${filename}.png`)
  } catch (err) {
    console.error('PNG export failed:', err)
    throw new Error('Failed to export PNG. Please try again.')
  }
}

export async function downloadAsJpg(elementRef: HTMLElement, filename: string): Promise<void> {
  try {
    const dataUrl = await toJpeg(elementRef, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
    })
    triggerDownload(dataUrl, `${filename}.jpg`)
  } catch (err) {
    console.error('JPG export failed:', err)
    throw new Error('Failed to export JPG. Please try again.')
  }
}

function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

// ─── Share Helpers ────────────────────────────────────────────────────────────

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ─── Date Utils ───────────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function getTodayISODate(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Reading Time ─────────────────────────────────────────────────────────────

export function formatReadingTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s read`
  const minutes = Math.ceil(seconds / 60)
  return `${minutes} min read`
}

// ─── Random Helpers ───────────────────────────────────────────────────────────

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Guest ID ─────────────────────────────────────────────────────────────────

export function getOrCreateGuestId(): string {
  const existing = localStorage.getItem('cvwt_guest_id')
  if (existing) return existing
  const id = `guest_${crypto.randomUUID()}`
  localStorage.setItem('cvwt_guest_id', id)
  return id
}

// ─── Streak Utils ─────────────────────────────────────────────────────────────

export function isConsecutiveDay(lastDateStr: string): boolean {
  const last = new Date(lastDateStr)
  const today = new Date()
  const diffMs = today.getTime() - last.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayISODate()
}

// ─── Class Name Helper ────────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
