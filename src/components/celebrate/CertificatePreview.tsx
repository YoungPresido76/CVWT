import { forwardRef } from 'react'
import { formatDate } from '@/lib/utils'
import type { CertificateFormData } from '@/types'

const AWARD_DESCRIPTIONS: Record<string, string> = {
  'Member Appreciation': 'for outstanding dedication and commitment to the CVWT community',
  'Top Contributor': 'for exceptional contributions that have made a meaningful difference',
  'Design Excellence': 'for delivering designs of extraordinary quality and creativity',
  'Innovation Award': 'for pioneering innovative ideas that push boundaries',
  'Community Impact': 'for creating lasting positive impact within the CVWT community',
}

interface CertificatePreviewProps {
  data: CertificateFormData
  exportMode?: boolean
}

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ data, exportMode = false }, ref) => {
    const description = AWARD_DESCRIPTIONS[data.award_type] ?? 'for outstanding contributions'
    const dateDisplay = data.date ? formatDate(data.date) : 'January 1, 2025'

    const W = exportMode ? 1400 : undefined
    const H = exportMode ? 990 : undefined

    return (
      <div
        ref={ref}
        style={{
          width: W,
          height: H,
          fontFamily: 'Georgia, "Times New Roman", serif',
          background: exportMode
            ? 'linear-gradient(135deg, #0a0118 0%, #0d0228 50%, #020110 100%)'
            : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: exportMode ? '0' : '20px',
        }}
        className={!exportMode ? 'w-full min-h-[320px] flex items-center justify-center' : ''}
      >
        {/* Dark base for preview */}
        {!exportMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0118] via-[#0d0228] to-[#020110] rounded-[20px]" aria-hidden="true" />
        )}

        {/* Background radial glows */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: exportMode ? '800px' : '400px',
            height: exportMode ? '400px' : '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Outer decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: exportMode ? '32px' : '12px',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: exportMode ? '16px' : '12px',
          }}
          aria-hidden="true"
        />
        {/* Inner decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: exportMode ? '44px' : '18px',
            border: '1px solid rgba(212,175,55,0.12)',
            borderRadius: exportMode ? '12px' : '8px',
          }}
          aria-hidden="true"
        />

        {/* Corner ornaments */}
        {[
          { top: exportMode ? '56px' : '22px', left: exportMode ? '56px' : '22px' },
          { top: exportMode ? '56px' : '22px', right: exportMode ? '56px' : '22px' },
          { bottom: exportMode ? '56px' : '22px', left: exportMode ? '56px' : '22px' },
          { bottom: exportMode ? '56px' : '22px', right: exportMode ? '56px' : '22px' },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              width: exportMode ? '32px' : '16px',
              height: exportMode ? '32px' : '16px',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.6), rgba(212,175,55,0.2))',
              clipPath: 'polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%)',
              transform: i === 1 ? 'scaleX(-1)' : i === 2 ? 'scaleY(-1)' : i === 3 ? 'scale(-1)' : 'none',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Certificate content */}
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            padding: exportMode ? '0 120px' : '0 28px',
            maxWidth: '100%',
          }}
        >
          {/* CVWT Seal */}
          <div
            style={{
              width: exportMode ? '80px' : '40px',
              height: exportMode ? '80px' : '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              border: `${exportMode ? 3 : 1.5}px solid rgba(212,175,55,0.5)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: exportMode ? '32px' : '14px',
              boxShadow: `0 0 ${exportMode ? 30 : 12}px rgba(139,92,246,0.4)`,
            }}
            aria-hidden="true"
          >
            <span
              style={{
                fontSize: exportMode ? '32px' : '14px',
                fontWeight: 900,
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              C
            </span>
          </div>

          {/* Pre-heading */}
          <div
            style={{
              fontSize: exportMode ? '18px' : '9px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              color: 'rgba(212,175,55,0.7)',
              marginBottom: exportMode ? '20px' : '8px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
            }}
          >
            CVWT Design Fest Presents
          </div>

          {/* Certificate title */}
          <div
            style={{
              fontSize: exportMode ? '56px' : '22px',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: exportMode ? '32px' : '12px',
              lineHeight: 1.15,
              fontFamily: 'Georgia, serif',
            }}
          >
            Certificate of
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F9E88A 50%, #B8860B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {data.award_type || 'Appreciation'}
            </span>
          </div>

          {/* Awarded to */}
          <div
            style={{
              fontSize: exportMode ? '20px' : '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: '#9CA3AF',
              marginBottom: exportMode ? '16px' : '6px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            This certificate is proudly awarded to
          </div>

          {/* Recipient name */}
          <div
            style={{
              fontSize: exportMode ? '72px' : '28px',
              fontStyle: 'italic',
              color: '#FFFFFF',
              marginBottom: exportMode ? '16px' : '6px',
              fontFamily: 'Georgia, serif',
              lineHeight: 1.1,
            }}
          >
            {data.recipient_name || 'Recipient Name'}
          </div>

          {/* Divider line */}
          <div
            style={{
              width: exportMode ? '200px' : '80px',
              height: exportMode ? '2px' : '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
              margin: `${exportMode ? '24px' : '10px'} auto`,
            }}
            aria-hidden="true"
          />

          {/* Description */}
          <div
            style={{
              fontSize: exportMode ? '24px' : '10px',
              color: '#9CA3AF',
              maxWidth: exportMode ? '700px' : '280px',
              lineHeight: 1.7,
              margin: '0 auto',
              marginBottom: exportMode ? '48px' : '18px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {description}
          </div>

          {/* Date & Signature row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: exportMode ? '0' : '8px',
              gap: exportMode ? '80px' : '20px',
            }}
          >
            {/* Date */}
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  width: exportMode ? '160px' : '70px',
                  height: '1px',
                  background: 'rgba(212,175,55,0.4)',
                  marginBottom: exportMode ? '8px' : '4px',
                }}
                aria-hidden="true"
              />
              <div
                style={{
                  fontSize: exportMode ? '20px' : '9px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.05em',
                }}
              >
                {dateDisplay}
              </div>
              <div
                style={{
                  fontSize: exportMode ? '16px' : '8px',
                  color: '#4B5563',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  marginTop: '4px',
                }}
              >
                Date
              </div>
            </div>

            {/* Signature */}
            {data.has_signature && (
              <div style={{ textAlign: 'right' }}>
                {/* Signature script */}
                <div
                  style={{
                    fontSize: exportMode ? '36px' : '15px',
                    fontStyle: 'italic',
                    color: 'rgba(212,175,55,0.8)',
                    fontFamily: 'Georgia, serif',
                    marginBottom: exportMode ? '4px' : '2px',
                    lineHeight: 1,
                  }}
                >
                  {data.signatory_name || 'Signatory'}
                </div>
                <div
                  style={{
                    width: exportMode ? '160px' : '70px',
                    height: '1px',
                    background: 'rgba(212,175,55,0.4)',
                    marginBottom: exportMode ? '8px' : '4px',
                    marginLeft: 'auto',
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    fontSize: exportMode ? '16px' : '8px',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {data.signatory_title || 'Community Lead'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
CertificatePreview.displayName = 'CertificatePreview'
