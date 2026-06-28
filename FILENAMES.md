# Estrutura de Arquivos — BBAI

## Raiz

```
bbai/
├── app/                        # Next.js App Router
├── components/                 # Componentes React
├── lib/                        # Utilitários e configurações
├── public/                     # Assets estáticos
├── .env.local                  # Variáveis de ambiente (não commitado)
├── .env.local.example          # Template das variáveis de ambiente
├── apphosting.yaml             # Configuração do Firebase App Hosting
├── firebase.json               # Configuração Firebase
├── .firebaserc                 # Projeto Firebase ativo
├── next.config.js              # Configuração Next.js
├── tailwind.config             # Tailwind (v4, via CSS)
├── tsconfig.json               # TypeScript
├── middleware.ts               # Proteção de rotas (sessão)
├── CLAUDE.md                   # Contexto do projeto para Claude Code
├── FILENAMES.md                # Este arquivo
└── ROADMAP.md                  # Roadmap do produto
```

## app/

```
app/
├── (auth)/                     # Grupo de rotas públicas
│   ├── layout.tsx              # Layout centralizado
│   ├── login/page.tsx          # Tela de login (Google OAuth)
│   └── register/page.tsx       # Redireciona para /login
├── (dashboard)/                # Grupo de rotas autenticadas
│   ├── layout.tsx              # Layout com sidebar
│   ├── dashboard/page.tsx      # Dashboard principal
│   ├── nutrition/page.tsx      # Módulo: Alimentação
│   ├── training/page.tsx       # Módulo: Treino
│   ├── sleep/page.tsx          # Módulo: Sono
│   ├── appointments/page.tsx   # Módulo: Consultas
│   ├── medications/page.tsx    # Módulo: Remédios
│   ├── treatments/page.tsx     # Módulo: Tratamentos
│   ├── goals/page.tsx          # Módulo: Objetivos
│   ├── vaccines/page.tsx       # Módulo: Vacinas
│   └── events/page.tsx         # Módulo: Eventos de Saúde
├── api/
│   └── auth/session/route.ts   # Cria/destrói sessão (Firebase Admin)
├── layout.tsx                  # Layout raiz
├── page.tsx                    # Redireciona para /dashboard
└── globals.css                 # Estilos globais + Tailwind
```

## components/

```
components/
├── layout/
│   ├── sidebar.tsx             # Navegação lateral
│   └── header.tsx              # Cabeçalho com usuário e logout
├── shared/                     # Componentes reutilizáveis entre módulos
└── ui/                         # Componentes shadcn/ui (não editar manualmente)
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── separator.tsx
    └── tabs.tsx
```

## lib/

```
lib/
├── firebase/
│   ├── config.ts               # Inicialização do Firebase (client SDK)
│   ├── auth.ts                 # Funções de autenticação (Google OAuth)
│   ├── firestore.ts            # Helpers de CRUD no Firestore
│   └── admin.ts                # Firebase Admin SDK (server-only, lazy init)
├── hooks/
│   └── useAuth.ts              # Hook de estado de autenticação
├── types/
│   └── index.ts                # Tipos TypeScript de todo o domínio
└── utils.ts                    # cn() e outros utilitários
```

## Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente | PascalCase | `MealCard.tsx` |
| Hook | camelCase com `use` | `useMeals.ts` |
| Utilitário | camelCase | `formatDate.ts` |
| Tipo/Interface | PascalCase | `Meal`, `WorkoutSet` |
| Constante | UPPER_SNAKE_CASE | `MAX_SETS` |
| Rota API | kebab-case (pasta) | `api/nutrition/meals/` |
| Coleção Firestore | camelCase plural | `meals`, `workouts` |
