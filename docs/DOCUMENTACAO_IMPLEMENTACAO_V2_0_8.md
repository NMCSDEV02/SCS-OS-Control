# DOCUMENTAÇÃO DE IMPLEMENTAÇÃO — V2.0.8

## Escopo executado

Hotfix visual restrito à navegação lateral, organização do menu, ícones Material Symbols e layout da tela de Checklist.

## Escopo preservado

Não foram alterados:

- `apps-script/Code.gs`
- `assets/js/api-client.js`
- `assets/js/mock-api.js`
- `google-sheets/SHEETS_SCHEMA.json`
- `google-sheets/SHEETS_HEADERS.csv`
- `index.html`
- login, endpoints, fluxo de OS, backend, API e Google Sheets

## Diagnóstico antes da correção

1. `menuGroup(group)` renderizava o tópico principal com `data-action="noop"`, deixando a categoria do drawer sem navegação real.
2. Categorias e subtópicos repetiam o mesmo nome, por exemplo `Checklists > Checklists` e `QR Code > QR Code`.
3. O mapa de navegação não seguia a estrutura funcional definida para Operação, Checklists, Rastreabilidade, PCM, Administração e Sistema.
4. Ícones do drawer estavam parcialmente coerentes, mas havia mistura de nomes genéricos e ícones menos aderentes ao Design System.
5. A tela de Checklist concentrava formulário, gestão de modelos e execuções em fluxo vertical, deixando espaço branco excessivo em desktop.
6. O formulário de criação de modelos ficava estreito e o botão de salvar não tinha uma área visual clara de ação.

## Correções implementadas

### Navegação lateral

- Removido `data-action="noop"` dos tópicos principais do drawer.
- `nav-head` agora usa `data-view` real calculado por grupo.
- Categoria principal navega para a tela principal disponível do grupo.
- Drawer fechado mantém ícones clicáveis.
- Drawer aberto mantém categoria e subtópicos clicáveis.

### Mapa de menu

Criado mapa funcional:

| Categoria | Itens possíveis |
|---|---|
| Operação | Dashboard, Ordens de Serviço, Minhas OS, Aprovações, Eventos |
| Checklists | Modelos de Checklist |
| Rastreabilidade | QR Code, Ativos, Histórico Técnico |
| PCM | Programação, Indicadores, Relatórios |
| Administração | Usuários, Permissões, Cadastros, Workflow |
| Sistema | Auditoria / Logs, Backup, Integrações, Versionamento, Meu perfil, Sair |

Observação: o hotfix não cria telas novas nem endpoints. Ele apenas reorganiza visualmente as views já existentes no frontend.

### Ícones Material Symbols

Auditados e padronizados exemplos principais:

- Dashboard: `dashboard`
- Ordens de Serviço: `assignment`
- Minhas OS: `task_alt`
- Aprovações: `approval`
- Checklists: `fact_check`
- Modelos de Checklist: `checklist`
- Rastreabilidade: `qr_code_scanner`
- QR Code: `qr_code_2`
- Ativos: `precision_manufacturing`
- PCM: `monitoring`
- Programação: `event_note`
- Indicadores: `query_stats`
- Relatórios: `bar_chart`
- Administração: `admin_panel_settings`
- Permissões: `shield_person`
- Workflow: `account_tree`
- Sistema: `settings`
- Versionamento: `deployed_code_history`

### Tela Checklist

- Título ajustado para `Modelos de Checklist`.
- Subtítulo ajustado para explicar objetivo da tela.
- Criado `checklist-workspace` com grid responsivo.
- Formulário de criação recebeu `checklist-editor-panel`.
- Criadas colunas `checklist-main-column` e `checklist-side-column`.
- Ação `Salvar modelo` passou para um card de ação alinhado ao formulário.
- Em telas menores, os blocos empilham em uma coluna.

## Arquivos alterados

- `assets/js/app.js`
- `assets/css/styles.css`
- `assets/js/config.js`
- `CHANGELOG.md`
- `RELEASE_MANIFEST.json`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/DOCUMENTACAO_IMPLEMENTACAO_V2_0_8.md`
- `docs/TRECHO_APP_JS_V2_0_8.md`
- `docs/CODIGO_COMPLETO_STYLES_CSS_V2_0_8.md`

## Validação executada

- `node --check assets/js/app.js`: OK
- Verificado que não existe `data-action="noop"` em `menuGroup(group)`.
- Confirmado por hash que backend/API/schema/mock/api-client/index não foram alterados.

## Checklist de teste visual

### Desktop drawer aberto

- Dashboard clicável.
- Checklists clicável.
- Rastreabilidade clicável.
- Administração clicável.
- Sistema clicável.
- Subtópicos clicáveis.
- Item ativo destacado.

### Desktop drawer fechado

- Ícones principais visíveis.
- Ícones principais clicáveis.
- Tooltip/title disponível no hover.
- Conteúdo troca de página.
- Sem área morta no drawer.

### Tela Checklist

- Formulário não fica espremido.
- Não sobra área branca exagerada.
- Botão `Salvar modelo` alinhado em card lateral.
- Inputs respeitam largura disponível.
- Em notebook/mobile, layout empilha corretamente.

### Regressão

- Topbar continua funcionando.
- Center-nav continua funcionando.
- Login não foi alterado.
- API real não foi alterada.
- Apps Script não foi alterado.
- Schema não foi alterado.
- `mock-api.js` e `api-client.js` não foram alterados.
