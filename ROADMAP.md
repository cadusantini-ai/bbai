# Roadmap — BBAI

## Visão do produto

Plataforma de gestão de saúde completa para usuários gerais e atletas de bodybuilding. Diferencial: cobre desde o cotidiano (sono, alimentação, consultas) até necessidades específicas de atletas (ciclos, protocolos, periodização).

---

## Fase 1 — Base (atual)

- [x] Scaffold Next.js 15 + Firebase
- [x] Autenticação Google OAuth
- [x] Deploy Firebase App Hosting (CI/CD automático)
- [x] Sidebar com navegação para todos os módulos
- [x] Estrutura de tipos TypeScript para todo o domínio
- [x] Helpers Firestore com subcoleções por usuário

---

## Fase 2 — Módulos principais

### Alimentação
- [ ] Registro de refeições (café, almoço, jantar, lanches, pré/pós treino)
- [ ] Cálculo automático de macros (proteína, carbo, gordura) e calorias
- [ ] Histórico diário com totais
- [ ] Meta diária de macros configurável por objetivo

### Treino
- [ ] Criação de treinos com exercícios, séries e repetições
- [ ] Biblioteca de exercícios com grupo muscular
- [ ] Histórico de sessões com carga/volume
- [ ] Progresso por exercício ao longo do tempo

### Sono
- [ ] Registro de horário de dormir/acordar
- [ ] Avaliação de qualidade (1-5)
- [ ] Fatores influenciadores (estresse, cafeína, etc.)
- [ ] Médias semanais e gráfico de tendência

---

## Fase 3 — Módulos de saúde

### Consultas Médicas
- [ ] Agendamento com médico, especialidade, local e data
- [ ] Histórico de consultas com notas e anexos
- [ ] Alertas de consultas próximas

### Remédios
- [ ] Cadastro de medicamentos com dosagem e horários
- [ ] Notificações de horário (via FCM)
- [ ] Controle de estoque e data de vencimento

### Tratamentos
- [ ] Protocolos médicos e suplementares
- [ ] Ciclos (para bodybuilding): compostos, dosagens, duração
- [ ] Timeline do tratamento ativo

### Vacinas
- [ ] Histórico de vacinas com data e lote
- [ ] Alertas de próximas doses

### Eventos de Saúde
- [ ] Linha do tempo de doenças, lesões, cirurgias
- [ ] Controle do ciclo menstrual
- [ ] Anexo de exames e resultados

---

## Fase 4 — Objetivos e inteligência

### Objetivos
- [ ] Metas por categoria (peso, força, saúde, performance)
- [ ] Progresso visual com milestones
- [ ] Vinculação com métricas dos outros módulos

### Dashboard inteligente
- [ ] Cards com resumo do dia (macros, treino, sono)
- [ ] Alertas e lembretes unificados
- [ ] Score de saúde diário

---

## Fase 5 — Features avançadas

- [ ] Perfil do usuário (peso, altura, data de nascimento, objetivo)
- [ ] Modo bodybuilding vs. modo saúde geral (adapta interface)
- [ ] Upload de exames e documentos médicos (Firebase Storage)
- [ ] Exportação de dados (PDF de histórico)
- [ ] Integração com Google Fit / Apple Health
- [ ] Múltiplos perfis (família)

---

## Decisões técnicas pendentes

- Biblioteca de gráficos: Recharts vs. Chart.js
- Notificações push: Firebase Cloud Messaging
- PWA para experiência mobile nativa
