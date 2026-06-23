import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: 'purple' | 'pink' | 'blue' | 'none'
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export function GlassCard({
  children,
  glow = 'none',
  padding = 'md',
  className,
  ...props
}: GlassCardProps) {
  const glowMap = {
    purple: 'hover:shadow-glow-purple',
    pink: 'hover:shadow-glow-pink',
    blue: 'hover:shadow-glow-blue',
    none: '',
  }

  const padMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300',
        glowMap[glow],
        padMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
