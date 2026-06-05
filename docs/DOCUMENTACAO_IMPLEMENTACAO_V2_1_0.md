# SCS OS Control V2.1.0 — Auditoria Final Mobile e UX Operacional

## Escopo executado

Hotfix exclusivamente visual/UX mobile, com um pequeno ajuste desktop na área direita da topbar.

Arquivos alterados:

- `assets/css/styles.css`
- `assets/js/app.js`
- `assets/js/config.js`
- `CHANGELOG.md`
- `RELEASE_MANIFEST.json`
- documentação `.md`

Arquivos preservados:

- `apps-script/Code.gs`
- `assets/js/api-client.js`
- `assets/js/mock-api.js`
- `google-sheets/SHEETS_SCHEMA.json`
- `google-sheets/SHEETS_HEADERS.csv`
- `index.html`

## Auditoria antes da alteração

### Interface mobile atual

O mobile ainda herdava conceitos do desktop, principalmente o painel direito de ações rápidas. Isso gerava uma experiência operacional menos direta: controles administrativos apareciam em áreas de navegação curta e o operador precisava navegar por blocos que não eram prioritários para chão de fábrica.

### Elementos desktop indevidos no mobile

- Controle do painel direito exposto na topbar mobile.
- Painel direito/dock desktop ainda existia conceitualmente no shell mobile.
- Ações rápidas concentradas em um painel lateral, formato pouco adequado para tela pequena.

### Elementos repetidos

- QR Code aparecia em mais de um nível de ação: topbar/ação rápida/bottom nav.
- A tela de QR tinha texto operacional longo antes da ação principal.
- O operador tinha redundância entre “Ler QR Code” no cabeçalho e QR na navegação.

### Impacto esperado

- Mobile vira fluxo operacional: abrir app, QR, Minhas OS, checklist e finalização com menos cliques.
- Gestor/Admin mantêm funções em navegação compactada por “Mais”/bottom sheet.
- Desktop permanece estável, com apenas reposicionamento dos botões direitos da topbar.

### Risco de regressão

Baixo a moderado no frontend visual. O maior risco está em compatibilidade de câmera/`BarcodeDetector` em navegadores móveis; por isso foi mantido fallback manual.

## Plano de implementação por blocos

1. Ocultar/adaptar painel direito desktop no mobile.
2. Criar FAB mobile e bottom sheet de ações rápidas.
3. Reorganizar bottom nav por perfil.
4. Melhorar fluxo QR Code mobile com scanner direto, contador de 30s e fallback manual.
5. Compactar home do operador sem remover funções.
6. Compactar funções de gestor/admin em “Mais”.
7. Ajustar discretamente `topbar-right` no desktop.
8. Polir scroll, espaçamento, ícones e textos.

## Implementação realizada

### Painel direito no mobile

- `.quick-panel` é ocultado no mobile.
- O botão de painel direito da topbar mobile é ocultado.
- Ações rápidas passam para `.mobile-fab` e `.mobile-actions-sheet`.

### Bottom nav por perfil

Operador:

- Início
- Minhas OS
- QR
- Alertas
- Config.

Gestor/PCM:

- Início
- OS
- Aprovar
- QR
- Mais

Admin:

- Início
- Usuários
- Permissões
- Auditoria
- Mais

### QR Code mobile

- Tela de QR simplificada.
- Scanner direto ao entrar na view no mobile.
- Contador visual de 30 segundos.
- Fallback manual aparece quando a câmera falha, quando o navegador não suporta leitura automática ou quando o tempo expira.

### Desktop

- `topbar-right` ajustado para ficar mais próximo ao canto direito.
- Não houve alteração na arquitetura desktop de 3 zonas.

## Validação recomendada

Testar larguras:

- 320px
- 360px
- 390px
- 414px

Validar:

- Login.
- QR em 1 clique.
- Minhas OS em 1 clique para operador.
- Bottom sheet abre e fecha.
- Backdrop fecha o bottom sheet.
- Gestor/Admin acessam funções compactadas via Mais.
- Desktop continua com center-nav centralizada.
- Topbar-right mais próxima do canto direito.

## Observações técnicas

Nenhuma chamada de API, endpoint, Apps Script, schema, mock ou client HTTP foi alterado.
