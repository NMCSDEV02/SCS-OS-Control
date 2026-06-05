# Bloco 4 — Eventos, notificações e auditoria visual

Versão alvo: 2.0.0 SaaS UI Implementation

## Objetivo

Melhorar a leitura operacional da central de eventos, notificações e auditoria sem alterar backend, API, mock ou schema.

## Arquivos alterados

- assets/js/app.js
- assets/css/styles.css
- CHANGELOG.md
- docs/BLOCO_4_EVENTOS_NOTIFICACOES_AUDITORIA.md

## Não alterado

- apps-script/Code.gs
- assets/js/mock-api.js
- assets/js/api-client.js
- google-sheets/SHEETS_SCHEMA.json
- docs/PLANILHA_SCHEMA.md

## Entrega visual

### Central de eventos

- Painel hero com total filtrado
- Cards de resumo por categoria
- Área "Prioridade agora"
- Filtros por tag
- Grupos por categoria
- Eventos com ação recomendada

### Notificações

- Eventos classificados por risco, aprovação, checklist, técnico e sistema
- Ação sugerida: Abrir OS, Ver ativo, Ver versão ou Analisar
- Perfil responsável exibido no card

### Auditoria

- Hero de governança
- Resumo por severidade
- Timeline visual
- Ícones Material Symbols
- Severidades: crítico, atenção e informativo

## Checklist de teste

- Login gestor@scs.local / 123456
- Abrir Central de Eventos
- Filtrar por SLA, Aprovação, Checklist, Técnico e Sistema
- Abrir evento de OS
- Abrir evento de QR/ativo
- Login admin@scs.local / 123456
- Abrir Auditoria
- Confirmar carregamento dos logs
- Conferir cards por severidade
- Validar responsividade mobile

## Riscos restantes

- Responsividade final em 360px/390px/414px será consolidada no Bloco 5.
- Ajustes finos de textos e ícones podem ser refinados após teste visual real.
