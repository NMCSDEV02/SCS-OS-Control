# Auditoria HOTFIX VISUAL V2.1.1

## Auditoria visual atual

1. **Topbar-right desktop**: havia três ações no topo direito: painel, notificações e nova ação. O escopo V2.1.1 exige manter apenas o controle do painel direito.
2. **Ações rápidas**: havia repetição de QR/notificações entre navegação principal, painel e mobile.
3. **FAB mobile**: precisava ser reforçado no canto inferior direito, acima da bottom nav.
4. **Drawer mobile**: estava funcional, mas largo e espaçado demais para operação em 320px.
5. **Módulos**: faltava leitura administrativa por perfil, dispositivo e tipo de exibição.

## Mapa de módulos por perfil e dispositivo

### Operador — Mobile prioritário
- Início
- Minhas OS
- QR Code
- Checklist
- Alertas
- Configurações Operacionais

### Gestor/PCM — Mobile/Desktop
- OS
- Aprovações
- Programação
- Backlog
- Indicadores
- Relatórios

### Admin — Governança
- Usuários
- Permissões
- Módulos
- Workflow
- Auditoria
- Backup
- Versionamento

## Plano aplicado

1. Reposicionar e simplificar topbar-right.
2. Remover botões duplicados de notificação e nova ação da topbar.
3. Adicionar botão `tune` no painel direito.
4. Corrigir FAB mobile.
5. Compactar drawer mobile.
6. Reorganizar tela Módulos.
7. Aplicar regra visual `canShowVisualAction()`.

## Resultado esperado

- Desktop preservado.
- Mobile mais compacto.
- Ações rápidas sem duplicidade visual desnecessária.
- Admin com visão clara de perfil/dispositivo/exibição.
