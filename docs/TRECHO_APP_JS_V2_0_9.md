# Trecho alterado — `assets/js/app.js` V2.0.9

## Áreas alteradas

- estado visual `quickPanelOpen`;
- `MENU_GROUPS` e `MENU_ITEM_META`;
- renderização do shell/topbar/drawer/painel direito;
- ativação visual de grupos de menu;
- toggle do painel direito.

## Funções principais

```js
function renderShell() { /* cria topbar limpa + workspace de 3 zonas */ }
function renderQuickPanel(notificationItems, notificationCount) { /* painel direito */ }
function quickPanelButton(item) { /* atalhos do painel */ }
function setActiveMenu() { /* ativa item e grupo corretos */ }
function toggleQuickPanel() { /* recolhe/abre painel direito */ }
```

## Restrição cumprida

Não foram alterados endpoints, login, API client, mock API, Apps Script ou schema.
