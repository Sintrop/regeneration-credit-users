import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Card({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("min-w-0 scroll-mt-24 rounded-2xl border bg-card shadow-sm", className)}>
      {children}
    </section>
  )
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>
}

export function Stat({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-2 rounded-xl border bg-card p-3 sm:flex-row sm:gap-3 sm:p-4">
      {icon && <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-tint text-tint-foreground sm:size-10">{icon}</div>}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-lg font-semibold tabular-nums break-words sm:text-xl">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
}

export function Badge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "success" | "danger" | "warning" | "muted" }) {
  const tones = {
    brand: "bg-tint text-tint-foreground",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
    warning: "bg-warning-soft text-warning",
    muted: "bg-muted text-muted-foreground",
  }
  return <span className={cn("inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>
}
