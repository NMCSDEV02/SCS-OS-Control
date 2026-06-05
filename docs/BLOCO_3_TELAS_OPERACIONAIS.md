# Bloco 3 — Telas operacionais

Versão alvo: 2.0.0 SaaS UI Implementation

## Objetivo

Melhorar as telas operacionais reais do sistema sem alterar API, backend, mock ou schema.

## Arquivos alterados

- assets/js/app.js
- assets/css/styles.css
- CHANGELOG.md
- docs/BLOCO_3_TELAS_OPERACIONAIS.md

## Não alterado

- apps-script/Code.gs
- assets/js/mock-api.js
- assets/js/api-client.js
- google-sheets/SHEETS_SCHEMA.json
- docs/PLANILHA_SCHEMA.md

## Entrega visual

### Lista de OS

- Toolbar operacional
- Busca
- Filtro por status
- Chips de status
- Cards de OS com criticidade, prioridade, prazo e checklist

### Detalhe da OS

- Cabeçalho operacional
- Status e criticidade em destaque
- Ações de workflow
- Ficha técnica da OS
- Progresso da OS
- Timeline operacional
- Checklist
- Eventos
- Histórico

### Checklist técnico

- Itens com resposta técnica
- Observação
- Evidência
- Status visual do item
- Botão salvar checklist

### QR Code

- Tela de rastreabilidade industrial
- Scanner por câmera
- Entrada manual
- Resultado operacional

## Checklist de teste

- Login operador@scs.local / 123456
- Abrir Minhas OS
- Abrir detalhe da OS
- Iniciar OS liberada
- Abrir e salvar checklist
- Confirmar bloqueio de finalização quando houver pendência
- Abrir QR Code
- Resolver equipamento/OS por entrada manual
- Login gestor@scs.local / 123456
- Abrir Gestão de OS
- Abrir Acompanhamento
- Aprovar/Reabrir se permitido
- Login admin@scs.local / 123456
- Abrir Auditoria
- Conferir visual de histórico/logs

## Riscos restantes

- Central de eventos será refinada no Bloco 4.
- Auditoria terá refinamento específico no Bloco 4.
- Responsividade final será validada no Bloco 5.
