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

