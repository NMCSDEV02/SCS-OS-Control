var SCS = (function () {
  'use strict';

  var SHEETS = {
    plantas: ['id', 'nome', 'cnpj', 'cidade', 'uf', 'status'],
    setores: ['id', 'planta_id', 'nome', 'responsavel', 'status'],
    linhas: ['id', 'setor_id', 'nome', 'capacidade', 'status'],
    equipamentos: ['id', 'nome', 'setor_id', 'linha_id', 'tipo', 'fabricante', 'modelo', 'numero_serie', 'data_instalacao', 'horimetro_atual', 'descricao', 'criticidade', 'qr_code', 'status'],
    componentes: ['id', 'equipamento_id', 'nome', 'tipo', 'criticidade', 'status'],
    parametros_equipamento: ['id', 'equipamento_id', 'nome', 'valor', 'unidade', 'limite_min', 'limite_max', 'status_operacional', 'atualizado_em'],
    leituras_parametros: ['id', 'parametro_id', 'equipamento_id', 'valor', 'unidade', 'data_hora', 'origem'],
    historico_componentes: ['id', 'componente_id', 'equipamento_id', 'acao', 'descricao', 'vida_util_h', 'horimetro_evento', 'usuario', 'data_hora'],
    usuarios: ['id', 'nome', 'email', 'senha_hash', 'token', 'perfil', 'status', 'setor', 'criado_em'],
    permissoes: ['id', 'perfil', 'chave', 'liberado', 'atualizado_em'],
    modulos: ['id', 'nome', 'descricao', 'menu_ids', 'permissoes', 'status', 'ordem', 'atualizado_em'],
    modulo_perfis: ['id', 'modulo_id', 'perfil', 'liberado', 'permissoes_bloqueadas', 'atualizado_em'],
    listas: ['id', 'tipo', 'valor', 'status'],
    config: ['id', 'chave', 'valor', 'status'],
    workflow_regras: ['id', 'acao', 'nome', 'status_origem', 'status_destino', 'permissao', 'perfis', 'exige_responsavel', 'exige_checklist_ok', 'status', 'atualizado_em'],
    checklist_modelos: ['id', 'nome', 'tipo_os', 'versao', 'status', 'criado_por', 'criado_em'],
    checklist_modelo_itens: ['id', 'modelo_id', 'item_id', 'pergunta', 'obrigatorio', 'evidencia_obrigatoria', 'ordem', 'status', 'tipo_resposta', 'unidade', 'valor_min', 'valor_max', 'valor_esperado', 'opcoes', 'critico', 'evidencia_regra', 'observacao_regra', 'status_item'],
    ordens_servico: ['id', 'ativo_id', 'componente_id', 'tipo', 'checklist_modelo_id', 'prioridade', 'criticidade', 'status', 'solicitante', 'responsavel', 'prazo', 'descricao', 'instrucoes', 'criado_em', 'iniciado_em', 'finalizado_em', 'aprovado_em'],
    checklist_execucao: ['id', 'os_id', 'item_id', 'pergunta', 'obrigatorio', 'resposta', 'observacao', 'evidencia', 'evidencia_obrigatoria', 'responsavel', 'data_hora', 'tipo_resposta', 'unidade', 'valor_min', 'valor_max', 'valor_esperado', 'opcoes', 'critico', 'evidencia_regra', 'observacao_regra', 'status_item'],
    historico: ['id', 'os_id', 'ativo_id', 'acao', 'usuario', 'data_hora', 'resumo'],
    materiais_os: ['id', 'os_id', 'material', 'quantidade', 'usuario', 'data_hora'],
    eventos: ['id', 'os_id', 'tipo', 'usuario', 'resumo', 'data_hora'],
    anexos: ['id', 'os_id', 'checklist_id', 'nome', 'usuario', 'data_hora'],
    kpis_diarios: ['id', 'data', 'indicador', 'valor'],
    dashboard_cache: ['id', 'perfil', 'usuario', 'dados_json', 'data_hora'],
    audit_log: ['id', 'usuario', 'perfil', 'acao', 'modulo', 'registro_id', 'antes', 'depois', 'data_hora'],
    sync_log: ['id', 'origem', 'status', 'resumo', 'data_hora'],
    relatorios: ['id', 'nome', 'filtro_json', 'usuario', 'data_hora'],
    versionamento: ['id', 'versao', 'titulo', 'data', 'status', 'escopo', 'endpoints', 'schema', 'observacoes']
  };

  var STATUS_FLUXO = [
    'RASCUNHO',
    'PLANEJADA',
    'LIBERADA',
    'EM_EXECUCAO',
    'AGUARDANDO_APROVACAO',
    'CONCLUIDA',
    'AGUARDANDO_PECA',
    'AGUARDANDO_LIBERACAO',
    'REABERTA',
    'CANCELADA'
  ];

  var PERMISSION_DEFINITIONS = [
    { chave: 'login', nome: 'Acessar sistema', grupo: 'Acesso' },
    { chave: 'dashboard', nome: 'Ver dashboard proprio', grupo: 'Acesso' },
    { chave: 'qr', nome: 'Ler QR Code', grupo: 'Rastreabilidade' },
    { chave: 'minhas_os', nome: 'Ver OS permitidas', grupo: 'Ordem de Servico' },
    { chave: 'criar_os', nome: 'Criar e liberar OS', grupo: 'Ordem de Servico' },
    { chave: 'editar_os_pre_execucao', nome: 'Editar OS antes da execucao', grupo: 'Ordem de Servico' },
    { chave: 'iniciar_os', nome: 'Iniciar OS', grupo: 'Execucao' },
    { chave: 'preencher_checklist', nome: 'Preencher checklist', grupo: 'Execucao' },
    { chave: 'finalizar_execucao', nome: 'Finalizar execucao', grupo: 'Execucao' },
    { chave: 'aprovar_os', nome: 'Aprovar OS', grupo: 'Gestao / PCM' },
    { chave: 'reabrir_os', nome: 'Reabrir OS', grupo: 'Gestao / PCM' },
    { chave: 'ver_relatorios', nome: 'Ver relatorios', grupo: 'Gestao / PCM' },
    { chave: 'cadastrar_equipamento', nome: 'Cadastrar equipamento', grupo: 'Cadastros' },
    { chave: 'editar_checklist_padrao', nome: 'Editar checklist padrao', grupo: 'Cadastros' },
    { chave: 'ver_usuarios', nome: 'Ver usuarios', grupo: 'Governanca' },
    { chave: 'criar_usuario', nome: 'Criar usuario', grupo: 'Governanca' },
    { chave: 'alterar_permissao', nome: 'Alterar permissoes', grupo: 'Governanca' },
    { chave: 'configurar_fluxo', nome: 'Configurar fluxo operacional', grupo: 'Governanca' },
    { chave: 'ver_audit_log', nome: 'Ver audit_log', grupo: 'Auditoria' },
    { chave: 'backup', nome: 'Backup e restauracao', grupo: 'Backup' }
  ];

  var WORKFLOW_ACTIONS = [
    { acao: 'INICIAR_OS', nome: 'Iniciar execucao', permissao: 'iniciar_os' },
    { acao: 'FINALIZAR_EXECUCAO', nome: 'Finalizar execucao', permissao: 'finalizar_execucao' },
    { acao: 'APROVAR_OS', nome: 'Aprovar OS', permissao: 'aprovar_os' },
    { acao: 'REABRIR_OS', nome: 'Reabrir OS', permissao: 'reabrir_os' }
  ];

  var PERMISSOES = {
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

  var MENUS = {
    Operador: [
      ['dashboard', 'Dashboard'],
      ['minhas-os', 'Minhas OS'],
      ['historico-pessoal', 'Historico pessoal'],
      ['comunicacoes', 'Comunicacoes'],
      ['meu-perfil', 'Meu perfil'],
      ['sair', 'Sair']
    ],
    Gestor: [
      ['dashboard', 'Dashboard'],
      ['gestao-os', 'Gestao de OS'],
      ['programacao', 'Programacao'],
      ['acompanhamento', 'Acompanhamento'],
      ['relatorios', 'Relatorios'],
      ['equipamentos', 'Equipamentos'],
      ['checklists', 'Checklists'],
      ['usuarios-view', 'Usuarios - visualizar'],
      ['meu-perfil', 'Meu perfil'],
      ['sair', 'Sair']
    ],
    Admin: [
      ['dashboard', 'Dashboard'],
      ['usuarios', 'Usuarios'],
      ['permissoes', 'Modulos'],
      ['cadastros', 'Cadastros gerais'],
      ['checklists', 'Checklists'],
      ['qr-code', 'QR Code'],
      ['configuracoes', 'Fluxos'],
      ['auditoria', 'Auditoria / Logs'],
      ['backup', 'Backup'],
      ['integracoes', 'Integracoes'],
      ['versionamento', 'Versionamento'],
      ['relatorios-gerais', 'Relatorios gerais'],
      ['sair', 'Sair']
    ]
  };

  var MENU_CATALOG = [
    ['dashboard', 'Dashboard'],
    ['minhas-os', 'Minhas OS'],
    ['gestao-os', 'Gestao de OS'],
    ['programacao', 'Programacao'],
    ['acompanhamento', 'Acompanhamento'],
    ['relatorios', 'Relatorios'],
    ['equipamentos', 'Equipamentos'],
    ['checklists', 'Checklists'],
    ['qr-code', 'QR Code'],
    ['usuarios-view', 'Usuarios - visualizar'],
    ['usuarios', 'Usuarios'],
    ['permissoes', 'Modulos'],
    ['cadastros', 'Cadastros gerais'],
    ['configuracoes', 'Fluxos'],
    ['auditoria', 'Auditoria / Logs'],
    ['backup', 'Backup'],
    ['integracoes', 'Integracoes'],
    ['versionamento', 'Versionamento'],
    ['relatorios-gerais', 'Relatorios gerais'],
    ['historico-pessoal', 'Historico pessoal'],
    ['comunicacoes', 'Comunicacoes'],
    ['meu-perfil', 'Meu perfil'],
    ['sair', 'Sair']
  ];

  var MODULE_DEFINITIONS = [
    { id: 'painel', nome: 'Painel', descricao: 'Visao inicial e resumo operacional', menu_ids: ['dashboard'], permissoes: ['dashboard'] },
    { id: 'ordens_servico', nome: 'Ordens de Servico', descricao: 'Criacao, execucao, acompanhamento e aprovacao de OS', menu_ids: ['minhas-os', 'gestao-os', 'programacao', 'acompanhamento'], permissoes: ['minhas_os', 'criar_os', 'editar_os_pre_execucao', 'iniciar_os', 'finalizar_execucao', 'aprovar_os', 'reabrir_os'] },
    { id: 'checklists', nome: 'Checklists', descricao: 'Modelos, execucao e validacao tecnica', menu_ids: ['checklists'], permissoes: ['preencher_checklist', 'editar_checklist_padrao'] },
    { id: 'cadastros', nome: 'Cadastros', descricao: 'Plantas, setores, linhas, equipamentos e componentes', menu_ids: ['equipamentos', 'cadastros'], permissoes: ['cadastrar_equipamento'] },
    { id: 'usuarios', nome: 'Usuarios', descricao: 'Consulta, criacao e manutencao de usuarios', menu_ids: ['usuarios-view', 'usuarios'], permissoes: ['ver_usuarios', 'criar_usuario'] },
    { id: 'kpis', nome: 'KPIs', descricao: 'Backlog, atrasos, compliance e indicadores de PCM', menu_ids: ['relatorios', 'relatorios-gerais'], permissoes: ['ver_relatorios'] },
    { id: 'qr_code', nome: 'Scan QR Code', descricao: 'Leitura de QR Code por perfil e hierarquia do ativo', menu_ids: ['qr-code'], permissoes: ['qr'] },
    { id: 'fluxos', nome: 'Fluxos', descricao: 'Regras de transicao e validacoes da OS', menu_ids: ['configuracoes'], permissoes: ['configurar_fluxo'] },
    { id: 'acessos', nome: 'Modulos e acessos', descricao: 'Ativacao de modulos e liberacoes por perfil', menu_ids: ['permissoes'], permissoes: ['alterar_permissao'] },
    { id: 'auditoria', nome: 'Auditoria', descricao: 'Trilha imutavel de eventos e alteracoes', menu_ids: ['auditoria'], permissoes: ['ver_audit_log'] },
    { id: 'backup', nome: 'Backup', descricao: 'Exportacao e restauracao da base local', menu_ids: ['backup'], permissoes: ['backup'] },
    { id: 'versionamento', nome: 'Versionamento', descricao: 'Historico tecnico de versoes, endpoints e schema', menu_ids: ['versionamento'], permissoes: ['backup', 'ver_audit_log'] }
  ];

  function handleGet(e) {
    return dispatch((e && e.parameter && e.parameter.action) || '', (e && e.parameter) || {});
  }

  function handlePost(e) {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    return dispatch(body.action || '', body.payload || {});
  }

  function dispatch(action, payload) {
    try {
      var data;
      if (action === 'auth.login') data = authLogin(payload);
      else if (action === 'sistema.bootstrap') data = sistemaBootstrap(payload);
      else if (action === 'os.listar') data = osListar(payload);
      else if (action === 'os.criar') data = osCriar(payload);
      else if (action === 'os.iniciar') data = osIniciar(payload);
      else if (action === 'checklist.salvar') data = checklistSalvar(payload);
      else if (action === 'os.finalizar_execucao') data = osFinalizarExecucao(payload);
      else if (action === 'os.aprovar') data = osAprovar(payload);
      else if (action === 'parametros.registrar_leitura') data = parametroRegistrarLeitura(payload);
      else if (action === 'componentes.registrar_evento') data = componenteRegistrarEvento(payload);
      else if (action === 'usuarios.salvar') data = usuariosSalvar(payload);
      else if (action === 'permissoes.listar') data = permissoesListar(payload);
      else if (action === 'permissoes.salvar') data = permissoesSalvar(payload);
      else if (action === 'modulos.salvar') data = modulosSalvar(payload);
      else if (action === 'cadastros.salvar') data = cadastrosSalvar(payload);
      else if (action === 'checklist_modelo.salvar') data = checklistModeloSalvar(payload);
      else if (action === 'workflow.salvar') data = workflowSalvar(payload);
      else if (action === 'logs.listar') data = logsListar(payload);
      else throw apiError(404, 'Endpoint logico nao reconhecido pelo blueprint.');
      return json({ ok: true, data: data });
    } catch (error) {
      return json({
        ok: false,
        status: error.status || 400,
        error: {
          message: error.message || 'Nao foi possivel concluir a acao.',
          details: error.details || []
        }
      });
    }
  }

  function authLogin(payload) {
    var email = String(payload.email || '').trim().toLowerCase();
    var senha = String(payload.senha || payload.password || '');
    var users = readRows('usuarios');
    var user = find(users, function (item) {
      return String(item.email || '').toLowerCase() === email && item.status === 'ATIVO';
    });
    if (!user || (user.senha_hash !== hashPassword(senha) && user.senha_hash !== senha)) {
      audit('', '', 'LOGIN_NEGADO', 'auth', email, '', { email: email });
      throw apiError(401, 'Login negado: verifique usuario, senha e status do cadastro.');
    }

    user.token = 'GAS-' + Utilities.getUuid();
    updateById('usuarios', user.id, user);
    audit(user.id, user.perfil, 'LOGIN', 'auth', user.id, '', { email: user.email });
    var matrix = getPermissionMatrix();
    var permissions = matrix[user.perfil] || {};

    return {
      token: user.token,
      usuario: publicUser(user),
      perfil: user.perfil,
      permissoes: permissions,
      matriz_permissoes: matrix,
      definicoes_permissoes: PERMISSION_DEFINITIONS,
      definicoes_modulos: MODULE_DEFINITIONS,
      menu: menuForProfile(user.perfil, permissions)
    };
  }

  function sistemaBootstrap(payload) {
    var user = requireSession(payload);
    var matrix = getPermissionMatrix();
    var permissions = matrix[user.perfil] || {};
    return {
      token: user.token,
      usuario: publicUser(user),
      perfil: user.perfil,
      permissoes: permissions,
      menu: menuForProfile(user.perfil, permissions),
      modulos_liberados: enabledModulesForProfile(user.perfil),
      versao_ativa: '2.0.0',
      ambiente: {
        runtime: 'Google Apps Script',
        api: 'SCS OS Control SaaS',
        carregamento: 'bootstrap-minimo'
      }
    };
  }

  function osListar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'minhas_os', 'ordens_servico', '');

    var limit = clampInt(payload.limit, 30, 1, 100);
    var offset = clampInt(payload.offset, 0, 0, 1000000);
    var include = String(payload.include || 'resumo').toLowerCase();
    var includeFull = include.indexOf('completo') >= 0 || include.indexOf('detalhe') >= 0;
    var includeRefs = include.indexOf('referencias') >= 0;

    var allRows = readRows('ordens_servico').filter(function (os) {
      return canSeeOs(user, os);
    });
    if (payload.id_os || payload.id) {
      var targetId = String(payload.id_os || payload.id);
      allRows = allRows.filter(function (os) { return os.id === targetId; });
    }
    if (payload.status) allRows = allRows.filter(function (os) { return os.status === payload.status; });
    if (payload.responsavel) allRows = allRows.filter(function (os) { return os.responsavel === payload.responsavel; });
    if (payload.ativo_id) allRows = allRows.filter(function (os) { return os.ativo_id === payload.ativo_id; });
    if (payload.perfil) {
      var usersByPerfil = readRows('usuarios').filter(function (item) { return item.perfil === payload.perfil; }).map(function (item) { return item.id; });
      allRows = allRows.filter(function (os) { return usersByPerfil.indexOf(os.responsavel) >= 0 || usersByPerfil.indexOf(os.solicitante) >= 0; });
    }
    if (payload.setor) {
      var ativosDoSetor = readRows('equipamentos').filter(function (item) { return item.setor_id === payload.setor; }).map(function (item) { return item.id; });
      allRows = allRows.filter(function (os) { return ativosDoSetor.indexOf(os.ativo_id) >= 0; });
    }

    allRows = allRows.slice().sort(function (a, b) {
      return String(b.criado_em || b.prazo || b.id).localeCompare(String(a.criado_em || a.prazo || a.id));
    });

    var rows = allRows.slice(offset, offset + limit);
    var ids = rows.map(function (os) { return os.id; });
    var response = {
      ordens: rows,
      checklist: [],
      historico: [],
      eventos: [],
      anexos: [],
      referencias: referencesForLight(user, rows),
      dashboard: buildDashboard(user, allRows),
      paginacao: { limit: limit, offset: offset, total: allRows.length, returned: rows.length },
      include: include
    };

    if (includeFull || include.indexOf('checklist') >= 0) {
      response.checklist = readRows('checklist_execucao').filter(function (item) { return ids.indexOf(item.os_id) >= 0; });
    }
    if (includeFull || include.indexOf('historico') >= 0) {
      response.historico = readRows('historico').filter(function (item) { return ids.indexOf(item.os_id) >= 0; });
    }
    if (includeFull || include.indexOf('eventos') >= 0) {
      response.eventos = readRows('eventos').filter(function (item) { return ids.indexOf(item.os_id) >= 0; });
    }
    if (includeFull || include.indexOf('anexos') >= 0) {
      response.anexos = readRows('anexos').filter(function (item) { return ids.indexOf(item.os_id) >= 0; });
    }
    if (includeRefs) {
      response.referencias = referencesFor(user);
    }
    return response;
  }

  function clampInt(value, fallback, min, max) {
    var parsed = parseInt(value, 10);
    if (isNaN(parsed)) parsed = fallback;
    return Math.max(min, Math.min(max, parsed));
  }

  function osCriar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'criar_os', 'ordens_servico', '');

    var ativo = findById('equipamentos', payload.ativo_id);
    if (!ativo) throw apiError(400, 'Nao foi possivel criar OS: equipamento obrigatorio nao encontrado.');
    if (ativo.status !== 'ATIVO') throw apiError(400, 'Nao foi possivel criar OS: equipamento inativo permite apenas consulta de historico.');
    if (!payload.prioridade) throw apiError(400, 'Nao foi possivel criar OS: prioridade obrigatoria.');
    if (ativo.criticidade === 'A' && !payload.responsavel) {
      throw apiError(400, 'Nao foi possivel liberar OS de criticidade A sem responsavel definido.');
    }

    var componente = payload.componente_id ? findById('componentes', payload.componente_id) : null;
    if (payload.componente_id && (!componente || componente.equipamento_id !== ativo.id)) {
      throw apiError(400, 'Nao foi possivel criar OS: componente nao pertence ao equipamento selecionado.');
    }

    var status = payload.modo === 'LIBERAR' ? 'LIBERADA' : (payload.modo === 'RASCUNHO' ? 'RASCUNHO' : 'PLANEJADA');
    if (status === 'LIBERADA' && !payload.responsavel) {
      throw apiError(400, 'Nao foi possivel liberar OS sem responsavel definido.');
    }

    var tipoOs = payload.tipo || 'Corretiva';
    var checklistModelo = resolveChecklistModelForOs(tipoOs, payload.checklist_modelo_id || '');

    var os = {
      id: newId('OS'),
      ativo_id: ativo.id,
      componente_id: componente ? componente.id : '',
      tipo: tipoOs,
      checklist_modelo_id: checklistModelo ? checklistModelo.id : '',
      prioridade: payload.prioridade,
      criticidade: ativo.criticidade,
      status: status,
      solicitante: user.id,
      responsavel: payload.responsavel || '',
      prazo: payload.prazo || '',
      descricao: payload.descricao || '',
      instrucoes: payload.instrucoes || '',
      criado_em: nowIso(),
      iniciado_em: '',
      finalizado_em: '',
      aprovado_em: ''
    };

    appendRow('ordens_servico', os);
    createChecklistForOs(os);
    addHistorico(os, 'CRIAR_OS', user.id, 'OS criada com status ' + status + '.');
    audit(user.id, user.perfil, 'CRIAR_OS', 'ordens_servico', os.id, '', os);
    return { id_os: os.id, status_inicial: status, os: os };
  }

  function osIniciar(payload) {
    var user = requireSession(payload);
    var os = findById('ordens_servico', payload.id_os);
    if (!os) throw apiError(404, 'Nao foi possivel iniciar: OS nao encontrada.');
    var regra = assertWorkflow(user, os, 'INICIAR_OS');
    var antes = clone(os);
    os.status = regra.status_destino;
    os.iniciado_em = nowIso();
    updateById('ordens_servico', os.id, os);
    addHistorico(os, 'INICIAR_OS', user.id, 'Execucao iniciada.');
    addEvento(os.id, 'STATUS', user.id, 'Status alterado para ' + regra.status_destino + '.');
    audit(user.id, user.perfil, 'INICIAR_OS', 'ordens_servico', os.id, antes, os);
    return { id_os: os.id, status: os.status };
  }

  function checklistSalvar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'preencher_checklist', 'checklist_execucao', payload.id_checklist);
    var checklist = findById('checklist_execucao', payload.id_checklist);
    if (!checklist) throw apiError(404, 'Nao foi possivel salvar checklist: item nao encontrado.');
    var os = findById('ordens_servico', checklist.os_id);
    if (!os) throw apiError(404, 'Nao foi possivel salvar checklist: OS nao encontrada.');
    if (os.status !== 'EM_EXECUCAO') throw apiError(400, 'Nao foi possivel salvar checklist: OS precisa estar EM_EXECUCAO.');
    if (user.perfil === 'Operador' && os.responsavel !== user.id) {
      throw apiError(403, 'Nao foi possivel salvar checklist: OS nao atribuida ao operador logado.');
    }

    var resposta = String(payload.resposta || '').trim();
    var antes = clone(checklist);
    checklist.resposta = resposta;
    checklist.observacao = payload.observacao || '';
    checklist.evidencia = payload.evidencia || '';
    checklist.responsavel = user.id;
    checklist.data_hora = nowIso();
    normalizeChecklistRecordInPlace(checklist);
    var itemPendencias = validateChecklistItem(checklist);
    var bloqueantes = itemPendencias.filter(function (msg) {
      return msg.indexOf('evidencia') >= 0 || msg.indexOf('obrigatoria') >= 0 || msg.indexOf('invalido') >= 0;
    });
    if (bloqueantes.length) throw apiError(422, 'Nao foi possivel salvar checklist: ' + bloqueantes.join('; '));
    updateById('checklist_execucao', checklist.id, checklist);

    if (payload.evidencia) {
      var anexos = readRows('anexos');
      var exists = find(anexos, function (item) {
        return item.os_id === os.id && item.checklist_id === checklist.id && item.nome === payload.evidencia;
      });
      if (!exists) {
        appendRow('anexos', {
          id: newId('ANX'),
          os_id: os.id,
          checklist_id: checklist.id,
          nome: payload.evidencia,
          usuario: user.id,
          data_hora: nowIso()
        });
      }
    }

    var validacao = validateChecklist(os.id);
    addEvento(os.id, 'CHECKLIST', user.id, 'Item ' + checklist.item_id + ' salvo.');
    audit(user.id, user.perfil, 'SALVAR_CHECKLIST', 'checklist_execucao', checklist.id, antes, checklist);
    return { item: checklist, validacao: validacao };
  }

  function osFinalizarExecucao(payload) {
    var user = requireSession(payload);
    var os = findById('ordens_servico', payload.id_os);
    if (!os) throw apiError(404, 'Nao foi possivel finalizar: OS nao encontrada.');
    var regra = assertWorkflow(user, os, 'FINALIZAR_EXECUCAO');

    var antes = clone(os);
    os.status = regra.status_destino;
    os.finalizado_em = nowIso();
    updateById('ordens_servico', os.id, os);
    addHistorico(os, 'FINALIZAR_EXECUCAO', user.id, 'Execucao enviada para aprovacao.');
    addEvento(os.id, 'STATUS', user.id, 'Status alterado para ' + regra.status_destino + '.');
    audit(user.id, user.perfil, 'FINALIZAR_EXECUCAO', 'ordens_servico', os.id, antes, os);
    return { id_os: os.id, status: os.status };
  }

  function osAprovar(payload) {
    var user = requireSession(payload);
    var os = findById('ordens_servico', payload.id_os);
    if (!os) throw apiError(404, 'Nao foi possivel aprovar: OS nao encontrada.');

    if (payload.decisao === 'REABRIR') {
      if (!String(payload.justificativa || '').trim()) {
        throw apiError(422, 'Nao foi possivel reabrir: justificativa obrigatoria.');
      }
      var regraReabrir = assertWorkflow(user, os, 'REABRIR_OS');
      var antesReabrir = clone(os);
      os.status = regraReabrir.status_destino;
      updateById('ordens_servico', os.id, os);
      addHistorico(os, 'REABRIR_OS', user.id, payload.justificativa);
      addEvento(os.id, 'STATUS', user.id, 'OS reaberta para correcao.');
      audit(user.id, user.perfil, 'REABRIR_OS', 'ordens_servico', os.id, antesReabrir, os);
      return { id_os: os.id, status: os.status };
    }

    var regra = assertWorkflow(user, os, 'APROVAR_OS');
    var antes = clone(os);

    os.status = regra.status_destino;
    os.aprovado_em = nowIso();
    updateById('ordens_servico', os.id, os);
    addHistorico(os, 'APROVAR_OS', user.id, 'Execucao aprovada.');
    addEvento(os.id, 'STATUS', user.id, 'Status alterado para ' + regra.status_destino + '.');
    audit(user.id, user.perfil, 'APROVAR_OS', 'ordens_servico', os.id, antes, os);
    return { id_os: os.id, status: os.status };
  }

  function parametroRegistrarLeitura(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'qr', 'parametros_equipamento', payload.parametro_id || '');

    var equipamento = findById('equipamentos', payload.equipamento_id);
    if (!equipamento) throw apiError(404, 'Nao foi possivel registrar leitura: equipamento nao encontrado.');
    if (equipamento.status !== 'ATIVO') throw apiError(400, 'Nao foi possivel registrar leitura: equipamento inativo permite apenas consulta.');

    var parametro = findById('parametros_equipamento', payload.parametro_id);
    if (!parametro) throw apiError(404, 'Nao foi possivel registrar leitura: parametro nao encontrado.');
    if (parametro.equipamento_id !== equipamento.id) {
      throw apiError(400, 'Nao foi possivel registrar leitura: parametro nao pertence ao equipamento informado.');
    }

    var valor = normalizeReadingValue(payload.valor);
    var statusOperacional = calculateParameterStatus(parametro, valor);
    var antes = clone(parametro);
    var leitura = {
      id: newId('LEI'),
      parametro_id: parametro.id,
      equipamento_id: equipamento.id,
      valor: valor,
      unidade: parametro.unidade || '',
      data_hora: nowIso(),
      origem: user.perfil === 'Operador' ? 'OPERADOR' : String(user.perfil || '').toUpperCase()
    };

    parametro.valor = valor;
    parametro.status_operacional = statusOperacional;
    parametro.atualizado_em = leitura.data_hora;
    updateById('parametros_equipamento', parametro.id, parametro);
    appendRow('leituras_parametros', leitura);

    audit(user.id, user.perfil, 'REGISTRAR_LEITURA_PARAMETRO', 'parametros_equipamento', parametro.id, antes, {
      parametro: parametro,
      leitura: leitura,
      observacao: String(payload.observacao || '').trim()
    });

    return {
      equipamento_id: equipamento.id,
      parametro: parametro,
      leitura: leitura,
      status_operacional: statusOperacional
    };
  }

  function componenteRegistrarEvento(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'qr', 'historico_componentes', payload.componente_id || '');

    var equipamento = findById('equipamentos', payload.equipamento_id);
    if (!equipamento) throw apiError(404, 'Nao foi possivel registrar componente: equipamento nao encontrado.');
    if (equipamento.status !== 'ATIVO') throw apiError(400, 'Nao foi possivel registrar componente: equipamento inativo permite apenas consulta.');

    var componente = findById('componentes', payload.componente_id);
    if (!componente) throw apiError(404, 'Nao foi possivel registrar componente: componente nao encontrado.');
    if (componente.equipamento_id !== equipamento.id) {
      throw apiError(400, 'Nao foi possivel registrar componente: componente nao pertence ao equipamento informado.');
    }

    var acao = String(payload.acao || '').trim().toUpperCase();
    if (['INSPECAO', 'AJUSTE', 'TROCA', 'BLOQUEIO'].indexOf(acao) < 0) {
      throw apiError(400, 'Nao foi possivel registrar componente: acao invalida.');
    }

    var descricao = String(payload.descricao || '').trim();
    if (!descricao) throw apiError(400, 'Nao foi possivel registrar componente: descricao tecnica obrigatoria.');

    var antes = clone(componente);
    var evento = {
      id: newId('HCOMP'),
      componente_id: componente.id,
      equipamento_id: equipamento.id,
      acao: acao,
      descricao: descricao,
      vida_util_h: normalizeOptionalReadingValue(payload.vida_util_h, 'vida util'),
      horimetro_evento: normalizeOptionalReadingValue(payload.horimetro_evento, 'horimetro'),
      usuario: user.id,
      data_hora: nowIso()
    };

    if (acao === 'BLOQUEIO') componente.status = 'BLOQUEADO';
    if (acao === 'AJUSTE' || acao === 'TROCA') componente.status = 'ATIVO';

    updateById('componentes', componente.id, componente);
    appendRow('historico_componentes', evento);
    audit(user.id, user.perfil, 'REGISTRAR_EVENTO_COMPONENTE', 'historico_componentes', evento.id, antes, {
      componente: componente,
      evento: evento
    });

    return {
      equipamento_id: equipamento.id,
      componente: componente,
      evento: evento
    };
  }

  function usuariosSalvar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'criar_usuario', 'usuarios', payload.id || '');
    if (['Operador', 'Gestor', 'Admin'].indexOf(payload.perfil) < 0) {
      throw apiError(400, 'Nao foi possivel salvar usuario: perfil invalido.');
    }
    if (!payload.nome || !payload.email || !payload.status) {
      throw apiError(400, 'Nao foi possivel salvar usuario: nome, email, perfil e status sao obrigatorios.');
    }

    var target = payload.id ? findById('usuarios', payload.id) : null;
    var antes = target ? clone(target) : '';
    if (!target) {
      target = {
        id: newId('USR'),
        nome: '',
        email: '',
        senha_hash: hashPassword(payload.senha || '123456'),
        token: '',
        perfil: payload.perfil,
        status: 'ATIVO',
        setor: '',
        criado_em: nowIso()
      };
      appendRow('usuarios', target);
    }

    target.nome = payload.nome;
    target.email = payload.email;
    target.perfil = payload.perfil;
    target.status = payload.status;
    target.setor = payload.setor || '';
    if (payload.senha) target.senha_hash = hashPassword(payload.senha);
    updateById('usuarios', target.id, target);
    audit(user.id, user.perfil, 'SALVAR_USUARIO', 'usuarios', target.id, antes, target);
    return { usuario: sanitizeUser(target) };
  }

  function permissoesListar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'alterar_permissao', 'permissoes', '');
    return {
      matriz: getPermissionMatrix(),
      definicoes: PERMISSION_DEFINITIONS
    };
  }

  function permissoesSalvar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'alterar_permissao', 'permissoes', '');
    var motivo = String(payload.motivo || '').trim();
    if (!motivo) throw apiError(422, 'Nao foi possivel salvar permissoes: motivo obrigatorio.');

    var before = getPermissionMatrix();
    var next = normalizePermissionMatrix(payload.matriz || {});
    replacePermissionRows(next);
    audit(user.id, user.perfil, 'SALVAR_PERMISSOES', 'permissoes', 'acessos', before, { motivo: motivo, matriz: next });
    return {
      matriz: next,
      definicoes: PERMISSION_DEFINITIONS
    };
  }

  function normalizePermissionMatrix(input) {
    var matrix = { Operador: {}, Gestor: {}, Admin: {} };
    ['Operador', 'Gestor', 'Admin'].forEach(function (perfil) {
      PERMISSION_DEFINITIONS.forEach(function (item) {
        matrix[perfil][item.chave] = perfil === 'Admin'
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

  function replacePermissionRows(matrix) {
    clearDataRows('permissoes');
    ['Operador', 'Gestor', 'Admin'].forEach(function (perfil) {
      PERMISSION_DEFINITIONS.forEach(function (item) {
        appendRow('permissoes', {
          id: perfil + '-' + item.chave,
          perfil: perfil,
          chave: item.chave,
          liberado: matrix[perfil][item.chave] ? 'TRUE' : 'FALSE',
          atualizado_em: nowIso()
        });
      });
    });
  }

  function getModules() {
    var rows = readRows('modulos');
    if (!rows.length) {
      rows = moduleSeedRows(nowIso());
      rows.forEach(function (row) { appendRow('modulos', row); });
    }
    return rows;
  }

  function getModuleProfiles() {
    var rows = readRows('modulo_perfis');
    if (!rows.length) {
      rows = moduleProfileSeedRows(nowIso());
      rows.forEach(function (row) { appendRow('modulo_perfis', row); });
    }
    return rows;
  }

  function modulosSalvar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'alterar_permissao', 'modulos', '');
    var motivo = String(payload.motivo || '').trim();
    if (!motivo) throw apiError(422, 'Nao foi possivel salvar modulos: motivo obrigatorio.');

    var before = {
      modulos: getModules(),
      modulo_perfis: getModuleProfiles(),
      matriz: getPermissionMatrix()
    };
    var normalized = normalizeModulePayload(payload.modulos || []);
    clearDataRows('modulos');
    clearDataRows('modulo_perfis');
    normalized.modulos.forEach(function (row) { appendRow('modulos', row); });
    normalized.modulo_perfis.forEach(function (row) { appendRow('modulo_perfis', row); });
    var matrix = permissionsFromModules();
    replacePermissionRows(matrix);
    audit(user.id, user.perfil, 'SALVAR_MODULOS', 'modulos', 'painel-admin', before, { motivo: motivo, modulos: normalized.modulos, modulo_perfis: normalized.modulo_perfis, matriz: matrix });
    return {
      modulos: normalized.modulos,
      modulo_perfis: normalized.modulo_perfis,
      definicoes_modulos: MODULE_DEFINITIONS,
      matriz: matrix,
      definicoes: PERMISSION_DEFINITIONS
    };
  }

  function normalizeModulePayload(input) {
    var byId = {};
    (Array.isArray(input) ? input : []).forEach(function (item) {
      if (item && item.id) byId[item.id] = item;
    });
    var date = nowIso();
    var modulos = [];
    var moduloPerfis = [];
    MODULE_DEFINITIONS.forEach(function (definition, index) {
      var row = byId[definition.id] || {};
      modulos.push({
        id: definition.id,
        nome: row.nome || definition.nome,
        descricao: row.descricao || definition.descricao,
        menu_ids: definition.menu_ids.join(','),
        permissoes: definition.permissoes.join(','),
        status: row.status === 'INATIVO' ? 'INATIVO' : 'ATIVO',
        ordem: index + 1,
        atualizado_em: date
      });
      var profileInput = row.perfis || {};
      ['Operador', 'Gestor', 'Admin'].forEach(function (profile) {
        var profileRow = profileInput[profile] || {};
        var blocked = Array.isArray(profileRow.permissoes_bloqueadas)
          ? profileRow.permissoes_bloqueadas
          : splitCsv(profileRow.permissoes_bloqueadas);
        blocked = blocked.filter(function (permission) {
          return definition.permissoes.indexOf(permission) >= 0;
        });
        moduloPerfis.push(moduleProfileRow(definition.id, profile, profile === 'Admin' ? true : Boolean(profileRow.liberado), blocked.join(','), date));
      });
    });
    return { modulos: modulos, modulo_perfis: moduloPerfis };
  }

  function permissionsFromModules() {
    var matrix = { Operador: {}, Gestor: {}, Admin: {} };
    PERMISSION_DEFINITIONS.forEach(function (item) {
      matrix.Operador[item.chave] = false;
      matrix.Gestor[item.chave] = false;
      matrix.Admin[item.chave] = true;
    });
    var accesses = getModuleProfiles();
    getModules().filter(function (module) {
      return module.status === 'ATIVO';
    }).forEach(function (module) {
      var permissions = splitCsv(module.permissoes);
      ['Operador', 'Gestor', 'Admin'].forEach(function (profile) {
        var access = find(accesses, function (item) { return item.modulo_id === module.id && item.perfil === profile; });
        if (!access || !toBool(access.liberado)) return;
        var blocked = splitCsv(access.permissoes_bloqueadas);
        permissions.forEach(function (permission) {
          if (profile === 'Admin' || blocked.indexOf(permission) < 0) matrix[profile][permission] = true;
        });
      });
    });
    matrix.Operador.login = true;
    matrix.Operador.dashboard = true;
    matrix.Gestor.login = true;
    matrix.Gestor.dashboard = true;
    return matrix;
  }

  function cadastrosSalvar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'cadastrar_equipamento', 'cadastros', payload.entidade || '');
    if (payload.entidade === 'planta') return salvarPlanta(payload, user);
    if (payload.entidade === 'setor') return salvarSetor(payload, user);
    if (payload.entidade === 'linha') return salvarLinha(payload, user);
    if (payload.entidade === 'equipamento') return salvarEquipamento(payload, user);
    if (payload.entidade === 'componente') return salvarComponente(payload, user);
    throw apiError(400, 'Cadastro nao reconhecido.');
  }

  function salvarPlanta(payload, user) {
    if (!payload.nome || !payload.status) throw apiError(422, 'Nao foi possivel salvar planta: nome e status sao obrigatorios.');
    var record = {
      id: payload.id || newId('PLT'),
      nome: payload.nome,
      cnpj: payload.cnpj || '',
      cidade: payload.cidade || '',
      uf: payload.uf || '',
      status: payload.status
    };
    upsertById('plantas', record);
    audit(user.id, user.perfil, 'SALVAR_PLANTA', 'plantas', record.id, '', record);
    return { entidade: 'planta', registro: record };
  }

  function salvarSetor(payload, user) {
    if (!payload.nome || !payload.planta_id || !payload.status) throw apiError(422, 'Nao foi possivel salvar setor: planta, nome e status sao obrigatorios.');
    if (!findById('plantas', payload.planta_id)) throw apiError(422, 'Nao foi possivel salvar setor: planta inexistente.');
    var record = { id: payload.id || newId('SET'), planta_id: payload.planta_id, nome: payload.nome, responsavel: payload.responsavel || '', status: payload.status };
    upsertById('setores', record);
    audit(user.id, user.perfil, 'SALVAR_SETOR', 'setores', record.id, '', record);
    return { entidade: 'setor', registro: record };
  }

  function salvarLinha(payload, user) {
    if (!payload.nome || !payload.setor_id || !payload.status) throw apiError(422, 'Nao foi possivel salvar linha: setor, nome e status sao obrigatorios.');
    if (!findById('setores', payload.setor_id)) throw apiError(422, 'Nao foi possivel salvar linha: setor inexistente.');
    var record = { id: payload.id || newId('LIN'), setor_id: payload.setor_id, nome: payload.nome, capacidade: payload.capacidade || '', status: payload.status };
    upsertById('linhas', record);
    audit(user.id, user.perfil, 'SALVAR_LINHA', 'linhas', record.id, '', record);
    return { entidade: 'linha', registro: record };
  }

  function salvarEquipamento(payload, user) {
    if (!payload.nome || !payload.setor_id || !payload.linha_id || !payload.tipo || !payload.criticidade || !payload.status) {
      throw apiError(422, 'Nao foi possivel salvar equipamento: nome, setor, linha, tipo, criticidade e status sao obrigatorios.');
    }
    if (!findById('setores', payload.setor_id)) throw apiError(422, 'Nao foi possivel salvar equipamento: setor inexistente.');
    var linha = findById('linhas', payload.linha_id);
    if (!linha || linha.setor_id !== payload.setor_id) throw apiError(422, 'Nao foi possivel salvar equipamento: linha nao pertence ao setor.');
    var id = payload.id || newId('EQ');
    var record = {
      id: id,
      nome: payload.nome,
      setor_id: payload.setor_id,
      linha_id: payload.linha_id,
      tipo: payload.tipo,
      fabricante: payload.fabricante || '',
      modelo: payload.modelo || '',
      numero_serie: payload.numero_serie || '',
      data_instalacao: payload.data_instalacao || '',
      horimetro_atual: payload.horimetro_atual || '',
      descricao: payload.descricao || '',
      criticidade: payload.criticidade,
      qr_code: payload.qr_code || 'SCS://' + id,
      status: payload.status
    };
    upsertById('equipamentos', record);
    audit(user.id, user.perfil, 'SALVAR_EQUIPAMENTO', 'equipamentos', record.id, '', record);
    return { entidade: 'equipamento', registro: record };
  }

  function salvarComponente(payload, user) {
    if (!payload.nome || !payload.equipamento_id || !payload.tipo || !payload.criticidade || !payload.status) {
      throw apiError(422, 'Nao foi possivel salvar componente: equipamento, nome, tipo, criticidade e status sao obrigatorios.');
    }
    if (!findById('equipamentos', payload.equipamento_id)) throw apiError(422, 'Nao foi possivel salvar componente: equipamento inexistente.');
    var record = {
      id: payload.id || newId('CMP'),
      equipamento_id: payload.equipamento_id,
      nome: payload.nome,
      tipo: payload.tipo,
      criticidade: payload.criticidade,
      status: payload.status
    };
    upsertById('componentes', record);
    audit(user.id, user.perfil, 'SALVAR_COMPONENTE', 'componentes', record.id, '', record);
    return { entidade: 'componente', registro: record };
  }

  function checklistModeloSalvar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'editar_checklist_padrao', 'checklist_modelos', payload.id || '');
    var itens = Array.isArray(payload.itens) ? payload.itens.filter(function (item) { return String(item.pergunta || '').trim(); }) : [];
    if (!payload.nome || !payload.tipo_os || !payload.versao || !payload.status) {
      throw apiError(422, 'Nao foi possivel salvar modelo: nome, tipo, versao e status sao obrigatorios.');
    }
    if (!itens.length) throw apiError(422, 'Nao foi possivel salvar modelo: ao menos um item e obrigatorio.');

    var modelo = {
      id: payload.id || newId('MDL'),
      nome: payload.nome,
      tipo_os: payload.tipo_os,
      versao: payload.versao,
      status: payload.status,
      criado_por: user.id,
      criado_em: nowIso()
    };
    upsertById('checklist_modelos', modelo);
    deleteRowsWhere('checklist_modelo_itens', function (row) { return row.modelo_id === modelo.id; });
    itens.forEach(function (input, index) {
      var evidenciaRegra = input.evidencia_regra || (input.evidencia_obrigatoria ? 'SEMPRE' : 'SE_NOK');
      appendRow('checklist_modelo_itens', checklistModelItem(
        input.id || newId('MIT') + '-' + (index + 1),
        modelo.id,
        input.item_id || 'IT-' + (index + 1),
        input.pergunta,
        Boolean(input.obrigatorio),
        evidenciaRegra === 'SEMPRE',
        index + 1,
        'ATIVO',
        input
      ));
    });
    var savedItens = readRows('checklist_modelo_itens').filter(function (item) { return item.modelo_id === modelo.id; });
    audit(user.id, user.perfil, 'SALVAR_MODELO_CHECKLIST', 'checklist_modelos', modelo.id, '', { modelo: modelo, itens: savedItens });
    return { modelo: modelo, itens: savedItens };
  }

  function workflowSalvar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'configurar_fluxo', 'workflow_regras', '');
    var input = Array.isArray(payload.regras) ? payload.regras : [];
    if (!input.length) throw apiError(422, 'Nao foi possivel salvar fluxo: informe ao menos uma regra ativa.');

    var before = getWorkflowRules();
    var normalized = input.map(function (row, index) {
      var acao = String(row.acao || '').trim();
      var statusOrigem = normalizeCsv(row.status_origem).join(',');
      var origemList = splitCsv(statusOrigem);
      var statusDestino = String(row.status_destino || '').trim();
      var permissao = String(row.permissao || '').trim();
      var perfis = normalizeCsv(row.perfis).filter(function (perfil) {
        return ['Operador', 'Gestor', 'Admin'].indexOf(perfil) >= 0;
      }).join(',');
      var status = row.status === 'INATIVO' ? 'INATIVO' : 'ATIVO';

      if (!hasAction(acao)) throw apiError(422, 'Fluxo invalido na linha ' + (index + 1) + ': acao nao permitida.');
      if (!origemList.length || !allValidStatus(origemList)) throw apiError(422, 'Fluxo invalido na linha ' + (index + 1) + ': status de origem invalido.');
      if (STATUS_FLUXO.indexOf(statusDestino) < 0) throw apiError(422, 'Fluxo invalido na linha ' + (index + 1) + ': status destino invalido.');
      if (!hasPermissionDefinition(permissao)) throw apiError(422, 'Fluxo invalido na linha ' + (index + 1) + ': permissao inexistente.');
      if (!perfis) throw apiError(422, 'Fluxo invalido na linha ' + (index + 1) + ': selecione ao menos um perfil.');

      return workflowRule(
        row.id || 'WFL-' + acao,
        acao,
        row.nome || workflowActionName(acao),
        statusOrigem,
        statusDestino,
        permissao,
        perfis,
        toBool(row.exige_responsavel),
        toBool(row.exige_checklist_ok),
        status,
        nowIso()
      );
    });

    clearDataRows('workflow_regras');
    normalized.forEach(function (row) { appendRow('workflow_regras', row); });
    audit(user.id, user.perfil, 'SALVAR_WORKFLOW', 'workflow_regras', 'fluxo-os', before, normalized);
    return { regras: normalized, acoes: WORKFLOW_ACTIONS, status_fluxo: STATUS_FLUXO };
  }

  function logsListar(payload) {
    var user = requireSession(payload);
    requirePermission(user, 'ver_audit_log', 'audit_log', '');
    var logs = readRows('audit_log').sort(function (a, b) {
      return String(b.data_hora).localeCompare(String(a.data_hora));
    });
    return { logs: logs };
  }

  function setupInicial() {
    ensureAllSheets();
    if (readRows('usuarios').length > 0) {
      appendModuleSeedsIfMissing(nowIso());
      appendTraceabilitySeedsIfMissing(nowIso());
      appendEventSeedsIfMissing(nowIso());
      appendVersionSeedsIfMissing(nowIso());
      appendDynamicChecklistSeedsIfMissing(nowIso());
      return 'Base ja possui usuarios. Seeds de rastreabilidade, eventos, checklist dinamico e versionamento verificados sem duplicar registros.';
    }

    var createdAt = nowIso();
    appendRow('plantas', { id: 'PLT-SCS', nome: 'SCS Industria', cnpj: '00.000.000/0001-00', cidade: 'Sao Paulo', uf: 'SP', status: 'ATIVO' });
    appendRow('setores', { id: 'SET-CONS', planta_id: 'PLT-SCS', nome: 'Conservas', responsavel: 'USR-GESTOR', status: 'ATIVO' });
    appendRow('setores', { id: 'SET-ROT', planta_id: 'PLT-SCS', nome: 'Rotulagem', responsavel: 'USR-GESTOR', status: 'ATIVO' });
    appendRow('setores', { id: 'SET-UTL', planta_id: 'PLT-SCS', nome: 'Utilidades', responsavel: 'USR-GESTOR', status: 'ATIVO' });

    appendRow('linhas', { id: 'LIN-03', setor_id: 'SET-CONS', nome: 'Linha 03', capacidade: '1200 un/h', status: 'ATIVO' });
    appendRow('linhas', { id: 'LIN-05', setor_id: 'SET-ROT', nome: 'Linha 05', capacidade: '900 un/h', status: 'ATIVO' });
    appendRow('linhas', { id: 'LIN-07', setor_id: 'SET-UTL', nome: 'Linha 07', capacidade: 'Utilidades', status: 'ATIVO' });

    appendRow('usuarios', seedUser('USR-OPERADOR', 'Operador SCS', 'operador@scs.local', 'Operador', 'SET-CONS', createdAt));
    appendRow('usuarios', seedUser('USR-GESTOR', 'Gestor PCM', 'gestor@scs.local', 'Gestor', 'SET-CONS', createdAt));
    appendRow('usuarios', seedUser('USR-ADMIN', 'Admin Master', 'admin@scs.local', 'Admin', 'SET-UTL', createdAt));
    replacePermissionRows(normalizePermissionMatrix(PERMISSOES));
    appendModuleSeeds(createdAt);
    appendWorkflowSeeds(createdAt);

    appendRow('equipamentos', { id: 'EQ-ENV-03', nome: 'Envasadora Linha 03', setor_id: 'SET-CONS', linha_id: 'LIN-03', tipo: 'Envasadora', fabricante: 'Krones', modelo: 'VolumePro', numero_serie: 'KR-2018-77', data_instalacao: '2021-03-15', horimetro_atual: '4200', descricao: 'Equipamento critico de envase da linha 03.', criticidade: 'A', qr_code: 'SCS://EQ-ENV-03', status: 'ATIVO' });
    appendRow('equipamentos', { id: 'EQ-ROT-05', nome: 'Rotuladora Linha 05', setor_id: 'SET-ROT', linha_id: 'LIN-05', tipo: 'Rotuladora', fabricante: 'Sacmi', modelo: 'Opera-K', numero_serie: 'SAC-20-441', data_instalacao: '2020-07-10', horimetro_atual: '3150', descricao: 'Rotuladora principal da linha 05.', criticidade: 'B', qr_code: 'SCS://EQ-ROT-05', status: 'ATIVO' });
    appendRow('equipamentos', { id: 'EQ-CAL-07', nome: 'Caldeira Utilidades', setor_id: 'SET-UTL', linha_id: 'LIN-07', tipo: 'Caldeira', fabricante: 'Atlas Copco', modelo: 'GA-55', numero_serie: 'AC-17-009', data_instalacao: '2019-01-22', horimetro_atual: '9100', descricao: 'Ativo de utilidades com consulta historica.', criticidade: 'A', qr_code: 'SCS://EQ-CAL-07', status: 'INATIVO' });

    appendRow('componentes', { id: 'CMP-ENV-BOMBA', equipamento_id: 'EQ-ENV-03', nome: 'Bomba dosadora', tipo: 'Bomba', criticidade: 'A', status: 'ATIVO' });
    appendRow('componentes', { id: 'CMP-ENV-SENSOR', equipamento_id: 'EQ-ENV-03', nome: 'Sensor de nivel', tipo: 'Sensor', criticidade: 'B', status: 'ATIVO' });
    appendRow('componentes', { id: 'CMP-ROT-CORREIA', equipamento_id: 'EQ-ROT-05', nome: 'Correia transportadora', tipo: 'Correia', criticidade: 'B', status: 'ATIVO' });
    appendRow('componentes', { id: 'CMP-CAL-VALV', equipamento_id: 'EQ-CAL-07', nome: 'Valvula de seguranca', tipo: 'Valvula', criticidade: 'A', status: 'ATIVO' });

    appendRow('parametros_equipamento', { id: 'PAR-ENV-HOR', equipamento_id: 'EQ-ENV-03', nome: 'Horimetro', valor: '4200', unidade: 'h', limite_min: '0', limite_max: '4500', status_operacional: 'ATENCAO', atualizado_em: createdAt });
    appendRow('parametros_equipamento', { id: 'PAR-ENV-VIB', equipamento_id: 'EQ-ENV-03', nome: 'Vibracao axial', valor: '7.8', unidade: 'mm/s', limite_min: '0', limite_max: '8', status_operacional: 'ATENCAO', atualizado_em: createdAt });
    appendRow('parametros_equipamento', { id: 'PAR-ENV-TMP', equipamento_id: 'EQ-ENV-03', nome: 'Temperatura mancal', valor: '64', unidade: 'C', limite_min: '20', limite_max: '85', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendRow('parametros_equipamento', { id: 'PAR-ROT-HOR', equipamento_id: 'EQ-ROT-05', nome: 'Horimetro', valor: '3150', unidade: 'h', limite_min: '0', limite_max: '5000', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendRow('parametros_equipamento', { id: 'PAR-ROT-VEL', equipamento_id: 'EQ-ROT-05', nome: 'Velocidade nominal', valor: '900', unidade: 'un/h', limite_min: '700', limite_max: '950', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendRow('parametros_equipamento', { id: 'PAR-CAL-PRE', equipamento_id: 'EQ-CAL-07', nome: 'Pressao de trabalho', valor: '11.2', unidade: 'bar', limite_min: '8', limite_max: '12', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendRow('parametros_equipamento', { id: 'PAR-CAL-HOR', equipamento_id: 'EQ-CAL-07', nome: 'Horimetro', valor: '9100', unidade: 'h', limite_min: '0', limite_max: '9000', status_operacional: 'CRITICO', atualizado_em: createdAt });

    appendRow('leituras_parametros', { id: 'LEI-ENV-HOR-1', parametro_id: 'PAR-ENV-HOR', equipamento_id: 'EQ-ENV-03', valor: '4200', unidade: 'h', data_hora: createdAt, origem: 'SISTEMA' });
    appendRow('leituras_parametros', { id: 'LEI-ENV-VIB-1', parametro_id: 'PAR-ENV-VIB', equipamento_id: 'EQ-ENV-03', valor: '7.8', unidade: 'mm/s', data_hora: createdAt, origem: 'OPERADOR' });
    appendRow('leituras_parametros', { id: 'LEI-ENV-TMP-1', parametro_id: 'PAR-ENV-TMP', equipamento_id: 'EQ-ENV-03', valor: '64', unidade: 'C', data_hora: createdAt, origem: 'OPERADOR' });
    appendRow('leituras_parametros', { id: 'LEI-ROT-HOR-1', parametro_id: 'PAR-ROT-HOR', equipamento_id: 'EQ-ROT-05', valor: '3150', unidade: 'h', data_hora: createdAt, origem: 'SISTEMA' });
    appendRow('leituras_parametros', { id: 'LEI-ROT-VEL-1', parametro_id: 'PAR-ROT-VEL', equipamento_id: 'EQ-ROT-05', valor: '900', unidade: 'un/h', data_hora: createdAt, origem: 'SISTEMA' });
    appendRow('leituras_parametros', { id: 'LEI-CAL-PRE-1', parametro_id: 'PAR-CAL-PRE', equipamento_id: 'EQ-CAL-07', valor: '11.2', unidade: 'bar', data_hora: createdAt, origem: 'SISTEMA' });
    appendRow('leituras_parametros', { id: 'LEI-CAL-HOR-1', parametro_id: 'PAR-CAL-HOR', equipamento_id: 'EQ-CAL-07', valor: '9100', unidade: 'h', data_hora: createdAt, origem: 'SISTEMA' });

    appendRow('historico_componentes', { id: 'HCOMP-ENV-BOMBA-1', componente_id: 'CMP-ENV-BOMBA', equipamento_id: 'EQ-ENV-03', acao: 'TROCA', descricao: 'Substituicao preventiva do selo mecanico.', vida_util_h: '1800', horimetro_evento: '3890', usuario: 'USR-GESTOR', data_hora: createdAt });
    appendRow('historico_componentes', { id: 'HCOMP-ENV-SENSOR-1', componente_id: 'CMP-ENV-SENSOR', equipamento_id: 'EQ-ENV-03', acao: 'AJUSTE', descricao: 'Calibracao do sensor de nivel apos oscilacao.', vida_util_h: '900', horimetro_evento: '4188', usuario: 'USR-OPERADOR', data_hora: createdAt });
    appendRow('historico_componentes', { id: 'HCOMP-ROT-CORREIA-1', componente_id: 'CMP-ROT-CORREIA', equipamento_id: 'EQ-ROT-05', acao: 'INSPECAO', descricao: 'Alinhamento conferido e tensao corrigida.', vida_util_h: '1200', horimetro_evento: '3142', usuario: 'USR-OPERADOR', data_hora: createdAt });
    appendRow('historico_componentes', { id: 'HCOMP-CAL-VALV-1', componente_id: 'CMP-CAL-VALV', equipamento_id: 'EQ-CAL-07', acao: 'BLOQUEIO', descricao: 'Ativo inativo para avaliacao de seguranca.', vida_util_h: '3000', horimetro_evento: '9100', usuario: 'USR-GESTOR', data_hora: createdAt });
    appendChecklistModelSeeds(createdAt);

    appendRow('ordens_servico', seedOs('OS-102', 'EQ-ENV-03', 'CMP-ENV-BOMBA', 'Corretiva', 'Alta', 'A', 'LIBERADA', todayPlus(1), 'Vazamento intermitente na bomba dosadora.', 'Bloquear energia, inspecionar vedacao e testar retorno.', createdAt));
    appendRow('ordens_servico', seedOs('OS-108', 'EQ-ENV-03', 'CMP-ENV-SENSOR', 'Preventiva', 'Media', 'B', 'EM_EXECUCAO', todayPlus(-1), 'Inspecao preventiva do sensor de nivel.', 'Conferir leitura, limpeza e fixacao do sensor.', createdAt));
    appendRow('ordens_servico', seedOs('OS-121', 'EQ-ROT-05', 'CMP-ROT-CORREIA', 'Inspecao', 'Baixa', 'B', 'AGUARDANDO_APROVACAO', todayPlus(0), 'Inspecao de alinhamento da correia.', 'Verificar alinhamento, desgaste e tensao.', createdAt));

    appendChecklistSeeds(createdAt);
    addHistorico(findById('ordens_servico', 'OS-102'), 'CRIAR_OS', 'USR-GESTOR', 'OS liberada para execucao.');
    addHistorico(findById('ordens_servico', 'OS-108'), 'INICIAR_OS', 'USR-OPERADOR', 'Execucao iniciada pelo operador.');
    addHistorico(findById('ordens_servico', 'OS-121'), 'FINALIZAR_EXECUCAO', 'USR-OPERADOR', 'Execucao enviada para aprovacao.');
    appendEventSeedsIfMissing(createdAt);
    appendRow('anexos', { id: 'ANX-121-1', os_id: 'OS-121', checklist_id: 'CHK-121-2', nome: 'foto-correia.jpg', usuario: 'USR-OPERADOR', data_hora: createdAt });
    appendVersionSeedsIfMissing(createdAt);
    return 'Seed inicial aplicado. Usuarios de teste criados com senha 123456.';
  }

  function appendEventSeedsIfMissing(createdAt) {
    appendIfMissing('eventos', 'EVT-OS108-ATRASO', { id: 'EVT-OS108-ATRASO', os_id: 'OS-108', tipo: 'ALERTA_ATRASO', usuario: 'SISTEMA', resumo: 'OS em execucao com prazo vencido.', data_hora: createdAt });
    appendIfMissing('eventos', 'EVT-OS121-APROVACAO', { id: 'EVT-OS121-APROVACAO', os_id: 'OS-121', tipo: 'APROVACAO', usuario: 'USR-GESTOR', resumo: 'OS finalizada aguardando decisao do PCM.', data_hora: createdAt });
    appendIfMissing('eventos', 'EVT-OS108-CHECKLIST', { id: 'EVT-OS108-CHECKLIST', os_id: 'OS-108', tipo: 'CHECKLIST', usuario: 'USR-OPERADOR', resumo: 'Checklist possui item pendente com evidencia obrigatoria.', data_hora: createdAt });
    appendIfMissing('eventos', 'EVT-OS102-STATUS', { id: 'EVT-OS102-STATUS', os_id: 'OS-102', tipo: 'STATUS', usuario: 'USR-GESTOR', resumo: 'OS liberada para execucao do operador.', data_hora: createdAt });
  }

  function appendVersionSeedsIfMissing(createdAt) {
    var date = String(createdAt || nowIso()).slice(0, 10);
    appendIfMissing('versionamento', 'VER-1-5-7', {
      id: 'VER-1-5-7',
      versao: '1.5.7',
      titulo: 'Checklist dinamico tecnico',
      data: date,
      status: 'ATIVO',
      escopo: 'Motor de checklist dinamico com tipos de resposta, unidades, limites, valor esperado, opcoes, criticidade e regras condicionais de evidencia/observacao.',
      endpoints: 'checklist.salvar, checklist_modelo.salvar, os.listar, os.criar',
      schema: 'checklist_modelo_itens e checklist_execucao com campos dinamicos',
      observacoes: 'Inclui seeds Motor WEG 15 cv - Lubrificacao e Inspecao. Mantem compatibilidade com checklists antigos.'
    });
    appendIfMissing('versionamento', 'VER-1-5-6', {
      id: 'VER-1-5-6',
      versao: '1.5.6',
      titulo: 'Pacote real de deploy e UX operacional',
      data: date,
      status: 'REGISTRADO',
      escopo: 'Pacote de publicacao com planilha, Apps Script, frontend, changelog, contraste analitico, fluxo em etapas e CRUD operacional de usuarios.',
      endpoints: 'auth.login, os.listar, os.criar, os.iniciar, checklist.salvar, os.finalizar_execucao, os.aprovar, usuarios.salvar, workflow.salvar, logs.listar',
      schema: 'sem migracao; versionamento atualizado',
      observacoes: 'Preparado para Google Sheets, Apps Script e GitHub Pages mantendo JavaScript Vanilla e contratos existentes.'
    });
    appendIfMissing('versionamento', 'VER-1-5-5', {
      id: 'VER-1-5-5',
      versao: '1.5.5',
      titulo: 'Central de eventos por tags',
      data: date,
      status: 'REGISTRADO',
      escopo: 'Eventos separados por tags, filtros mobile, cards contextuais e seeds de eventos operacionais.',
      endpoints: 'os.listar, logs.listar',
      schema: 'eventos, versionamento',
      observacoes: 'Tags derivadas no frontend sem migracao de colunas; eventos seguem auditaveis pela aba eventos.'
    });
    appendIfMissing('versionamento', 'VER-1-5-4', {
      id: 'VER-1-5-4',
      versao: '1.5.4',
      titulo: 'Contraste, evidencias e rastreabilidade QR',
      data: date,
      status: 'REGISTRADO',
      escopo: 'Correcoes de leitura do tema escuro, evidencia por arquivo/camera no checklist e ficha QR com evidencias e leituras recentes.',
      endpoints: 'checklist.salvar, os.listar, parametros.registrar_leitura',
      schema: 'checklist_execucao, anexos, leituras_parametros',
      observacoes: 'Sem migracao de colunas; evidencia usa o contrato existente e preserva auditoria do checklist.'
    });
    appendIfMissing('versionamento', 'VER-1-5-3', {
      id: 'VER-1-5-3',
      versao: '1.5.3',
      titulo: 'Ciclo de vida de componentes e versionamento',
      data: date,
      status: 'REGISTRADO',
      escopo: 'Eventos tecnicos de componentes pela ficha QR e aba administrativa de versionamento.',
      endpoints: 'componentes.registrar_evento, parametros.registrar_leitura',
      schema: 'historico_componentes, versionamento',
      observacoes: 'Componente pode ser inspecionado, ajustado, trocado ou bloqueado com auditoria.'
    });
    appendIfMissing('versionamento', 'VER-1-5-2', {
      id: 'VER-1-5-2',
      versao: '1.5.2',
      titulo: 'Registro de leitura operacional pelo QR',
      data: date,
      status: 'REGISTRADO',
      escopo: 'Leituras de parametros operacionais atualizam valor atual e status operacional.',
      endpoints: 'parametros.registrar_leitura',
      schema: 'parametros_equipamento, leituras_parametros',
      observacoes: 'Valor numerico validado no backend e auditado.'
    });
    appendIfMissing('versionamento', 'VER-1-5-1', {
      id: 'VER-1-5-1',
      versao: '1.5.1',
      titulo: 'Nucleo de rastreabilidade QR',
      data: date,
      status: 'REGISTRADO',
      escopo: 'Ficha operacional do ativo com parametros, componentes, OS pendentes e historico.',
      endpoints: 'os.listar',
      schema: 'parametros_equipamento, leituras_parametros, historico_componentes',
      observacoes: 'QR de equipamento passou a abrir contexto operacional completo.'
    });
    syncActiveVersion('VER-1-5-7');
  }

  function syncActiveVersion(activeId) {
    var sheet = ensureSheet('versionamento');
    var headers = SHEETS.versionamento;
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    var idIndex = headers.indexOf('id');
    var statusIndex = headers.indexOf('status');
    var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    values.forEach(function (row) {
      if (row[idIndex] === activeId) row[statusIndex] = 'ATIVO';
      else if (row[statusIndex] === 'ATIVO') row[statusIndex] = 'REGISTRADO';
    });
    sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  }

  function appendTraceabilitySeedsIfMissing(createdAt) {
    appendIfMissing('componentes', 'CMP-CAL-VALV', { id: 'CMP-CAL-VALV', equipamento_id: 'EQ-CAL-07', nome: 'Valvula de seguranca', tipo: 'Valvula', criticidade: 'A', status: 'ATIVO' });

    appendIfMissing('parametros_equipamento', 'PAR-ENV-HOR', { id: 'PAR-ENV-HOR', equipamento_id: 'EQ-ENV-03', nome: 'Horimetro', valor: '4200', unidade: 'h', limite_min: '0', limite_max: '4500', status_operacional: 'ATENCAO', atualizado_em: createdAt });
    appendIfMissing('parametros_equipamento', 'PAR-ENV-VIB', { id: 'PAR-ENV-VIB', equipamento_id: 'EQ-ENV-03', nome: 'Vibracao axial', valor: '7.8', unidade: 'mm/s', limite_min: '0', limite_max: '8', status_operacional: 'ATENCAO', atualizado_em: createdAt });
    appendIfMissing('parametros_equipamento', 'PAR-ENV-TMP', { id: 'PAR-ENV-TMP', equipamento_id: 'EQ-ENV-03', nome: 'Temperatura mancal', valor: '64', unidade: 'C', limite_min: '20', limite_max: '85', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendIfMissing('parametros_equipamento', 'PAR-ROT-HOR', { id: 'PAR-ROT-HOR', equipamento_id: 'EQ-ROT-05', nome: 'Horimetro', valor: '3150', unidade: 'h', limite_min: '0', limite_max: '5000', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendIfMissing('parametros_equipamento', 'PAR-ROT-VEL', { id: 'PAR-ROT-VEL', equipamento_id: 'EQ-ROT-05', nome: 'Velocidade nominal', valor: '900', unidade: 'un/h', limite_min: '700', limite_max: '950', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendIfMissing('parametros_equipamento', 'PAR-CAL-PRE', { id: 'PAR-CAL-PRE', equipamento_id: 'EQ-CAL-07', nome: 'Pressao de trabalho', valor: '11.2', unidade: 'bar', limite_min: '8', limite_max: '12', status_operacional: 'NORMAL', atualizado_em: createdAt });
    appendIfMissing('parametros_equipamento', 'PAR-CAL-HOR', { id: 'PAR-CAL-HOR', equipamento_id: 'EQ-CAL-07', nome: 'Horimetro', valor: '9100', unidade: 'h', limite_min: '0', limite_max: '9000', status_operacional: 'CRITICO', atualizado_em: createdAt });

    appendIfMissing('leituras_parametros', 'LEI-ENV-HOR-1', { id: 'LEI-ENV-HOR-1', parametro_id: 'PAR-ENV-HOR', equipamento_id: 'EQ-ENV-03', valor: '4200', unidade: 'h', data_hora: createdAt, origem: 'SISTEMA' });
    appendIfMissing('leituras_parametros', 'LEI-ENV-VIB-1', { id: 'LEI-ENV-VIB-1', parametro_id: 'PAR-ENV-VIB', equipamento_id: 'EQ-ENV-03', valor: '7.8', unidade: 'mm/s', data_hora: createdAt, origem: 'OPERADOR' });
    appendIfMissing('leituras_parametros', 'LEI-ENV-TMP-1', { id: 'LEI-ENV-TMP-1', parametro_id: 'PAR-ENV-TMP', equipamento_id: 'EQ-ENV-03', valor: '64', unidade: 'C', data_hora: createdAt, origem: 'OPERADOR' });
    appendIfMissing('leituras_parametros', 'LEI-ROT-HOR-1', { id: 'LEI-ROT-HOR-1', parametro_id: 'PAR-ROT-HOR', equipamento_id: 'EQ-ROT-05', valor: '3150', unidade: 'h', data_hora: createdAt, origem: 'SISTEMA' });
    appendIfMissing('leituras_parametros', 'LEI-ROT-VEL-1', { id: 'LEI-ROT-VEL-1', parametro_id: 'PAR-ROT-VEL', equipamento_id: 'EQ-ROT-05', valor: '900', unidade: 'un/h', data_hora: createdAt, origem: 'SISTEMA' });
    appendIfMissing('leituras_parametros', 'LEI-CAL-PRE-1', { id: 'LEI-CAL-PRE-1', parametro_id: 'PAR-CAL-PRE', equipamento_id: 'EQ-CAL-07', valor: '11.2', unidade: 'bar', data_hora: createdAt, origem: 'SISTEMA' });
    appendIfMissing('leituras_parametros', 'LEI-CAL-HOR-1', { id: 'LEI-CAL-HOR-1', parametro_id: 'PAR-CAL-HOR', equipamento_id: 'EQ-CAL-07', valor: '9100', unidade: 'h', data_hora: createdAt, origem: 'SISTEMA' });

    appendIfMissing('historico_componentes', 'HCOMP-ENV-BOMBA-1', { id: 'HCOMP-ENV-BOMBA-1', componente_id: 'CMP-ENV-BOMBA', equipamento_id: 'EQ-ENV-03', acao: 'TROCA', descricao: 'Substituicao preventiva do selo mecanico.', vida_util_h: '1800', horimetro_evento: '3890', usuario: 'USR-GESTOR', data_hora: createdAt });
    appendIfMissing('historico_componentes', 'HCOMP-ENV-SENSOR-1', { id: 'HCOMP-ENV-SENSOR-1', componente_id: 'CMP-ENV-SENSOR', equipamento_id: 'EQ-ENV-03', acao: 'AJUSTE', descricao: 'Calibracao do sensor de nivel apos oscilacao.', vida_util_h: '900', horimetro_evento: '4188', usuario: 'USR-OPERADOR', data_hora: createdAt });
    appendIfMissing('historico_componentes', 'HCOMP-ROT-CORREIA-1', { id: 'HCOMP-ROT-CORREIA-1', componente_id: 'CMP-ROT-CORREIA', equipamento_id: 'EQ-ROT-05', acao: 'INSPECAO', descricao: 'Alinhamento conferido e tensao corrigida.', vida_util_h: '1200', horimetro_evento: '3142', usuario: 'USR-OPERADOR', data_hora: createdAt });
    appendIfMissing('historico_componentes', 'HCOMP-CAL-VALV-1', { id: 'HCOMP-CAL-VALV-1', componente_id: 'CMP-CAL-VALV', equipamento_id: 'EQ-CAL-07', acao: 'BLOQUEIO', descricao: 'Ativo inativo para avaliacao de seguranca.', vida_util_h: '3000', horimetro_evento: '9100', usuario: 'USR-GESTOR', data_hora: createdAt });
  }

  function appendIfMissing(sheetName, id, row) {
    if (!findById(sheetName, id)) appendRow(sheetName, row);
  }


  function appendDynamicChecklistSeedsIfMissing(createdAt) {
    appendIfMissing('checklist_modelos', 'MDL-WEG-LUB-001', { id: 'MDL-WEG-LUB-001', nome: 'Motor WEG 15 cv - Lubrificacao', tipo_os: 'Lubrificacao', versao: '1', status: 'ATIVO', criado_por: 'USR-ADMIN', criado_em: createdAt });
    appendIfMissing('checklist_modelos', 'MDL-WEG-INSP-001', { id: 'MDL-WEG-INSP-001', nome: 'Motor WEG 15 cv - Inspecao', tipo_os: 'Inspecao', versao: '1', status: 'ATIVO', criado_por: 'USR-ADMIN', criado_em: createdAt });
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-LUB-1', checklistModelItem('MIT-WEG-LUB-1', 'MDL-WEG-LUB-001', 'IT-TAG', 'Conferir TAG do motor e equipamento', true, false, 1, 'ATIVO', { tipo_resposta: 'OK_NOK' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-LUB-2', checklistModelItem('MIT-WEG-LUB-2', 'MDL-WEG-LUB-001', 'IT-GRAXA', 'Confirmar tipo de graxa utilizada', true, false, 2, 'ATIVO', { tipo_resposta: 'SELECT', opcoes: 'Mobil Polyrex EM; Shell Gadus; Lubrax Industrial; Outro', valor_esperado: 'Mobil Polyrex EM', observacao_regra: 'SE_OUTRO', evidencia_regra: 'SE_OUTRO' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-LUB-3', checklistModelItem('MIT-WEG-LUB-3', 'MDL-WEG-LUB-001', 'IT-MANCAL-D', 'Registrar quantidade de graxa no mancal dianteiro', true, false, 3, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'g', valor_min: '10', valor_max: '30', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-LUB-4', checklistModelItem('MIT-WEG-LUB-4', 'MDL-WEG-LUB-001', 'IT-MANCAL-T', 'Registrar quantidade de graxa no mancal traseiro', true, false, 4, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'g', valor_min: '10', valor_max: '30', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-LUB-5', checklistModelItem('MIT-WEG-LUB-5', 'MDL-WEG-LUB-001', 'IT-RUIDO', 'Verificar ruido anormal apos lubrificacao', true, false, 5, 'ATIVO', { tipo_resposta: 'OK_NOK', critico: true, observacao_regra: 'SE_NOK', evidencia_regra: 'SE_NOK' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-LUB-6', checklistModelItem('MIT-WEG-LUB-6', 'MDL-WEG-LUB-001', 'IT-PROTECAO', 'Verificar protecao mecanica instalada', true, true, 6, 'ATIVO', { tipo_resposta: 'OK_NOK', critico: true, evidencia_regra: 'SEMPRE' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-INSP-1', checklistModelItem('MIT-WEG-INSP-1', 'MDL-WEG-INSP-001', 'IT-TENSAO', 'Medir tensao de alimentacao', true, false, 1, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'V', valor_min: '200', valor_max: '240', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-INSP-2', checklistModelItem('MIT-WEG-INSP-2', 'MDL-WEG-INSP-001', 'IT-CORRENTE', 'Medir corrente do motor', true, false, 2, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'A' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-INSP-3', checklistModelItem('MIT-WEG-INSP-3', 'MDL-WEG-INSP-001', 'IT-TEMP', 'Verificar temperatura da carcaca', true, false, 3, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: '°C', valor_max: '80', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-INSP-4', checklistModelItem('MIT-WEG-INSP-4', 'MDL-WEG-INSP-001', 'IT-VIB', 'Verificar vibracao perceptivel', true, false, 4, 'ATIVO', { tipo_resposta: 'OK_NOK', critico: true, observacao_regra: 'SE_NOK' }));
    appendIfMissing('checklist_modelo_itens', 'MIT-WEG-INSP-5', checklistModelItem('MIT-WEG-INSP-5', 'MDL-WEG-INSP-001', 'IT-OBS', 'Registrar observacoes gerais', false, false, 5, 'ATIVO', { tipo_resposta: 'TEXTO', observacao_regra: 'NUNCA' }));
  }

  function appendChecklistSeeds(createdAt) {
    appendRow('checklist_execucao', checklistItem('CHK-102-1', 'OS-102', 'IT-SEG', 'Energia bloqueada e area isolada', true, '', '', '', false, '', ''));
    appendRow('checklist_execucao', checklistItem('CHK-102-2', 'OS-102', 'IT-VED', 'Vedacao inspecionada', true, '', '', '', true, '', ''));
    appendRow('checklist_execucao', checklistItem('CHK-102-3', 'OS-102', 'IT-TESTE', 'Teste operacional realizado', true, '', '', '', false, '', ''));
    appendRow('checklist_execucao', checklistItem('CHK-108-1', 'OS-108', 'IT-SEG', 'Energia bloqueada e area isolada', true, 'OK', '', '', false, 'USR-OPERADOR', createdAt));
    appendRow('checklist_execucao', checklistItem('CHK-108-2', 'OS-108', 'IT-LIMP', 'Sensor limpo e fixado', true, '', '', '', true, '', ''));
    appendRow('checklist_execucao', checklistItem('CHK-108-3', 'OS-108', 'IT-LEIT', 'Leitura comparada com referencia', true, 'NAO_OK', 'Oscilacao acima do aceitavel.', 'foto-sensor.jpg', false, 'USR-OPERADOR', createdAt));
    appendRow('checklist_execucao', checklistItem('CHK-121-1', 'OS-121', 'IT-SEG', 'Area isolada', true, 'OK', '', '', false, 'USR-OPERADOR', createdAt));
    appendRow('checklist_execucao', checklistItem('CHK-121-2', 'OS-121', 'IT-CORR', 'Correia sem desgaste critico', true, 'OK', '', 'foto-correia.jpg', true, 'USR-OPERADOR', createdAt));
    appendRow('checklist_execucao', checklistItem('CHK-121-3', 'OS-121', 'IT-TENS', 'Tensao conferida', true, 'OK', '', '', false, 'USR-OPERADOR', createdAt));
  }

  function appendChecklistModelSeeds(createdAt) {
    appendRow('checklist_modelos', { id: 'MDL-COR-001', nome: 'Corretiva padrao', tipo_os: 'Corretiva', versao: '1', status: 'ATIVO', criado_por: 'USR-ADMIN', criado_em: createdAt });
    appendRow('checklist_modelos', { id: 'MDL-PREV-001', nome: 'Preventiva padrao', tipo_os: 'Preventiva', versao: '1', status: 'ATIVO', criado_por: 'USR-ADMIN', criado_em: createdAt });
    appendRow('checklist_modelos', { id: 'MDL-INSP-001', nome: 'Inspecao padrao', tipo_os: 'Inspecao', versao: '1', status: 'ATIVO', criado_por: 'USR-ADMIN', criado_em: createdAt });
    appendRow('checklist_modelos', { id: 'MDL-WEG-LUB-001', nome: 'Motor WEG 15 cv - Lubrificacao', tipo_os: 'Lubrificacao', versao: '1', status: 'ATIVO', criado_por: 'USR-ADMIN', criado_em: createdAt });
    appendRow('checklist_modelos', { id: 'MDL-WEG-INSP-001', nome: 'Motor WEG 15 cv - Inspecao', tipo_os: 'Inspecao', versao: '1', status: 'ATIVO', criado_por: 'USR-ADMIN', criado_em: createdAt });
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-COR-1', 'MDL-COR-001', 'IT-SEG', 'Energia bloqueada e area isolada', true, false, 1, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-COR-2', 'MDL-COR-001', 'IT-EXEC', 'Falha corrigida conforme instrucao', true, true, 2, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-COR-3', 'MDL-COR-001', 'IT-TESTE', 'Teste operacional realizado', true, false, 3, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-PREV-1', 'MDL-PREV-001', 'IT-SEG', 'Energia bloqueada e area isolada', true, false, 1, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-PREV-2', 'MDL-PREV-001', 'IT-LIMP', 'Limpeza e fixacao conferidas', true, true, 2, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-PREV-3', 'MDL-PREV-001', 'IT-LEIT', 'Leitura comparada com referencia', true, false, 3, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-INSP-1', 'MDL-INSP-001', 'IT-SEG', 'Area isolada', true, false, 1, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-INSP-2', 'MDL-INSP-001', 'IT-COND', 'Condicao fisica sem anomalia critica', true, true, 2, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-INSP-3', 'MDL-INSP-001', 'IT-REG', 'Registro tecnico concluido', true, false, 3, 'ATIVO'));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-LUB-1', 'MDL-WEG-LUB-001', 'IT-TAG', 'Conferir TAG do motor e equipamento', true, false, 1, 'ATIVO', { tipo_resposta: 'OK_NOK' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-LUB-2', 'MDL-WEG-LUB-001', 'IT-GRAXA', 'Confirmar tipo de graxa utilizada', true, false, 2, 'ATIVO', { tipo_resposta: 'SELECT', opcoes: 'Mobil Polyrex EM; Shell Gadus; Lubrax Industrial; Outro', valor_esperado: 'Mobil Polyrex EM', observacao_regra: 'SE_OUTRO', evidencia_regra: 'SE_OUTRO' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-LUB-3', 'MDL-WEG-LUB-001', 'IT-MANCAL-D', 'Registrar quantidade de graxa no mancal dianteiro', true, false, 3, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'g', valor_min: '10', valor_max: '30', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-LUB-4', 'MDL-WEG-LUB-001', 'IT-MANCAL-T', 'Registrar quantidade de graxa no mancal traseiro', true, false, 4, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'g', valor_min: '10', valor_max: '30', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-LUB-5', 'MDL-WEG-LUB-001', 'IT-RUIDO', 'Verificar ruido anormal apos lubrificacao', true, false, 5, 'ATIVO', { tipo_resposta: 'OK_NOK', critico: true, observacao_regra: 'SE_NOK', evidencia_regra: 'SE_NOK' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-LUB-6', 'MDL-WEG-LUB-001', 'IT-PROTECAO', 'Verificar protecao mecanica instalada', true, true, 6, 'ATIVO', { tipo_resposta: 'OK_NOK', critico: true, evidencia_regra: 'SEMPRE' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-INSP-1', 'MDL-WEG-INSP-001', 'IT-TENSAO', 'Medir tensao de alimentacao', true, false, 1, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'V', valor_min: '200', valor_max: '240', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-INSP-2', 'MDL-WEG-INSP-001', 'IT-CORRENTE', 'Medir corrente do motor', true, false, 2, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: 'A' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-INSP-3', 'MDL-WEG-INSP-001', 'IT-TEMP', 'Verificar temperatura da carcaca', true, false, 3, 'ATIVO', { tipo_resposta: 'NUMERICO', unidade: '°C', valor_max: '80', evidencia_regra: 'FORA_LIMITE', observacao_regra: 'FORA_LIMITE' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-INSP-4', 'MDL-WEG-INSP-001', 'IT-VIB', 'Verificar vibracao perceptivel', true, false, 4, 'ATIVO', { tipo_resposta: 'OK_NOK', critico: true, observacao_regra: 'SE_NOK' }));
    appendRow('checklist_modelo_itens', checklistModelItem('MIT-WEG-INSP-5', 'MDL-WEG-INSP-001', 'IT-OBS', 'Registrar observacoes gerais', false, false, 5, 'ATIVO', { tipo_resposta: 'TEXTO', observacao_regra: 'NUNCA' }));
  }

  function appendWorkflowSeeds(createdAt) {
    workflowDefaults(createdAt).forEach(function (row) {
      appendRow('workflow_regras', row);
    });
  }

  function appendModuleSeeds(createdAt) {
    moduleSeedRows(createdAt).forEach(function (row) {
      appendRow('modulos', row);
    });
    moduleProfileSeedRows(createdAt).forEach(function (row) {
      appendRow('modulo_perfis', row);
    });
  }

  function appendModuleSeedsIfMissing(createdAt) {
    moduleSeedRows(createdAt).forEach(function (row) {
      appendIfMissing('modulos', row.id, row);
    });
    moduleProfileSeedRows(createdAt).forEach(function (row) {
      appendIfMissing('modulo_perfis', row.id, row);
    });
  }

  function moduleSeedRows(date) {
    return MODULE_DEFINITIONS.map(function (item, index) {
      return {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        menu_ids: item.menu_ids.join(','),
        permissoes: item.permissoes.join(','),
        status: 'ATIVO',
        ordem: index + 1,
        atualizado_em: date
      };
    });
  }

  function moduleProfileSeedRows(date) {
    var rows = [];
    MODULE_DEFINITIONS.forEach(function (module) {
      ['Operador', 'Gestor', 'Admin'].forEach(function (profile) {
        rows.push(moduleProfileRow(module.id, profile, defaultModuleEnabled(module.id, profile), defaultBlockedPermissions(module.id, profile).join(','), date));
      });
    });
    return rows;
  }

  function moduleProfileRow(moduleId, profile, enabled, blockedPermissions, date) {
    return {
      id: moduleId + '-' + profile,
      modulo_id: moduleId,
      perfil: profile,
      liberado: profile === 'Admin' ? true : Boolean(enabled),
      permissoes_bloqueadas: profile === 'Admin' ? '' : (blockedPermissions || ''),
      atualizado_em: date
    };
  }

  function defaultModuleEnabled(moduleId, profile) {
    if (profile === 'Admin') return true;
    var enabled = {
      Operador: ['painel', 'ordens_servico', 'checklists', 'qr_code'],
      Gestor: ['painel', 'ordens_servico', 'checklists', 'cadastros', 'usuarios', 'kpis', 'qr_code']
    };
    return (enabled[profile] || []).indexOf(moduleId) >= 0;
  }

  function defaultBlockedPermissions(moduleId, profile) {
    if (profile === 'Operador' && moduleId === 'ordens_servico') return ['criar_os', 'editar_os_pre_execucao', 'aprovar_os', 'reabrir_os'];
    if (profile === 'Operador' && moduleId === 'checklists') return ['editar_checklist_padrao'];
    if (profile === 'Gestor' && moduleId === 'usuarios') return ['criar_usuario'];
    return [];
  }

  function workflowDefaults(date) {
    return [
      workflowRule('WFL-INICIAR', 'INICIAR_OS', 'Iniciar execucao', 'LIBERADA,REABERTA', 'EM_EXECUCAO', 'iniciar_os', 'Operador,Gestor,Admin', true, false, 'ATIVO', date),
      workflowRule('WFL-FINALIZAR', 'FINALIZAR_EXECUCAO', 'Finalizar execucao', 'EM_EXECUCAO', 'AGUARDANDO_APROVACAO', 'finalizar_execucao', 'Operador,Gestor,Admin', true, true, 'ATIVO', date),
      workflowRule('WFL-APROVAR', 'APROVAR_OS', 'Aprovar OS', 'AGUARDANDO_APROVACAO', 'CONCLUIDA', 'aprovar_os', 'Gestor,Admin', false, true, 'ATIVO', date),
      workflowRule('WFL-REABRIR', 'REABRIR_OS', 'Reabrir OS', 'AGUARDANDO_APROVACAO', 'REABERTA', 'reabrir_os', 'Gestor,Admin', false, false, 'ATIVO', date)
    ];
  }

  function workflowRule(id, acao, nome, statusOrigem, statusDestino, permissao, perfis, exigeResponsavel, exigeChecklistOk, status, atualizadoEm) {
    return {
      id: id,
      acao: acao,
      nome: nome,
      status_origem: statusOrigem,
      status_destino: statusDestino,
      permissao: permissao,
      perfis: perfis,
      exige_responsavel: exigeResponsavel,
      exige_checklist_ok: exigeChecklistOk,
      status: status,
      atualizado_em: atualizadoEm
    };
  }

  function referencesFor(user) {
    var users = readRows('usuarios');
    if (user.perfil === 'Operador') {
      users = users.filter(function (item) { return item.id === user.id; });
    }
    return {
      plantas: getPlants(),
      setores: readRows('setores'),
      linhas: readRows('linhas'),
      equipamentos: readRows('equipamentos'),
      componentes: readRows('componentes'),
      parametros_equipamento: readRows('parametros_equipamento'),
      leituras_parametros: readRows('leituras_parametros'),
      historico_componentes: readRows('historico_componentes'),
      versionamento: readRows('versionamento'),
      modulos: getModules(),
      modulo_perfis: getModuleProfiles(),
      definicoes_modulos: MODULE_DEFINITIONS,
      checklist_modelos: readRows('checklist_modelos'),
      checklist_modelo_itens: readRows('checklist_modelo_itens'),
      workflow_regras: getWorkflowRules(),
      workflow_acoes: WORKFLOW_ACTIONS,
      usuarios: users.map(sanitizeUser),
      status_fluxo: STATUS_FLUXO
    };
  }


  function referencesForLight(user, ordens) {
    var ativoIds = uniqueValues(ordens.map(function (os) { return os.ativo_id; }));
    var componenteIds = uniqueValues(ordens.map(function (os) { return os.componente_id; }));
    var userIds = uniqueValues(ordens.map(function (os) { return os.responsavel; }).concat(ordens.map(function (os) { return os.solicitante; })).concat([user.id]));
    return {
      plantas: [],
      setores: [],
      linhas: [],
      equipamentos: [],
      componentes: [],
      parametros_equipamento: [],
      leituras_parametros: [],
      historico_componentes: [],
      versionamento: [],
      modulos: getModules(),
      modulo_perfis: [],
      definicoes_modulos: MODULE_DEFINITIONS,
      checklist_modelos: [],
      checklist_modelo_itens: [],
      workflow_regras: getWorkflowRules(),
      workflow_acoes: WORKFLOW_ACTIONS,
      usuarios: readRows('usuarios').filter(function (item) { return userIds.indexOf(item.id) >= 0 || user.perfil !== 'Operador'; }).map(sanitizeUser),
      status_fluxo: STATUS_FLUXO
    };
  }

  function uniqueValues(values) {
    var out = [];
    values.forEach(function (value) {
      value = String(value || '');
      if (value && out.indexOf(value) < 0) out.push(value);
    });
    return out;
  }

  function enabledModulesForProfile(perfil) {
    return getModuleProfiles().filter(function (item) {
      return item.perfil === perfil && String(item.status || 'ATIVO') === 'ATIVO';
    }).map(function (item) { return item.modulo_id; });
  }

  function validateChecklist(osId) {
    var pendencias = [];
    readRows('checklist_execucao').filter(function (item) { return item.os_id === osId; }).forEach(function (item) {
      var itemPendencias = validateChecklistItem(item);
      itemPendencias.forEach(function (msg) { pendencias.push(item.pergunta + ': ' + msg); });
    });
    return { valido: pendencias.length === 0, pendencias: pendencias };
  }

  function validateChecklistItem(item) {
    normalizeChecklistRecordInPlace(item);
    var pendencias = [];
    var resposta = String(item.resposta || '').trim();
    var observacao = String(item.observacao || '').trim();
    var evidencia = String(item.evidencia || '').trim();
    var foraLimite = checklistValueOutOfRange(item);
    if (toBool(item.obrigatorio) && !resposta) pendencias.push('resposta obrigatoria pendente');
    if (item.tipo_resposta === 'NUMERICO' || item.tipo_resposta === 'LEITURA_TECNICA') {
      if (resposta && isNaN(Number(resposta.replace(',', '.')))) pendencias.push('valor numerico invalido');
      if (foraLimite && requiresByRule(item.observacao_regra, item) && !observacao) pendencias.push('observacao obrigatoria para valor fora do limite');
    }
    if (item.resposta === 'NAO_OK' && (requiresByRule(item.observacao_regra, item) || toBool(item.critico)) && !observacao) pendencias.push('observacao obrigatoria para NAO OK');
    if (item.tipo_resposta === 'SELECT' && resposta === 'Outro' && requiresByRule(item.observacao_regra, item) && !observacao) pendencias.push('observacao obrigatoria para opcao Outro');
    if (requiresByRule(item.evidencia_regra, item) && !evidencia) pendencias.push('evidencia obrigatoria ausente');
    if (toBool(item.critico) && item.resposta === 'NAO_OK') pendencias.push('item critico NOK bloqueia finalizacao');
    item.status_item = pendencias.length ? 'PENDENTE' : (foraLimite ? 'ALERTA' : (resposta ? 'OK' : 'PENDENTE'));
    return pendencias;
  }

  function checklistValueOutOfRange(item) {
    var tipo = String(item.tipo_resposta || 'OK_NOK').toUpperCase();
    if (tipo !== 'NUMERICO' && tipo !== 'LEITURA_TECNICA') return false;
    var resposta = String(item.resposta || '').trim();
    if (!resposta) return false;
    var value = Number(resposta.replace(',', '.'));
    if (isNaN(value)) return true;
    var minRaw = String(item.valor_min || '').trim();
    var maxRaw = String(item.valor_max || '').trim();
    var min = minRaw ? Number(minRaw.replace(',', '.')) : null;
    var max = maxRaw ? Number(maxRaw.replace(',', '.')) : null;
    return (min !== null && !isNaN(min) && value < min) || (max !== null && !isNaN(max) && value > max);
  }

  function requiresByRule(rule, item) {
    var normalized = String(rule || 'NUNCA').toUpperCase();
    if (normalized === 'SEMPRE') return true;
    if (normalized === 'SE_NOK') return item.resposta === 'NAO_OK';
    if (normalized === 'FORA_LIMITE') return checklistValueOutOfRange(item);
    if (normalized === 'SE_OUTRO') return String(item.resposta || '') === 'Outro';
    return false;
  }

  function getPlants() {
    var rows = readRows('plantas');
    if (!rows.length) {
      var fallback = { id: 'PLT-SCS', nome: 'SCS Industria', cnpj: '00.000.000/0001-00', cidade: 'Sao Paulo', uf: 'SP', status: 'ATIVO' };
      appendRow('plantas', fallback);
      rows = [fallback];
    }
    return rows;
  }

  function getWorkflowRules() {
    var rows = readRows('workflow_regras');
    if (!rows.length) {
      rows = workflowDefaults(nowIso());
      rows.forEach(function (row) { appendRow('workflow_regras', row); });
    }
    return rows;
  }

  function findWorkflowRule(user, os, acao) {
    var rows = getWorkflowRules().filter(function (item) {
      return item.status === 'ATIVO'
        && item.acao === acao
        && splitCsv(item.status_origem).indexOf(os.status) >= 0
        && splitCsv(item.perfis).indexOf(user.perfil) >= 0;
    });
    if (!rows.length) {
      throw apiError(422, 'Fluxo bloqueado: nao existe regra ativa para ' + acao + ' a partir de ' + os.status + ' para ' + user.perfil + '.');
    }
    return rows[0];
  }

  function assertWorkflow(user, os, acao) {
    var regra = findWorkflowRule(user, os, acao);
    requirePermission(user, regra.permissao, 'ordens_servico', os.id);
    if (toBool(regra.exige_responsavel) && user.perfil === 'Operador' && os.responsavel !== user.id) {
      throw apiError(403, 'Fluxo bloqueado: OS nao atribuida ao operador logado.');
    }
    if (toBool(regra.exige_checklist_ok)) {
      var validacao = validateChecklist(os.id);
      if (!validacao.valido) {
        var err = apiError(422, 'Fluxo bloqueado: existem ' + validacao.pendencias.length + ' pendencias no checklist.');
        err.details = validacao.pendencias;
        throw err;
      }
    }
    return regra;
  }

  function splitCsv(value) {
    return String(value || '').split(',').map(function (item) {
      return String(item || '').trim();
    }).filter(function (item) {
      return Boolean(item);
    });
  }

  function normalizeCsv(value) {
    var result = [];
    splitCsv(value).forEach(function (item) {
      if (result.indexOf(item) < 0) result.push(item);
    });
    return result;
  }

  function hasAction(acao) {
    return WORKFLOW_ACTIONS.some(function (item) { return item.acao === acao; });
  }

  function workflowActionName(acao) {
    var action = find(WORKFLOW_ACTIONS, function (item) { return item.acao === acao; });
    return action ? action.nome : acao;
  }

  function allValidStatus(items) {
    return items.every(function (item) { return STATUS_FLUXO.indexOf(item) >= 0; });
  }

  function hasPermissionDefinition(chave) {
    return PERMISSION_DEFINITIONS.some(function (item) { return item.chave === chave; });
  }

  function resolveChecklistModelForOs(tipo, explicitModelId) {
    var modelos = readRows('checklist_modelos');
    if (explicitModelId) {
      var selected = find(modelos, function (item) { return item.id === explicitModelId; });
      if (!selected || selected.status !== 'ATIVO') {
        throw apiError(422, 'Nao foi possivel criar OS: modelo de checklist inexistente ou inativo.');
      }
      if (selected.tipo_os !== tipo) {
        throw apiError(422, 'Nao foi possivel criar OS: modelo de checklist nao pertence ao tipo de OS selecionado.');
      }
      return selected;
    }
    var modelosTipo = modelos.filter(function (item) { return item.tipo_os === tipo && item.status === 'ATIVO'; })
      .sort(function (a, b) { return String(b.criado_em || '').localeCompare(String(a.criado_em || '')) || Number(b.versao || 0) - Number(a.versao || 0); });
    var modelosAtivos = modelos.filter(function (item) { return item.status === 'ATIVO'; })
      .sort(function (a, b) { return String(b.criado_em || '').localeCompare(String(a.criado_em || '')) || Number(b.versao || 0) - Number(a.versao || 0); });
    return modelosTipo[0] || modelosAtivos[0];
  }

  function createChecklistForOs(os) {
    var itensModelo = readRows('checklist_modelo_itens');
    var modelo = os.checklist_modelo_id
      ? resolveChecklistModelForOs(os.tipo, os.checklist_modelo_id)
      : resolveChecklistModelForOs(os.tipo, '');
    var base = modelo
      ? itensModelo.filter(function (item) { return item.modelo_id === modelo.id && item.status === 'ATIVO'; }).sort(function (a, b) { return Number(a.ordem || 0) - Number(b.ordem || 0); })
      : [
        { item_id: 'IT-SEG', pergunta: 'Energia bloqueada e area isolada', obrigatorio: true, evidencia_obrigatoria: false },
        { item_id: 'IT-EXEC', pergunta: os.tipo + ' executada conforme instrucao', obrigatorio: true, evidencia_obrigatoria: os.criticidade === 'A' },
        { item_id: 'IT-TESTE', pergunta: 'Teste operacional realizado', obrigatorio: true, evidencia_obrigatoria: false }
      ];
    base.forEach(function (row, index) {
      appendRow('checklist_execucao', checklistItem(newId('CHK') + '-' + (index + 1), os.id, row.item_id, row.pergunta, row.obrigatorio, '', '', '', row.evidencia_obrigatoria, '', '', row));
    });
  }

  function buildDashboard(user, orders) {
    var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var abertas = 0;
    var andamento = 0;
    var pendentes = 0;
    var atrasadas = 0;
    var backlog = 0;
    var criticidadeA = 0;
    var aguardandoAprovacao = 0;
    orders.forEach(function (os) {
      var final = ['CONCLUIDA', 'CANCELADA'].indexOf(os.status) >= 0;
      if (!final) abertas++;
      if (os.status === 'EM_EXECUCAO') andamento++;
      if (['LIBERADA', 'REABERTA', 'AGUARDANDO_APROVACAO'].indexOf(os.status) >= 0) pendentes++;
      if (os.prazo && os.prazo < today && !final) atrasadas++;
      if (['RASCUNHO', 'PLANEJADA', 'LIBERADA', 'REABERTA'].indexOf(os.status) >= 0) backlog++;
      if (os.criticidade === 'A' && !final) criticidadeA++;
      if (os.status === 'AGUARDANDO_APROVACAO') aguardandoAprovacao++;
    });
    return { abertas: abertas, andamento: andamento, pendentes: pendentes, atrasadas: atrasadas, backlog: backlog, criticidadeA: criticidadeA, aguardandoAprovacao: aguardandoAprovacao };
  }

  function canSeeOs(user, os) {
    return user.perfil !== 'Operador' || os.responsavel === user.id;
  }

  function requireSession(payload) {
    var token = payload && payload.token;
    var user = find(readRows('usuarios'), function (item) {
      return item.token && item.token === token && item.status === 'ATIVO';
    });
    if (!user) throw apiError(401, 'Sessao invalida. Faca login novamente.');
    return user;
  }

  function requirePermission(user, permission, modulo, registroId) {
    var matrix = getPermissionMatrix();
    if (!matrix[user.perfil] || !matrix[user.perfil][permission]) {
      audit(user.id, user.perfil, 'TENTATIVA_NEGADA', modulo, registroId || '', '', { permission: permission });
      throw apiError(403, 'Acesso bloqueado: seu perfil nao possui permissao para esta acao.');
    }
  }

  function getPermissionMatrix() {
    var matrix = { Operador: {}, Gestor: {}, Admin: {} };
    ['Operador', 'Gestor', 'Admin'].forEach(function (perfil) {
      PERMISSION_DEFINITIONS.forEach(function (item) {
        matrix[perfil][item.chave] = Boolean(PERMISSOES[perfil] && PERMISSOES[perfil][item.chave]);
      });
    });

    readRows('permissoes').forEach(function (row) {
      if (matrix[row.perfil] && row.chave) {
        matrix[row.perfil][row.chave] = toBool(row.liberado);
      }
    });

    PERMISSION_DEFINITIONS.forEach(function (item) {
      matrix.Admin[item.chave] = true;
    });
    matrix.Operador.login = true;
    matrix.Operador.dashboard = true;
    matrix.Gestor.login = true;
    matrix.Gestor.dashboard = true;
    return matrix;
  }

  function menuForProfile(profile, permissions) {
    if (profile === 'Admin') return menuFor('Admin');
    var rules = {
      dashboard: ['dashboard'],
      'minhas-os': ['minhas_os'],
      'historico-pessoal': ['minhas_os'],
      comunicacoes: ['minhas_os'],
      'meu-perfil': ['login'],
      sair: ['login'],
      'qr-code': ['qr'],
      usuarios: ['criar_usuario'],
      permissoes: ['alterar_permissao'],
      cadastros: ['cadastrar_equipamento'],
      configuracoes: ['configurar_fluxo'],
      auditoria: ['ver_audit_log'],
      backup: ['backup'],
      integracoes: ['configurar_fluxo'],
      versionamento: ['backup', 'ver_audit_log'],
      'relatorios-gerais': ['ver_relatorios'],
      'gestao-os': ['criar_os', 'editar_os_pre_execucao', 'aprovar_os', 'reabrir_os'],
      programacao: ['criar_os', 'editar_os_pre_execucao'],
      acompanhamento: ['aprovar_os', 'reabrir_os', 'ver_relatorios'],
      relatorios: ['ver_relatorios'],
      equipamentos: ['cadastrar_equipamento'],
      checklists: ['editar_checklist_padrao', 'preencher_checklist'],
      'usuarios-view': ['ver_usuarios']
    };
    return MENU_CATALOG.filter(function (item) {
      var needed = rules[item[0]] || ['login'];
      for (var i = 0; i < needed.length; i++) {
        if (permissions[needed[i]]) return true;
      }
      return false;
    }).map(function (item) {
      return { id: item[0], label: item[1] };
    });
  }

  function ensureAllSheets() {
    Object.keys(SHEETS).forEach(function (name) {
      ensureSheet(name);
    });
  }

  function ensureSheet(name) {
    var ss = SpreadsheetApp.getActive();
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    var headers = SHEETS[name];
    if (sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      return sheet;
    }
    var currentWidth = Math.max(sheet.getLastColumn(), headers.length);
    var current = sheet.getRange(1, 1, 1, currentWidth).getValues()[0];
    var emptyHeader = current.slice(0, headers.length).every(function (header) { return !header; });
    if (emptyHeader) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      return sheet;
    }
    var needsMigration = headers.some(function (header, index) {
      return current[index] !== header;
    });
    if (needsMigration) {
      var oldHeaders = current.filter(function (header) { return Boolean(header); });
      var oldRows = [];
      var lastRow = sheet.getLastRow();
      if (lastRow > 1 && oldHeaders.length) {
        oldRows = sheet.getRange(2, 1, lastRow - 1, oldHeaders.length).getValues().map(function (row) {
          var obj = {};
          oldHeaders.forEach(function (header, index) {
            obj[header] = row[index];
          });
          return headers.map(function (header) {
            return obj[header] === undefined ? migrationDefault(name, header) : obj[header];
          });
        });
      }
      sheet.clear();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      if (oldRows.length) sheet.getRange(2, 1, oldRows.length, headers.length).setValues(oldRows);
    } else {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    sheet.setFrozenRows(1);
    return sheet;
  }

  function migrationDefault(sheetName, header) {
    if (sheetName === 'setores' && header === 'planta_id') return 'PLT-SCS';
    if (sheetName === 'setores' && header === 'responsavel') return '';
    if (sheetName === 'linhas' && header === 'capacidade') return '';
    if (sheetName === 'equipamentos' && ['fabricante', 'modelo', 'numero_serie', 'data_instalacao', 'horimetro_atual', 'descricao'].indexOf(header) >= 0) return '';
    if (sheetName === 'ordens_servico' && header === 'checklist_modelo_id') return '';
    return '';
  }

  function readRows(name) {
    var sheet = ensureSheet(name);
    var headers = SHEETS[name];
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    return values.map(function (row) {
      var obj = {};
      headers.forEach(function (header, index) {
        obj[header] = normalizeCell(row[index]);
      });
      return obj;
    });
  }

  function appendRow(name, obj) {
    var sheet = ensureSheet(name);
    var headers = SHEETS[name];
    sheet.appendRow(headers.map(function (header) {
      return obj[header] === undefined ? '' : obj[header];
    }));
  }

  function clearDataRows(name) {
    var sheet = ensureSheet(name);
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
  }

  function updateById(name, id, obj) {
    var sheet = ensureSheet(name);
    var headers = SHEETS[name];
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) throw apiError(404, 'Registro nao encontrado: ' + id);
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(id)) {
        sheet.getRange(i + 2, 1, 1, headers.length).setValues([headers.map(function (header) {
          return obj[header] === undefined ? '' : obj[header];
        })]);
        return;
      }
    }
    throw apiError(404, 'Registro nao encontrado: ' + id);
  }

  function upsertById(name, obj) {
    try {
      updateById(name, obj.id, obj);
    } catch (error) {
      if (error.status === 404) appendRow(name, obj);
      else throw error;
    }
  }

  function deleteRowsWhere(name, predicate) {
    var sheet = ensureSheet(name);
    var rows = readRows(name);
    for (var i = rows.length - 1; i >= 0; i--) {
      if (predicate(rows[i])) sheet.deleteRow(i + 2);
    }
  }

  function findById(name, id) {
    return find(readRows(name), function (item) { return item.id === id; });
  }

  function audit(usuario, perfil, acao, modulo, registroId, antes, depois) {
    appendRow('audit_log', {
      id: newId('AUD'),
      usuario: usuario || 'ANONIMO',
      perfil: perfil || '',
      acao: acao,
      modulo: modulo,
      registro_id: registroId || '',
      antes: antes ? JSON.stringify(antes) : '',
      depois: depois ? JSON.stringify(depois) : '',
      data_hora: nowIso()
    });
  }

  function addHistorico(os, acao, usuario, resumo) {
    appendRow('historico', {
      id: newId('HIS'),
      os_id: os.id,
      ativo_id: os.ativo_id,
      acao: acao,
      usuario: usuario,
      data_hora: nowIso(),
      resumo: resumo
    });
  }

  function addEvento(osId, tipo, usuario, resumo) {
    appendRow('eventos', {
      id: newId('EVT'),
      os_id: osId,
      tipo: tipo,
      usuario: usuario,
      resumo: resumo,
      data_hora: nowIso()
    });
  }

  function json(value) {
    return ContentService
      .createTextOutput(JSON.stringify(value))
      .setMimeType(ContentService.MimeType.JSON);
  }

  function apiError(status, message) {
    var error = new Error(message);
    error.status = status;
    return error;
  }

  function newId(prefix) {
    return prefix + '-' + Utilities.getUuid().split('-')[0].toUpperCase();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeReadingValue(value) {
    var text = String(value === undefined || value === null ? '' : value).trim().replace(',', '.');
    if (!text) throw apiError(400, 'Nao foi possivel registrar leitura: valor obrigatorio.');
    var number = Number(text);
    if (!isFinite(number)) throw apiError(400, 'Nao foi possivel registrar leitura: valor numerico invalido.');
    return String(number);
  }

  function normalizeOptionalReadingValue(value, label) {
    var text = String(value === undefined || value === null ? '' : value).trim().replace(',', '.');
    if (!text) return '';
    var number = Number(text);
    if (!isFinite(number)) throw apiError(400, 'Nao foi possivel registrar evento: ' + label + ' numerico invalido.');
    return String(number);
  }

  function optionalNumber(value) {
    var text = String(value === undefined || value === null ? '' : value).trim().replace(',', '.');
    if (!text) return NaN;
    var number = Number(text);
    return isFinite(number) ? number : NaN;
  }

  function calculateParameterStatus(parametro, rawValue) {
    var value = optionalNumber(rawValue);
    var min = optionalNumber(parametro.limite_min);
    var max = optionalNumber(parametro.limite_max);
    if (!isFinite(value)) return 'NORMAL';
    if ((isFinite(min) && value < min) || (isFinite(max) && value > max)) return 'CRITICO';
    if (isFinite(max) && max > 0 && value >= max * 0.9) return 'ATENCAO';
    if (isFinite(min) && min > 0 && value <= min * 1.1) return 'ATENCAO';
    return 'NORMAL';
  }

  function hashPassword(value) {
    var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
    return digest.map(function (byte) {
      var value = (byte < 0 ? byte + 256 : byte).toString(16);
      return value.length === 1 ? '0' + value : value;
    }).join('');
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

  function sanitizeUser(user) {
    var copy = clone(user);
    delete copy.senha_hash;
    delete copy.token;
    return copy;
  }

  function menuFor(perfil) {
    return (MENUS[perfil] || []).map(function (item) {
      return { id: item[0], label: item[1] };
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function find(items, predicate) {
    for (var i = 0; i < items.length; i++) {
      if (predicate(items[i])) return items[i];
    }
    return null;
  }

  function toBool(value) {
    return value === true || value === 'true' || value === 'TRUE' || value === 'SIM' || value === '1';
  }

  function normalizeCell(value) {
    if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    return value === null || value === undefined ? '' : value;
  }

  function seedUser(id, nome, email, perfil, setor, createdAt) {
    return {
      id: id,
      nome: nome,
      email: email,
      senha_hash: hashPassword('123456'),
      token: '',
      perfil: perfil,
      status: 'ATIVO',
      setor: setor,
      criado_em: createdAt
    };
  }

  function seedOs(id, ativoId, componenteId, tipo, prioridade, criticidade, status, prazo, descricao, instrucoes, createdAt) {
    return {
      id: id,
      ativo_id: ativoId,
      componente_id: componenteId,
      tipo: tipo,
      checklist_modelo_id: tipo === 'Corretiva' ? 'MDL-COR-001' : (tipo === 'Preventiva' ? 'MDL-PREV-001' : (tipo === 'Inspecao' ? 'MDL-INSP-001' : '')),
      prioridade: prioridade,
      criticidade: criticidade,
      status: status,
      solicitante: 'USR-GESTOR',
      responsavel: 'USR-OPERADOR',
      prazo: prazo,
      descricao: descricao,
      instrucoes: instrucoes,
      criado_em: createdAt,
      iniciado_em: status === 'EM_EXECUCAO' || status === 'AGUARDANDO_APROVACAO' ? createdAt : '',
      finalizado_em: status === 'AGUARDANDO_APROVACAO' ? createdAt : '',
      aprovado_em: ''
    };
  }

  function checklistItem(id, osId, itemId, pergunta, obrigatorio, resposta, observacao, evidencia, evidenciaObrigatoria, responsavel, dataHora, extra) {
    var normalized = normalizeChecklistDefinition(extra || {});
    return {
      id: id,
      os_id: osId,
      item_id: itemId,
      pergunta: pergunta,
      obrigatorio: obrigatorio,
      resposta: resposta,
      observacao: observacao,
      evidencia: evidencia,
      evidencia_obrigatoria: evidenciaObrigatoria,
      responsavel: responsavel,
      data_hora: dataHora,
      tipo_resposta: normalized.tipo_resposta,
      unidade: normalized.unidade,
      valor_min: normalized.valor_min,
      valor_max: normalized.valor_max,
      valor_esperado: normalized.valor_esperado,
      opcoes: normalized.opcoes,
      critico: normalized.critico,
      evidencia_regra: normalized.evidencia_regra || (evidenciaObrigatoria ? 'SEMPRE' : 'SE_NOK'),
      observacao_regra: normalized.observacao_regra,
      status_item: normalized.status_item
    };
  }

  function checklistModelItem(id, modeloId, itemId, pergunta, obrigatorio, evidenciaObrigatoria, ordem, status, extra) {
    var normalized = normalizeChecklistDefinition(extra || {});
    return {
      id: id,
      modelo_id: modeloId,
      item_id: itemId,
      pergunta: pergunta,
      obrigatorio: obrigatorio,
      evidencia_obrigatoria: evidenciaObrigatoria,
      ordem: ordem,
      status: status,
      tipo_resposta: normalized.tipo_resposta,
      unidade: normalized.unidade,
      valor_min: normalized.valor_min,
      valor_max: normalized.valor_max,
      valor_esperado: normalized.valor_esperado,
      opcoes: normalized.opcoes,
      critico: normalized.critico,
      evidencia_regra: normalized.evidencia_regra || (evidenciaObrigatoria ? 'SEMPRE' : 'SE_NOK'),
      observacao_regra: normalized.observacao_regra,
      status_item: normalized.status_item
    };
  }

  function normalizeChecklistDefinition(input) {
    var allowedTypes = ['OK_NOK', 'OK_NOK_NA', 'TEXTO', 'NUMERICO', 'SELECT', 'DATA', 'FOTO', 'LEITURA_TECNICA'];
    var tipo = String(input.tipo_resposta || 'OK_NOK').trim().toUpperCase();
    var allowedEvidence = ['NUNCA', 'SEMPRE', 'SE_NOK', 'FORA_LIMITE', 'SE_OUTRO'];
    var allowedObservation = ['NUNCA', 'SE_NOK', 'FORA_LIMITE', 'SE_OUTRO'];
    var evidenciaRegra = String(input.evidencia_regra || '').trim().toUpperCase();
    var observacaoRegra = String(input.observacao_regra || '').trim().toUpperCase();
    return {
      tipo_resposta: allowedTypes.indexOf(tipo) >= 0 ? tipo : 'OK_NOK',
      unidade: input.unidade || '',
      valor_min: input.valor_min || '',
      valor_max: input.valor_max || '',
      valor_esperado: input.valor_esperado || '',
      opcoes: input.opcoes || '',
      critico: toBool(input.critico),
      evidencia_regra: allowedEvidence.indexOf(evidenciaRegra) >= 0 ? evidenciaRegra : '',
      observacao_regra: allowedObservation.indexOf(observacaoRegra) >= 0 ? observacaoRegra : 'SE_NOK',
      status_item: input.status_item || ''
    };
  }

  function normalizeChecklistRecordInPlace(record) {
    var normalized = normalizeChecklistDefinition(record || {});
    record.tipo_resposta = normalized.tipo_resposta;
    record.unidade = record.unidade || normalized.unidade;
    record.valor_min = record.valor_min || normalized.valor_min;
    record.valor_max = record.valor_max || normalized.valor_max;
    record.valor_esperado = record.valor_esperado || normalized.valor_esperado;
    record.opcoes = record.opcoes || normalized.opcoes;
    record.critico = toBool(record.critico);
    record.evidencia_regra = record.evidencia_regra || (toBool(record.evidencia_obrigatoria) ? 'SEMPRE' : 'SE_NOK');
    record.observacao_regra = record.observacao_regra || 'SE_NOK';
    if (record.status_item === undefined) record.status_item = '';
    return record;
  }

  function todayPlus(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return {
    handleGet: handleGet,
    handlePost: handlePost,
    setupInicial: setupInicial
  };
})();

function doGet(e) {
  return SCS.handleGet(e);
}

function doPost(e) {
  return SCS.handlePost(e);
}

function setupInicial() {
  return SCS.setupInicial();
}
