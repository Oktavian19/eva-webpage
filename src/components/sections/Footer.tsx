import { ArrowUpRight, GraduationCap, Heart, PhoneCall, Stethoscope } from 'lucide-react'
import { Button, Container, Logo } from '@/components/ui'
import { crisisHotline, navLinks, partnerCtas } from '@/content/landing'

const partnerIcons = [GraduationCap, Stethoscope]

export function Footer() {
  const year = new Date().getFullYear()

  const handlePartnerClick = (label: string) => {
    window.dispatchEvent(
      new CustomEvent('eva:partner-inquiry', {
        detail: { topic: label },
      }),
    )
  }

  return (
    <footer className="relative border-t border-divider bg-white/60 pt-16 pb-10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1.3fr] lg:gap-16">
          <div className="max-w-md">
            <a href="#top" data-cursor="BERANDA" aria-label="EVA — kembali ke atas" className="inline-block">
              <Logo />
            </a>
            <p className="mt-4 text-body-md text-ink-soft leading-relaxed">
              Empathetic Vitality Assistant — sahabat pendamping kesehatan mental berbasis AI untuk generasi muda
              Indonesia. Digital first-aid, non-diagnostik, dan privat sepenuhnya.
            </p>
            <a
              href="tel:119"
              data-cursor="DARURAT"
              className="mt-6 inline-flex items-center gap-2.5 rounded-[16px] border border-crisis-border bg-crisis-bg px-4 py-3 text-body-md font-semibold text-crisis-text transition-colors hover:bg-[#FEE2E2]"
            >
              <PhoneCall className="size-4" />
              {crisisHotline}
            </a>
          </div>

          <nav aria-label="Navigasi footer">
            <p className="text-overline text-ink-muted uppercase">Jelajahi</p>
            <ul className="mt-4 space-y-3">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    data-cursor="LIHAT"
                    className="text-body-md text-ink-soft transition-colors duration-[250ms] hover:text-primary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-overline text-ink-muted uppercase">Untuk Profesional &amp; Mitra Kampus</p>
            <div className="mt-4 flex flex-col items-start gap-3">
              {partnerCtas.map((label, i) => {
                const Icon = partnerIcons[i]
                return (
                  <Button
                    key={label}
                    id={`footer-partner-${i}`}
                    href="#early-access"
                    data-cursor="MITRA"
                    onClick={() => handlePartnerClick(label)}
                    variant="social"
                    size="md"
                    leftIcon={<Icon />}
                    rightIcon={<ArrowUpRight />}
                  >
                    {label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-divider pt-8 text-caption !font-medium text-ink-muted sm:flex-row">
          <p>© {year} EVA — Empathetic Vitality Assistant. Bukan pengganti layanan medis profesional.</p>
          <p className="inline-flex items-center gap-1.5">
            Dibuat dengan <Heart className="size-3.5 fill-blush text-blush" /> untuk Gen Z Indonesia
          </p>
        </div>
      </Container>
    </footer>
  )
}
