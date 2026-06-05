# Auditoria de regressão visual — V2.0.7

## Escopo
Auditoria estática e correção pontual do hotfix visual V2.0.7. Mantido o escopo visual: `assets/css/styles.css` e documentação. Nenhuma alteração em backend, API, Apps Script, Google Sheets, schema, `mock-api.js`, `api-client.js`, login ou endpoints.

## Diagnóstico

Foi encontrado um conflito real no CSS do drawer fechado:

```css
.main-grid:not(.expanded) .nav-item span {
  display: none !important;
}
```

Esse seletor escondia qualquer `span` dentro do botão de menu. Como os ícones Material Symbols também são renderizados como `span.material-symbols-rounded`, o menu fechado podia ocultar os ícones junto com os textos.

## Correção aplicada

A regra foi trocada para esconder somente o texto, preservando `span.material-symbols-rounded`:

```css
.main-grid:not(.expanded) .nav-item span:not(.material-symbols-rounded) {
  display: none !important;
}
```

Também foi adicionada uma proteção explícita para ícones do drawer:

```css
.main-grid .nav-head .material-symbols-rounded,
.main-grid .nav-item .material-symbols-rounded {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
```

## Checklist auditado

| Item | Resultado |
|---|---|
| Checkbox não herda `width: 100%` | OK |
| `input[type="checkbox"]` tem tamanho fixo | OK |
| `input[type="radio"]` tem tamanho fixo | OK |
| Drawer desktop fechado fica com 72px | OK |
| Drawer desktop aberto fica com 246px | OK |
| `.main-grid.expanded` funciona | OK |
| `.main-grid:not(.expanded)` não força 246px | OK |
| Textos do menu somem quando fechado | OK |
| Ícones continuam visíveis quando fechado | Corrigido nesta auditoria |
| Mobile drawer usa `transform: translateX` | OK |
| Backdrop mobile aparece e fecha o menu | OK no CSS; comportamento depende do handler já existente em `app.js` |
| Nenhum botão comum passa de 48px sem justificativa | OK: regra global final limita a 44px |
| Nenhum card cria faixa azul gigante | OK: cards/painéis estão com `min-width: 0` e `overflow: hidden` |
| Backend/API/schema inalterados | OK |

## Arquivos alterados nesta auditoria

- `assets/css/styles.css`
- `docs/CODIGO_COMPLETO_STYLES_CSS_V2_0_7.md`
- `docs/AUDITORIA_REGRESSAO_VISUAL_V2_0_7.md`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `CHANGELOG.md`
- `RELEASE_MANIFEST.json`

## Arquivos preservados

Verificados por hash contra o pacote V2.0.7 anterior:

- `apps-script/Code.gs`
- `assets/js/api-client.js`
- `assets/js/mock-api.js`
- `google-sheets/SHEETS_SCHEMA.json`
- `google-sheets/SHEETS_HEADERS.csv`
- `index.html`

## Teste visual recomendado

1. Abrir em desktop.
2. Clicar no botão de menu.
3. Confirmar menu fechado com 72px.
4. Confirmar ícones visíveis e textos ocultos.
5. Clicar novamente.
6. Confirmar menu aberto com 246px.
7. Abrir tela de permissões/módulos/workflow/checklist.
8. Confirmar checkbox/radio com 18px.
9. Reduzir viewport para mobile.
10. Confirmar drawer off-canvas, backdrop e fechamento ao clicar fora.
