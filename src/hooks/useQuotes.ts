import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { MOCK_QUOTES } from '@/lib/mockData'
import { pickRandom, getTodayISODate, isToday } from '@/lib/utils'
import type { Quote, QuoteCategory, Favorite } from '@/types'

export function useQuotes(userId: string | undefined) {
  const [allQuotes, setAllQuotes] = useState<Quote[]>(MOCK_QUOTES)
  const [featuredQuote, setFeaturedQuote] = useState<Quote>(MOCK_QUOTES[0])
  const [currentQuote, setCurrentQuote] = useState<Quote>(MOCK_QUOTES[0])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory | 'All'>('All')
  const [loading, setLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // ─── Load quotes ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const todayStr = getTodayISODate()
      const stored = localStorage.getItem('cvwt_daily_quote')
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as { date: string; quote: Quote }
          if (isToday(parsed.date)) {
            setFeaturedQuote(parsed.quote)
            setCurrentQuote(parsed.quote)
            return
          }
        } catch { /* ignore parse errors */ }
      }
      const daily = pickRandom(MOCK_QUOTES.filter((q) => q.is_featured)) ?? pickRandom(MOCK_QUOTES)
      setFeaturedQuote(daily)
      setCurrentQuote(daily)
      localStorage.setItem('cvwt_daily_quote', JSON.stringify({ date: todayStr, quote: daily }))
      return
    }

    setLoading(true)
    Promise.all([
      supabase.from('quotes').select('*').order('created_at', { ascending: false }),
      supabase.from('daily_featured').select('*, quote:quotes(*)').eq('date', getTodayISODate()).maybeSingle(),
    ]).then(([quotesRes, dailyRes]) => {
      if (quotesRes.data && quotesRes.data.length > 0) {
        setAllQuotes(quotesRes.data as Quote[])
      }
      if (dailyRes.data?.quote) {
        setFeaturedQuote(dailyRes.data.quote as Quote)
        setCurrentQuote(dailyRes.data.quote as Quote)
      } else if (quotesRes.data && quotesRes.data.length > 0) {
        const daily = pickRandom(quotesRes.data as Quote[])
        setFeaturedQuote(daily)
        setCurrentQuote(daily)
      }
      setLoading(false)
    })
  }, [])

  // ─── Load favorites ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!userId) return
    if (!isSupabaseConfigured || !supabase) {
      const stored = localStorage.getItem(`cvwt_favorites_${userId}`)
      if (stored) {
        try { setFavorites(new Set(JSON.parse(stored) as string[])) } catch { /* ignore */ }
      }
      return
    }
    supabase
      .from('favorites')
      .select('quote_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) setFavorites(new Set(data.map((f: Pick<Favorite, 'quote_id'>) => f.quote_id)))
      })
  }, [userId])

  // ─── Random inspiration ─────────────────────────────────────────────────────

  const generateRandom = useCallback(() => {
    setIsAnimating(true)
    const filtered = selectedCategory === 'All'
      ? allQuotes
      : allQuotes.filter((q) => q.category === selectedCategory)
    const pool = filtered.filter((q) => q.id !== currentQuote.id)
    const next = pool.length > 0 ? pickRandom(pool) : pickRandom(allQuotes)
    setTimeout(() => {
      setCurrentQuote(next)
      setIsAnimating(false)
    }, 300)
  }, [allQuotes, currentQuote.id, selectedCategory])

  // ─── Toggle favorite ────────────────────────────────────────────────────────

  const toggleFavorite = useCallback(async (quoteId: string) => {
    if (!userId) return
    const isFav = favorites.has(quoteId)
    const next = new Set(favorites)
    if (isFav) {
      next.delete(quoteId)
    } else {
      next.add(quoteId)
    }
    setFavorites(next)

    if (!isSupabaseConfigured || !supabase) {
      localStorage.setItem(`cvwt_favorites_${userId}`, JSON.stringify([...next]))
      return
    }

    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('quote_id', quoteId)
    } else {
      await supabase.from('favorites').insert({ user_id: userId, quote_id: quoteId })
    }
  }, [favorites, userId])

  const filteredQuotes = selectedCategory === 'All'
    ? allQuotes
    : allQuotes.filter((q) => q.category === selectedCategory)

  const favoriteQuotes = allQuotes.filter((q) => favorites.has(q.id))

  return {
    allQuotes,
    filteredQuotes,
    featuredQuote,
    currentQuote,
    favorites,
    favoriteQuotes,
    selectedCategory,
    setSelectedCategory,
    loading,
    isAnimating,
    generateRandom,
    toggleFavorite,
  }
}
