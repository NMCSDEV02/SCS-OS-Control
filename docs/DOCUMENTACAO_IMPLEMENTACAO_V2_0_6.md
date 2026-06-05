# DOCUMENTACAO_IMPLEMENTACAO — SCS OS Control V2.0.6

## 1. Objetivo

Realinhar o shell autenticado ao Design System V2 SaaS depois dos hotfixes de login, drawer e menu central.

A correção anterior resolveu a visibilidade dos ícones, mas ainda deixou risco de divergência de contexto visual: ícones fora do mapa oficial e CSS com seletor herdado de hotfix anterior. Esta versão consolida o código e remove a sobrescrita antiga duplicada.

## 2. Escopo implementado

- Padronização dos ícones do menu central conforme biblioteca oficial Material Symbols Rounded.
- Renomeação semântica do botão central para `center-nav-button`.
- Renomeação do tooltip para `center-nav-tooltip`.
- Remoção do seletor antigo que escondia `<span>` genérico dentro do menu central.
- Consolidação da camada CSS do shell autenticado em um único bloco `Hotfix 2.0.6`.
- Atualização de versão para `2.0.6`.

## 3. Arquivos alterados

- `assets/js/app.js`
- `assets/css/styles.css`
- `assets/js/config.js`
- `RELEASE_MANIFEST.json`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/DOCUMENTACAO_IMPLEMENTACAO_V2_0_6.md`

## 4. Fluxo lógico

```txt
auth.login
→ sistema.bootstrap
→ renderShell
→ AppTopbar usa centerNavItems
→ centerNavButton renderiza Material Symbols oficial
→ CSS estiliza somente .center-nav-button e .center-nav-tooltip
→ drawer/topbar seguem o Design System V2 SaaS
```

## 5. Ícones oficiais aplicados

| Módulo | Ícone aplicado |
|---|---|
| Dashboard | `dashboard` |
| Ordens de Serviço | `assignment` |
| Checklists | `checklist` |
| QR Code | `qr_code_scanner` |
| Eventos | `notifications` |
| Analytics | `monitoring` |

## 6. Código antigo removido/substituído

Foi substituído o padrão frágil:

```css
.center-nav button span
```

por seletores específicos:

```css
.center-nav-button .material-symbols-rounded
.center-nav-tooltip
```

Também foi removido o bloco antigo `Hotfix 2.0.4` do fim do CSS e substituído por uma única camada consolidada `Hotfix 2.0.6`.

## 7. Impacto técnico

- Não altera backend.
- Não altera Google Apps Script.
- Não altera Google Sheets.
- Não altera schema.
- Não altera `mock-api.js`.
- Não altera `api-client.js`.
- Não recria o app.
- Não altera dados.

## 8. Testes recomendados

1. Substituir a pasta servida pelo conteúdo deste ZIP.
2. Executar `Ctrl + F5` no navegador.
3. Validar login Admin, Gestor e Operador.
4. Conferir se a topbar mostra 5 ícones centrais.
5. Conferir se o tooltip aparece ao passar o mouse.
6. Conferir se o drawer lateral permanece aberto no desktop.
7. Conferir se a navegação lateral e central troca de view.

## 9. Possíveis riscos

- Se o ambiente local estiver sem internet, a fonte Google Material Symbols pode não carregar. Nesse caso o texto do ícone pode aparecer como palavra, não como símbolo.
- Se houver cache do navegador, o CSS antigo pode continuar ativo até `Ctrl + F5`.

## 10. Próximos passos

Criar uma camada única de componentes `AppTopbar`, `AppSidebar` e `MobileBottomNav` para reduzir ainda mais risco de regressão visual, sem mudar design nem tecnologia.
