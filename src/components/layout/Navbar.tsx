import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, Image, Menu, X, LogIn, LogOut, User } from 'lucide-react'
import type { AppUser } from '@/types'

interface NavbarProps {
  user: AppUser | null
  onSignIn: () => void
  onSignOut: () => void
}

const NAV_LINKS = [
  { to: '/inspire', label: 'Inspire', icon: Sparkles },
  { to: '/celebrate', label: 'Celebrate', icon: Trophy },
  { to: '/gallery', label: 'Gallery', icon: Image },
]

export function Navbar({ user, onSignIn, onSignOut }: NavbarProps) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-xl"
          style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="CVWT Inspire & Celebrate — home"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cvwt-primary to-cvwt-secondary">
              <span className="text-sm font-black text-white leading-none">C</span>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cvwt-primary to-cvwt-secondary blur-md" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-sm font-bold text-white">CVWT</span>
              <span className="ml-1 font-display text-sm font-bold bg-gradient-to-r from-cvwt-primary to-cvwt-secondary bg-clip-text text-transparent">
                Inspire & Celebrate
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white'
                      : 'text-cvwt-muted hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-white/10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon size={15} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user && !user.is_guest ? (
              <div className="flex items-center gap-2">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name ?? 'User'} className="h-7 w-7 rounded-full ring-2 ring-cvwt-primary/40" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-cvwt-primary/20 flex items-center justify-center">
                    <User size={14} className="text-cvwt-primary" />
                  </div>
                )}
                <span className="text-xs text-cvwt-muted font-medium">{user.name ?? user.email?.split('@')[0]}</span>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-cvwt-muted hover:text-white transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/10 transition-all duration-200"
              >
                <LogIn size={13} aria-hidden="true" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-lg p-2 text-cvwt-muted hover:text-white transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-4 mt-2 rounded-2xl border border-white/10 bg-cvwt-surface/95 backdrop-blur-xl p-4"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? 'bg-cvwt-primary/20 text-cvwt-primary'
                      : 'text-cvwt-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 pt-3 border-t border-white/10">
              {user && !user.is_guest ? (
                <button
                  onClick={() => { onSignOut(); setMobileOpen(false) }}
                  className="flex items-center gap-2 w-full rounded-xl px-4 py-3 text-sm text-cvwt-muted hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { onSignIn(); setMobileOpen(false) }}
                  className="flex items-center gap-2 w-full rounded-xl px-4 py-3 text-sm text-white bg-cvwt-primary/20 hover:bg-cvwt-primary/30 transition-colors"
                >
                  <LogIn size={16} />
                  Sign In with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
