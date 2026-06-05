(function () {
  "use strict";

  const CONFIG = window.SCS_CONFIG;

  const STATUS_FLUXO = [
    "RASCUNHO",
    "PLANEJADA",
    "LIBERADA",
    "EM_EXECUCAO",
    "AGUARDANDO_APROVACAO",
    "CONCLUIDA",
    "AGUARDANDO_PECA",
    "AGUARDANDO_LIBERACAO",
    "REABERTA",
    "CANCELADA"
  ];

  const WORKFLOW_ACTIONS = [
    { acao: "INICIAR_OS", nome: "Iniciar execucao", permissao: "iniciar_os" },
    { acao: "FINALIZAR_EXECUCAO", nome: "Finalizar execucao", permissao: "finalizar_execucao" },
    { acao: "APROVAR_OS", nome: "Aprovar OS", permissao: "aprovar_os" },
    { acao: "REABRIR_OS", nome: "Reabrir OS", permissao: "reabrir_os" }
  ];

  const PERMISSION_DEFINITIONS = [
    { chave: "login", nome: "Acessar sistema", grupo: "Acesso" },
    { chave: "dashboard", nome: "Ver dashboard proprio", grupo: "Acesso" },
    { chave: "qr", nome: "Ler QR Code", grupo: "Rastreabilidade" },
    { chave: "minhas_os", nome: "Ver OS permitidas", grupo: "Ordem de Servico" },
    { chave: "criar_os", nome: "Criar e liberar OS", grupo: "Ordem de Servico" },
    { chave: "editar_os_pre_execucao", nome: "Editar OS antes da execucao", grupo: "Ordem de Servico" },
    { chave: "iniciar_os", nome: "Iniciar OS", grupo: "Execucao" },
    { chave: "preencher_checklist", nome: "Preencher checklist", grupo: "Execucao" },
    { chave: "finalizar_execucao", nome: "Finalizar execucao", grupo: "Execucao" },
    { chave: "aprovar_os", nome: "Aprovar OS", grupo: "Gestao / PCM" },
    { chave: "reabrir_os", nome: "Reabrir OS", grupo: "Gestao / PCM" },
    { chave: "ver_relatorios", nome: "Ver relatorios", grupo: "Gestao / PCM" },
    { chave: "cadastrar_equipamento", nome: "Cadastrar equipamento", grupo: "Cadastros" },
    { chave: "editar_checklist_padrao", nome: "Editar checklist padrao", grupo: "Cadastros" },
    { chave: "ver_usuarios", nome: "Ver usuarios", grupo: "Governanca" },
    { chave: "criar_usuario", nome: "Criar usuario", grupo: "Governanca" },
    { chave: "alterar_permissao", nome: "Alterar permissoes", grupo: "Governanca" },
    { chave: "configurar_fluxo", nome: "Configurar fluxo operacional", grupo: "Governanca" },
    { chave: "ver_audit_log", nome: "Ver audit_log", grupo: "Auditoria" },
    { chave: "backup", nome: "Backup e restauracao", grupo: "Backup" }
  ];

  const PERMISSOES = {
    Operador: {
      login: true,
      dashboard: true,
      qr: true,
      minhas_os: true,
      criar_os: false,
      editar_os_pre_execucao: false,
      iniciar_os: true,
      preencher_checklist: true,
      finalizar_execucao: true,
      aprovar_os: false,
      reabrir_os: false,
      ver_relatorios: false,
      cadastrar_equipamento: false,
      editar_checklist_padrao: false,
      ver_usuarios: false,
      criar_usuario: false,
      alterar_permissao: false,
      configurar_fluxo: false,
      ver_audit_log: false,
      backup: false
    },
    Gestor: {
      login: true,
      dashboard: true,
      qr: true,
      minhas_os: true,
      criar_os: true,
      editar_os_pre_execucao: true,
      iniciar_os: true,
      preencher_checklist: true,
      finalizar_execucao: true,
      aprovar_os: true,
      reabrir_os: true,
      ver_relatorios: true,
      cadastrar_equipamento: true,
      editar_checklist_padrao: true,
      ver_usuarios: true,
      criar_usuario: false,
      alterar_permissao: false,
      configurar_fluxo: false,
      ver_audit_log: false,
      backup: false
    },
    Admin: {
      login: true,
      dashboard: true,
      qr: true,
      minhas_os: true,
      criar_os: true,
      editar_os_pre_execucao: true,
      iniciar_os: true,
      preencher_checklist: true,
      finalizar_execucao: true,
      aprovar_os: true,
      reabrir_os: true,
      ver_relatorios: true,
      cadastrar_equipamento: true,
      editar_checklist_padrao: true,
      ver_usuarios: true,
      criar_usuario: true,
      alterar_permissao: true,
      configurar_fluxo: true,
      ver_audit_log: true,
      backup: true
    }
  };

  const MENUS = {
    Operador: [
      ["dashboard", "Dashboard"],
      ["minhas-os", "Minhas OS"],
      ["historico-pessoal", "Historico pessoal"],
      ["comunicacoes", "Comunicacoes"],
      ["meu-perfil", "Meu perfil"],
      ["sair", "Sair"]
    ],
    Gestor: [
      ["dashboard", "Dashboard"],
      ["gestao-os", "Gestao de OS"],
      ["programacao", "Programacao"],
      ["acompanhamento", "Acompanhamento"],
      ["relatorios", "Relatorios"],
      ["equipamentos", "Equipamentos"],
      ["checklists", "Checklists"],
      ["usuarios-view", "Usuarios - visualizar"],
      ["meu-perfil", "Meu perfil"],
      ["sair", "Sair"]
    ],
    Admin: [
      ["dashboard", "Dashboard"],
      ["usuarios", "Usuarios"],
      ["permissoes", "Modulos"],
      ["cadastros", "Cadastros gerais"],
      ["checklists", "Checklists"],
      ["qr-code", "QR Code"],
      ["configuracoes", "Fluxos"],
      ["auditoria", "Auditoria / Logs"],
      ["backup", "Backup"],
      ["integracoes", "Integracoes"],
      ["versionamento", "Versionamento"],
      ["relatorios-gerais", "Relatorios gerais"],
      ["sair", "Sair"]
    ]
  };

  const MENU_CATALOG = [
    ["dashboard", "Dashboard"],
    ["minhas-os", "Minhas OS"],
    ["gestao-os", "Gestao de OS"],
    ["programacao", "Programacao"],
    ["acompanhamento", "Acompanhamento"],
    ["relatorios", "Relatorios"],
    ["equipamentos", "Equipamentos"],
    ["checklists", "Checklists"],
    ["qr-code", "QR Code"],
    ["usuarios-view", "Usuarios - visualizar"],
    ["usuarios", "Usuarios"],
    ["permissoes", "Modulos"],
    ["cadastros", "Cadastros gerais"],
    ["configuracoes", "Fluxos"],
    ["auditoria", "Auditoria / Logs"],
    ["backup", "Backup"],
    ["integracoes", "Integracoes"],
    ["versionamento", "Versionamento"],
    ["relatorios-gerais", "Relatorios gerais"],
    ["historico-pessoal", "Historico pessoal"],
    ["comunicacoes", "Comunicacoes"],
    ["meu-perfil", "Meu perfil"],
    ["sair", "Sair"]
  ];

  const MODULE_DEFINITIONS = [
    {
      id: "painel",
      nome: "Painel",
      descricao: "Visao inicial e resumo operacional",
      menu_ids: ["dashboard"],
      permissoes: ["dashboard"]
    },
    {
      id: "ordens_servico",
      nome: "Ordens de Servico",
      descricao: "Criacao, execucao, acompanhamento e aprovacao de OS",
      menu_ids: ["minhas-os", "gestao-os", "programacao", "acompanhamento"],
      permissoes: ["minhas_os", "criar_os", "editar_os_pre_execucao", "iniciar_os", "finalizar_execucao", "aprovar_os", "reabrir_os"]
    },
    {
      id: "checklists",
      nome: "Checklists",
      descricao: "Modelos, execucao e validacao tecnica",
      menu_ids: ["checklists"],
      permissoes: ["preencher_checklist", "editar_checklist_padrao"]
    },
    {
      id: "cadastros",
      nome: "Cadastros",
      descricao: "Plantas, setores, linhas, equipamentos e componentes",
      menu_ids: ["equipamentos", "cadastros"],
      permissoes: ["cadastrar_equipamento"]
    },
    {
      id: "usuarios",
      nome: "Usuarios",
      descricao: "Consulta, criacao e manutencao de usuarios",
      menu_ids: ["usuarios-view", "usuarios"],
      permissoes: ["ver_usuarios", "criar_usuario"]
    },
    {
      id: "kpis",
      nome: "KPIs",
      descricao: "Backlog, atrasos, compliance e indicadores de PCM",
      menu_ids: ["relatorios", "relatorios-gerais"],
      permissoes: ["ver_relatorios"]
    },
    {
      id: "qr_code",
      nome: "Scan QR Code",
      descricao: "Leitura de QR Code por perfil e hierarquia do ativo",
      menu_ids: ["qr-code"],
      permissoes: ["qr"]
    },
    {
      id: "fluxos",
      nome: "Fluxos",
      descricao: "Regras de transicao e validacoes da OS",
      menu_ids: ["configuracoes"],
      permissoes: ["configurar_fluxo"]
    },
    {
      id: "acessos",
      nome: "Modulos e acessos",
      descricao: "Ativacao de modulos e liberacoes por perfil",
      menu_ids: ["permissoes"],
      permissoes: ["alterar_permissao"]
    },
    {
      id: "auditoria",
      nome: "Auditoria",
      descricao: "Trilha imutavel de eventos e alteracoes",
      menu_ids: ["auditoria"],
      permissoes: ["ver_audit_log"]
    },
    {
      id: "backup",
      nome: "Backup",
      descricao: "Exportacao e restauracao da base local",
      menu_ids: ["backup"],
      permissoes: ["backup"]
    },
    {
      id: "versionamento",
      nome: "Versionamento",
      descricao: "Historico tecnico de versoes, endpoints e schema",
      menu_ids: ["versionamento"],
      permissoes: ["backup", "ver_audit_log"]
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function dateOffset(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function newId(prefix) {
    if (window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint32Array(2);
      window.crypto.getRandomValues(bytes);
      return `${prefix}-${bytes[0].toString(16)}${bytes[1].toString(16)}`.toUpperCase();
    }
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`.toUpperCase();
  }

  function normalizeReadingValue(value) {
    const text = String(value === undefined || value === null ? "" : value).trim().replace(",", ".");
    if (!text) throw new Error("Nao foi possivel registrar leitura: valor obrigatorio.");
    const number = Number(text);
    if (!Number.isFinite(number)) throw new Error("Nao foi possivel registrar leitura: valor numerico invalido.");
    return String(number);
  }

  function normalizeOptionalReadingValue(value, label) {
    const text = String(value === undefined || value === null ? "" : value).trim().replace(",", ".");
    if (!text) return "";
    const number = Number(text);
    if (!Number.isFinite(number)) throw new Error(`Nao foi possivel registrar evento: ${label} numerico invalido.`);
    return String(number);
  }

  function optionalNumber(value) {
    const text = String(value === undefined || value === null ? "" : value).trim().replace(",", ".");
    if (!text) return Number.NaN;
    const number = Number(text);
    return Number.isFinite(number) ? number : Number.NaN;
  }

  function calculateParameterStatus(parametro, rawValue) {
    const value = optionalNumber(rawValue);
    const min = optionalNumber(parametro.limite_min);
    const max = optionalNumber(parametro.limite_max);
    if (!Number.isFinite(value)) return "NORMAL";
    if ((Number.isFinite(min) && value < min) || (Number.isFinite(max) && value > max)) return "CRITICO";
    if (Number.isFinite(max) && max > 0 && value >= max * 0.9) return "ATENCAO";
    if (Number.isFinite(min) && min > 0 && value <= min * 1.1) return "ATENCAO";
    return "NORMAL";
  }

  function seedDb() {
    const createdAt = nowIso();
    return {
      meta: {
        version: CONFIG.appVersion,
        criado_em: createdAt
      },
      permissoes: clone(PERMISSOES),
      modulos: moduleSeedRows(createdAt),
      modulo_perfis: moduleProfileSeedRows(createdAt),
      plantas: [
        { id: "PLT-SCS", nome: "SCS Industria", cnpj: "00.000.000/0001-00", cidade: "Sao Paulo", uf: "SP", status: "ATIVO" }
      ],
      setores: [
        { id: "SET-CONS", planta_id: "PLT-SCS", nome: "Conservas", responsavel: "USR-GESTOR", status: "ATIVO" },
        { id: "SET-ROT", planta_id: "PLT-SCS", nome: "Rotulagem", responsavel: "USR-GESTOR", status: "ATIVO" },
        { id: "SET-UTL", planta_id: "PLT-SCS", nome: "Utilidades", responsavel: "USR-GESTOR", status: "ATIVO" }
      ],
      linhas: [
        { id: "LIN-03", setor_id: "SET-CONS", nome: "Linha 03", capacidade: "1200 un/h", status: "ATIVO" },
        { id: "LIN-05", setor_id: "SET-ROT", nome: "Linha 05", capacidade: "900 un/h", status: "ATIVO" },
        { id: "LIN-07", setor_id: "SET-UTL", nome: "Linha 07", capacidade: "Utilidades", status: "ATIVO" }
      ],
      usuarios: [
        {
          id: "USR-OPERADOR",
          nome: "Operador SCS",
          email: "operador@scs.local",
          senha_hash: "123456",
          token: "",
          perfil: "Operador",
          status: "ATIVO",
          setor: "SET-CONS",
          criado_em: createdAt
        },
        {
          id: "USR-GESTOR",
          nome: "Gestor PCM",
          email: "gestor@scs.local",
          senha_hash: "123456",
          token: "",
          perfil: "Gestor",
          status: "ATIVO",
          setor: "SET-CONS",
          criado_em: createdAt
        },
        {
          id: "USR-ADMIN",
          nome: "Admin Master",
          email: "admin@scs.local",
          senha_hash: "123456",
          token: "",
          perfil: "Admin",
          status: "ATIVO",
          setor: "SET-UTL",
          criado_em: createdAt
        }
      ],
      equipamentos: [
        {
          id: "EQ-ENV-03",
          nome: "Envasadora Linha 03",
          setor_id: "SET-CONS",
          linha_id: "LIN-03",
          tipo: "Envasadora",
          fabricante: "Krones",
          modelo: "VolumePro",
          numero_serie: "KR-2018-77",
          data_instalacao: "2021-03-15",
          horimetro_atual: "4200",
          descricao: "Equipamento critico de envase da linha 03.",
          criticidade: "A",
          qr_code: "SCS://EQ-ENV-03",
          status: "ATIVO"
        },
        {
          id: "EQ-ROT-05",
          nome: "Rotuladora Linha 05",
          setor_id: "SET-ROT",
          linha_id: "LIN-05",
          tipo: "Rotuladora",
          fabricante: "Sacmi",
          modelo: "Opera-K",
          numero_serie: "SAC-20-441",
          data_instalacao: "2020-07-10",
          horimetro_atual: "3150",
          descricao: "Rotuladora principal da linha 05.",
          criticidade: "B",
          qr_code: "SCS://EQ-ROT-05",
          status: "ATIVO"
        },
        {
          id: "EQ-CAL-07",
          nome: "Caldeira Utilidades",
          setor_id: "SET-UTL",
          linha_id: "LIN-07",
          tipo: "Caldeira",
          fabricante: "Atlas Copco",
          modelo: "GA-55",
          numero_serie: "AC-17-009",
          data_instalacao: "2019-01-22",
          horimetro_atual: "9100",
          descricao: "Ativo de utilidades com consulta historica.",
          criticidade: "A",
          qr_code: "SCS://EQ-CAL-07",
          status: "INATIVO"
        }
      ],
      componentes: [
        { id: "CMP-ENV-BOMBA", equipamento_id: "EQ-ENV-03", nome: "Bomba dosadora", tipo: "Bomba", criticidade: "A", status: "ATIVO" },
        { id: "CMP-ENV-SENSOR", equipamento_id: "EQ-ENV-03", nome: "Sensor de nivel", tipo: "Sensor", criticidade: "B", status: "ATIVO" },
        { id: "CMP-ROT-CORREIA", equipamento_id: "EQ-ROT-05", nome: "Correia transportadora", tipo: "Correia", criticidade: "B", status: "ATIVO" },
        { id: "CMP-CAL-VALV", equipamento_id: "EQ-CAL-07", nome: "Valvula de seguranca", tipo: "Valvula", criticidade: "A", status: "ATIVO" }
      ],
      parametros_equipamento: [
        { id: "PAR-ENV-HOR", equipamento_id: "EQ-ENV-03", nome: "Horimetro", valor: "4200", unidade: "h", limite_min: "0", limite_max: "4500", status_operacional: "ATENCAO", atualizado_em: createdAt },
        { id: "PAR-ENV-VIB", equipamento_id: "EQ-ENV-03", nome: "Vibracao axial", valor: "7.8", unidade: "mm/s", limite_min: "0", limite_max: "8", status_operacional: "ATENCAO", atualizado_em: createdAt },
        { id: "PAR-ENV-TMP", equipamento_id: "EQ-ENV-03", nome: "Temperatura mancal", valor: "64", unidade: "C", limite_min: "20", limite_max: "85", status_operacional: "NORMAL", atualizado_em: createdAt },
        { id: "PAR-ROT-HOR", equipamento_id: "EQ-ROT-05", nome: "Horimetro", valor: "3150", unidade: "h", limite_min: "0", limite_max: "5000", status_operacional: "NORMAL", atualizado_em: createdAt },
        { id: "PAR-ROT-VEL", equipamento_id: "EQ-ROT-05", nome: "Velocidade nominal", valor: "900", unidade: "un/h", limite_min: "700", limite_max: "950", status_operacional: "NORMAL", atualizado_em: createdAt },
        { id: "PAR-CAL-PRE", equipamento_id: "EQ-CAL-07", nome: "Pressao de trabalho", valor: "11.2", unidade: "bar", limite_min: "8", limite_max: "12", status_operacional: "NORMAL", atualizado_em: createdAt },
        { id: "PAR-CAL-HOR", equipamento_id: "EQ-CAL-07", nome: "Horimetro", valor: "9100", unidade: "h", limite_min: "0", limite_max: "9000", status_operacional: "CRITICO", atualizado_em: createdAt }
      ],
      leituras_parametros: [
        { id: "LEI-ENV-HOR-1", parametro_id: "PAR-ENV-HOR", equipamento_id: "EQ-ENV-03", valor: "4200", unidade: "h", data_hora: createdAt, origem: "SISTEMA" },
        { id: "LEI-ENV-VIB-1", parametro_id: "PAR-ENV-VIB", equipamento_id: "EQ-ENV-03", valor: "7.8", unidade: "mm/s", data_hora: createdAt, origem: "OPERADOR" },
        { id: "LEI-ENV-TMP-1", parametro_id: "PAR-ENV-TMP", equipamento_id: "EQ-ENV-03", valor: "64", unidade: "C", data_hora: createdAt, origem: "OPERADOR" },
        { id: "LEI-ROT-HOR-1", parametro_id: "PAR-ROT-HOR", equipamento_id: "EQ-ROT-05", valor: "3150", unidade: "h", data_hora: createdAt, origem: "SISTEMA" },
        { id: "LEI-ROT-VEL-1", parametro_id: "PAR-ROT-VEL", equipamento_id: "EQ-ROT-05", valor: "900", unidade: "un/h", data_hora: createdAt, origem: "SISTEMA" },
        { id: "LEI-CAL-PRE-1", parametro_id: "PAR-CAL-PRE", equipamento_id: "EQ-CAL-07", valor: "11.2", unidade: "bar", data_hora: createdAt, origem: "SISTEMA" },
        { id: "LEI-CAL-HOR-1", parametro_id: "PAR-CAL-HOR", equipamento_id: "EQ-CAL-07", valor: "9100", unidade: "h", data_hora: createdAt, origem: "SISTEMA" }
      ],
      historico_componentes: [
        { id: "HCOMP-ENV-BOMBA-1", componente_id: "CMP-ENV-BOMBA", equipamento_id: "EQ-ENV-03", acao: "TROCA", descricao: "Substituicao preventiva do selo mecanico.", vida_util_h: "1800", horimetro_evento: "3890", usuario: "USR-GESTOR", data_hora: createdAt },
        { id: "HCOMP-ENV-SENSOR-1", componente_id: "CMP-ENV-SENSOR", equipamento_id: "EQ-ENV-03", acao: "AJUSTE", descricao: "Calibracao do sensor de nivel apos oscilacao.", vida_util_h: "900", horimetro_evento: "4188", usuario: "USR-OPERADOR", data_hora: createdAt },
        { id: "HCOMP-ROT-CORREIA-1", componente_id: "CMP-ROT-CORREIA", equipamento_id: "EQ-ROT-05", acao: "INSPECAO", descricao: "Alinhamento conferido e tensao corrigida.", vida_util_h: "1200", horimetro_evento: "3142", usuario: "USR-OPERADOR", data_hora: createdAt },
        { id: "HCOMP-CAL-VALV-1", componente_id: "CMP-CAL-VALV", equipamento_id: "EQ-CAL-07", acao: "BLOQUEIO", descricao: "Ativo inativo para avaliacao de seguranca.", vida_util_h: "3000", horimetro_evento: "9100", usuario: "USR-GESTOR", data_hora: createdAt }
      ],
      checklist_modelos: [
        { id: "MDL-COR-001", nome: "Corretiva padrao", tipo_os: "Corretiva", versao: "1", status: "ATIVO", criado_por: "USR-ADMIN", criado_em: createdAt },
        { id: "MDL-PREV-001", nome: "Preventiva padrao", tipo_os: "Preventiva", versao: "1", status: "ATIVO", criado_por: "USR-ADMIN", criado_em: createdAt },
        { id: "MDL-INSP-001", nome: "Inspecao padrao", tipo_os: "Inspecao", versao: "1", status: "ATIVO", criado_por: "USR-ADMIN", criado_em: createdAt },
        { id: "MDL-WEG-LUB-001", nome: "Motor WEG 15 cv - Lubrificacao", tipo_os: "Lubrificacao", versao: "1", status: "ATIVO", criado_por: "USR-ADMIN", criado_em: createdAt },
        { id: "MDL-WEG-INSP-001", nome: "Motor WEG 15 cv - Inspecao", tipo_os: "Inspecao", versao: "1", status: "ATIVO", criado_por: "USR-ADMIN", criado_em: createdAt }
      ],
      checklist_modelo_itens: [
        modelItem("MIT-COR-1", "MDL-COR-001", "IT-SEG", "Energia bloqueada e area isolada", true, false, 1, "ATIVO"),
        modelItem("MIT-COR-2", "MDL-COR-001", "IT-EXEC", "Falha corrigida conforme instrucao", true, true, 2, "ATIVO"),
        modelItem("MIT-COR-3", "MDL-COR-001", "IT-TESTE", "Teste operacional realizado", true, false, 3, "ATIVO"),
        modelItem("MIT-PREV-1", "MDL-PREV-001", "IT-SEG", "Energia bloqueada e area isolada", true, false, 1, "ATIVO"),
        modelItem("MIT-PREV-2", "MDL-PREV-001", "IT-LIMP", "Limpeza e fixacao conferidas", true, true, 2, "ATIVO"),
        modelItem("MIT-PREV-3", "MDL-PREV-001", "IT-LEIT", "Leitura comparada com referencia", true, false, 3, "ATIVO"),
        modelItem("MIT-INSP-1", "MDL-INSP-001", "IT-SEG", "Area isolada", true, false, 1, "ATIVO"),
        modelItem("MIT-INSP-2", "MDL-INSP-001", "IT-COND", "Condicao fisica sem anomalia critica", true, true, 2, "ATIVO"),
        modelItem("MIT-INSP-3", "MDL-INSP-001", "IT-REG", "Registro tecnico concluido", true, false, 3, "ATIVO"),
        modelItem("MIT-WEG-LUB-1", "MDL-WEG-LUB-001", "IT-TAG", "Conferir TAG do motor e equipamento", true, false, 1, "ATIVO", { tipo_resposta: "OK_NOK" }),
        modelItem("MIT-WEG-LUB-2", "MDL-WEG-LUB-001", "IT-GRAXA", "Confirmar tipo de graxa utilizada", true, false, 2, "ATIVO", { tipo_resposta: "SELECT", opcoes: "Mobil Polyrex EM; Shell Gadus; Lubrax Industrial; Outro", valor_esperado: "Mobil Polyrex EM", observacao_regra: "SE_OUTRO", evidencia_regra: "SE_OUTRO" }),
        modelItem("MIT-WEG-LUB-3", "MDL-WEG-LUB-001", "IT-MANCAL-D", "Registrar quantidade de graxa no mancal dianteiro", true, false, 3, "ATIVO", { tipo_resposta: "NUMERICO", unidade: "g", valor_min: "10", valor_max: "30", evidencia_regra: "FORA_LIMITE", observacao_regra: "FORA_LIMITE" }),
        modelItem("MIT-WEG-LUB-4", "MDL-WEG-LUB-001", "IT-MANCAL-T", "Registrar quantidade de graxa no mancal traseiro", true, false, 4, "ATIVO", { tipo_resposta: "NUMERICO", unidade: "g", valor_min: "10", valor_max: "30", evidencia_regra: "FORA_LIMITE", observacao_regra: "FORA_LIMITE" }),
        modelItem("MIT-WEG-LUB-5", "MDL-WEG-LUB-001", "IT-RUIDO", "Verificar ruido anormal apos lubrificacao", true, false, 5, "ATIVO", { tipo_resposta: "OK_NOK", critico: true, observacao_regra: "SE_NOK", evidencia_regra: "SE_NOK" }),
        modelItem("MIT-WEG-LUB-6", "MDL-WEG-LUB-001", "IT-PROTECAO", "Verificar protecao mecanica instalada", true, true, 6, "ATIVO", { tipo_resposta: "OK_NOK", critico: true, evidencia_regra: "SEMPRE" }),
        modelItem("MIT-WEG-INSP-1", "MDL-WEG-INSP-001", "IT-TENSAO", "Medir tensao de alimentacao", true, false, 1, "ATIVO", { tipo_resposta: "NUMERICO", unidade: "V", valor_min: "200", valor_max: "240", evidencia_regra: "FORA_LIMITE", observacao_regra: "FORA_LIMITE" }),
        modelItem("MIT-WEG-INSP-2", "MDL-WEG-INSP-001", "IT-CORRENTE", "Medir corrente do motor", true, false, 2, "ATIVO", { tipo_resposta: "NUMERICO", unidade: "A" }),
        modelItem("MIT-WEG-INSP-3", "MDL-WEG-INSP-001", "IT-TEMP", "Verificar temperatura da carcaca", true, false, 3, "ATIVO", { tipo_resposta: "NUMERICO", unidade: "°C", valor_max: "80", evidencia_regra: "FORA_LIMITE", observacao_regra: "FORA_LIMITE" }),
        modelItem("MIT-WEG-INSP-4", "MDL-WEG-INSP-001", "IT-VIB", "Verificar vibracao perceptivel", true, false, 4, "ATIVO", { tipo_resposta: "OK_NOK", critico: true, observacao_regra: "SE_NOK" }),
        modelItem("MIT-WEG-INSP-5", "MDL-WEG-INSP-001", "IT-OBS", "Registrar observacoes gerais", false, false, 5, "ATIVO", { tipo_resposta: "TEXTO", observacao_regra: "NUNCA" })
      ],
      workflow_regras: workflowDefaults(createdAt),
      ordens_servico: [
        {
          id: "OS-102",
          ativo_id: "EQ-ENV-03",
          componente_id: "CMP-ENV-BOMBA",
          tipo: "Corretiva",
          checklist_modelo_id: "MDL-COR-001",
          prioridade: "Alta",
          criticidade: "A",
          status: "LIBERADA",
          solicitante: "USR-GESTOR",
          responsavel: "USR-OPERADOR",
          prazo: dateOffset(1),
          descricao: "Vazamento intermitente na bomba dosadora.",
          instrucoes: "Bloquear energia, inspecionar vedacao e testar retorno.",
          criado_em: createdAt,
          iniciado_em: "",
          finalizado_em: "",
          aprovado_em: ""
        },
        {
          id: "OS-108",
          ativo_id: "EQ-ENV-03",
          componente_id: "CMP-ENV-SENSOR",
          tipo: "Preventiva",
          checklist_modelo_id: "MDL-PREV-001",
          prioridade: "Media",
          criticidade: "B",
          status: "EM_EXECUCAO",
          solicitante: "USR-GESTOR",
          responsavel: "USR-OPERADOR",
          prazo: dateOffset(-1),
          descricao: "Inspecao preventiva do sensor de nivel.",
          instrucoes: "Conferir leitura, limpeza e fixacao do sensor.",
          criado_em: createdAt,
          iniciado_em: createdAt,
          finalizado_em: "",
          aprovado_em: ""
        },
        {
          id: "OS-121",
          ativo_id: "EQ-ROT-05",
          componente_id: "CMP-ROT-CORREIA",
          tipo: "Inspecao",
          checklist_modelo_id: "MDL-INSP-001",
          prioridade: "Baixa",
          criticidade: "B",
          status: "AGUARDANDO_APROVACAO",
          solicitante: "USR-GESTOR",
          responsavel: "USR-OPERADOR",
          prazo: dateOffset(0),
          descricao: "Inspecao de alinhamento da correia.",
          instrucoes: "Verificar alinhamento, desgaste e tensao.",
          criado_em: createdAt,
          iniciado_em: createdAt,
          finalizado_em: createdAt,
          aprovado_em: ""
        }
      ],
      checklist_execucao: [
        item("CHK-102-1", "OS-102", "IT-SEG", "Energia bloqueada e area isolada", true, "", "", "", false, "", ""),
        item("CHK-102-2", "OS-102", "IT-VED", "Vedacao inspecionada", true, "", "", "", true, "", ""),
        item("CHK-102-3", "OS-102", "IT-TESTE", "Teste operacional realizado", true, "", "", "", false, "", ""),
        item("CHK-108-1", "OS-108", "IT-SEG", "Energia bloqueada e area isolada", true, "OK", "", "", false, "USR-OPERADOR", createdAt),
        item("CHK-108-2", "OS-108", "IT-LIMP", "Sensor limpo e fixado", true, "", "", "", true, "", ""),
        item("CHK-108-3", "OS-108", "IT-LEIT", "Leitura comparada com referencia", true, "NAO_OK", "Oscilacao acima do aceitavel.", "foto-sensor.jpg", false, "USR-OPERADOR", createdAt),
        item("CHK-121-1", "OS-121", "IT-SEG", "Area isolada", true, "OK", "", "", false, "USR-OPERADOR", createdAt),
        item("CHK-121-2", "OS-121", "IT-CORR", "Correia sem desgaste critico", true, "OK", "", "foto-correia.jpg", true, "USR-OPERADOR", createdAt),
        item("CHK-121-3", "OS-121", "IT-TENS", "Tensao conferida", true, "OK", "", "", false, "USR-OPERADOR", createdAt)
      ],
      historico: [
        hist("OS-102", "EQ-ENV-03", "CRIAR_OS", "USR-GESTOR", "OS liberada para execucao."),
        hist("OS-108", "EQ-ENV-03", "INICIAR_OS", "USR-OPERADOR", "Execucao iniciada pelo operador."),
        hist("OS-121", "EQ-ROT-05", "FINALIZAR_EXECUCAO", "USR-OPERADOR", "Execucao enviada para aprovacao.")
      ],
      materiais_os: [],
      eventos: [
        { id: "EVT-OS108-ATRASO", os_id: "OS-108", tipo: "ALERTA_ATRASO", usuario: "SISTEMA", resumo: "OS em execucao com prazo vencido.", data_hora: createdAt },
        { id: "EVT-OS121-APROVACAO", os_id: "OS-121", tipo: "APROVACAO", usuario: "USR-GESTOR", resumo: "OS finalizada aguardando decisao do PCM.", data_hora: createdAt },
        { id: "EVT-OS108-CHECKLIST", os_id: "OS-108", tipo: "CHECKLIST", usuario: "USR-OPERADOR", resumo: "Checklist possui item pendente com evidencia obrigatoria.", data_hora: createdAt },
        { id: "EVT-OS102-STATUS", os_id: "OS-102", tipo: "STATUS", usuario: "USR-GESTOR", resumo: "OS liberada para execucao do operador.", data_hora: createdAt }
      ],
      anexos: [
        { id: "ANX-121-1", os_id: "OS-121", checklist_id: "CHK-121-2", nome: "foto-correia.jpg", usuario: "USR-OPERADOR", data_hora: createdAt }
      ],
      kpis_diarios: [],
      dashboard_cache: [],
      audit_log: [],
      sync_log: [],
      relatorios: [],
      versionamento: versionSeedRows(createdAt)
    };
  }

  function versionSeedRows(createdAt) {
    return [
      {
        id: "VER-1-5-7",
        versao: "1.5.7",
        titulo: "Checklist dinamico tecnico",
        data: createdAt.slice(0, 10),
        status: "ATIVO",
        escopo: "Motor de checklist dinamico com tipos de resposta, unidades, limites, valor esperado, opcoes, criticidade e regras condicionais de evidencia/observacao.",
        endpoints: "checklist.salvar, checklist_modelo.salvar, os.listar, os.criar",
        schema: "checklist_modelo_itens e checklist_execucao com campos dinamicos",
        observacoes: "Inclui seeds Motor WEG 15 cv - Lubrificacao e Inspecao. Mantem compatibilidade com checklists antigos."
      },
      {
        id: "VER-1-5-6",
        versao: "1.5.6",
        titulo: "Pacote real de deploy e UX operacional",
        data: createdAt.slice(0, 10),
        status: "REGISTRADO",
        escopo: "Pacote de publicacao com planilha, Apps Script, frontend, changelog, contraste analitico, fluxo em etapas e CRUD operacional de usuarios.",
        endpoints: "auth.login, os.listar, os.criar, os.iniciar, checklist.salvar, os.finalizar_execucao, os.aprovar, usuarios.salvar, workflow.salvar, logs.listar",
        schema: "sem migracao; versionamento atualizado",
        observacoes: "Preparado para Google Sheets, Apps Script e GitHub Pages mantendo JavaScript Vanilla e contratos existentes."
      },
      {
        id: "VER-1-5-5",
        versao: "1.5.5",
        titulo: "Central de eventos por tags",
        data: createdAt.slice(0, 10),
        status: "REGISTRADO",
        escopo: "Eventos separados por tags, filtros mobile, cards contextuais e seeds de eventos operacionais.",
        endpoints: "os.listar, logs.listar",
        schema: "eventos, versionamento",
        observacoes: "Tags derivadas no frontend sem migracao de colunas; eventos seguem auditaveis pela aba eventos."
      },
      {
        id: "VER-1-5-4",
        versao: "1.5.4",
        titulo: "Contraste, evidencias e rastreabilidade QR",
        data: createdAt.slice(0, 10),
        status: "REGISTRADO",
        escopo: "Correcoes de leitura do tema escuro, evidencia por arquivo/camera no checklist e ficha QR com evidencias e leituras recentes.",
        endpoints: "checklist.salvar, os.listar, parametros.registrar_leitura",
        schema: "checklist_execucao, anexos, leituras_parametros",
        observacoes: "Sem migracao de colunas; evidencia usa o contrato existente e preserva auditoria do checklist."
      },
      {
        id: "VER-1-5-3",
        versao: "1.5.3",
        titulo: "Ciclo de vida de componentes e versionamento",
        data: createdAt.slice(0, 10),
        status: "REGISTRADO",
        escopo: "Eventos tecnicos de componentes pela ficha QR e aba administrativa de versionamento.",
        endpoints: "componentes.registrar_evento, parametros.registrar_leitura",
        schema: "historico_componentes, versionamento",
        observacoes: "Componente pode ser inspecionado, ajustado, trocado ou bloqueado com auditoria."
      },
      {
        id: "VER-1-5-2",
        versao: "1.5.2",
        titulo: "Registro de leitura operacional pelo QR",
        data: createdAt.slice(0, 10),
        status: "REGISTRADO",
        escopo: "Leituras de parametros operacionais atualizam valor atual e status operacional.",
        endpoints: "parametros.registrar_leitura",
        schema: "parametros_equipamento, leituras_parametros",
        observacoes: "Valor numerico validado no backend e auditado."
      },
      {
        id: "VER-1-5-1",
        versao: "1.5.1",
        titulo: "Nucleo de rastreabilidade QR",
        data: createdAt.slice(0, 10),
        status: "REGISTRADO",
        escopo: "Ficha operacional do ativo com parametros, componentes, OS pendentes e historico.",
        endpoints: "os.listar",
        schema: "parametros_equipamento, leituras_parametros, historico_componentes",
        observacoes: "QR de equipamento passou a abrir contexto operacional completo."
      }
    ];
  }

  function item(id, osId, itemId, pergunta, obrigatorio, resposta, observacao, evidencia, evidenciaObrigatoria, responsavel, dataHora, extra) {
    const normalized = normalizeChecklistDefinition(extra || {});
    return {
      id,
      os_id: osId,
      item_id: itemId,
      pergunta,
      obrigatorio,
      resposta,
      observacao,
      evidencia,
      evidencia_obrigatoria: evidenciaObrigatoria,
      responsavel,
      data_hora: dataHora,
      tipo_resposta: normalized.tipo_resposta,
      unidade: normalized.unidade,
      valor_min: normalized.valor_min,
      valor_max: normalized.valor_max,
      valor_esperado: normalized.valor_esperado,
      opcoes: normalized.opcoes,
      critico: normalized.critico,
      evidencia_regra: normalized.evidencia_regra || (evidenciaObrigatoria ? "SEMPRE" : "SE_NOK"),
      observacao_regra: normalized.observacao_regra,
      status_item: normalized.status_item
    };
  }

  function modelItem(id, modeloId, itemId, pergunta, obrigatorio, evidenciaObrigatoria, ordem, status, extra) {
    const normalized = normalizeChecklistDefinition(extra || {});
    return {
      id,
      modelo_id: modeloId,
      item_id: itemId,
      pergunta,
      obrigatorio,
      evidencia_obrigatoria: evidenciaObrigatoria,
      ordem,
      status,
      tipo_resposta: normalized.tipo_resposta,
      unidade: normalized.unidade,
      valor_min: normalized.valor_min,
      valor_max: normalized.valor_max,
      valor_esperado: normalized.valor_esperado,
      opcoes: normalized.opcoes,
      critico: normalized.critico,
      evidencia_regra: normalized.evidencia_regra || (evidenciaObrigatoria ? "SEMPRE" : "SE_NOK"),
      observacao_regra: normalized.observacao_regra,
      status_item: normalized.status_item
    };
  }

  function normalizeChecklistDefinition(input) {
    const allowedTypes = ["OK_NOK", "OK_NOK_NA", "TEXTO", "NUMERICO", "SELECT", "DATA", "FOTO", "LEITURA_TECNICA"];
    const tipo = String(input.tipo_resposta || "OK_NOK").trim().toUpperCase();
    const allowedEvidence = ["NUNCA", "SEMPRE", "SE_NOK", "FORA_LIMITE", "SE_OUTRO"];
    const allowedObservation = ["NUNCA", "SE_NOK", "FORA_LIMITE", "SE_OUTRO"];
    const evidenciaRegra = String(input.evidencia_regra || "").trim().toUpperCase();
    const observacaoRegra = String(input.observacao_regra || "").trim().toUpperCase();
    return {
      tipo_resposta: allowedTypes.includes(tipo) ? tipo : "OK_NOK",
      unidade: input.unidade || "",
      valor_min: input.valor_min || "",
      valor_max: input.valor_max || "",
      valor_esperado: input.valor_esperado || "",
      opcoes: input.opcoes || "",
      critico: Boolean(input.critico === true || input.critico === "true" || input.critico === "TRUE" || input.critico === "SIM" || input.critico === "1" || input.critico === "on"),
      evidencia_regra: allowedEvidence.includes(evidenciaRegra) ? evidenciaRegra : "",
      observacao_regra: allowedObservation.includes(observacaoRegra) ? observacaoRegra : "SE_NOK",
      status_item: input.status_item || ""
    };
  }

  function workflowDefaults(date) {
    return [
      workflowRule("WFL-INICIAR", "INICIAR_OS", "Iniciar execucao", "LIBERADA,REABERTA", "EM_EXECUCAO", "iniciar_os", "Operador,Gestor,Admin", true, false, "ATIVO", date),
      workflowRule("WFL-FINALIZAR", "FINALIZAR_EXECUCAO", "Finalizar execucao", "EM_EXECUCAO", "AGUARDANDO_APROVACAO", "finalizar_execucao", "Operador,Gestor,Admin", true, true, "ATIVO", date),
      workflowRule("WFL-APROVAR", "APROVAR_OS", "Aprovar OS", "AGUARDANDO_APROVACAO", "CONCLUIDA", "aprovar_os", "Gestor,Admin", false, true, "ATIVO", date),
      workflowRule("WFL-REABRIR", "REABRIR_OS", "Reabrir OS", "AGUARDANDO_APROVACAO", "REABERTA", "reabrir_os", "Gestor,Admin", false, false, "ATIVO", date)
    ];
  }

  function workflowRule(id, acao, nome, statusOrigem, statusDestino, permissao, perfis, exigeResponsavel, exigeChecklistOk, status, atualizadoEm) {
    return {
      id,
      acao,
      nome,
      status_origem: statusOrigem,
      status_destino: statusDestino,
      permissao,
      perfis,
      exige_responsavel: exigeResponsavel,
      exige_checklist_ok: exigeChecklistOk,
      status,
      atualizado_em: atualizadoEm
    };
  }

  function moduleSeedRows(date) {
    return MODULE_DEFINITIONS.map((item, index) => ({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      menu_ids: item.menu_ids.join(","),
      permissoes: item.permissoes.join(","),
      status: "ATIVO",
      ordem: index + 1,
      atualizado_em: date
    }));
  }

  function moduleProfileSeedRows(date) {
    const rows = [];
    MODULE_DEFINITIONS.forEach((module) => {
      ["Operador", "Gestor", "Admin"].forEach((profile) => {
        rows.push(moduleProfileRow(
          module.id,
          profile,
          defaultModuleEnabled(module.id, profile),
          defaultBlockedPermissions(module.id, profile).join(","),
          date
        ));
      });
    });
    return rows;
  }

  function moduleProfileRow(moduleId, profile, enabled, blockedPermissions, date) {
    return {
      id: `${moduleId}-${profile}`,
      modulo_id: moduleId,
      perfil: profile,
      liberado: profile === "Admin" ? true : Boolean(enabled),
      permissoes_bloqueadas: profile === "Admin" ? "" : (blockedPermissions || ""),
      atualizado_em: date
    };
  }

  function defaultModuleEnabled(moduleId, profile) {
    if (profile === "Admin") return true;
    const enabled = {
      Operador: ["painel", "ordens_servico", "checklists", "qr_code"],
      Gestor: ["painel", "ordens_servico", "checklists", "cadastros", "usuarios", "kpis", "qr_code"]
    };
    return (enabled[profile] || []).includes(moduleId);
  }

  function defaultBlockedPermissions(moduleId, profile) {
    if (profile === "Operador" && moduleId === "ordens_servico") return ["criar_os", "editar_os_pre_execucao", "aprovar_os", "reabrir_os"];
    if (profile === "Operador" && moduleId === "checklists") return ["editar_checklist_padrao"];
    if (profile === "Gestor" && moduleId === "usuarios") return ["criar_usuario"];
    return [];
  }

  function hist(osId, ativoId, acao, usuario, resumo) {
    return {
      id: newId("HIS"),
      os_id: osId,
      ativo_id: ativoId,
      acao,
      usuario,
      data_hora: nowIso(),
      resumo
    };
  }

  function getDb() {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) {
      const db = seedDb();
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(db));
      return db;
    }
    try {
      const db = JSON.parse(raw);
      return ensureDbShape(db);
    } catch (error) {
      const db = seedDb();
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(db));
      return db;
    }
  }

  function ensureDbShape(db) {
    const fresh = seedDb();
    ["permissoes", "modulos", "modulo_perfis", "workflow_regras", "checklist_modelos", "checklist_modelo_itens", "plantas", "setores", "linhas", "equipamentos", "componentes", "parametros_equipamento", "leituras_parametros", "historico_componentes", "versionamento", "usuarios", "ordens_servico", "checklist_execucao", "historico", "eventos", "anexos", "audit_log"].forEach((key) => {
      if (!Array.isArray(db[key]) && key !== "permissoes") db[key] = clone(fresh[key] || []);
    });
    if (!db.permissoes) db.permissoes = clone(PERMISSOES);
    if (!Array.isArray(db.modulos) || !db.modulos.length) db.modulos = clone(fresh.modulos);
    if (!Array.isArray(db.modulo_perfis) || !db.modulo_perfis.length) db.modulo_perfis = clone(fresh.modulo_perfis);
    mergeMissingSeedRows(db.modulos, fresh.modulos);
    mergeMissingSeedRows(db.modulo_perfis, fresh.modulo_perfis);
    db.plantas = Array.isArray(db.plantas) && db.plantas.length ? db.plantas : clone(fresh.plantas);
    db.setores.forEach((item) => {
      if (!item.planta_id) item.planta_id = db.plantas[0].id;
      if (item.responsavel === undefined) item.responsavel = "";
    });
    db.linhas.forEach((item) => {
      if (item.capacidade === undefined) item.capacidade = "";
    });
    db.equipamentos.forEach((item) => {
      ["fabricante", "modelo", "numero_serie", "data_instalacao", "horimetro_atual", "descricao"].forEach((field) => {
        if (item[field] === undefined) item[field] = "";
      });
    });
    mergeMissingSeedRows(db.componentes, fresh.componentes);
    db.ordens_servico.forEach((item) => {
      if (item.checklist_modelo_id === undefined) item.checklist_modelo_id = "";
    });
    if (!Array.isArray(db.workflow_regras) || !db.workflow_regras.length) db.workflow_regras = clone(fresh.workflow_regras);
    if (!Array.isArray(db.checklist_modelos)) db.checklist_modelos = clone(fresh.checklist_modelos);
    if (!Array.isArray(db.checklist_modelo_itens)) db.checklist_modelo_itens = clone(fresh.checklist_modelo_itens);
    mergeMissingSeedRows(db.checklist_modelos, fresh.checklist_modelos);
    mergeMissingSeedRows(db.checklist_modelo_itens, fresh.checklist_modelo_itens);
    db.checklist_modelo_itens.forEach(normalizeChecklistRecordInPlace);
    db.checklist_execucao.forEach(normalizeChecklistRecordInPlace);
    if (!Array.isArray(db.parametros_equipamento) || !db.parametros_equipamento.length) db.parametros_equipamento = clone(fresh.parametros_equipamento);
    if (!Array.isArray(db.leituras_parametros) || !db.leituras_parametros.length) db.leituras_parametros = clone(fresh.leituras_parametros);
    if (!Array.isArray(db.historico_componentes) || !db.historico_componentes.length) db.historico_componentes = clone(fresh.historico_componentes);
    if (!Array.isArray(db.versionamento) || !db.versionamento.length) db.versionamento = clone(fresh.versionamento);
    mergeMissingSeedRows(db.parametros_equipamento, fresh.parametros_equipamento);
    mergeMissingSeedRows(db.leituras_parametros, fresh.leituras_parametros);
    mergeMissingSeedRows(db.historico_componentes, fresh.historico_componentes);
    mergeMissingSeedRows(db.eventos, fresh.eventos);
    mergeMissingSeedRows(db.versionamento, fresh.versionamento);
    db.versionamento.forEach((item) => {
      if (item.id !== "VER-1-5-7" && item.status === "ATIVO") item.status = "REGISTRADO";
    });
    return db;
  }

  function mergeMissingSeedRows(target, seedRows) {
    if (!Array.isArray(target) || !Array.isArray(seedRows)) return;
    seedRows.forEach((seed) => {
      if (seed && seed.id && !target.some((item) => item.id === seed.id)) {
        target.push(clone(seed));
      }
    });
  }

  function normalizeChecklistRecordInPlace(record) {
    const normalized = normalizeChecklistDefinition(record || {});
    record.tipo_resposta = normalized.tipo_resposta;
    record.unidade = record.unidade || normalized.unidade;
    record.valor_min = record.valor_min || normalized.valor_min;
    record.valor_max = record.valor_max || normalized.valor_max;
    record.valor_esperado = record.valor_esperado || normalized.valor_esperado;
    record.opcoes = record.opcoes || normalized.opcoes;
    record.critico = Boolean(record.critico === true || record.critico === "true" || record.critico === "TRUE" || record.critico === "SIM" || record.critico === "1" || record.critico === "on");
    record.evidencia_regra = record.evidencia_regra || (record.evidencia_obrigatoria ? "SEMPRE" : "SE_NOK");
    record.observacao_regra = record.observacao_regra || "SE_NOK";
    if (record.status_item === undefined) record.status_item = "";
    return record;
  }

  function saveDb(db) {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(db));
  }

  function sanitizeUser(user) {
    const copy = clone(user);
    delete copy.senha_hash;
    delete copy.token;
    return copy;
  }

  function publicUser(user) {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      status: user.status,
      setor: user.setor
    };
  }

  function audit(db, usuario, perfil, acao, modulo, registroId, antes, depois) {
    db.audit_log.push({
      id: newId("AUD"),
      usuario: usuario || "ANONIMO",
      perfil: perfil || "",
      acao,
      modulo,
      registro_id: registroId || "",
      antes: antes ? JSON.stringify(antes) : "",
      depois: depois ? JSON.stringify(depois) : "",
      data_hora: nowIso()
    });
  }

  function addHistorico(db, os, acao, usuario, resumo) {
    db.historico.push({
      id: newId("HIS"),
      os_id: os.id,
      ativo_id: os.ativo_id,
      acao,
      usuario,
      data_hora: nowIso(),
      resumo
    });
  }

  function addEvento(db, osId, tipo, usuario, resumo) {
    db.eventos.push({
      id: newId("EVT"),
      os_id: osId,
      tipo,
      usuario,
      resumo,
      data_hora: nowIso()
    });
  }

  function requireSession(db, payload) {
    const token = payload && payload.token;
    const user = db.usuarios.find((item) => item.token && item.token === token && item.status === "ATIVO");
    if (!user) {
      const err = new Error("Sessao invalida. Faca login novamente.");
      err.status = 401;
      throw err;
    }
    return user;
  }

  function getPermissionMatrix(db) {
    const matrix = db.permissoes || {};
    ["Operador", "Gestor", "Admin"].forEach((perfil) => {
      matrix[perfil] = matrix[perfil] || {};
      PERMISSION_DEFINITIONS.forEach((item) => {
        if (matrix[perfil][item.chave] === undefined) {
          matrix[perfil][item.chave] = Boolean(PERMISSOES[perfil] && PERMISSOES[perfil][item.chave]);
        }
      });
    });
    PERMISSION_DEFINITIONS.forEach((item) => {
      matrix.Admin[item.chave] = true;
    });
    db.permissoes = matrix;
    return matrix;
  }

  function requirePermission(db, user, permission, modulo, registroId) {
    const matrix = getPermissionMatrix(db);
    if (!matrix[user.perfil] || !matrix[user.perfil][permission]) {
      audit(db, user.id, user.perfil, "TENTATIVA_NEGADA", modulo, registroId, "", { permission });
      const err = new Error("Acesso bloqueado: seu perfil nao possui permissao para esta acao.");
      err.status = 403;
      throw err;
    }
  }

  function menuForProfile(profile, permissions) {
    if (profile === "Admin") return MENUS.Admin.map(([id, label]) => ({ id, label }));
    const rules = {
      dashboard: ["dashboard"],
      "minhas-os": ["minhas_os"],
      "historico-pessoal": ["minhas_os"],
      comunicacoes: ["minhas_os"],
      "meu-perfil": ["login"],
      sair: ["login"],
      "qr-code": ["qr"],
      usuarios: ["criar_usuario"],
      permissoes: ["alterar_permissao"],
      cadastros: ["cadastrar_equipamento"],
      configuracoes: ["configurar_fluxo"],
      auditoria: ["ver_audit_log"],
      backup: ["backup"],
      integracoes: ["configurar_fluxo"],
      versionamento: ["backup", "ver_audit_log"],
      "relatorios-gerais": ["ver_relatorios"],
      "gestao-os": ["criar_os", "editar_os_pre_execucao", "aprovar_os", "reabrir_os"],
      programacao: ["criar_os", "editar_os_pre_execucao"],
      acompanhamento: ["aprovar_os", "reabrir_os", "ver_relatorios"],
      relatorios: ["ver_relatorios"],
      equipamentos: ["cadastrar_equipamento"],
      checklists: ["editar_checklist_padrao", "preencher_checklist"],
      "usuarios-view": ["ver_usuarios"]
    };
    return MENU_CATALOG
      .filter(([id]) => {
        const needed = rules[id] || ["login"];
        return needed.some((permission) => permissions[permission]);
      })
      .map(([id, label]) => ({ id, label }));
  }

  function getReferences(db, user) {
    const allowedUsers = user.perfil === "Operador"
      ? db.usuarios.filter((item) => item.id === user.id)
      : db.usuarios;

    return {
      setores: clone(db.setores),
      linhas: clone(db.linhas),
      equipamentos: clone(db.equipamentos),
      componentes: clone(db.componentes),
      parametros_equipamento: clone(db.parametros_equipamento || []),
      leituras_parametros: clone(db.leituras_parametros || []),
      historico_componentes: clone(db.historico_componentes || []),
      versionamento: clone(db.versionamento || []),
      plantas: clone(db.plantas || []),
      modulos: clone(getModules(db)),
      modulo_perfis: clone(getModuleProfiles(db)),
      definicoes_modulos: clone(MODULE_DEFINITIONS),
      checklist_modelos: clone(db.checklist_modelos || []),
      checklist_modelo_itens: clone(db.checklist_modelo_itens || []),
      workflow_regras: clone(getWorkflowRules(db)),
      workflow_acoes: clone(WORKFLOW_ACTIONS),
      usuarios: allowedUsers.map(sanitizeUser),
      status_fluxo: STATUS_FLUXO
    };
  }


  function getReferencesLight(db, user, orders) {
    const ativoIds = uniqueValues(orders.map((os) => os.ativo_id));
    const componenteIds = uniqueValues(orders.map((os) => os.componente_id));
    const userIds = uniqueValues(orders.map((os) => os.responsavel).concat(orders.map((os) => os.solicitante)).concat([user.id]));
    return {
      setores: [],
      linhas: [],
      equipamentos: [],
      componentes: [],
      parametros_equipamento: [],
      leituras_parametros: [],
      historico_componentes: [],
      versionamento: [],
      plantas: [],
      modulos: clone(getModules(db)),
      modulo_perfis: [],
      definicoes_modulos: clone(MODULE_DEFINITIONS),
      checklist_modelos: [],
      checklist_modelo_itens: [],
      workflow_regras: clone(getWorkflowRules(db)),
      workflow_acoes: clone(WORKFLOW_ACTIONS),
      usuarios: db.usuarios.filter((item) => user.perfil !== "Operador" || userIds.includes(item.id)).map(sanitizeUser),
      status_fluxo: STATUS_FLUXO
    };
  }

  function uniqueValues(values) {
    return Array.from(new Set(values.map((value) => String(value || "")).filter(Boolean)));
  }

  function canSeeOs(user, os) {
    if (user.perfil === "Operador") {
      return os.responsavel === user.id;
    }
    return true;
  }

  function validateChecklist(db, osId) {
    const itens = db.checklist_execucao.filter((item) => item.os_id === osId);
    const pendencias = [];
    itens.forEach((item) => {
      const itemPendencias = validateChecklistItem(item);
      itemPendencias.forEach((msg) => pendencias.push(`${item.pergunta}: ${msg}`));
    });
    return { valido: pendencias.length === 0, pendencias };
  }

  function validateChecklistItem(item) {
    normalizeChecklistRecordInPlace(item);
    const pendencias = [];
    const resposta = String(item.resposta || "").trim();
    const observacao = String(item.observacao || "").trim();
    const evidencia = String(item.evidencia || "").trim();
    const foraLimite = checklistValueOutOfRange(item);
    if (asBool(item.obrigatorio) && !resposta) pendencias.push("resposta obrigatoria pendente");
    if (item.tipo_resposta === "NUMERICO" || item.tipo_resposta === "LEITURA_TECNICA") {
      if (resposta && !Number.isFinite(Number(resposta.replace(",", ".")))) pendencias.push("valor numerico invalido");
      if (foraLimite && requiresByRule(item.observacao_regra, item)) pendencias.push("observacao obrigatoria para valor fora do limite");
    }
    if (item.resposta === "NAO_OK" && (requiresByRule(item.observacao_regra, item) || asBool(item.critico)) && !observacao) pendencias.push("observacao obrigatoria para NAO OK");
    if (item.tipo_resposta === "SELECT" && resposta === "Outro" && requiresByRule(item.observacao_regra, item) && !observacao) pendencias.push("observacao obrigatoria para opcao Outro");
    if (requiresByRule(item.evidencia_regra, item) && !evidencia) pendencias.push("evidencia obrigatoria ausente");
    if (asBool(item.critico) && item.resposta === "NAO_OK") pendencias.push("item critico NOK bloqueia finalizacao");
    item.status_item = pendencias.length ? "PENDENTE" : (foraLimite ? "ALERTA" : (resposta ? "OK" : "PENDENTE"));
    return pendencias;
  }

  function checklistValueOutOfRange(item) {
    const tipo = String(item.tipo_resposta || "OK_NOK").toUpperCase();
    if (tipo !== "NUMERICO" && tipo !== "LEITURA_TECNICA") return false;
    const resposta = String(item.resposta || "").trim();
    if (!resposta) return false;
    const value = Number(resposta.replace(",", "."));
    if (!Number.isFinite(value)) return true;
    const minRaw = String(item.valor_min || "").trim();
    const maxRaw = String(item.valor_max || "").trim();
    const min = minRaw ? Number(minRaw.replace(",", ".")) : null;
    const max = maxRaw ? Number(maxRaw.replace(",", ".")) : null;
    return (min !== null && Number.isFinite(min) && value < min) || (max !== null && Number.isFinite(max) && value > max);
  }

  function requiresByRule(rule, item) {
    const normalized = String(rule || "NUNCA").toUpperCase();
    if (normalized === "SEMPRE") return true;
    if (normalized === "SE_NOK") return item.resposta === "NAO_OK";
    if (normalized === "FORA_LIMITE") return checklistValueOutOfRange(item);
    if (normalized === "SE_OUTRO") return String(item.resposta || "") === "Outro";
    return false;
  }

  function getWorkflowRules(db) {
    if (!Array.isArray(db.workflow_regras) || !db.workflow_regras.length) {
      db.workflow_regras = workflowDefaults(nowIso());
    }
    return db.workflow_regras;
  }

  function activeWorkflowRules(db) {
    return getWorkflowRules(db).filter((item) => item.status === "ATIVO");
  }

  function findWorkflowRule(db, user, os, acao) {
    const rules = activeWorkflowRules(db).filter((item) => {
      return item.acao === acao
        && splitCsv(item.status_origem).includes(os.status)
        && splitCsv(item.perfis).includes(user.perfil);
    });
    if (!rules.length) {
      const err = new Error(`Fluxo bloqueado: nao existe regra ativa para ${acao} a partir de ${os.status} para ${user.perfil}.`);
      err.status = 422;
      throw err;
    }
    return rules[0];
  }

  function assertWorkflow(db, user, os, acao) {
    const regra = findWorkflowRule(db, user, os, acao);
    requirePermission(db, user, regra.permissao, "ordens_servico", os.id);
    if (asBool(regra.exige_responsavel) && user.perfil === "Operador" && os.responsavel !== user.id) {
      throw new Error("Fluxo bloqueado: OS nao atribuida ao operador logado.");
    }
    if (asBool(regra.exige_checklist_ok)) {
      const validacao = validateChecklist(db, os.id);
      if (!validacao.valido) {
        const err = new Error(`Fluxo bloqueado: existem ${validacao.pendencias.length} pendencias no checklist.`);
        err.status = 422;
        err.details = validacao.pendencias;
        throw err;
      }
    }
    return regra;
  }

  function splitCsv(value) {
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }

  function normalizeCsv(value) {
    return splitCsv(value).filter((item, index, arr) => arr.indexOf(item) === index);
  }

  function asBool(value) {
    return value === true || value === "true" || value === "TRUE" || value === "SIM" || value === "1" || value === "on";
  }

  function resolveChecklistModelForOs(db, tipo, explicitModelId) {
    const modelos = db.checklist_modelos || [];
    if (explicitModelId) {
      const selected = modelos.find((item) => item.id === explicitModelId);
      if (!selected || selected.status !== "ATIVO") {
        throw new Error("Nao foi possivel criar OS: modelo de checklist inexistente ou inativo.");
      }
      if (selected.tipo_os !== tipo) {
        throw new Error("Nao foi possivel criar OS: modelo de checklist nao pertence ao tipo de OS selecionado.");
      }
      return selected;
    }
    return modelos
      .filter((item) => item.tipo_os === tipo && item.status === "ATIVO")
      .sort((a, b) => String(b.criado_em || "").localeCompare(String(a.criado_em || "")) || Number(b.versao || 0) - Number(a.versao || 0))[0]
      || modelos.filter((item) => item.status === "ATIVO")
        .sort((a, b) => String(b.criado_em || "").localeCompare(String(a.criado_em || "")) || Number(b.versao || 0) - Number(a.versao || 0))[0];
  }

  function createChecklistForOs(db, os) {
    const itensModelo = db.checklist_modelo_itens || [];
    const modelo = os.checklist_modelo_id
      ? resolveChecklistModelForOs(db, os.tipo, os.checklist_modelo_id)
      : resolveChecklistModelForOs(db, os.tipo, "");
    const base = modelo
      ? itensModelo.filter((item) => item.modelo_id === modelo.id && item.status === "ATIVO").sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))
      : [
        { item_id: "IT-SEG", pergunta: "Energia bloqueada e area isolada", obrigatorio: true, evidencia_obrigatoria: false },
        { item_id: "IT-EXEC", pergunta: `${os.tipo} executada conforme instrucao`, obrigatorio: true, evidencia_obrigatoria: os.criticidade === "A" },
        { item_id: "IT-TESTE", pergunta: "Teste operacional realizado", obrigatorio: true, evidencia_obrigatoria: false }
      ];
    base.forEach((row, index) => {
      db.checklist_execucao.push(item(
        `${newId("CHK")}-${index + 1}`,
        os.id,
        row.item_id,
        row.pergunta,
        row.obrigatorio,
        "",
        "",
        "",
        row.evidencia_obrigatoria,
        "",
        "",
        row
      ));
    });
  }

  function withDataForOs(db, orders) {
    const ids = orders.map((os) => os.id);
    return {
      ordens: clone(orders),
      checklist: clone(db.checklist_execucao.filter((item) => ids.includes(item.os_id))),
      historico: clone(db.historico.filter((item) => ids.includes(item.os_id))),
      eventos: clone(db.eventos.filter((item) => ids.includes(item.os_id))),
      anexos: clone(db.anexos.filter((item) => ids.includes(item.os_id)))
    };
  }

  function ok(data) {
    return Promise.resolve({ ok: true, data });
  }

  function fail(error) {
    return Promise.resolve({
      ok: false,
      status: error.status || 400,
      error: {
        message: error.message || "Nao foi possivel concluir a acao.",
        details: error.details || []
      }
    });
  }

  async function request(action, payload) {
    const db = getDb();
    try {
      let result;
      if (action === "auth.login") result = authLogin(db, payload);
      else if (action === "sistema.bootstrap") result = sistemaBootstrap(db, payload);
      else if (action === "os.listar") result = osListar(db, payload);
      else if (action === "os.criar") result = osCriar(db, payload);
      else if (action === "os.iniciar") result = osIniciar(db, payload);
      else if (action === "checklist.salvar") result = checklistSalvar(db, payload);
      else if (action === "os.finalizar_execucao") result = osFinalizarExecucao(db, payload);
      else if (action === "os.aprovar") result = osAprovar(db, payload);
      else if (action === "parametros.registrar_leitura") result = parametroRegistrarLeitura(db, payload);
      else if (action === "componentes.registrar_evento") result = componenteRegistrarEvento(db, payload);
      else if (action === "usuarios.salvar") result = usuariosSalvar(db, payload);
      else if (action === "permissoes.listar") result = permissoesListar(db, payload);
      else if (action === "permissoes.salvar") result = permissoesSalvar(db, payload);
      else if (action === "modulos.salvar") result = modulosSalvar(db, payload);
      else if (action === "cadastros.salvar") result = cadastrosSalvar(db, payload);
      else if (action === "checklist_modelo.salvar") result = checklistModeloSalvar(db, payload);
      else if (action === "workflow.salvar") result = workflowSalvar(db, payload);
      else if (action === "logs.listar") result = logsListar(db, payload);
      else {
        const err = new Error("Endpoint logico nao reconhecido pelo blueprint.");
        err.status = 404;
        throw err;
      }
      saveDb(db);
      return ok(result);
    } catch (error) {
      saveDb(db);
      return fail(error);
    }
  }

  function authLogin(db, payload) {
    const email = String(payload.email || "").trim().toLowerCase();
    const senha = String(payload.senha || payload.password || "");
    const user = db.usuarios.find((item) => item.email.toLowerCase() === email && item.status === "ATIVO");
    if (!user || user.senha_hash !== senha) {
      audit(db, "", "", "LOGIN_NEGADO", "auth", email, "", { email });
      const err = new Error("Login negado: verifique usuario, senha e status do cadastro.");
      err.status = 401;
      throw err;
    }

    user.token = `LOCAL-${user.id}-${Date.now()}`;
    audit(db, user.id, user.perfil, "LOGIN", "auth", user.id, "", { email: user.email });
    const matrix = getPermissionMatrix(db);
    const permissions = matrix[user.perfil] || {};

    return {
      token: user.token,
      usuario: publicUser(user),
      perfil: user.perfil,
      permissoes: clone(permissions),
      matriz_permissoes: clone(matrix),
      definicoes_permissoes: clone(PERMISSION_DEFINITIONS),
      definicoes_modulos: clone(MODULE_DEFINITIONS),
      menu: menuForProfile(user.perfil, permissions)
    };
  }

  function sistemaBootstrap(db, payload) {
    const user = requireSession(db, payload);
    const matrix = getPermissionMatrix(db);
    const permissions = matrix[user.perfil] || {};
    return {
      token: user.token,
      usuario: publicUser(user),
      perfil: user.perfil,
      permissoes: clone(permissions),
      menu: menuForProfile(user.perfil, permissions),
      modulos_liberados: getModuleProfiles(db).filter((item) => item.perfil === user.perfil && String(item.status || "ATIVO") === "ATIVO").map((item) => item.modulo_id),
      versao_ativa: "2.0.0",
      ambiente: { runtime: "Mock local", api: "SCS OS Control SaaS", carregamento: "bootstrap-minimo" }
    };
  }

  function osListar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "minhas_os", "ordens_servico", "");
    const limit = clampInt(payload.limit, 30, 1, 100);
    const offset = clampInt(payload.offset, 0, 0, 1000000);
    const include = String(payload.include || "resumo").toLowerCase();
    const includeFull = include.includes("completo") || include.includes("detalhe");
    const includeRefs = include.includes("referencias");

    let allOrders = db.ordens_servico.filter((os) => canSeeOs(user, os));
    if (payload.id_os || payload.id) {
      const id = String(payload.id_os || payload.id);
      allOrders = allOrders.filter((os) => os.id === id);
    }
    if (payload.status) allOrders = allOrders.filter((os) => os.status === payload.status);
    if (payload.responsavel) allOrders = allOrders.filter((os) => os.responsavel === payload.responsavel);
    if (payload.ativo_id) allOrders = allOrders.filter((os) => os.ativo_id === payload.ativo_id);
    if (payload.perfil) {
      const ids = db.usuarios.filter((item) => item.perfil === payload.perfil).map((item) => item.id);
      allOrders = allOrders.filter((os) => ids.includes(os.responsavel) || ids.includes(os.solicitante));
    }
    if (payload.setor) {
      const assetIds = db.equipamentos.filter((item) => item.setor_id === payload.setor).map((item) => item.id);
      allOrders = allOrders.filter((os) => assetIds.includes(os.ativo_id));
    }

    allOrders = allOrders.slice().sort((a, b) => String(b.criado_em || b.prazo || b.id).localeCompare(String(a.criado_em || a.prazo || a.id)));
    const orders = allOrders.slice(offset, offset + limit);
    const ids = orders.map((os) => os.id);
    const response = {
      ordens: clone(orders),
      checklist: [],
      historico: [],
      eventos: [],
      anexos: [],
      referencias: getReferencesLight(db, user, orders),
      dashboard: buildDashboard(db, user, allOrders),
      paginacao: { limit, offset, total: allOrders.length, returned: orders.length },
      include
    };
    if (includeFull || include.includes("checklist")) response.checklist = clone(db.checklist_execucao.filter((item) => ids.includes(item.os_id)));
    if (includeFull || include.includes("historico")) response.historico = clone(db.historico.filter((item) => ids.includes(item.os_id)));
    if (includeFull || include.includes("eventos")) response.eventos = clone(db.eventos.filter((item) => ids.includes(item.os_id)));
    if (includeFull || include.includes("anexos")) response.anexos = clone(db.anexos.filter((item) => ids.includes(item.os_id)));
    if (includeRefs) response.referencias = getReferences(db, user);
    return response;
  }

  function clampInt(value, fallback, min, max) {
    const parsed = parseInt(value, 10);
    const safe = Number.isNaN(parsed) ? fallback : parsed;
    return Math.max(min, Math.min(max, safe));
  }

  function osCriar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "criar_os", "ordens_servico", "");

    const ativo = db.equipamentos.find((item) => item.id === payload.ativo_id);
    if (!ativo) throw new Error("Nao foi possivel criar OS: equipamento obrigatorio nao encontrado.");
    if (ativo.status !== "ATIVO") throw new Error("Nao foi possivel criar OS: equipamento inativo permite apenas consulta de historico.");
    if (!payload.prioridade) throw new Error("Nao foi possivel criar OS: prioridade obrigatoria.");
    if (ativo.criticidade === "A" && !payload.responsavel) {
      throw new Error("Nao foi possivel liberar OS de criticidade A sem responsavel definido.");
    }

    const componente = payload.componente_id
      ? db.componentes.find((item) => item.id === payload.componente_id && item.equipamento_id === ativo.id)
      : null;
    if (payload.componente_id && !componente) {
      throw new Error("Nao foi possivel criar OS: componente nao pertence ao equipamento selecionado.");
    }

    const liberar = payload.modo === "LIBERAR";
    const status = liberar ? "LIBERADA" : (payload.modo === "RASCUNHO" ? "RASCUNHO" : "PLANEJADA");
    if (status === "LIBERADA" && !payload.responsavel) {
      throw new Error("Nao foi possivel liberar OS sem responsavel definido.");
    }

    const tipoOs = payload.tipo || "Corretiva";
    const checklistModelo = resolveChecklistModelForOs(db, tipoOs, payload.checklist_modelo_id || "");

    const os = {
      id: newId("OS"),
      ativo_id: ativo.id,
      componente_id: componente ? componente.id : "",
      tipo: tipoOs,
      checklist_modelo_id: checklistModelo ? checklistModelo.id : "",
      prioridade: payload.prioridade,
      criticidade: ativo.criticidade,
      status,
      solicitante: user.id,
      responsavel: payload.responsavel || "",
      prazo: payload.prazo || "",
      descricao: payload.descricao || "",
      instrucoes: payload.instrucoes || "",
      criado_em: nowIso(),
      iniciado_em: "",
      finalizado_em: "",
      aprovado_em: ""
    };

    db.ordens_servico.push(os);
    createChecklistForOs(db, os);
    addHistorico(db, os, "CRIAR_OS", user.id, `OS criada com status ${status}.`);
    audit(db, user.id, user.perfil, "CRIAR_OS", "ordens_servico", os.id, "", os);

    return { id_os: os.id, status_inicial: status, os: clone(os) };
  }

  function osIniciar(db, payload) {
    const user = requireSession(db, payload);

    const os = db.ordens_servico.find((item) => item.id === payload.id_os);
    if (!os) throw new Error("Nao foi possivel iniciar: OS nao encontrada.");
    const regra = assertWorkflow(db, user, os, "INICIAR_OS");

    const antes = clone(os);
    os.status = regra.status_destino;
    os.iniciado_em = nowIso();
    addHistorico(db, os, "INICIAR_OS", user.id, "Execucao iniciada.");
    addEvento(db, os.id, "STATUS", user.id, `Status alterado para ${regra.status_destino}.`);
    audit(db, user.id, user.perfil, "INICIAR_OS", "ordens_servico", os.id, antes, os);
    return { id_os: os.id, status: os.status };
  }

  function checklistSalvar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "preencher_checklist", "checklist_execucao", payload.id_checklist);

    const checklist = db.checklist_execucao.find((item) => item.id === payload.id_checklist);
    if (!checklist) throw new Error("Nao foi possivel salvar checklist: item nao encontrado.");
    const os = db.ordens_servico.find((item) => item.id === checklist.os_id);
    if (!os) throw new Error("Nao foi possivel salvar checklist: OS nao encontrada.");
    if (os.status !== "EM_EXECUCAO") throw new Error("Nao foi possivel salvar checklist: OS precisa estar EM_EXECUCAO.");
    if (user.perfil === "Operador" && os.responsavel !== user.id) {
      throw new Error("Nao foi possivel salvar checklist: OS nao atribuida ao operador logado.");
    }

    const resposta = String(payload.resposta || "").trim();
    const antes = clone(checklist);
    checklist.resposta = resposta;
    checklist.observacao = payload.observacao || "";
    checklist.evidencia = payload.evidencia || "";
    checklist.responsavel = user.id;
    checklist.data_hora = nowIso();
    normalizeChecklistRecordInPlace(checklist);
    const itemPendencias = validateChecklistItem(checklist);
    const bloqueantes = itemPendencias.filter(function (msg) { return msg.indexOf("evidencia") >= 0 || msg.indexOf("obrigatoria") >= 0 || msg.indexOf("invalido") >= 0; });
    if (bloqueantes.length) throw new Error("Nao foi possivel salvar checklist: " + bloqueantes.join("; "));

    if (payload.evidencia) {
      const exists = db.anexos.some((item) => item.os_id === os.id && item.checklist_id === checklist.id && item.nome === payload.evidencia);
      if (!exists) {
        db.anexos.push({
          id: newId("ANX"),
          os_id: os.id,
          checklist_id: checklist.id,
          nome: payload.evidencia,
          usuario: user.id,
          data_hora: nowIso()
        });
      }
    }

    const validacao = validateChecklist(db, os.id);
    addEvento(db, os.id, "CHECKLIST", user.id, `Item ${checklist.item_id} salvo.`);
    audit(db, user.id, user.perfil, "SALVAR_CHECKLIST", "checklist_execucao", checklist.id, antes, checklist);
    return { item: clone(checklist), validacao };
  }

  function osFinalizarExecucao(db, payload) {
    const user = requireSession(db, payload);

    const os = db.ordens_servico.find((item) => item.id === payload.id_os);
    if (!os) throw new Error("Nao foi possivel finalizar: OS nao encontrada.");
    const regra = assertWorkflow(db, user, os, "FINALIZAR_EXECUCAO");

    const antes = clone(os);
    os.status = regra.status_destino;
    os.finalizado_em = nowIso();
    addHistorico(db, os, "FINALIZAR_EXECUCAO", user.id, "Execucao enviada para aprovacao.");
    addEvento(db, os.id, "STATUS", user.id, `Status alterado para ${regra.status_destino}.`);
    audit(db, user.id, user.perfil, "FINALIZAR_EXECUCAO", "ordens_servico", os.id, antes, os);
    return { id_os: os.id, status: os.status };
  }

  function osAprovar(db, payload) {
    const user = requireSession(db, payload);

    const os = db.ordens_servico.find((item) => item.id === payload.id_os);
    if (!os) throw new Error("Nao foi possivel aprovar: OS nao encontrada.");

    const decisao = payload.decisao === "REABRIR" ? "REABRIR" : "APROVAR";
    if (decisao === "REABRIR") {
      if (!String(payload.justificativa || "").trim()) {
        throw new Error("Nao foi possivel reabrir: justificativa obrigatoria.");
      }
      const regra = assertWorkflow(db, user, os, "REABRIR_OS");
      const antes = clone(os);
      os.status = regra.status_destino;
      addHistorico(db, os, "REABRIR_OS", user.id, payload.justificativa);
      addEvento(db, os.id, "STATUS", user.id, "OS reaberta para correcao.");
      audit(db, user.id, user.perfil, "REABRIR_OS", "ordens_servico", os.id, antes, os);
      return { id_os: os.id, status: os.status };
    }

    const regra = assertWorkflow(db, user, os, "APROVAR_OS");
    const antes = clone(os);

    os.status = regra.status_destino;
    os.aprovado_em = nowIso();
    addHistorico(db, os, "APROVAR_OS", user.id, "Execucao aprovada.");
    addEvento(db, os.id, "STATUS", user.id, `Status alterado para ${regra.status_destino}.`);
    audit(db, user.id, user.perfil, "APROVAR_OS", "ordens_servico", os.id, antes, os);
    return { id_os: os.id, status: os.status };
  }

  function parametroRegistrarLeitura(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "qr", "parametros_equipamento", payload.parametro_id || "");

    const equipamento = db.equipamentos.find((item) => item.id === payload.equipamento_id);
    if (!equipamento) throw new Error("Nao foi possivel registrar leitura: equipamento nao encontrado.");
    if (equipamento.status !== "ATIVO") throw new Error("Nao foi possivel registrar leitura: equipamento inativo permite apenas consulta.");

    const parametro = db.parametros_equipamento.find((item) => item.id === payload.parametro_id);
    if (!parametro) throw new Error("Nao foi possivel registrar leitura: parametro nao encontrado.");
    if (parametro.equipamento_id !== equipamento.id) throw new Error("Nao foi possivel registrar leitura: parametro nao pertence ao equipamento informado.");

    const valor = normalizeReadingValue(payload.valor);
    const statusOperacional = calculateParameterStatus(parametro, valor);
    const before = clone(parametro);
    const leitura = {
      id: newId("LEI"),
      parametro_id: parametro.id,
      equipamento_id: equipamento.id,
      valor,
      unidade: parametro.unidade || "",
      data_hora: nowIso(),
      origem: user.perfil === "Operador" ? "OPERADOR" : user.perfil.toUpperCase()
    };

    parametro.valor = valor;
    parametro.status_operacional = statusOperacional;
    parametro.atualizado_em = leitura.data_hora;
    db.leituras_parametros.push(leitura);

    audit(db, user.id, user.perfil, "REGISTRAR_LEITURA_PARAMETRO", "parametros_equipamento", parametro.id, before, {
      parametro: clone(parametro),
      leitura,
      observacao: String(payload.observacao || "").trim()
    });

    return {
      equipamento_id: equipamento.id,
      parametro: clone(parametro),
      leitura: clone(leitura),
      status_operacional: statusOperacional
    };
  }

  function componenteRegistrarEvento(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "qr", "historico_componentes", payload.componente_id || "");

    const equipamento = db.equipamentos.find((item) => item.id === payload.equipamento_id);
    if (!equipamento) throw new Error("Nao foi possivel registrar componente: equipamento nao encontrado.");
    if (equipamento.status !== "ATIVO") throw new Error("Nao foi possivel registrar componente: equipamento inativo permite apenas consulta.");

    const componente = db.componentes.find((item) => item.id === payload.componente_id);
    if (!componente) throw new Error("Nao foi possivel registrar componente: componente nao encontrado.");
    if (componente.equipamento_id !== equipamento.id) throw new Error("Nao foi possivel registrar componente: componente nao pertence ao equipamento informado.");

    const acao = String(payload.acao || "").trim().toUpperCase();
    const allowedActions = ["INSPECAO", "AJUSTE", "TROCA", "BLOQUEIO"];
    if (!allowedActions.includes(acao)) throw new Error("Nao foi possivel registrar componente: acao invalida.");

    const descricao = String(payload.descricao || "").trim();
    if (!descricao) throw new Error("Nao foi possivel registrar componente: descricao tecnica obrigatoria.");

    const before = clone(componente);
    const evento = {
      id: newId("HCOMP"),
      componente_id: componente.id,
      equipamento_id: equipamento.id,
      acao,
      descricao,
      vida_util_h: normalizeOptionalReadingValue(payload.vida_util_h, "vida util"),
      horimetro_evento: normalizeOptionalReadingValue(payload.horimetro_evento, "horimetro"),
      usuario: user.id,
      data_hora: nowIso()
    };

    if (acao === "BLOQUEIO") componente.status = "BLOQUEADO";
    if (acao === "AJUSTE" || acao === "TROCA") componente.status = "ATIVO";

    db.historico_componentes.push(evento);
    audit(db, user.id, user.perfil, "REGISTRAR_EVENTO_COMPONENTE", "historico_componentes", evento.id, before, {
      componente: clone(componente),
      evento: clone(evento)
    });

    return {
      equipamento_id: equipamento.id,
      componente: clone(componente),
      evento: clone(evento)
    };
  }

  function usuariosSalvar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "criar_usuario", "usuarios", payload.id || "");

    const perfil = payload.perfil;
    if (!["Operador", "Gestor", "Admin"].includes(perfil)) {
      throw new Error("Nao foi possivel salvar usuario: perfil invalido.");
    }
    if (!payload.nome || !payload.email || !payload.status) {
      throw new Error("Nao foi possivel salvar usuario: nome, email, perfil e status sao obrigatorios.");
    }

    let target = payload.id ? db.usuarios.find((item) => item.id === payload.id) : null;
    const antes = target ? clone(target) : "";
    if (!target) {
      target = {
        id: newId("USR"),
        nome: "",
        email: "",
        senha_hash: payload.senha || "123456",
        token: "",
        perfil,
        status: "ATIVO",
        setor: "",
        criado_em: nowIso()
      };
      db.usuarios.push(target);
    }

    target.nome = payload.nome;
    target.email = payload.email;
    target.perfil = perfil;
    target.status = payload.status;
    target.setor = payload.setor || "";
    if (payload.senha) target.senha_hash = payload.senha;

    audit(db, user.id, user.perfil, "SALVAR_USUARIO", "usuarios", target.id, antes, target);
    return { usuario: sanitizeUser(target) };
  }

  function permissoesListar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "alterar_permissao", "permissoes", "");
    return {
      matriz: clone(getPermissionMatrix(db)),
      definicoes: clone(PERMISSION_DEFINITIONS)
    };
  }

  function permissoesSalvar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "alterar_permissao", "permissoes", "");
    const motivo = String(payload.motivo || "").trim();
    if (!motivo) {
      throw new Error("Nao foi possivel salvar permissoes: motivo obrigatorio.");
    }

    const before = clone(getPermissionMatrix(db));
    const next = normalizePermissionMatrix(payload.matriz || {});
    db.permissoes = next;
    audit(db, user.id, user.perfil, "SALVAR_PERMISSOES", "permissoes", "acessos", before, { motivo, matriz: next });
    return {
      matriz: clone(next),
      definicoes: clone(PERMISSION_DEFINITIONS)
    };
  }

  function normalizePermissionMatrix(input) {
    const matrix = { Operador: {}, Gestor: {}, Admin: {} };
    ["Operador", "Gestor", "Admin"].forEach((perfil) => {
      PERMISSION_DEFINITIONS.forEach((item) => {
        matrix[perfil][item.chave] = perfil === "Admin"
          ? true
          : Boolean(input[perfil] && input[perfil][item.chave]);
      });
    });
    matrix.Operador.login = true;
    matrix.Operador.dashboard = true;
    matrix.Gestor.login = true;
    matrix.Gestor.dashboard = true;
    return matrix;
  }

  function getModules(db) {
    if (!Array.isArray(db.modulos) || !db.modulos.length) db.modulos = moduleSeedRows(nowIso());
    return db.modulos;
  }

  function getModuleProfiles(db) {
    if (!Array.isArray(db.modulo_perfis) || !db.modulo_perfis.length) db.modulo_perfis = moduleProfileSeedRows(nowIso());
    return db.modulo_perfis;
  }

  function modulosSalvar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "alterar_permissao", "modulos", "");
    const motivo = String(payload.motivo || "").trim();
    if (!motivo) throw new Error("Nao foi possivel salvar modulos: motivo obrigatorio.");

    const before = {
      modulos: clone(getModules(db)),
      modulo_perfis: clone(getModuleProfiles(db)),
      matriz: clone(getPermissionMatrix(db))
    };
    const normalized = normalizeModulePayload(payload.modulos || []);
    db.modulos = normalized.modulos;
    db.modulo_perfis = normalized.modulo_perfis;
    db.permissoes = permissionsFromModules(db);
    audit(db, user.id, user.perfil, "SALVAR_MODULOS", "modulos", "painel-admin", before, { motivo, modulos: db.modulos, modulo_perfis: db.modulo_perfis, matriz: db.permissoes });
    return {
      modulos: clone(db.modulos),
      modulo_perfis: clone(db.modulo_perfis),
      definicoes_modulos: clone(MODULE_DEFINITIONS),
      matriz: clone(db.permissoes),
      definicoes: clone(PERMISSION_DEFINITIONS)
    };
  }

  function normalizeModulePayload(input) {
    const byId = {};
    (Array.isArray(input) ? input : []).forEach((item) => {
      if (item && item.id) byId[item.id] = item;
    });
    const date = nowIso();
    const modulos = [];
    const moduloPerfis = [];
    MODULE_DEFINITIONS.forEach((definition, index) => {
      const row = byId[definition.id] || {};
      const status = row.status === "INATIVO" ? "INATIVO" : "ATIVO";
      modulos.push({
        id: definition.id,
        nome: row.nome || definition.nome,
        descricao: row.descricao || definition.descricao,
        menu_ids: definition.menu_ids.join(","),
        permissoes: definition.permissoes.join(","),
        status,
        ordem: index + 1,
        atualizado_em: date
      });
      const profileInput = row.perfis || {};
      ["Operador", "Gestor", "Admin"].forEach((profile) => {
        const profileRow = profileInput[profile] || {};
        const blocked = Array.isArray(profileRow.permissoes_bloqueadas)
          ? profileRow.permissoes_bloqueadas.filter((permission) => definition.permissoes.includes(permission))
          : splitCsv(profileRow.permissoes_bloqueadas).filter((permission) => definition.permissoes.includes(permission));
        moduloPerfis.push(moduleProfileRow(
          definition.id,
          profile,
          profile === "Admin" ? true : Boolean(profileRow.liberado),
          blocked.join(","),
          date
        ));
      });
    });
    return { modulos, modulo_perfis: moduloPerfis };
  }

  function permissionsFromModules(db) {
    const matrix = { Operador: {}, Gestor: {}, Admin: {} };
    PERMISSION_DEFINITIONS.forEach((item) => {
      matrix.Operador[item.chave] = false;
      matrix.Gestor[item.chave] = false;
      matrix.Admin[item.chave] = true;
    });
    getModules(db).filter((module) => module.status === "ATIVO").forEach((module) => {
      const permissions = splitCsv(module.permissoes);
      ["Operador", "Gestor", "Admin"].forEach((profile) => {
        const access = getModuleProfiles(db).find((item) => item.modulo_id === module.id && item.perfil === profile);
        if (!access || !asBool(access.liberado)) return;
        const blocked = splitCsv(access.permissoes_bloqueadas);
        permissions.forEach((permission) => {
          if (profile === "Admin" || !blocked.includes(permission)) matrix[profile][permission] = true;
        });
      });
    });
    matrix.Operador.login = true;
    matrix.Operador.dashboard = true;
    matrix.Gestor.login = true;
    matrix.Gestor.dashboard = true;
    return matrix;
  }

  function cadastrosSalvar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "cadastrar_equipamento", "cadastros", payload.entidade || "");
    const entidade = payload.entidade;
    if (entidade === "planta") return salvarPlanta(db, user, payload);
    if (entidade === "setor") return salvarSetor(db, user, payload);
    if (entidade === "linha") return salvarLinha(db, user, payload);
    if (entidade === "equipamento") return salvarEquipamento(db, user, payload);
    if (entidade === "componente") return salvarComponente(db, user, payload);
    throw new Error("Cadastro nao reconhecido.");
  }

  function salvarPlanta(db, user, payload) {
    if (!payload.nome || !payload.status) throw new Error("Nao foi possivel salvar planta: nome e status sao obrigatorios.");
    const record = {
      id: payload.id || newId("PLT"),
      nome: payload.nome,
      cnpj: payload.cnpj || "",
      cidade: payload.cidade || "",
      uf: payload.uf || "",
      status: payload.status
    };
    upsertById(db.plantas, record);
    audit(db, user.id, user.perfil, "SALVAR_PLANTA", "plantas", record.id, "", record);
    return { entidade: "planta", registro: clone(record) };
  }

  function salvarSetor(db, user, payload) {
    if (!payload.nome || !payload.planta_id || !payload.status) throw new Error("Nao foi possivel salvar setor: planta, nome e status sao obrigatorios.");
    if (!db.plantas.some((item) => item.id === payload.planta_id)) throw new Error("Nao foi possivel salvar setor: planta inexistente.");
    const record = { id: payload.id || newId("SET"), planta_id: payload.planta_id, nome: payload.nome, responsavel: payload.responsavel || "", status: payload.status };
    upsertById(db.setores, record);
    audit(db, user.id, user.perfil, "SALVAR_SETOR", "setores", record.id, "", record);
    return { entidade: "setor", registro: clone(record) };
  }

  function salvarLinha(db, user, payload) {
    if (!payload.nome || !payload.setor_id || !payload.status) throw new Error("Nao foi possivel salvar linha: setor, nome e status sao obrigatorios.");
    if (!db.setores.some((item) => item.id === payload.setor_id)) throw new Error("Nao foi possivel salvar linha: setor inexistente.");
    const record = { id: payload.id || newId("LIN"), setor_id: payload.setor_id, nome: payload.nome, capacidade: payload.capacidade || "", status: payload.status };
    upsertById(db.linhas, record);
    audit(db, user.id, user.perfil, "SALVAR_LINHA", "linhas", record.id, "", record);
    return { entidade: "linha", registro: clone(record) };
  }

  function salvarEquipamento(db, user, payload) {
    if (!payload.nome || !payload.setor_id || !payload.linha_id || !payload.tipo || !payload.criticidade || !payload.status) {
      throw new Error("Nao foi possivel salvar equipamento: nome, setor, linha, tipo, criticidade e status sao obrigatorios.");
    }
    if (!db.setores.some((item) => item.id === payload.setor_id)) throw new Error("Nao foi possivel salvar equipamento: setor inexistente.");
    if (!db.linhas.some((item) => item.id === payload.linha_id && item.setor_id === payload.setor_id)) throw new Error("Nao foi possivel salvar equipamento: linha nao pertence ao setor.");
    const id = payload.id || newId("EQ");
    const record = {
      id,
      nome: payload.nome,
      setor_id: payload.setor_id,
      linha_id: payload.linha_id,
      tipo: payload.tipo,
      fabricante: payload.fabricante || "",
      modelo: payload.modelo || "",
      numero_serie: payload.numero_serie || "",
      data_instalacao: payload.data_instalacao || "",
      horimetro_atual: payload.horimetro_atual || "",
      descricao: payload.descricao || "",
      criticidade: payload.criticidade,
      qr_code: payload.qr_code || `SCS://${id}`,
      status: payload.status
    };
    upsertById(db.equipamentos, record);
    audit(db, user.id, user.perfil, "SALVAR_EQUIPAMENTO", "equipamentos", record.id, "", record);
    return { entidade: "equipamento", registro: clone(record) };
  }

  function salvarComponente(db, user, payload) {
    if (!payload.nome || !payload.equipamento_id || !payload.tipo || !payload.criticidade || !payload.status) {
      throw new Error("Nao foi possivel salvar componente: equipamento, nome, tipo, criticidade e status sao obrigatorios.");
    }
    if (!db.equipamentos.some((item) => item.id === payload.equipamento_id)) throw new Error("Nao foi possivel salvar componente: equipamento inexistente.");
    const record = {
      id: payload.id || newId("CMP"),
      equipamento_id: payload.equipamento_id,
      nome: payload.nome,
      tipo: payload.tipo,
      criticidade: payload.criticidade,
      status: payload.status
    };
    upsertById(db.componentes, record);
    audit(db, user.id, user.perfil, "SALVAR_COMPONENTE", "componentes", record.id, "", record);
    return { entidade: "componente", registro: clone(record) };
  }

  function checklistModeloSalvar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "editar_checklist_padrao", "checklist_modelos", payload.id || "");
    const itens = Array.isArray(payload.itens) ? payload.itens.filter((item) => String(item.pergunta || "").trim()) : [];
    if (!payload.nome || !payload.tipo_os || !payload.versao || !payload.status) {
      throw new Error("Nao foi possivel salvar modelo: nome, tipo, versao e status sao obrigatorios.");
    }
    if (!itens.length) throw new Error("Nao foi possivel salvar modelo: ao menos um item e obrigatorio.");

    const modelo = {
      id: payload.id || newId("MDL"),
      nome: payload.nome,
      tipo_os: payload.tipo_os,
      versao: payload.versao,
      status: payload.status,
      criado_por: user.id,
      criado_em: nowIso()
    };
    upsertById(db.checklist_modelos, modelo);
    db.checklist_modelo_itens = (db.checklist_modelo_itens || []).filter((item) => item.modelo_id !== modelo.id);
    itens.forEach((input, index) => {
      const evidenciaRegra = input.evidencia_regra || (input.evidencia_obrigatoria ? "SEMPRE" : "SE_NOK");
      db.checklist_modelo_itens.push(modelItem(
        input.id || `${newId("MIT")}-${index + 1}`,
        modelo.id,
        input.item_id || `IT-${index + 1}`,
        input.pergunta,
        Boolean(input.obrigatorio),
        evidenciaRegra === "SEMPRE",
        index + 1,
        "ATIVO",
        input
      ));
    });
    audit(db, user.id, user.perfil, "SALVAR_MODELO_CHECKLIST", "checklist_modelos", modelo.id, "", { modelo, itens });
    return { modelo: clone(modelo), itens: clone(db.checklist_modelo_itens.filter((item) => item.modelo_id === modelo.id)) };
  }

  function workflowSalvar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "configurar_fluxo", "workflow_regras", "");
    const input = Array.isArray(payload.regras) ? payload.regras : [];
    if (!input.length) throw new Error("Nao foi possivel salvar fluxo: informe ao menos uma regra ativa.");

    const before = clone(getWorkflowRules(db));
    const validPermissions = new Set(PERMISSION_DEFINITIONS.map((item) => item.chave));
    const validActions = new Set(WORKFLOW_ACTIONS.map((item) => item.acao));
    const normalized = input.map((row, index) => {
      const acao = String(row.acao || "").trim();
      const statusOrigem = normalizeCsv(row.status_origem).join(",");
      const origemList = splitCsv(statusOrigem);
      const statusDestino = String(row.status_destino || "").trim();
      const permissao = String(row.permissao || "").trim();
      const perfis = normalizeCsv(row.perfis).filter((perfil) => ["Operador", "Gestor", "Admin"].includes(perfil)).join(",");
      const status = row.status === "INATIVO" ? "INATIVO" : "ATIVO";

      if (!validActions.has(acao)) throw new Error(`Fluxo invalido na linha ${index + 1}: acao nao permitida.`);
      if (!origemList.length || origemList.some((item) => !STATUS_FLUXO.includes(item))) {
        throw new Error(`Fluxo invalido na linha ${index + 1}: status de origem invalido.`);
      }
      if (!STATUS_FLUXO.includes(statusDestino)) throw new Error(`Fluxo invalido na linha ${index + 1}: status destino invalido.`);
      if (!validPermissions.has(permissao)) throw new Error(`Fluxo invalido na linha ${index + 1}: permissao inexistente.`);
      if (!perfis) throw new Error(`Fluxo invalido na linha ${index + 1}: selecione ao menos um perfil.`);

      return workflowRule(
        row.id || `WFL-${acao}`,
        acao,
        row.nome || (WORKFLOW_ACTIONS.find((item) => item.acao === acao) || {}).nome || acao,
        statusOrigem,
        statusDestino,
        permissao,
        perfis,
        asBool(row.exige_responsavel),
        asBool(row.exige_checklist_ok),
        status,
        nowIso()
      );
    });

    db.workflow_regras = normalized;
    audit(db, user.id, user.perfil, "SALVAR_WORKFLOW", "workflow_regras", "fluxo-os", before, normalized);
    return { regras: clone(normalized), acoes: clone(WORKFLOW_ACTIONS), status_fluxo: clone(STATUS_FLUXO) };
  }

  function upsertById(collection, record) {
    const index = collection.findIndex((item) => item.id === record.id);
    if (index >= 0) collection[index] = record;
    else collection.push(record);
  }

  function logsListar(db, payload) {
    const user = requireSession(db, payload);
    requirePermission(db, user, "ver_audit_log", "audit_log", "");
    const logs = db.audit_log.slice().sort((a, b) => String(b.data_hora).localeCompare(String(a.data_hora)));
    return { logs: clone(logs) };
  }

  function buildDashboard(db, user, visibleOrders) {
    const orders = visibleOrders || db.ordens_servico.filter((os) => canSeeOs(user, os));
    const today = new Date().toISOString().slice(0, 10);
    const abertas = orders.filter((os) => !["CONCLUIDA", "CANCELADA"].includes(os.status)).length;
    const andamento = orders.filter((os) => os.status === "EM_EXECUCAO").length;
    const pendentes = orders.filter((os) => ["LIBERADA", "REABERTA", "AGUARDANDO_APROVACAO"].includes(os.status)).length;
    const atrasadas = orders.filter((os) => os.prazo && os.prazo < today && !["CONCLUIDA", "CANCELADA"].includes(os.status)).length;
    const backlog = orders.filter((os) => ["RASCUNHO", "PLANEJADA", "LIBERADA", "REABERTA"].includes(os.status)).length;
    const criticidadeA = orders.filter((os) => os.criticidade === "A" && !["CONCLUIDA", "CANCELADA"].includes(os.status)).length;
    const aguardandoAprovacao = orders.filter((os) => os.status === "AGUARDANDO_APROVACAO").length;
    return { abertas, andamento, pendentes, atrasadas, backlog, criticidadeA, aguardandoAprovacao };
  }

  function reset() {
    const db = seedDb();
    saveDb(db);
    return clone(db);
  }

  function exportDb() {
    return clone(getDb());
  }

  function importDb(db) {
    if (!db || !Array.isArray(db.usuarios) || !Array.isArray(db.ordens_servico) || !Array.isArray(db.audit_log)) {
      throw new Error("Backup invalido para o SCS OS Control.");
    }
    saveDb(db);
  }

  window.SCSMockApi = {
    request,
    reset,
    exportDb,
    importDb,
    PERMISSOES,
    PERMISSION_DEFINITIONS,
    MODULE_DEFINITIONS,
    WORKFLOW_ACTIONS,
    MENUS
  };
})();
