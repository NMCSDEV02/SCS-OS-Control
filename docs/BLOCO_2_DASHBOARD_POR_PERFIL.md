# Bloco 2 — Dashboard por perfil

Versão alvo: 2.0.0 SaaS UI Implementation

## Objetivo

Implementar dashboards visuais diferentes para:
- Operador
- Gestor / PCM
- Admin Master

## Arquivos alterados

- assets/js/app.js
- assets/css/styles.css
- CHANGELOG.md
- docs/BLOCO_2_DASHBOARD_POR_PERFIL.md

## Não alterado

- apps-script/Code.gs
- assets/js/mock-api.js
- assets/js/api-client.js
- google-sheets/SHEETS_SCHEMA.json
- docs/PLANILHA_SCHEMA.md

## Entrega visual

### Operador

- Próxima ação do operador
- OS ativa em destaque
- Ações: Iniciar OS, Abrir Checklist, Detalhes, Reportar Problema
- Execução guiada em etapas
- Minhas OS prioritárias

### Gestor / PCM

- KPIs: Backlog, Aprovação, Atrasadas, SLA
- Fila de aprovação
- OS críticas e atrasadas
- Risco e criticidade
- Ações: Criar OS, Aprovar, Reabrir, Acompanhar, Atribuir

### Admin Master

- KPIs administrativos
- Cards de comando: Usuários, Permissões, Workflow, Auditoria, Backup, Integrações
- Saúde operacional e sistema

## Checklist de teste

- Login operador@scs.local / 123456
- Conferir Home Operador
- Abrir Minhas OS
- Abrir OS em execução
- Abrir checklist pelo card de próxima ação
- Login gestor@scs.local / 123456
- Conferir fila de aprovação
- Conferir OS críticas e atrasadas
- Testar botões Aprovar/Reabrir quando permitidos
- Login admin@scs.local / 123456
- Conferir cards administrativos
- Abrir Usuários, Permissões, Workflow, Auditoria, Backup e Integrações

## Riscos restantes

- O layout do detalhe da OS ainda será refinado no Bloco 3.
- A central de eventos será refinada no Bloco 4.
- A validação fina de 360px/390px/414px será fechada no Bloco 5.
