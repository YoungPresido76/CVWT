import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { ParticleField } from '@/components/layout/ParticleField'
import { HomePage } from '@/pages/HomePage'
import { InspirePage } from '@/pages/InspirePage'
import { CelebratePage } from '@/pages/CelebratePage'
import { GalleryPage } from '@/pages/GalleryPage'
import { useAuth } from '@/hooks/useAuth'
import { useQuotes } from '@/hooks/useQuotes'
import { useGallery } from '@/hooks/useGallery'

export default function App() {
  const location = useLocation()
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth()
  const {
    featuredQuote,
    currentQuote,
    favoriteQuotes,
    favorites,
    selectedCategory,
    setSelectedCategory,
    loading: quotesLoading,
    isAnimating,
    generateRandom,
    toggleFavorite,
  } = useQuotes(user?.id)
  const {
    achievements,
    certificates,
    filter,
    setFilter,
    loading: galleryLoading,
    error: galleryError,
    addAchievement,
    addCertificate,
  } = useGallery()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cvwt-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cvwt-primary to-cvwt-secondary flex items-center justify-center animate-pulse">
            <span className="text-lg font-black text-white">C</span>
          </div>
          <div className="text-sm text-cvwt-muted">Loading…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cvwt-bg text-white font-sans">
      <ParticleField />

      <Navbar
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOut}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <HomePage
                featuredQuote={featuredQuote}
                isFavorited={favorites.has(featuredQuote.id)}
                onToggleFavorite={() => toggleFavorite(featuredQuote.id)}
              />
            }
          />
          <Route
            path="/inspire"
            element={
              <InspirePage
                featuredQuote={featuredQuote}
                currentQuote={currentQuote}
                favoriteQuotes={favoriteQuotes}
                favorites={favorites}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onGenerateRandom={generateRandom}
                onToggleFavorite={toggleFavorite}
                isAnimating={isAnimating}
                loading={quotesLoading}
              />
            }
          />
          <Route
            path="/celebrate"
            element={
              <CelebratePage
                onAchievementSaved={addAchievement}
                onCertificateSaved={addCertificate}
              />
            }
          />
          <Route
            path="/gallery"
            element={
              <GalleryPage
                achievements={achievements}
                certificates={certificates}
                filter={filter}
                onFilterChange={setFilter}
                loading={galleryLoading}
                error={galleryError}
              />
            }
          />
          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center text-center px-4 pt-20">
                <div>
                  <div className="font-display text-8xl font-black text-white/10 mb-4">404</div>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">Page not found</h2>
                  <p className="text-cvwt-muted mb-6">This page doesn't exist or was moved.</p>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-cvwt-primary/20 border border-cvwt-primary/40 px-5 py-2.5 text-sm font-semibold text-cvwt-primary hover:bg-cvwt-primary/30 transition-colors"
                  >
                    Go home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
