# V1.0.0.1 — Implementação Frontend Dropzone Funcional

## Escopo

Implementação visual/frontend sobre o SCS OS Control tratado como CMMS Industrial SaaS em produção inicial controlada. O bloco preserva backend, API, Apps Script, Google Sheets, schema, mock local, endpoints e login.

Arquivos alterados:

- `assets/js/app.js`
- `assets/css/styles.css`
- `CHANGELOG.md`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/AUDITORIA_FRONTEND_DROPZONE_V1_0_0_1.md`

`config.js` não foi alterado porque não estava autorizado neste bloco.

## Auditoria antes da implementação

### 1. Funções que renderizavam o painel direito atual

- `renderQuickPanel(notificationItems, notificationCount)` renderizava o painel direito.
- `quickPanelButton(item)` renderizava cada ação rápida estática.
- `renderQuickActionsConfig()` renderizava a configuração antiga por checkboxes.
- `quickActionCatalog()`, `eligibleQuickActions()` e `quickActionItems()` definiam catálogo, elegibilidade e seleção visual.
- `toggleQuickPanel()` controlava aberto/fechado.
- `toggleQuickConfig()`, `toggleQuickActionOption()` e `resetQuickActions()` controlavam a edição antiga.

### 2. Ações rápidas existentes

- Minhas OS
- Checklist pendente
- Alertas
- Atualizar
- Criar OS
- Atribuir técnico
- Fila de aprovação
- Programar preventiva
- Indicadores
- Usuários
- Permissões
- Auditoria
- Backup
- Versionamento

### 3. Pontos com botões repetidos

- Ações rápidas desktop no painel direito e ações rápidas mobile no bottom sheet.
- Botão de criação de OS na tela de Ordens e atalho de Criar OS no painel direito.
- Notificações na tela própria, no painel direito e em atalhos por perfil.
- Módulos de governança acessíveis por menu lateral e por ações rápidas de Admin.

### 4. Formulários confusos

- Criação de OS: muitos campos técnicos sem separação visual clara.
- Usuários: cadastro, status, perfil e senha inicial no mesmo bloco visual.
- Checklist: construtor de modelo com itens técnicos densos.
- Workflow: regras padrão e customizadas no mesmo fluxo visual.
- Módulos: precisava deixar mais explícito o vínculo perfil/dispositivo/exibição/oculto.

### 5. Telas que precisavam reorganização visual

- Ordens de Serviço
- Usuários
- Checklist
- Workflow
- Módulos
- Área direita operacional

### 6. Plano de alteração por blocos

1. Criar estado local da Dropzone com persistência em `localStorage`.
2. Converter ações rápidas em módulos adicionáveis.
3. Adicionar controles por módulo: remover, subir, descer, recolher/expandir e configuração visual futura.
4. Criar modo edição com módulos disponíveis respeitando perfil, permissão e dispositivo.
5. Aplicar scroll interno na Dropzone para evitar overflow.
6. Melhorar agrupamento visual de formulários sem alterar regra de negócio.
7. Atualizar documentação e changelog.

### 7. Riscos de regressão

- Como a Dropzone usa ações existentes, risco principal é conflito de clique com `data-view` e `data-action`.
- O botão `Criar OS` depende da tela `gestao-os`; por isso o módulo apenas abre a tela oficial e aciona o painel existente.
- Persistência da Dropzone é local; não há schema para salvar configuração por usuário no backend neste bloco.
- Em mobile, a Dropzone direita permanece oculta e o bottom sheet atual continua como experiência compacta.

## Implementação realizada

### Dropzone Funcional Direita

O painel direito deixou de funcionar como lista estática de atalhos e passou a operar como Dropzone funcional configurável.

Estados implementados:

- aberta;
- fechada;
- modo edição;
- módulo recolhido;
- módulo expandido.

Cada módulo possui:

- remover;
- mover para cima;
- mover para baixo;
- recolher/expandir;
- controle reservado para configuração visual futura.

### Modo edição

O cabeçalho mantém `Ações rápidas` com botão de edição/tune. Ao editar, a interface exibe módulos disponíveis e permite ativar/remover módulos da Dropzone.

A elegibilidade continua usando:

- perfil;
- dispositivo;
- permissão;
- disponibilidade visual do módulo.

### Layout e responsividade

- A Dropzone ganhou scroll interno discreto.
- A área central adapta a largura conforme painel aberto/fechado.
- Overflow horizontal foi bloqueado.
- Em mobile, permanece a experiência com FAB/bottom sheet, evitando painel lateral estreito.

### Formulários

Foram aplicados agrupamentos visuais leves em formulários principais por meio da classe `form-sectioned`, sem alterar nomes de campos, submissão, endpoints ou regras de negócio.

### Tela Módulos

A tela passou a deixar visualmente explícitos:

- perfil;
- dispositivo;
- menu lateral;
- bottom nav;
- Dropzone;
- oculto.

Persistência futura por usuário/perfil foi documentada como pendência, pois exigiria schema/backend.

## Validação recomendada

- Admin desktop: abrir/fechar Dropzone, editar, adicionar/remover/reordenar módulos e acessar Usuários/Permissões/Auditoria.
- Gestor desktop: testar Criar OS, Fila de aprovação, Programação e Indicadores.
- Operador mobile: confirmar que bottom sheet permanece funcional e que Dropzone lateral não aparece.
- Verificar que `Code.gs`, `SHEETS_SCHEMA.json`, `SHEETS_HEADERS.csv`, `api-client.js`, `mock-api.js`, endpoints e login permanecem intactos.

---

# V3.0.1 — Correção da Implementação 1: Drawer Acordeão e Botão Direito

## Escopo

Correção visual pontual sobre a Implementação 1 da V3.0.0.

Não foram alterados backend, API, Apps Script, Google Sheets, schema, `mock-api.js`, `api-client.js` ou login.

## Auditoria

### 1. Botão do painel direito

O botão de abrir/fechar o painel de ações rápidas ainda estava preso ao grid da topbar, ficando deslocado para dentro da tela.

Correção aplicada: no desktop, `.topbar-right` agora usa posicionamento absoluto dentro da topbar, com `right: 10px`, mantendo o botão no canto direito real da interface.

### 2. Subtópicos abertos por padrão

O drawer ainda abria automaticamente o grupo ativo porque `isNavGroupOpen()` retornava `active` quando não havia estado explícito e `setActiveMenu()` adicionava `.is-open` ao grupo ativo.

Correção aplicada:

- `isNavGroupOpen()` agora retorna `false` por padrão.
- `setActiveMenu()` marca o grupo ativo, mas não força `.is-open`.
- O usuário abre/fecha grupos manualmente via `toggle-nav-group`.

### 3. Categorias com apenas um subtópico

O menu estava dependente demais do `session.menu`, então alguns grupos apareciam com um único item. Isso tornava o acordeão pouco útil.

Correção aplicada: foi criado um mapa visual `MENU_ORDER` com múltiplos subtópicos por domínio, filtrado por perfil visual.

## Novo mapa visual do drawer

### Operações

- Centro Operacional
- Ordens de Serviço
- Execução Técnica
- Aprovações
- Comunicações Operacionais

### Qualidade Técnica

- Modelos de Checklist
- Checklists Ativos
- Validação Técnica
- Não Conformidades

### Ativos e Rastreabilidade

- QR Code
- Ativos Industriais
- Componentes
- Histórico Técnico
- Acompanhamento

### PCM e Performance

- Programação
- Backlog
- Indicadores
- Relatórios Gerenciais

### Governança

- Usuários
- Perfis e Permissões
- Módulos
- Cadastros Operacionais
- Workflow

### Administração do Sistema

- Auditoria e Logs
- Backup
- Integrações
- Versionamento
- Perfil Operacional
- Sair

## Arquivos alterados

- `assets/js/app.js`
- `assets/css/styles.css`
- `assets/js/config.js`
- `CHANGELOG.md`
- `RELEASE_MANIFEST.json`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/DOCUMENTACAO_IMPLEMENTACAO_V3_0_1.md`

## Validação recomendada

1. Abrir desktop com Admin.
2. Confirmar que o botão do painel direito fica no canto direito da topbar.
3. Confirmar que os grupos do drawer iniciam fechados.
4. Clicar em Operações e verificar vários subtópicos.
5. Clicar novamente em Operações e verificar recolhimento.
6. Repetir em Qualidade Técnica, Ativos e Rastreabilidade, PCM e Performance, Governança e Administração.
7. Confirmar que o clique nos subtópicos navega sem erro.
8. Confirmar que backend/API/schema não foram alterados.

## Observação técnica

Alguns subtópicos novos são aliases visuais para telas existentes até que os módulos funcionais completos sejam implementados nos próximos blocos. Isso preserva a arquitetura atual e evita alterar schema/backend nesta correção.


---

# Documentação de Implementação — SCS OS Control V2.1.1

## Escopo
Hotfix exclusivamente visual/UX/frontend. Não foram alterados backend, API, Apps Script, Google Sheets, schema, login, `mock-api.js` ou `api-client.js`.

## Auditoria antes da alteração

### Botões duplicados
- A topbar direita mantinha o botão do painel, notificações e botão `+` no mesmo nível.
- No mobile, o FAB/bottom sheet e a bottom nav podiam repetir QR Code, notificações e ações de criação.
- O painel recolhido ainda exibia atalhos de QR/notificações, duplicando navegação já existente.

### Topbar-right desktop
- O controle de painel direito não estava suficientemente ancorado no canto direito.
- A topbar direita tinha mais ações do que o necessário para a versão desktop aprovada.

### FAB mobile
- O botão de ações rápidas precisava ficar fixo no canto inferior direito, acima da bottom nav, sem centralização.

### Drawer mobile
- O drawer estava visualmente pesado para operação mobile: largura, fonte e espaçamentos altos.

### Tela Módulos
- A tela não deixava claro o controle por perfil, dispositivo e tipo de exibição.
- Permissões e módulos existiam, mas faltava organização visual para desktop/mobile/menu/bottom nav/ações rápidas.

## Plano de impacto

1. Manter desktop aprovado e alterar apenas a topbar direita.
2. Remover duplicidade visual de notificações e nova ação da topbar.
3. Adicionar edição/configuração visual no painel de ações rápidas.
4. Reposicionar FAB mobile no canto inferior direito.
5. Compactar drawer mobile.
6. Reorganizar tela Módulos sem alterar schema.
7. Aplicar filtragem visual por perfil, permissão, módulo e dispositivo usando dados já disponíveis.

## Arquivos alterados

- `assets/css/styles.css`
- `assets/js/app.js`
- `assets/js/config.js`
- `CHANGELOG.md`
- `RELEASE_MANIFEST.json`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/DOCUMENTACAO_IMPLEMENTACAO_V2_1_1.md`
- `docs/AUDITORIA_HOTFIX_VISUAL_V2_1_1.md`
- `docs/TRECHO_APP_JS_V2_1_1.md`
- `docs/CODIGO_COMPLETO_STYLES_CSS_V2_1_1.md`

## Implementação

### Desktop
- Topbar direita agora mantém apenas `.quick-panel-toggle`.
- Botões de notificação e `+` foram removidos do HTML renderizado na topbar.
- O painel direito recebeu botão `tune` para configuração visual das ações rápidas.

### Ações rápidas
- Ações rápidas passam por `canShowVisualAction(action, perfil, device)`.
- A validação considera perfil, permissão, módulo e dispositivo.
- QR Code, notificações e nova ação foram reduzidos para evitar duplicidade no mesmo nível visual.

### Mobile
- `.mobile-fab` foi fixado no canto inferior direito.
- Drawer mobile foi compactado para no máximo `min(78vw, 280px)` e `min(76vw, 260px)` em telas menores.
- Bottom sheet segue como ponto compacto para ações secundárias.

### Módulos
- A tela de Módulos ganhou resumo por perfil/dispositivo.
- Cada módulo exibe badges visuais: Desktop, Mobile, Menu lateral, Bottom nav e Ações rápidas.
- A estrutura de permissões existente foi preservada.

## Riscos

- Como não houve alteração de schema, os controles por dispositivo são visuais/preparatórios quando não houver campos persistidos.
- Ações rápidas podem ficar mais enxutas para perfis sem permissões explícitas.
- Cache do navegador pode manter CSS antigo até `Ctrl + F5`.

## Testes recomendados

### Desktop
- Verificar se apenas o botão do painel direito aparece na topbar.
- Abrir/fechar painel direito.
- Conferir botão de edição no painel.
- Confirmar que center-nav continua centralizado.

### Mobile
- Testar 320px, 390px e 414px.
- Confirmar FAB no canto inferior direito.
- Confirmar bottom sheet abrindo/fechando.
- Confirmar drawer compacto e legível.
- Confirmar QR/notificações/nova ação sem duplicidade no mesmo nível.

### Técnico
- Confirmar que `Code.gs`, `api-client.js`, `mock-api.js`, schema e login não foram alterados.
