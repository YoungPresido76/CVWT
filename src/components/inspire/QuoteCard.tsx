import { forwardRef } from 'react'
import { CATEGORY_COLORS } from '@/lib/mockData'
import type { Quote } from '@/types'

interface QuoteCardProps {
  quote: Quote
  size?: 'mobile' | 'social' | 'desktop'
}

const SIZE_CONFIGS = {
  mobile: { width: 1080, height: 1920, label: 'Mobile Wallpaper', scale: 0.22 },
  social: { width: 1080, height: 1080, label: 'Social Card', scale: 0.28 },
  desktop: { width: 1920, height: 1080, label: 'Desktop Wallpaper', scale: 0.30 },
}

export const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(
  ({ quote, size = 'social' }, ref) => {
    const config = SIZE_CONFIGS[size]
    const catColor = CATEGORY_COLORS[quote.category] ?? '#8B5CF6'
    const isPortrait = config.height > config.width

    return (
      <div
        ref={ref}
        style={{
          width: config.width,
          height: config.height,
          transform: `scale(${config.scale})`,
          transformOrigin: 'top left',
          flexShrink: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${catColor}33 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, #EC489933 0%, transparent 60%), #030712`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isPortrait ? '120px 80px' : '80px 140px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${catColor}22 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #EC489922 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          aria-hidden="true"
        />

        {/* Border frame */}
        <div
          style={{
            position: 'absolute',
            inset: '40px',
            borderRadius: '32px',
            border: `1px solid ${catColor}33`,
          }}
          aria-hidden="true"
        />

        {/* Category badge */}
        <div
          style={{
            marginBottom: '48px',
            padding: '10px 24px',
            borderRadius: '9999px',
            border: `1px solid ${catColor}55`,
            background: `${catColor}15`,
            color: catColor,
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          {quote.category}
        </div>

        {/* Opening quote */}
        <div
          style={{
            fontSize: isPortrait ? '180px' : '120px',
            lineHeight: 1,
            color: catColor,
            opacity: 0.3,
            fontFamily: 'Georgia, serif',
            marginBottom: isPortrait ? '-80px' : '-50px',
            alignSelf: 'flex-start',
            marginLeft: isPortrait ? '60px' : '80px',
          }}
          aria-hidden="true"
        >
          "
        </div>

        {/* Quote text */}
        <p
          style={{
            fontSize: isPortrait ? '72px' : '64px',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1.35,
            textAlign: 'center',
            maxWidth: '100%',
            fontFamily: '"Space Grotesk", Inter, sans-serif',
            marginBottom: '64px',
            position: 'relative',
          }}
        >
          {quote.text}
        </p>

        {/* Author */}
        <div
          style={{
            fontSize: '36px',
            color: '#9CA3AF',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          — {quote.author}
        </div>

        {/* CVWT Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '24px',
              borderRadius: '2px',
              background: `linear-gradient(to bottom, ${catColor}, #EC4899)`,
            }}
            aria-hidden="true"
          />
          <span style={{ fontSize: '24px', color: '#6B7280', fontWeight: 600, letterSpacing: '0.1em' }}>
            CVWT INSPIRE
          </span>
        </div>
      </div>
    )
  }
)
QuoteCard.displayName = 'QuoteCard'
