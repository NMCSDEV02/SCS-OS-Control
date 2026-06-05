# DOCUMENTAÇÃO DE IMPLEMENTAÇÃO — V2.0.7

## Escopo executado

Hotfix visual restrito a CSS, drawer/sidebar, checkbox/radio, botões, responsividade e pequeno ajuste em `assets/js/app.js` para sincronizar o estado visual do drawer.

Não foram alterados Apps Script, API, Google Sheets, schema, `mock-api.js`, `api-client.js`, login, `os.listar` ou endpoints.

## 1. Diagnóstico dos conflitos encontrados no CSS

### 1.1 Checkbox/radio gigante

A regra global de `input, select, textarea` aplicava `width: 100%` e `min-height: 40px` também em `checkbox` e `radio`. Isso transformava inputs booleanos em blocos largos/altos dentro de permissões, módulos, workflow e checklist.

### 1.2 Drawer/sidebar não minimizava

Havia blocos de hotfix no final do CSS que forçavam `body.is-authenticated .main-grid:not(.expanded)` e `.sidebar` para `246px`, exatamente quando o menu deveria estar recolhido. Isso anulava o estado fechado do drawer.

### 1.3 Submenus visíveis quando o menu deveria estar fechado

As sobrescritas finais também exibiam `.nav-sub` no estado `not(.expanded)`, impedindo a experiência de sidebar compacta com apenas ícones.

### 1.4 Botões e cards com risco de altura/largura excessiva

Botões comuns e botões de ícone não tinham proteção final consolidada contra expansão vertical. Cards e grids também precisavam de `min-width: 0` para evitar overflow horizontal e colunas vazias em layouts responsivos.

## 2. Regras removidas/corrigidas

Removidos os blocos finais duplicados:

- `Hotfix 2.0.4 — estabilidade do shell autenticado`
- `Hotfix 2.0.6 — AppTopbar e drawer alinhados ao Design System V2 SaaS`

Corrigidas/substituídas as regras que:

- forçavam sidebar recolhida para `246px`;
- exibiam `.nav-sub` no estado recolhido;
- permitiam `checkbox`/`radio` herdar `width: 100%`;
- não sincronizavam `.main-grid.expanded` ao clicar no botão de menu;
- deixavam botões comuns e de ícone sem limite consistente de altura.

## 3. Arquivos alterados

- `assets/css/styles.css`
- `assets/js/app.js` — apenas estado do drawer/sidebar
- `assets/js/config.js` — apenas metadado de versão `2.0.7`
- `CHANGELOG.md`
- `RELEASE_MANIFEST.json`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/DOCUMENTACAO_IMPLEMENTACAO_V2_0_7.md`
- `docs/CODIGO_COMPLETO_STYLES_CSS_V2_0_7.md`
- `docs/TRECHO_APP_JS_V2_0_7.md`

## 4. Trecho alterado de `assets/js/app.js`

```js
  function toggleMobileMenu() {
    setMobileMenuOpen(!state.menuOpen);
  }

  function isMobileShell() {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 840px)").matches;
  }

  function closeMobileMenu() {
    if (isMobileShell() && state.menuOpen) setMobileMenuOpen(false);
  }

  function setMobileMenuOpen(open) {
    state.menuOpen = Boolean(open);
    const mainGrid = app.querySelector(".main-grid");
    const sidebar = app.querySelector("#sidebar-menu");
    const backdrop = app.querySelector(".mobile-menu-backdrop");
    const toggleButton = app.querySelector("[data-action='toggle-menu']");
    if (mainGrid) mainGrid.classList.toggle("expanded", state.menuOpen);
    if (sidebar) sidebar.classList.toggle("is-open", state.menuOpen);
    if (backdrop) backdrop.classList.toggle("is-open", isMobileShell() && state.menuOpen);
    if (toggleButton) toggleButton.setAttribute("aria-expanded", state.menuOpen ? "true" : "false");
  }
```

## 5. Checklist de teste visual

### Desktop

- [ ] Menu aberto ocupa 246px.
- [ ] Menu fechado ocupa 72px.
- [ ] Conteúdo principal expande quando o menu fecha.
- [ ] Ícones do menu continuam visíveis no estado fechado.
- [ ] Textos e submenus somem no estado fechado.
- [ ] Botão de menu alterna aberto/fechado sem recarregar a tela.
- [ ] Clique em item do menu no desktop não fecha automaticamente a sidebar.

### Mobile

- [ ] Menu abre como off-canvas.
- [ ] Backdrop aparece ao abrir o drawer.
- [ ] Clique fora fecha o drawer.
- [ ] Clique em item do menu fecha o drawer.
- [ ] Bottom nav continua visível.
- [ ] Não há overflow horizontal.

### Checkbox/radio

- [ ] Checkbox tem tamanho normal.
- [ ] Radio tem tamanho normal.
- [ ] Permissões ficam legíveis.
- [ ] Módulos ficam legíveis.
- [ ] Workflow fica legível.
- [ ] Checklist não estoura largura.

### Botões/cards

- [ ] Botões comuns ficam entre 38px e 44px.
- [ ] Botões de ícone ficam em 38px.
- [ ] Cards não geram faixa azul gigante.
- [ ] Formulários não criam colunas vazias exageradas.

## 6. CHANGELOG V2.0.7

- Corrigido drawer/sidebar minimizável no desktop.
- Corrigido drawer off-canvas no mobile.
- Corrigidos checkboxes gigantes causados por regra global de input.
- Corrigido comportamento de botões com altura excessiva.
- Removidas sobrescritas duplicadas que impediam o menu de recolher.
- Preservados backend, API, Apps Script, mock local e schema.
- Mantida interface SaaS industrial V2.

## 7. Código completo atualizado de `assets/css/styles.css`

O código completo está documentado em:

```txt
docs/CODIGO_COMPLETO_STYLES_CSS_V2_0_7.md
```
