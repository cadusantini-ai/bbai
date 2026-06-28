"use client";

import { cn } from "@/lib/utils";
import {
  Activity,
  Apple,
  Calendar,
  CalendarDays,
  Dumbbell,
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
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
          <span className="font-bold text-lg tracking-tight">BBAI</span>
        </div>
        <p className="text-xs text-zinc-400 mt-0.5">Gestão de Saúde</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
