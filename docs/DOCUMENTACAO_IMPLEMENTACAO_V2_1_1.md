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
