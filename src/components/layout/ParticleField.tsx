import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#A78BFA', '#F472B6']

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: Math.random() * 300 + 150,
    })

    // Seed initial particles
    for (let i = 0; i < 60; i++) {
      const p = spawnParticle()
      p.life = Math.random() * p.maxLife
      particlesRef.current.push(p)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      while (particlesRef.current.length < 60) {
        particlesRef.current.push(spawnParticle())
      }

      particlesRef.current.forEach((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height

        const fadeIn = Math.min(p.life / 40, 1)
        const fadeOut = Math.max(1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3), 0)
        const alpha = p.opacity * fadeIn * fadeOut

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Subtle glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        grd.addColorStop(0, p.color + Math.round(alpha * 0.2 * 255).toString(16).padStart(2, '0'))
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.fill()
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
