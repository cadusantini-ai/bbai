"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import {
  Apple,
  Calendar,
  CalendarDays,
  Dumbbell,
  FlaskConical,
  Heart,
  Moon,
  Pill,
  Shield,
  Syringe,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Heart },
  { href: "/nutrition", label: "Alimentação", icon: Apple },
  { href: "/training", label: "Treino", icon: Dumbbell },
  { href: "/sleep", label: "Sono", icon: Moon },
  { href: "/appointments", label: "Consultas", icon: Calendar },
  { href: "/medications", label: "Remédios", icon: Pill },
  { href: "/treatments", label: "Tratamentos", icon: Shield },
  { href: "/goals", label: "Objetivos", icon: Target },
  { href: "/vaccines", label: "Vacinas", icon: Syringe },
  { href: "/events", label: "Eventos", icon: CalendarDays },
  { href: "/exams", label: "Exames", icon: FlaskConical },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-border">
        <Logo iconSize={32} />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                pathname === href ? "text-primary" : "text-muted-foreground"
              )}
            />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
          v0.1.0-beta
        </p>
      </div>
    </aside>
  );
}
