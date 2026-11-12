import { cn } from '@/lib/utils'

/** Isotipo REDPAS: red de nodos (productores) conectados, redibujado en vector. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('h-9 w-9', className)} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="url(#redpas-g)" />
      <g stroke="white" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 13 L20 21 L29 12 M20 21 L11 26 M20 21 L27 28 M20 21 L18 31 M12 13 L11 26 M29 12 L27 28" />
      </g>
      <circle cx="12" cy="13" r="2.6" fill="white" />
      <circle cx="29" cy="12" r="2.6" fill="#8AF0CF" />
      <circle cx="11" cy="26" r="2.6" fill="#8AA9FF" />
      <circle cx="27" cy="28" r="2.6" fill="white" />
      <circle cx="18" cy="31" r="2.2" fill="#B9CCFF" />
      <circle cx="20" cy="21" r="3.6" fill="#FF7A1A" stroke="white" strokeWidth="1.4" />
      <defs>
        <linearGradient id="redpas-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3563F0" />
          <stop offset="1" stopColor="#1A2F6B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn('text-[19px] font-extrabold tracking-tight', inverted ? 'text-white' : 'text-ink')}>
          red<span className={inverted ? 'text-brand-300' : 'text-brand-500'}>pas</span>
        </span>
        <span
          className={cn(
            'mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.14em] sm:block',
            inverted ? 'text-white/50' : 'text-ink/60'
          )}
        >
          Seguros · Productores
        </span>
      </span>
    </span>
  )
}
