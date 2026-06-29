#!/bin/bash
# Injeta contexto crítico do BBAI antes de cada compactação automática.
# O texto produzido é incluído no resumo gerado pelo Claude.

PROJECT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null)
RECENT=$(git -C "$PROJECT_DIR" log --oneline -5 2>/dev/null | sed 's/"/\\"/g' | tr '\n' ' | ')
DIRTY=$(git -C "$PROJECT_DIR" status --short 2>/dev/null | head -5 | sed 's/"/\\"/g' | tr '\n' ' ')

CONTEXT="BBAI project context for compaction:
- Stack: Next.js 15 + Firebase (Auth/Firestore) + Tailwind v4 + shadcn/ui
- Deploy: Firebase App Hosting auto-deploy on push to main (project bbai-f8a39)
- Auth: Google OAuth only via session cookie — Admin SDK must use lazy getAdminAuth()/getAdminDb()
- Branch: ${BRANCH:-main}
- Recent commits: ${RECENT:-none}
- Uncommitted changes: ${DIRTY:-none}
- Production URL: https://bbai--bbai-f8a39.us-central1.hosted.app
- Key constraint: Firebase Admin SDK NEVER initialized at module level"

printf '{"hookSpecificOutput":{"hookEventName":"PreCompact","additionalContext":"%s"}}' \
  "$(echo "$CONTEXT" | sed 's/"/\\"/g' | tr '\n' ' ')"
