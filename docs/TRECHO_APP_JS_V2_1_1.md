# Trechos app.js V2.1.1

```js
  function quickActionItems() {
    const perfil = state.session.perfil;
    const device = isMobileShell() ? "mobile" : "desktop";
    const catalog = [
      { label: "Minhas OS", icon: "assignment", view: "minhas-os", profiles: ["Operador"], devices: ["desktop", "mobile"], module: "os", permission: "os.listar" },
      { label: "Checklist pendente", icon: "fact_check", view: "minhas-os", profiles: ["Operador"], devices: ["desktop", "mobile"], module: "checklists", permission: "checklist.salvar" },
      { label: "Alertas", icon: "notifications", view: "notificacoes", profiles: ["Operador"], devices: ["desktop"], module: "eventos", permission: "eventos.listar" },
      { label: "Atualizar", icon: "sync", action: "refresh", profiles: ["Operador", "Gestor", "Admin"], devices: ["desktop", "mobile"] },
      { label: "Criar OS", icon: "add_task", action: "toggle-create-os", view: "gestao-os", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "os", permission: "os.criar" },
      { label: "Atribuir técnico", icon: "engineering", view: "gestao-os", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "os", permission: "os.salvar" },
      { label: "Fila de aprovação", icon: "approval", view: "acompanhamento", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "os", permission: "os.aprovar" },
      { label: "Programar preventiva", icon: "event_note", view: "programacao", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "pcm", permission: "os.salvar" },
      { label: "Indicadores", icon: "query_stats", view: "relatorios-gerais", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "relatorios" },
      { label: "Usuários", icon: "group", view: "usuarios", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "usuarios", permission: "usuarios.salvar" },
      { label: "Permissões", icon: "shield_person", view: "permissoes", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "permissoes", permission: "permissoes.salvar" },
      { label: "Auditoria", icon: "manage_search", view: "auditoria", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "auditoria" },
      { label: "Backup", icon: "backup", view: "backup", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "sistema" },
      { label: "Versionamento", icon: "deployed_code_history", view: "versionamento", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "sistema" }
    ];
    return catalog.filter((item) => canShowVisualAction(item, perfil, device));
  }


  function canShowVisualAction(action, perfil, device) {
    const profiles = action.profiles || ["Operador", "Gestor", "Admin"];
    const devices = action.devices || ["desktop", "mobile"];
    if (!profiles.includes(perfil)) return false;
    if (!devices.includes(device)) return false;
    if (action.permission && !can(action.permission)) return false;
    if (action.module && !isVisualModuleEnabled(action.module, perfil, device)) return false;
    return true;
  }


  function renderQuickPanel(notificationItems, notificationCount) {
    const critical = notificationItems.filter((item) => ["critico", "critical", "red"].includes(String(item.severity || "").toLowerCase())).length;
    return `
      <aside class="quick-panel ${state.quickPanelOpen ? "is-open" : "is-collapsed"}" aria-label="Painel de acoes rapidas">
        <div class="quick-panel-head">
          <div>
            <small>Painel operacional</small>
            <strong>Ações rápidas</strong>
          </div>
          <div class="quick-panel-head-actions">
            <button class="icon-action" type="button" data-action="configure-quick-actions" aria-label="Editar ações rápidas" title="Editar ações rápidas">
              ${matIcon("tune")}
            </button>
            <button class="icon-action" type="button" data-action="toggle-quick-panel" aria-label="Recolher painel direito" aria-expanded="${state.quickPanelOpen ? "true" : "false"}">
              ${matIcon(state.quickPanelOpen ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left")}
            </button>
          </div>
        </div>
        <div class="quick-panel-collapsed-actions" aria-hidden="${state.quickPanelOpen ? "true" : "false"}">
          <button class="icon-action" type="button" data-action="toggle-quick-panel" title="Abrir ações rápidas">${matIcon("bolt")}</button>
        </div>
        <div class="quick-panel-body">
          <section class="quick-panel-section">
            <div class="section-title-row">
              <strong>Atalhos</strong>
              <span>${escapeHtml(state.session.perfil)}</span>
            </div>
            <div class="quick-panel-actions">
              ${quickActionItems().map((item) => quickPanelButton(item)).join("")}
            </div>
          </section>
          <section class="quick-panel-section">
            <div class="section-title-row">
              <strong>Notificacoes</strong>
              <span>${notificationCount}</span>
            </div>
            ${notificationItems.slice(0, 4).map((item) => `
              <button class="quick-notification ${escapeAttr(item.severity || "")}" type="button" data-view="notificacoes">
                <strong>${escapeHtml(item.title || item.titulo || "Evento")}</strong>
                <small>${escapeHtml(item.detail || item.descricao || "Abrir central de eventos")}</small>
              </button>
            `).join("") || `<div class="empty-state small">Sem eventos criticos no momento.</div>`}
          </section>
          <section class="quick-panel-section compact">
            <div class="quick-panel-kpis">
              <div><strong>${notificationCount}</strong><span>eventos</span></div>
              <div><strong>${critical}</strong><span>criticos</span></div>
            </div>
          </section>
        </div>
      </aside>
    `;
  }


  function renderPermissoes() {
    const matrix = state.session.matriz_permissoes || (window.SCSMockApi ? window.SCSMockApi.PERMISSOES : { [state.session.perfil]: state.session.permissoes });
    const modules = getModuleRows();
    return `
      ${viewHeader()}
      <form id="modules-form" class="permissions-form modules-admin-form">
        <section class="panel modules-admin-hero">
          <div class="panel-head">
            <div>
              <h3>Módulos por perfil e dispositivo</h3>
              <p class="muted">Controle visual do que aparece para Operador, Gestor/PCM e Admin em desktop, mobile, menu, bottom nav e ações rápidas.</p>
            </div>
            <span class="tag red">Admin</span>
          </div>
          <div class="module-governance-summary">
            <div><strong>3</strong><span>perfis</span></div>
            <div><strong>2</strong><span>dispositivos</span></div>
            <div><strong>5</strong><span>exibições</span></div>
          </div>
        </section>
        <section class="module-device-map">
          ${renderModuleDeviceColumn("Operador", "Mobile prioritário", ["Início", "Minhas OS", "QR Code", "Checklist", "Alertas", "Configurações"])}
          ${renderModuleDeviceColumn("Gestor/PCM", "Mobile e desktop", ["OS", "Aprovações", "Programação", "Backlog", "Indicadores", "Relatórios"])}
          ${renderModuleDeviceColumn("Admin", "Governança", ["Usuários", "Permissões", "Módulos", "Workflow", "Auditoria", "Backup"])}
        </section>
        <section class="module-board module-board-v211">
          ${modules.map((module) => renderModuleCard(module, matrix)).join("")}
        </section>
        <div class="sticky-actions">
          <button class="primary-action" type="submit">Salvar módulos</button>
        </div>
      </form>
    `;
  }

```
