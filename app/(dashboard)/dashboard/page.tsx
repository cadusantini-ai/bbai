import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Apple,
  Calendar,
  Dumbbell,
  Moon,
  Pill,
  Shield,
  Syringe,
  Target,
} from "lucide-react";
import Link from "next/link";

const modules = [
  { href: "/nutrition", label: "Alimentação", icon: Apple, description: "Refeições e macros do dia" },
  { href: "/training", label: "Treino", icon: Dumbbell, description: "Sessões e progresso" },
  { href: "/sleep", label: "Sono", icon: Moon, description: "Qualidade e horas dormidas" },
  { href: "/appointments", label: "Consultas", icon: Calendar, description: "Próximas consultas médicas" },
  { href: "/medications", label: "Remédios", icon: Pill, description: "Medicamentos ativos" },
  { href: "/treatments", label: "Tratamentos", icon: Shield, description: "Protocolos e ciclos" },
  { href: "/goals", label: "Objetivos", icon: Target, description: "Metas de saúde e performance" },
  { href: "/vaccines", label: "Vacinas", icon: Syringe, description: "Histórico e próximas doses" },
];

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Visão geral</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Bem-vindo ao BBAI — sua central de saúde</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map(({ href, label, icon: Icon, description }) => (
            <Link key={href} href={href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <Icon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-zinc-500">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
