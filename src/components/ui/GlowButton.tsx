import { motion } from 'framer-motion'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: GlowButtonProps) {
  const base = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cvwt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-cvwt-bg disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary: 'bg-gradient-to-r from-cvwt-primary to-cvwt-secondary text-white hover:shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'border border-cvwt-primary/40 bg-cvwt-primary/10 text-cvwt-primary hover:bg-cvwt-primary/20 hover:border-cvwt-primary/60',
    ghost: 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
    danger: 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30',
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      type={props.type ?? 'button'}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      aria-label={props['aria-label']}
      aria-pressed={props['aria-pressed']}
      id={props.id}
      tabIndex={props.tabIndex}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span aria-hidden="true">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}
