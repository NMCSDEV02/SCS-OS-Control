# Bloco 1 — UI Shell + CSS Base

Versão alvo: 2.0.0 SaaS UI Implementation

Arquivos alterados:
- index.html
- assets/css/styles.css
- assets/js/app.js
- assets/js/config.js
- assets/js/config.production.example.js
- CHANGELOG.md

Não alterado:
- apps-script/Code.gs
- assets/js/mock-api.js
- assets/js/api-client.js
- google-sheets/SHEETS_SCHEMA.json
- docs/PLANILHA_SCHEMA.md

Escopo:
- Tema claro definitivo.
- Topbar fixa.
- Sidebar/dock recolhível desktop.
- Drawer mobile.
- Navegação central por ícones.
- Bottom navigation mobile.
- Painel de notificações visual.
- Ações rápidas por perfil.
- Compatibilidade visual com classes antigas do app real.

Checklist de teste:
- Login operador@scs.local / 123456
- Login gestor@scs.local / 123456
- Login admin@scs.local / 123456
- Testar sidebar desktop aberta/fechada.
- Testar menu mobile em 360px, 390px e 414px.
- Testar navegação: Dashboard, OS, Checklist, QR, Eventos.
- Confirmar que não houve alteração de API, mock, Apps Script ou schema.
