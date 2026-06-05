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
