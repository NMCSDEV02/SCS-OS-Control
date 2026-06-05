(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const app = document.getElementById("app");
  const sessionKey = "scs-os-control-session";
  const quickActionsKey = "scs-os-control-quick-actions-v3";
  const dropzoneModulesKey = "scs-os-control-dropzone-modules-v1";
  const dropzoneCollapsedKey = "scs-os-control-dropzone-collapsed-v1";

  function loadQuickActionsSelection() {
    try {
      const raw = localStorage.getItem(quickActionsKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function saveQuickActionsSelection(selection) {
    try {
      localStorage.setItem(quickActionsKey, JSON.stringify(selection || []));
    } catch (error) {
      // configuração visual local; falha de storage não deve quebrar operação
    }
  }

  function loadDropzoneModules() {
    try {
      const raw = localStorage.getItem(dropzoneModulesKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function saveDropzoneModules(selection) {
    try {
      localStorage.setItem(dropzoneModulesKey, JSON.stringify(selection || []));
    } catch (error) {
      // estado visual local; falha de storage não deve bloquear operação
    }
  }

  function loadDropzoneCollapsed() {
    try {
      const raw = localStorage.getItem(dropzoneCollapsedKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveDropzoneCollapsed(map) {
    try {
      localStorage.setItem(dropzoneCollapsedKey, JSON.stringify(map || {}));
    } catch (error) {
      // estado visual local; falha de storage não deve bloquear operação
    }
  }


  const state = {
    session: null,
    data: null,
    view: "dashboard",
    selectedOsId: "",
    lastListView: "dashboard",
    cadastroTab: "plantas",
    statusFilter: "",
    search: "",
    osQuickFilter: "",
    qualityFilter: "",
    createOsPrefillAtivoId: "",
    menuOpen: (typeof window !== "undefined" ? window.matchMedia("(min-width: 841px)").matches : true),
    quickPanelOpen: true,
    quickActionsConfigOpen: false,
    quickActionsSelection: loadQuickActionsSelection(),
    dropzoneEditMode: false,
    dropzoneModules: loadDropzoneModules(),
    dropzoneCollapsed: loadDropzoneCollapsed(),
    navGroupsOpen: {},
    mobileQuickOpen: false,
    qrStream: null,
    qrScanTimer: null,
    qrManualOpen: false,
    qrTimeoutId: null,
    qrCountdownTimer: null,
    qrScanDeadline: 0,
    eventTagFilter: "todos",
    dataLoadMode: ""
  };

  const STATUS_LABEL = {
    RASCUNHO: "Rascunho",
    PLANEJADA: "Planejada",
    LIBERADA: "Liberada",
    EM_EXECUCAO: "Em execução",
    AGUARDANDO_APROVACAO: "Aguardando aprovação",
    CONCLUIDA: "Concluída",
    AGUARDANDO_PECA: "Aguardando peça",
    AGUARDANDO_LIBERACAO: "Aguardando liberação",
    REABERTA: "Reaberta",
    CANCELADA: "Cancelada"
  };

  const STATUS_CLASS = {
    RASCUNHO: "",
    PLANEJADA: "blue",
    LIBERADA: "blue",
    EM_EXECUCAO: "amber",
    AGUARDANDO_APROVACAO: "amber",
    CONCLUIDA: "green",
    AGUARDANDO_PECA: "amber",
    AGUARDANDO_LIBERACAO: "amber",
    REABERTA: "red",
    CANCELADA: "red"
  };

  const EVENT_TAGS = [
    { id: "todos", label: "Todos", detail: "Eventos do perfil" },
    { id: "sla", label: "SLA", detail: "Atrasos e risco de prazo" },
    { id: "aprovacao", label: "Aprovação", detail: "Decisões pendentes" },
    { id: "checklist", label: "Checklist", detail: "Itens, evidências e validações" },
    { id: "operacao", label: "Operação", detail: "Status e execução de OS" },
    { id: "tecnico", label: "Técnico", detail: "Parâmetros, QR e ativo" },
    { id: "sistema", label: "Sistema", detail: "Governança e versão" }
  ];

  const VIEW_TITLES = {
    dashboard: ["Centro Operacional", "Indicadores, alertas e próximas ações por perfil"],
    "minhas-os": ["Execução Técnica", "Ordens atribuídas, pendências e prioridades do responsável"],
    "gestao-os": ["Ordens de Serviço", "Criação, atribuição e acompanhamento operacional"],
    programacao: ["Programação", "Planejamento, liberação e prazos de manutenção"],
    acompanhamento: ["Aprovações", "Decisoes pendentes, atrasos e liberacoes"],
    relatorios: ["Indicadores", "Metricas derivadas do historico operacional"],
    equipamentos: ["Ativos Industriais", "Ativos, componentes, criticidade e QR Code"],
    "qualidade-tecnica": ["Qualidade Técnica", "Controle de qualidade técnica da execução"],
    checklists: ["Modelos de Checklist", "Crie, versione e publique padrões técnicos reutilizáveis para ordens de serviço."],
    "usuarios-view": ["Consulta de Usuários", "Consulta de identidades por perfil e status"],
    usuarios: ["Usuários", "Criar, editar e desativar identidades de acesso"],
    permissoes: ["Perfis e Permissões", "Matriz de acesso por perfil e módulo"],
    cadastros: ["Cadastros Operacionais", "Plantas, setores, linhas, equipamentos e componentes"],
    configuracoes: ["Workflow", "Transições oficiais, estados da OS e regras operacionais de aprovação"],
    auditoria: ["Auditoria e Logs", "Trilha de auditoria do sistema"],
    backup: ["Backup", "Exportar, restaurar e validar base local"],
    integracoes: ["Integrações", "Conectores, URLs e tokens de frontend"],
    versionamento: ["Versionamento", "Histórico técnico das entregas, schema e endpoints"],
    "relatorios-gerais": ["Relatórios Gerenciais", "Consolidação executiva de performance, backlog e qualidade operacional"],
    "historico-pessoal": ["Histórico Técnico", "Memória operacional das OS do usuário"],
    comunicacoes: ["Comunicacoes Operacionais", "Alertas e eventos das OS"],
    "meu-perfil": ["Perfil Operacional", "Dados da sessao atual"],
    "os-detalhe": ["Detalhes da OS", "Execução, checklist, histórico e aprovação"],
    "qr-code": ["QR Code", "Identificação do ativo e ações permitidas"],
    notificacoes: ["Não Conformidades", "Alertas, eventos e pendências críticas"],
    "checklist-execucoes": ["Checklists Ativos", "Execuções, pendências e evidências dos checklists vinculados a OS"],
    "validacao-tecnica": ["Validação Técnica", "Conferência técnica e validação de evidências obrigatórias"],
    componentes: ["Componentes", "Componentes industriais vinculados a ativos e histórico técnico"],
    "acompanhamento-ativos": ["Acompanhamento", "Monitoramento visual de ativos, linhas, setores e componentes"],
    backlog: ["Backlog", "Fila de manutenções pendentes, planejadas e em priorização"],
    modulos: ["Módulos", "Disponibilidade visual por perfil, dispositivo e tipo de exibição"]
  };

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("keydown", onKeyDown);
  app.addEventListener("click", onClick);
  app.addEventListener("submit", onSubmit);
  app.addEventListener("input", onInput);
  app.addEventListener("change", onChange);
  window.addEventListener("resize", () => prepareMobileAdaptiveSections(document.getElementById("content") || document));

  async function init() {
    const raw = sessionStorage.getItem(sessionKey);
    if (raw) {
      try {
        state.session = JSON.parse(raw);
        await bootstrapSession();
        state.data = emptyOperationalData();
        state.dataLoadMode = "bootstrap";
        renderShell();
        return;
      } catch (error) {
        sessionStorage.removeItem(sessionKey);
      }
    }
    renderLogin();
  }

  function renderLogin() {
    document.body.classList.remove("is-authenticated");
    document.body.classList.add("is-login");
    safeScrollTop();
    const template = document.getElementById("login-template");
    app.innerHTML = "";
    app.appendChild(template.content.cloneNode(true));
    const email = app.querySelector("#login-email");
    if (email) email.focus();
  }

  async function login(email, senha) {
    const data = await window.SCSApi.call("auth.login", { email, senha });
    state.session = data;
    sessionStorage.setItem(sessionKey, JSON.stringify(data));
    await bootstrapSession();
    state.view = "dashboard";
    state.data = emptyOperationalData();
    state.dataLoadMode = "bootstrap";
    renderShell();
  }

  function logout() {
    state.session = null;
    state.data = null;
    state.view = "dashboard";
    state.selectedOsId = "";
    state.menuOpen = (typeof window !== "undefined" ? window.matchMedia("(min-width: 841px)").matches : true);
    state.quickPanelOpen = true;
    state.mobileQuickOpen = false;
    state.qrManualOpen = false;
    state.dataLoadMode = "";
    sessionStorage.removeItem(sessionKey);
    renderLogin();
  }

  async function bootstrapSession() {
    if (!state.session || !state.session.token) return;
    try {
      const boot = await window.SCSApi.call("sistema.bootstrap", { token: state.session.token }, "GET");
      state.session = { ...state.session, ...boot };
      sessionStorage.setItem(sessionKey, JSON.stringify(state.session));
    } catch (error) {
      // Compatibilidade com APIs antigas: auth.login ja retorna o minimo necessario.
    }
  }

  async function refreshData(options) {
    if (!state.session) return;
    const opts = options || {};
    const include = opts.include || "resumo";
    const payload = {
      token: state.session.token,
      limit: opts.limit || 30,
      offset: opts.offset || 0,
      include
    };
    ["status", "perfil", "responsavel", "setor", "ativo_id", "id_os"].forEach((key) => {
      if (opts[key]) payload[key] = opts[key];
    });
    state.data = await window.SCSApi.call("os.listar", payload, "GET");
    state.dataLoadMode = include;
  }

  async function loadOsDetail(id) {
    if (!state.session || !id) return;
    const detail = await window.SCSApi.call("os.listar", {
      token: state.session.token,
      id_os: id,
      limit: 1,
      offset: 0,
      include: "detalhe"
    }, "GET");
    mergeOperationalData(detail);
  }

  function mergeOperationalData(nextData) {
    if (!state.data) {
      state.data = nextData;
      return;
    }
    ["ordens", "checklist", "historico", "eventos", "anexos"].forEach((key) => {
      const current = state.data[key] || [];
      const incoming = nextData[key] || [];
      const byId = new Map(current.map((item) => [item.id || `${item.os_id}-${item.data_hora || item.pergunta || ""}`, item]));
      incoming.forEach((item) => byId.set(item.id || `${item.os_id}-${item.data_hora || item.pergunta || ""}`, item));
      state.data[key] = Array.from(byId.values());
    });
    state.data.referencias = mergeReferences(state.data.referencias || {}, nextData.referencias || {});
    state.data.dashboard = nextData.dashboard || state.data.dashboard;
    state.data.paginacao = nextData.paginacao || state.data.paginacao;
  }

  function mergeReferences(current, incoming) {
    const merged = { ...current };
    Object.keys(incoming).forEach((key) => {
      if (Array.isArray(incoming[key])) {
        const existing = Array.isArray(merged[key]) ? merged[key] : [];
        const byId = new Map(existing.map((item) => [item.id || JSON.stringify(item), item]));
        incoming[key].forEach((item) => byId.set(item.id || JSON.stringify(item), item));
        merged[key] = Array.from(byId.values());
      } else if (incoming[key] !== undefined) {
        merged[key] = incoming[key];
      }
    });
    return merged;
  }


  function emptyOperationalData() {
    return {
      ordens: [],
      checklist: [],
      historico: [],
      eventos: [],
      anexos: [],
      referencias: {
        plantas: [], setores: [], linhas: [], equipamentos: [], componentes: [],
        parametros_equipamento: [], leituras_parametros: [], historico_componentes: [],
        versionamento: [], modulos: [], modulo_perfis: [], definicoes_modulos: [],
        checklist_modelos: [], checklist_modelo_itens: [], workflow_regras: [],
        workflow_acoes: [], usuarios: [], status_fluxo: []
      },
      dashboard: {},
      paginacao: { limit: 0, offset: 0, total: 0, returned: 0 },
      include: "bootstrap"
    };
  }

  function viewNeedsOsSummary(view) {
    return ["minhas-os", "gestao-os", "programacao", "acompanhamento", "relatorios", "relatorios-gerais", "notificacoes", "qualidade-tecnica", "checklist-execucoes", "validacao-tecnica", "acompanhamento-ativos"].includes(view);
  }

  function viewNeedsFullReferences(view) {
    return ["equipamentos", "componentes", "cadastros", "checklists", "qualidade-tecnica", "checklist-execucoes", "validacao-tecnica", "usuarios-view", "usuarios", "permissoes", "modulos", "configuracoes", "backup", "versionamento", "qr-code"].includes(view);
  }

  function ensureDataForView(view) {
    if (viewNeedsFullReferences(view) && state.dataLoadMode !== "referencias") {
      return refreshData({ include: "referencias", limit: 30, offset: 0 });
    }
    if (viewNeedsOsSummary(view) && state.dataLoadMode === "bootstrap") {
      return refreshData({ include: "resumo", limit: 30, offset: 0 });
    }
    return Promise.resolve();
  }


  function matIcon(name) {
    return `<span class="material-symbols-rounded" aria-hidden="true">${escapeHtml(name)}</span>`;
  }

  function renderStatusSwitch(status, options = {}) {
    const normalized = String(status || "ATIVO").toUpperCase() === "INATIVO" ? "INATIVO" : "ATIVO";
    const isOn = normalized !== "INATIVO";
    const label = options.label || (isOn ? "Ativo" : "Inativo");
    const disabled = options.disabled ? "disabled" : "";
    const action = options.action ? ` data-action="${escapeAttr(options.action)}"` : "";
    const data = options.data || "";
    const title = options.title || label;
    return `
      <button class="status-switch ${isOn ? "is-on" : "is-off"} ${disabled ? "is-disabled" : ""}" type="button"${action}${data} ${disabled} title="${escapeAttr(title)}" aria-label="Status: ${escapeAttr(label)}" aria-pressed="${isOn ? "true" : "false"}">
        <span class="status-switch-track" aria-hidden="true"><span class="status-switch-thumb"></span></span>
        <span class="status-switch-label">${escapeHtml(label)}</span>
      </button>
    `;
  }

  function renderWorkflowStatusToggle(regra, index) {
    const active = String(regra.status || "ATIVO").toUpperCase() !== "INATIVO";
    return `
      <label class="status-switch-field workflow-status-toggle" title="Status do fluxo">
        <input type="hidden" name="status_${index}" data-workflow-field="status" value="${active ? "ATIVO" : "INATIVO"}">
        <input type="checkbox" data-workflow-status-toggle ${active ? "checked" : ""}>
        <span class="status-switch ${active ? "is-on" : "is-off"}">
          <span class="status-switch-track" aria-hidden="true"><span class="status-switch-thumb"></span></span>
          <span class="status-switch-label">${active ? "Ativo" : "Inativo"}</span>
        </span>
      </label>
    `;
  }

  const MENU_GROUPS = [
    { id: "operacoes", label: "Operacoes", icon: "precision_manufacturing" },
    { id: "qualidade", label: "Qualidade Técnica", icon: "fact_check" },
    { id: "ativos", label: "Ativos e Rastreabilidade", icon: "qr_code_scanner" },
    { id: "pcm", label: "PCM e Performance", icon: "monitoring" },
    { id: "governanca", label: "Governança", icon: "admin_panel_settings" },
    { id: "sistema", label: "Administração", icon: "settings" }
  ];

  const MENU_ORDER = {
    operacoes: ["dashboard", "gestao-os", "minhas-os", "acompanhamento", "comunicacoes"],
    qualidade: ["qualidade-tecnica", "checklists", "checklist-execucoes", "validacao-tecnica", "notificacoes"],
    ativos: ["qr-code", "equipamentos", "componentes", "historico-pessoal", "acompanhamento-ativos"],
    pcm: ["programacao", "backlog", "relatorios", "relatorios-gerais"],
    governanca: ["usuarios", "permissoes", "modulos", "cadastros", "configuracoes"],
    sistema: ["auditoria", "backup", "integracoes", "versionamento", "meu-perfil"]
  };

  const MENU_ITEM_META = {
    dashboard: { label: "Centro Operacional", icon: "dashboard", group: "operacoes", profiles: ["Operador", "Gestor", "Admin"] },
    "gestao-os": { label: "Ordens de Serviço", icon: "assignment", group: "operacoes", profiles: ["Gestor", "Admin"] },
    "minhas-os": { label: "Execução Técnica", icon: "task_alt", group: "operacoes", profiles: ["Operador", "Gestor", "Admin"] },
    acompanhamento: { label: "Aprovações", icon: "approval", group: "operacoes", profiles: ["Gestor", "Admin"] },
    comunicacoes: { label: "Comunicacoes Operacionais", icon: "campaign", group: "operacoes", profiles: ["Operador", "Gestor", "Admin"] },
    "qualidade-tecnica": { label: "Qualidade Técnica", icon: "fact_check", group: "qualidade", profiles: ["Operador", "Gestor", "Admin"] },
    checklists: { label: "Modelos de Checklist", icon: "checklist", group: "qualidade", profiles: ["Gestor", "Admin"] },
    "checklist-execucoes": { label: "Checklists Ativos", icon: "rule", group: "qualidade", profiles: ["Operador", "Gestor", "Admin"] },
    "validacao-tecnica": { label: "Validação Técnica", icon: "verified", group: "qualidade", profiles: ["Gestor", "Admin"] },
    notificacoes: { label: "Não Conformidades", icon: "report_problem", group: "qualidade", profiles: ["Operador", "Gestor", "Admin"] },
    "qr-code": { label: "QR Code", icon: "qr_code_2", group: "ativos", profiles: ["Operador", "Gestor", "Admin"] },
    equipamentos: { label: "Ativos Industriais", icon: "precision_manufacturing", group: "ativos", profiles: ["Gestor", "Admin"] },
    componentes: { label: "Componentes", icon: "settings_applications", group: "ativos", profiles: ["Gestor", "Admin"] },
    "historico-pessoal": { label: "Histórico Técnico", icon: "history", group: "ativos", profiles: ["Operador", "Gestor", "Admin"] },
    "acompanhamento-ativos": { label: "Acompanhamento", icon: "visibility", group: "ativos", profiles: ["Gestor", "Admin"] },
    programacao: { label: "Programação", icon: "event_note", group: "pcm", profiles: ["Gestor", "Admin"] },
    backlog: { label: "Backlog", icon: "pending_actions", group: "pcm", profiles: ["Gestor", "Admin"] },
    relatorios: { label: "Indicadores", icon: "query_stats", group: "pcm", profiles: ["Gestor", "Admin"] },
    "relatorios-gerais": { label: "Relatórios Gerenciais", icon: "bar_chart", group: "pcm", profiles: ["Gestor", "Admin"] },
    usuarios: { label: "Usuários", icon: "group", group: "governanca", profiles: ["Admin"] },
    "usuarios-view": { label: "Consulta de Usuários", icon: "group", group: "governanca", profiles: ["Gestor", "Admin"] },
    permissoes: { label: "Perfis e Permissões", icon: "shield_person", group: "governanca", profiles: ["Admin"] },
    modulos: { label: "Módulos", icon: "widgets", group: "governanca", profiles: ["Admin"] },
    cadastros: { label: "Cadastros Operacionais", icon: "inventory_2", group: "governanca", profiles: ["Admin"] },
    configuracoes: { label: "Workflow", icon: "account_tree", group: "governanca", profiles: ["Admin"] },
    auditoria: { label: "Auditoria e Logs", icon: "manage_search", group: "sistema", profiles: ["Admin"] },
    backup: { label: "Backup", icon: "backup", group: "sistema", profiles: ["Admin"] },
    integracoes: { label: "Integrações", icon: "hub", group: "sistema", profiles: ["Admin"] },
    versionamento: { label: "Versionamento", icon: "deployed_code_history", group: "sistema", profiles: ["Admin"] },
    "meu-perfil": { label: "Perfil Operacional", icon: "account_circle", group: "sistema", profiles: ["Operador", "Gestor", "Admin"] },
    sair: { label: "Sair", icon: "logout", group: "sistema", profiles: ["Operador", "Gestor", "Admin"] }
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

  function systemConnectivity() {
    const config = window.SCS_CONFIG || {};
    const hasApi = Boolean(config.apiUrl);
    const mode = state.dataLoadMode || "login";
    if (hasApi) {
      return {
        label: "API real",
        className: "online",
        title: `Google Apps Script ativo. Modo de carregamento: ${mode}.`
      };
    }
    return {
      label: "Mock local",
      className: "local",
      title: `Base local do navegador. Modo de carregamento: ${mode}.`
    };
  }

  function groupedMenu() {
    const groups = MENU_GROUPS.map((group) => ({ ...group, items: [] }));
    const map = Object.fromEntries(groups.map((group) => [group.id, group]));
    const sessionItems = normalizedMenu();
    const byId = Object.fromEntries(sessionItems.map((item) => [item.id, item]));
    const perfil = state.session && state.session.perfil ? state.session.perfil : "Operador";

    Object.entries(MENU_ORDER).forEach(([groupId, ids]) => {
      const group = map[groupId] || map.sistema;
      ids.forEach((id) => {
        const meta = MENU_ITEM_META[id];
        if (!meta || !canShowMenuItem(meta, perfil)) return;
        const source = byId[id] || { id };
        if (!group.items.some((existing) => existing.id === id)) {
          group.items.push({
            id,
            label: meta.label || source.label || id,
            icon: meta.icon || source.icon || viewIcon(id),
            group: meta.group || groupId
          });
        }
      });
    });

    sessionItems.filter((item) => item.id !== "sair").forEach((item) => {
      const group = map[item.group || navGroupForView(item.id)] || map.sistema;
      if (!group.items.some((existing) => existing.id === item.id)) group.items.push(item);
    });

    return groups.filter((group) => group.items.length);
  }

  function canShowMenuItem(meta, perfil) {
    const profiles = meta.profiles || ["Operador", "Gestor", "Admin"];
    return profiles.includes(perfil);
  }

  function centerNavItems() {
    const osView = state.session.perfil === "Operador" ? "minhas-os" : "gestao-os";
    const base = [
      { id: "dashboard", label: "Centro Operacional", icon: "dashboard" },
      { id: osView, label: "Ordens de Serviço", icon: "assignment" },
      { id: "qualidade-tecnica", label: "Qualidade Técnica", icon: "fact_check" },
      { id: "qr-code", label: "Rastreabilidade", icon: "qr_code_scanner" },
      {
        id: state.session.perfil === "Operador" ? "notificacoes" : "relatorios-gerais",
        label: state.session.perfil === "Operador" ? "Não Conformidades" : "Performance",
        icon: state.session.perfil === "Operador" ? "report_problem" : "monitoring"
      }
    ];
    const menuIds = normalizedMenu().map((item) => item.id);
    return base.filter((item) => item.id === "dashboard" || item.id === osView || menuIds.includes(item.id) || item.id === "qualidade-tecnica" || item.id === "notificacoes" || item.id === "relatorios-gerais");
  }

  function quickActionCatalog() {
    return [
      { id: "minhas-os", label: "Minhas OS", icon: "assignment", view: "minhas-os", profiles: ["Operador"], devices: ["desktop", "mobile"], module: "os", permission: "os.listar" },
      { id: "checklist-pendente", label: "Checklist", icon: "fact_check", view: "minhas-os", profiles: ["Operador"], devices: ["desktop", "mobile"], module: "checklists", permission: "checklist.salvar" },
      { id: "scanner-qr", label: "Scanner QR", icon: "qr_code_scanner", view: "qr-code", profiles: ["Operador", "Gestor", "Admin"], devices: ["desktop", "mobile"], module: "ativos" },
      { id: "evidencias", label: "Evidências", icon: "photo_camera", view: "qualidade-tecnica", profiles: ["Operador", "Gestor", "Admin"], devices: ["desktop", "mobile"], module: "checklists", permission: "checklist.salvar" },
      { id: "alertas", label: "Alertas", icon: "notifications", view: "notificacoes", profiles: ["Operador"], devices: ["desktop"], module: "eventos", permission: "eventos.listar" },
      { id: "atualizar", label: "Atualizar", icon: "sync", action: "refresh", profiles: ["Operador", "Gestor", "Admin"], devices: ["desktop", "mobile"] },
      { id: "criar-os", label: "Criar OS", icon: "add_task", action: "toggle-create-os", view: "gestao-os", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "os", permission: "os.criar" },
      { id: "atribuir-tecnico", label: "Tarefas", icon: "engineering", view: "gestao-os", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "os", permission: "os.salvar" },
      { id: "fila-aprovacao", label: "Aprovações", icon: "approval", view: "acompanhamento", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "os", permission: "os.aprovar" },
      { id: "programar-preventiva", label: "Preventiva", icon: "event_note", view: "programacao", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "pcm", permission: "os.salvar" },
      { id: "indicadores", label: "Indicadores", icon: "query_stats", view: "relatorios", profiles: ["Gestor", "Admin"], devices: ["desktop", "mobile"], module: "relatorios" },
      { id: "usuarios", label: "Usuários", icon: "group", view: "usuarios", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "usuarios", permission: "usuarios.salvar" },
      { id: "permissoes", label: "Permissões", icon: "shield_person", view: "permissoes", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "permissoes", permission: "permissoes.salvar" },
      { id: "auditoria", label: "Auditoria", icon: "manage_search", view: "auditoria", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "auditoria" },
      { id: "backup", label: "Backup", icon: "backup", view: "backup", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "sistema" },
      { id: "versionamento", label: "Versionamento", icon: "deployed_code_history", view: "versionamento", profiles: ["Admin"], devices: ["desktop", "mobile"], module: "sistema" }
    ];
  }

  function eligibleQuickActions() {
    const perfil = state.session.perfil;
    const device = isMobileShell() ? "mobile" : "desktop";
    return quickActionCatalog().filter((item) => canShowVisualAction(item, perfil, device));
  }

  function quickActionItems() {
    const eligible = eligibleQuickActions();
    const selected = Array.isArray(state.quickActionsSelection) ? state.quickActionsSelection : [];
    if (!selected.length) return eligible;
    const selectedSet = new Set(selected);
    const filtered = eligible.filter((item) => selectedSet.has(item.id));
    return filtered.length ? filtered : eligible;
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

  function isVisualModuleEnabled(moduleId, perfil, device) {
    const refs = (state.data && state.data.referencias) || {};
    const modules = refs.modulos || [];
    const row = modules.find((item) => String(item.id || item.modulo_id || "").toLowerCase() === String(moduleId || "").toLowerCase());
    if (row && String(row.status || "ATIVO").toUpperCase() === "INATIVO") return false;
    const profileRows = refs.modulo_perfis || [];
    const access = profileRows.find((item) => String(item.modulo_id || "").toLowerCase() === String(moduleId || "").toLowerCase() && item.perfil === perfil);
    if (access && access.liberado !== undefined && !asBool(access.liberado)) return false;
    const deviceKey = device === "mobile" ? "mobile_habilitado" : "desktop_habilitado";
    if (access && access[deviceKey] !== undefined && !asBool(access[deviceKey])) return false;
    return true;
  }

  function quickActionButton(item) {
    const attr = item.action
      ? `data-action="${escapeAttr(item.action)}" data-view-target="${escapeAttr(item.view || "")}"`
      : `data-view="${escapeAttr(item.view)}"`;
    return `<button type="button" ${attr}>${matIcon(item.icon)}<span>${escapeHtml(item.label)}</span></button>`;
  }

  function centerNavButton(item) {
    const active = item.id === state.view || (item.id === "gestao-os" && ["programacao", "acompanhamento"].includes(state.view)) ? "active" : "";
    return `
      <button class="center-nav-button ${active}" type="button" data-view="${escapeAttr(item.id)}" title="${escapeAttr(item.label)}" aria-label="${escapeAttr(item.label)}">
        ${matIcon(item.icon)}
        <span class="center-nav-tooltip">${escapeHtml(item.label)}</span>
      </button>
    `;
  }

  function menuButton(item) {
    const active = item.id === state.view ? "active" : "";
    const danger = item.id === "sair" ? "menu-danger" : "";
    return `
      <button class="nav-item ${active} ${danger}" type="button" data-view="${escapeAttr(item.id)}" data-route="${escapeAttr(item.id)}" data-menu-group="${escapeAttr(item.group || navGroupForView(item.id))}" title="${escapeAttr(item.label)}" aria-label="${escapeAttr(item.label)}">
        ${matIcon(item.icon || viewIcon(item.id))}
        <span>${escapeHtml(item.label)}</span>
      </button>
    `;
  }

  function isNavGroupOpen(group) {
    if (state.navGroupsOpen[group.id] === undefined) return false;
    return Boolean(state.navGroupsOpen[group.id]);
  }

  function primaryViewForMenuGroup(group) {
    if (!group || !Array.isArray(group.items) || !group.items.length) return "dashboard";
    const activeItem = group.items.find((item) => item.id === state.view);
    const firstItem = activeItem || group.items[0];
    return firstItem && firstItem.id ? firstItem.id : "dashboard";
  }

  function isSidebarCollapsedClickContext(element) {
    const sidebar = element && element.closest ? element.closest(".sidebar") : null;
    const workspace = element && element.closest ? element.closest(".workspace, .main-grid") : null;
    if (!sidebar || !workspace) return false;
    if (typeof window !== "undefined" && window.matchMedia && !window.matchMedia("(min-width: 841px)").matches) return false;
    return !workspace.classList.contains("expanded");
  }

  function menuGroup(group) {
    const active = group.items.some((item) => item.id === state.view) || group.view === state.view ? "active" : "";
    const open = isNavGroupOpen(group);
    return `
      <div class="nav-group ${active} ${open ? "is-open" : ""}" data-menu-group="${escapeAttr(group.id)}">
        <button
          class="nav-head ${active}"
          type="button"
          data-action="toggle-nav-group"
          data-menu-group="${escapeAttr(group.id)}"
          data-collapsed-view="${escapeAttr(primaryViewForMenuGroup(group))}"
          title="${escapeAttr(group.label)}"
          aria-label="${escapeAttr(group.label)}"
          aria-expanded="${open ? "true" : "false"}"
        >
          ${matIcon(group.icon)}
          <span>${escapeHtml(group.label)}</span>
          <span class="nav-chevron">${matIcon(open ? "expand_less" : "expand_more")}</span>
        </button>
        <div class="nav-sub">
          ${group.items.map((item) => menuButton(item)).join("")}
        </div>
      </div>
    `;
  }



  function dropzoneOperationalMeta(item) {
    const map = {
      "minhas-os": { scope: "Execução", subtitle: "OS atribuídas ao operador", status: "Operacional", next: "Continuar execução vinculada ao ativo", cta: "Ver minhas OS" },
      "checklist-pendente": { scope: "Checklist", subtitle: "Padrão técnico de execução", status: "Pendente", next: "Executar checklist da OS", cta: "Abrir checklist" },
      "scanner-qr": { scope: "QR Code", subtitle: "Leitura do ativo fisico", status: "Rastreio", next: "Ler QR Code do ativo", cta: "Abrir scanner" },
      "evidencias": { scope: "Evidência", subtitle: "Prova técnica da execução", status: "Registro", next: "Anexar ou consultar evidência", cta: "Abrir evidências" },
      "alertas": { scope: "Alerta", subtitle: "Não conformidades e bloqueios", status: "Monitoramento", next: "Verificar criticidade", cta: "Ver alertas" },
      "atualizar": { scope: "Sincronia", subtitle: "Atualização visual da sessão", status: "Seguro", next: "Atualizar dados exibidos", cta: "Atualizar agora" },
      "criar-os": { scope: "OS", subtitle: "Registro operacional rastreável", status: "Abertura", next: "Criar OS vinculada a ativo", cta: "Iniciar OS" },
      "atribuir-tecnico": { scope: "PCM", subtitle: "Responsável e próxima ação", status: "Planejamento", next: "Definir responsável técnico", cta: "Abrir atribuição" },
      "fila-aprovacao": { scope: "Aprovação", subtitle: "Validação de execução e evidência", status: "Governança", next: "Revisar evidências pendentes", cta: "Abrir fila" },
      "programar-preventiva": { scope: "Preventiva", subtitle: "Programação e backlog técnico", status: "PCM", next: "Planejar preventiva", cta: "Abrir programação" },
      "indicadores": { scope: "Indicadores", subtitle: "Decisao operacional e performance", status: "Analise", next: "Avaliar tendencia operacional", cta: "Abrir indicadores" },
      "usuarios": { scope: "Acesso", subtitle: "Governança de usuários", status: "Admin", next: "Revisar cadastro e perfis", cta: "Abrir usuários" },
      "permissoes": { scope: "Permissões", subtitle: "Matriz de autoridade", status: "Controle", next: "Validar acessos críticos", cta: "Abrir permissões" },
      "auditoria": { scope: "Auditoria", subtitle: "Trilha de alterações", status: "Rastreio", next: "Consultar eventos administrativos", cta: "Abrir auditoria" },
      "backup": { scope: "Continuidade", subtitle: "Proteção e recuperação", status: "Sistema", next: "Conferir rotina de backup", cta: "Abrir backup" },
      "versionamento": { scope: "Release", subtitle: "Controle de versão", status: "Sistema", next: "Consultar histórico de versões", cta: "Abrir versionamento" }
    };
    return map[item.id] || { scope: "Operação", subtitle: "Módulo operacional por perfil", status: "Ativo", next: "Executar próxima ação", cta: item.view ? `Abrir ${item.label}` : "Executar" };
  }

  function dropzoneActionButton(item, meta, cssClass) {
    if (item.action) {
      return `<button class="${cssClass || "ghost-action"} full" type="button" data-action="${escapeAttr(item.action)}" data-view-target="${escapeAttr(item.view || "")}">${matIcon(item.icon)} ${escapeHtml(meta.cta)}</button>`;
    }
    if (item.view) {
      return `<button class="${cssClass || "ghost-action"} full" type="button" data-view="${escapeAttr(item.view)}">${matIcon("open_in_new")} ${escapeHtml(meta.cta)}</button>`;
    }
    return "";
  }

  function dropzoneEmptyMessage(item) {
    if (["fila-aprovacao"].includes(item.id)) return "Nenhuma aprovação pendente.";
    if (["alertas"].includes(item.id)) return "Nenhuma ação crítica no momento.";
    return "Sem registros disponíveis.";
  }

  function dropzoneModuleIds() {
    const eligible = eligibleQuickActions();
    const eligibleIds = new Set(eligible.map((item) => item.id));
    const saved = Array.isArray(state.dropzoneModules) ? state.dropzoneModules.filter((id) => eligibleIds.has(id)) : [];
    if (saved.length) return saved;
    return eligible.slice(0, Math.min(4, eligible.length)).map((item) => item.id);
  }

  function getQuickActionById(id) {
    return quickActionCatalog().find((item) => item.id === id) || null;
  }

  function persistDropzoneModules(ids) {
    const eligibleIds = new Set(eligibleQuickActions().map((item) => item.id));
    state.dropzoneModules = unique((ids || []).filter((id) => eligibleIds.has(id)));
    saveDropzoneModules(state.dropzoneModules);
  }

  function quickPanelButton(item) {
    const active = dropzoneModuleIds().includes(item.id) ? "active" : "";
    return `
      <button class="quick-panel-action ${active}" type="button" data-action="add-dropzone-module" data-dropzone-id="${escapeAttr(item.id)}" title="Adicionar ${escapeAttr(item.label)} à Dropzone">
        ${matIcon(item.icon)}
        <span>${escapeHtml(item.label)}</span>
      </button>
    `;
  }

  function renderQuickActionsConfig() {
    const eligible = eligibleQuickActions();
    const activeIds = new Set(dropzoneModuleIds());
    return `
      <section class="quick-panel-section quick-config-section">
        <div class="section-title-row">
          <strong>Biblioteca de módulos</strong>
          <span>${eligible.length}</span>
        </div>
        <p class="muted compact-help">Configure quais módulos ficam no Trabalho Ativo. A disponibilidade respeita perfil, permissão e dispositivo.</p>
        <div class="quick-config-list">
          ${eligible.map((item) => `
            <button class="quick-config-row ${activeIds.has(item.id) ? "active" : ""}" type="button" data-action="toggle-dropzone-module" data-dropzone-id="${escapeAttr(item.id)}">
              ${matIcon(item.icon)}
              <span>${escapeHtml(item.label)}</span>
              <b>${activeIds.has(item.id) ? "ativo" : "incluir"}</b>
            </button>
          `).join("")}
        </div>
        <div class="footer-actions compact-actions">
          <button class="ghost-action" type="button" data-action="reset-dropzone-modules">Restaurar padrão</button>
          <button class="primary-action" type="button" data-action="toggle-quick-config">Concluir</button>
        </div>
      </section>
    `;
  }

  function renderDropzoneModuleContent(item, notificationItems, notificationCount, critical) {
    const meta = dropzoneOperationalMeta(item);
    const latestOrders = ((state.data && state.data.os) || []).slice(0, 3);
    const operationalLead = `
      <div class="dropzone-operational-context">
        <span>${escapeHtml(meta.scope)}</span>
        <strong>${escapeHtml(meta.status)}</strong>
      </div>
      <p class="dropzone-next-action"><b>Próxima ação:</b> ${escapeHtml(meta.next)}</p>
    `;

    if (item.id === "atualizar") {
      return `${operationalLead}<p class="muted">Atualiza os dados exibidos na interface sem alterar backend, schema ou regra de negocio.</p>${dropzoneActionButton(item, meta, "secondary-action")}`;
    }

    if (item.id === "criar-os") {
      return `${operationalLead}<p class="muted">Inicia o registro controlado de uma OS mantendo o fluxo Ativo físico -> OS -> Checklist -> Evidência -> Aprovação.</p>${dropzoneActionButton(item, meta, "primary-action")}`;
    }

    if (["minhas-os", "checklist-pendente", "atribuir-tecnico", "fila-aprovacao", "programar-preventiva"].includes(item.id)) {
      return `
        ${operationalLead}
        <div class="dropzone-mini-list">
          ${latestOrders.map((os) => `<button type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}"><b>${escapeHtml(os.id)}</b><span>${escapeHtml(os.titulo || os.equipamento_nome || os.status || "OS")}</span></button>`).join("") || `<p class="muted">${dropzoneEmptyMessage(item)}</p>`}
        </div>
        ${dropzoneActionButton(item, meta)}
      `;
    }

    if (["indicadores", "auditoria", "backup", "versionamento"].includes(item.id)) {
      const hasEvents = notificationItems.length > 0;
      return `
        ${operationalLead}
        <div class="quick-panel-kpis dropzone-kpis">
          <div><strong>${hasEvents ? critical : "--"}</strong><span>críticos</span></div>
          <div><strong>${hasEvents ? notificationCount : "--"}</strong><span>eventos</span></div>
        </div>
        <p class="muted">${hasEvents ? "Indicadores calculados a partir dos eventos carregados na sessao." : "Sem registros disponíveis."}</p>
        ${dropzoneActionButton(item, meta)}
      `;
    }

    if (["usuarios", "permissoes"].includes(item.id)) {
      return `${operationalLead}<p class="muted">Acesso administrativo com foco em governanca, autoridade e rastreabilidade. Não altera permissões diretamente pela Dropzone.</p>${dropzoneActionButton(item, meta)}`;
    }

    return `
      ${operationalLead}
      <div class="dropzone-mini-list">
        ${notificationItems.slice(0, 3).map((event) => `<button type="button" data-view="notificacoes"><b>${escapeHtml(event.title || event.label)}</b><span>${escapeHtml(event.detail || event.message || "Evento operacional")}</span></button>`).join("") || `<p class="muted">${dropzoneEmptyMessage(item)}</p>`}
      </div>
      ${dropzoneActionButton(item, meta)}
    `;
  }

  function renderDropzoneModule(id, index, total, notificationItems, notificationCount, critical) {
    const item = getQuickActionById(id);
    if (!item) return "";
    const meta = dropzoneOperationalMeta(item);
    const collapsed = Boolean(state.dropzoneCollapsed[id]);
    return `
      <article class="dropzone-module ${collapsed ? "is-collapsed" : ""}" data-dropzone-module="${escapeAttr(id)}">
        <div class="dropzone-module-head">
          <div class="dropzone-module-title">
            ${matIcon(item.icon)}
            <span>
              <strong>${escapeHtml(item.label)}</strong>
              <small>${escapeHtml(meta.subtitle)}</small>
            </span>
            <em>${escapeHtml(meta.scope)}</em>
          </div>
          <div class="dropzone-module-actions">
            ${state.quickActionsConfigOpen ? `
              <button class="icon-action" type="button" data-action="move-dropzone-module-up" data-dropzone-id="${escapeAttr(id)}" ${index === 0 ? "disabled" : ""} title="Mover para cima">${matIcon("keyboard_arrow_up")}</button>
              <button class="icon-action" type="button" data-action="move-dropzone-module-down" data-dropzone-id="${escapeAttr(id)}" ${index === total - 1 ? "disabled" : ""} title="Mover para baixo">${matIcon("keyboard_arrow_down")}</button>
              <button class="icon-action" type="button" data-action="noop" title="Configuração visual futura">${matIcon("palette")}</button>
              <button class="icon-action danger-lite" type="button" data-action="remove-dropzone-module" data-dropzone-id="${escapeAttr(id)}" title="Remover módulo">${matIcon("delete")}</button>
            ` : ""}
            <button class="icon-action" type="button" data-action="toggle-dropzone-collapse" data-dropzone-id="${escapeAttr(id)}" title="Recolher/expandir">${matIcon(collapsed ? "unfold_more" : "unfold_less")}</button>
          </div>
        </div>
        <div class="dropzone-module-body">
          ${renderDropzoneModuleContent(item, notificationItems, notificationCount, critical)}
        </div>
      </article>
    `;
  }

  function renderQuickPanel(notificationItems, notificationCount) {
    const critical = notificationItems.filter((item) => ["critico", "critical", "red"].includes(String(item.severity || "").toLowerCase())).length;
    const moduleIds = dropzoneModuleIds();
    return `
      <aside class="quick-panel dropzone-panel ${state.quickPanelOpen ? "is-open" : "is-collapsed"} ${state.quickActionsConfigOpen ? "is-editing" : ""}" aria-label="Trabalho Ativo">
        <div class="quick-panel-head">
          <div class="quick-panel-title">
            <strong>Trabalho Ativo</strong>
            <small>Módulos operacionais por perfil</small>
          </div>
          <div class="quick-panel-head-actions">
            <button class="icon-action" type="button" data-action="toggle-quick-config" aria-label="Editar Dropzone" title="Editar Dropzone">
              ${matIcon(state.quickActionsConfigOpen ? "close" : "tune")}
            </button>
            <button class="icon-action" type="button" data-action="toggle-quick-panel" aria-label="Recolher Dropzone" aria-expanded="${state.quickPanelOpen ? "true" : "false"}">
              ${matIcon(state.quickPanelOpen ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left")}
            </button>
          </div>
        </div>
        <div class="quick-panel-body dropzone-body">
          ${state.quickActionsConfigOpen ? renderQuickActionsConfig() : `
            <section class="dropzone-operating-summary" aria-label="Resumo do Trabalho Ativo">
              <span>${escapeHtml(state.session.perfil)}</span>
              <strong>${moduleIds.length} ${moduleIds.length === 1 ? "módulo ativo" : "módulos ativos"}</strong>
              <small>Ativo físico -> QR Code -> OS -> Checklist -> Evidência -> Aprovação -> Histórico -> Indicadores</small>
            </section>
          `}
          <section class="dropzone-stage" aria-label="Módulos ativos do Trabalho Ativo">
            ${moduleIds.length ? moduleIds.map((id, index) => renderDropzoneModule(id, index, moduleIds.length, notificationItems, notificationCount, critical)).join("") : `<div class="empty-state small">Sem registros disponíveis.</div>`}
          </section>
        </div>
      </aside>
    `;
  }

  function mobileQuickActionItems() {
    const current = quickActionItems().filter((item) => item.view !== "qr-code" && item.view !== "notificacoes");
    return current.length ? current : [
      { label: "Atualizar", icon: "sync", action: "refresh", profiles: [state.session.perfil], devices: ["mobile"] }
    ];
  }

  function mobileActionButton(item) {
    const attr = item.action
      ? `data-action="${escapeAttr(item.action)}" data-view-target="${escapeAttr(item.view || "")}"`
      : `data-view="${escapeAttr(item.view)}"`;
    return `
      <button class="mobile-sheet-action ${item.primary ? "primary" : ""}" type="button" ${attr}>
        ${matIcon(item.icon)}
        <span>${escapeHtml(item.label)}</span>
      </button>
    `;
  }

  function renderMobileActionsSheet() {
    return `
      <button class="mobile-fab" type="button" data-action="toggle-mobile-actions" aria-label="Trabalho ativo mobile" aria-expanded="${state.mobileQuickOpen ? "true" : "false"}">
        ${matIcon(state.mobileQuickOpen ? "close" : "bolt")}
      </button>
      <div class="mobile-sheet-backdrop ${state.mobileQuickOpen ? "is-open" : ""}" data-action="close-mobile-actions" aria-hidden="true"></div>
      <section class="mobile-actions-sheet ${state.mobileQuickOpen ? "is-open" : ""}" aria-label="Trabalho ativo mobile">
        <div class="mobile-sheet-handle" aria-hidden="true"></div>
        <div class="mobile-sheet-head">
          <div>
            <strong>Trabalho ativo</strong>
            <small>${escapeHtml(state.session.perfil)} · operação mobile</small>
          </div>
          <button class="icon-action" type="button" data-action="close-mobile-actions" aria-label="Fechar trabalho ativo">${matIcon("close")}</button>
        </div>
        <div class="mobile-sheet-grid">
          ${mobileQuickActionItems().map((item) => mobileActionButton(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderShell() {
    document.body.classList.remove("is-login");
    document.body.classList.add("is-authenticated");
    safeScrollTop();
    const notificationItems = buildNotificationItems();
    const notificationCount = notificationItems.length;
    const shellExpanded = state.menuOpen ? "expanded" : "";
    const quickState = state.quickPanelOpen ? "quick-open" : "quick-collapsed";
    app.innerHTML = `
      <div class="layout app-layout ${quickState}">
        <header class="topbar app-topbar">
          <div class="topbar-left">
            <button class="menu-toggle icon-action" type="button" data-action="toggle-menu" aria-label="Alternar drawer lateral" aria-controls="sidebar-menu" aria-expanded="${state.menuOpen ? "true" : "false"}">
              ${matIcon("menu")}
            </button>
          </div>
          <nav class="center-nav topbar-center" aria-label="Navegação principal">
            ${centerNavItems().map((item) => centerNavButton(item)).join("")}
          </nav>
          <div class="topbar-actions topbar-right">
            <button class="icon-action quick-panel-toggle" type="button" data-action="toggle-quick-panel" title="Painel de ações rápidas" aria-label="Painel de ações rápidas" aria-expanded="${state.quickPanelOpen ? "true" : "false"}">
              ${matIcon(state.quickPanelOpen ? "right_panel_close" : "right_panel_open")}
            </button>
            <button class="topbar-logout-action" type="button" data-action="logout" title="Sair" aria-label="Sair do sistema">
              ${matIcon("logout")}
              <span class="logout-label">Sair</span>
            </button>
          </div>
        </header>
        <div class="main-grid workspace ${shellExpanded} ${quickState}">
          <div class="mobile-menu-backdrop ${state.menuOpen ? "is-open" : ""}" data-action="close-menu" aria-hidden="true"></div>
          <aside class="sidebar ${state.menuOpen ? "is-open" : ""}" id="sidebar-menu">
            <div class="drawer-identity" title="SCS OS Control">
              <span class="drawer-mark" aria-hidden="true">SCS</span>
              <span class="drawer-title">OS Control</span>
            </div>
            <nav class="menu-list" aria-label="Menu principal">
              ${groupedMenu().map((group) => menuGroup(group)).join("")}
            </nav>
          </aside>
          <main class="content main-content" id="content"></main>
          ${renderQuickPanel(notificationItems, notificationCount)}
        </div>
        <nav class="bottom-nav" aria-label="Navegação rápida mobile">
          ${bottomNavItems().map((item) => bottomNavButton(item)).join("")}
        </nav>
        ${renderMobileActionsSheet()}
      </div>
      <div class="toast-stack" id="toasts"></div>
    `;
    renderCurrentView();
  }

  function bottomNavItems() {
    const perfil = state.session.perfil;
    if (perfil === "Operador") {
      return [
        { id: "dashboard", label: "Início", icon: "home" },
        { id: "minhas-os", label: "Minhas OS", icon: "assignment" },
        { id: "qr-code", label: "QR", icon: "qr_code_scanner" },
        { id: "notificacoes", label: "Alertas", icon: "notifications" },
        { id: "meu-perfil", label: "Config.", icon: "tune" }
      ];
    }
    if (perfil === "Admin") {
      return [
        { id: "dashboard", label: "Início", icon: "home" },
        { id: "usuarios", label: "Usuários", icon: "group" },
        { id: "permissoes", label: "Permissões", icon: "shield_person" },
        { id: "auditoria", label: "Auditoria", icon: "manage_search" },
        { id: "mais-mobile", label: "Mais", icon: "more_horiz", action: "toggle-mobile-actions" }
      ];
    }
    return [
      { id: "dashboard", label: "Início", icon: "home" },
      { id: "gestao-os", label: "OS", icon: "assignment" },
      { id: "acompanhamento", label: "Aprovar", icon: "approval" },
      { id: "qr-code", label: "QR", icon: "qr_code_scanner" },
      { id: "mais-mobile", label: "Mais", icon: "more_horiz", action: "toggle-mobile-actions" }
    ];
  }

  function bottomNavButton(item) {
    const active = item.id === state.view || (item.id === "mais-mobile" && state.mobileQuickOpen) ? "active" : "";
    const attr = item.action
      ? `data-action="${escapeAttr(item.action)}"`
      : `data-view="${escapeAttr(item.id)}"`;
    return `
      <button class="${active}" type="button" ${attr} title="${escapeAttr(item.label)}" aria-label="${escapeAttr(item.label)}">
        ${matIcon(item.icon)}
        <span>${escapeHtml(item.label)}</span>
      </button>
    `;
  }

  function renderCurrentView() {
    const content = document.getElementById("content");
    if (!content) return;
    content.className = `content view-${state.view}`;
    if (state.view !== "qr-code") stopQrScanner();
    if (state.view === "sair") {
      logout();
      return;
    }
    if (state.view === "dashboard") content.innerHTML = renderDashboard();
    else if (["minhas-os", "gestao-os", "programacao", "acompanhamento", "backlog"].includes(state.view)) content.innerHTML = renderOsListView(state.view);
    else if (state.view === "os-detalhe") content.innerHTML = renderOsDetail();
    else if (state.view === "historico-pessoal") content.innerHTML = renderHistóricoPessoal();
    else if (state.view === "comunicacoes") content.innerHTML = renderComunicacoes();
    else if (state.view === "meu-perfil") content.innerHTML = renderMeuPerfil();
    else if (state.view === "relatorios") content.innerHTML = renderIndicadores();
    else if (state.view === "relatorios-gerais") content.innerHTML = renderRelatoriosGerenciais();
    else if (["equipamentos", "componentes", "acompanhamento-ativos", "cadastros"].includes(state.view)) content.innerHTML = renderCadastros();
    else if (["qualidade-tecnica", "checklists", "checklist-execucoes", "validacao-tecnica"].includes(state.view)) content.innerHTML = renderChecklists();
    else if (state.view === "usuarios-view") content.innerHTML = renderUsuarios(false);
    else if (state.view === "usuarios") content.innerHTML = renderUsuarios(true);
    else if (state.view === "permissoes" || state.view === "modulos") content.innerHTML = renderPermissoes();
    else if (state.view === "configuracoes") content.innerHTML = renderConfiguracoes();
    else if (state.view === "auditoria") renderAuditoria(content);
    else if (state.view === "backup") content.innerHTML = renderBackup();
    else if (state.view === "integracoes") content.innerHTML = renderIntegracoes();
    else if (state.view === "versionamento") content.innerHTML = renderVersionamento();
    else if (state.view === "qr-code") content.innerHTML = renderQrCode();
    else if (state.view === "notificacoes") content.innerHTML = renderNotificacoes();
    else content.innerHTML = renderDashboard();
    prepareMobileAdaptiveSections(content);
    setActiveMenu();
    if (state.view === "qr-code" && isMobileShell()) {
      window.setTimeout(() => startQrScanner(), 250);
    }
  }

  function setActiveMenu() {
    const activeGroup = navGroupForView(state.view);
    app.querySelectorAll("[data-view]").forEach((button) => {
      const exact = button.dataset.view === state.view;
      const centerOsFamily = button.classList.contains("center-nav-button")
        && button.dataset.view === "gestao-os"
        && ["programacao", "acompanhamento"].includes(state.view);
      button.classList.toggle("active", exact || centerOsFamily);
    });
    app.querySelectorAll(".nav-group").forEach((group) => {
      const isActive = group.dataset.menuGroup === activeGroup;
      group.classList.toggle("active", isActive);
    });
    app.querySelectorAll(".nav-head").forEach((head) => {
      head.classList.toggle("active", head.dataset.menuGroup === activeGroup);
    });
  }


  function safeScrollTop() {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  }

  function viewHeader(extraAction) {
    const title = VIEW_TITLES[state.view] || VIEW_TITLES.dashboard;
    return `
      <div class="view-header">
        <div>
          <h2>${escapeHtml(title[0])}</h2>
          <p>${escapeHtml(title[1])}</p>
        </div>
        ${extraAction || ""}
      </div>
    `;
  }

  function mobileAdaptiveDetails(title, summary, content, className = "", defaultOpenOnMobile = false) {
    const mobileAttr = defaultOpenOnMobile ? 'data-mobile-default-open="true"' : 'data-mobile-default-closed="true"';
    return `
      <details class="mobile-adaptive-section ${escapeAttr(className)}" open ${mobileAttr}>
        <summary>
          <span>
            <strong>${escapeHtml(title)}</strong>
            ${summary ? `<small>${escapeHtml(summary)}</small>` : ""}
          </span>
          ${matIcon("expand_more")}
        </summary>
        <div class="mobile-adaptive-content">
          ${content}
        </div>
      </details>
    `;
  }

  function prepareMobileAdaptiveSections(root = document) {
    const mobile = isMobileShell();
    root.querySelectorAll("details.mobile-adaptive-section").forEach((details) => {
      if (mobile && details.hasAttribute("data-mobile-default-closed")) {
        details.open = false;
      } else {
        details.open = true;
      }
    });
  }

  function renderDashboard() {
    const perfil = state.session.perfil;
    const analytics = buildDashboardAnalytics();

    if (perfil === "Operador") {
      return renderOperatorDashboard(analytics);
    }
    if (perfil === "Admin") {
      return renderAdminDashboard(analytics);
    }
    return renderManagerDashboard(analytics);
  }

  function renderOperatorDashboard(analytics) {
    const userId = state.session.usuario.id;
    const userOrders = (state.data.ordens || []).filter((os) => os.responsavel === userId || can("acompanhar_os"));
    const activeOrders = userOrders.filter((os) => !["CONCLUIDA", "CANCELADA"].includes(os.status));
    const nextOrder = activeOrders.find((os) => os.status === "EM_EXECUCAO")
      || activeOrders.find((os) => os.status === "LIBERADA")
      || activeOrders.find((os) => os.status === "REABERTA")
      || activeOrders[0]
      || null;

    const operatorKpis = [
      { label: "Minhas OS", value: activeOrders.length, hint: "Abertas para ação", pct: percent(activeOrders.length, Math.max(userOrders.length, 1)), view: "minhas-os" },
      { label: "Liberadas", value: activeOrders.filter((os) => os.status === "LIBERADA").length, hint: "Podem ser iniciadas", pct: analytics.liberadasPct, view: "minhas-os", status: "LIBERADA" },
      { label: "Em execução", value: activeOrders.filter((os) => os.status === "EM_EXECUCAO").length, hint: "Checklist em andamento", pct: analytics.emExecucaoPct, view: "minhas-os", status: "EM_EXECUCAO" },
      { label: "Atrasadas", value: activeOrders.filter(isLate).length, hint: "Prazo vencido", pct: analytics.atrasadasPct, view: "minhas-os", quick: "atrasadas" }
    ];

    return `
      ${viewHeader(`<button class="primary-action desktop-inline-action" type="button" data-view="qr-code">${matIcon("qr_code_scanner")} Ler QR Code</button>`)}
      <section class="profile-dashboard operator-dashboard">
        <article class="operation-hero card ${nextOrder && isLate(nextOrder) ? "is-critical" : ""}">
          <div>
            <span class="section-kicker">Próxima ação do operador</span>
            <h2>${nextOrder ? `${escapeHtml(nextOrder.id)} · ${escapeHtml(nextOrder.tipo || "OS")}` : "Nenhuma OS ativa"}</h2>
            <p>${nextOrder ? `${escapeHtml(getAtivo(nextOrder.ativo_id).nome || nextOrder.ativo_id || "Ativo")} · ${escapeHtml(nextOrder.descricao || "Sem descrição")}` : "Sem tarefas abertas para seu perfil no momento."}</p>
            ${nextOrder ? `<div class="meta">${statusTag(nextOrder.status)}<span class="tag ${nextOrder.criticidade === "A" ? "red" : "blue"}">Criticidade ${escapeHtml(nextOrder.criticidade || "-")}</span>${isLate(nextOrder) ? `<span class="tag red">SLA vencido</span>` : `<span class="tag green">No prazo</span>`}</div>` : ""}
          </div>
          <div class="hero-actions">
            ${nextOrder ? renderOperatorPrimaryActions(nextOrder) : `<button class="primary-action" type="button" data-view="qr-code">${matIcon("qr_code_scanner")} Ler QR Code</button>`}
          </div>
        </article>

        <section class="dashboard-grid compact-dashboard-grid">
          ${operatorKpis.map((item) => renderKpiCard(item)).join("")}
        </section>

        <section class="operator-work-grid">
          <article class="panel">
            <div class="panel-head">
              <h3>Execução guiada</h3>
              <span class="tag blue">Mobile-first</span>
            </div>
            <div class="stepper-list">
              ${renderExecutionStep(1, "Ler QR / Identificar ativo", nextOrder ? "OK" : "Pendente", Boolean(nextOrder))}
              ${renderExecutionStep(2, "Iniciar OS", nextOrder && ["EM_EXECUCAO", "AGUARDANDO_APROVACAO", "CONCLUIDA"].includes(nextOrder.status) ? "OK" : "Próximo", nextOrder && nextOrder.status !== "LIBERADA")}
              ${renderExecutionStep(3, "Abrir checklist", nextOrder && nextOrder.status === "EM_EXECUCAO" ? "Agora" : "Aguardando", nextOrder && nextOrder.status === "EM_EXECUCAO")}
              ${renderExecutionStep(4, "Salvar checklist", "Pendente", false)}
              ${renderExecutionStep(5, "Finalizar execução", "Bloqueado", false, true)}
            </div>
          </article>

          <article class="panel">
            <div class="panel-head">
              <h3>Minhas OS prioritárias</h3>
              <button class="ghost-action" type="button" data-view="minhas-os">Ver todas</button>
            </div>
            <div class="dashboard-os-list">
              ${activeOrders.slice(0, 4).map((os) => renderDashboardOsCard(os, "operador")).join("") || `<div class="empty-state">Nenhuma OS ativa vinculada ao operador.</div>`}
            </div>
          </article>
        </section>
      </section>
    `;
  }

  function renderManagerDashboard(analytics) {
    const orders = state.data.ordens || [];
    const approvalOrders = orders.filter((os) => os.status === "AGUARDANDO_APROVACAO");
    const criticalOrders = orders.filter((os) => os.criticidade === "A" && !["CONCLUIDA", "CANCELADA"].includes(os.status));
    const lateOrders = orders.filter(isLate);
    const managerKpis = [
      { label: "Backlog", value: analytics.backlog, hint: "OS abertas e planejadas", pct: analytics.backlogPct, view: "gestao-os", quick: "backlog" },
      { label: "Aprovação", value: analytics.aguardandoAprovacao, hint: "Aguardando decisão", pct: analytics.aprovacaoPct, view: "acompanhamento", status: "AGUARDANDO_APROVACAO" },
      { label: "Atrasadas", value: analytics.atrasadas, hint: "Prazo vencido", pct: analytics.atrasadasPct, view: "acompanhamento", quick: "atrasadas" },
      { label: "SLA", value: `${analytics.slaCompliance}%`, hint: "Dentro do prazo", pct: analytics.slaCompliance, view: "relatorios" }
    ];

    return `
      ${viewHeader(`<button class="primary-action" type="button" data-action="toggle-create-os">${matIcon("add_task")} Criar OS</button>`)}
      <section class="profile-dashboard manager-dashboard">
        <section class="dashboard-grid compact-dashboard-grid">
          ${managerKpis.map((item) => renderKpiCard(item)).join("")}
        </section>

        <section class="manager-grid">
          <article class="panel priority-panel">
            <div class="panel-head">
              <div>
                <h3>Fila de aprovação</h3>
                <p class="small-note">OS finalizadas pelo operador aguardando decisão.</p>
              </div>
              <span class="tag amber">${approvalOrders.length} pendente(s)</span>
            </div>
            <div class="dashboard-os-list">
              ${approvalOrders.slice(0, 4).map((os) => renderDashboardOsCard(os, "gestor")).join("") || `<div class="empty-state">Nenhuma OS aguardando aprovação.</div>`}
            </div>
          </article>

          <article class="panel priority-panel">
            <div class="panel-head">
              <div>
                <h3>OS críticas / atrasadas</h3>
                <p class="small-note">Prioridade para reduzir risco operacional.</p>
              </div>
              <span class="tag red">${unique(criticalOrders.concat(lateOrders).map((os) => os.id)).length} alerta(s)</span>
            </div>
            <div class="dashboard-os-list">
              ${criticalOrders.concat(lateOrders).filter((os, index, arr) => arr.findIndex((item) => item.id === os.id) === index).slice(0, 4).map((os) => renderDashboardOsCard(os, "gestor")).join("") || `<div class="empty-state">Sem criticidade aberta ou atraso.</div>`}
            </div>
          </article>
        </section>

        <section class="analytics-grid">
          <article class="panel analytic-panel">
            <div class="panel-head"><h3>Status das OS</h3><span class="tag blue">${analytics.totalOs} OS</span></div>
            ${renderBarList(analytics.statusSeries, "status")}
          </article>
          <article class="panel analytic-panel">
            <div class="panel-head"><h3>Tipos de manutenção</h3><span class="tag">${analytics.typeSeries.length} tipos</span></div>
            ${renderBarList(analytics.typeSeries, "search")}
          </article>
          <article class="panel analytic-panel">
            <div class="panel-head"><h3>Risco e criticidade</h3><span class="tag ${analytics.riscoOperacional > 40 ? "red" : "green"}">${analytics.riscoOperacional}% risco</span></div>
            <div class="risk-grid">
              ${renderRiskItem("Criticidade A aberta", analytics.critAbertas, analytics.critAbertasPct)}
              ${renderRiskItem("Aguardando aprovação", analytics.aguardandoAprovacao, analytics.aprovacaoPct)}
              ${renderRiskItem("OS atrasadas", analytics.atrasadas, analytics.atrasadasPct)}
              ${renderRiskItem("Equipamentos inativos", analytics.equipamentosInativos, analytics.equipamentosInativosPct)}
            </div>
          </article>
        </section>
      </section>
    `;
  }

  function renderAdminDashboard(analytics) {
    const refs = state.data.referencias || {};
    const usuarios = refs.usuarios || [];
    const modulos = refs.modulos || [];
    const workflow = refs.workflow_regras || [];
    const logs = state.data.logs || state.data.audit_log || [];
    const orders = state.data.ordens || [];
    const approvalOrders = orders.filter((os) => os.status === "AGUARDANDO_APROVACAO");
    const criticalOrders = orders.filter((os) => os.criticidade === "A" && !["CONCLUIDA", "CANCELADA"].includes(os.status));
    const lateOrders = orders.filter(isLate);
    const priorityOrders = criticalOrders
      .concat(lateOrders)
      .concat(approvalOrders)
      .filter((os, index, arr) => arr.findIndex((item) => item.id === os.id) === index);
    const evidencePending = getPendingEvidenceItems();
    const adminCommandKpis = [
      { label: "OS abertas", value: analytics.abertas, hint: "Não encerradas", pct: analytics.abertasPct, view: "gestao-os", quick: "abertas" },
      { label: "Críticas", value: analytics.critAbertas, hint: "Criticidade A aberta", pct: analytics.critAbertasPct, view: "acompanhamento", quick: "criticas" },
      { label: "Atrasadas", value: analytics.atrasadas, hint: "Prazo vencido", pct: analytics.atrasadasPct, view: "acompanhamento", quick: "atrasadas" },
      { label: "Aprovações", value: analytics.aguardandoAprovacao, hint: "Aguardando decisão", pct: analytics.aprovacaoPct, view: "acompanhamento", status: "AGUARDANDO_APROVACAO" },
      { label: "SLA", value: `${analytics.slaCompliance}%`, hint: "Dentro do prazo", pct: analytics.slaCompliance, view: "relatorios" },
      { label: "Backlog", value: analytics.backlog, hint: "Planejadas e liberadas", pct: analytics.backlogPct, view: "gestao-os", quick: "backlog" }
    ];

    return `
      ${viewHeader(`<button class="primary-action" type="button" data-view="gestao-os">${matIcon("fact_check")} Ver OS</button>`)}
      <section class="profile-dashboard admin-dashboard admin-ops-dashboard">
        <article class="operation-hero admin-ops-hero ${analytics.riscoOperacional > 40 ? "is-critical" : ""}">
          <div>
            <span class="section-kicker">Centro Operacional Admin</span>
            <h2>Comando Operacional</h2>
            <p>OS, risco, aprovação, SLA e backlog antes da camada administrativa.</p>
            <div class="meta">
              <span class="tag ${analytics.riscoOperacional > 40 ? "red" : "green"}">Risco operacional ${analytics.riscoOperacional}%</span>
              <span class="tag blue">Governança preservada</span>
            </div>
          </div>
          <div class="hero-actions">
            <button class="primary-action" type="button" data-view="acompanhamento">${matIcon("monitoring")} Acompanhar operação</button>
            <button class="secondary-action" type="button" data-view="auditoria">${matIcon("manage_search")} Auditoria</button>
          </div>
        </article>

        <section class="dashboard-grid admin-command-metrics">
          ${adminCommandKpis.map((item) => renderKpiCard(item)).join("")}
        </section>

        ${renderTraceabilityChain()}

        <section class="admin-operational-grid">
          <article class="panel priority-panel">
            <div class="panel-head">
              <div>
                <h3>Prioridades operacionais</h3>
                <p class="small-note">Risco, atraso e aprovação para decisão imediata.</p>
              </div>
              <span class="tag ${priorityOrders.length ? "red" : "green"}">${priorityOrders.length ? `${priorityOrders.length} prioridade(s)` : "Nenhuma ação crítica"}</span>
            </div>
            <div class="dashboard-os-list">
              ${priorityOrders.slice(0, 4).map((os) => renderDashboardOsCard(os, "gestor")).join("") || `<div class="empty-state">Nenhuma ação crítica no momento.</div>`}
            </div>
          </article>

          <article class="panel priority-panel">
            <div class="panel-head">
              <div>
                <h3>Evidências e aprovação</h3>
                <p class="small-note">Validação técnica sem simular pendências inexistentes.</p>
              </div>
              <span class="tag ${approvalOrders.length || evidencePending.length ? "amber" : "green"}">${approvalOrders.length || evidencePending.length ? "Revisar" : "Sem pendências"}</span>
            </div>
            <div class="risk-grid admin-risk-grid">
              ${renderRiskItem("Aprovações", analytics.aguardandoAprovacao, analytics.aprovacaoPct)}
              ${renderRiskItem("Evidências pendentes", evidencePending.length, percent(evidencePending.length, Math.max((state.data.checklist || []).length, 1)))}
              ${renderRiskItem("Checklist", analytics.checklistCompliance, analytics.checklistCompliance)}
              ${renderRiskItem("Auditoria", logs.length, percent(logs.length, Math.max(logs.length || analytics.totalOs, 1)))}
            </div>
            ${approvalOrders.length ? `<button class="secondary-action" type="button" data-view="acompanhamento">${matIcon("approval")} Revisar aprovações</button>` : `<div class="empty-state compact">Nenhuma aprovação pendente.</div>`}
          </article>
        </section>

        <section class="admin-governance-section">
          <div class="section-title-row">
            <div>
              <span class="section-kicker">Camada secundária</span>
              <h3>Governança e integridade</h3>
              <p>Acesso, auditoria, regras, continuidade e integrações.</p>
            </div>
          </div>
          <div class="admin-command-grid governance-command-grid">
            ${renderAdminCommandCard("Identidades", "Usuários ativos, bloqueios e reset de senha.", "group", "usuarios", "Usuários")}
            ${renderAdminCommandCard("Permissões", "Matriz de acesso por perfil e módulo.", "admin_panel_settings", "permissoes", "Permissões")}
            ${renderAdminCommandCard("Workflow", "Transições oficiais da OS e regras de aprovação.", "schema", "configuracoes", "Workflow")}
            ${renderAdminCommandCard("Auditoria", "Logs, eventos, trilha de ação e rastreabilidade.", "manage_search", "auditoria", "Auditoria")}
            ${renderAdminCommandCard("Backup", "Exportação local, restauração e validação de base.", "cloud_upload", "backup", "Backup")}
            ${renderAdminCommandCard("Integrações", "Apps Script, URL da API e token frontend.", "api", "integracoes", "Integrações")}
          </div>
        </section>
      </section>
    `;
  }

  function renderOperatorPrimaryActions(os) {
    if (!os) return "";
    const actions = [];
    if (os.status === "LIBERADA" && canStart(os)) {
      actions.push(`<button class="primary-action" type="button" data-action="iniciar-os" data-os-id="${escapeAttr(os.id)}">${matIcon("play_arrow")} Iniciar OS</button>`);
    }
    if (canChecklist(os)) {
      actions.push(`<button class="primary-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}">${matIcon("fact_check")} Abrir Checklist</button>`);
    }
    actions.push(`<button class="secondary-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}">${matIcon("visibility")} Detalhes da OS</button>`);
    actions.push(`<button class="danger-action" type="button" data-view="notificacoes">${matIcon("report_problem")} Reportar problema</button>`);
    return actions.join("");
  }

  function renderDashboardOsCard(os, mode) {
    const ativo = getAtivo(os.ativo_id);
    const late = isLate(os);
    const critical = os.criticidade === "A";
    const className = late || critical ? "os-critical" : (os.status === "AGUARDANDO_APROVACAO" ? "os-warn" : "os-ok");
    const gestorActions = mode === "gestor"
      ? `${canWorkflowAction("aprovar", os) ? `<button class="secondary-action green" type="button" data-action="aprovar-os" data-os-id="${escapeAttr(os.id)}">${matIcon("check_circle")} Aprovar</button>` : ""}
         ${canWorkflowAction("reabrir", os) ? `<button class="secondary-action amber" type="button" data-action="reabrir-os" data-os-id="${escapeAttr(os.id)}">${matIcon("undo")} Reabrir</button>` : ""}
         <button class="ghost-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}">${matIcon("visibility")} Acompanhar</button>`
      : `<button class="ghost-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}">${matIcon("visibility")} Abrir</button>`;
    return `
      <article class="dashboard-os-card ${className}">
        <div>
          <strong>${escapeHtml(os.id)} · ${escapeHtml(os.tipo || "OS")}</strong>
          <small>${escapeHtml(ativo.nome || os.ativo_id || "Ativo")} · ${escapeHtml(os.descricao || "Sem descrição")}</small>
          <div class="meta">
            ${statusTag(os.status)}
            <span class="tag ${critical ? "red" : "blue"}">Criticidade ${escapeHtml(os.criticidade || "-")}</span>
            ${late ? `<span class="tag red">SLA vencido</span>` : `<span class="tag green">No prazo</span>`}
          </div>
        </div>
        <div class="dashboard-os-actions">${gestorActions}</div>
      </article>
    `;
  }

  function renderExecutionStep(number, label, stateLabel, done, blocked) {
    const className = blocked ? "block" : (done ? "done" : "");
    const tagClass = blocked ? "red" : (done ? "green" : "blue");
    return `
      <div class="operator-step ${className}">
        <span>${number}</span>
        <strong>${escapeHtml(label)}</strong>
        <em class="tag ${tagClass}">${escapeHtml(stateLabel)}</em>
      </div>
    `;
  }

  function renderAdminCommandCard(title, description, icon, view, buttonLabel) {
    return `
      <article class="admin-command-card">
        <span class="admin-command-icon">${matIcon(icon)}</span>
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
        </div>
        <button class="secondary-action" type="button" data-view="${escapeAttr(view)}">${escapeHtml(buttonLabel)}</button>
      </article>
    `;
  }

  function renderTraceabilityChain() {
    const steps = [
      ["Ativo físico", "precision_manufacturing"],
      ["QR Code", "qr_code_scanner"],
      ["OS", "assignment"],
      ["Checklist", "fact_check"],
      ["Evidência", "photo_camera"],
      ["Aprovação", "approval"],
      ["Histórico", "history"],
      ["Indicadores", "monitoring"]
    ];
    return `
      <article class="panel traceability-chain-card">
        <div class="panel-head">
          <div>
            <h3>Cadeia operacional rastreável</h3>
            <p class="small-note">Fluxo principal do SCS Control, do ativo físico até a decisão por indicadores.</p>
          </div>
          <span class="tag blue">Rastreabilidade</span>
        </div>
        <div class="traceability-chain">
          ${steps.map(([label, icon]) => `
            <div class="traceability-step">
              <span>${matIcon(icon)}</span>
              <strong>${escapeHtml(label)}</strong>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }

  function getPendingEvidenceItems() {
    return (state.data.checklist || []).filter((item) => checklistRequiresEvidenceNow(item) && !item.evidencia);
  }


  function renderOperationalTimelineStep(label, done) {
    return `
      <div class="operator-step ${done ? "done" : ""}">
        <span>${done ? matIcon("check") : matIcon("radio_button_unchecked")}</span>
        <strong>${escapeHtml(label)}</strong>
        <em class="tag ${done ? "green" : ""}">${done ? "OK" : "Pendente"}</em>
      </div>
    `;
  }

  function buildDashboardAnalytics() {
    const orders = state.data.ordens || [];
    const checklist = state.data.checklist || [];
    const equipamentos = (state.data.referencias && state.data.referencias.equipamentos) || [];
    const totalOs = orders.length;
    const base = Math.max(totalOs, 1);
    const finalStatuses = ["CONCLUIDA", "CANCELADA"];
    const abertas = orders.filter((os) => !finalStatuses.includes(os.status)).length;
    const concluidas = orders.filter((os) => os.status === "CONCLUIDA").length;
    const liberadas = orders.filter((os) => os.status === "LIBERADA").length;
    const emExecucao = orders.filter((os) => os.status === "EM_EXECUCAO").length;
    const backlog = orders.filter((os) => ["RASCUNHO", "PLANEJADA", "LIBERADA", "REABERTA"].includes(os.status)).length;
    const atrasadas = orders.filter(isLate).length;
    const aguardandoAprovacao = orders.filter((os) => os.status === "AGUARDANDO_APROVACAO").length;
    const critAbertas = orders.filter((os) => os.criticidade === "A" && !finalStatuses.includes(os.status)).length;
    const requiredChecklist = checklist.filter((item) => item.obrigatorio === true || item.obrigatorio === "TRUE");
    const answeredChecklist = requiredChecklist.filter((item) => Boolean(item.resposta));
    const checklistCompliance = percent(answeredChecklist.length, requiredChecklist.length);
    const produtividade = percent(concluidas, totalOs);
    const slaCompliance = percent(orders.filter((os) => !isLate(os)).length, totalOs);
    const mttrValues = orders
      .filter((os) => os.iniciado_em && os.finalizado_em)
      .map((os) => hoursBetween(os.iniciado_em, os.finalizado_em))
      .filter((value) => value >= 0);
    const mttr = roundOne(avg(mttrValues));
    const mtbf = roundOne(calculateMtbfDays(orders));
    const equipamentosInativos = equipamentos.filter((item) => item.status !== "ATIVO").length;
    const equipamentosInativosPct = percent(equipamentosInativos, equipamentos.length);
    const statusSeries = seriesFromCount(countBy(orders, "status"), STATUS_LABEL).slice(0, 8);
    const typeSeries = seriesFromCount(countBy(orders, "tipo")).slice(0, 6);
    const equipmentSeries = seriesFromCount(groupOrdersByEquipment(orders)).slice(0, 6);
    const riscoOperacional = Math.round(avg([
      percent(critAbertas, abertas),
      percent(atrasadas, abertas),
      percent(aguardandoAprovacao, abertas),
      equipamentosInativosPct
    ]));

    return {
      totalOs,
      abertas,
      abertasPct: percent(abertas, totalOs),
      liberadas,
      liberadasPct: percent(liberadas, totalOs),
      emExecucao,
      emExecucaoPct: percent(emExecucao, totalOs),
      backlog,
      backlogPct: percent(backlog, totalOs),
      atrasadas,
      atrasadasPct: percent(atrasadas, totalOs),
      aguardandoAprovacao,
      aprovacaoPct: percent(aguardandoAprovacao, totalOs),
      critAbertas,
      critAbertasPct: percent(critAbertas, totalOs),
      checklistCompliance,
      produtividade,
      slaCompliance,
      mttr,
      mttrScore: clampPercent(100 - Math.round(mttr * 4)),
      mtbf,
      mtbfScore: clampPercent(Math.round(mtbf * 4)),
      equipamentosInativos,
      equipamentosInativosPct,
      statusSeries,
      typeSeries,
      equipmentSeries,
      riscoOperacional: clampPercent(riscoOperacional)
    };
  }

  function extraDashboardKpis(perfil, analytics) {
    if (perfil === "Operador") {
      return [
        { label: "Aprovação", value: analytics.aguardandoAprovacao, hint: "Enviadas para validação", pct: analytics.aprovacaoPct, view: "minhas-os", status: "AGUARDANDO_APROVACAO" },
        { label: "SLA", value: `${analytics.slaCompliance}%`, hint: "Dentro do prazo", pct: analytics.slaCompliance, view: "minhas-os" }
      ];
    }
    return [
      { label: "Abertas", value: analytics.abertas, hint: "OS nao encerradas", pct: analytics.abertasPct, view: "gestao-os", quick: "abertas" },
      { label: "Aprovação", value: analytics.aguardandoAprovacao, hint: "Aguardando decisão", pct: analytics.aprovacaoPct, view: "acompanhamento", status: "AGUARDANDO_APROVACAO" },
      { label: "Atrasadas", value: analytics.atrasadas, hint: "Prazo vencido", pct: analytics.atrasadasPct, view: "acompanhamento", quick: "atrasadas" },
      { label: "SLA", value: `${analytics.slaCompliance}%`, hint: "Dentro do prazo", pct: analytics.slaCompliance, view: "relatorios" }
    ];
  }

  function renderKpiCard(config) {
    const item = Array.isArray(config)
      ? legacyKpiConfig(config)
      : config;
    const safePct = clampPercent(item.pct);
    const actionAttrs = item.view
      ? ` data-action="dashboard-filter" data-target-view="${escapeAttr(item.view)}" data-status="${escapeAttr(item.status || "")}" data-quick="${escapeAttr(item.quick || "")}" data-search="${escapeAttr(item.search || "")}"`
      : "";
    return `
      <article class="kpi-card${item.view ? " interactive-card" : ""}"${actionAttrs}>
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <small>${escapeHtml(item.hint)}</small>
        <div class="kpi-bar" aria-hidden="true"><i style="width:${safePct}%"></i></div>
      </article>
    `;
  }

  function renderStaticInfoCard(config) {
    const safePct = clampPercent(config.pct);
    return `
      <article class="kpi-card static-info-card">
        <span>${escapeHtml(config.label)}</span>
        <strong>${escapeHtml(config.value)}</strong>
        <small>${escapeHtml(config.hint)}</small>
        <div class="kpi-bar" aria-hidden="true"><i style="width:${safePct}%"></i></div>
      </article>
    `;
  }

  function legacyKpiConfig(row) {
    const label = row[0];
    const target = {
      Backlog: { view: "gestao-os", quick: "backlog" },
      Compliance: { view: "relatorios" },
      MTTR: { view: "relatorios" },
      MTBF: { view: "relatorios" },
      Atraso: { view: state.session.perfil === "Operador" ? "minhas-os" : "acompanhamento", quick: "atrasadas" },
      Produtividade: { view: "relatorios" },
      Checklist: { view: state.session.perfil === "Operador" ? "minhas-os" : "relatorios" }
    }[label] || { view: state.session.perfil === "Operador" ? "minhas-os" : "gestao-os", quick: "abertas" };
    return {
      label,
      value: row[1],
      hint: row[2],
      pct: row[3],
      ...target
    };
  }

  function renderBarList(series, mode) {
    if (!series.length) return `<div class="empty-state">Sem dados suficientes para calcular.</div>`;
    return `
      <div class="bar-list">
        ${series.map((item) => `
          <button class="bar-row interactive-row" type="button" data-action="dashboard-filter" data-target-view="${mode === "status" ? "acompanhamento" : "gestao-os"}" data-status="${mode === "status" ? escapeAttr(item.key) : ""}" data-search="${mode === "search" ? escapeAttr(item.label) : ""}">
            <div>
              <strong>${escapeHtml(item.label)}</strong>
              <span>${item.value} registros</span>
            </div>
            <div class="bar-track"><i style="width:${clampPercent(item.percent)}%"></i></div>
            <b>${item.percent}%</b>
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderDonut(label, pct) {
    const safePct = clampPercent(pct);
    return `
      <div class="donut-card">
        <div class="donut-chart" style="--pct:${safePct}"><span>${safePct}%</span></div>
        <strong>${escapeHtml(label)}</strong>
      </div>
    `;
  }

  function renderRiskItem(label, value, pct) {
    const safePct = clampPercent(pct);
    return `
      <div class="risk-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <div class="kpi-bar danger" aria-hidden="true"><i style="width:${safePct}%"></i></div>
      </div>
    `;
  }

  function renderOsListView(view) {
    const showCreate = view === "gestao-os" && can("criar_os");
    const orders = filteredOrdersForView(view);
    const createOpen = showCreate && Boolean(state.createOsPrefillAtivoId);
    const titleAction = view === "gestao-os" && can("criar_os")
      ? `<button class="primary-action" type="button" data-action="toggle-create-os">${matIcon("add_task")} Criar OS</button>`
      : "";
    const createPanel = showCreate ? renderCreateOsForm() : "";
    const statusCounters = Object.keys(STATUS_LABEL).map((status) => ({
      status,
      count: filteredOrdersForView(view).filter((os) => os.status === status).length
    })).filter((item) => item.count || state.statusFilter === item.status);

    return `
      ${viewHeader(titleAction)}
      <section class="operational-page">
        <article class="panel operation-toolbar">
          <div>
            <span class="section-kicker">Centro de operação</span>
            <h3>${view === "minhas-os" ? "Minhas Ordens de Servico" : "Gestao de Ordens de Servico"}</h3>
            <p class="muted">Busca, filtro por status, prioridade e acesso rapido ao detalhe operacional.</p>
          </div>
          <div class="toolbar-controls">
            <input class="grow" type="search" placeholder="Filtrar por OS, equipamento, status ou prioridade" value="${escapeAttr(state.search)}" data-action="search-os">
            <select data-action="filter-status" aria-label="Filtrar por status">
              <option value="">Todos os status</option>
              ${Object.keys(STATUS_LABEL).map((status) => `<option value="${status}" ${state.statusFilter === status ? "selected" : ""}>${STATUS_LABEL[status]}</option>`).join("")}
            </select>
          </div>
          <div class="status-filter-strip">
            <button class="${!state.statusFilter ? "active" : ""}" type="button" data-action="filter-status-chip" data-status="">Todos <b>${orders.length}</b></button>
            ${statusCounters.map((item) => `<button class="${state.statusFilter === item.status ? "active" : ""}" type="button" data-action="filter-status-chip" data-status="${escapeAttr(item.status)}">${escapeHtml(STATUS_LABEL[item.status])} <b>${item.count}</b></button>`).join("")}
          </div>
        </article>

        <div id="create-os-panel" class="${showCreate ? `panel create-os-panel ${createOpen ? "" : "hidden"}` : "hidden"}">${createPanel}</div>
        <div id="os-list-results">${renderOsCards(orders)}</div>
      </section>
    `;
  }

  function renderCreateOsForm() {
    const refs = state.data.referencias;
    const ativos = refs.equipamentos.filter((item) => item.status === "ATIVO");
    const prefillAtivo = getAtivo(state.createOsPrefillAtivoId);
    const operadores = refs.usuarios.filter((item) => item.perfil === "Operador" && item.status === "ATIVO");
    const tiposOs = unique(["Corretiva", "Preventiva", "Inspecao"].concat((refs.checklist_modelos || []).map((item) => item.tipo_os).filter(Boolean)));
    const modelos = (refs.checklist_modelos || []).filter((item) => item.status === "ATIVO");
    const modeloItens = refs.checklist_modelo_itens || [];
    return `
      <h3>Criar OS</h3>
      ${prefillAtivo.id ? `<p class="small-note">Origem QR: ${escapeHtml(prefillAtivo.nome)} (${escapeHtml(prefillAtivo.id)})</p>` : ""}
      <form id="create-os-form" class="form-grid form-sectioned">
        <div class="two-col">
          <label>Equipamento
            <select name="ativo_id" required>
              <option value="">Selecione</option>
              ${ativos.map((item) => `<option value="${escapeAttr(item.id)}" ${item.id === state.createOsPrefillAtivoId ? "selected" : ""}>${escapeHtml(item.nome)} - ${escapeHtml(item.criticidade)}</option>`).join("")}
            </select>
          </label>
          <label>Componente
            <select name="componente_id">
              <option value="">Sem componente</option>
              ${refs.componentes.filter((item) => item.status === "ATIVO").map((item) => `<option value="${escapeAttr(item.id)}" data-equipment="${escapeAttr(item.equipamento_id)}">${escapeHtml(item.nome)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="two-col">
          <label>Tipo
            <select name="tipo" required>
              ${tiposOs.map((tipo) => `<option>${escapeHtml(tipo)}</option>`).join("")}
            </select>
          </label>
          <label>Modelo de checklist
            <select name="checklist_modelo_id">
              <option value="">Automatico pelo tipo</option>
              ${modelos.map((modelo) => {
                const total = modeloItens.filter((item) => item.modelo_id === modelo.id && item.status === "ATIVO").length;
                return `<option value="${escapeAttr(modelo.id)}">${escapeHtml(modelo.nome)} - ${escapeHtml(modelo.tipo_os)} (${total} itens)</option>`;
              }).join("")}
            </select>
          </label>
        </div>
        <div class="three-col">
          <label>Prioridade
            <select name="prioridade" required>
              <option value="">Selecione</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baixa</option>
            </select>
          </label>
          <label>Prazo
            <input name="prazo" type="date" required>
          </label>
          <label>Responsável
            <select name="responsavel">
              <option value="">Definir depois</option>
              ${operadores.map((item) => `<option value="${escapeAttr(item.id)}">${escapeHtml(item.nome)}</option>`).join("")}
            </select>
          </label>
        </div>
        <label>Descrição
          <textarea name="descricao" required></textarea>
        </label>
        <label>Instruções
          <textarea name="instrucoes"></textarea>
        </label>
        <div class="footer-actions">
          <button class="ghost-action" type="submit" name="modo" value="RASCUNHO">Salvar rascunho</button>
          <button class="secondary-action" type="submit" name="modo" value="PLANEJAR">Planejar</button>
          <button class="primary-action" type="submit" name="modo" value="LIBERAR">Liberar OS</button>
        </div>
      </form>
    `;
  }

  function renderOsCards(orders) {
    if (!orders.length) {
      return `<div class="empty-state">Nenhuma OS encontrada para o filtro atual.</div>`;
    }
    return `
      <div class="os-list operational-os-list">
        ${orders.map((os) => {
          const ativo = getAtivo(os.ativo_id);
          const componente = getComponente(os.componente_id);
          const late = isLate(os);
          const critical = os.criticidade === "A";
          const checklist = getChecklist(os.id);
          const checklistDone = checklist.filter((item) => item.resposta).length;
          const checklistPct = percent(checklistDone, checklist.length);
          return `
            <article class="os-card operational-os-card os-status-${escapeAttr(String(os.status || "").toLowerCase().replaceAll("_", "-"))} ${late || critical ? "os-card-critical" : ""}">
              <div class="os-card-main">
                <div class="os-card-title-line">
                  <span class="os-number">${escapeHtml(os.id)}</span>
                  ${statusTag(os.status)}
                </div>
                <h3>${escapeHtml(os.tipo || "Ordem de Servico")}</h3>
                <p class="os-card-subtitle">${escapeHtml(ativo.nome || os.ativo_id || "-")}${componente.nome ? " / " + escapeHtml(componente.nome) : ""}</p>
                <div class="inline-meta">
                  <span class="tag ${critical ? "red" : "blue"}">Criticidade ${escapeHtml(os.criticidade || "-")}</span>
                  <span class="tag">Prioridade ${escapeHtml(os.prioridade || "-")}</span>
                  <span class="tag ${late ? "red" : "green"}">Prazo ${escapeHtml(os.prazo || "-")}</span>
                  <span class="tag ${checklistPct === 100 ? "green" : "amber"}">Checklist ${checklistPct}%</span>
                </div>
              </div>
              <div class="os-card-side">
                <div class="mini-progress"><i style="width:${checklistPct}%"></i></div>
                <button class="primary-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}">${matIcon("visibility")} Abrir OS</button>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderOsDetail() {
    const os = getOs(state.selectedOsId);
    if (!os) {
      return `${viewHeader()}<div class="empty-state">OS nao encontrada.</div>`;
    }
    const ativo = getAtivo(os.ativo_id);
    const componente = getComponente(os.componente_id);
    const responsavel = getUser(os.responsavel);
    const solicitante = getUser(os.solicitante);
    const checklist = getChecklist(os.id);
    const historico = getHistórico(os.id);
    const eventos = getEventos(os.id);
    const modeloChecklist = getChecklistModel(os.checklist_modelo_id);
    const validation = validateLocalChecklist(os.id);
    const answered = checklist.filter((item) => item.resposta).length;
    const checklistPct = percent(answered, checklist.length);

    return `
      ${viewHeader(`<button class="ghost-action" type="button" data-view="${escapeAttr(state.lastListView)}">${matIcon("arrow_back")} Voltar</button>`)}
      <section class="os-detail-page">
        <article class="panel os-detail-hero ${isLate(os) ? "is-critical" : ""}">
          <div>
            <span class="section-kicker">Detalhe operacional da OS</span>
            <div class="os-detail-title">
              <h2>${escapeHtml(os.id)} · ${escapeHtml(os.tipo || "OS")}</h2>
              ${statusTag(os.status)}
            </div>
            <p>${escapeHtml(ativo.nome || os.ativo_id || "-")}${componente.nome ? " / " + escapeHtml(componente.nome) : ""}</p>
            <div class="inline-meta">
              <span class="tag ${os.criticidade === "A" ? "red" : "blue"}">Criticidade ${escapeHtml(os.criticidade || "-")}</span>
              <span class="tag">Prioridade ${escapeHtml(os.prioridade || "-")}</span>
              <span class="tag ${isLate(os) ? "red" : "green"}">Prazo ${escapeHtml(os.prazo || "-")}</span>
              <span class="tag ${validation.valido ? "green" : "amber"}">Checklist ${checklistPct}%</span>
            </div>
          </div>
          <div class="os-detail-actions">
            ${renderOsActions(os)}
          </div>
        </article>

        <div class="os-detail-grid mobile-os-detail-grid">
          ${mobileAdaptiveDetails("Ficha da OS", "Ativo, componente, prazo e responsáveis", `
            <section class="panel mobile-inner-panel">
              <div class="panel-head">
                <div>
                  <h3>Ficha da Ordem de Serviço</h3>
                  <p class="muted">Dados principais para execução, aprovação e rastreabilidade.</p>
                </div>
                <span class="tag blue">${escapeHtml(modeloChecklist.nome || os.checklist_modelo_id || "Checklist automático")}</span>
              </div>
              <dl class="data-list operational-data-list">
                ${dataRow("Ativo", ativo.nome || os.ativo_id)}
                ${dataRow("Componente", componente.nome || os.componente_id || "-")}
                ${dataRow("Modelo de checklist", modeloChecklist.nome ? `${modeloChecklist.nome} (${modeloChecklist.tipo_os})` : (os.checklist_modelo_id || "Automático"))}
                ${dataRow("Descrição", os.descricao || "-")}
                ${dataRow("Instruções", os.instrucoes || "-")}
                ${dataRow("Solicitante", solicitante.nome || os.solicitante)}
                ${dataRow("Responsável", responsavel.nome || os.responsavel || "-")}
                ${dataRow("Prioridade", os.prioridade || "-")}
                ${dataRow("Criticidade", os.criticidade || "-")}
                ${dataRow("Prazo", os.prazo || "-")}
              </dl>
            </section>
          `, "os-mobile-ficha", false)}

          ${mobileAdaptiveDetails("Progresso e validação", `${checklistPct}% · ${validation.valido ? "Checklist OK" : "Pendente"}`, `
            <aside class="panel os-progress-panel mobile-inner-panel">
              <div class="panel-head">
                <h3>Progresso da OS</h3>
                <span class="tag ${validation.valido ? "green" : "amber"}">${validation.valido ? "Checklist OK" : "Pendente"}</span>
              </div>
              <div class="os-progress-meter">
                <strong>${checklistPct}%</strong>
                <div class="mini-progress"><i style="width:${checklistPct}%"></i></div>
                <small>${answered}/${checklist.length} itens respondidos</small>
              </div>
              <div class="stepper-list">
                ${renderOperationalTimelineStep("Planejada", ["PLANEJADA", "LIBERADA", "EM_EXECUCAO", "AGUARDANDO_APROVACAO", "CONCLUIDA"].includes(os.status))}
                ${renderOperationalTimelineStep("Liberada", ["LIBERADA", "EM_EXECUCAO", "AGUARDANDO_APROVACAO", "CONCLUIDA"].includes(os.status))}
                ${renderOperationalTimelineStep("Em execução", ["EM_EXECUCAO", "AGUARDANDO_APROVACAO", "CONCLUIDA"].includes(os.status))}
                ${renderOperationalTimelineStep("Aguardando aprovação", ["AGUARDANDO_APROVACAO", "CONCLUIDA"].includes(os.status))}
                ${renderOperationalTimelineStep("Concluída", os.status === "CONCLUIDA")}
              </div>
            </aside>
          `, "os-mobile-progress", true)}
        </div>

        ${mobileAdaptiveDetails("Checklist técnico", `${validation.valido ? "Completo" : `${validation.pendencias.length} pendência(s)`}`, `
          <section class="panel checklist-execution-panel mobile-inner-panel">
            <div class="panel-head">
              <div>
                <h3>Checklist técnico</h3>
                <p class="muted">Itens obrigatórios, evidências e validações da execução.</p>
              </div>
              <span class="tag ${validation.valido ? "green" : "amber"}">${validation.valido ? "Completo" : `${validation.pendencias.length} pendência(s)`}</span>
            </div>
            <div class="checklist-list operational-checklist-list">
              ${checklist.map((item) => renderChecklistItem(item, os)).join("") || `<div class="empty-state">Nenhum item de checklist vinculado.</div>`}
            </div>
          </section>
        `, "os-mobile-checklist", true)}

        <div class="os-detail-grid mobile-os-detail-grid">
          ${mobileAdaptiveDetails("Eventos", `${eventos.length} registro(s)`, `
            <section class="panel mobile-inner-panel">
              <div class="panel-head">
                <h3>Eventos</h3>
                <span class="tag">${eventos.length}</span>
              </div>
              ${renderEventList(eventos)}
            </section>
          `, "os-mobile-events", false)}
          ${mobileAdaptiveDetails("Histórico", `${historico.length} registro(s)`, `
            <section class="panel mobile-inner-panel">
              <div class="panel-head">
                <h3>Histórico</h3>
                <span class="tag">${historico.length}</span>
              </div>
              ${renderHistoryList(historico)}
            </section>
          `, "os-mobile-history", false)}
        </div>
      </section>
    `;
  }

  function renderOsActions(os) {
    const actions = [];
    if (canWorkflowAction("INICIAR_OS", os)) {
      actions.push(`<button class="primary-action" type="button" data-action="iniciar-os" data-os-id="${escapeAttr(os.id)}">${matIcon("play_arrow")} Iniciar OS</button>`);
    }
    if (canChecklist(os)) {
      actions.push(`<button class="secondary-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}">${matIcon("fact_check")} Abrir Checklist</button>`);
    }
    if (canWorkflowAction("FINALIZAR_EXECUCAO", os)) {
      actions.push(`<button class="primary-action" type="button" data-action="finalizar-os" data-os-id="${escapeAttr(os.id)}">${matIcon("task_alt")} Finalizar execução</button>`);
    }
    if (canWorkflowAction("APROVAR_OS", os)) {
      actions.push(`<button class="primary-action" type="button" data-action="aprovar-os" data-os-id="${escapeAttr(os.id)}">${matIcon("check_circle")} Aprovar</button>`);
    }
    if (canWorkflowAction("REABRIR_OS", os)) {
      actions.push(`<button class="danger-action" type="button" data-action="reabrir-os" data-os-id="${escapeAttr(os.id)}">${matIcon("undo")} Reabrir</button>`);
    }
    actions.push(`<button class="ghost-action" type="button" data-view="notificacoes">${matIcon("report_problem")} Reportar problema</button>`);
    if (!actions.length) {
      return `<div class="footer-actions"><span class="tag">Nenhuma ação disponível para o status atual</span></div>`;
    }
    return `<div class="footer-actions os-action-bar">${actions.join("")}</div>`;
  }

  function renderChecklistItem(item, os) {
    const disabled = os.status !== "EM_EXECUCAO" || !canChecklist(os);
    const tipo = normalizeChecklistType(item.tipo_resposta);
    const statusItem = calculateChecklistItemStatus(item);
    const respostaClass = statusItem.classe;
    const evidenceRequired = checklistRequiresEvidenceNow(item);
    const observationRequired = checklistRequiresObservationNow(item);
    const expected = item.valor_esperado || (item.valor_min || item.valor_max ? `${item.valor_min || "-"} a ${item.valor_max || "-"} ${item.unidade || ""}` : "Conforme padrão técnico");
    return `
      <article class="checklist-item operational-checklist-item quality-inspection-item checklist-${escapeAttr(respostaClass)}" data-checklist-id="${escapeAttr(item.id)}" data-response-type="${escapeAttr(tipo)}" data-resposta="${escapeAttr(item.resposta || "")}">
        <div class="quality-inspection-head">
          <div>
            <span class="checklist-code">${escapeHtml(item.item_id)}</span>
            <h3>${escapeHtml(item.pergunta)}</h3>
            <div class="checklist-meta-line quality-inspection-meta">
              <span class="tag blue">${escapeHtml(displayChecklistType(tipo))}</span>
              <span class="tag ${asBool(item.obrigatorio) ? "amber" : ""}">${asBool(item.obrigatorio) ? "Obrigatório" : "Opcional"}</span>
              ${asBool(item.critico) ? `<span class="tag red">Crítico</span>` : ""}
              ${statusItem.label ? `<span class="tag ${escapeAttr(statusItem.tag)}">${escapeHtml(statusItem.label)}</span>` : ""}
            </div>
          </div>
          <div class="quality-status-block ${escapeAttr(statusItem.classe)}">
            <span>Status do item</span>
            <strong>${escapeHtml(statusItem.label || "Pendente")}</strong>
          </div>
        </div>
        <div class="quality-expected-row">
          <div>
            <span>Resposta esperada</span>
            <strong>${escapeHtml(expected)}</strong>
          </div>
          <div>
            <span>Resposta registrada</span>
            <strong>${escapeHtml(item.resposta ? String(item.resposta).replace(/_/g, " ") : "Pendente")}</strong>
          </div>
        </div>
        ${mobileAdaptiveDetails("Responder item", `${statusItem.label || "Pendente"} · ${asBool(item.obrigatorio) ? "Obrigatório" : "Opcional"}`, `
          <div class="checklist-response-box quality-response-box">
            ${renderChecklistResponseControl(item, tipo, disabled)}
          </div>
          <div class="two-col evidence-observation-grid quality-evidence-grid">
            <label class="quality-observation-field">Observação técnica ${observationRequired ? `<span class="tag amber">Exigida</span>` : `<span class="tag">Opcional</span>`}
              <textarea data-field="observacao" placeholder="Registre condição encontrada, desvio, causa provável ou referência técnica." ${disabled ? "disabled" : ""}>${escapeHtml(item.observacao || "")}</textarea>
              <small>${observationRequired ? "Observação exigida pela regra configurada." : "Use quando houver desvio, ajuste ou informação relevante."}</small>
            </label>
            <label class="evidence-field quality-evidence-field">${escapeHtml(checklistEvidenceTitle(item))}
              <input type="hidden" data-field="evidencia" value="${escapeAttr(item.evidencia || "")}">
              <span class="evidence-control">
                <input class="evidence-file-input" data-field="evidencia_file" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" capture="environment" ${disabled ? "disabled" : ""}>
                <span data-evidence-name>${escapeHtml(item.evidencia || "Nenhum arquivo vinculado")}</span>
              </span>
              <small>${evidenceRequired ? checklistEvidenceHelper(item) : "Foto, arquivo ou registro técnico vinculado à OS."}</small>
            </label>
          </div>
          <div class="footer-actions checklist-footer quality-checklist-footer">
            <button class="secondary-action" type="button" data-action="save-checklist" ${disabled ? "disabled" : ""}>${matIcon("save")} Salvar checklist</button>
            ${item.responsavel ? `<span class="tag green">Respondido</span>` : `<span class="tag amber">Pendente</span>`}
            ${evidenceRequired ? `<span class="tag blue">Evidência exigida</span>` : ""}
            ${observationRequired ? `<span class="tag amber">Observação exigida</span>` : ""}
          </div>
        `, "checklist-item-detail", !item.resposta)}
      </article>
    `;
  }

  function normalizeChecklistType(value) {
    const allowed = ["OK_NOK", "OK_NOK_NA", "TEXTO", "NUMERICO", "SELECT", "DATA", "FOTO", "LEITURA_TECNICA"];
    const normalized = String(value || "OK_NOK").trim().toUpperCase();
    return allowed.includes(normalized) ? normalized : "OK_NOK";
  }

  function displayChecklistType(tipo) {
    const normalized = normalizeChecklistType(tipo);
    const labels = {
      OK_NOK: "Tipo: OK/NOK",
      OK_NOK_NA: "Tipo: OK/NOK/N.A.",
      TEXTO: "Tipo: Texto",
      NUMERICO: "Tipo: Numérico",
      SELECT: "Tipo: Seleção",
      DATA: "Tipo: Data",
      FOTO: "Tipo: Foto",
      LEITURA_TECNICA: "Tipo: Leitura técnica"
    };
    return labels[normalized] || `Tipo: ${normalized.replace(/_/g, " ")}`;
  }

  function checklistEvidenceTitle(item) {
    const regra = String(item.evidencia_regra || (asBool(item.evidencia_obrigatoria) ? "SEMPRE" : "SE_NOK")).toUpperCase();
    if (regra === "SE_NOK") return "Evidência técnica exigida para NOK";
    if (regra === "FORA_LIMITE") return "Evidência técnica exigida fora do limite";
    if (regra === "SE_OUTRO") return "Evidência técnica exigida para opção Outro";
    if (regra === "SEMPRE") return "Evidência técnica obrigatória";
    return "Prova técnica da execução";
  }

  function checklistEvidenceHelper(item) {
    const regra = String(item.evidencia_regra || (asBool(item.evidencia_obrigatoria) ? "SEMPRE" : "SE_NOK")).toUpperCase();
    if (regra === "SE_NOK") return "Evidência técnica exigida para NOK.";
    if (regra === "FORA_LIMITE") return "Evidência técnica exigida quando a leitura estiver fora do limite.";
    if (regra === "SE_OUTRO") return "Evidência técnica exigida quando a opção Outro for selecionada.";
    if (regra === "SEMPRE") return "Evidência técnica obrigatória para este item.";
    return "Evidência exigida para validar este item.";
  }

  function splitChecklistOptions(value) {
    return String(value || "").split(/[;\n,]/).map((item) => item.trim()).filter(Boolean);
  }

  function renderChecklistResponseControl(item, tipo, disabled) {
    if (tipo === "OK_NOK" || tipo === "OK_NOK_NA") {
      const values = tipo === "OK_NOK" ? ["OK", "NAO_OK"] : ["OK", "NAO_OK", "N_A"];
      return `<div class="segmented" role="group" aria-label="Resposta do checklist">
        ${values.map((value) => `<button type="button" class="${item.resposta === value ? "active" : ""}" data-action="set-checklist-response" data-value="${value}" ${disabled ? "disabled" : ""}>${value.replace("_", " ")}</button>`).join("")}
      </div>`;
    }
    if (tipo === "NUMERICO" || tipo === "LEITURA_TECNICA") {
      return `<label class="checklist-dynamic-field">Valor medido ${item.unidade ? `(${escapeHtml(item.unidade)})` : ""}
        <input type="number" step="any" data-field="resposta" value="${escapeAttr(item.resposta || "")}" placeholder="Informe o valor" ${disabled ? "disabled" : ""}>
        <small>${item.valor_min || item.valor_max ? `Faixa aceitável: ${escapeHtml(item.valor_min || "-")} a ${escapeHtml(item.valor_max || "-")} ${escapeHtml(item.unidade || "")}` : "Sem limite configurado"}</small>
      </label>`;
    }
    if (tipo === "SELECT") {
      const opts = splitChecklistOptions(item.opcoes);
      const current = item.resposta || "";
      return `<label class="checklist-dynamic-field">Selecionar opção
        <select data-field="resposta" ${disabled ? "disabled" : ""}>
          <option value="">Selecione...</option>
          ${opts.map((opt) => `<option value="${escapeAttr(opt)}" ${current === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`).join("")}
          ${opts.includes("Outro") ? "" : `<option value="Outro" ${current === "Outro" ? "selected" : ""}>Outro</option>`}
        </select>
      </label>`;
    }
    if (tipo === "DATA") {
      return `<label class="checklist-dynamic-field">Data
        <input type="date" data-field="resposta" value="${escapeAttr(item.resposta || "")}" ${disabled ? "disabled" : ""}>
      </label>`;
    }
    if (tipo === "FOTO") {
      return `<input type="hidden" data-field="resposta" value="${escapeAttr(item.resposta || "FOTO")}"><span class="tag blue">Resposta por evidência</span>`;
    }
    return `<label class="checklist-dynamic-field">Resposta
      <textarea data-field="resposta" ${disabled ? "disabled" : ""}>${escapeHtml(item.resposta || "")}</textarea>
    </label>`;
  }

  function checklistEvidenceLabel(item) {
    const regra = String(item.evidencia_regra || (asBool(item.evidencia_obrigatoria) ? "SEMPRE" : "SE_NOK")).toUpperCase();
    if (regra === "SEMPRE") return "obrigatória";
    if (regra === "SE_NOK") return "se NOK";
    if (regra === "FORA_LIMITE") return "se fora do limite";
    if (regra === "SE_OUTRO") return "se Outro";
    return "";
  }

  function checklistValueOutOfRange(item) {
    const tipo = normalizeChecklistType(item.tipo_resposta);
    if (tipo !== "NUMERICO" && tipo !== "LEITURA_TECNICA") return false;
    if (item.resposta === "" || item.resposta === undefined || item.resposta === null) return false;
    const value = Number(String(item.resposta).replace(",", "."));
    if (!Number.isFinite(value)) return true;
    const min = item.valor_min !== "" && item.valor_min !== undefined && item.valor_min !== null ? Number(String(item.valor_min).replace(",", ".")) : null;
    const max = item.valor_max !== "" && item.valor_max !== undefined && item.valor_max !== null ? Number(String(item.valor_max).replace(",", ".")) : null;
    return (min !== null && Number.isFinite(min) && value < min) || (max !== null && Number.isFinite(max) && value > max);
  }

  function checklistRequiresEvidenceNow(item) {
    const regra = String(item.evidencia_regra || (asBool(item.evidencia_obrigatoria) ? "SEMPRE" : "NUNCA")).toUpperCase();
    if (regra === "SEMPRE") return true;
    if (regra === "SE_NOK") return item.resposta === "NAO_OK";
    if (regra === "FORA_LIMITE") return checklistValueOutOfRange(item);
    if (regra === "SE_OUTRO") return String(item.resposta || "") === "Outro";
    return false;
  }

  function checklistRequiresObservationNow(item) {
    const regra = String(item.observacao_regra || "NUNCA").toUpperCase();
    if (regra === "SE_NOK") return item.resposta === "NAO_OK";
    if (regra === "FORA_LIMITE") return checklistValueOutOfRange(item);
    if (regra === "SE_OUTRO") return String(item.resposta || "") === "Outro";
    return false;
  }

  function calculateChecklistItemStatus(item) {
    if (!item.resposta) return { classe: "pendente", tag: "amber", label: "Pendente" };
    if (item.resposta === "NAO_OK" || (asBool(item.critico) && item.resposta === "NAO_OK")) return { classe: "nao-ok", tag: "red", label: "NOK" };
    if (checklistValueOutOfRange(item)) return { classe: "alerta", tag: "amber", label: "Fora do limite" };
    return { classe: "ok", tag: "green", label: "OK" };
  }

  function renderHistóricoPessoal() {
    const ids = new Set(state.data.ordens.filter((os) => os.responsavel === state.session.usuario.id).map((os) => os.id));
    const items = state.data.historico.filter((item) => ids.has(item.os_id));
    return `${viewHeader()}<section class="panel">${renderHistoryList(items)}</section>`;
  }

  function renderComunicacoes() {
    return renderEventCenter();
  }

  function renderMeuPerfil() {
    const user = state.session.usuario;
    return `
      ${viewHeader()}
      <section class="panel">
        <dl class="data-list">
          ${dataRow("Nome", user.nome)}
          ${dataRow("Email", user.email)}
          ${dataRow("Perfil", user.perfil)}
          ${dataRow("Status", user.status)}
          ${dataRow("Setor", getSetor(user.setor).nome || user.setor || "-")}
        </dl>
      </section>
    `;
  }

  function renderIndicadores() {
    const orders = state.data.ordens || [];
    const total = orders.length;
    const concluidas = orders.filter((os) => os.status === "CONCLUIDA").length;
    const abertas = orders.filter((os) => !["CONCLUIDA", "CANCELADA"].includes(os.status)).length;
    const atrasadas = orders.filter(isLate).length;
    const prioridade = countBy(orders, "prioridade");
    const status = countBy(orders, "status");
    const criticidade = countBy(orders, "criticidade");
    return `
      ${viewHeader()}
      <section class="route-shell route-indicadores">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">PCM operacional</span>
            <h2>Indicadores</h2>
            <p>Métricas operacionais derivadas das ordens de serviço e execução.</p>
          </div>
          <span class="tag blue">Painel operacional</span>
        </section>
        <section class="cards-grid route-metric-grid">
          <article class="metric-card"><span>OS totais</span><strong>${total}</strong></article>
          <article class="metric-card"><span>Abertas</span><strong>${abertas}</strong></article>
          <article class="metric-card"><span>Concluídas</span><strong>${concluidas}</strong></article>
          <article class="metric-card"><span>Atrasadas</span><strong>${atrasadas}</strong></article>
        </section>
        <div class="route-two-col">
          <section class="panel">
            <h3>Status operacional</h3>
            ${renderBarList(seriesFromCount(status, STATUS_LABEL), "status")}
          </section>
          <section class="panel">
            <h3>Prioridade</h3>
            ${renderBarList(seriesFromCount(prioridade), "search")}
          </section>
          <section class="panel">
            <h3>Criticidade</h3>
            ${renderBarList(seriesFromCount(criticidade), "priority_high")}
          </section>
        </div>
      </section>
    `;
  }

  function renderRelatoriosGerenciais() {
    const orders = state.data.ordens || [];
    const total = orders.length;
    const concluidas = orders.filter((os) => os.status === "CONCLUIDA").length;
    const abertas = orders.filter((os) => !["CONCLUIDA", "CANCELADA"].includes(os.status)).length;
    const atrasadas = orders.filter(isLate).length;
    const aguardando = orders.filter((os) => os.status === "AGUARDANDO_APROVACAO").length;
    const prioridade = countBy(orders, "prioridade");
    const status = countBy(orders, "status");
    const checklistStats = getQualityTechnicalStats();
    return `
      ${viewHeader()}
      <section class="route-shell route-relatorios">
        <section class="route-hero executive">
          <div>
            <span class="section-kicker">Gestão consolidada</span>
            <h2>Relatórios Gerenciais</h2>
            <p>Consolidação executiva de performance, backlog e qualidade operacional.</p>
          </div>
          <span class="tag blue">Resumo executivo</span>
        </section>
        <section class="executive-summary-grid">
          ${renderExecutiveSummaryCard("Backlog aberto", abertas, `${percent(abertas, total)}% das OS`)}
          ${renderExecutiveSummaryCard("Conclusão", concluidas, `${percent(concluidas, total)}% concluídas`)}
          ${renderExecutiveSummaryCard("Atrasos", atrasadas, "OS fora do prazo")}
          ${renderExecutiveSummaryCard("Aprovações", aguardando, "Decisões pendentes")}
          ${renderExecutiveSummaryCard("Qualidade técnica", checklistStats.nonConformities.length, "Não conformidades identificáveis")}
        </section>
        <div class="route-two-col executive-panels">
          <section class="panel"><h3>Distribuição por status</h3>${renderBarList(seriesFromCount(status, STATUS_LABEL), "status")}</section>
          <section class="panel"><h3>Distribuição por prioridade</h3>${renderBarList(seriesFromCount(prioridade), "priority_high")}</section>
        </div>
      </section>
    `;
  }

  function renderExecutiveSummaryCard(label, value, detail) {
    return `
      <article class="executive-summary-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(String(value))}</strong>
        <small>${escapeHtml(detail)}</small>
      </article>
    `;
  }

  function renderCadastros() {
    if (state.view === "componentes") return renderComponentesIndustriaisRoute();
    if (state.view === "acompanhamento-ativos") return renderAcompanhamentoAtivosRoute();
    if (state.view === "cadastros") return renderCadastrosOperacionaisRoute();
    return renderAtivosIndustriaisRoute();
  }

  function renderAtivosIndustriaisRoute() {
    const refs = state.data.referencias;
    const canEdit = can("cadastrar_equipamento");
    const stats = buildAssetTraceabilityStats(refs);
    return `
      ${viewHeader()}
      <section class="asset-map-shell route-shell route-ativos-industriais">
        <section class="route-hero compact">
          <div>
            <span class="asset-kicker">Rastreabilidade por QR Code</span>
            <h2>Ativos Industriais</h2>
            <p>Equipamentos, criticidade, QR Code, OS vinculadas e histórico técnico.</p>
          </div>
          ${canEdit ? `<button class="primary-action" type="button" data-view="cadastros">Adicionar novo equipamento</button>` : `<span class="tag blue">Consulta</span>`}
        </section>
        <section class="asset-map-metrics">
          ${renderAssetTraceMetric("Ativos cadastrados", stats.equipamentos.length, "Equipamentos na base mestre", "blue")}
          ${renderAssetTraceMetric("Ativos críticos", stats.ativosCríticos.length, stats.ativosCríticos.length ? "Criticidade A registrada" : "Nenhuma ação crítica no momento", stats.ativosCríticos.length ? "red" : "green")}
          ${renderAssetTraceMetric("Ativos inativos", stats.ativosInativos.length, stats.ativosInativos.length ? "Consulta e histórico preservados" : "Sem registros disponíveis", stats.ativosInativos.length ? "amber" : "green")}
          ${renderAssetTraceMetric("Ativos com QR Code", stats.hasQrField ? stats.comQr : "—", stats.hasQrField ? "Identificador cadastrado" : "Rastreabilidade por ID disponível", "blue")}
        </section>
        ${renderAssetOperationalChain()}
        <section class="panel">
          <div class="panel-head">
            <div><h3>Equipamentos industriais</h3><p class="muted">Cards focados em criticidade, status, localização, QR Code e ações operacionais.</p></div>
            <span class="tag blue">${stats.equipamentos.length} ativos</span>
          </div>
          ${renderIndustrialEquipmentCards(refs.equipamentos || [], refs)}
        </section>
      </section>
    `;
  }


  function renderCriticalityPill(value) {
    const label = String(value || "-").toUpperCase();
    const tone = label === "A" || label === "CRITICA" || label === "CRÍTICA" ? "red" : label === "B" ? "amber" : "blue";
    return `<span class="tag ${tone}">Criticidade ${escapeHtml(label)}</span>`;
  }

  function renderIndustrialEquipmentCards(equipamentos, refs) {
    if (!equipamentos.length) return `<div class="empty-state">Sem ativos cadastrados.</div>`;
    return `
      <div class="industrial-asset-grid">
        ${equipamentos.map((item) => {
          const linha = refs.linhas.find((row) => row.id === item.linha_id) || {};
          const setor = refs.setores.find((row) => row.id === item.setor_id) || {};
          const componentes = refs.componentes.filter((component) => component.equipamento_id === item.id);
          const qr = item.qr_code || item.id;
          return `
            <article class="industrial-asset-card">
              <div class="industrial-asset-head">
                <div>
                  <span>${escapeHtml(item.tag || item.id || "Ativo")}</span>
                  <h3>${escapeHtml(item.nome || item.id)}</h3>
                  <p>${escapeHtml(setor.nome || item.setor_id || "-")} · ${escapeHtml(linha.nome || item.linha_id || "-")}</p>
                </div>
                ${renderCriticalityPill(item.criticidade)}
              </div>
              <div class="asset-mini-grid">
                <span>Status <strong>${escapeHtml(item.status || "-")}</strong></span>
                <span>QR Code <strong>${escapeHtml(qr || "-")}</strong></span>
                <span>Componentes <strong>${componentes.length}</strong></span>
              </div>
              <div class="asset-next-action"><span>Próxima ação</span><strong>Consultar ficha ou abrir OS vinculada ao ativo</strong></div>
              <div class="footer-actions compact">
                <button class="ghost-action" type="button" data-action="resolve-qr" data-qr="${escapeAttr(qr)}">Abrir QR</button>
                ${can("criar_os") ? `<button class="primary-action" type="button" data-action="create-os-from-equipment" data-ativo-id="${escapeAttr(item.id)}">Criar OS</button>` : ""}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderComponentesIndustriaisRoute() {
    const refs = state.data.referencias;
    const componentes = refs.componentes || [];
    const critical = componentes.filter((item) => String(item.criticidade || "").toUpperCase() === "A");
    const inactive = componentes.filter((item) => ["INATIVO", "BLOQUEADO"].includes(String(item.status || "").toUpperCase()));
    return `
      ${viewHeader()}
      <section class="route-shell route-componentes-industriais">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Componentes industriais</span>
            <h2>Componentes</h2>
            <p>Componentes, criticidade, status, vida útil, eventos e OS vinculadas.</p>
          </div>
          ${can("cadastrar_equipamento") ? `<button class="primary-action" type="button" data-view="cadastros">Novo componente</button>` : ""}
        </section>
        <section class="cards-grid route-metric-grid compact">
          <article class="metric-card"><span>Componentes totais</span><strong>${componentes.length}</strong></article>
          <article class="metric-card"><span>Componentes críticos</span><strong>${critical.length}</strong></article>
          <article class="metric-card"><span>Inativos/bloqueados</span><strong>${inactive.length}</strong></article>
          <article class="metric-card"><span>OS vinculadas</span><strong>—</strong><small>Exibido quando houver vínculo confiável</small></article>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h3>Lista de componentes</h3><p class="muted">Cards focados no equipamento pai, criticidade, status e histórico técnico.</p></div></div>
          ${renderIndustrialComponentCards(componentes, refs)}
        </section>
      </section>
    `;
  }

  function renderIndustrialComponentCards(componentes, refs) {
    if (!componentes.length) return `<div class="empty-state">Sem componentes cadastrados.</div>`;
    return `
      <div class="industrial-asset-grid component-grid">
        ${componentes.map((item) => {
          const equipamento = refs.equipamentos.find((equip) => equip.id === item.equipamento_id) || {};
          const history = (refs.historico_componentes || state.data.historico_componentes || []).filter((event) => event.componente_id === item.id);
          const last = history[0] || {};
          return `
            <article class="industrial-asset-card component-card">
              <div class="industrial-asset-head">
                <div>
                  <span>${escapeHtml(equipamento.nome || item.equipamento_id || "Equipamento pai")}</span>
                  <h3>${escapeHtml(item.nome || item.id)}</h3>
                  <p>${escapeHtml(last.tipo_evento || "Último evento não registrado")}</p>
                </div>
                ${renderCriticalityPill(item.criticidade)}
              </div>
              <div class="asset-mini-grid">
                <span>Status <strong>${escapeHtml(item.status || "-")}</strong></span>
                <span>Vida útil <strong>${escapeHtml(item.vida_util || item.horimetro || "—")}</strong></span>
                <span>ID <strong>${escapeHtml(item.id || "-")}</strong></span>
              </div>
              <div class="footer-actions compact">
                <button class="ghost-action" type="button" data-action="resolve-qr" data-qr="${escapeAttr(item.id)}">Abrir componente</button>
                ${equipamento.id ? `<button class="secondary-action" type="button" data-action="resolve-qr" data-qr="${escapeAttr(equipamento.qr_code || equipamento.id)}">Abrir ativo</button>` : ""}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderAcompanhamentoAtivosRoute() {
    const refs = state.data.referencias;
    const stats = buildAssetTraceabilityStats(refs);
    const recentEvents = (refs.historico_componentes || state.data.historico_componentes || state.data.historico || []).slice(0, 6);
    return `
      ${viewHeader()}
      <section class="route-shell route-acompanhamento-ativos">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Monitoramento operacional</span>
            <h2>Acompanhamento</h2>
            <p>Monitoramento de ativos, setores, linhas, componentes e pendências operacionais.</p>
          </div>
          <span class="tag blue">Mapa operacional</span>
        </section>
        <section class="asset-map-metrics">
          ${renderAssetTraceMetric("Ativos em atenção", stats.ativosInativos.length, "Inativos ou fora da condição padrão", stats.ativosInativos.length ? "amber" : "green")}
          ${renderAssetTraceMetric("Ativos críticos", stats.ativosCríticos.length, "Criticidade A", stats.ativosCríticos.length ? "red" : "green")}
          ${renderAssetTraceMetric("Componentes críticos", stats.componentesCríticos.length, "Componentes de maior risco", stats.componentesCríticos.length ? "red" : "green")}
        </section>
        <div class="route-two-col">
          <section class="panel"><h3>Ativos críticos</h3>${renderIndustrialEquipmentCards(stats.ativosCríticos, refs)}</section>
          <section class="panel"><h3>Histórico recente</h3>${recentEvents.length ? renderAssetHistory([], recentEvents) : `<div class="empty-state">Sem registros disponíveis.</div>`}</section>
        </div>
      </section>
    `;
  }

  function renderCadastrosOperacionaisRoute() {
    const refs = state.data.referencias;
    const canEdit = can("cadastrar_equipamento");
    const activeTab = state.cadastroTab;
    const tabs = [
      ["plantas", "Plantas"],
      ["setores", "Setores"],
      ["linhas", "Linhas"],
      ["equipamentos", "Equipamentos"],
      ["componentes", "Componentes"]
    ];
    return `
      ${viewHeader()}
      <section class="route-shell route-cadastros-operacionais">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Base mestre industrial</span>
            <h2>Cadastros Operacionais</h2>
            <p>Plantas, setores, linhas, equipamentos e componentes da estrutura industrial.</p>
          </div>
          <span class="tag ${canEdit ? "green" : "blue"}">${canEdit ? "Cadastro autorizado" : "Consulta"}</span>
        </section>
        <section class="panel cadastro-shell asset-cadastro-section">
          <div class="panel-head asset-section-head">
            <div>
              <span class="asset-section-kicker">Cadastro técnico</span>
              <h3>Estrutura industrial</h3>
              <p class="muted">Planta → Setor → Linha → Equipamento → Componente.</p>
            </div>
          </div>
          <div class="subtab-list asset-main-tabs" role="tablist" aria-label="Cadastros gerais">
            ${tabs.map(([id, label]) => `<button class="${activeTab === id ? "active" : ""}" type="button" data-action="cadastro-tab" data-tab="${id}">${matIcon(cadastroTabIcon(id))}<span>${label}</span></button>`).join("")}
          </div>
          ${renderCadastroTab(activeTab, refs, canEdit)}
        </section>
      </section>
    `;
  }

  function buildAssetTraceabilityStats(refs) {
    const plantas = refs.plantas || [];
    const setores = refs.setores || [];
    const linhas = refs.linhas || [];
    const equipamentos = refs.equipamentos || [];
    const componentes = refs.componentes || [];
    const ativosCríticos = equipamentos.filter((item) => String(item.criticidade || "").toUpperCase() === "A");
    const ativosInativos = equipamentos.filter((item) => item.status && item.status !== "ATIVO");
    const componentesCríticos = componentes.filter((item) => String(item.criticidade || "").toUpperCase() === "A");
    const hasQrField = equipamentos.some((item) => Object.prototype.hasOwnProperty.call(item, "qr_code"));
    const comQr = equipamentos.filter((item) => String(item.qr_code || "").trim()).length;
    const semQr = hasQrField ? equipamentos.filter((item) => !String(item.qr_code || "").trim()).length : 0;
    return { plantas, setores, linhas, equipamentos, componentes, ativosCríticos, ativosInativos, componentesCríticos, hasQrField, comQr, semQr };
  }

  function renderAssetMapHero(stats, canEdit) {
    return `
      <section class="panel asset-map-hero">
        <div class="asset-map-hero-copy">
          <span class="asset-kicker">Ativos e Rastreabilidade</span>
          <h2>Mapa de Ativos e Rastreabilidade</h2>
          <p>Estrutura industrial, QR Code, criticidade, OS vinculadas e histórico técnico do ativo.</p>
        </div>
        <div class="asset-map-hero-status">
          <span>${canEdit ? "Base técnica editável" : "Consulta operacional"}</span>
          <strong>${escapeHtml(state.session.perfil || "Perfil")}</strong>
        </div>
      </section>
      <section class="asset-map-metrics">
        ${renderAssetTraceMetric("Ativos cadastrados", stats.equipamentos.length, "Equipamentos na base mestre", "blue")}
        ${renderAssetTraceMetric("Ativos críticos", stats.ativosCríticos.length, stats.ativosCríticos.length ? "Criticidade A registrada" : "Nenhuma ação crítica no momento", stats.ativosCríticos.length ? "red" : "green")}
        ${renderAssetTraceMetric("Ativos inativos", stats.ativosInativos.length, stats.ativosInativos.length ? "Consulta e histórico preservados" : "Sem registros disponíveis", stats.ativosInativos.length ? "amber" : "green")}
        ${renderAssetTraceMetric("Componentes", stats.componentes.length, `${stats.componentesCríticos.length} crítico(s) na estrutura`, "blue")}
        ${renderAssetTraceMetric("QR Code", stats.hasQrField ? `${stats.comQr}/${stats.equipamentos.length}` : "—", stats.hasQrField ? "Com QR cadastrado" : "Rastreabilidade disponível com identificador", "blue")}
      </section>
    `;
  }

  function renderAssetTraceMetric(label, value, detail, tone) {
    return `
      <article class="asset-trace-metric ${escapeAttr(tone || "")}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(detail)}</small>
      </article>
    `;
  }

  function renderAssetOperationalChain() {
    const steps = [
      ["precision_manufacturing", "Ativo físico"],
      ["qr_code_2", "QR Code"],
      ["assignment", "OS"],
      ["history", "Histórico Técnico"],
      ["monitoring", "Indicadores"]
    ];
    return `
      <section class="panel asset-operational-chain-card">
        <div class="panel-head compact">
          <div>
            <h3>Cadeia operacional rastreável</h3>
            <p class="muted">Do ativo identificado à memória técnica e leitura de desempenho.</p>
          </div>
        </div>
        <div class="asset-operational-chain">
          ${steps.map(([icon, label]) => `
            <div class="asset-operational-step">
              ${matIcon(icon)}
              <strong>${escapeHtml(label)}</strong>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderAssetPriorityPanel(stats) {
    const critical = stats.ativosCríticos.slice(0, 3);
    const inactive = stats.ativosInativos.slice(0, 3);
    const qrMessage = stats.hasQrField
      ? (stats.semQr ? `${stats.semQr} ativo(s) sem QR cadastrado.` : "QR Code cadastrado nos ativos com campo disponível.")
      : "Rastreabilidade disponível quando o ativo possuir identificador cadastrado.";
    return `
      <section class="panel asset-priority-panel">
        <div class="panel-head compact">
          <div>
            <h3>Prioridades de rastreabilidade</h3>
            <p class="muted">Criticidade, identificação e integridade da base técnica sem simular indicadores.</p>
          </div>
        </div>
        <div class="asset-priority-grid">
          <article class="asset-priority-card ${critical.length ? "critical" : "neutral"}">
            <span>Criticidade</span>
            <strong>${critical.length ? "Ativos críticos" : "Nenhuma ação crítica no momento"}</strong>
            ${critical.length ? `<p>${critical.map((item) => escapeHtml(item.nome || item.id)).join(" · ")}</p>` : `<p>Sem ativos de criticidade A na primeira leitura.</p>`}
          </article>
          <article class="asset-priority-card ${inactive.length ? "warning" : "neutral"}">
            <span>Status</span>
            <strong>${inactive.length ? "Ativos inativos" : "Sem registros disponíveis"}</strong>
            ${inactive.length ? `<p>${inactive.map((item) => escapeHtml(item.nome || item.id)).join(" · ")}</p>` : `<p>Nenhum ativo inativo identificado na base atual.</p>`}
          </article>
          <article class="asset-priority-card neutral">
            <span>QR Code</span>
            <strong>Identificação operacional</strong>
            <p>${escapeHtml(qrMessage)}</p>
          </article>
        </div>
      </section>
    `;
  }

  function cadastroTabLabel(tab) {
    return {
      plantas: "Planta",
      setores: "Setor",
      linhas: "Linha",
      equipamentos: "Equipamento",
      componentes: "Componente"
    }[tab] || "estrutura";
  }

  function cadastroTabIcon(tab) {
    return {
      plantas: "factory",
      setores: "account_tree",
      linhas: "route",
      equipamentos: "precision_manufacturing",
      componentes: "widgets"
    }[tab] || "inventory_2";
  }

  function renderCadastroTab(tab, refs, canEdit) {
    const form = canEdit ? renderCadastroForm(tab, refs) : `<div class="empty-state compact">Consulta liberada. Edição disponível apenas para perfis autorizados.</div>`;
    const table = renderCadastroTable(tab, refs);
    return `
      <div class="cadastro-tab-panel asset-cadastro-tab-panel">
        <div class="cadastro-table-panel asset-table-panel">
          ${table}
        </div>
        <details class="cadastro-editor-disclosure" ${canEdit ? "" : "open"}>
          <summary>${matIcon(cadastroTabIcon(tab))}<span>${canEdit ? `Criar/editar ${escapeHtml(cadastroTabLabel(tab))}` : "Permissão de edição"}</span></summary>
          ${form}
        </details>
      </div>
    `;
  }

  function renderCadastroForm(tab, refs) {
    if (tab === "plantas") {
      return `
        <form class="form-grid cadastro-form cadastro-editor" data-entidade="planta" data-cadastro-tab="plantas">
          <div class="form-section-title">
            <h3>Nova planta</h3>
            <p>Base física da estrutura industrial.</p>
          </div>
          <label>Nome <input name="nome" required></label>
          <div class="three-col">
            <label>CNPJ <input name="cnpj" placeholder="00.000.000/0001-00"></label>
            <label>Cidade <input name="cidade"></label>
            <label>UF <input name="uf" maxlength="2"></label>
          </div>
          ${statusSelect()}
          <button class="primary-action" type="submit">Salvar planta</button>
        </form>
      `;
    }
    if (tab === "setores") {
      return `
        <form class="form-grid cadastro-form cadastro-editor" data-entidade="setor" data-cadastro-tab="setores">
          <div class="form-section-title">
            <h3>Novo setor</h3>
            <p>Área responsável por linhas, ativos e execução técnica.</p>
          </div>
          <label>Planta
            <select name="planta_id" required>${optionList(refs.plantas || [], "id", "nome")}</select>
          </label>
          <label>Nome <input name="nome" required></label>
          <label>Responsável
            <select name="responsavel">
              <option value="">Sem responsável</option>
              ${refs.usuarios.filter((item) => item.perfil !== "Operador").map((item) => `<option value="${escapeAttr(item.id)}">${escapeHtml(item.nome)}</option>`).join("")}
            </select>
          </label>
          ${statusSelect()}
          <button class="primary-action" type="submit">Salvar setor</button>
        </form>
      `;
    }
    if (tab === "linhas") {
      return `
        <form class="form-grid cadastro-form cadastro-editor" data-entidade="linha" data-cadastro-tab="linhas">
          <div class="form-section-title">
            <h3>Nova linha</h3>
            <p>Segmento produtivo onde os equipamentos são rastreados.</p>
          </div>
          <label>Setor
            <select name="setor_id" required>${optionList(refs.setores, "id", "nome")}</select>
          </label>
          <label>Nome <input name="nome" required></label>
          <label>Capacidade <input name="capacidade" placeholder="Ex.: 1200 un/h"></label>
          ${statusSelect()}
          <button class="primary-action" type="submit">Salvar linha</button>
        </form>
      `;
    }
    if (tab === "equipamentos") {
      return `
        <form class="form-grid cadastro-form cadastro-editor cadastro-editor-wide" data-entidade="equipamento" data-cadastro-tab="equipamentos">
          <div class="form-section-title">
            <h3>Novo equipamento</h3>
            <p>Ativo rastreável por criticidade, QR Code, histórico técnico e OS vinculadas.</p>
          </div>
          <div class="three-col">
            <label>Setor
              <select name="setor_id" required>${optionList(refs.setores, "id", "nome")}</select>
            </label>
            <label>Linha
              <select name="linha_id" required>${optionList(refs.linhas, "id", "nome")}</select>
            </label>
            <label>Criticidade
              <select name="criticidade" required><option>A</option><option>B</option><option>C</option></select>
            </label>
          </div>
          <div class="three-col">
            <label>Nome / TAG <input name="nome" required></label>
            <label>Tipo <input name="tipo" required></label>
            <label>Fabricante <input name="fabricante"></label>
          </div>
          <div class="three-col">
            <label>Modelo <input name="modelo"></label>
            <label>Número de série <input name="numero_serie"></label>
            <label>Data de instalação <input name="data_instalacao" type="date"></label>
          </div>
          <div class="two-col">
            <label>Horímetro atual <input name="horimetro_atual" inputmode="decimal"></label>
            <label>QR Code <input name="qr_code" placeholder="Gerado automaticamente se vazio"></label>
          </div>
          <label>Descrição técnica <textarea name="descricao"></textarea></label>
          ${statusSelect()}
          <button class="primary-action" type="submit">Salvar equipamento</button>
        </form>
      `;
    }
    return `
      <form class="form-grid cadastro-form cadastro-editor" data-entidade="componente" data-cadastro-tab="componentes">
        <div class="form-section-title">
          <h3>Novo componente</h3>
          <p>Parte técnica vinculada ao ativo principal.</p>
        </div>
        <label>Equipamento
          <select name="equipamento_id" required>${optionList(refs.equipamentos, "id", "nome")}</select>
        </label>
        <label>Nome <input name="nome" required></label>
        <div class="two-col">
          <label>Tipo <input name="tipo" required></label>
          <label>Criticidade
            <select name="criticidade" required><option>A</option><option>B</option><option>C</option></select>
          </label>
        </div>
        ${statusSelect()}
        <button class="primary-action" type="submit">Salvar componente</button>
      </form>
    `;
  }

  function getAssetLocationLabel(item) {
    const linha = getLinha(item.linha_id);
    const setor = getSetor(item.setor_id || linha.setor_id);
    const planta = getPlanta(setor.planta_id);
    return [planta.nome, setor.nome, linha.nome].filter(Boolean).join(" / ") || "Estrutura não informada";
  }

  function renderCadastroTable(tab, refs) {
    if (tab === "plantas") {
      return renderCadastroCards((refs.plantas || []).map((item) => ({
        title: item.nome,
        subtitle: [item.cidade, item.uf].filter(Boolean).join(" / ") || item.id,
        status: item.status,
        tag: "Planta",
        nextAction: "Mapear setores e linhas vinculadas",
        rows: [
          ["ID", item.id],
          ["CNPJ", item.cnpj || "-"],
          ["Setores", refs.setores.filter((setor) => setor.planta_id === item.id).length]
        ]
      })));
    }
    if (tab === "setores") {
      return renderCadastroCards(refs.setores.map((item) => ({
        title: item.nome,
        subtitle: getPlanta(item.planta_id).nome || item.planta_id,
        status: item.status,
        tag: "Setor",
        nextAction: "Conectar linhas e responsáveis técnicos",
        rows: [
          ["ID", item.id],
          ["Responsável", getUser(item.responsavel).nome || item.responsavel || "-"],
          ["Linhas", refs.linhas.filter((linha) => linha.setor_id === item.id).length]
        ]
      })));
    }
    if (tab === "linhas") {
      return renderCadastroCards(refs.linhas.map((item) => ({
        title: item.nome,
        subtitle: getSetor(item.setor_id).nome || item.setor_id,
        status: item.status,
        tag: "Linha",
        nextAction: "Vincular equipamentos rastreáveis",
        rows: [
          ["ID", item.id],
          ["Capacidade", item.capacidade || "-"],
          ["Equipamentos", refs.equipamentos.filter((equip) => equip.linha_id === item.id).length]
        ]
      })));
    }
    if (tab === "equipamentos") {
      return renderCadastroCards(refs.equipamentos.map((item) => {
        const componentCount = refs.componentes.filter((component) => component.equipamento_id === item.id).length;
        const actions = [
          `<button class="ghost-action" type="button" data-action="resolve-qr" data-qr="${escapeAttr(item.id)}">Abrir QR</button>`
        ];
        if (can("criar_os") && item.status !== "INATIVO") {
          actions.push(`<button class="secondary-action" type="button" data-action="create-os-from-equipment" data-ativo-id="${escapeAttr(item.id)}">Criar OS</button>`);
        }
        return {
          title: item.nome,
          subtitle: getAssetLocationLabel(item),
          status: item.status,
          tag: `Criticidade ${item.criticidade || "-"}`,
          tone: String(item.criticidade || "").toUpperCase() === "A" ? "critical" : "",
          nextAction: item.qr_code ? "Consultar ficha técnica por QR" : "Validar identificação operacional do ativo",
          action: actions.join(""),
          rows: [
            ["TAG", item.id],
            ["Tipo", item.tipo || "-"],
            ["Nº de série", item.numero_serie || "-"],
            ["QR Code", item.qr_code || "-"],
            ["Componentes", componentCount]
          ]
        };
      }));
    }
    return renderCadastroCards(refs.componentes.map((item) => ({
      title: item.nome,
      subtitle: getAtivo(item.equipamento_id).nome || item.equipamento_id,
      status: item.status,
      tag: `Criticidade ${item.criticidade || "-"}`,
      tone: String(item.criticidade || "").toUpperCase() === "A" ? "critical" : "",
      nextAction: "Manter vínculo técnico com o ativo principal",
      rows: [
        ["ID", item.id],
        ["Tipo", item.tipo],
        ["Equipamento", getAtivo(item.equipamento_id).nome || item.equipamento_id]
      ]
    })));
  }

  function renderCadastroCards(items) {
    if (!items.length) return `<div class="empty-state">Sem registros disponíveis.</div>`;
    return `
      <div class="entity-card-grid asset-entity-grid">
        ${items.map((item) => `
          <article class="entity-card asset-entity-card ${escapeAttr(item.tone || "")}">
            <div class="entity-card-head asset-entity-card-head">
              <div>
                <span>${escapeHtml(item.tag || "")}</span>
                <h3>${escapeHtml(item.title || "-")}</h3>
                <p>${escapeHtml(item.subtitle || "")}</p>
              </div>
              ${renderStatusSwitch(item.status || "ATIVO", { disabled: true, title: "Status cadastral" })}
            </div>
            <dl>
              ${(item.rows || []).map(([label, value]) => `
                <div>
                  <dt>${escapeHtml(label)}</dt>
                  <dd>${escapeHtml(value)}</dd>
                </div>
              `).join("")}
            </dl>
            ${item.nextAction ? `<div class="asset-next-action"><span>Próxima ação</span><strong>${escapeHtml(item.nextAction)}</strong></div>` : ""}
            ${item.action ? `<div class="footer-actions asset-card-actions">${item.action}</div>` : ""}
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderChecklists() {
    if (state.view === "checklists") return renderChecklistModelsRoute();
    if (state.view === "checklist-execucoes") return renderChecklistExecutionsRoute();
    if (state.view === "validacao-tecnica") return renderValidationTechnicalRoute();
    return renderQualityOverviewRoute();
  }

  function renderQualityOverviewRoute() {
    return `
      ${viewHeader()}
      <section class="quality-technical-shell route-shell route-quality-overview">
        ${renderQualityTechnicalHero()}
        ${renderQualityTechnicalMetrics()}
        ${renderQualityTechnicalFlow()}
        <section class="panel route-shortcuts-panel">
          <div class="panel-head">
            <div>
              <h3>Rotas da qualidade técnica</h3>
              <p class="muted">Acesse modelos, execuções, validação e não conformidades sem duplicar telas.</p>
            </div>
          </div>
          <div class="route-shortcut-grid">
            ${renderRouteShortcut("Modelos de Checklist", "Padrões reutilizáveis, versões e itens técnicos.", "checklists", "checklist")}
            ${renderRouteShortcut("Checklists Ativos", "Execuções vinculadas a OS, pendências e evidências.", "checklist-execucoes", "rule")}
            ${renderRouteShortcut("Validação Técnica", "Pendências, evidências e aprovações sem alterar regras.", "validacao-tecnica", "verified")}
            ${renderRouteShortcut("Não Conformidades", "NOK, leituras fora de limite e eventos críticos.", "notificacoes", "report_problem")}
          </div>
        </section>
      </section>
    `;
  }

  function renderChecklistModelsRoute() {
    const refs = state.data.referencias;
    const modelos = refs.checklist_modelos || [];
    const modeloItens = refs.checklist_modelo_itens || [];
    const active = modelos.filter((item) => item.status !== "INATIVO").length;
    const inactive = modelos.filter((item) => item.status === "INATIVO").length;
    const versions = modelos.reduce((acc, item) => acc + Number(item.versao || 1), 0);
    const mandatory = modeloItens.filter((item) => asBool(item.obrigatorio)).length;
    return `
      ${viewHeader()}
      <section class="route-shell route-checklist-models">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Padrões técnicos</span>
            <h2>Modelos de Checklist</h2>
            <p>Crie, versione e publique padrões técnicos reutilizáveis para ordens de serviço.</p>
          </div>
          <button class="primary-action" type="button" data-action="focus-new-checklist-model">Novo modelo</button>
        </section>
        <section class="cards-grid route-metric-grid compact">
          <article class="metric-card"><span>Modelos ativos</span><strong>${active}</strong></article>
          <article class="metric-card"><span>Modelos inativos</span><strong>${inactive}</strong></article>
          <article class="metric-card"><span>Versões</span><strong>${versions}</strong></article>
          <article class="metric-card"><span>Itens obrigatórios</span><strong>${mandatory}</strong></article>
        </section>
        ${can("editar_checklist_padrao") ? renderChecklistModelForm() : ""}
        ${renderChecklistModelManager(modelos, modeloItens)}
      </section>
    `;
  }

  function renderChecklistExecutionsRoute() {
    const stats = getQualityTechnicalStats();
    return `
      ${viewHeader()}
      <section class="route-shell route-checklist-executions">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Execução técnica</span>
            <h2>Checklists Ativos</h2>
            <p>Execuções, pendências e evidências dos checklists vinculados a ordens de serviço.</p>
          </div>
          <span class="tag blue">${stats.activeOsIds.size} OS com checklist</span>
        </section>
        <section class="cards-grid route-metric-grid compact">
          <article class="metric-card"><span>Em execução</span><strong>${stats.activeOsIds.size}</strong></article>
          <article class="metric-card"><span>Pendências</span><strong>${stats.pending.length}</strong></article>
          <article class="metric-card"><span>Evidências exigidas</span><strong>${stats.evidencePending.length}</strong></article>
          <article class="metric-card"><span>Não conformidades</span><strong>${stats.nonConformities.length}</strong></article>
          <article class="metric-card"><span>OS aguardando aprovação</span><strong>${stats.approvals.length}</strong></article>
        </section>
        ${qualityFilterBanner()}
        ${renderChecklistExecutionList(filteredChecklistItemsForQuality())}
      </section>
    `;
  }

  function renderValidationTechnicalRoute() {
    const stats = getQualityTechnicalStats();
    return `
      ${viewHeader()}
      <section class="route-shell route-validation-technical">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Validação da execução</span>
            <h2>Validação Técnica</h2>
            <p>Revise pendências, evidências técnicas e aprovações sem alterar regras de negócio.</p>
          </div>
          <span class="tag ${stats.approvals.length ? "amber" : "green"}">${stats.approvals.length ? `${stats.approvals.length} aprovação(ões)` : "Nenhuma aprovação pendente"}</span>
        </section>
        <div class="validation-focus-grid">
          ${renderValidationFocusCard("Aprovações pendentes", stats.approvals.length, "Abrir OS para revisar aprovação.", "verified")}
          ${renderValidationFocusCard("Evidências pendentes", stats.evidencePending.length, "Revisar prova técnica exigida.", "photo_camera")}
          ${renderValidationFocusCard("Itens pendentes", stats.pending.length, "Concluir respostas obrigatórias.", "pending_actions")}
          ${renderValidationFocusCard("Não conformidades", stats.nonConformities.length, "NOK ou fora de limite já identificável.", "report_problem")}
        </div>
        ${qualityFilterBanner()}
        ${renderQualityValidationSummary()}
        ${renderChecklistExecutionList(filteredChecklistItemsForQuality())}
      </section>
    `;
  }

  function renderRouteShortcut(title, detail, view, icon) {
    return `
      <button class="route-shortcut-card" type="button" data-view="${escapeAttr(view)}">
        ${matIcon(icon)}
        <span>${escapeHtml(title)}</span>
        <small>${escapeHtml(detail)}</small>
      </button>
    `;
  }

  function qualityFilterForLabel(label) {
    return {
      "Aprovações pendentes": "aprovacoes",
      "Evidências pendentes": "evidencias",
      "Itens pendentes": "pendentes",
      "Não conformidades": "nao-conformidades",
      "Itens críticos": "criticos"
    }[label] || "";
  }

  function renderValidationFocusCard(label, value, detail, icon) {
    const filter = qualityFilterForLabel(label);
    const clickable = Number(value) > 0 && filter;
    const attrs = clickable ? ` role="button" tabindex="0" data-action="quality-filter" data-target-view="validacao-tecnica" data-quality-filter="${escapeAttr(filter)}"` : "";
    return `
      <article class="validation-focus-card ${value ? "needs-action is-clickable" : "is-clear"}"${attrs}>
        ${matIcon(icon)}
        <div>
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(String(value))}</strong>
          <small>${escapeHtml(value ? detail : "Nenhuma ação crítica no momento.")}</small>
        </div>
      </article>
    `;
  }

  function getQualityTechnicalStats() {
    const items = state.data.checklist || [];
    const orders = state.data.ordens || [];
    const activeOsIds = new Set(items.map((item) => item.os_id).filter(Boolean));
    const pending = items.filter((item) => asBool(item.obrigatorio) && !item.resposta);
    const evidencePending = items.filter((item) => checklistRequiresEvidenceNow(item) && !item.evidencia);
    const critical = items.filter((item) => asBool(item.critico));
    const approvals = orders.filter((os) => os.status === "AGUARDANDO_APROVACAO");
    const nonConformities = items.filter((item) => item.resposta === "NAO_OK" || checklistValueOutOfRange(item));
    return { items, orders, activeOsIds, pending, evidencePending, critical, approvals, nonConformities };
  }

  function filteredChecklistItemsForQuality() {
    const items = state.data.checklist || [];
    const filter = state.qualityFilter || "";
    if (!filter || filter === "ativos") return items;
    if (filter === "pendentes") return items.filter((item) => asBool(item.obrigatorio) && !item.resposta);
    if (filter === "evidencias") return items.filter((item) => checklistRequiresEvidenceNow(item) && !item.evidencia);
    if (filter === "criticos") return items.filter((item) => asBool(item.critico));
    if (filter === "nao-conformidades") return items.filter((item) => item.resposta === "NAO_OK" || checklistValueOutOfRange(item));
    if (filter === "aprovacoes") {
      const approvalIds = new Set((state.data.ordens || []).filter((os) => os.status === "AGUARDANDO_APROVACAO").map((os) => os.id));
      return items.filter((item) => approvalIds.has(item.os_id));
    }
    return items;
  }

  function qualityFilterBanner() {
    if (!state.qualityFilter) return "";
    const labels = {
      ativos: "Checklists ativos",
      pendentes: "Itens pendentes",
      evidencias: "Evidências pendentes",
      criticos: "Itens críticos",
      aprovacoes: "Aprovações pendentes",
      "nao-conformidades": "Não conformidades"
    };
    return `
      <div class="route-filter-banner">
        <span>${matIcon("filter_alt")} ${escapeHtml(labels[state.qualityFilter] || "Filtro aplicado")}</span>
        <button class="ghost-action" type="button" data-action="clear-quality-filter">Limpar filtro</button>
      </div>
    `;
  }

  function renderQualityTechnicalHero() {
    return `
      <section class="panel quality-hero">
        <div>
          <span class="section-kicker">Qualidade Técnica</span>
          <h2>Controle de qualidade da execução</h2>
          <p>Checklist, evidência obrigatória, validação técnica e aprovação da OS.</p>
        </div>
        <span class="tag blue quality-flow-chip">Fluxo técnico</span>
      </section>
    `;
  }

  function renderQualityTechnicalMetrics() {
    const stats = getQualityTechnicalStats();
    const cards = [
      { label: "Checklists ativos", value: stats.activeOsIds.size, hint: "OS com checklist vinculado", icon: "fact_check", view: "checklist-execucoes", filter: "ativos" },
      { label: "Itens pendentes", value: stats.pending.length, hint: "Obrigatórios sem resposta", icon: "pending_actions", view: "validacao-tecnica", filter: "pendentes" },
      { label: "Evidências pendentes", value: stats.evidencePending.length, hint: "Prova técnica exigida", icon: "photo_camera", view: "validacao-tecnica", filter: "evidencias" },
      { label: "Itens críticos", value: stats.critical.length, hint: "Itens marcados como críticos", icon: "priority_high", view: "validacao-tecnica", filter: "criticos" },
      { label: "Aprovações", value: stats.approvals.length, hint: "OS aguardando aprovação", icon: "verified", view: "validacao-tecnica", filter: "aprovacoes" },
      { label: "Não conformidades", value: stats.nonConformities.length, hint: "NOK ou fora de limite", icon: "report_problem", view: "notificacoes", filter: "nao-conformidades" }
    ];
    return `
      <div class="quality-metric-grid">
        ${cards.map((card) => {
          const clickable = Number(card.value) > 0;
          const attrs = clickable ? ` role="button" tabindex="0" data-action="quality-filter" data-target-view="${escapeAttr(card.view)}" data-quality-filter="${escapeAttr(card.filter)}"` : "";
          return `
          <article class="quality-metric-card ${card.value ? "has-value is-clickable" : "is-neutral"}"${attrs}>
            ${matIcon(card.icon)}
            <div>
              <span>${escapeHtml(card.label)}</span>
              <strong>${escapeHtml(String(card.value))}</strong>
              <small>${escapeHtml(card.hint)}</small>
            </div>
          </article>`;
        }).join("")}
      </div>
    `;
  }

  function renderQualityTechnicalFlow() {
    return `
      <section class="panel quality-flow-panel">
        <div class="quality-flow-track" aria-label="Fluxo de qualidade técnica">
          ${["OS", "Checklist", "Evidência", "Validação Técnica", "Aprovação"].map((step, index, list) => `
            <span>${escapeHtml(step)}</span>${index < list.length - 1 ? `<i>→</i>` : ""}
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderQualityValidationSummary() {
    const stats = getQualityTechnicalStats();
    return `
      <section class="panel quality-validation-panel">
        <div class="panel-head">
          <div>
            <h3>Validação técnica</h3>
            <p class="muted">Leitura de pendências, evidências e aprovação sem alterar regra de negócio.</p>
          </div>
          <span class="tag ${stats.approvals.length ? "amber" : "green"}">${stats.approvals.length ? `${stats.approvals.length} aprovação(ões)` : "Nenhuma aprovação pendente"}</span>
        </div>
        <div class="quality-validation-list">
          ${renderQualityValidationItem("Evidências pendentes", stats.evidencePending.length, "Revisar prova técnica exigida antes da validação.")}
          ${renderQualityValidationItem("Itens pendentes", stats.pending.length, "Concluir respostas obrigatórias antes da finalização.")}
          ${renderQualityValidationItem("Não conformidades", stats.nonConformities.length, "NOK ou leitura fora de limite já identificável nos dados.")}
        </div>
      </section>
    `;
  }

  function renderQualityValidationItem(label, value, hint) {
    return `
      <article class="quality-validation-item ${value ? "needs-action" : "is-clear"}">
        <strong>${escapeHtml(String(value))}</strong>
        <div>
          <span>${escapeHtml(label)}</span>
          <small>${escapeHtml(value ? hint : "Nenhuma ação crítica no momento.")}</small>
        </div>
      </article>
    `;
  }

  function renderQualityOperatorGuidance() {
    return `
      <section class="panel quality-operator-guide">
        <h3>Execução guiada</h3>
        <p class="muted">Fluxo do operador: responder item, anexar evidência quando exigida, registrar observação técnica e salvar checklist.</p>
        <div class="quality-mini-steps">
          <span>Responder</span>
          <span>Evidenciar</span>
          <span>Observar</span>
          <span>Salvar</span>
        </div>
      </section>
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
            <small>Crie padrões técnicos reutilizáveis para ordens de serviço.</small>
          </span>
          <b data-checklist-mode-label>Novo modelo</b>
        </summary>
        <form id="checklist-model-form" class="form-grid form-sectioned checklist-model-form checklist-editor-panel">
          <div class="checklist-main-column">
            <input type="hidden" name="id" value="">
            <input type="hidden" name="versao" value="${escapeAttr(nextVersion)}" data-field="model-version">
            <div class="builder-steps">
            <article class="builder-step">
              <span>1</span>
              <div>
                <strong>Identificação</strong>
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
                      <option value="Inspecao">Inspeção</option>
                      <option>Emergencial</option>
                      <option value="OUTRO">Outro tipo</option>
                    </select>
                  </label>
                  <label>Novo tipo, se necessário
                    <input name="tipo_os_custom" data-field="model-type-custom" placeholder="Ex.: Lubrificação">
                  </label>
                </div>
                <div class="model-meta-strip">
                  <span>Versão automática: <strong data-model-version-label>${escapeHtml(nextVersion)}</strong></span>
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
                <strong>Itens técnicos</strong>
                <p class="muted">Comece com um item e adicione quantos forem necessários. A ordem salva vira a ordem operacional.</p>
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
              <strong>Publicação do modelo</strong>
              <p class="muted">Revise identificação, regras técnicas e itens antes de salvar.</p>
              <button class="primary-action" type="submit">Salvar modelo</button>
            </div>
          </div>
        </form>
      </details>
    `;
  }

  function renderChecklistModelItemRow(index, item) {
    const tipo = normalizeChecklistType(item.tipo_resposta);
    const evidenciaRegra = String(item.evidencia_regra || (asBool(item.evidencia_obrigatoria) ? "SEMPRE" : "SE_NOK")).toUpperCase();
    const observacaoRegra = String(item.observacao_regra || "SE_NOK").toUpperCase();
    return `
      <article class="checklist-builder-item" data-checklist-model-item>
        <div class="checklist-item-head">
          <strong data-item-number>Item ${index}</strong>
          <div class="mini-actions">
            <span class="drag-handle" title="Controle de ordem">::</span>
            <button class="icon-action" type="button" data-action="move-checklist-model-item-up" title="Subir item" aria-label="Subir item">^</button>
            <button class="icon-action" type="button" data-action="move-checklist-model-item-down" title="Descer item" aria-label="Descer item">v</button>
            <button class="icon-action danger-lite" type="button" data-action="remove-checklist-model-item" title="Remover item" aria-label="Remover item">x</button>
          </div>
        </div>
        <label>Pergunta objetiva
          <input name="pergunta_${index}" data-field="pergunta" value="${escapeAttr(item.pergunta || "")}" required placeholder="Pergunta objetiva da verificação">
        </label>
        <div class="two-col">
          <label>Tipo de resposta
            <select name="tipo_resposta_${index}" data-field="tipo_resposta">
              ${["OK_NOK", "OK_NOK_NA", "TEXTO", "NUMERICO", "SELECT", "DATA", "FOTO", "LEITURA_TECNICA"].map((value) => `<option value="${value}" ${tipo === value ? "selected" : ""}>${displayChecklistType(value)}</option>`).join("")}
            </select>
          </label>
          <label>Unidade
            <input name="unidade_${index}" data-field="unidade" value="${escapeAttr(item.unidade || "")}" placeholder="Ex.: V, A, °C, g, bar">
          </label>
        </div>
        <div class="two-col">
          <label>Valor mínimo
            <input name="valor_min_${index}" data-field="valor_min" value="${escapeAttr(item.valor_min || "")}" placeholder="Opcional">
          </label>
          <label>Valor máximo
            <input name="valor_max_${index}" data-field="valor_max" value="${escapeAttr(item.valor_max || "")}" placeholder="Opcional">
          </label>
        </div>
        <div class="two-col">
          <label>Valor esperado
            <input name="valor_esperado_${index}" data-field="valor_esperado" value="${escapeAttr(item.valor_esperado || "")}" placeholder="Ex.: Mobil Polyrex EM">
          </label>
          <label>Opções SELECT
            <input name="opcoes_${index}" data-field="opcoes" value="${escapeAttr(item.opcoes || "")}" placeholder="Separe por ; Ex.: Mobil; Shell; Outro">
          </label>
        </div>
        <div class="two-col">
          <label>Regra de evidência
            <select name="evidencia_regra_${index}" data-field="evidencia_regra">
              ${["NUNCA", "SEMPRE", "SE_NOK", "FORA_LIMITE", "SE_OUTRO"].map((value) => `<option value="${value}" ${evidenciaRegra === value ? "selected" : ""}>${value}</option>`).join("")}
            </select>
          </label>
          <label>Regra de observação
            <select name="observacao_regra_${index}" data-field="observacao_regra">
              ${["NUNCA", "SE_NOK", "FORA_LIMITE", "SE_OUTRO"].map((value) => `<option value="${value}" ${observacaoRegra === value ? "selected" : ""}>${value}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="toggle-grid">
          <label class="switch-cell">
            <input type="checkbox" name="obrigatorio_${index}" data-field="obrigatorio" ${asBool(item.obrigatorio) ? "checked" : ""}>
            <span>Obrigatório</span>
          </label>
          <label class="switch-cell">
            <input type="checkbox" name="critico_${index}" data-field="critico" ${asBool(item.critico) ? "checked" : ""}>
            <span>Crítico</span>
          </label>
        </div>
      </article>
    `;
  }

  function renderChecklistModelManager(modelos, modeloItens) {
    const grouped = modelos.slice().sort((a, b) => String(a.tipo_os).localeCompare(String(b.tipo_os)) || String(a.nome).localeCompare(String(b.nome)));
    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>Gerenciar modelos</h3>
            <p class="muted">Modelos ativos ficam disponíveis para a Gestão criar OS com checklist padrão.</p>
          </div>
          <span class="tag blue">${grouped.length} modelos</span>
        </div>
        <div class="model-card-grid">
          ${grouped.map((modelo) => {
            const itens = modeloItens.filter((item) => item.modelo_id === modelo.id).sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
            const active = modelo.status !== "INATIVO";
            return `
              <article class="model-card ${active ? "is-active" : "is-inactive"}">
                <div class="model-card-head">
                  <div>
                    <span>${escapeHtml(modelo.tipo_os || "-")}</span>
                    <h3>${escapeHtml(modelo.nome || modelo.id)}</h3>
                  </div>
                  <button class="tag-button ${active ? "green" : "red"}" type="button" data-action="toggle-checklist-model-status" data-model-id="${escapeAttr(modelo.id)}">
                    ${active ? "ATIVO" : "INATIVO"}
                  </button>
                </div>
                <div class="model-stats">
                  <span>Versão <strong>${escapeHtml(modelo.versao || "1")}</strong></span>
                  <span>Itens <strong>${itens.length}</strong></span>
                  <span>Obrig. <strong>${itens.filter((item) => asBool(item.obrigatorio)).length}</strong></span>
                </div>
                <ol class="model-item-preview">
                  ${itens.slice(0, 4).map((item) => `<li>${escapeHtml(item.pergunta)}</li>`).join("") || "<li>Sem itens cadastrados.</li>"}
                </ol>
                ${itens.length > 4 ? `<p class="small-note">+${itens.length - 4} itens adicionais</p>` : ""}
                <div class="footer-actions compact">
                  <button class="ghost-action" type="button" data-action="load-checklist-model-edit" data-model-id="${escapeAttr(modelo.id)}">Editar</button>
                  <button class="ghost-action" type="button" data-action="load-checklist-model-version" data-model-id="${escapeAttr(modelo.id)}">Nova versão</button>
                </div>
              </article>
            `;
          }).join("") || `<div class="empty-state">Sem modelos cadastrados.</div>`}
        </div>
      </section>
    `;
  }

  function renderChecklistExecutionList(items) {
    if (!items.length) {
      return `
        <section class="panel quality-execution-panel">
          <div class="panel-head">
            <div>
              <h3>Checklists ativos</h3>
              <p class="muted">Execução técnica vinculada às ordens de serviço.</p>
            </div>
            <span class="tag green">Sem registros disponíveis.</span>
          </div>
          <div class="empty-state">Sem itens de checklist em execução.</div>
        </section>
      `;
    }
    const groups = items.reduce((acc, item) => {
      const os = getOs(item.os_id);
      const key = item.os_id;
      if (!acc[key]) acc[key] = { os, items: [] };
      acc[key].items.push(item);
      return acc;
    }, {});
    return `
      <section class="panel quality-execution-panel">
        <div class="panel-head">
          <div>
            <h3>Checklists ativos</h3>
            <p class="muted">OS, pendências, evidências e próxima ação da execução técnica.</p>
          </div>
          <span class="tag blue">${items.length} itens</span>
        </div>
        <div class="execution-list quality-execution-list">
          ${Object.values(groups).map((group) => {
            const os = group.os || {};
            const ativo = getAtivo(os.ativo_id || "");
            const componente = getComponente(os.componente_id || "");
            const answered = group.items.filter((item) => item.resposta).length;
            const pending = group.items.filter((item) => asBool(item.obrigatorio) && !item.resposta).length;
            const evidence = group.items.filter((item) => checklistRequiresEvidenceNow(item)).length;
            const evidencePending = group.items.filter((item) => checklistRequiresEvidenceNow(item) && !item.evidencia).length;
            const nonConformities = group.items.filter((item) => item.resposta === "NAO_OK" || checklistValueOutOfRange(item)).length;
            const nextAction = evidencePending ? "Anexar evidência técnica" : pending ? "Responder itens obrigatórios" : os.status === "AGUARDANDO_APROVACAO" ? "Validar aprovação técnica" : "Abrir checklist da OS";
            return `
              <article class="execution-card quality-execution-card" data-action="open-os" data-os-id="${escapeAttr(os.id)}" tabindex="0" role="button">
                <div class="quality-execution-head">
                  <div>
                    <span class="tag blue">${escapeHtml(os.id || "OS")}</span>
                    <h3>${escapeHtml(os.tipo || "Ordem de serviço")}</h3>
                    <p>${escapeHtml(ativo.nome || os.ativo_id || "-")}${componente.nome ? ` · ${escapeHtml(componente.nome)}` : ""}</p>
                  </div>
                  ${statusTag(os.status || "-")}
                </div>
                <div class="model-stats quality-execution-stats">
                  <span>Respondidos <strong>${answered}/${group.items.length}</strong></span>
                  <span>Pendências <strong>${pending}</strong></span>
                  <span>Evidências <strong>${evidencePending}/${evidence}</strong></span>
                  <span>Não conformidades <strong>${nonConformities}</strong></span>
                </div>
                <div class="asset-next-action quality-next-action">
                  <span>Próxima ação</span>
                  <strong>${escapeHtml(nextAction)}</strong>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function nextChecklistModelVersion(modelos, name) {
    const normalizedName = normalize(name);
    const related = normalizedName
      ? modelos.filter((modelo) => normalize(modelo.nome) === normalizedName)
      : [];
    const versions = related.map((modelo) => Number(modelo.versao || 0)).filter(Number.isFinite);
    return String((versions.length ? Math.max(...versions) : 0) + 1);
  }

  function renderUsuarios(canEdit) {
    const users = state.data.referencias.usuarios;
    const form = canEdit ? `
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3 data-user-form-title>Salvar usuário</h3>
            <p class="muted">CRUD operacional com edicao, bloqueio e reset de senha sem apagar historico.</p>
          </div>
          <button class="ghost-action" type="button" data-action="clear-user-form">Novo usuário</button>
        </div>
        <form id="user-form" class="form-grid form-sectioned">
          <input type="hidden" name="id" value="">
          <div class="two-col">
            <label>Nome <input name="nome" required></label>
            <label>Email <input name="email" type="email" required></label>
          </div>
          <div class="three-col">
            <label>Perfil
              <select name="perfil" required>
                <option>Operador</option>
                <option>Gestor</option>
                <option>Admin</option>
              </select>
            </label>
            <label>Status
              <select name="status" required>
                <option>ATIVO</option>
                <option>INATIVO</option>
              </select>
            </label>
            <label>Setor
              <select name="setor">
                <option value="">Sem setor</option>
                ${state.data.referencias.setores.map((item) => `<option value="${escapeAttr(item.id)}">${escapeHtml(item.nome)}</option>`).join("")}
              </select>
            </label>
          </div>
          <label>Senha inicial <input name="senha" value="123456"></label>
          <div class="footer-actions">
            <button class="primary-action" type="submit">Salvar usuário</button>
          </div>
        </form>
      </section>
    ` : "";
    return `
      ${viewHeader()}
      ${form}
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>Usuários</h3>
            <p class="muted">Identidades e acessos ativos no sistema.</p>
          </div>
          <span class="tag blue">${users.length}</span>
        </div>
        <div class="user-card-grid">
          ${users.map((item) => {
            const status = item.status || "ATIVO";
            const protectedAdmin = item.perfil === "Admin" && item.id === "USR-ADMIN";
            return `
              <article class="user-card compact-admin-card ${status === "INATIVO" ? "is-inactive" : ""}">
                <div class="user-card-main">
                  <span class="user-avatar">${matIcon("person")}</span>
                  <div>
                    <span class="admin-card-kicker">${matIcon("badge")} ${escapeHtml(item.perfil || "-")}</span>
                    <h3>${escapeHtml(item.nome || item.id)}</h3>
                    <p>${escapeHtml(item.email || "-")}</p>
                  </div>
                </div>
                <div class="user-card-meta compact-meta">
                  <span>${escapeHtml(getSetor(item.setor).nome || item.setor || "Sem setor")}</span>
                  <span>${escapeHtml(item.id || "-")}</span>
                  ${protectedAdmin
                    ? renderStatusSwitch(status, { disabled: true, title: "Admin protegido" })
                    : renderStatusSwitch(status, canEdit ? { action: "toggle-user-status", data: ` data-user-id="${escapeAttr(item.id)}"`, title: status === "INATIVO" ? "Reativar usuário" : "Bloquear usuário" } : { disabled: true })}
                </div>
                ${canEdit ? `
                  <div class="user-card-actions compact-actions">
                    <button class="ghost-action icon-labeled" type="button" data-action="load-user-edit" data-user-id="${escapeAttr(item.id)}">${matIcon("edit")}<span>Editar</span></button>
                    <button class="secondary-action icon-labeled" type="button" data-action="reset-user-password" data-user-id="${escapeAttr(item.id)}">${matIcon("lock_reset")}<span>Resetar senha</span></button>
                    ${protectedAdmin
                      ? `<span class="tag blue">Admin protegido</span>`
                      : `<button class="danger-action icon-labeled" type="button" data-action="toggle-user-status" data-user-id="${escapeAttr(item.id)}">${matIcon("block")}<span>${status === "INATIVO" ? "Reativar" : "Bloquear"}</span></button>`}
                  </div>
                ` : ""}
              </article>
            `;
          }).join("") || `<div class="empty-state">Sem usuários cadastrados.</div>`}
        </div>
      </section>
    `;
  }

  function renderPermissoes() {
    if (state.view === "modulos") return renderModulosRoute();
    try {
      return renderPerfisPermissoesRoute();
    } catch (error) {
      console.error("Falha ao renderizar Perfis e Permissões", error);
      return renderPerfisPermissoesFallback(error);
    }
  }

  function renderPerfisPermissoesFallback(error) {
    return `
      ${viewHeader()}
      <section class="permission-shell route-shell route-permissions">
        <section class="permission-hero route-hero compact">
          <div>
            <span class="section-kicker">Controle de acesso</span>
            <h2>Perfis e Permissões</h2>
            <p>Matriz de acesso por perfil, módulo e regra operacional.</p>
          </div>
          <span class="tag red">Admin</span>
        </section>
        <section class="panel danger-panel">
          <h3>Falha visual recuperada</h3>
          <p class="muted">A tela foi protegida para não travar a rota. Atualize a página ou use o pacote corrigido v1.0.0.21.</p>
          <code>${escapeHtml(error && error.message ? error.message : "Erro de renderização")}</code>
        </section>
      </section>
    `;
  }

  function renderPerfisPermissoesRoute() {
    const matrix = state.session.matriz_permissoes || (window.SCSMockApi ? window.SCSMockApi.PERMISSOES : { [state.session.perfil]: state.session.permissoes });
    const definitions = getPermissionDefinitions(matrix);
    const groups = definitions.reduce((acc, item) => {
      const group = item.grupo || "Sistema";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
    const profileCards = ["Operador", "Gestor", "Admin"].map((profile) => {
      const count = Object.values(matrix[profile] || {}).filter(Boolean).length;
      return `
        <article class="permission-summary-card">
          <span class="material-symbols-rounded" aria-hidden="true">${profile === "Admin" ? "admin_panel_settings" : profile === "Gestor" ? "manage_accounts" : "engineering"}</span>
          <div>
            <strong>${profile === "Gestor" ? "Gestor/PCM" : profile}</strong>
            <small>${count} permissões liberadas</small>
          </div>
        </article>
      `;
    }).join("");
    return `
      ${viewHeader()}
      <section class="permission-shell route-shell route-permissions">
        <section class="permission-hero route-hero compact">
          <div>
            <span class="section-kicker">Controle de acesso</span>
            <h2>Perfis e Permissões</h2>
            <p>Matriz de acesso por perfil, módulo e regra operacional.</p>
          </div>
          <span class="tag red">Admin</span>
        </section>
        <form id="permissions-form" class="permissions-form permission-admin-form">
          <section class="permission-summary-grid">
            ${profileCards}
          </section>
          <label class="permission-reason">Motivo da alteração
            <input name="motivo" required placeholder="Ex.: ajuste de matriz por perfil">
          </label>
          <section class="permission-matrix" aria-label="Matriz de permissões por perfil">
            <div class="permission-matrix-head">
              <div>
                <h3>Matriz por perfil</h3>
                <p>Quem acessa o quê: liberado, bloqueado ou fixo por perfil operacional.</p>
              </div>
            </div>
            <div class="permission-category-grid">
              ${Object.entries(groups).map(([group, items]) => renderPermissionCategoryCard(group, items, matrix)).join("")}
            </div>
          </section>
          <div class="permission-save-bar"><button class="primary-action" type="submit">Salvar permissões</button></div>
        </form>
      </section>
    `;
  }

  function permissionGroupMeta(group) {
    const normalized = normalize(group || "");
    if (normalized.includes("acesso")) return { title: "Acesso", icon: "login", subtitle: "Entrada no sistema e painel inicial." };
    if (normalized.includes("rastre")) return { title: "Rastreabilidade", icon: "qr_code_scanner", subtitle: "QR Code, leitura de ativos e trilha operacional." };
    if (normalized.includes("ordem") || normalized.includes("servico")) return { title: "Ordem de Serviço", icon: "assignment", subtitle: "Criação, liberação e execução das OS." };
    if (normalized.includes("execucao") || normalized.includes("checklist")) return { title: "Qualidade Técnica", icon: "checklist", subtitle: "Checklist, execução, evidência e conformidade." };
    if (normalized.includes("cadastro")) return { title: "Ativos e Rastreabilidade", icon: "precision_manufacturing", subtitle: "Base mestre industrial, equipamentos e componentes." };
    if (normalized.includes("gestao") || normalized.includes("pcm") || normalized.includes("relatorio")) return { title: "PCM e Performance", icon: "monitoring", subtitle: "Aprovação, reabertura, relatórios e controle operacional." };
    if (normalized.includes("govern")) return { title: "Governança", icon: "admin_panel_settings", subtitle: "Usuários, permissões e fluxo operacional." };
    if (normalized.includes("auditoria")) return { title: "Auditoria", icon: "manage_search", subtitle: "Consulta de eventos e rastreabilidade administrativa." };
    if (normalized.includes("backup")) return { title: "Backup", icon: "cloud_upload", subtitle: "Continuidade e restauração da base." };
    return { title: group || "Sistema", icon: "shield", subtitle: "Permissões operacionais vinculadas ao módulo." };
  }

  function renderPermissionCategoryCard(group, items, matrix) {
    const meta = permissionGroupMeta(group);
    const liberadas = items.reduce((total, item) => total
      + (matrix.Operador && matrix.Operador[item.chave] ? 1 : 0)
      + (matrix.Gestor && matrix.Gestor[item.chave] ? 1 : 0)
      + (matrix.Admin && matrix.Admin[item.chave] ? 1 : 0), 0);
    return `
      <article class="permission-category-card">
        <div class="permission-category-head">
          <span class="material-symbols-rounded" aria-hidden="true">${meta.icon}</span>
          <div>
            <h3>${escapeHtml(meta.title)}</h3>
            <p>${escapeHtml(meta.subtitle)}</p>
          </div>
          <span class="permission-counter">${liberadas} liberadas</span>
        </div>
        <div class="permission-category-columns" aria-hidden="true">
          <span>Permissão</span><span>Operador</span><span>Gestor/PCM</span><span>Admin</span><span>Fixo</span>
        </div>
        <div class="permission-rows">
          ${items.map((item) => renderPermissionRow(item, matrix)).join("")}
        </div>
      </article>
    `;
  }

  function renderModulosRoute() {
    const matrix = state.session.matriz_permissoes || (window.SCSMockApi ? window.SCSMockApi.PERMISSOES : { [state.session.perfil]: state.session.permissoes });
    const modules = getModuleRows();
    const active = modules.filter((item) => item.status !== "INATIVO").length;
    const hidden = modules.filter((item) => item.status === "INATIVO").length;
    return `
      ${viewHeader()}
      <section class="route-shell route-modulos">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Disponibilidade visual</span>
            <h2>Módulos</h2>
            <p>Disponibilidade visual por perfil, dispositivo e área do sistema.</p>
          </div>
          <span class="tag red">Admin</span>
        </section>
        <section class="cards-grid route-metric-grid compact">
          <article class="metric-card"><span>Módulos ativos</span><strong>${active}</strong></article>
          <article class="metric-card"><span>Módulos ocultos</span><strong>${hidden}</strong></article>
          <article class="metric-card"><span>Desktop</span><strong>${modules.filter((m) => moduleDesktopRecommended(m.id)).length}</strong></article>
          <article class="metric-card"><span>Mobile</span><strong>${modules.filter((m) => moduleMobileRecommended(m.id)).length}</strong></article>
          <article class="metric-card"><span>Dropzone</span><strong>${modules.filter((m) => moduleQuickRecommended(m.id)).length}</strong></article>
        </section>
        <form id="modules-form" class="permissions-form modules-admin-form">
          <section class="module-device-map">
            ${renderModuleDeviceColumn("Operador", "Mobile prioritário", ["Início", "Minhas OS", "QR Code", "Checklist", "Alertas", "Configurações"])}
            ${renderModuleDeviceColumn("Gestor/PCM", "Mobile e desktop", ["OS", "Aprovações", "Programação", "Backlog", "Indicadores", "Relatórios"])}
            ${renderModuleDeviceColumn("Admin", "Governança", ["Usuários", "Permissões", "Módulos", "Workflow", "Auditoria", "Backup"])}
          </section>
          <section class="module-board module-board-v211">
            ${modules.map((module) => renderModuleCard(module, matrix)).join("")}
          </section>
          <div class="sticky-actions"><button class="primary-action" type="submit">Salvar módulos</button></div>
        </form>
      </section>
    `;
  }

  function renderModuleDeviceColumn(profile, subtitle, items) {
    return `
      <article class="module-device-card">
        <div>
          <strong>${escapeHtml(profile)}</strong>
          <small>${escapeHtml(subtitle)}</small>
        </div>
        <div class="module-device-tags">
          ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </article>
    `;
  }

  function getModuleRows() {
    const refs = state.data.referencias || {};
    const definitions = refs.definicoes_modulos
      || state.session.definicoes_modulos
      || (window.SCSMockApi && window.SCSMockApi.MODULE_DEFINITIONS)
      || [];
    const saved = refs.modulos || [];
    return definitions.map((definition, index) => {
      const savedRow = saved.find((item) => item.id === definition.id) || {};
      return {
        id: definition.id,
        nome: savedRow.nome || definition.nome,
        descricao: savedRow.descricao || definition.descricao,
        menu_ids: definition.menu_ids || splitCsv(savedRow.menu_ids),
        permissoes: definition.permissoes || splitCsv(savedRow.permissoes),
        status: savedRow.status || "ATIVO",
        ordem: Number(savedRow.ordem || index + 1)
      };
    }).filter((module) => module.id !== "painel").sort((a, b) => a.ordem - b.ordem);
  }

  function getModuleAccess(moduleId, profile) {
    const rows = (state.data.referencias && state.data.referencias.modulo_perfis) || [];
    return rows.find((item) => item.modulo_id === moduleId && item.perfil === profile) || {};
  }

  function renderModuleCard(module, matrix) {
    return `
      <article class="module-card module-card-v211">
        <div class="module-card-head">
          <div>
            <h3>${escapeHtml(module.nome)}</h3>
            <p>${escapeHtml(module.descricao || "")}</p>
          </div>
          <label class="switch-cell module-switch">
            <input type="checkbox" name="mod_${escapeAttr(module.id)}_status" ${module.status !== "INATIVO" ? "checked" : ""}>
            <span>Ativo</span>
          </label>
        </div>
        <input type="hidden" name="mod_${escapeAttr(module.id)}_id" value="${escapeAttr(module.id)}">
        <div class="module-display-strip" aria-label="Tipos de exibição recomendados">
          ${renderModuleDisplayBadge("Desktop", moduleDesktopRecommended(module.id))}
          ${renderModuleDisplayBadge("Mobile", moduleMobileRecommended(module.id))}
          ${renderModuleDisplayBadge("Menu lateral", true)}
          ${renderModuleDisplayBadge("Bottom nav", moduleMobileRecommended(module.id))}
          ${renderModuleDisplayBadge("Dropzone", moduleQuickRecommended(module.id))}
          ${renderModuleDisplayBadge("Oculto", module.status === "INATIVO")}
        </div>
        <div class="module-profile-grid module-profile-grid-v211">
          ${["Operador", "Gestor", "Admin"].map((profile) => renderModuleProfile(module, profile, matrix)).join("")}
        </div>
      </article>
    `;
  }

  function renderModuleDisplayBadge(label, enabled) {
    return `<span class="module-display-badge ${enabled ? "enabled" : "muted"}">${escapeHtml(label)}</span>`;
  }

  function moduleDesktopRecommended(moduleId) {
    return !["mobile", "alertas"].includes(String(moduleId || "").toLowerCase());
  }

  function moduleMobileRecommended(moduleId) {
    const id = String(moduleId || "").toLowerCase();
    return ["dashboard", "os", "checklists", "qr", "eventos", "usuarios", "permissoes", "auditoria"].some((key) => id.includes(key));
  }

  function moduleQuickRecommended(moduleId) {
    const id = String(moduleId || "").toLowerCase();
    return ["os", "check", "evento", "usuario", "permiss", "auditoria", "backup", "version"].some((key) => id.includes(key));
  }

  function renderModuleProfile(module, profile, matrix) {
    const access = getModuleAccess(module.id, profile);
    const enabled = profile === "Admin" || asBool(access.liberado) || Boolean(matrix[profile] && module.permissoes.some((permission) => matrix[profile][permission]));
    const fixed = profile === "Admin";
    return `
      <div class="module-profile module-profile-v211">
        <label class="switch-cell ${fixed ? "locked" : ""}">
          <input type="checkbox" name="mod_${escapeAttr(module.id)}_${profile}_enabled" ${enabled ? "checked" : ""} ${fixed ? "disabled" : ""} data-module-profile-toggle>
          <span>${escapeHtml(profile)}</span>
        </label>
        <div class="module-device-row" aria-label="Dispositivos e exibição">
          <span class="module-device-pill ${moduleDesktopRecommended(module.id) ? "enabled" : ""}">Desktop</span>
          <span class="module-device-pill ${moduleMobileRecommended(module.id) ? "enabled" : ""}">Mobile</span>
          <span class="module-device-pill ${moduleQuickRecommended(module.id) ? "enabled" : ""}">Ações</span>
        </div>
        <div class="module-permissions">
          ${module.permissoes.map((permission) => renderModulePermission(module.id, profile, permission, matrix, enabled, fixed)).join("")}
        </div>
      </div>
    `;
  }

  function renderModulePermission(moduleId, profile, permission, matrix, enabled, fixed) {
    const checked = profile === "Admin" || Boolean(matrix[profile] && matrix[profile][permission]);
    return `
      <label class="module-permission">
        <input type="checkbox" name="mod_${escapeAttr(moduleId)}_${profile}_${escapeAttr(permission)}" ${checked ? "checked" : ""} ${fixed || !enabled ? "disabled" : ""}>
        <span>${escapeHtml(permissionLabel(permission))}</span>
      </label>
    `;
  }

  function permissionLabel(permission) {
    const definition = getPermissionDefinitions(state.session.matriz_permissoes || {}).find((item) => item.chave === permission);
    return definition ? definition.nome : permission.replaceAll("_", " ");
  }

  function renderPermissionRow(item, matrix) {
    const key = item.chave;
    const locked = ["login", "dashboard"].includes(key);
    return `
      <div class="permission-row">
        <div class="permission-name-cell">
          <span class="material-symbols-rounded" aria-hidden="true">shield</span>
          <div>
            <strong>${escapeHtml(item.nome || key)}</strong>
            <small>${escapeHtml(key)}</small>
          </div>
        </div>
        ${permissionCheckbox("Operador", key, matrix.Operador && matrix.Operador[key], locked)}
        ${permissionCheckbox("Gestor", key, matrix.Gestor && matrix.Gestor[key], locked)}
        ${permissionCheckbox("Admin", key, true, true)}
        <span class="permission-fixed-badge ${locked ? "is-fixed" : ""}">${locked ? `${matIcon("lock")} Fixo` : "Editável"}</span>
      </div>
    `;
  }

  function permissionCheckbox(profile, key, checked, locked = false) {
    const label = profile === "Gestor" ? "Gestor/PCM" : profile;
    const isChecked = Boolean(checked || locked);
    return `
      <label class="permission-profile-toggle ${isChecked ? "is-on" : "is-off"} ${locked ? "is-locked" : ""}" aria-label="${escapeAttr(label)} - ${escapeAttr(permissionLabel(key))}">
        <input type="checkbox" name="${escapeAttr(profile)}.${escapeAttr(key)}" ${isChecked ? "checked" : ""} ${locked ? "disabled" : ""}>
        <span class="permission-switch-ui" aria-hidden="true"></span>
        <span class="permission-toggle-label">${isChecked ? "Liberado" : "Bloqueado"}</span>
      </label>
    `;
  }

  function buildModulesPayload(form) {
    const modules = getModuleRows();
    return modules.map((module) => {
      const perfis = {};
      ["Operador", "Gestor", "Admin"].forEach((profile) => {
        const enabled = profile === "Admin" || Boolean(form.elements[`mod_${module.id}_${profile}_enabled`] && form.elements[`mod_${module.id}_${profile}_enabled`].checked);
        const blocked = module.permissoes.filter((permission) => {
          const input = form.elements[`mod_${module.id}_${profile}_${permission}`];
          return profile !== "Admin" && enabled && input && !input.checked;
        });
        perfis[profile] = {
          liberado: enabled,
          permissoes_bloqueadas: blocked
        };
      });
      return {
        id: module.id,
        nome: module.nome,
        descricao: module.descricao,
        status: form.elements[`mod_${module.id}_status`] && form.elements[`mod_${module.id}_status`].checked ? "ATIVO" : "INATIVO",
        perfis
      };
    });
  }

  function buildPermissionPayload(form) {
    const matrixSource = state.session.matriz_permissoes || (window.SCSMockApi ? window.SCSMockApi.PERMISSOES : { [state.session.perfil]: state.session.permissoes });
    const definitions = getPermissionDefinitions(matrixSource);
    const matrix = { Operador: {}, Gestor: {}, Admin: {} };
    definitions.forEach((item) => {
      const locked = ["login", "dashboard"].includes(item.chave);
      matrix.Operador[item.chave] = locked || Boolean(form.elements[`Operador.${item.chave}`] && form.elements[`Operador.${item.chave}`].checked);
      matrix.Gestor[item.chave] = locked || Boolean(form.elements[`Gestor.${item.chave}`] && form.elements[`Gestor.${item.chave}`].checked);
      matrix.Admin[item.chave] = true;
    });
    return matrix;
  }

  function getPermissionDefinitions(matrix) {
    const sources = []
      .concat(state.session.definicoes_permissoes || [])
      .concat((window.SCSMockApi && window.SCSMockApi.PERMISSION_DEFINITIONS) || []);
    const merged = [];
    sources.forEach((item) => {
      if (item && item.chave && !merged.some((existing) => existing.chave === item.chave)) merged.push(item);
    });
    const fallbackPermissions = (matrix && matrix.Admin) || (state.session && state.session.permissoes) || {};
    return merged.length ? merged : Object.keys(fallbackPermissions).map((key) => ({
        chave: key,
        nome: key.replaceAll("_", " "),
        grupo: "Sistema"
      }));
  }

  function renderConfiguracoes() {
    const refs = state.data.referencias;
    const regras = refs.workflow_regras || [];
    return `
      ${viewHeader()}
      <section class="route-shell route-workflow">
        <section class="route-hero compact">
          <div>
            <span class="section-kicker">Estados e transições</span>
            <h2>Workflow</h2>
            <p>Transições oficiais, estados da OS e regras operacionais de aprovação.</p>
          </div>
          <span class="tag blue">Fluxo oficial</span>
        </section>
        ${renderWorkflowMainChain()}
        ${renderWorkflowSummary(regras)}
        ${can("configurar_fluxo") ? renderWorkflowMobileNotice() + renderWorkflowForm(regras, refs) : ""}
        ${renderStatusCatalog()}
      </section>
    `;
  }

  function renderWorkflowMainChain() {
    const steps = ["Planejada", "Liberada", "Em execução", "Aguardando aprovação", "Concluída"];
    return `
      <section class="panel workflow-chain-panel">
        <div class="workflow-chain-track" aria-label="Fluxo principal da OS">
          ${steps.map((step, index) => `<span>${escapeHtml(step)}</span>${index < steps.length - 1 ? `<i>→</i>` : ""}`).join("")}
        </div>
      </section>
    `;
  }

  function renderWorkflowMobileNotice() {
    return `
      <section class="panel workflow-mobile-notice">
        <div class="empty-state compact">
          <strong>Workflow disponível apenas na versão desktop.</strong>
          <p>Use uma tela maior para configurar fluxos operacionais.</p>
        </div>
      </section>
    `;
  }

  function renderWorkflowForm(regras, refs) {
    const rows = regras.length ? regras : workflowFallbackRows();
    const defaults = new Set(workflowFallbackRows().map((item) => item.id));
    const defaultRows = rows.filter((row) => defaults.has(row.id));
    const customRows = rows.filter((row) => !defaults.has(row.id));
    return `
      <section class="panel workflow-desktop-constructor workflow-constructor-v18 workflow-constructor-v19">
        <form id="workflow-form" class="form-grid form-sectioned workflow-form-wide workflow-form-v18 workflow-form-v19">
          <input type="hidden" name="workflow_count" value="${rows.length}">
          <datalist id="status-fluxo-list">
            ${(refs.status_fluxo || Object.keys(STATUS_LABEL)).map((status) => `<option value="${escapeAttr(status)}"></option>`).join("")}
          </datalist>
          <div class="workflow-constructor-head">
            <div>
              <span class="section-kicker">${matIcon("account_tree")} Desktop only</span>
              <h3>Construtor de fluxo operacional</h3>
              <p class="muted">Configure ações, transições, permissões e exigências de checklist.</p>
            </div>
            <div class="workflow-constructor-actions">
              <button class="ghost-action icon-labeled" type="button" data-action="add-workflow-rule">${matIcon("add_circle")}<span>Criar novo fluxo</span></button>
              <button class="primary-action icon-labeled" type="submit">${matIcon("save")}<span>Salvar fluxo</span></button>
            </div>
          </div>
          <div class="workflow-section workflow-section-v18">
            <div class="section-kicker workflow-section-title">
              <strong>${matIcon("rule")} Fluxos padrão</strong>
              <span>${rows.length} regras configuradas</span>
            </div>
            <div class="workflow-grid" data-workflow-grid>
              ${defaultRows.map((regra, index) => renderWorkflowRow(regra, index, refs)).join("")}
              ${customRows.map((regra, index) => renderWorkflowRow(regra, defaultRows.length + index, refs)).join("")}
            </div>
          </div>
        </form>
      </section>
    `;
  }

  function renderWorkflowRow(regra, index, refs) {
    const actions = refs.workflow_acoes || (window.SCSMockApi && window.SCSMockApi.WORKFLOW_ACTIONS) || workflowFallbackRows().map((item) => ({ acao: item.acao, nome: item.nome, permissao: item.permissao }));
    const permissions = getPermissionDefinitions(state.session.matriz_permissoes || {});
    const statusList = refs.status_fluxo || Object.keys(STATUS_LABEL);
    const isDefault = workflowFallbackRows().some((item) => item.id === regra.id);
    return `
      <article class="workflow-row ${isDefault ? "is-default" : "is-custom"}">
        <input type="hidden" name="id_${index}" data-workflow-field="id" value="${escapeAttr(regra.id || "")}">
        <div class="workflow-row-head">
          <div>
            <span class="flow-kicker">${isDefault ? "Fluxo padrão" : "Fluxo customizado"}</span>
            <strong>${escapeHtml(regra.nome || regra.acao || "Regra de fluxo")}</strong>
          </div>
          <div class="mini-actions workflow-row-actions">
            <span class="drag-handle" title="Controle de ordem">${matIcon("drag_indicator")}</span>
            <button class="icon-action" type="button" data-action="move-workflow-rule-up" title="Subir fluxo" aria-label="Subir fluxo">${matIcon("keyboard_arrow_up")}</button>
            <button class="icon-action" type="button" data-action="move-workflow-rule-down" title="Descer fluxo" aria-label="Descer fluxo">${matIcon("keyboard_arrow_down")}</button>
            ${isDefault ? "" : `<button class="icon-action danger-lite" type="button" data-action="remove-workflow-rule" title="Remover fluxo" aria-label="Remover fluxo">${matIcon("delete")}</button>`}
            ${renderStatusSwitch(regra.status || "ATIVO", { disabled: true, title: "Status do fluxo" })}
          </div>
        </div>
        <div class="workflow-step-grid">
          <section class="workflow-step-block">
            <b>${matIcon("rule")} 1. Ação</b>
            <label>Ação
              <select name="acao_${index}" data-workflow-field="acao" required>
                ${actions.map((item) => `<option value="${escapeAttr(item.acao)}" ${item.acao === regra.acao ? "selected" : ""}>${escapeHtml(item.nome)}</option>`).join("")}
              </select>
            </label>
            <label>Nome
              <input name="nome_${index}" data-workflow-field="nome" value="${escapeAttr(regra.nome || "")}" required>
            </label>
          </section>
          <section class="workflow-step-block">
            <b>${matIcon("sync_alt")} 2. Transição</b>
            <label>Origem
              <input name="status_origem_${index}" data-workflow-field="status_origem" value="${escapeAttr(regra.status_origem || "")}" list="status-fluxo-list" required>
            </label>
            <label>Destino
              <select name="status_destino_${index}" data-workflow-field="status_destino" required>
                ${statusList.map((status) => `<option value="${escapeAttr(status)}" ${status === regra.status_destino ? "selected" : ""}>${escapeHtml(STATUS_LABEL[status] || status)}</option>`).join("")}
              </select>
            </label>
          </section>
          <section class="workflow-step-block">
            <b>${matIcon("admin_panel_settings")} 3. Governança</b>
            <div class="workflow-status-control">
              <span>Status</span>
              ${renderWorkflowStatusToggle(regra, index)}
            </div>
            <label>Permissão exigida
              <select name="permissao_${index}" data-workflow-field="permissao" required>
                ${permissions.map((item) => `<option value="${escapeAttr(item.chave)}" ${item.chave === regra.permissao ? "selected" : ""}>${escapeHtml(item.nome)}</option>`).join("")}
              </select>
            </label>
          </section>
        </div>
        <div class="workflow-controls">
          ${["Operador", "Gestor", "Admin"].map((perfil) => `
            <label class="switch-cell profile-chip-toggle">
              <input type="checkbox" name="perfil_${index}_${perfil}" data-workflow-field="perfil" data-profile="${perfil}" ${csvHas(regra.perfis, perfil) ? "checked" : ""}>
              <span>${perfil}</span>
            </label>
          `).join("")}
          <label class="switch-cell compact-toggle">
            <input type="checkbox" name="exige_responsavel_${index}" data-workflow-field="exige_responsavel" ${asBool(regra.exige_responsavel) ? "checked" : ""}>
            <span>Responsável</span>
          </label>
          <label class="switch-cell compact-toggle">
            <input type="checkbox" name="exige_checklist_${index}" data-workflow-field="exige_checklist" ${asBool(regra.exige_checklist_ok) ? "checked" : ""}>
            <span>Checklist OK</span>
          </label>
        </div>
      </article>
    `;
  }

  function workflowBlankRow(index) {
    return {
      id: `WFL-CUSTOM-${Date.now()}-${index}`,
      acao: "INICIAR_OS",
      nome: "Novo fluxo",
      status_origem: "LIBERADA",
      status_destino: "EM_EXECUCAO",
      permissao: "configurar_fluxo",
      perfis: "Admin",
      exige_responsavel: false,
      exige_checklist_ok: false,
      status: "ATIVO"
    };
  }

  function renderWorkflowSummary(regras) {
    const rows = regras.length ? regras : workflowFallbackRows();
    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>Fluxo ativo da OS</h3>
            <p class="muted">Mapa operacional das transicoes sem visual de planilha.</p>
          </div>
          <span class="tag blue">${rows.filter((item) => item.status === "ATIVO").length} regras ativas</span>
        </div>
        <div class="workflow-summary-list">
          ${rows.map((regra) => `
            <article class="workflow-summary-card ${regra.status === "INATIVO" ? "is-inactive" : ""}">
              <div>
                <span>${escapeHtml(regra.acao || "Fluxo")}</span>
                <h3>${escapeHtml(regra.nome || regra.acao || "Regra de fluxo")}</h3>
              </div>
              <div class="flow-path">
                <b>${escapeHtml(regra.status_origem || "-")}</b>
                <i>→</i>
                <b>${escapeHtml(STATUS_LABEL[regra.status_destino] || regra.status_destino || "-")}</b>
              </div>
              <div class="event-card-meta">
                <span>${escapeHtml(permissionLabel(regra.permissao || "-"))}</span>
                <span>${escapeHtml(regra.perfis || "-")}</span>
                ${asBool(regra.exige_responsavel) ? "<span>Responsável</span>" : ""}
                ${asBool(regra.exige_checklist_ok) ? "<span>Checklist OK</span>" : ""}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderStatusCatalog() {
    return `
      <section class="panel">
        <div class="panel-head">
          <h3>Status oficiais da OS</h3>
          <span class="tag blue">${Object.keys(STATUS_LABEL).length}</span>
        </div>
        <div class="status-chip-grid">
          ${Object.keys(STATUS_LABEL).map((status) => `<span>${escapeHtml(STATUS_LABEL[status])}</span>`).join("")}
        </div>
      </section>
    `;
  }

  function workflowFallbackRows() {
    return [
      { id: "WFL-INICIAR", acao: "INICIAR_OS", nome: "Iniciar execucao", status_origem: "LIBERADA,REABERTA", status_destino: "EM_EXECUCAO", permissao: "iniciar_os", perfis: "Operador,Gestor,Admin", exige_responsavel: true, exige_checklist_ok: false, status: "ATIVO" },
      { id: "WFL-FINALIZAR", acao: "FINALIZAR_EXECUCAO", nome: "Finalizar execução", status_origem: "EM_EXECUCAO", status_destino: "AGUARDANDO_APROVACAO", permissao: "finalizar_execucao", perfis: "Operador,Gestor,Admin", exige_responsavel: true, exige_checklist_ok: true, status: "ATIVO" },
      { id: "WFL-APROVAR", acao: "APROVAR_OS", nome: "Aprovar OS", status_origem: "AGUARDANDO_APROVACAO", status_destino: "CONCLUIDA", permissao: "aprovar_os", perfis: "Gestor,Admin", exige_responsavel: false, exige_checklist_ok: true, status: "ATIVO" },
      { id: "WFL-REABRIR", acao: "REABRIR_OS", nome: "Reabrir OS", status_origem: "AGUARDANDO_APROVACAO", status_destino: "REABERTA", permissao: "reabrir_os", perfis: "Gestor,Admin", exige_responsavel: false, exige_checklist_ok: false, status: "ATIVO" }
    ];
  }

  async function renderAuditoria(content) {
    content.innerHTML = `${viewHeader()}<section class="panel"><div class="empty-state">Carregando logs...</div></section>`;
    try {
      const data = await window.SCSApi.call("logs.listar", { token: state.session.token }, "GET");
      const logs = data.logs || [];
      content.innerHTML = `
        ${viewHeader()}
        <section class="audit-command-center">
          <article class="panel audit-hero-panel">
            <div>
              <span class="section-kicker">Governança e rastreabilidade</span>
              <h3>Trilha de auditoria</h3>
              <p class="muted">Registros recentes com foco em usuario, perfil, modulo, registro e acao executada.</p>
            </div>
            <span class="tag blue">${logs.length} logs</span>
          </article>
          ${renderAuditSummary(logs)}
          <section class="panel">
            <div class="panel-head">
              <div>
                <h3>Eventos auditaveis</h3>
                <p class="muted">Linha do tempo operacional para analise de risco, compliance e suporte.</p>
              </div>
              <span class="tag">${logs.length}</span>
            </div>
            ${renderAuditCards(logs)}
          </section>
        </section>
      `;
    } catch (error) {
      content.innerHTML = `${viewHeader()}<section class="panel"><div class="empty-state">${escapeHtml(error.message)}</div></section>`;
    }
  }

  function renderAuditCards(logs) {
    if (!logs.length) return `<div class="empty-state">Sem registros de auditoria.</div>`;
    return `
      <div class="audit-timeline audit-timeline-visual">
        ${logs.map((item) => {
          const severity = auditSeverity(item);
          return `
            <article class="audit-card audit-${escapeAttr(severity)}">
              <div class="audit-mark">${matIcon(auditIcon(item))}</div>
              <div>
                <div class="audit-head">
                  <strong>${escapeHtml(item.acao || "-")}</strong>
                  <span>${escapeHtml(formatDateTime(item.data_hora))}</span>
                </div>
                <p>${escapeHtml(item.usuario || "-")} · ${escapeHtml(item.perfil || "-")}</p>
                <div class="event-card-meta">
                  <span>${escapeHtml(item.modulo || "-")}</span>
                  <span>${escapeHtml(item.registro_id || "-")}</span>
                  <span>${escapeHtml(severity.toUpperCase())}</span>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderAuditSummary(logs) {
    const bySeverity = logs.reduce((acc, item) => {
      const key = auditSeverity(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const byProfile = logs.reduce((acc, item) => {
      const key = item.perfil || "Sem perfil";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return `
      <section class="audit-summary-grid">
        ${renderAuditSummaryCard("Críticos", bySeverity.critico || 0, "Acoes sensiveis e risco operacional", "red")}
        ${renderAuditSummaryCard("Atenção", bySeverity.atencao || 0, "Alteracoes que exigem revisao", "amber")}
        ${renderAuditSummaryCard("Informativos", bySeverity.info || 0, "Registros comuns de operacao", "blue")}
        ${renderAuditSummaryCard("Perfis", Object.keys(byProfile).length, "Usuarios e papeis auditados", "green")}
      </section>
    `;
  }

  function renderAuditSummaryCard(label, value, detail, color) {
    return `
      <article class="event-summary-card ${escapeAttr(color)}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(detail)}</small>
      </article>
    `;
  }

  function auditSeverity(item) {
    const text = normalize(`${item.acao || ""} ${item.modulo || ""}`);
    if (text.includes("excluir") || text.includes("bloque") || text.includes("permiss") || text.includes("workflow") || text.includes("senha")) return "critico";
    if (text.includes("salvar") || text.includes("criar") || text.includes("alter") || text.includes("aprovar") || text.includes("reabr")) return "atencao";
    return "info";
  }

  function auditIcon(item) {
    const text = normalize(`${item.acao || ""} ${item.modulo || ""}`);
    if (text.includes("permiss")) return "admin_panel_settings";
    if (text.includes("workflow")) return "schema";
    if (text.includes("usuario") || text.includes("senha")) return "person";
    if (text.includes("backup")) return "cloud_upload";
    if (text.includes("aprovar")) return "approval";
    if (text.includes("reabr")) return "undo";
    return "manage_search";
  }

  function renderNotificacoes() {
    const items = buildNotificationItems();
    const activeTag = eventTagExists(state.eventTagFilter, items) ? state.eventTagFilter : "todos";
    const filtered = activeTag === "todos" ? items : items.filter((item) => item.tag === activeTag);
    const priority = filtered.filter((item) => item.kind === "risk" || item.kind === "approval").slice(0, 3);
    return `
      ${viewHeader()}
      <section class="event-command-center event-command-center-v2">
        <article class="panel event-center-shell event-center-hero">
          <div>
            <span class="section-kicker">Centro de eventos</span>
            <h3>Notificacoes operacionais e auditoria visual</h3>
            <p class="muted">${escapeHtml(eventCenterSubtitle())}</p>
          </div>
          <div class="event-center-total">
            <strong>${filtered.length}</strong>
            <span>eventos filtrados</span>
          </div>
        </article>

        ${renderEventSummary(items)}

        <section class="event-focus-grid">
          <article class="panel">
            <div class="panel-head">
              <div>
                <h3>Prioridade agora</h3>
                <p class="muted">Eventos que exigem decisao ou acao imediata.</p>
              </div>
              <span class="tag red">${priority.length}</span>
            </div>
            <div class="event-priority-list">
              ${priority.map(renderEventCard).join("") || `<div class="empty-state">Sem evento critico ou aprovacao pendente.</div>`}
            </div>
          </article>

          <article class="panel">
            <div class="panel-head">
              <div>
                <h3>Filtros por categoria</h3>
                <p class="muted">SLA, aprovacao, checklist, operacao, tecnico e sistema.</p>
              </div>
              <span class="tag blue">${items.length}</span>
            </div>
            ${renderEventTagFilters(items, activeTag)}
          </article>
        </section>

        ${renderEventGroups(filtered, activeTag)}
      </section>
    `;
  }

  function renderEventSummary(items) {
    const counts = eventTagCounts(items);
    const risk = items.filter((item) => item.kind === "risk").length;
    const approval = counts.aprovacao || 0;
    const checklist = counts.checklist || 0;
    const sistema = counts.sistema || 0;
    const cards = [
      ["Críticos", risk, "SLA, risco e alertas técnicos", "red", "warning"],
      ["Aprovação", approval, "OS aguardando decisão", "amber", "approval"],
      ["Checklist", checklist, "Pendências e evidências", "green", "fact_check"],
      ["Sistema", sistema, "Governança, versão e auditoria", "blue", "settings"]
    ];
    return `
      <div class="event-summary-grid event-summary-grid-v2">
        ${cards.map((card) => `
          <div class="event-summary-card ${card[3]}">
            <span class="event-summary-icon">${matIcon(card[4])}</span>
            <div>
              <span>${escapeHtml(card[0])}</span>
              <strong>${card[1]}</strong>
              <small>${escapeHtml(card[2])}</small>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderEventCenter() {
    return renderNotificacoes();
  }

  function renderEventTagFilters(items, activeTag) {
    const counts = eventTagCounts(items);
    const visibleTags = EVENT_TAGS.filter((tag) => tag.id === "todos" || counts[tag.id] || tag.id === activeTag);
    return `
      <div class="event-tag-strip" role="tablist" aria-label="Filtros de eventos por tag">
        ${visibleTags.map((tag) => {
          const active = tag.id === activeTag ? "active" : "";
          const count = tag.id === "todos" ? items.length : counts[tag.id] || 0;
          return `
            <button class="${active}" type="button" data-action="event-tag-filter" data-tag="${escapeAttr(tag.id)}" role="tab" aria-selected="${active ? "true" : "false"}">
              <strong>${escapeHtml(tag.label)}</strong>
              <span>${count}</span>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderEventGroups(items, activeTag) {
    if (!items.length) return `<section class="panel"><div class="empty-state">Sem eventos para a tag selecionada.</div></section>`;
    const orderedTags = activeTag === "todos"
      ? EVENT_TAGS.filter((tag) => tag.id !== "todos" && items.some((item) => item.tag === tag.id))
      : EVENT_TAGS.filter((tag) => tag.id === activeTag);
    return `
      <section class="event-group-stack event-group-stack-v2">
        ${orderedTags.map((tag) => {
          const group = items.filter((item) => item.tag === tag.id);
          if (!group.length) return "";
          return `
            <article class="event-group panel tag-${escapeAttr(tag.id)}">
              <div class="panel-head">
                <div>
                  <h3>${escapeHtml(tag.label)}</h3>
                  <p class="muted">${escapeHtml(tag.detail)}</p>
                </div>
                <span class="tag">${group.length}</span>
              </div>
              <div class="event-list event-list-v2">
                ${group.map(renderEventCard).join("")}
              </div>
            </article>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderEventCard(item) {
    const action = eventActionLabel(item);
    return `
      <article class="event-list-card event-list-card-v2 ${escapeAttr(item.kind)} tag-${escapeAttr(item.tag)}" ${eventCardActionAttrs(item)} tabindex="0" role="button">
        <div class="event-card-icon">${matIcon(eventIcon(item))}</div>
        <div class="event-card-body">
          <div class="event-card-tags">
            <span>${escapeHtml(item.kindLabel)}</span>
            ${item.time ? `<small>${escapeHtml(formatDateTime(item.time))}</small>` : ""}
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
          <div class="event-card-meta">
            ${item.actor ? `<span>${escapeHtml(item.actor)}</span>` : ""}
            ${item.osId ? `<span>${escapeHtml(item.osId)}</span>` : ""}
            <span>${escapeHtml(eventResponsibleProfile(item))}</span>
          </div>
        </div>
        <span class="event-open-indicator">${escapeHtml(action)}</span>
      </article>
    `;
  }

  function eventIcon(item) {
    if (item.kind === "risk") return "warning";
    if (item.kind === "approval") return "approval";
    if (item.tag === "checklist") return "fact_check";
    if (item.tag === "tecnico") return "precision_manufacturing";
    if (item.tag === "sistema") return "settings";
    if (item.tag === "sla") return "timer";
    return "notifications";
  }

  function eventActionLabel(item) {
    if (item.action === "open-os") return "Abrir OS";
    if (item.action === "resolve-qr") return "Ver ativo";
    if (item.view === "versionamento") return "Ver versão";
    if (item.view) return "Abrir";
    return "Analisar";
  }

  function eventResponsibleProfile(item) {
    if (item.tag === "aprovacao") return "Gestor / PCM";
    if (item.tag === "sistema") return "Admin Master";
    if (item.tag === "sla") return "Gestor / PCM";
    if (item.tag === "checklist") return "Operador";
    if (item.tag === "tecnico") return "Operador / Gestor";
    return "Sistema";
  }

  function eventCardActionAttrs(item) {
    if (item.action === "open-os" && item.osId) {
      return `data-action="open-os" data-os-id="${escapeAttr(item.osId)}"`;
    }
    if (item.action === "resolve-qr" && item.qr) {
      return `data-action="resolve-qr" data-qr="${escapeAttr(item.qr)}"`;
    }
    if (item.action === "view" && item.view) {
      return `data-view="${escapeAttr(item.view)}"`;
    }
    return `data-action="dashboard-filter" data-target-view="${escapeAttr(item.view || "gestao-os")}" data-status="${escapeAttr(item.status || "")}" data-quick="${escapeAttr(item.quick || "")}" data-search="${escapeAttr(item.search || "")}"`;
  }

  function buildNotificationItems() {
    if (!state.data) return [];
    const orders = state.data.ordens || [];
    const refs = state.data.referencias || {};
    const items = [];
    orders.filter(isLate).forEach((os) => {
      items.push({
        kind: "risk",
        kindLabel: "SLA",
        tag: "sla",
        title: `${os.id} atrasada`,
        detail: `${getAtivo(os.ativo_id).nome || os.ativo_id} - prazo ${os.prazo || "-"}`,
        view: "acompanhamento",
        quick: "atrasadas",
        osId: os.id,
        time: os.prazo,
        action: "open-os"
      });
    });
    orders.filter((os) => os.status === "AGUARDANDO_APROVACAO").forEach((os) => {
      items.push({
        kind: "approval",
        kindLabel: "Aprovação",
        tag: "aprovacao",
        title: `${os.id} aguarda aprovacao`,
        detail: `${getAtivo(os.ativo_id).nome || os.ativo_id} - responsavel ${getUser(os.responsavel).nome || os.responsavel || "-"}`,
        view: "acompanhamento",
        status: "AGUARDANDO_APROVACAO",
        osId: os.id,
        time: os.finalizado_em || os.criado_em,
        action: "open-os"
      });
    });

    (refs.parametros_equipamento || [])
      .filter((parametro) => String(parametro.status_operacional || "NORMAL").toUpperCase() !== "NORMAL")
      .forEach((parametro) => {
        const equipamento = getAtivo(parametro.equipamento_id);
        items.push({
          kind: String(parametro.status_operacional).toUpperCase() === "CRITICO" ? "risk" : "event",
          kindLabel: "Técnico",
          tag: "tecnico",
          title: `${parametro.nome} em ${parametro.status_operacional}`,
          detail: `${equipamento.nome || parametro.equipamento_id} - ${parametro.valor} ${parametro.unidade || ""}`,
          qr: equipamento.qr_code || equipamento.id,
          time: parametro.atualizado_em,
          action: "resolve-qr"
        });
      });

    state.data.eventos.forEach((evento) => {
      items.push(eventToNotification(evento));
    });

    if (state.session.perfil === "Admin") {
      const versions = (refs.versionamento || []).slice().sort((a, b) => String(b.data).localeCompare(String(a.data)) || String(b.versao).localeCompare(String(a.versao)));
      const current = versions[0];
      if (current) {
        items.push({
          kind: "event",
          kindLabel: "Sistema",
          tag: "sistema",
          title: `Versao ${current.versao} ativa`,
          detail: current.titulo || "Build atual registrado no versionamento.",
          view: "versionamento",
          time: current.data,
          action: "view"
        });
      }
    }

    return items.sort(sortEventItems).slice(0, 36);
  }

  function eventToNotification(evento) {
    const tag = eventTagFromType(evento.tipo);
    const os = getOs(evento.os_id);
    const equipamento = os.id ? getAtivo(os.ativo_id) : {};
    return {
      kind: tag === "sla" ? "risk" : (tag === "aprovacao" ? "approval" : "event"),
      kindLabel: eventTagMeta(tag).label,
      tag,
      title: `${evento.tipo} - ${evento.os_id}`,
      detail: evento.resumo || `${equipamento.nome || os.ativo_id || "Evento operacional"} - ${formatDateTime(evento.data_hora)}`,
      view: "comunicacoes",
      search: evento.os_id,
      osId: evento.os_id,
      actor: getUser(evento.usuario).nome || evento.usuario,
      time: evento.data_hora,
      action: evento.os_id ? "open-os" : "view"
    };
  }

  function eventTagFromType(tipo) {
    const value = String(tipo || "").toUpperCase();
    if (value.includes("ALERTA") || value.includes("ATRASO") || value.includes("SLA")) return "sla";
    if (value.includes("APROV")) return "aprovacao";
    if (value.includes("CHECKLIST")) return "checklist";
    if (value.includes("PARAM") || value.includes("COMPONENT") || value.includes("QR")) return "tecnico";
    if (value.includes("VERSAO") || value.includes("SISTEMA") || value.includes("BACKUP")) return "sistema";
    return "operacao";
  }

  function eventTagMeta(id) {
    return EVENT_TAGS.find((tag) => tag.id === id) || EVENT_TAGS[0];
  }

  function eventTagCounts(items) {
    return items.reduce((acc, item) => {
      acc[item.tag] = (acc[item.tag] || 0) + 1;
      return acc;
    }, {});
  }

  function eventTagExists(tag, items) {
    return tag === "todos" || items.some((item) => item.tag === tag);
  }

  function sortEventItems(a, b) {
    const priority = { risk: 0, approval: 1, event: 2 };
    const priorityDiff = (priority[a.kind] ?? 9) - (priority[b.kind] ?? 9);
    if (priorityDiff) return priorityDiff;
    return String(b.time || "").localeCompare(String(a.time || ""));
  }

  function eventCenterSubtitle() {
    if (state.session.perfil === "Admin") return "Governança do sistema, riscos, auditoria operacional e versoes.";
    if (state.session.perfil === "Gestor") return "PCM analitico com SLA, aprovacoes, parametros e execucao.";
    return "Fila rapida de chao de fabrica: OS, checklist, alertas e QR.";
  }

  function renderBackup() {
    return `
      ${viewHeader()}
      <section class="panel">
        <div class="panel-head">
          <h3>Base local de teste</h3>
          <span class="tag blue">${window.SCS_CONFIG.apiUrl ? "API real" : "Mock local"}</span>
        </div>
        <div class="footer-actions">
          <button class="secondary-action" type="button" data-action="export-backup">Exportar</button>
          <button class="ghost-action" type="button" data-action="reset-local">Restaurar base inicial</button>
        </div>
        <label class="small-note">Restaurar arquivo JSON
          <input type="file" accept="application/json" data-action="import-backup">
        </label>
      </section>
    `;
  }

  function renderIntegracoes() {
    return `
      ${viewHeader()}
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>API do sistema</h3>
            <p class="muted">Contrato ativo usado pelo frontend, mock local e Apps Script.</p>
          </div>
          <span class="tag blue">${systemEndpoints().length} endpoints</span>
        </div>
        <dl class="data-list">
          ${dataRow("Modo atual", window.SCS_CONFIG.apiUrl ? "Google Apps Script" : "Mock local")}
          ${dataRow("API URL", window.SCS_CONFIG.apiUrl || "Vazio: usa base local do navegador")}
        </dl>
        <div class="endpoint-grid">
          ${systemEndpoints().map((endpoint) => `<span>${escapeHtml(endpoint)}</span>`).join("")}
        </div>
      </section>
    `;
  }

  function renderVersionamento() {
    const versions = ((state.data.referencias && state.data.referencias.versionamento) || [])
      .slice()
      .sort((a, b) => String(b.data).localeCompare(String(a.data)) || String(b.versao).localeCompare(String(a.versao)));
    const current = versions[0] || {};
    return `
      ${viewHeader()}
      <section class="dashboard-grid compact-dashboard-grid version-grid">
        ${renderStaticInfoCard({ label: "Versão atual", value: current.versao || window.SCS_CONFIG.appVersion || "-", hint: current.titulo || "Build local", pct: 100 })}
        ${renderStaticInfoCard({ label: "Releases", value: versions.length, hint: "Registros de entrega", pct: clampPercent(versions.length * 18) })}
        ${renderStaticInfoCard({ label: "Endpoints", value: systemEndpoints().length, hint: "Contrato lógico ativo", pct: 100 })}
        ${renderStaticInfoCard({ label: "Schema", value: "Sheets", hint: "Google Sheets versionado", pct: 100 })}
      </section>
      <section class="panel">
        <div class="panel-head">
          <h3>Contrato ativo</h3>
          <span class="tag blue">${escapeHtml(window.SCS_CONFIG.appVersion || "local")}</span>
        </div>
        <div class="endpoint-grid">
          ${systemEndpoints().map((endpoint) => `<span>${escapeHtml(endpoint)}</span>`).join("")}
        </div>
      </section>
      <section class="version-timeline">
        ${versions.map((version) => `
          <article class="version-card panel">
            <div class="panel-head">
              <div>
                <h3>${escapeHtml(version.versao)} - ${escapeHtml(version.titulo)}</h3>
                <p class="muted">${escapeHtml(version.escopo || "")}</p>
              </div>
              <span class="tag ${version.status === "ATIVO" ? "green" : "blue"}">${escapeHtml(version.status || "REGISTRADO")}</span>
            </div>
            <dl class="data-list">
              ${dataRow("Data", version.data || "-")}
              ${dataRow("Endpoints", version.endpoints || "-")}
              ${dataRow("Schema", version.schema || "-")}
              ${dataRow("Observações", version.observacoes || "-")}
            </dl>
          </article>
        `).join("") || `<div class="empty-state">Sem versões registradas.</div>`}
      </section>
    `;
  }

  function systemEndpoints() {
    return [
      "auth.login",
      "os.listar",
      "os.criar",
      "os.iniciar",
      "checklist.salvar",
      "os.finalizar_execucao",
      "os.aprovar",
      "parametros.registrar_leitura",
      "componentes.registrar_evento",
      "usuarios.salvar",
      "permissoes.listar",
      "permissoes.salvar",
      "modulos.salvar",
      "cadastros.salvar",
      "checklist_modelo.salvar",
      "workflow.salvar",
      "logs.listar"
    ];
  }

  function renderQrCode() {
    const manualClass = state.qrManualOpen ? "" : "hidden";
    return `
      ${viewHeader(`<button class="ghost-action" type="button" data-view="dashboard">${matIcon("arrow_back")} Voltar</button>`)}
      <section class="qr-operational-page mobile-qr-flow">
        <section class="panel qr-panel qr-direct-panel">
          <div class="qr-mobile-head">
            <div>
              <span class="section-kicker">Leitura operacional</span>
              <h3>QR Code</h3>
              <p class="muted">Aponte para o código do ativo, OS, setor ou componente.</p>
            </div>
            <span class="qr-countdown-pill" id="qr-countdown">30s</span>
          </div>
          <div class="qr-scanner">
            <video id="qr-video" class="qr-video hidden" playsinline muted></video>
            <div class="qr-camera-state" id="qr-camera-state">
              ${matIcon("qr_code_scanner")}
              <strong>Scanner pronto</strong>
              <span>A câmera inicia automaticamente no mobile quando permitido.</span>
            </div>
          </div>
          <div class="footer-actions qr-mobile-actions">
            <button class="primary-action" type="button" data-action="start-qr-camera">${matIcon("photo_camera")} Iniciar leitura</button>
            <button class="secondary-action" type="button" data-action="toggle-manual-qr">${matIcon("keyboard")} Digitar código</button>
            <button class="ghost-action" type="button" data-action="stop-qr-camera">${matIcon("stop_circle")} Parar</button>
          </div>
          <p class="small-note" id="qr-scan-status">Tentando leitura por até 30 segundos. Use digitação manual se preferir.</p>
        </section>
        <section class="panel ${manualClass}" id="qr-manual-panel">
          <form id="qr-form" class="form-grid qr-manual-form">
            <label>Tipo esperado
              <select name="tipo">
                <option value="AUTO">Detectar automaticamente</option>
                <option value="EQUIPAMENTO">Equipamento</option>
                <option value="OS">Ordem de serviço</option>
                <option value="PLANTA">Planta</option>
                <option value="SETOR">Setor</option>
                <option value="LINHA">Linha</option>
                <option value="COMPONENTE">Componente</option>
              </select>
            </label>
            <label>Código, link ou ID
              <input name="qr" placeholder="OS-102, EQ-ENV-03, SET-CONS" required>
            </label>
            <button class="primary-action" type="submit">${matIcon("search")} Identificar</button>
          </form>
        </section>
        <section class="panel qr-result-panel" id="qr-result">
          <div class="empty-state">Leia ou digite um código para abrir o registro operacional.</div>
        </section>
      </section>
    `;
  }

  function renderQrTargetResult(target) {
    if (!target) return renderQrManualFallback("Código não identificado.");
    if (target.tipo === "EQUIPAMENTO") return renderQrResult(target.item);
    if (target.tipo === "OS") {
      openOs(target.item.id);
      return "";
    }
    if (target.tipo === "PLANTA") {
      const setores = state.data.referencias.setores.filter((item) => item.planta_id === target.item.id);
      const linhas = state.data.referencias.linhas.filter((linha) => setores.some((setor) => setor.id === linha.setor_id));
      const equipamentos = state.data.referencias.equipamentos.filter((equip) => setores.some((setor) => setor.id === equip.setor_id));
      return renderQrStructureResult("Planta", target.item.nome, [
        ["ID", target.item.id],
        ["CNPJ", target.item.cnpj || "-"],
        ["Cidade/UF", [target.item.cidade, target.item.uf].filter(Boolean).join(" / ") || "-"],
        ["Setores", setores.length],
        ["Linhas", linhas.length],
        ["Equipamentos", equipamentos.length],
        ["Status", target.item.status]
      ]);
    }
    if (target.tipo === "SETOR") {
      const linhas = state.data.referencias.linhas.filter((item) => item.setor_id === target.item.id);
      const equipamentos = state.data.referencias.equipamentos.filter((item) => item.setor_id === target.item.id);
      return renderQrStructureResult("Setor", target.item.nome, [
        ["ID", target.item.id],
        ["Planta", getPlanta(target.item.planta_id).nome || target.item.planta_id],
        ["Responsável", getUser(target.item.responsavel).nome || target.item.responsavel || "-"],
        ["Linhas", linhas.length],
        ["Equipamentos", equipamentos.length],
        ["Status", target.item.status]
      ]);
    }
    if (target.tipo === "LINHA") {
      const equipamentos = state.data.referencias.equipamentos.filter((item) => item.linha_id === target.item.id);
      return renderQrStructureResult("Linha", target.item.nome, [
        ["ID", target.item.id],
        ["Setor", getSetor(target.item.setor_id).nome || target.item.setor_id],
        ["Capacidade", target.item.capacidade || "-"],
        ["Equipamentos", equipamentos.length],
        ["Status", target.item.status]
      ]);
    }
    if (target.tipo === "COMPONENTE") {
      return renderQrComponentResult(target.item);
    }
    return `<div class="empty-state">Tipo de QR ainda não reconhecido.</div>`;
  }

  function renderQrStructureResult(tipo, nome, rows, action) {
    return `
      <div class="panel-head">
        <div>
          <h3>${escapeHtml(tipo)} - ${escapeHtml(nome)}</h3>
          <p class="muted">Registro estrutural identificado por QR Code.</p>
        </div>
        <span class="tag blue">${escapeHtml(tipo)}</span>
      </div>
      <dl class="data-list">
        ${rows.map(([label, value]) => dataRow(label, value)).join("")}
      </dl>
      ${action ? `<div class="footer-actions">${action}</div>` : ""}
    `;
  }

  function renderQrComponentResult(componente) {
    const equipamento = getAtivo(componente.equipamento_id);
    const relatedOrders = (state.data.ordens || []).filter((os) => os.componente_id === componente.id);
    const pendingOrders = relatedOrders.filter((os) => !["CONCLUIDA", "CANCELADA"].includes(os.status));
    const history = (state.data.historico_componentes || state.data.historico || []).filter((item) => item.componente_id === componente.id);
    const lastEvent = history.slice().sort((a, b) => String(b.data_hora || b.data || "").localeCompare(String(a.data_hora || a.data || "")))[0] || {};
    const summaryRows = [
      ["Componente", componente.nome || componente.id],
      ["Equipamento pai", equipamento.nome || componente.equipamento_id || "-"],
      ["Status", componente.status || "-"],
      ["Criticidade", componente.criticidade || "-"],
      ["Último evento", lastEvent.tipo || lastEvent.evento || "Sem registro disponível"]
    ];
    const osContent = pendingOrders.length
      ? `<div class="qr-linked-actions">${pendingOrders.map((os) => `<button class="secondary-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}">${matIcon("assignment")} ${escapeHtml(os.id)} · ${escapeHtml(STATUS_LABEL[os.status] || os.status || "OS")}</button>`).join("")}</div>`
      : `<div class="empty-state compact">Sem OS vinculada a este componente.</div>`;
    return `
      <div class="asset-hero mobile-component-hero">
        <div>
          <span class="asset-kicker">QR de componente</span>
          <h3>${escapeHtml(componente.nome || componente.id)}</h3>
          <p>${escapeHtml(equipamento.nome ? `Equipamento pai: ${equipamento.nome}` : "Componente estrutural identificado.")}</p>
        </div>
        <div class="asset-state ${String(componente.status || "").toUpperCase() === "ATIVO" ? "normal" : "warning"}">
          <strong>${escapeHtml(componente.status || "-")}</strong>
          <span>Criticidade ${escapeHtml(componente.criticidade || "-")}</span>
        </div>
      </div>
      <dl class="data-list mobile-compact-ficha">
        ${summaryRows.map(([label, value]) => dataRow(label, value)).join("")}
      </dl>
      ${mobileAdaptiveDetails("OS vinculadas", `${pendingOrders.length} pendente(s)`, osContent, "qr-mobile-os-links", Boolean(pendingOrders.length))}
      ${mobileAdaptiveDetails("Histórico do componente", `${history.length} evento(s)`, renderAssetHistory([], history), "qr-mobile-history", false)}
      <div class="footer-actions mobile-icon-actions">
        ${equipamento.id ? `<button class="secondary-action" type="button" data-action="resolve-qr" data-qr="${escapeAttr(equipamento.id)}" aria-label="Abrir equipamento pai">${matIcon("precision_manufacturing")} Equipamento</button>` : ""}
        ${pendingOrders[0] ? `<button class="primary-action" type="button" data-action="open-os" data-os-id="${escapeAttr(pendingOrders[0].id)}" aria-label="Abrir OS vinculada">${matIcon("assignment")} Abrir OS</button>` : ""}
      </div>
    `;
  }

  function renderQrManualFallback(message) {
    return `
      <div class="empty-state qr-unknown-state">
        <strong>${escapeHtml(message)}</strong>
        <span>Use a leitura novamente ou digite o código impresso na etiqueta.</span>
        <div class="footer-actions mobile-icon-actions">
          <button class="secondary-action" type="button" data-action="start-qr-camera" aria-label="Tentar leitura novamente">${matIcon("qr_code_scanner")} Tentar novamente</button>
          <button class="ghost-action" type="button" data-action="toggle-manual-qr" aria-label="Digitar código manualmente">${matIcon("keyboard")} Digitar código</button>
        </div>
      </div>
    `;
  }

  function renderQrResult(equipamento) {
    const relatedOrders = state.data.ordens.filter((os) => os.ativo_id === equipamento.id);
    const pendingOrders = relatedOrders.filter((os) => !["CONCLUIDA", "CANCELADA"].includes(os.status));
    const parametros = getEquipmentParameters(equipamento.id);
    const leituras = getEquipmentReadings(equipamento.id);
    const componentes = getEquipmentComponents(equipamento.id);
    const historicoComponentes = getEquipmentComponentHistory(equipamento.id);
    const historicoAtivo = state.data.historico.filter((item) => item.ativo_id === equipamento.id);
    const evidencias = getEquipmentEvidences(relatedOrders);
    const operational = getEquipmentOperationalState(equipamento, pendingOrders, parametros, componentes);
    const parametrosEmAtenção = parametros.filter((parametro) => parameterStatus(parametro, getLatestParameterReading(parametro, leituras)) !== "NORMAL").length;
    const componentesBloqueados = componentes.filter((item) => item.status === "BLOQUEADO" || item.status === "INATIVO").length;
    const inactive = equipamento.status !== "ATIVO";
    return `
      <div class="asset-hero">
        <div>
          <span class="asset-kicker">Rastreabilidade QR</span>
          <h3>${escapeHtml(equipamento.nome)}</h3>
          <p>${escapeHtml(equipamento.descricao || "Ficha operacional do ativo.")}</p>
        </div>
        <div class="asset-state ${escapeAttr(operational.className)}">
          <strong>${escapeHtml(operational.label)}</strong>
          <span>${escapeHtml(operational.detail)}</span>
        </div>
      </div>
      <div class="asset-quick-grid">
        ${renderAssetStat("OS abertas", pendingOrders.length, pendingOrders.length ? "Intervenção pendente" : "Sem pendência")}
        ${renderAssetStat("Componentes", componentes.length, `${componentes.filter((item) => item.status === "ATIVO").length} ativos / ${componentesBloqueados} bloqueados`)}
        ${renderAssetStat("Parâmetros", parametros.length, `${parametrosEmAtenção} em atenção`)}
        ${renderAssetStat("Evidências", evidencias.length, "Fotos e arquivos da OS")}
        ${renderAssetStat("Histórico", historicoAtivo.length + historicoComponentes.length, "Eventos do ativo")}
      </div>
      ${mobileAdaptiveDetails("Ficha técnica", "Identificação, localização, condição e rastreabilidade", renderAssetTechnicalFicha(equipamento), "asset-mobile-ficha", false)}
      ${inactive ? `<p class="small-note">Ativo inativo: somente histórico e consulta ficam disponíveis.</p>` : ""}
      ${mobileAdaptiveDetails("OS vinculadas", `${pendingOrders.length} pendente(s)`, pendingOrders.length ? `
        <div class="qr-pending-list mobile-icon-actions">
          ${pendingOrders.map((os) => `
            <button class="secondary-action" type="button" data-action="open-os" data-os-id="${escapeAttr(os.id)}" aria-label="Abrir ${escapeAttr(os.id)}">
              ${matIcon("assignment")} ${escapeHtml(os.id)} · ${escapeHtml(STATUS_LABEL[os.status] || os.status)}
            </button>
          `).join("")}
        </div>
      ` : `<div class="empty-state compact">Sem OS pendente para este equipamento no momento.</div>`, "asset-mobile-os", Boolean(pendingOrders.length))}
      ${mobileAdaptiveDetails("Parâmetros operacionais", `${parametros.length} sinal(is) · ${parametrosEmAtenção} em atenção`, `
        ${renderParameterGrid(parametros, leituras)}
        ${renderParameterReadingTimeline(parametros, leituras)}
        ${!inactive && can("qr") ? renderParameterReadingForm(equipamento, parametros) : ""}
      `, "asset-mobile-parameters", parametrosEmAtenção > 0)}
      ${mobileAdaptiveDetails("Componentes vinculados", `${componentes.length} componente(s)`, `
        ${renderComponentTrace(componentes, historicoComponentes)}
        ${!inactive && can("qr") ? renderComponentEventForm(equipamento, componentes) : ""}
      `, "asset-mobile-components", false)}
      ${mobileAdaptiveDetails("Evidências técnicas", `${evidencias.length} registro(s)`, renderAssetEvidence(evidencias), "asset-mobile-evidence", false)}
      ${mobileAdaptiveDetails("Histórico do ativo", `${historicoAtivo.length + historicoComponentes.length} evento(s)`, renderAssetHistory(historicoAtivo, historicoComponentes), "asset-mobile-history", false)}
      <div class="footer-actions asset-ficha-actions">
        ${can("criar_os") && !inactive ? `<button class="primary-action" type="button" data-action="create-os-from-equipment" data-ativo-id="${escapeAttr(equipamento.id)}">Criar OS neste equipamento</button>` : ""}
        <button class="ghost-action" type="button" data-action="copy-qr" data-qr="${escapeAttr(equipamento.qr_code || equipamento.id)}">Copiar QR</button>
        <button class="ghost-action" type="button" data-action="print-qr">Imprimir ficha</button>
        ${state.session.perfil === "Operador" && !pendingOrders.length ? `<span class="small-note">Sem pendência operacional. Solicite uma OS para a Gestão se houver anomalia.</span>` : ""}
      </div>
    `;
  }

  function renderAssetTechnicalFicha(equipamento) {
    const linha = getLinha(equipamento.linha_id);
    const setor = getSetor(equipamento.setor_id);
    const planta = getPlanta(setor.planta_id || linha.planta_id || "");
    const groups = [
      {
        title: "Identificação",
        rows: [
          ["ID", equipamento.id],
          ["Tipo", equipamento.tipo || "-"],
          ["Fabricante / Modelo", [equipamento.fabricante, equipamento.modelo].filter(Boolean).join(" / ") || "-"],
          ["Número de série", equipamento.numero_serie || "-"]
        ]
      },
      {
        title: "Localização",
        rows: [
          ["Planta", planta.nome || "-"],
          ["Setor", setor.nome || equipamento.setor_id || "-"],
          ["Linha", linha.nome || equipamento.linha_id || "-"],
          ["Instalação", equipamento.data_instalacao || "-"]
        ]
      },
      {
        title: "Condição operacional",
        rows: [
          ["Status", equipamento.status || "-"],
          ["Criticidade", equipamento.criticidade || "-"],
          ["Horímetro", equipamento.horimetro_atual || "-"]
        ]
      },
      {
        title: "Rastreabilidade",
        rows: [
          ["QR Code", equipamento.qr_code || "-"],
          ["Vínculo técnico", "Ativo físico → QR Code → OS → Histórico"]
        ]
      }
    ];
    return `
      <section class="asset-ficha-grid" aria-label="Ficha técnica do ativo">
        ${groups.map((group) => `
          <article class="asset-ficha-card">
            <h4>${escapeHtml(group.title)}</h4>
            <dl>
              ${group.rows.map(([label, value]) => dataRow(label, value)).join("")}
            </dl>
          </article>
        `).join("")}
      </section>
    `;
  }

  function renderAssetStat(label, value, detail) {
    return `
      <div class="asset-stat">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(detail)}</small>
      </div>
    `;
  }

  function renderParameterGrid(parametros, leituras) {
    if (!parametros.length) return `<div class="empty-state compact">Nenhum parâmetro cadastrado para este equipamento.</div>`;
    return `
      <div class="parameter-grid parameter-technical-grid">
        ${parametros.map((parametro) => {
          const last = getLatestParameterReading(parametro, leituras);
          const status = parameterStatus(parametro, last);
          const unidade = parametro.unidade || last?.unidade || "";
          const leitura = `${last ? last.valor : parametro.valor || "-"}${unidade ? ` ${unidade}` : ""}`;
          const faixa = `${parametro.limite_min || "-"}–${parametro.limite_max || "-"}${parametro.unidade ? ` ${parametro.unidade}` : ""}`;
          const dataHora = last ? formatDateTime(last.data_hora) : formatDateTime(parametro.atualizado_em);
          const origem = last?.origem || parametro.origem || "Sistema";
          return `
            <article class="parameter-card parameter-technical-card ${escapeAttr(status.toLowerCase())}">
              <div class="parameter-card-head">
                <h4>${escapeHtml(formatTechnicalTerm(parametro.nome))}</h4>
                <span>${escapeHtml(parameterStatusLabel(status))}</span>
              </div>
              <dl>
                ${dataRow("Leitura", leitura)}
                ${dataRow("Faixa", faixa)}
                ${dataRow("Última leitura", dataHora || "-")}
                ${dataRow("Origem", origem)}
              </dl>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderParameterReadingTimeline(parametros, leituras) {
    if (!leituras.length) return `<div class="empty-state compact">Sem leituras registradas para os parâmetros deste equipamento.</div>`;
    const parametroMap = new Map(parametros.map((item) => [item.id, item]));
    const rows = leituras
      .slice()
      .sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora)))
      .slice(0, 6);
    return `
      <div class="reading-timeline">
        ${rows.map((reading) => {
          const parametro = parametroMap.get(reading.parametro_id) || {};
          const status = parameterStatus(parametro, reading);
          return `
            <div class="reading-row ${escapeAttr(status.toLowerCase())}">
              <span>${escapeHtml(parameterStatusLabel(status))}</span>
              <strong>${escapeHtml(formatTechnicalTerm(parametro.nome || reading.parametro_id))}</strong>
              <em>${escapeHtml(reading.valor)} ${escapeHtml(reading.unidade || parametro.unidade || "")}</em>
              <small>${escapeHtml(formatDateTime(reading.data_hora))} · Origem: ${escapeHtml(reading.origem || "Sistema")}</small>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderParameterReadingForm(equipamento, parametros) {
    if (!parametros.length) return "";
    return `
      <form id="asset-reading-form" class="asset-reading-form">
        <input type="hidden" name="equipamento_id" value="${escapeAttr(equipamento.id)}">
        <label>Parâmetro
          <select name="parametro_id" required>
            ${parametros.map((parametro) => `
              <option value="${escapeAttr(parametro.id)}" data-unit="${escapeAttr(parametro.unidade || "")}">
                ${escapeHtml(parametro.nome)} ${parametro.unidade ? `(${escapeHtml(parametro.unidade)})` : ""}
              </option>
            `).join("")}
          </select>
        </label>
        <label>Nova leitura
          <input name="valor" inputmode="decimal" autocomplete="off" placeholder="Ex.: 7.4" required>
        </label>
        <label>Observação
          <input name="observacao" autocomplete="off" maxlength="180" placeholder="Opcional">
        </label>
        <button class="primary-action" type="submit">Salvar leitura</button>
      </form>
    `;
  }

  function renderAssetEvidence(evidencias) {
    if (!evidencias.length) return `<div class="empty-state compact">Nenhuma evidência vinculada a OS deste equipamento.</div>`;
    return `
      <div class="evidence-grid">
        ${evidencias.map((evidencia) => `
          <article class="evidence-card">
            <span>${escapeHtml(evidencia.tipo)}</span>
            <strong>${escapeHtml(evidencia.nome)}</strong>
            <dl>
              ${dataRow("OS", evidencia.os_id)}
              ${dataRow("Checklist", evidencia.pergunta || evidencia.checklist_id || "-")}
              ${dataRow("Usuário", evidencia.usuario || "-")}
              ${dataRow("Data", formatDateTime(evidencia.data_hora))}
            </dl>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderComponentTrace(componentes, historico) {
    if (!componentes.length) return `<div class="empty-state compact">Nenhum componente vinculado.</div>`;
    return `
      <div class="component-trace-grid">
        ${componentes.map((component) => {
          const last = historico
            .filter((item) => item.componente_id === component.id)
            .sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora)))[0];
          return `
            <article class="component-trace-card ${escapeAttr(String(component.status || "").toLowerCase())}">
              <div>
                <span>Componente</span>
                <h4>${escapeHtml(component.nome)}</h4>
                <p>${escapeHtml(component.tipo)} - Criticidade ${escapeHtml(component.criticidade || "-")}</p>
              </div>
              <dl>
                ${dataRow("Status", component.status)}
                ${dataRow("Último evento", last ? formatTechnicalTerm(last.acao) : "-")}
                ${dataRow("Horímetro", last ? last.horimetro_evento : "-")}
                ${dataRow("Vida útil", last ? `${last.vida_util_h || "-"} h` : "-")}
              </dl>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderComponentEventForm(equipamento, componentes) {
    if (!componentes.length) return "";
    return `
      <form id="component-event-form" class="component-event-form">
        <input type="hidden" name="equipamento_id" value="${escapeAttr(equipamento.id)}">
        <label>Componente
          <select name="componente_id" required>
            ${componentes.map((component) => `
              <option value="${escapeAttr(component.id)}">${escapeHtml(component.nome)} - ${escapeHtml(component.status || "ATIVO")}</option>
            `).join("")}
          </select>
        </label>
        <label>Evento
          <select name="acao" required>
            <option value="INSPECAO">Inspeção</option>
            <option value="AJUSTE">Ajuste</option>
            <option value="TROCA">Troca</option>
            <option value="BLOQUEIO">Bloqueio</option>
          </select>
        </label>
        <label>Horímetro
          <input name="horimetro_evento" inputmode="decimal" autocomplete="off" value="${escapeAttr(equipamento.horimetro_atual || "")}">
        </label>
        <label>Vida útil (h)
          <input name="vida_util_h" inputmode="decimal" autocomplete="off" placeholder="Opcional">
        </label>
        <label class="wide">Descrição técnica
          <textarea name="descricao" rows="2" required placeholder="Ex.: componente substituído, ajuste realizado ou motivo do bloqueio"></textarea>
        </label>
        <button class="primary-action" type="submit">Registrar componente</button>
      </form>
    `;
  }

  function renderAssetHistory(historicoAtivo, historicoComponentes) {
    const rows = []
      .concat(historicoAtivo.map((item) => ({
        data_hora: item.data_hora,
        type: item.acao || "Evento",
        component: item.os_id || "OS",
        detail: item.resumo,
        origin: item.origem || "Sistema"
      })))
      .concat(historicoComponentes.map((item) => ({
        data_hora: item.data_hora,
        type: item.acao || "Evento",
        component: getComponente(item.componente_id).nome || item.componente_id,
        detail: item.descricao,
        origin: item.origem || "Sistema"
      })))
      .sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora)));
    if (!rows.length) return `<div class="empty-state compact">Sem histórico para este ativo.</div>`;
    return `
      <div class="asset-history asset-history-timeline">
        ${rows.slice(0, 8).map((item) => `
          <article class="asset-history-event">
            <div class="asset-history-marker" aria-hidden="true"></div>
            <div class="asset-history-content">
              <span>${escapeHtml(formatTechnicalTerm(item.type))} — ${escapeHtml(item.component || "-")}</span>
              <strong>${escapeHtml(item.detail || "Sem descrição técnica.")}</strong>
              <small>${escapeHtml(formatDateTime(item.data_hora))} · Origem: ${escapeHtml(item.origin || "Sistema")}</small>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderHistoryList(items) {
    if (!items.length) return `<div class="empty-state">Sem historico para exibir.</div>`;
    return `
      <div class="os-list">
        ${items.slice().sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora))).map((item) => `
          <div class="log-row panel">
            <strong>${escapeHtml(item.acao)} - ${escapeHtml(item.os_id)}</strong>
            <p class="muted">${escapeHtml(item.resumo || "")}</p>
            <span class="tag">${formatDateTime(item.data_hora)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderEventList(items) {
    if (!items.length) return `<div class="empty-state">Sem eventos ou comunicacoes.</div>`;
    return `
      <div class="os-list">
        ${items.slice().sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora))).map((item) => `
          <div class="log-row panel">
            <strong>${escapeHtml(item.tipo)} - ${escapeHtml(item.os_id)}</strong>
            <p class="muted">${escapeHtml(item.resumo || "")}</p>
            <span class="tag">${formatDateTime(item.data_hora)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function simpleTable(headers, rows) {
    if (!rows.length) return `<div class="empty-state">Sem registros.</div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead><tr>${headers.map((item) => `<th>${escapeHtml(item)}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((item) => `<td>${escapeHtml(item === undefined || item === null ? "" : String(item))}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function optionList(items, valueKey, labelKey) {
    return `<option value="">Selecione</option>${items.map((item) => `<option value="${escapeAttr(item[valueKey])}">${escapeHtml(item[labelKey])}</option>`).join("")}`;
  }

  function statusSelect() {
    return `
      <label>Status
        <select name="status" required>
          <option>ATIVO</option>
          <option>INATIVO</option>
        </select>
      </label>
    `;
  }

  function onClick(event) {
    const demo = event.target.closest("[data-demo-login]");
    if (demo) {
      const email = demo.dataset.demoLogin;
      app.querySelector("#login-email").value = email;
      app.querySelector("#login-password").value = "123456";
      login(email, "123456").catch(showError);
      return;
    }

    const navTarget = event.target.closest("[data-view], [data-route], [data-action]");
    if (!navTarget) return;

    if (navTarget.dataset.action === "toggle-nav-group" && isSidebarCollapsedClickContext(navTarget)) {
      const collapsedView = navTarget.dataset.collapsedView || navTarget.dataset.route || navTarget.dataset.view || "dashboard";
      closeMobileMenu();
      closeMobileActions();
      state.statusFilter = "";
      state.search = "";
      state.osQuickFilter = "";
      state.qualityFilter = "";
      navigate(collapsedView);
      return;
    }

    if (navTarget.dataset.view || navTarget.dataset.route) {
      const targetView = navTarget.dataset.view || navTarget.dataset.route;
      closeMobileMenu();
      closeMobileActions();
      state.statusFilter = "";
      state.search = "";
      state.osQuickFilter = "";
      state.qualityFilter = "";
      navigate(targetView);
      return;
    }

    const action = navTarget;
    const name = action.dataset.action;
    if (name === "noop") return;
    if (name === "logout") { logout(); return; }
    if (action.dataset.viewTarget) navigate(action.dataset.viewTarget);
    if (name === "toggle-menu") toggleMobileMenu();
    else if (name === "toggle-quick-panel") toggleQuickPanel();
    else if (name === "close-menu") closeMobileMenu();
    else if (name === "toggle-mobile-actions") toggleMobileActions();
    else if (name === "close-mobile-actions") closeMobileActions();
    else if (name === "configure-quick-actions") configureQuickActions();
    else if (name === "toggle-quick-config") toggleQuickConfig();
    else if (name === "toggle-quick-action-option") toggleQuickActionOption(action);
    else if (name === "reset-quick-actions") resetQuickActions();
    else if (name === "add-dropzone-module") addDropzoneModule(action.dataset.dropzoneId || "");
    else if (name === "toggle-dropzone-module") toggleDropzoneModule(action.dataset.dropzoneId || "");
    else if (name === "remove-dropzone-module") removeDropzoneModule(action.dataset.dropzoneId || "");
    else if (name === "move-dropzone-module-up") moveDropzoneModule(action.dataset.dropzoneId || "", -1);
    else if (name === "move-dropzone-module-down") moveDropzoneModule(action.dataset.dropzoneId || "", 1);
    else if (name === "toggle-dropzone-collapse") toggleDropzoneCollapse(action.dataset.dropzoneId || "");
    else if (name === "reset-dropzone-modules") resetDropzoneModules();
    else if (name === "toggle-nav-group") toggleNavGroup(action.dataset.menuGroup);
    else if (name === "cadastro-tab") setCadastroTab(action.dataset.tab);
    else if (name === "refresh") handleRefresh();
    else if (name === "open-notifications") navigate("notificacoes");
    else if (name === "event-tag-filter") setEventTagFilter(action.dataset.tag || "todos");
    else if (name === "dashboard-filter") applyDashboardFilter(action);
    else if (name === "quality-filter") applyQualityFilter(action);
    else if (name === "clear-quality-filter") { state.qualityFilter = ""; renderCurrentView(); }
    else if (name === "filter-status-chip") {
      state.statusFilter = action.dataset.status || "";
      renderCurrentView();
    }
    else if (name === "toggle-create-os") toggle("#create-os-panel");
    else if (name === "open-os") openOs(action.dataset.osId);
    else if (name === "iniciar-os") handleIniciar(action.dataset.osId);
    else if (name === "finalizar-os") handleFinalizar(action.dataset.osId);
    else if (name === "aprovar-os") handleAprovar(action.dataset.osId);
    else if (name === "reabrir-os") handleReabrir(action.dataset.osId);
    else if (name === "set-checklist-response") setChecklistResponse(action, action.dataset.value);
    else if (name === "save-checklist") saveChecklist(action);
    else if (name === "focus-new-checklist-model") {
      const form = document.getElementById("checklist-model-form");
      if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    else if (name === "add-checklist-model-item") addChecklistModelItem(action);
    else if (name === "remove-checklist-model-item") removeChecklistModelItem(action);
    else if (name === "move-checklist-model-item-up") moveChecklistModelItem(action, -1);
    else if (name === "move-checklist-model-item-down") moveChecklistModelItem(action, 1);
    else if (name === "load-checklist-model-version") loadChecklistModelVersion(action.dataset.modelId || "");
    else if (name === "load-checklist-model-edit") loadChecklistModelEdit(action.dataset.modelId || "");
    else if (name === "toggle-checklist-model-status") toggleChecklistModelStatus(action.dataset.modelId || "");
    else if (name === "add-workflow-rule") addWorkflowRule(action);
    else if (name === "remove-workflow-rule") removeWorkflowRule(action);
    else if (name === "move-workflow-rule-up") moveWorkflowRule(action, -1);
    else if (name === "move-workflow-rule-down") moveWorkflowRule(action, 1);
    else if (name === "load-user-edit") loadUserEdit(action.dataset.userId || "");
    else if (name === "clear-user-form") clearUserForm();
    else if (name === "toggle-user-status") toggleUserStatus(action.dataset.userId || "");
    else if (name === "reset-user-password") resetUserPassword(action.dataset.userId || "");
    else if (name === "start-qr-camera") startQrScanner();
    else if (name === "stop-qr-camera") stopQrScanner();
    else if (name === "toggle-manual-qr") toggleManualQr();
    else if (name === "resolve-qr") openQrResolved(action.dataset.qr || "");
    else if (name === "copy-qr") copyQrValue(action.dataset.qr || "");
    else if (name === "print-qr") window.print();
    else if (name === "create-os-from-equipment") createOsFromEquipment(action.dataset.ativoId || "");
    else if (name === "reset-local") resetLocal();
    else if (name === "export-backup") exportBackup();
  }

  function onSubmit(event) {
    if (event.target.id === "login-form") {
      event.preventDefault();
      const data = new FormData(event.target);
      login(data.get("email"), data.get("password")).catch(showError);
    }
    if (event.target.id === "create-os-form") {
      event.preventDefault();
      const submitter = event.submitter;
      const data = Object.fromEntries(new FormData(event.target).entries());
      data.modo = submitter ? submitter.value : "PLANEJAR";
      data.token = state.session.token;
      window.SCSApi.call("os.criar", data)
        .then(async (result) => {
          toast(`OS ${result.id_os} criada com status ${result.status_inicial}.`, "success");
          state.createOsPrefillAtivoId = "";
          await handleRefresh();
          openOs(result.id_os);
        })
        .catch(showError);
    }
    if (event.target.id === "user-form") {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      data.token = state.session.token;
      window.SCSApi.call("usuarios.salvar", data)
        .then(async () => {
          toast("Usuario salvo com auditoria.", "success");
          await handleRefresh();
        })
        .catch(showError);
    }
    if (event.target.classList.contains("cadastro-form")) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      data.token = state.session.token;
      data.entidade = event.target.dataset.entidade;
      window.SCSApi.call("cadastros.salvar", data)
        .then(async (result) => {
          toast(`${result.entidade} salvo com auditoria.`, "success");
          await handleRefresh();
        })
        .catch(showError);
    }
    if (event.target.id === "checklist-model-form") {
      event.preventDefault();
      const data = new FormData(event.target);
      const tipoSelecionado = String(data.get("tipo_os") || "").trim();
      const tipoCustom = String(data.get("tipo_os_custom") || "").trim();
      const itemRows = Array.from(event.target.querySelectorAll("[data-checklist-model-item]"));
      const payload = {
        token: state.session.token,
        id: data.get("id") || "",
        nome: data.get("nome"),
        tipo_os: tipoSelecionado === "OUTRO" ? tipoCustom : tipoSelecionado,
        versao: data.get("versao"),
        status: data.get("status_toggle") === "on" ? "ATIVO" : "INATIVO",
        itens: itemRows.map((row, index) => ({
          item_id: `IT-${index + 1}`,
          pergunta: row.querySelector("[data-field='pergunta']").value,
          tipo_resposta: row.querySelector("[data-field='tipo_resposta']") ? row.querySelector("[data-field='tipo_resposta']").value : "OK_NOK",
          unidade: row.querySelector("[data-field='unidade']") ? row.querySelector("[data-field='unidade']").value : "",
          valor_min: row.querySelector("[data-field='valor_min']") ? row.querySelector("[data-field='valor_min']").value : "",
          valor_max: row.querySelector("[data-field='valor_max']") ? row.querySelector("[data-field='valor_max']").value : "",
          valor_esperado: row.querySelector("[data-field='valor_esperado']") ? row.querySelector("[data-field='valor_esperado']").value : "",
          opcoes: row.querySelector("[data-field='opcoes']") ? row.querySelector("[data-field='opcoes']").value : "",
          obrigatorio: row.querySelector("[data-field='obrigatorio']").checked,
          critico: row.querySelector("[data-field='critico']") ? row.querySelector("[data-field='critico']").checked : false,
          evidencia_regra: row.querySelector("[data-field='evidencia_regra']") ? row.querySelector("[data-field='evidencia_regra']").value : "SE_NOK",
          observacao_regra: row.querySelector("[data-field='observacao_regra']") ? row.querySelector("[data-field='observacao_regra']").value : "SE_NOK"
        }))
      };
      if (!payload.tipo_os) {
        toast("Informe o tipo de OS do modelo.", "error");
        return;
      }
      window.SCSApi.call("checklist_modelo.salvar", payload)
        .then(async () => {
          toast("Modelo de checklist salvo para novas OS.", "success");
          await handleRefresh();
        })
        .catch(showError);
    }
    if (event.target.id === "workflow-form") {
      event.preventDefault();
      const data = new FormData(event.target);
      const count = Number(data.get("workflow_count") || 0);
      const regras = [];
      for (let index = 0; index < count; index += 1) {
        if (!data.has(`acao_${index}`)) continue;
        regras.push({
          id: data.get(`id_${index}`),
          acao: data.get(`acao_${index}`),
          nome: data.get(`nome_${index}`),
          status_origem: data.get(`status_origem_${index}`),
          status_destino: data.get(`status_destino_${index}`),
          permissao: data.get(`permissao_${index}`),
          perfis: ["Operador", "Gestor", "Admin"].filter((perfil) => data.get(`perfil_${index}_${perfil}`) === "on").join(","),
          exige_responsavel: data.get(`exige_responsavel_${index}`) === "on",
          exige_checklist_ok: data.get(`exige_checklist_${index}`) === "on",
          status: data.get(`status_${index}`)
        });
      }
      window.SCSApi.call("workflow.salvar", { token: state.session.token, regras })
        .then(async () => {
          toast("Fluxo operacional salvo com auditoria.", "success");
          await handleRefresh();
        })
        .catch(showError);
    }
    if (event.target.id === "modules-form") {
      event.preventDefault();
      const motivo = String(window.prompt("Informe o motivo da alteracao dos modulos:") || "").trim();
      if (!motivo) {
        toast("Motivo obrigatorio para salvar modulos.", "error");
        return;
      }
      window.SCSApi.call("modulos.salvar", {
        token: state.session.token,
        motivo,
        modulos: buildModulesPayload(event.target)
      })
        .then(async (result) => {
          state.session.matriz_permissoes = result.matriz;
          state.session.definicoes_permissoes = result.definicoes;
          state.session.definicoes_modulos = result.definicoes_modulos;
          state.session.permissoes = result.matriz[state.session.perfil] || state.session.permissoes;
          sessionStorage.setItem(sessionKey, JSON.stringify(state.session));
          toast("Modulos salvos com auditoria.", "success");
          await handleRefresh();
        })
        .catch(showError);
    }
    if (event.target.id === "permissions-form") {
      event.preventDefault();
      const data = new FormData(event.target);
      const matriz = buildPermissionPayload(event.target);
      const motivo = String(data.get("motivo") || "").trim();
      window.SCSApi.call("permissoes.salvar", {
        token: state.session.token,
        motivo,
        matriz
      })
        .then((result) => {
          state.session.matriz_permissoes = result.matriz;
          state.session.definicoes_permissoes = result.definicoes;
          state.session.permissoes = result.matriz[state.session.perfil] || state.session.permissoes;
          sessionStorage.setItem(sessionKey, JSON.stringify(state.session));
          toast("Acessos salvos com auditoria.", "success");
          renderCurrentView();
        })
        .catch(showError);
    }
    if (event.target.id === "qr-form") {
      event.preventDefault();
      const qr = String(new FormData(event.target).get("qr") || "").trim();
      const tipo = String(new FormData(event.target).get("tipo") || "AUTO");
      resolveQrValue(qr, tipo);
    }
    if (event.target.id === "asset-reading-form") {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      data.token = state.session.token;
      window.SCSApi.call("parametros.registrar_leitura", data)
        .then(async (result) => {
          toast(`Leitura salva: ${result.status_operacional}.`, "success");
          await refreshData();
          resolveQrValue(result.equipamento_id, "EQUIPAMENTO");
        })
        .catch(showError);
    }
    if (event.target.id === "component-event-form") {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      data.token = state.session.token;
      window.SCSApi.call("componentes.registrar_evento", data)
        .then(async (result) => {
          toast(`Componente registrado: ${result.componente.status}.`, "success");
          await refreshData();
          resolveQrValue(result.equipamento_id, "EQUIPAMENTO");
        })
        .catch(showError);
    }
  }

  function onInput(event) {
    if (event.target.matches("[data-action='search-os']")) {
      state.search = event.target.value;
      const results = document.getElementById("os-list-results");
      if (results) results.innerHTML = renderOsCards(filteredOrdersForView(state.view));
    }
  }

  function onChange(event) {
    if (event.target.matches("[data-field='evidencia_file']")) {
      updateEvidenceFile(event.target);
      return;
    }

    if (event.target.matches("[data-workflow-status-toggle]")) {
      const wrapper = event.target.closest(".workflow-status-toggle");
      const hidden = wrapper && wrapper.querySelector('[data-workflow-field="status"]');
      const visual = wrapper && wrapper.querySelector(".status-switch");
      const label = wrapper && wrapper.querySelector(".status-switch-label");
      const active = event.target.checked;
      if (hidden) hidden.value = active ? "ATIVO" : "INATIVO";
      if (visual) {
        visual.classList.toggle("is-on", active);
        visual.classList.toggle("is-off", !active);
      }
      if (label) label.textContent = active ? "Ativo" : "Inativo";
      return;
    }

    if (event.target.matches("[data-module-profile-toggle]")) {
      const profile = event.target.closest(".module-profile");
      if (profile) {
        profile.querySelectorAll(".module-permission input").forEach((input) => {
          input.disabled = !event.target.checked;
          if (!event.target.checked) input.checked = false;
        });
      }
      return;
    }

    if (event.target.matches(".permission-row .switch-cell input[type='checkbox']")) {
      const label = event.target.closest(".switch-cell");
      const text = label && label.querySelector("span");
      if (text && !event.target.disabled) text.textContent = event.target.checked ? "Liberado" : "Bloqueado";
      return;
    }

    if (event.target.matches("[data-action='filter-status']")) {
      state.statusFilter = event.target.value;
      const content = document.getElementById("content");
      content.innerHTML = renderOsListView(state.view);
      return;
    }

    if (event.target.matches("[data-action='import-backup']")) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          window.SCSMockApi.importDb(JSON.parse(reader.result));
          toast("Backup restaurado na base local.", "success");
          handleRefresh();
        } catch (error) {
          showError(error);
        }
      };
      reader.readAsText(file);
    }
  }

  function resetQrCountdown() {
    if (state.qrTimeoutId) {
      window.clearTimeout(state.qrTimeoutId);
      state.qrTimeoutId = null;
    }
    if (state.qrCountdownTimer) {
      window.clearInterval(state.qrCountdownTimer);
      state.qrCountdownTimer = null;
    }
    state.qrScanDeadline = 0;
    const badge = document.getElementById("qr-countdown");
    if (badge) badge.textContent = "30s";
  }

  function startQrCountdown() {
    resetQrCountdown();
    state.qrScanDeadline = Date.now() + 30000;
    const update = () => {
      const badge = document.getElementById("qr-countdown");
      const remaining = Math.max(0, Math.ceil((state.qrScanDeadline - Date.now()) / 1000));
      if (badge) badge.textContent = `${remaining}s`;
      if (remaining <= 0) {
        if (state.qrTimeoutId) { window.clearTimeout(state.qrTimeoutId); state.qrTimeoutId = null; }
        if (state.qrCountdownTimer) { window.clearInterval(state.qrCountdownTimer); state.qrCountdownTimer = null; }
        if (badge) badge.textContent = "0s";
        stopQrScanner(false);
        state.qrManualOpen = true;
        syncManualQrPanel();
        setQrStatus("Nenhum QR identificado em 30 segundos. Digite o código manualmente.");
        const result = document.getElementById("qr-result");
        if (result) result.innerHTML = renderQrManualFallback("Tempo de leitura esgotado.");
      }
    };
    update();
    state.qrCountdownTimer = window.setInterval(update, 1000);
    state.qrTimeoutId = window.setTimeout(update, 30000);
  }

  async function startQrScanner() {
    try {
      const result = document.getElementById("qr-result");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        state.qrManualOpen = true;
        syncManualQrPanel();
        setQrStatus("Câmera indisponível neste navegador. Use a entrada manual.");
        if (result) result.innerHTML = renderQrManualFallback("Câmera indisponível.");
        return;
      }

      stopQrScanner();
      const video = document.getElementById("qr-video");
      const cameraState = document.getElementById("qr-camera-state");
      if (!video) return;

      state.qrStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      video.srcObject = state.qrStream;
      video.classList.remove("hidden");
      if (cameraState) cameraState.classList.add("hidden");
      await video.play();
      startQrCountdown();

      if (!("BarcodeDetector" in window)) {
        state.qrManualOpen = true;
        syncManualQrPanel();
        setQrStatus("Camera aberta, mas leitura automatica de QR nao esta disponivel neste navegador. Use entrada manual.");
        if (result) result.innerHTML = renderQrManualFallback("Leitura automática indisponível.");
        return;
      }

      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      let busy = false;
      state.qrScanTimer = window.setInterval(async () => {
        if (busy || !state.qrStream || video.readyState < 2) return;
        busy = true;
        try {
          const codes = await detector.detect(video);
          if (codes && codes.length) {
            const rawValue = codes[0].rawValue || "";
            stopQrScanner();
            resolveQrValue(rawValue, "AUTO");
          }
        } catch (error) {
          state.qrManualOpen = true;
          syncManualQrPanel();
          setQrStatus("Não foi possível decodificar pela câmera. Use a entrada manual.");
        } finally {
          busy = false;
        }
      }, 700);
      setQrStatus("Camera ativa. Aponte para o QR Code.");
    } catch (error) {
      state.qrManualOpen = true;
      syncManualQrPanel();
      setQrStatus("Acesso à câmera negado ou indisponível. Use a entrada manual.");
      const result = document.getElementById("qr-result");
      if (result) result.innerHTML = renderQrManualFallback(error.message || "Câmera indisponível.");
    }
  }

  function stopQrScanner(resetCountdown = true) {
    if (resetCountdown) resetQrCountdown();
    if (state.qrScanTimer) {
      window.clearInterval(state.qrScanTimer);
      state.qrScanTimer = null;
    }
    if (state.qrStream) {
      state.qrStream.getTracks().forEach((track) => track.stop());
      state.qrStream = null;
    }
    const video = document.getElementById("qr-video");
    const cameraState = document.getElementById("qr-camera-state");
    if (video) {
      video.pause();
      video.srcObject = null;
      video.classList.add("hidden");
    }
    if (cameraState) cameraState.classList.remove("hidden");
  }

  function toggleManualQr() {
    state.qrManualOpen = !state.qrManualOpen;
    syncManualQrPanel();
  }

  function syncManualQrPanel() {
    const panel = document.getElementById("qr-manual-panel");
    if (panel) panel.classList.toggle("hidden", !state.qrManualOpen);
  }

  function setQrStatus(message) {
    const status = document.getElementById("qr-scan-status");
    if (status) status.textContent = message;
  }

  function resolveQrValue(value, expectedType) {
    const result = document.getElementById("qr-result");
    const target = findQrTarget(value, expectedType);
    if (result) {
      result.innerHTML = renderQrTargetResult(target);
      prepareMobileAdaptiveSections(result);
    }
    if (target && target.tipo !== "OS") setQrStatus(`QR identificado: ${target.tipo}.`);
  }

  function openQrResolved(value) {
    if (state.view !== "qr-code") {
      state.view = "qr-code";
      renderCurrentView();
      scrollTop();
    }
    state.qrManualOpen = true;
    syncManualQrPanel();
    const input = document.querySelector("#qr-form input[name='qr']");
    if (input) input.value = value;
    resolveQrValue(value, "AUTO");
  }

  function createOsFromEquipment(ativoId) {
    const equipamento = getAtivo(ativoId);
    if (!equipamento.id) {
      toast("Equipamento não encontrado para criar OS.", "error");
      return;
    }
    state.createOsPrefillAtivoId = equipamento.id;
    state.statusFilter = "";
    state.search = "";
    state.osQuickFilter = "";
    navigate("gestao-os");
  }

  async function copyQrValue(value) {
    const text = String(value || "").trim();
    if (!text) {
      toast("QR Code vazio.", "error");
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.setAttribute("readonly", "readonly");
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
      }
      toast("QR Code copiado.", "success");
    } catch (error) {
      toast("Nao foi possivel copiar o QR Code.", "error");
    }
  }

  function findQrTarget(value, expectedType) {
    const token = normalizeQrToken(value);
    if (!token) return null;
    const refs = state.data.referencias;
    const type = expectedType || "AUTO";
    const tests = {
      EQUIPAMENTO: () => refs.equipamentos.find((item) => sameQr(item.id, token) || sameQr(item.qr_code, token)),
      OS: () => state.data.ordens.find((item) => sameQr(item.id, token)),
      PLANTA: () => (refs.plantas || []).find((item) => sameQr(item.id, token)),
      SETOR: () => refs.setores.find((item) => sameQr(item.id, token)),
      LINHA: () => refs.linhas.find((item) => sameQr(item.id, token)),
      COMPONENTE: () => refs.componentes.find((item) => sameQr(item.id, token))
    };
    if (type !== "AUTO" && tests[type]) {
      const item = tests[type]();
      return item ? { tipo: type, item } : null;
    }
    const order = ["OS", "EQUIPAMENTO", "COMPONENTE", "LINHA", "SETOR", "PLANTA"];
    for (const qrType of order) {
      const item = tests[qrType]();
      if (item) return { tipo: qrType, item };
    }
    return null;
  }

  function normalizeQrToken(value) {
    let token = String(value || "").trim();
    if (!token) return "";
    token = token.replace(/^SCS:\/\//i, "");
    try {
      const url = new URL(token);
      token = [url.hostname, url.pathname].filter(Boolean).join("").replace(/^\//, "");
    } catch (error) {
      token = token.replace(/^https?:\/\/[^/]+\//i, "");
    }
    return token.trim().toUpperCase();
  }

  function sameQr(value, token) {
    const normalized = normalizeQrToken(value);
    return normalized === token || normalized.endsWith(token);
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      closeMobileMenu();
      closeMobileActions();
    }
    if ((event.key === "Enter" || event.key === " ") && event.target.closest(".event-list-card, .execution-card")) {
      event.preventDefault();
      event.target.closest(".event-list-card, .execution-card").click();
    }
  }

  function applyDashboardFilter(node) {
    state.statusFilter = node.dataset.status || "";
    state.search = node.dataset.search || "";
    state.osQuickFilter = node.dataset.quick || "";
    const targetView = node.dataset.targetView || (state.session.perfil === "Operador" ? "minhas-os" : "gestao-os");
    navigate(targetView);
  }


  function applyQualityFilter(action) {
    state.qualityFilter = action.dataset.qualityFilter || "";
    const target = action.dataset.targetView || "validacao-tecnica";
    navigate(target);
  }

  function setEventTagFilter(tag) {
    state.eventTagFilter = tag || "todos";
    renderCurrentView();
    scrollTop();
  }

  function navigate(view) {
    closeMobileMenu();
    if (view === "sair") {
      logout();
      return;
    }
    if (["minhas-os", "gestao-os", "programacao", "acompanhamento"].includes(view)) {
      state.lastListView = view;
    } else if (!["os-detalhe", "notificacoes"].includes(view)) {
      state.osQuickFilter = "";
    }
    if (view === "qr-code") state.qrManualOpen = false;
    state.view = view;
    state.selectedOsId = view === "os-detalhe" ? state.selectedOsId : "";
    renderCurrentView();
    ensureDataForView(view)
      .then(() => renderCurrentView())
      .catch(showError);
    safeScrollTop();
    scrollTop();
  }

  function configureQuickActions() {
    state.quickActionsConfigOpen = true;
    if (!state.quickPanelOpen && !isMobileShell()) state.quickPanelOpen = true;
    renderShell();
    toast("Selecione os módulos que devem aparecer no Trabalho Ativo deste dispositivo.", "info");
  }

  function toggleQuickConfig() {
    state.quickActionsConfigOpen = !state.quickActionsConfigOpen;
    state.dropzoneEditMode = state.quickActionsConfigOpen;
    renderShell();
  }

  function toggleQuickActionOption(input) {
    const id = input.dataset.quickId;
    const eligibleIds = eligibleQuickActions().map((item) => item.id);
    const selected = state.quickActionsSelection.length ? new Set(state.quickActionsSelection) : new Set(eligibleIds);
    if (input.checked) selected.add(id);
    else selected.delete(id);
    state.quickActionsSelection = eligibleIds.filter((itemId) => selected.has(itemId));
    saveQuickActionsSelection(state.quickActionsSelection);
    renderShell();
  }

  function resetQuickActions() {
    state.quickActionsSelection = [];
    saveQuickActionsSelection([]);
    renderShell();
    toast("Trabalho Ativo restaurado para o padrão por perfil e dispositivo.", "success");
  }

  function toggleNavGroup(groupId) {
    if (!groupId) return;
    state.navGroupsOpen[groupId] = !state.navGroupsOpen[groupId];
    renderShell();
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!state.menuOpen);
  }

  function addDropzoneModule(id) {
    if (!id) return;
    const ids = dropzoneModuleIds();
    if (!ids.includes(id)) ids.push(id);
    persistDropzoneModules(ids);
    renderShell();
  }

  function toggleDropzoneModule(id) {
    if (!id) return;
    const ids = dropzoneModuleIds();
    if (ids.includes(id)) persistDropzoneModules(ids.filter((item) => item !== id));
    else persistDropzoneModules(ids.concat(id));
    renderShell();
  }

  function removeDropzoneModule(id) {
    if (!id) return;
    persistDropzoneModules(dropzoneModuleIds().filter((item) => item !== id));
    renderShell();
  }

  function moveDropzoneModule(id, direction) {
    const ids = dropzoneModuleIds();
    const index = ids.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ids.length) return;
    const next = ids.slice();
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    persistDropzoneModules(next);
    renderShell();
  }

  function toggleDropzoneCollapse(id) {
    if (!id) return;
    state.dropzoneCollapsed[id] = !state.dropzoneCollapsed[id];
    saveDropzoneCollapsed(state.dropzoneCollapsed);
    renderShell();
  }

  function resetDropzoneModules() {
    state.dropzoneModules = [];
    saveDropzoneModules([]);
    renderShell();
  }

  function toggleQuickPanel() {
    if (isMobileShell()) {
      toggleMobileActions();
      return;
    }
    state.quickPanelOpen = !state.quickPanelOpen;
    const layout = app.querySelector(".layout");
    const workspace = app.querySelector(".workspace");
    const panel = app.querySelector(".quick-panel");
    app.querySelectorAll("[data-action='toggle-quick-panel']").forEach((button) => {
      button.setAttribute("aria-expanded", state.quickPanelOpen ? "true" : "false");
    });
    [layout, workspace].forEach((node) => {
      if (!node) return;
      node.classList.toggle("quick-open", state.quickPanelOpen);
      node.classList.toggle("quick-collapsed", !state.quickPanelOpen);
    });
    if (panel) {
      panel.classList.toggle("is-open", state.quickPanelOpen);
      panel.classList.toggle("is-collapsed", !state.quickPanelOpen);
    }
  }

  function toggleMobileActions() {
    state.mobileQuickOpen = !state.mobileQuickOpen;
    syncMobileActions();
  }

  function closeMobileActions() {
    if (!state.mobileQuickOpen) return;
    state.mobileQuickOpen = false;
    syncMobileActions();
  }

  function syncMobileActions() {
    const sheet = app.querySelector(".mobile-actions-sheet");
    const backdrop = app.querySelector(".mobile-sheet-backdrop");
    const fab = app.querySelector(".mobile-fab");
    const bottomMore = app.querySelector(".bottom-nav [data-action='toggle-mobile-actions']");
    if (sheet) sheet.classList.toggle("is-open", state.mobileQuickOpen);
    if (backdrop) backdrop.classList.toggle("is-open", state.mobileQuickOpen);
    if (fab) {
      fab.classList.toggle("is-open", state.mobileQuickOpen);
      fab.setAttribute("aria-expanded", state.mobileQuickOpen ? "true" : "false");
      fab.innerHTML = matIcon(state.mobileQuickOpen ? "close" : "bolt");
    }
    if (bottomMore) bottomMore.classList.toggle("active", state.mobileQuickOpen);
  }

  function isMobileShell() {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 840px)").matches;
  }

  function closeMobileMenu() {
    if (isMobileShell() && state.menuOpen) setMobileMenuOpen(false);
  }

  function setMobileMenuOpen(open) {
    if (open) closeMobileActions();
    state.menuOpen = Boolean(open);
    const mainGrid = app.querySelector(".main-grid");
    const sidebar = app.querySelector("#sidebar-menu");
    const backdrop = app.querySelector(".mobile-menu-backdrop");
    const toggleButton = app.querySelector("[data-action='toggle-menu']");
    if (mainGrid) mainGrid.classList.toggle("expanded", state.menuOpen);
    if (sidebar) sidebar.classList.toggle("is-open", state.menuOpen);
    if (backdrop) backdrop.classList.toggle("is-open", isMobileShell() && state.menuOpen);
    if (toggleButton) toggleButton.setAttribute("aria-expanded", state.menuOpen ? "true" : "false");
  }

  function setCadastroTab(tab) {
    state.cadastroTab = tab || "plantas";
    renderCurrentView();
  }

  function openOs(id) {
    state.selectedOsId = id;
    if (state.view !== "os-detalhe" && state.view !== "qr-code") {
      state.lastListView = state.view;
    }
    state.view = "os-detalhe";
    renderCurrentView();
    loadOsDetail(id)
      .then(() => renderCurrentView())
      .catch(showError);
    scrollTop();
  }

  async function handleRefresh() {
    try {
      await refreshData();
      renderCurrentView();
      toast("Dados atualizados.", "success");
    } catch (error) {
      showError(error);
    }
  }

  function handleIniciar(id) {
    window.SCSApi.call("os.iniciar", { token: state.session.token, id_os: id })
      .then(async () => {
        toast("OS iniciada.", "success");
        await handleRefresh();
        openOs(id);
      })
      .catch(showError);
  }

  function handleFinalizar(id) {
    window.SCSApi.call("os.finalizar_execucao", { token: state.session.token, id_os: id })
      .then(async () => {
        toast("Execucao enviada para aprovacao.", "success");
        await handleRefresh();
        openOs(id);
      })
      .catch(showError);
  }

  function handleAprovar(id) {
    window.SCSApi.call("os.aprovar", { token: state.session.token, id_os: id, decisao: "APROVAR" })
      .then(async () => {
        toast("OS aprovada.", "success");
        await handleRefresh();
        openOs(id);
      })
      .catch(showError);
  }

  function handleReabrir(id) {
    const justificativa = prompt("Informe a justificativa para reabrir a OS:");
    if (!justificativa) return;
    window.SCSApi.call("os.aprovar", { token: state.session.token, id_os: id, decisao: "REABRIR", justificativa })
      .then(async () => {
        toast("OS reaberta para correcao.", "success");
        await handleRefresh();
        openOs(id);
      })
      .catch(showError);
  }

  function setChecklistResponse(button, value) {
    const item = button.closest(".checklist-item");
    item.dataset.resposta = value;
    item.querySelectorAll("[data-action='set-checklist-response']").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === value);
    });
  }

  function updateEvidenceFile(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const maxSize = 12 * 1024 * 1024;
    if (file.size > maxSize) {
      input.value = "";
      toast("Evidência acima de 12 MB. Use arquivo menor.", "error");
      return;
    }
    const itemEl = input.closest(".checklist-item");
    const hidden = itemEl && itemEl.querySelector("[data-field='evidencia']");
    const label = itemEl && itemEl.querySelector("[data-evidence-name]");
    const value = `${file.name} | ${formatFileSize(file.size)} | ${file.type || "arquivo"}`;
    if (hidden) hidden.value = value;
    if (label) label.textContent = value;
    toast("Evidência vinculada ao item. Salve o checklist para gravar.", "success");
  }

  function formatFileSize(bytes) {
    const size = Number(bytes || 0);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  function saveChecklist(button) {
    const itemEl = button.closest(".checklist-item");
    const item = getChecklistItem(itemEl.dataset.checklistId);
    const responseInput = itemEl.querySelector("[data-field='resposta']");
    const tipo = itemEl.dataset.responseType || normalizeChecklistType(item.tipo_resposta);
    const resposta = responseInput ? responseInput.value : (itemEl.dataset.resposta || item.resposta || (tipo === "FOTO" ? "FOTO" : ""));
    const observacao = itemEl.querySelector("[data-field='observacao']").value;
    const evidencia = itemEl.querySelector("[data-field='evidencia']").value;
    window.SCSApi.call("checklist.salvar", {
      token: state.session.token,
      id_checklist: item.id,
      resposta,
      observacao,
      evidencia
    })
      .then(async () => {
        toast("Checklist salvo.", "success");
        await handleRefresh();
        openOs(item.os_id);
      })
      .catch(showError);
  }

  function addChecklistModelItem(button, item) {
    const form = button.closest("form") || document.getElementById("checklist-model-form");
    const list = form && form.querySelector("[data-checklist-model-list]");
    if (!list) return;
    const index = list.querySelectorAll("[data-checklist-model-item]").length + 1;
    list.insertAdjacentHTML("beforeend", renderChecklistModelItemRow(index, item || { pergunta: "", obrigatorio: true, tipo_resposta: "OK_NOK", evidencia_regra: "SE_NOK", observacao_regra: "SE_NOK" }));
    refreshChecklistModelItemIndexes(list);
  }

  function removeChecklistModelItem(button) {
    const list = button.closest("[data-checklist-model-list]");
    const rows = list ? Array.from(list.querySelectorAll("[data-checklist-model-item]")) : [];
    if (rows.length <= 1) {
      toast("O modelo precisa manter ao menos um item.", "error");
      return;
    }
    button.closest("[data-checklist-model-item]").remove();
    refreshChecklistModelItemIndexes(list);
  }

  function moveChecklistModelItem(button, direction) {
    const row = button.closest("[data-checklist-model-item]");
    const list = row && row.parentElement;
    if (!row || !list) return;
    const sibling = direction < 0 ? row.previousElementSibling : row.nextElementSibling;
    if (!sibling) return;
    if (direction < 0) list.insertBefore(row, sibling);
    else list.insertBefore(sibling, row);
    refreshChecklistModelItemIndexes(list);
  }

  function refreshChecklistModelItemIndexes(list) {
    if (!list) return;
    Array.from(list.querySelectorAll("[data-checklist-model-item]")).forEach((row, index) => {
      const number = index + 1;
      const label = row.querySelector("[data-item-number]");
      const pergunta = row.querySelector("[data-field='pergunta']");
      const obrigatorio = row.querySelector("[data-field='obrigatorio']");
      const fields = ["tipo_resposta", "unidade", "valor_min", "valor_max", "valor_esperado", "opcoes", "critico", "evidencia_regra", "observacao_regra"];
      if (label) label.textContent = `Item ${number}`;
      if (pergunta) pergunta.name = `pergunta_${number}`;
      if (obrigatorio) obrigatorio.name = `obrigatorio_${number}`;
      fields.forEach((field) => {
        const input = row.querySelector(`[data-field='${field}']`);
        if (input) input.name = `${field}_${number}`;
      });
    });
  }

  function loadChecklistModelVersion(modelId) {
    const refs = state.data.referencias || {};
    const modelo = (refs.checklist_modelos || []).find((item) => item.id === modelId);
    if (!modelo) return;
    const itens = (refs.checklist_modelo_itens || [])
      .filter((item) => item.modelo_id === modelo.id)
      .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
    const form = document.getElementById("checklist-model-form");
    const details = form && form.closest("details");
    const list = form && form.querySelector("[data-checklist-model-list]");
    if (!form || !list) return;
    if (details) details.open = true;
    form.elements.id.value = "";
    form.elements.nome.value = modelo.nome || "";
    form.elements.tipo_os.value = ["Corretiva", "Preventiva", "Inspecao", "Emergencial"].includes(modelo.tipo_os) ? modelo.tipo_os : "OUTRO";
    form.elements.tipo_os_custom.value = form.elements.tipo_os.value === "OUTRO" ? modelo.tipo_os : "";
    form.elements.versao.value = String(Number(modelo.versao || 1) + 1);
    const versionLabel = form.querySelector("[data-model-version-label]");
    const modeLabel = form.querySelector("[data-checklist-mode-label]");
    if (versionLabel) versionLabel.textContent = form.elements.versao.value;
    if (modeLabel) modeLabel.textContent = "Nova versão";
    form.elements.status_toggle.checked = true;
    list.innerHTML = itens.map((item, index) => renderChecklistModelItemRow(index + 1, item)).join("") || renderChecklistModelItemRow(1, { pergunta: "", obrigatorio: true, tipo_resposta: "OK_NOK", evidencia_regra: "SE_NOK", observacao_regra: "SE_NOK" });
    refreshChecklistModelItemIndexes(list);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Modelo carregado como nova versao.", "success");
  }

  function loadChecklistModelEdit(modelId) {
    const refs = state.data.referencias || {};
    const modelo = (refs.checklist_modelos || []).find((item) => item.id === modelId);
    if (!modelo) return;
    const itens = (refs.checklist_modelo_itens || [])
      .filter((item) => item.modelo_id === modelo.id)
      .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
    const form = document.getElementById("checklist-model-form");
    const details = form && form.closest("details");
    const list = form && form.querySelector("[data-checklist-model-list]");
    if (!form || !list) return;
    if (details) details.open = true;
    form.elements.id.value = modelo.id || "";
    form.elements.nome.value = modelo.nome || "";
    form.elements.tipo_os.value = ["Corretiva", "Preventiva", "Inspecao", "Emergencial"].includes(modelo.tipo_os) ? modelo.tipo_os : "OUTRO";
    form.elements.tipo_os_custom.value = form.elements.tipo_os.value === "OUTRO" ? modelo.tipo_os : "";
    form.elements.versao.value = modelo.versao || "1";
    const versionLabel = form.querySelector("[data-model-version-label]");
    const modeLabel = form.querySelector("[data-checklist-mode-label]");
    if (versionLabel) versionLabel.textContent = form.elements.versao.value;
    if (modeLabel) modeLabel.textContent = "Editando modelo";
    form.elements.status_toggle.checked = modelo.status !== "INATIVO";
    list.innerHTML = itens.map((item, index) => renderChecklistModelItemRow(index + 1, item)).join("") || renderChecklistModelItemRow(1, { pergunta: "", obrigatorio: true, tipo_resposta: "OK_NOK", evidencia_regra: "SE_NOK", observacao_regra: "SE_NOK" });
    refreshChecklistModelItemIndexes(list);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Modelo carregado para edicao.", "success");
  }

  function toggleChecklistModelStatus(modelId) {
    const refs = state.data.referencias || {};
    const modelo = (refs.checklist_modelos || []).find((item) => item.id === modelId);
    if (!modelo) return;
    const itens = (refs.checklist_modelo_itens || [])
      .filter((item) => item.modelo_id === modelo.id)
      .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
    const payload = {
      token: state.session.token,
      id: modelo.id,
      nome: modelo.nome,
      tipo_os: modelo.tipo_os,
      versao: modelo.versao || "1",
      status: modelo.status === "INATIVO" ? "ATIVO" : "INATIVO",
      itens: itens.map((item, index) => ({
        id: item.id,
        item_id: item.item_id || `IT-${index + 1}`,
        pergunta: item.pergunta,
        tipo_resposta: normalizeChecklistType(item.tipo_resposta),
        unidade: item.unidade || "",
        valor_min: item.valor_min || "",
        valor_max: item.valor_max || "",
        valor_esperado: item.valor_esperado || "",
        opcoes: item.opcoes || "",
        obrigatorio: asBool(item.obrigatorio),
        critico: asBool(item.critico),
        evidencia_regra: item.evidencia_regra || (asBool(item.evidencia_obrigatoria) ? "SEMPRE" : "SE_NOK"),
        observacao_regra: item.observacao_regra || "SE_NOK"
      }))
    };
    window.SCSApi.call("checklist_modelo.salvar", payload)
      .then(async () => {
        toast(`Modelo ${payload.status === "ATIVO" ? "ativado" : "inativado"}.`, "success");
        await handleRefresh();
      })
      .catch(showError);
  }

  function addWorkflowRule(button) {
    const form = button.closest("form");
    const grid = form && form.querySelector("[data-workflow-grid]");
    const countInput = form && form.elements.workflow_count;
    if (!form || !grid || !countInput) return;
    const index = Number(countInput.value || 0);
    grid.insertAdjacentHTML("beforeend", renderWorkflowRow(workflowBlankRow(index), index, state.data.referencias || {}));
    refreshWorkflowRuleIndexes(grid);
    const inserted = grid.lastElementChild;
    if (inserted) inserted.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function removeWorkflowRule(button) {
    const row = button.closest(".workflow-row");
    const grid = row && row.closest("[data-workflow-grid]");
    if (!row || !grid) return;
    row.remove();
    refreshWorkflowRuleIndexes(grid);
    toast("Fluxo customizado removido da edicao. Salve para aplicar.", "success");
  }

  function moveWorkflowRule(button, direction) {
    const row = button.closest(".workflow-row");
    const grid = row && row.closest("[data-workflow-grid]");
    if (!row || !grid) return;
    if (direction < 0 && row.previousElementSibling) {
      grid.insertBefore(row, row.previousElementSibling);
    }
    if (direction > 0 && row.nextElementSibling) {
      grid.insertBefore(row.nextElementSibling, row);
    }
    refreshWorkflowRuleIndexes(grid);
  }

  function refreshWorkflowRuleIndexes(grid) {
    if (!grid) return;
    const rows = Array.from(grid.querySelectorAll(".workflow-row"));
    rows.forEach((row, index) => {
      setName(row, "id", `id_${index}`);
      setName(row, "acao", `acao_${index}`);
      setName(row, "nome", `nome_${index}`);
      setName(row, "status", `status_${index}`);
      setName(row, "status_origem", `status_origem_${index}`);
      setName(row, "status_destino", `status_destino_${index}`);
      setName(row, "permissao", `permissao_${index}`);
      setName(row, "exige_responsavel", `exige_responsavel_${index}`);
      setName(row, "exige_checklist", `exige_checklist_${index}`);
      ["Operador", "Gestor", "Admin"].forEach((perfil) => {
        const field = row.querySelector(`[data-workflow-field="perfil"][data-profile="${perfil}"]`);
        if (field) field.name = `perfil_${index}_${perfil}`;
      });
    });
    const form = grid.closest("form");
    if (form && form.elements.workflow_count) {
      form.elements.workflow_count.value = String(rows.length);
    }
  }

  function setName(root, prefix, name) {
    const field = root.querySelector(`[data-workflow-field="${prefix}"]`);
    if (field) field.name = name;
  }

  function loadUserEdit(userId) {
    const user = ((state.data.referencias && state.data.referencias.usuarios) || []).find((item) => item.id === userId);
    const form = document.getElementById("user-form");
    if (!user || !form) return;
    form.elements.id.value = user.id || "";
    form.elements.nome.value = user.nome || "";
    form.elements.email.value = user.email || "";
    form.elements.perfil.value = user.perfil || "Operador";
    form.elements.status.value = user.status || "ATIVO";
    form.elements.setor.value = user.setor || "";
    form.elements.senha.value = "";
    const title = form.closest(".panel").querySelector("[data-user-form-title]");
    if (title) title.textContent = `Editar ${user.nome || user.id}`;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Usuario carregado para edicao.", "success");
  }

  function clearUserForm() {
    const form = document.getElementById("user-form");
    if (!form) return;
    form.reset();
    form.elements.id.value = "";
    form.elements.senha.value = "123456";
    const title = form.closest(".panel").querySelector("[data-user-form-title]");
    if (title) title.textContent = "Salvar usuário";
  }

  function toggleUserStatus(userId) {
    const user = ((state.data.referencias && state.data.referencias.usuarios) || []).find((item) => item.id === userId);
    if (!user) return;
    if (user.perfil === "Admin" && user.id === "USR-ADMIN") {
      toast("Admin Master nao pode ser bloqueado.", "error");
      return;
    }
    const nextStatus = user.status === "INATIVO" ? "ATIVO" : "INATIVO";
    window.SCSApi.call("usuarios.salvar", {
      token: state.session.token,
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      status: nextStatus,
      setor: user.setor || ""
    })
      .then(async () => {
        toast(`Usuario ${nextStatus === "ATIVO" ? "reativado" : "bloqueado"} com auditoria.`, "success");
        await handleRefresh();
      })
      .catch(showError);
  }

  function resetUserPassword(userId) {
    const user = ((state.data.referencias && state.data.referencias.usuarios) || []).find((item) => item.id === userId);
    if (!user) return;
    const senha = String(window.prompt(`Nova senha para ${user.nome || user.id}:`, "123456") || "").trim();
    if (!senha) {
      toast("Reset de senha cancelado.", "error");
      return;
    }
    window.SCSApi.call("usuarios.salvar", {
      token: state.session.token,
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      status: user.status || "ATIVO",
      setor: user.setor || "",
      senha
    })
      .then(async () => {
        toast("Senha redefinida com auditoria.", "success");
        await handleRefresh();
      })
      .catch(showError);
  }

  function resetLocal() {
    if (!window.SCSMockApi || window.SCS_CONFIG.apiUrl) {
      toast("Restauracao local disponivel apenas no modo mock.", "error");
      return;
    }
    window.SCSMockApi.reset();
    sessionStorage.removeItem(sessionKey);
    toast("Base local restaurada. Faca login novamente.", "success");
    logout();
  }

  function exportBackup() {
    if (!window.SCSMockApi || window.SCS_CONFIG.apiUrl) {
      toast("Exportacao local disponivel apenas no modo mock.", "error");
      return;
    }
    const blob = new Blob([JSON.stringify(window.SCSMockApi.exportDb(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scs-os-control-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function filteredOrdersForView(view) {
    let orders = state.data.ordens.slice();
    if (view === "programacao") {
      orders = orders.filter((os) => ["RASCUNHO", "PLANEJADA", "LIBERADA"].includes(os.status));
    }
    if (view === "acompanhamento") {
      orders = orders.filter((os) => ["EM_EXECUCAO", "AGUARDANDO_APROVACAO", "REABERTA"].includes(os.status) || isLate(os));
    }
    if (state.osQuickFilter === "abertas") {
      orders = orders.filter((os) => !["CONCLUIDA", "CANCELADA"].includes(os.status));
    }
    if (state.osQuickFilter === "backlog") {
      orders = orders.filter((os) => ["RASCUNHO", "PLANEJADA", "LIBERADA", "REABERTA"].includes(os.status));
    }
    if (state.osQuickFilter === "atrasadas") {
      orders = orders.filter(isLate);
    }
    if (state.osQuickFilter === "pendencias") {
      const pendingIds = state.data.checklist
        .filter((item) => item.obrigatorio && !item.resposta)
        .map((item) => item.os_id);
      orders = orders.filter((os) => pendingIds.includes(os.id));
    }
    if (state.statusFilter) {
      orders = orders.filter((os) => os.status === state.statusFilter);
    }
    const search = normalize(state.search);
    if (search) {
      orders = orders.filter((os) => {
        const ativo = getAtivo(os.ativo_id);
        return normalize(`${os.id} ${os.tipo} ${os.prioridade} ${os.status} ${ativo.nome} ${os.descricao}`).includes(search);
      });
    }
    return orders.sort((a, b) => String(a.prazo || "").localeCompare(String(b.prazo || "")));
  }

  function validateLocalChecklist(osId) {
    const pendencias = [];
    getChecklist(osId).forEach((item) => {
      if (item.obrigatorio && !item.resposta) pendencias.push(item.pergunta);
      if (item.resposta === "NAO_OK" && !String(item.observacao || "").trim()) pendencias.push(item.pergunta);
      if (item.evidencia_obrigatoria && !String(item.evidencia || "").trim()) pendencias.push(item.pergunta);
    });
    return { valido: pendencias.length === 0, pendencias };
  }

  function can(permission) {
    if (state.session && state.session.perfil === "Admin") return true;
    return Boolean(state.session && state.session.permissoes && state.session.permissoes[permission]);
  }

  function canWorkflowAction(action, os) {
    const regra = workflowRuleFor(action, os.status);
    if (!regra) return false;
    if (!can(regra.permissao)) return false;
    if (asBool(regra.exige_responsavel) && state.session.perfil === "Operador" && os.responsavel !== state.session.usuario.id) return false;
    return true;
  }

  function workflowRuleFor(action, status) {
    const regras = (state.data.referencias.workflow_regras || []).filter((item) => item.status === "ATIVO");
    return regras.find((item) => item.acao === action && csvHas(item.status_origem, status) && csvHas(item.perfis, state.session.perfil)) || null;
  }

  function csvHas(value, needle) {
    return splitCsv(value).includes(needle);
  }

  function splitCsv(value) {
    if (Array.isArray(value)) return value;
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }

  function asBool(value) {
    return value === true || value === "true" || value === "TRUE" || value === "SIM" || value === "1" || value === "on";
  }

  function canStart(os) {
    return can("iniciar_os") && (state.session.perfil !== "Operador" || os.responsavel === state.session.usuario.id);
  }

  function canFinish(os) {
    return can("finalizar_execucao") && (state.session.perfil !== "Operador" || os.responsavel === state.session.usuario.id);
  }

  function canChecklist(os) {
    return can("preencher_checklist") && (state.session.perfil !== "Operador" || os.responsavel === state.session.usuario.id);
  }

  function getOs(id) {
    return state.data.ordens.find((item) => item.id === id) || {};
  }

  function getAtivo(id) {
    return state.data.referencias.equipamentos.find((item) => item.id === id) || {};
  }

  function getComponente(id) {
    return state.data.referencias.componentes.find((item) => item.id === id) || {};
  }

  function getEquipmentParameters(equipamentoId) {
    return ((state.data.referencias && state.data.referencias.parametros_equipamento) || [])
      .filter((item) => item.equipamento_id === equipamentoId);
  }

  function getEquipmentReadings(equipamentoId) {
    return ((state.data.referencias && state.data.referencias.leituras_parametros) || [])
      .filter((item) => item.equipamento_id === equipamentoId);
  }

  function getEquipmentComponents(equipamentoId) {
    return ((state.data.referencias && state.data.referencias.componentes) || [])
      .filter((item) => item.equipamento_id === equipamentoId);
  }

  function getEquipmentComponentHistory(equipamentoId) {
    return ((state.data.referencias && state.data.referencias.historico_componentes) || [])
      .filter((item) => item.equipamento_id === equipamentoId);
  }

  function getEquipmentEvidences(orders) {
    const orderIds = new Set(orders.map((os) => os.id));
    const checklistById = new Map(state.data.checklist.map((item) => [item.id, item]));
    const usuarios = (state.data.referencias && state.data.referencias.usuarios) || [];
    const usuarioById = new Map(usuarios.map((item) => [item.id, item]));
    const result = [];
    const seen = new Set();

    state.data.anexos
      .filter((item) => orderIds.has(item.os_id))
      .forEach((anexo) => {
        const checklist = checklistById.get(anexo.checklist_id) || {};
        const key = `${anexo.os_id}|${anexo.checklist_id}|${anexo.nome}`;
        seen.add(key);
        result.push({
          tipo: "Anexo",
          nome: anexo.nome,
          os_id: anexo.os_id,
          checklist_id: anexo.checklist_id,
          pergunta: checklist.pergunta,
          usuario: usuarioById.get(anexo.usuario)?.nome || anexo.usuario,
          data_hora: anexo.data_hora
        });
      });

    state.data.checklist
      .filter((item) => orderIds.has(item.os_id) && String(item.evidencia || "").trim())
      .forEach((item) => {
        const key = `${item.os_id}|${item.id}|${item.evidencia}`;
        if (seen.has(key)) return;
        result.push({
          tipo: "Checklist",
          nome: item.evidencia,
          os_id: item.os_id,
          checklist_id: item.id,
          pergunta: item.pergunta,
          usuario: usuarioById.get(item.responsavel)?.nome || item.responsavel,
          data_hora: item.data_hora
        });
      });

    return result.sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora)));
  }

  function formatTechnicalTerm(value) {
    const raw = String(value === undefined || value === null ? "" : value).trim();
    if (!raw) return "-";
    const key = raw.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const dictionary = {
      HORIMETRO: "Horímetro",
      VIBRACAO_AXIAL: "Vibração axial",
      "VIBRACAO AXIAL": "Vibração axial",
      TEMPERATURA_MANCAL: "Temperatura do mancal",
      "TEMPERATURA MANCAL": "Temperatura do mancal",
      ATENCAO: "Atenção",
      INSPECAO: "Inspeção",
      DESCRICAO_TECNICA: "Descrição técnica",
      "DESCRICAO TECNICA": "Descrição técnica",
      ULTIMO_EVENTO: "Último evento",
      "ULTIMO EVENTO": "Último evento",
      VIDA_UTIL: "Vida útil",
      "VIDA UTIL": "Vida útil",
      EVIDENCIA: "Evidência",
      EVIDENCIAS: "Evidências",
      HISTORICO: "Histórico",
      PARAMETROS: "Parâmetros",
      INSTALACAO: "Instalação",
      NUMERO_SERIE: "Número de série",
      "NUMERO DE SERIE": "Número de série",
      RESPONSAVEL: "Responsável",
      INTERVENCAO: "Intervenção",
      TROCA: "Troca",
      AJUSTE: "Ajuste",
      BLOQUEIO: "Bloqueio",
      NORMAL: "Normal",
      CRITICO: "Crítico"
    };
    return dictionary[key] || raw;
  }

  function parameterStatusLabel(status) {
    return formatTechnicalTerm(status || "NORMAL");
  }

  function getLatestParameterReading(parametro, leituras) {
    return leituras
      .filter((item) => item.parametro_id === parametro.id)
      .sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora)))[0] || null;
  }

  function parameterStatus(parametro, lastReading) {
    const manualStatus = String(parametro.status_operacional || "").trim().toUpperCase();
    if (manualStatus && manualStatus !== "NORMAL") return manualStatus;

    const rawValue = lastReading ? lastReading.valor : parametro.valor;
    const value = finiteNumber(rawValue);
    const min = finiteNumber(parametro.limite_min);
    const max = finiteNumber(parametro.limite_max);
    const hasValue = Number.isFinite(value);
    const hasMin = Number.isFinite(min);
    const hasMax = Number.isFinite(max);

    if (!hasValue) return manualStatus || "NORMAL";
    if ((hasMin && value < min) || (hasMax && value > max)) return "CRITICO";
    if (hasMax && max > 0 && value >= max * 0.9) return "ATENCAO";
    if (hasMin && min > 0 && value <= min * 1.1) return "ATENCAO";
    return manualStatus || "NORMAL";
  }

  function finiteNumber(value) {
    const text = String(value === undefined || value === null ? "" : value).trim().replace(",", ".");
    if (!text) return Number.NaN;
    const number = Number(text);
    return Number.isFinite(number) ? number : Number.NaN;
  }

  function getEquipmentOperationalState(equipamento, pendingOrders, parametros, componentes) {
    if (equipamento.status !== "ATIVO") {
      return { label: "Ativo inativo", detail: "Consulta histórica liberada", className: "parado" };
    }

    const leituras = getEquipmentReadings(equipamento.id);
    const parameterStatuses = parametros.map((parametro) => parameterStatus(parametro, getLatestParameterReading(parametro, leituras)));
    const hasCriticalParameter = parameterStatuses.includes("CRITICO");
    const hasAttentionParameter = parameterStatuses.includes("ATENCAO");
    const blockedComponents = (componentes || []).filter((item) => item.status === "BLOQUEADO" || item.status === "INATIVO");
    const hasCriticalBlockedComponent = blockedComponents.some((item) => item.criticidade === "A");
    const hasLateCriticalOrder = pendingOrders.some((os) => os.criticidade === "A" && isLate(os));
    const hasLateOrder = pendingOrders.some((os) => isLate(os));

    if (hasCriticalParameter || hasLateCriticalOrder || hasCriticalBlockedComponent) {
      return { label: "Crítico", detail: "Intervenção ou parâmetro fora do limite", className: "critico" };
    }
    if (hasAttentionParameter || hasLateOrder || pendingOrders.length || blockedComponents.length) {
      const detail = pendingOrders.length
        ? `${pendingOrders.length} OS pendente(s)`
        : (blockedComponents.length ? `${blockedComponents.length} componente(s) bloqueado(s)` : "Parâmetro em faixa de alerta");
      return { label: "Atenção", detail, className: "atencao" };
    }
    return { label: "Normal", detail: "Sem OS pendente e parâmetros dentro da faixa", className: "normal" };
  }

  function getUser(id) {
    return state.data.referencias.usuarios.find((item) => item.id === id) || {};
  }

  function getChecklistModel(id) {
    return ((state.data.referencias && state.data.referencias.checklist_modelos) || []).find((item) => item.id === id) || {};
  }

  function getSetor(id) {
    return state.data.referencias.setores.find((item) => item.id === id) || {};
  }

  function getPlanta(id) {
    return ((state.data.referencias && state.data.referencias.plantas) || []).find((item) => item.id === id) || {};
  }

  function getLinha(id) {
    return state.data.referencias.linhas.find((item) => item.id === id) || {};
  }

  function getChecklist(osId) {
    return state.data.checklist.filter((item) => item.os_id === osId);
  }

  function getChecklistItem(id) {
    return state.data.checklist.find((item) => item.id === id) || {};
  }

  function getHistórico(osId) {
    return state.data.historico.filter((item) => item.os_id === osId);
  }

  function getEventos(osId) {
    return state.data.eventos.filter((item) => item.os_id === osId);
  }

  function statusTag(status) {
    return `<span class="tag ${STATUS_CLASS[status] || ""}">${escapeHtml(STATUS_LABEL[status] || status)}</span>`;
  }

  function dataRow(label, value) {
    return `<div class="data-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value === undefined || value === null ? "" : String(value))}</dd></div>`;
  }

  function isLate(os) {
    const today = new Date().toISOString().slice(0, 10);
    return Boolean(os.prazo && os.prazo < today && !["CONCLUIDA", "CANCELADA"].includes(os.status));
  }

  function countBy(items, field) {
    return items.reduce((acc, item) => {
      const key = item[field] || "-";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function groupOrdersByEquipment(orders) {
    return orders.reduce((acc, os) => {
      const ativo = getAtivo(os.ativo_id);
      const key = ativo.nome || os.ativo_id || "-";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function seriesFromCount(map, labels) {
    const total = Object.values(map).reduce((sum, value) => sum + Number(value || 0), 0);
    return Object.keys(map)
      .map((key) => ({
        key,
        label: labels && labels[key] ? labels[key] : key,
        value: map[key],
        percent: percent(map[key], total)
      }))
      .sort((a, b) => b.value - a.value);
  }

  function percent(value, total) {
    if (!total) return 0;
    return clampPercent(Math.round((Number(value || 0) / Number(total)) * 100));
  }

  function clampPercent(value) {
    return Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Number(value) : 0));
  }

  function avg(values) {
    const valid = values.filter((value) => Number.isFinite(value));
    if (!valid.length) return 0;
    return valid.reduce((sum, value) => sum + value, 0) / valid.length;
  }

  function roundOne(value) {
    return Math.round(Number(value || 0) * 10) / 10;
  }

  function hoursBetween(start, end) {
    const a = new Date(start).getTime();
    const b = new Date(end).getTime();
    if (Number.isNaN(a) || Number.isNaN(b)) return 0;
    return Math.max(0, (b - a) / 36e5);
  }

  function daysBetween(start, end) {
    const a = new Date(start).getTime();
    const b = new Date(end).getTime();
    if (Number.isNaN(a) || Number.isNaN(b)) return 0;
    return Math.max(0, (b - a) / 864e5);
  }

  function calculateMtbfDays(orders) {
    const byEquipment = {};
    orders.forEach((os) => {
      if (!os.ativo_id || !os.criado_em) return;
      if (!byEquipment[os.ativo_id]) byEquipment[os.ativo_id] = [];
      byEquipment[os.ativo_id].push(os.criado_em);
    });
    const intervals = [];
    Object.values(byEquipment).forEach((dates) => {
      dates.sort();
      for (let index = 1; index < dates.length; index += 1) {
        intervals.push(daysBetween(dates[index - 1], dates[index]));
      }
    });
    return intervals.length ? avg(intervals) : 0;
  }

  function unique(items) {
    return items.filter((item, index, arr) => item && arr.indexOf(item) === index);
  }

  function yesNo(value) {
    return value ? "SIM" : "NAO";
  }

  function normalize(value) {
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("pt-BR");
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function toggle(selector) {
    const el = document.querySelector(selector);
    if (el) el.classList.toggle("hidden");
  }

  function scrollTop() {
    window.scrollTo(0, 0);
  }

  function toast(message, type) {
    const stack = document.getElementById("toasts");
    if (!stack) return;
    const node = document.createElement("div");
    node.className = `toast ${type || ""}`;
    node.textContent = message;
    stack.appendChild(node);
    setTimeout(() => node.remove(), 4200);
  }

  function showError(error) {
    const details = error.details && error.details.length ? ` ${error.details.join("; ")}` : "";
    const message = `${error.message || "Nao foi possivel concluir a acao."}${details}`;
    const stack = document.getElementById("toasts");
    if (stack) {
      toast(message, "error");
      return;
    }
    const form = app.querySelector("#login-form");
    if (form) {
      let box = app.querySelector("#login-error");
      if (!box) {
        box = document.createElement("div");
        box.id = "login-error";
        box.className = "form-error";
        box.setAttribute("role", "alert");
        form.appendChild(box);
      }
      box.textContent = message;
    }
  }
})();
