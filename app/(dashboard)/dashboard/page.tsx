import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Apple,
  Calendar,
  CalendarDays,
  Dumbbell,
  FlaskConical,
  Moon,
  Pill,
  Shield,
  Syringe,
  Target,
} from "lucide-react";
import Link from "next/link";

const modules = [
  {
    href: "/nutrition",
    label: "Alimentação",
    icon: Apple,
    description: "Refeições e macros do dia",
    color: "#10B981",
  },
  {
    href: "/training",
    label: "Treino",
    icon: Dumbbell,
    description: "Sessões e progresso",
    color: "#00D4AA",
  },
  {
    href: "/sleep",
    label: "Sono",
    icon: Moon,
    description: "Qualidade e horas dormidas",
    color: "#3B82F6",
  },
  {
    href: "/appointments",
    label: "Consultas",
    icon: Calendar,
    description: "Próximas consultas médicas",
    color: "#F59E0B",
  },
  {
    href: "/medications",
    label: "Remédios",
    icon: Pill,
    description: "Medicamentos ativos",
    color: "#EF4444",
  },
  {
    href: "/treatments",
    label: "Tratamentos",
    icon: Shield,
    description: "Protocolos e ciclos",
    color: "#00D4AA",
  },
  {
    href: "/goals",
    label: "Objetivos",
    icon: Target,
    description: "Metas de saúde e performance",
    color: "#F59E0B",
  },
  {
    href: "/vaccines",
    label: "Vacinas",
    icon: Syringe,
    description: "Histórico e próximas doses",
    color: "#10B981",
  },
  {
    href: "/events",
    label: "Eventos",
    icon: CalendarDays,
    description: "Linha do tempo de saúde",
    color: "#8B92A9",
  },
  {
    href: "/exams",
    label: "Exames",
    icon: FlaskConical,
    description: "Laudos e marcadores ao longo do tempo",
    color: "#8B5CF6",
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Visão geral</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bem-vindo ao BBAI — sua central de saúde
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map(({ href, label, icon: Icon, description, color }) => (
            <Link key={href} href={href}>
              <Card className="hover:border-primary/30 transition-all duration-200 cursor-pointer h-full bg-card border-border group">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg shrink-0"
                      style={{ backgroundColor: `${color}1A` }}
                    >
                      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                    </div>
                    <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
