# TRECHO ALTERADO — assets/js/app.js — V2.0.8

```js
  const MENU_GROUPS = [
    { id: "operacao", label: "Operacao", icon: "assignment", preferredView: "dashboard" },
    { id: "checklists", label: "Checklists", icon: "fact_check", preferredView: "checklists" },
    { id: "rastreabilidade", label: "Rastreabilidade", icon: "qr_code_scanner", preferredView: "qr-code" },
    { id: "pcm", label: "PCM", icon: "monitoring", preferredView: "programacao" },
    { id: "administracao", label: "Administracao", icon: "admin_panel_settings", preferredView: "usuarios" },
    { id: "sistema", label: "Sistema", icon: "settings", preferredView: "auditoria" }
  ];

  const MENU_ITEM_META = {
    dashboard: { label: "Dashboard", icon: "dashboard", group: "operacao" },
    "gestao-os": { label: "Ordens de Servico", icon: "assignment", group: "operacao" },
    "minhas-os": { label: "Minhas OS", icon: "task_alt", group: "operacao" },
    acompanhamento: { label: "Aprovacoes", icon: "approval", group: "operacao" },
    notificacoes: { label: "Aprovacoes e Alertas", icon: "notifications", group: "operacao" },
    comunicacoes: { label: "Comunicacoes", icon: "campaign", group: "operacao" },
    checklists: { label: "Modelos de Checklist", icon: "checklist", group: "checklists" },
    "qr-code": { label: "QR Code", icon: "qr_code_2", group: "rastreabilidade" },
    equipamentos: { label: "Ativos", icon: "precision_manufacturing", group: "rastreabilidade" },
    "historico-pessoal": { label: "Historico Tecnico", icon: "history", group: "rastreabilidade" },
    programacao: { label: "Programacao", icon: "event_note", group: "pcm" },
    relatorios: { label: "Indicadores", icon: "query_stats", group: "pcm" },
    "relatorios-gerais": { label: "Relatorios", icon: "bar_chart", group: "pcm" },
    usuarios: { label: "Usuarios", icon: "group", group: "administracao" },
    "usuarios-view": { label: "Consulta de Usuarios", icon: "group", group: "administracao" },
    permissoes: { label: "Permissoes", icon: "shield_person", group: "administracao" },
    cadastros: { label: "Cadastros", icon: "inventory_2", group: "administracao" },
    configuracoes: { label: "Workflow", icon: "account_tree", group: "administracao" },
    auditoria: { label: "Auditoria / Logs", icon: "manage_search", group: "sistema" },
    backup: { label: "Backup", icon: "backup", group: "sistema" },
    integracoes: { label: "Integracoes", icon: "hub", group: "sistema" },
    versionamento: { label: "Versionamento", icon: "deployed_code_history", group: "sistema" },
    "meu-perfil": { label: "Meu perfil", icon: "account_circle", group: "sistema" },
    sair: { label: "Sair", icon: "logout", group: "sistema" }
  };

  function viewIcon(viewId) {
    return (MENU_ITEM_META[viewId] && MENU_ITEM_META[viewId].icon) || "apps";
  }

  function navGroupForView(viewId) {
    return (MENU_ITEM_META[viewId] && MENU_ITEM_META[viewId].group) || "sistema";
  }

  function normalizedMenu() {
    const fallback = [
      { id: "dashboard", label: "Dashboard" },
      { id: "meu-perfil", label: "Meu perfil" },
      { id: "sair", label: "Sair" }
    ];
    const raw = state.session && Array.isArray(state.session.menu) && state.session.menu.length
      ? state.session.menu
      : fallback;
    const seen = new Set();
    return raw.map((item) => {
      if (Array.isArray(item)) return { id: item[0], label: item[1] || item[0] };
      if (typeof item === "string") return { id: item, label: item };
      return { id: item.id || item.view || "dashboard", label: item.label || item.nome || item.id || "Menu" };
    }).filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }).map((item) => {
      const meta = MENU_ITEM_META[item.id] || {};
      return {
        id: item.id,
        label: meta.label || item.label,
        icon: meta.icon || item.icon || viewIcon(item.id),
        group: meta.group || navGroupForView(item.id)
      };
    });
  }

  function groupedMenu() {
    const groups = MENU_GROUPS.map((group) => ({ ...group, items: [] }));
    const map = Object.fromEntries(groups.map((group) => [group.id, group]));
    normalizedMenu().forEach((item) => {
      const group = map[item.group || navGroupForView(item.id)] || map.sistema;
      if (!group.items.some((existing) => existing.id === item.id)) group.items.push(item);
    });
    return groups
      .map((group) => ({
        ...group,
        view: group.items.some((item) => item.id === group.preferredView)
          ? group.preferredView
          : (group.items[0] && group.items[0].id) || ""
      }))
      .filter((group) => group.items.length);
  }

  function menuGroup(group) {
    const active = group.items.some((item) => item.id === state.view) || group.view === state.view ? "active" : "";
    const mainView = group.view || (group.items && group.items.length ? group.items[0].id : "dashboard");
    return `
      <div class="nav-group ${active}">
        <button
          class="nav-head ${active}"
          type="button"
          data-view="${escapeAttr(mainView)}"
          title="${escapeAttr(group.label)}"
          aria-label="${escapeAttr(group.label)}"
        >
          ${matIcon(group.icon)}
          <span>${escapeHtml(group.label)}</span>
        </button>
        <div class="nav-sub">
          ${group.items.map((item) => menuButton(item)).join("")}
        </div>
      </div>
    `;
  }

  function renderChecklists() {
    const refs = state.data.referencias;
    const modelos = refs.checklist_modelos || [];
    const modeloItens = refs.checklist_modelo_itens || [];
    return `
      ${viewHeader()}
      <div class="checklist-workspace">
        <div class="checklist-main-column">
          ${can("editar_checklist_padrao") ? renderChecklistModelForm() : ""}
          ${renderChecklistModelManager(modelos, modeloItens)}
        </div>
        <aside class="checklist-side-column">
          ${renderChecklistExecutionList(state.data.checklist)}
        </aside>
      </div>
    `;
  }

  function renderChecklistModelForm() {
    const modelos = (state.data.referencias && state.data.referencias.checklist_modelos) || [];
    const nextVersion = nextChecklistModelVersion(modelos, "");
    return `
      <details class="panel checklist-builder checklist-create-panel" open>
        <summary class="builder-summary">
          <span>
            <strong>Modelos de Checklist</strong>
            <small>Crie padroes tecnicos reutilizaveis para ordens de servico.</small>
          </span>
          <b data-checklist-mode-label>Novo modelo</b>
        </summary>
        <form id="checklist-model-form" class="form-grid checklist-model-form checklist-editor-panel">
          <div class="checklist-main-column">
            <input type="hidden" name="id" value="">
            <input type="hidden" name="versao" value="${escapeAttr(nextVersion)}" data-field="model-version">
            <div class="builder-steps">
            <article class="builder-step">
              <span>1</span>
              <div>
                <strong>Identificacao</strong>
                <label>Nome do modelo
                  <input name="nome" data-field="model-name" required placeholder="Ex.: Preventiva de envasadora">
                </label>
              </div>
            </article>
            <article class="builder-step">
              <span>2</span>
              <div>
                <strong>Tipo de OS</strong>
                <div class="two-col">
                  <label>Tipo principal
                    <select name="tipo_os" data-field="model-type" required>
                      <option>Corretiva</option>
                      <option>Preventiva</option>
                      <option>Inspecao</option>
                      <option>Emergencial</option>
                      <option value="OUTRO">Outro tipo</option>
                    </select>
                  </label>
                  <label>Novo tipo, se necessario
                    <input name="tipo_os_custom" data-field="model-type-custom" placeholder="Ex.: Lubrificacao">
                  </label>
                </div>
                <div class="model-meta-strip">
                  <span>Versao automatica: <strong data-model-version-label>${escapeHtml(nextVersion)}</strong></span>
                  <label class="switch-cell compact">
                    <input type="checkbox" name="status_toggle" checked>
                    <span>Modelo ativo</span>
                  </label>
                </div>
              </div>
            </article>
            <article class="builder-step">
              <span>3</span>
              <div>
                <strong>Itens tecnicos</strong>
                <p class="muted">Comece com um item e adicione quantos forem necessarios. A ordem salva vira a ordem operacional.</p>
                <div class="checklist-model-grid" data-checklist-model-list>
                  ${renderChecklistModelItemRow(1, { pergunta: "", obrigatorio: true, tipo_resposta: "OK_NOK", evidencia_regra: "SE_NOK", observacao_regra: "SE_NOK" })}
                </div>
                <button class="ghost-action add-inline-action" type="button" data-action="add-checklist-model-item">+ Item</button>
              </div>
            </article>
            </div>
          </div>
          <div class="checklist-side-column checklist-form-actions">
            <div class="action-card">
              <strong>Publicacao do modelo</strong>
              <p class="muted">Revise identificacao, regras tecnicas e itens antes de salvar.</p>
              <button class="primary-action" type="submit">Salvar modelo</button>
            </div>
          </div>
        </form>
      </details>
    `;
  }
```
