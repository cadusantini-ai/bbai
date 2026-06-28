# BBAI — Contexto do Projeto para Claude Code

## O que é este projeto

BBAI é uma plataforma web de gestão de saúde para usuários gerais e atletas de bodybuilding. Cobre alimentação, treino, sono, consultas médicas, remédios, tratamentos (incluindo ciclos), objetivos, vacinas e eventos de saúde.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Auth:** Firebase Authentication (Google OAuth)
- **Banco de dados:** Firestore (NoSQL, subcoleções por usuário)
- **Storage:** Firebase Storage
- **Deploy:** Firebase App Hosting (Cloud Run) — projeto `bbai-f8a39`
- **CI/CD:** push para `main` dispara deploy automático

## Comandos

```bash
npm run dev      # desenvolvimento local
npm run build    # build de produção
npm run lint     # lint
```

## Estrutura de dados no Firestore

Todos os dados de usuário ficam em subcoleções:
```
users/{userId}/meals
users/{userId}/workouts
users/{userId}/appointments
users/{userId}/medications
users/{userId}/treatments
users/{userId}/goals
users/{userId}/vaccines
users/{userId}/events
users/{userId}/sleep
```

## Convenções de código

- Componentes de página: `app/(dashboard)/[modulo]/page.tsx`
- Tipos TypeScript: `lib/types/index.ts`
- Firebase client: `lib/firebase/auth.ts`, `lib/firebase/firestore.ts`
- Firebase Admin (server-only): `lib/firebase/admin.ts` — usar `getAdminAuth()` e `getAdminDb()` (lazy, não inicializar no nível do módulo)
- Hooks customizados: `lib/hooks/`
- Componentes de layout: `components/layout/`
- Componentes UI (shadcn): `components/ui/`

## Regras importantes

- O Firebase Admin SDK **nunca** deve ser inicializado no nível do módulo — sempre usar as factory functions `getAdminAuth()` / `getAdminDb()`
- API routes que usam Admin SDK precisam de `export const dynamic = "force-dynamic"`
- Variáveis `NEXT_PUBLIC_*` são públicas; credenciais admin são secrets no Secret Manager
- O app NÃO roda localmente em produção — é 100% Firebase App Hosting
- Auth é exclusivamente Google OAuth — sem email/senha

## URL de produção

https://bbai--bbai-f8a39.us-central1.hosted.app
