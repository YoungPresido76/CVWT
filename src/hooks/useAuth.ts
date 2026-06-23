import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { getOrCreateGuestId } from '@/lib/utils'
import type { AppUser } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Guest mode fallback
      const guestId = getOrCreateGuestId()
      setUser({ id: guestId, is_guest: true })
      setLoading(false)
      return
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? undefined,
          name: session.user.user_metadata?.full_name as string | undefined,
          avatar_url: session.user.user_metadata?.avatar_url as string | undefined,
          is_guest: false,
        })
      } else {
        const guestId = getOrCreateGuestId()
        setUser({ id: guestId, is_guest: true })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? undefined,
          name: session.user.user_metadata?.full_name as string | undefined,
          avatar_url: session.user.user_metadata?.avatar_url as string | undefined,
          is_guest: false,
        })
      } else {
        const guestId = getOrCreateGuestId()
        setUser({ id: guestId, is_guest: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    const guestId = getOrCreateGuestId()
    setUser({ id: guestId, is_guest: true })
  }

  return { user, loading, signInWithGoogle, signOut }
}
