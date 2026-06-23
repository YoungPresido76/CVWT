import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { MOCK_ACHIEVEMENTS, MOCK_CERTIFICATES } from '@/lib/mockData'
import type { Achievement, Certificate, GalleryFilter } from '@/types'

export function useGallery() {
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS)
  const [certificates, setCertificates] = useState<Certificate[]>(MOCK_CERTIFICATES)
  const [filter, setFilter] = useState<GalleryFilter>('recent')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAchievements(MOCK_ACHIEVEMENTS)
      setCertificates(MOCK_CERTIFICATES)
      return
    }

    setLoading(true)
    setError(null)

    Promise.all([
      supabase.from('achievements').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('certificates').select('*').order('created_at', { ascending: false }).limit(20),
    ]).then(([achRes, certRes]) => {
      if (achRes.error) setError(achRes.error.message)
      else setAchievements((achRes.data as Achievement[]).length > 0 ? achRes.data as Achievement[] : MOCK_ACHIEVEMENTS)

      if (certRes.error) setError(certRes.error.message)
      else setCertificates((certRes.data as Certificate[]).length > 0 ? certRes.data as Certificate[] : MOCK_CERTIFICATES)

      setLoading(false)
    })
  }, [])

  const addAchievement = (achievement: Achievement) => {
    setAchievements((prev) => [achievement, ...prev])
  }

  const addCertificate = (certificate: Certificate) => {
    setCertificates((prev) => [certificate, ...prev])
  }

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (filter === 'popular') return b.likes - a.likes
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const sortedCertificates = [...certificates].sort((a, b) => {
    if (filter === 'popular') return b.likes - a.likes
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return {
    achievements: sortedAchievements,
    certificates: sortedCertificates,
    filter,
    setFilter,
    loading,
    error,
    addAchievement,
    addCertificate,
  }
}
