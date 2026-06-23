import { forwardRef } from 'react'
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '@/lib/mockData'
import type { AchievementFormData } from '@/types'

interface AchievementPreviewProps {
  data: AchievementFormData
  exportMode?: boolean
}

export const AchievementPreview = forwardRef<HTMLDivElement, AchievementPreviewProps>(
  ({ data, exportMode = false }, ref) => {
    const catColor = CATEGORY_COLORS[data.category] ?? '#8B5CF6'
    const catEmoji = CATEGORY_EMOJIS[data.category] ?? '⚡'

    const isSquare = data.card_dimension === 'instagram'
    const isWide = data.card_dimension === 'linkedin' || data.card_dimension === 'twitter'

    const exportDimensions = {
      instagram: { width: 1080, height: 1080 },
      linkedin: { width: 1200, height: 628 },
      twitter: { width: 1200, height: 675 },
    }

    const exportStyle = exportMode
      ? {
          width: exportDimensions[data.card_dimension].width,
          height: exportDimensions[data.card_dimension].height,
          flexShrink: 0,
        }
      : {}

    return (
      <div
        ref={ref}
        style={{
          ...exportStyle,
          background: `radial-gradient(ellipse at 20% 20%, ${catColor}40 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, #EC489940 0%, transparent 55%), ${exportMode ? '#030712' : 'transparent'}`,
          fontFamily: 'Inter, sans-serif',
          borderRadius: exportMode ? '0px' : '20px',
          overflow: 'hidden',
          position: 'relative',
        }}
        className={!exportMode ? 'w-full h-full min-h-[340px] flex flex-col' : 'flex flex-col'}
      >
        {/* Dark base layer for preview only */}
        {!exportMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0116] via-[#0a0028] to-[#000511] rounded-[20px]" aria-hidden="true" />
        )}

        {/* Decorative grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: exportMode ? '80px 80px' : '40px 40px',
          }}
          aria-hidden="true"
        />

        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: exportMode ? '6px' : '3px',
            background: `linear-gradient(90deg, ${catColor}, #EC4899, #3B82F6)`,
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div
          className="relative flex-1 flex flex-col"
          style={{
            padding: exportMode
              ? isSquare ? '80px' : '60px 100px'
              : '28px',
            justifyContent: isWide && exportMode ? 'center' : 'space-between',
            flexDirection: isWide && exportMode ? 'row' : 'column',
            alignItems: isWide && exportMode ? 'center' : 'stretch',
            gap: isWide && exportMode ? '80px' : undefined,
          }}
        >
          {/* Left / Top section */}
          <div style={{ flex: isWide && exportMode ? '0 0 auto' : undefined }}>
            {/* Category badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: exportMode ? '12px' : '8px',
                padding: exportMode ? '10px 20px' : '5px 12px',
                borderRadius: '9999px',
                border: `1px solid ${catColor}55`,
                background: `${catColor}15`,
                color: catColor,
                fontSize: exportMode ? '22px' : '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                marginBottom: exportMode ? '48px' : '16px',
              }}
            >
              <span style={{ fontSize: exportMode ? '24px' : '13px' }} aria-hidden="true">{catEmoji}</span>
              {data.category}
            </div>

            {/* Avatar */}
            <div
              style={{
                width: exportMode ? '160px' : '72px',
                height: exportMode ? '160px' : '72px',
                borderRadius: '50%',
                background: data.profile_image_url
                  ? 'transparent'
                  : `linear-gradient(135deg, ${catColor}, #EC4899)`,
                border: `${exportMode ? 4 : 2}px solid ${catColor}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: `0 0 ${exportMode ? 40 : 16}px ${catColor}40`,
                marginBottom: exportMode ? '40px' : '14px',
                flexShrink: 0,
              }}
            >
              {data.profile_image_url ? (
                <img
                  src={data.profile_image_url}
                  alt={data.member_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span
                  style={{
                    fontSize: exportMode ? '56px' : '24px',
                    fontWeight: 800,
                    color: '#fff',
                    fontFamily: '"Space Grotesk", Inter, sans-serif',
                  }}
                >
                  {data.member_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name */}
            <div
              style={{
                fontSize: exportMode ? '52px' : '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"Space Grotesk", Inter, sans-serif',
                lineHeight: 1.1,
                marginBottom: exportMode ? '16px' : '4px',
              }}
            >
              {data.member_name || 'Member Name'}
            </div>

            {!isWide && (
              <div
                style={{
                  width: exportMode ? '60px' : '28px',
                  height: exportMode ? '4px' : '2px',
                  borderRadius: '2px',
                  background: `linear-gradient(90deg, ${catColor}, #EC4899)`,
                  marginBottom: exportMode ? '40px' : '14px',
                }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Right / Bottom section */}
          <div style={{ flex: isWide && exportMode ? 1 : undefined }}>
            {/* Achievement title */}
            <div
              style={{
                fontSize: exportMode ? (isSquare ? '48px' : '42px') : '17px',
                fontWeight: 700,
                fontFamily: '"Space Grotesk", Inter, sans-serif',
                background: `linear-gradient(135deg, #FFFFFF 0%, ${catColor} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
                marginBottom: exportMode ? '24px' : '8px',
              }}
            >
              {data.achievement_title || 'Achievement Title'}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: exportMode ? '28px' : '12px',
                color: '#9CA3AF',
                lineHeight: 1.6,
                maxWidth: exportMode ? '520px' : undefined,
                marginBottom: exportMode ? '48px' : '16px',
              }}
            >
              {data.achievement_description || 'Achievement description goes here'}
            </div>

            {/* CVWT branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: exportMode ? '16px' : '8px',
              }}
            >
              <div
                style={{
                  width: exportMode ? '40px' : '20px',
                  height: exportMode ? '40px' : '20px',
                  borderRadius: exportMode ? '10px' : '5px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-hidden="true"
              >
                <span style={{ color: '#fff', fontWeight: 900, fontSize: exportMode ? '20px' : '10px' }}>C</span>
              </div>
              <span
                style={{
                  fontSize: exportMode ? '24px' : '11px',
                  color: '#6B7280',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                CVWT Design Fest
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
AchievementPreview.displayName = 'AchievementPreview'
