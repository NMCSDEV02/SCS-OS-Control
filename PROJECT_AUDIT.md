# PROJECT_AUDIT.md

Auditoria tecnica do projeto SCS OS Control realizada em 2026-06-02.

Escopo desta auditoria:
- Leitura do frontend HTML/CSS/JavaScript.
- Leitura do mock local.
- Leitura do Apps Script.
- Leitura do schema Google Sheets.
- Leitura do README.
- Leitura dos textos extraidos do blueprint e guia de trabalho.
- Consolidacao do historico de validacoes feitas no projeto.

Restricao aplicada:
- Nenhum codigo de aplicacao foi alterado.
- Nenhum endpoint foi criado.
- Nenhum arquivo existente de app foi refatorado.
- Este arquivo e a unica entrega documental desta etapa.

==================================================
1. VISAO GERAL DO SISTEMA
==================================================

Nome do sistema:
SCS OS Control.

Objetivo principal:
Sistema CMMS industrial mobile-first para controle de ordens de servico, checklist tecnico, QR Code, rastreabilidade de ativos, eventos, auditoria, PCM e KPIs.

Publico usuario:
- Operador de chao de fabrica.
- Gestor / PCM.
- Admin Master.

Problema que resolve:
Organiza a execucao de manutencao industrial por OS vinculada a ativo, checklist e historico, com separacao de acesso por perfil. O operador executa atividades permitidas, o gestor acompanha e aprova operacoes, e o administrador governa usuarios, modulos, regras, cadastros e configuracoes.

Fluxo geral de funcionamento:
1. Usuario acessa o app.
2. Faz login com email e senha.
3. O sistema carrega perfil, permissoes, menu e dados visiveis.
4. Operador visualiza OS permitidas, abre detalhe, inicia execucao, responde checklist, informa evidencias e finaliza.
5. Gestor/PCM cria OS, acompanha programacao, pendencias, KPIs e aprova/reabre OS.
6. Admin Master configura usuarios, permissoes, modulos, cadastros, modelos de checklist, workflow, auditoria, backup, integracoes e versionamento.
7. O QR Code identifica ativos e estruturas relacionadas, abrindo ficha tecnica, parametros, componentes, evidencias e OS pendentes.
8. Acoes importantes geram historico, eventos e audit_log.

Nivel atual de maturidade do projeto:
Protótipo funcional avancado / MVP tecnico em evolucao. O app ja possui fluxo real em mock e Apps Script, versionamento, eventos, rastreabilidade inicial, governanca por modulos e endpoints correspondentes. Ainda existem riscos de producao: ausencia de testes automatizados, evidencia sem upload binario real, seguranca simples, frontend grande em arquivo unico e dependencia direta do Google Sheets como banco.

Tecnologias utilizadas:
- HTML em `index.html`.
- CSS em `assets/css/styles.css`.
- JavaScript Vanilla em `assets/js/app.js`, `api-client.js`, `config.js` e `mock-api.js`.
- Google Apps Script em `apps-script/Code.gs`.
- Google Sheets como banco de dados.
- localStorage para ambiente local/mock.

Como frontend, backend/API e dados se conectam:
- O frontend carrega `config.js`, `mock-api.js`, `api-client.js` e `app.js`.
- `api-client.js` centraliza chamadas via `window.SCSApi.call(action, payload, method)`.
- Se `SCS_CONFIG.apiUrl` esta vazio, as chamadas usam `window.SCSMockApi.request`, com dados persistidos em localStorage.
- Se `SCS_CONFIG.apiUrl` esta preenchido, as chamadas vao para o Web App do Apps Script.
- O Apps Script roteia a action em `dispatch(action, payload)` e persiste dados nas abas do Google Sheets.
- A resposta esperada e envelope JSON `{ ok, data }` ou `{ ok:false, error }`.

==================================================
2. ARQUITETURA ATUAL DO PROJETO
==================================================

Pastas existentes:
- `outputs/`
- `outputs/scs-os-control/`
- `outputs/scs-os-control/apps-script/`
- `outputs/scs-os-control/assets/`
- `outputs/scs-os-control/assets/css/`
- `outputs/scs-os-control/assets/img/`
- `outputs/scs-os-control/assets/js/`
- `outputs/scs-os-control/docs/`
- `work/`

Arquivos principais:
- `outputs/scs-os-control/index.html`
- `outputs/scs-os-control/README.md`
- `outputs/scs-os-control/PROJECT_AUDIT.md`
- `outputs/scs-os-control/docs/PLANILHA_SCHEMA.md`
- `outputs/scs-os-control/apps-script/Code.gs`
- `outputs/scs-os-control/assets/js/config.js`
- `outputs/scs-os-control/assets/js/api-client.js`
- `outputs/scs-os-control/assets/js/mock-api.js`
- `outputs/scs-os-control/assets/js/app.js`
- `outputs/scs-os-control/assets/css/styles.css`
- `outputs/scs-os-control/assets/img/scs-logo.png`
- `outputs/scs-os-control-qr-traceability.png`
- `work/blueprint_text.txt`
- `work/guia_text.txt`
- `work/static-server.ps1`

Relacao entre frontend, mock, API e Apps Script:
- `index.html` monta o ponto unico da aplicacao e importa scripts.
- `config.js` define URL da API, chave de storage e versao atual.
- `api-client.js` escolhe entre mock local e Apps Script real.
- `mock-api.js` simula a API e o banco usando localStorage.
- `app.js` renderiza toda a interface e chama actions da API.
- `Code.gs` implementa as mesmas actions no Apps Script.
- `PLANILHA_SCHEMA.md` documenta abas e campos esperados no Google Sheets.

Como o sistema trata versoes:
- A versao atual aparece em `assets/js/config.js` como `appVersion: "1.5.5"`.
- O mock possui seed `versionamento` com versoes `1.5.1` ate `1.5.5`.
- O Apps Script possui seed equivalente em `appendVersionSeedsIfMissing`.
- O Apps Script executa `syncActiveVersion('VER-1-5-5')` para manter uma unica versao ativa.
- A interface possui view `versionamento`, incluida para Admin.

Como o sistema trata ambiente local/mock:
- `SCS_CONFIG.apiUrl` vazio ativa `SCSMockApi`.
- Dados ficam em localStorage na chave `scs-os-control-local-db-v1`.
- O mock expõe `reset`, `exportDb` e `importDb`.
- Backup local permite exportar/importar JSON do banco local.

Como o sistema trata ambiente real/API:
- Preencher `apiUrl` em `config.js` aponta para Web App Apps Script.
- `api-client.js` usa GET para `os.listar`, `logs.listar` e `permissoes.listar`.
- Demais actions usam POST com JSON serializado como `text/plain;charset=utf-8`.
- O Apps Script implementa `doGet`, `doPost`, `setupInicial` e dispatch de actions.

Arquivo:
`outputs/scs-os-control/index.html`
Funcao:
Entrada do app web.
Principais responsabilidades:
- Define `#app`.
- Define template de login.
- Carrega CSS e JS.
- Inclui botoes de login demo por perfil.
Dependencias:
- `assets/css/styles.css`
- `assets/img/scs-logo.png`
- `assets/js/config.js`
- `assets/js/mock-api.js`
- `assets/js/api-client.js`
- `assets/js/app.js`
Risco de alteracao:
Medio. Mudanca na ordem dos scripts pode quebrar a inicializacao.

Arquivo:
`outputs/scs-os-control/assets/js/config.js`
Funcao:
Configuracao global.
Principais responsabilidades:
- Define `apiUrl`.
- Define `storageKey`.
- Define `appVersion`.
Dependencias:
- Consumido por `api-client.js`, `mock-api.js` e `app.js`.
Risco de alteracao:
Alto. Alterar `apiUrl` ou `storageKey` pode desconectar API ou perder acesso ao mock salvo.

Arquivo:
`outputs/scs-os-control/assets/js/api-client.js`
Funcao:
Cliente central da API.
Principais responsabilidades:
- Alternar mock/API real.
- Montar GET e POST.
- Validar resposta vazia.
- Validar JSON invalido.
- Converter erro de API em `Error`.
Dependencias:
- `window.SCS_CONFIG`.
- `window.SCSMockApi`.
- `fetch`.
Risco de alteracao:
Alto. E o ponto de integracao entre toda UI e backend.

Arquivo:
`outputs/scs-os-control/assets/js/mock-api.js`
Funcao:
API local e banco mock em localStorage.
Principais responsabilidades:
- Seed completo de dados.
- Regras de permissao.
- Regras de workflow.
- Endpoints mock.
- Validacao de checklist.
- Eventos, historico, auditoria e versionamento.
- Export/import/reset de banco local.
Dependencias:
- `window.SCS_CONFIG.storageKey`.
- localStorage.
Risco de alteracao:
Alto. O mock espelha contratos da API real; divergencia quebra testes locais.

Arquivo:
`outputs/scs-os-control/assets/js/app.js`
Funcao:
Aplicacao frontend completa.
Principais responsabilidades:
- Login/logout.
- Estado da sessao.
- Renderizacao de dashboards, OS, checklist, cadastros, QR, eventos, usuarios, modulos, workflow, auditoria, backup, integracoes e versionamento.
- Scanner QR via camera.
- Fallback manual de QR.
- Captura de evidencia por arquivo/camera.
- Filtros, navegacao e responsividade comportamental.
Dependencias:
- `window.SCSApi`.
- `window.SCS_CONFIG`.
- DOM.
- `navigator.mediaDevices.getUserMedia`.
- `BarcodeDetector`, quando disponivel.
Risco de alteracao:
Muito alto. Arquivo unico de 3440 linhas concentra grande parte da logica e da UI.

Arquivo:
`outputs/scs-os-control/assets/css/styles.css`
Funcao:
Estilo visual e responsividade.
Principais responsabilidades:
- Tema escuro SCS.
- Login.
- Shell, topbar, sidebar/dock e bottom nav.
- Cards, formularios, tabelas e modais.
- QR, ficha tecnica, componentes, evidencias e eventos.
- Breakpoints mobile em 720, 560 e 425 px.
Dependencias:
- Classes geradas em `app.js`.
Risco de alteracao:
Alto. O CSS possui muitas camadas e correcoes finais de contraste; pequenas mudancas podem recriar sobreposicoes.

Arquivo:
`outputs/scs-os-control/apps-script/Code.gs`
Funcao:
Backend/API Apps Script.
Principais responsabilidades:
- `doGet`, `doPost`, `setupInicial`.
- Criacao/migracao de abas.
- Dispatch de 17 actions.
- Persistencia em Google Sheets.
- Validacao de token, permissao, workflow, checklist e dados obrigatorios.
- Seeds de rastreabilidade, eventos e versionamento.
- Auditoria, historico e eventos.
Dependencias:
- Google Apps Script.
- Google Sheets ativo.
Risco de alteracao:
Muito alto. E o backend real e o contrato de dados.

Arquivo:
`outputs/scs-os-control/docs/PLANILHA_SCHEMA.md`
Funcao:
Documentacao do schema Google Sheets.
Principais responsabilidades:
- Lista abas.
- Lista campos.
- Documenta endpoints de parametros, componentes, eventos, anexos e versionamento.
Dependencias:
- Deve acompanhar `Code.gs` e `mock-api.js`.
Risco de alteracao:
Medio. Documento incorreto induz setup errado da planilha.

Arquivo:
`outputs/scs-os-control/README.md`
Funcao:
Orientacao inicial de uso.
Principais responsabilidades:
- Como rodar localmente.
- Credenciais de teste.
- Como configurar Apps Script.
- Validacao inicial.
Dependencias:
- Deve acompanhar endpoint list real.
Risco de alteracao:
Baixo no codigo, medio na operacao. Lista de endpoints esta parcialmente desatualizada.

Arquivo:
`outputs/scs-os-control/assets/img/scs-logo.png`
Funcao:
Logo visual do sistema.
Principais responsabilidades:
- Marca no login e topbar.
Dependencias:
- HTML/CSS.
Risco de alteracao:
Baixo.

Arquivo:
`outputs/scs-os-control-qr-traceability.png`
Funcao:
Imagem de saida/registro visual da rastreabilidade QR.
Principais responsabilidades:
- Evidencia visual gerada em etapa anterior.
Dependencias:
- Nenhuma dependencia direta no app encontrada.
Risco de alteracao:
Baixo.

Arquivo:
`work/blueprint_text.txt`
Funcao:
Texto extraido do blueprint.
Principais responsabilidades:
- Base documental externa do projeto.
- Define CMMS mobile-first, arquitetura, perfis, OS, QR, checklist, Sheets, API e auditoria.
Dependencias:
- Documento auxiliar, nao carregado pelo app.
Risco de alteracao:
Baixo para runtime, alto para contexto de produto.

Arquivo:
`work/guia_text.txt`
Funcao:
Texto extraido do guia operacional do Codex.
Principais responsabilidades:
- Regra de estabilizacao e restricao contra refatoracao perigosa.
Dependencias:
- Documento auxiliar.
Risco de alteracao:
Baixo para runtime, alto para governanca de desenvolvimento.

==================================================
3. FUNCIONALIDADES JA IMPLEMENTADAS
==================================================

Resumo quantitativo encontrado:
- 23 views/telas mapeadas em `VIEW_TITLES`.
- 17 actions/endpoints logicos no frontend/mock/Apps Script.
- 12 modulos definidos em `MODULE_DEFINITIONS`.
- 20 permissoes definidas em `PERMISSION_DEFINITIONS`.
- 28 abas/datasets previstos em `SHEETS`.
- 6 tags de eventos na central: SLA, Aprovacao, Checklist, Operacao, Tecnico e Sistema.
- 4 actions de workflow default: iniciar, finalizar, aprovar e reabrir.

## Operador mobile

Telas existentes:
- Login.
- Dashboard do operador.
- Minhas OS.
- Detalhe da OS.
- Checklist tecnico da OS.
- QR Code.
- Historico pessoal.
- Comunicacoes.
- Meu perfil.
- Central de eventos/notificacoes via botao superior e bottom nav.

Fluxos existentes:
- Login por perfil.
- Carregar permissoes e menu.
- Ver OS permitidas.
- Abrir OS.
- Iniciar OS.
- Responder checklist por item.
- Informar observacao.
- Anexar evidencia por camera/arquivo com metadados.
- Finalizar execucao.
- Ler QR Code por camera quando suportado.
- Inserir QR manualmente quando camera/BarcodeDetector nao estiver disponivel.
- Abrir ficha tecnica do equipamento por QR.

Acoes disponiveis:
- Navegar por bottom nav no mobile.
- Filtrar minhas OS.
- Abrir OS.
- Iniciar.
- Salvar checklist.
- Finalizar execucao.
- Abrir QR.
- Copiar QR.
- Registrar leitura de parametro se permissao `qr` estiver liberada.
- Registrar evento tecnico de componente se permissao `qr` estiver liberada.

Integracoes existentes:
- API mock via localStorage.
- API real via Apps Script, se `apiUrl` estiver preenchida.
- Camera do navegador via `navigator.mediaDevices.getUserMedia`.
- `BarcodeDetector` para leitura de QR quando suportado.

## OS / Ordem de Servico

Cadastro ou leitura de OS:
- Gestor/Admin podem criar OS em `renderCreateOsForm`.
- Criacao chama `os.criar`.
- OS pode ser criada como rascunho, planejada ou liberada conforme modo do formulario.
- OS referencia ativo/equipamento.
- OS pode referenciar componente.
- OS pode usar modelo de checklist.

Status existentes:
- RASCUNHO
- PLANEJADA
- LIBERADA
- EM_EXECUCAO
- AGUARDANDO_APROVACAO
- CONCLUIDA
- AGUARDANDO_PECA
- AGUARDANDO_LIBERACAO
- REABERTA
- CANCELADA

Filtros existentes:
- Filtro por status.
- Busca textual por ID, descricao, ativo, prioridade e status.
- Filtro de dashboard por status/prioridade/risco.
- Filtro de OS por ativo no backend via `ativo_id`.

Acoes implementadas:
- Criar OS.
- Iniciar OS.
- Salvar checklist.
- Finalizar execucao.
- Aprovar OS.
- Reabrir OS.
- Abrir detalhe da OS.
- Criar OS a partir do equipamento encontrado via QR.

Regras de negocio encontradas:
- Operador ve apenas OS permitidas/atribuidas no backend/mock.
- Toda action operacional valida token.
- Workflow valida permissao, perfil, status de origem, responsavel e checklist quando configurado.
- Finalizacao pode bloquear checklist pendente.
- Historico e eventos sao registrados nas mudancas principais.

## QR Code

O que ja existe:
- View `qr-code`.
- Scanner por camera.
- Fallback manual.
- Seletor de tipo de QR: automatico, equipamento, componente, linha, setor, planta e OS.
- Resolucao de QR por ID ou `qr_code`.
- Ficha tecnica do equipamento.
- Parametros tecnicos.
- Leituras recentes.
- Registro de leitura de parametro.
- Componentes do equipamento.
- Registro de evento tecnico de componente.
- Evidencias associadas ao equipamento.
- OS pendentes do equipamento.
- Historico do ativo e de componentes.
- Copiar QR.
- Imprimir ficha.

Como o QR Code e tratado:
- Frontend normaliza o valor lido/removendo prefixo `SCS://`.
- `findQrTarget` procura em ordens, equipamentos, componentes, linhas, setores e plantas.
- No equipamento, a ficha e montada a partir de referencias carregadas por `os.listar`.
- No momento, a resolucao QR e principalmente frontend; nao ha endpoint dedicado `qr.resolver`.

O que ele identifica:
- OS.
- Equipamento.
- Componente.
- Linha.
- Setor.
- Planta.

O que ainda falta confirmar:
- Resolucao de QR de usuario.
- Geracao visual/exportacao de QR dedicado por ativo.
- Endpoint backend `qr.resolver`.
- Hierarquia fina de autorizacao por tipo de QR.

## Checklist

Estrutura atual:
- Modelos em `checklist_modelos`.
- Itens de modelo em `checklist_modelo_itens`.
- Execucao em `checklist_execucao`.
- Cada item possui pergunta, obrigatoriedade, resposta, observacao, evidencia e evidencia obrigatoria.

Filtros implementados:
- Na tela de checklists, ha listagem de modelos e checklist de OS em execucao.
- Na OS, itens sao filtrados pela OS aberta.
- Na central de eventos, tag Checklist filtra eventos relacionados a checklist.

Grupos implementados:
- Modelos padrao: corretiva, preventiva e inspecao no seed.
- Itens tecnicos por OS.
- Checklist de OS em execucao.
- Eventos de checklist na central.

Validacoes existentes:
- Item obrigatorio sem resposta bloqueia checklist OK.
- Resposta `NAO_OK` exige observacao.
- Item com `evidencia_obrigatoria` exige evidencia.
- Finalizacao de OS pode exigir checklist OK pela regra de workflow.
- Evidencia tem limite de 12 MB no frontend.

Funcionamento regressivo:
- Existe validacao local em `validateLocalChecklist`.
- Existe validacao backend/mock em `validateChecklist`.
- O sistema evita concluir com pendencias quando a regra de workflow exige checklist.

## Eventos / Historico

Eventos ja registrados:
- LOGIN.
- CRIAR_OS.
- INICIAR_OS.
- CHECKLIST.
- FINALIZAR_EXECUCAO.
- APROVAR_OS.
- REABRIR_OS.
- PARAMETRO.
- COMPONENTE.
- CADASTRO.
- MODULOS.
- WORKFLOW.
- PERMISSOES.
- Seeds: ALERTA_ATRASO, APROVACAO, CHECKLIST e STATUS.

Onde sao gravados:
- `historico` para historico de OS/ativo.
- `eventos` para central de eventos/comunicacoes.
- `audit_log` para auditoria administrativa e operacional.

Como sao usados:
- Detalhe da OS mostra historico/eventos.
- Central de eventos agrupa e filtra eventos por tag.
- Dashboard usa dados de OS e referencias para indicadores.
- Auditoria lista registros de `audit_log`.

Seeds/mock existentes:
- `EVT-OS108-ATRASO`.
- `EVT-OS121-APROVACAO`.
- `EVT-OS108-CHECKLIST`.
- `EVT-OS102-STATUS`.

## KPIs / Indicadores

Indicadores ja existentes:
- Total OS.
- Abertas.
- Concluidas.
- Atrasadas.
- Backlog.
- Compliance.
- MTTR.
- MTBF.
- Execucao liberada.
- Checklist.
- Aprovacao.
- SLA.
- Produtividade operacional.
- Distribuicao por status.
- Distribuicao por tipo de manutencao.
- Carga por equipamento.
- Risco e criticidade.

Indicadores parcialmente existentes:
- MTTR e MTBF sao calculados a partir de dados disponiveis, mas dependem de maior volume historico.
- Produtividade/SLA/checklist sao derivados do estado atual das OS.
- Performance de equipamento e criticidade existem como leitura visual, mas ainda nao ha motor analitico robusto.

Dados que ja estao sendo capturados:
- Datas de criacao, inicio, fim e aprovacao da OS.
- Status e prioridade.
- Criticidade.
- Checklist respondido.
- Evidencias.
- Eventos e historico.
- Parametros do equipamento e leituras.
- Historico de componentes.

Dados que ainda faltam para KPIs melhores:
- Horas reais por operador.
- Pausas e retomadas.
- Motivos padronizados de atraso.
- Disponibilidade real do equipamento.
- Calendario de producao.
- MTBF por falha real e periodo.
- Custos e materiais usados.

## Central de eventos

O que existe:
- View `notificacoes`.
- Botao de notificacoes no topbar.
- Atalho mobile no bottom nav.
- Filtros por tags.
- Cards de eventos contextuais.
- Agrupamento por tag.

Como abre:
- Clicando no botao de notificacao.
- Pelo menu quando disponivel.
- Pelo bottom nav em mobile.

O que exibe:
- Atrasos/SLA.
- Aprovacoes pendentes.
- Checklist pendente ou com evidencia.
- Eventos operacionais.
- Alertas tecnicos de parametros.
- Evento de versionamento para Admin.

Como se conecta aos dados:
- Usa `state.data.eventos`.
- Usa OS atrasadas.
- Usa OS aguardando aprovacao.
- Usa parametros com status diferente de NORMAL.
- Usa `referencias.versionamento`.

## Apps Script / API

Endpoints existentes:
- `auth.login`
- `os.listar`
- `os.criar`
- `os.iniciar`
- `checklist.salvar`
- `os.finalizar_execucao`
- `os.aprovar`
- `parametros.registrar_leitura`
- `componentes.registrar_evento`
- `usuarios.salvar`
- `permissoes.listar`
- `permissoes.salvar`
- `modulos.salvar`
- `cadastros.salvar`
- `checklist_modelo.salvar`
- `workflow.salvar`
- `logs.listar`

Acoes existentes:
- Autenticacao.
- Listagem de OS com dados relacionados.
- Criacao e transicao de OS.
- Salvamento de checklist.
- Aprovacao/reabertura.
- Registro de parametro.
- Registro de evento tecnico de componente.
- Salvamento de usuarios, permissoes, modulos, cadastros, modelos e workflow.
- Listagem de logs.

Payloads encontrados:
Mapeados em detalhes na secao 7.

Respostas JSON encontradas:
- Mock e Apps Script retornam envelope `{ ok: true, data }`.
- Erro retorna `{ ok: false, status, error: { message } }`.

Regras de sincronizacao:
- Mock usa `ensureDbShape` para preencher novas estruturas sem apagar dados locais.
- Apps Script usa `ensureSheet` para migrar headers preservando linhas por nome de coluna.
- Versionamento usa `syncActiveVersion`.

Controle de versao ativa:
- Encontrado no mock e Apps Script.
- Versao atual: `1.5.5`.

## Google Sheets

Abas esperadas/encontradas:
- `plantas`
- `setores`
- `linhas`
- `equipamentos`
- `componentes`
- `parametros_equipamento`
- `leituras_parametros`
- `historico_componentes`
- `usuarios`
- `permissoes`
- `modulos`
- `modulo_perfis`
- `listas`
- `config`
- `workflow_regras`
- `checklist_modelos`
- `checklist_modelo_itens`
- `ordens_servico`
- `checklist_execucao`
- `historico`
- `materiais_os`
- `eventos`
- `anexos`
- `kpis_diarios`
- `dashboard_cache`
- `audit_log`
- `sync_log`
- `relatorios`
- `versionamento`

Estrutura de dados detectada:
- Documentada em `docs/PLANILHA_SCHEMA.md`.
- Implementada em `Code.gs` na constante `SHEETS`.

Campos principais:
- OS: id, ativo_id, componente_id, tipo, checklist_modelo_id, prioridade, criticidade, status, solicitante, responsavel, prazo, descricao, instrucoes, datas.
- Equipamento: id, nome, setor_id, linha_id, tipo, fabricante, modelo, numero_serie, horimetro_atual, criticidade, qr_code, status.
- Checklist: os_id, item_id, pergunta, resposta, observacao, evidencia, obrigatoriedade.
- Evento: id, os_id, tipo, usuario, resumo, data_hora.
- Audit log: usuario, perfil, acao, modulo, registro, antes, depois, data_hora.

Relacao entre abas:
- `ordens_servico.ativo_id` referencia `equipamentos.id`.
- `ordens_servico.componente_id` referencia `componentes.id`.
- `equipamentos.setor_id` referencia `setores.id`.
- `equipamentos.linha_id` referencia `linhas.id`.
- `linhas.setor_id` referencia `setores.id`.
- `setores.planta_id` referencia `plantas.id`.
- `componentes.equipamento_id` referencia `equipamentos.id`.
- `parametros_equipamento.equipamento_id` referencia `equipamentos.id`.
- `leituras_parametros.parametro_id` referencia `parametros_equipamento.id`.
- `historico_componentes.componente_id` referencia `componentes.id`.
- `checklist_execucao.os_id` referencia `ordens_servico.id`.
- `historico.os_id` referencia `ordens_servico.id`.
- `eventos.os_id` referencia `ordens_servico.id`.
- `anexos.os_id` referencia `ordens_servico.id`.

==================================================
4. FUNCIONALIDADES VALIDADAS
==================================================

Funcionalidade:
Scripts carregaram sem erro.
Status:
Validado no historico do projeto.
Evidencia encontrada:
Validacao anterior importou `config.js`, `mock-api.js`, `api-client.js` e `app.js` com stubs de navegador e confirmou `appVersion` 1.5.5.
Arquivo relacionado:
`assets/js/config.js`, `assets/js/mock-api.js`, `assets/js/api-client.js`, `assets/js/app.js`.
Observacao:
Nao ha suite automatizada persistida no projeto.

Funcionalidade:
Mock validado com eventos.
Status:
Validado no historico do projeto e confirmado no codigo.
Evidencia encontrada:
Seeds `EVT-OS108-ATRASO`, `EVT-OS121-APROVACAO`, `EVT-OS108-CHECKLIST` e `EVT-OS102-STATUS` em `mock-api.js`.
Arquivo relacionado:
`assets/js/mock-api.js`.
Observacao:
`ensureDbShape` preserva e injeta seeds ausentes.

Funcionalidade:
Localhost abriu sem erro de console.
Status:
Validado no historico do projeto.
Evidencia encontrada:
Historico da execucao no navegador indicou `logsBefore155 []`.
Arquivo relacionado:
`index.html`, `assets/js/app.js`.
Observacao:
Pendente transformar esta validacao em teste automatizado.

Funcionalidade:
Central de eventos abriu no navegador.
Status:
Validado no historico do projeto e confirmado no codigo.
Evidencia encontrada:
Historico indicou abertura da view com titulo "Eventos por tags" e sem erros; funcoes `renderNotificacoes` e `renderEventCenter` existem.
Arquivo relacionado:
`assets/js/app.js`, `assets/css/styles.css`.
Observacao:
Central usa dados de OS, eventos, parametros e versionamento.

Funcionalidade:
Filtro Checklist funcionou e exibiu so o grupo correto.
Status:
Validado no historico do projeto e confirmado no codigo.
Evidencia encontrada:
Historico indicou clique na tag Checklist, `logsFilter155 []` e visualizacao do grupo CHECKLIST; codigo possui `EVENT_TAGS`, `setEventTagFilter` e `renderEventGroups`.
Arquivo relacionado:
`assets/js/app.js`.
Observacao:
O filtro e frontend; nao ha endpoint dedicado `eventos.listar`.

Funcionalidade:
Seeds reais de eventos no mock.
Status:
Confirmado.
Evidencia encontrada:
Array `eventos` em `seedDb` e merge em `ensureDbShape`.
Arquivo relacionado:
`assets/js/mock-api.js`.
Observacao:
Seeds nao duplicam por ID.

Funcionalidade:
Seeds reais no setupInicial do Apps Script.
Status:
Confirmado.
Evidencia encontrada:
`setupInicial` chama `appendEventSeedsIfMissing` e `appendVersionSeedsIfMissing`; eventos sao criados com `appendIfMissing`.
Arquivo relacionado:
`apps-script/Code.gs`.
Observacao:
Tambem ha seeds de rastreabilidade.

Funcionalidade:
Versionamento atualizado para versao atual.
Status:
Confirmado.
Evidencia encontrada:
`config.js` usa `appVersion: "1.5.5"`; mock e Apps Script possuem `VER-1-5-5`; schema documenta versao 1.5.5.
Arquivo relacionado:
`assets/js/config.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`, `docs/PLANILHA_SCHEMA.md`.
Observacao:
README nao lista todos os endpoints novos.

Funcionalidade:
Apps Script sincroniza versao ativa para evitar multiplas versoes ativas.
Status:
Confirmado.
Evidencia encontrada:
Funcao `syncActiveVersion(activeId)` e chamada `syncActiveVersion('VER-1-5-5')`.
Arquivo relacionado:
`apps-script/Code.gs`.
Observacao:
Mock tambem marca versoes anteriores como `REGISTRADO` quando `VER-1-5-5` esta ativo.

Funcionalidade:
QR abre ficha tecnica do equipamento.
Status:
Confirmado no codigo; validacao manual inicial registrada no README.
Evidencia encontrada:
`renderQrResult`, `findQrTarget`, `renderParameterGrid`, `renderComponentTrace`, `renderAssetEvidence`.
Arquivo relacionado:
`assets/js/app.js`, `README.md`.
Observacao:
Nao ha teste automatizado.

Funcionalidade:
Finalizacao bloqueia checklist pendente.
Status:
Confirmado no codigo.
Evidencia encontrada:
`validateChecklist` no mock e Apps Script; `assertWorkflow` exige checklist quando regra ativa requer.
Arquivo relacionado:
`assets/js/mock-api.js`, `apps-script/Code.gs`.
Observacao:
Depende das regras ativas de workflow.

==================================================
5. FUNCIONALIDADES PARCIALMENTE IMPLEMENTADAS
==================================================

Funcionalidade:
Upload real de evidencias.
O que ja existe:
Input de arquivo/camera, limite de 12 MB, nome/metadados salvos em checklist/anexos.
O que falta:
Upload binario real para Google Drive ou outro armazenamento, URL publica/privada do arquivo, controle de permissao do anexo.
Risco atual:
Evidencia visual nao fica armazenada de fato no backend, apenas referencia textual/metadados.
Prioridade:
Alta.
Arquivos envolvidos:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`, `docs/PLANILHA_SCHEMA.md`.

Funcionalidade:
Resolucao backend de QR Code.
O que ja existe:
Resolucao frontend por `findQrTarget`, camera e fallback manual.
O que falta:
Endpoint `qr.resolver` com validacao de token, perfil, permissao e tipo de QR.
Risco atual:
Regra de acesso por tipo de QR fica fraca, pois a resolucao ocorre no frontend.
Prioridade:
Alta.
Arquivos envolvidos:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`.

Funcionalidade:
Hierarquia fina de QR por perfil.
O que ja existe:
Permissao geral `qr` e modulo `qr_code`.
O que falta:
Permissoes por tipo: planta, setor, linha, equipamento, componente, OS e usuario.
Risco atual:
Todos os perfis com `qr` podem tentar resolver estruturas amplas no frontend.
Prioridade:
Alta.
Arquivos envolvidos:
`assets/js/mock-api.js`, `apps-script/Code.gs`, `assets/js/app.js`.

Funcionalidade:
OS pausar/retomar.
O que ja existe:
Workflow possui estados relacionados a espera, mas nao action `os.pausar`.
O que falta:
Endpoint e UI para pausa, motivo, retomada e medicao de tempo improdutivo.
Risco atual:
MTTR/produtividade podem ficar imprecisos.
Prioridade:
Media.
Arquivos envolvidos:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`, schema.

Funcionalidade:
KPIs gerenciais avancados.
O que ja existe:
Cards, barras, donuts e calculos derivados de OS.
O que falta:
Indicadores historicos por periodo, filtros por setor/linha/equipamento e uso de `kpis_diarios`.
Risco atual:
Dashboard analitico pode parecer rico visualmente, mas ainda depende de poucos dados.
Prioridade:
Media.
Arquivos envolvidos:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`.

Funcionalidade:
Central de eventos com filtragem por tags.
O que ja existe:
Tag strip, counts e filtros por SLA/Aprovacao/Checklist/Operacao/Tecnico/Sistema.
O que falta:
Endpoint `eventos.listar`, filtros persistentes e filtros por periodo/usuario/ativo.
Risco atual:
Eventos dependem de `os.listar` e podem crescer demais.
Prioridade:
Media.
Arquivos envolvidos:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`.

Funcionalidade:
Versionamento operacional.
O que ja existe:
View de versionamento, seeds e versao ativa.
O que falta:
Fluxo administrativo de registrar nova versao pela UI, changelog validado, exportacao de release notes.
Risco atual:
Versoes dependem de seed/codigo.
Prioridade:
Baixa.
Arquivos envolvidos:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`.

Funcionalidade:
Backup real.
O que ja existe:
Backup local export/import JSON do mock.
O que falta:
Backup real das abas Google Sheets, restore controlado e auditoria de restore.
Risco atual:
Backup visivel na UI nao protege ambiente real.
Prioridade:
Media.
Arquivos envolvidos:
`assets/js/app.js`, `apps-script/Code.gs`.

Funcionalidade:
Permissoes por modulo versus permissoes legadas.
O que ja existe:
`modulos.salvar` recalcula permissoes; `permissoes.salvar` ainda existe.
O que falta:
Definicao clara de qual tela e fonte de verdade para permissoes.
Risco atual:
Pode haver divergencia conceitual entre matriz antiga e modulo/perfil.
Prioridade:
Alta.
Arquivos envolvidos:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`.

Funcionalidade:
Documentacao de endpoints.
O que ja existe:
README lista endpoints principais; versionamento e integracoes listam endpoints no app.
O que falta:
README ainda nao lista `parametros.registrar_leitura` e `componentes.registrar_evento`.
Risco atual:
Operacao pode configurar Apps Script achando que endpoints novos nao existem.
Prioridade:
Baixa.
Arquivos envolvidos:
`README.md`.

==================================================
6. FUNCIONALIDADES PENDENTES
==================================================

## Prioridade alta

Nome:
Endpoint `qr.resolver`.
Motivo:
Resolver QR no backend com token, perfil, permissao e tipo.
Impacto no sistema:
Fortalece rastreabilidade e seguranca.
Dependencias:
Modelo de permissoes por tipo de QR.
Arquivos provavelmente afetados:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`.

Nome:
Upload real de evidencias.
Motivo:
Guardar foto/arquivo de forma auditavel, nao apenas nome.
Impacto no sistema:
Checklist e aprovacao passam a ter prova real.
Dependencias:
Google Drive ou armazenamento equivalente; schema de anexo com URL/id_arquivo.
Arquivos provavelmente afetados:
`assets/js/app.js`, `apps-script/Code.gs`, `docs/PLANILHA_SCHEMA.md`.

Nome:
Endpoint `eventos.listar`.
Motivo:
Central de eventos deve escalar independente de `os.listar`.
Impacto no sistema:
Melhora performance e permite filtros por tag/periodo.
Dependencias:
Tags persistidas ou derivadas no backend.
Arquivos provavelmente afetados:
`assets/js/app.js`, `assets/js/mock-api.js`, `apps-script/Code.gs`.

Nome:
Governanca final de permissoes.
Motivo:
Definir modulos como fonte principal e matriz como derivada.
Impacto no sistema:
Evita inconsistencias de acesso.
Dependencias:
Regras administrativas.
Arquivos provavelmente afetados:
`assets/js/mock-api.js`, `apps-script/Code.gs`, `assets/js/app.js`.

Nome:
Testes automatizados minimos.
Motivo:
Evitar regressao em actions criticas.
Impacto no sistema:
Mais seguranca para evoluir.
Dependencias:
Harness JS simples ou scripts de validacao.
Arquivos provavelmente afetados:
Nova pasta/arquivo de testes; sem alterar arquitetura pesada.

## Prioridade media

Nome:
Pausar/retomar OS.
Motivo:
Separar tempo parado, aguardando peca e execucao real.
Impacto no sistema:
Melhora MTTR e acompanhamento.
Dependencias:
Workflow e historico.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`, schema.

Nome:
Filtros avancados nos KPIs.
Motivo:
Gestor precisa analisar por periodo, setor, linha e equipamento.
Impacto no sistema:
Melhora uso PCM.
Dependencias:
Dados historicos consistentes.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`.

Nome:
Relatorios exportaveis.
Motivo:
Gerar JSON/CSV de indicadores e auditoria.
Impacto no sistema:
Facilita analise externa.
Dependencias:
Endpoint de relatorios.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`.

Nome:
Cadastro detalhado de parametros por tipo de equipamento.
Motivo:
Padronizar limites e unidades.
Impacto no sistema:
Rastreabilidade tecnica melhora.
Dependencias:
Modelos de parametro.
Arquivos provavelmente afetados:
`app.js`, schema, backend.

Nome:
Historico de componente com filtros.
Motivo:
Encontrar trocas, ajustes e bloqueios rapidamente.
Impacto no sistema:
Melhora manutencao preventiva.
Dependencias:
Eventos tecnicos ja existentes.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`.

## Prioridade baixa

Nome:
Refino visual incremental.
Motivo:
Continuar corrigindo contraste, densidade e layout mobile S/M/L.
Impacto no sistema:
Melhora usabilidade.
Dependencias:
Testes visuais.
Arquivos provavelmente afetados:
`styles.css`, `app.js`.

Nome:
Atualizacao do README.
Motivo:
Documentar endpoints novos.
Impacto no sistema:
Melhora setup.
Dependencias:
Nenhuma tecnica.
Arquivos provavelmente afetados:
`README.md`.

Nome:
Changelog visivel por versao.
Motivo:
Mostrar releases de forma mais operacional.
Impacto no sistema:
Melhora governanca.
Dependencias:
Versionamento atual.
Arquivos provavelmente afetados:
`app.js`, backend.

Nome:
Impressao dedicada de QR.
Motivo:
Hoje `window.print()` imprime a ficha geral.
Impacto no sistema:
Facilita etiquetagem em equipamento.
Dependencias:
Layout de impressao.
Arquivos provavelmente afetados:
`styles.css`, `app.js`.

Nome:
Normalizacao de textos com encoding.
Motivo:
Alguns textos no historico/documentos mostram encoding ruim.
Impacto no sistema:
Melhora qualidade visual/documental.
Dependencias:
Revisao controlada.
Arquivos provavelmente afetados:
Documentos e strings pontuais.

==================================================
7. ENDPOINTS E ACOES DA API
==================================================

Action/Endpoint:
`auth.login`
Objetivo:
Autenticar usuario e carregar perfil, permissoes, modulos e menu.
Metodo ou forma de chamada:
POST no mock/API; chamado por `SCSApi.call("auth.login", { email, senha })`.
Payload esperado:
`{ email, senha }` ou `{ email, password }` no mock.
Resposta esperada:
`{ token, usuario, perfil, permissoes, matriz_permissoes, definicoes_permissoes, definicoes_modulos, modulos, modulo_perfis, menu }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Apps Script aceita hash ou senha em texto conforme valor salvo.

Action/Endpoint:
`os.listar`
Objetivo:
Listar OS visiveis e dados relacionados.
Metodo ou forma de chamada:
GET por `api-client.js` para API real; mock aceita request interno.
Payload esperado:
`{ token, status?, ativo_id? }`.
Resposta esperada:
`{ ordens, checklist, historico, eventos, anexos, referencias, dashboard }`.
Arquivos relacionados:
`api-client.js`, `app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Retorna muitos dados agregados; pode pesar no futuro.

Action/Endpoint:
`os.criar`
Objetivo:
Criar ordem de servico.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, ativo_id, componente_id?, tipo?, checklist_modelo_id?, prioridade, responsavel?, prazo, descricao, instrucoes, modo }`.
Resposta esperada:
`{ id_os, status_inicial, os }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Cria checklist automaticamente a partir de modelo ou fallback.

Action/Endpoint:
`os.iniciar`
Objetivo:
Mover OS para execucao.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, id_os }`.
Resposta esperada:
`{ id_os, status }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Validado por workflow e permissao.

Action/Endpoint:
`checklist.salvar`
Objetivo:
Salvar resposta de item de checklist.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, id_checklist, resposta, observacao, evidencia }`.
Resposta esperada:
`{ item, validacao }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Evidencia e nome/metadado, nao upload binario.

Action/Endpoint:
`os.finalizar_execucao`
Objetivo:
Enviar OS para aprovacao apos execucao.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, id_os }`.
Resposta esperada:
`{ id_os, status }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Pode exigir checklist OK conforme workflow.

Action/Endpoint:
`os.aprovar`
Objetivo:
Aprovar ou reabrir OS.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, id_os, decisao, justificativa? }`.
Resposta esperada:
`{ id_os, status }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
`decisao: "REABRIR"` funciona como reabertura, sem endpoint separado `os.reabrir`.

Action/Endpoint:
`parametros.registrar_leitura`
Objetivo:
Registrar leitura tecnica de parametro do equipamento.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, equipamento_id, parametro_id, valor, observacao? }`.
Resposta esperada:
`{ equipamento_id, parametro, leitura, status_operacional }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`, `PLANILHA_SCHEMA.md`.
Status:
Implementado.
Observacoes:
Atualiza parametro atual e cria historico em `leituras_parametros`.

Action/Endpoint:
`componentes.registrar_evento`
Objetivo:
Registrar evento tecnico de componente.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, equipamento_id, componente_id, acao, descricao, vida_util_h?, horimetro_evento? }`.
Resposta esperada:
`{ equipamento_id, componente, evento }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`, `PLANILHA_SCHEMA.md`.
Status:
Implementado.
Observacoes:
Acoes validas encontradas: `INSPECAO`, `AJUSTE`, `TROCA`, `BLOQUEIO`.

Action/Endpoint:
`usuarios.salvar`
Objetivo:
Criar/editar usuario.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, id?, nome, email, perfil, status, setor?, senha? }`.
Resposta esperada:
`{ usuario }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Admin/Gestor autorizado conforme permissao.

Action/Endpoint:
`permissoes.listar`
Objetivo:
Listar matriz de permissoes.
Metodo ou forma de chamada:
GET.
Payload esperado:
`{ token }`.
Resposta esperada:
`{ matriz, definicoes }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Funcao existe, mas UI atual privilegia modulos.

Action/Endpoint:
`permissoes.salvar`
Objetivo:
Salvar matriz de permissoes.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, motivo, matriz }`.
Resposta esperada:
`{ matriz, definicoes }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado / legado parcial.
Observacoes:
Motivo obrigatorio. Pode conflitar conceitualmente com `modulos.salvar`.

Action/Endpoint:
`modulos.salvar`
Objetivo:
Salvar modulos, perfis liberados e bloqueios internos.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, motivo, modulos }`.
Resposta esperada:
`{ modulos, modulo_perfis, definicoes_modulos, matriz, definicoes }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Recalcula permissoes a partir dos modulos.

Action/Endpoint:
`cadastros.salvar`
Objetivo:
Salvar planta, setor, linha, equipamento ou componente.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, entidade, ...campos }`.
Resposta esperada:
`{ entidade, registro }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Valida hierarquia basica.

Action/Endpoint:
`checklist_modelo.salvar`
Objetivo:
Salvar modelo de checklist e itens.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, nome, tipo_os, versao, status, itens }`.
Resposta esperada:
`{ modelo, itens }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Formulario atual usa ate 5 linhas.

Action/Endpoint:
`workflow.salvar`
Objetivo:
Salvar regras de transicao de OS.
Metodo ou forma de chamada:
POST.
Payload esperado:
`{ token, regras }`.
Resposta esperada:
`{ regras, acoes, status_fluxo }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Valida action, status, permissao e perfis.

Action/Endpoint:
`logs.listar`
Objetivo:
Listar audit_log.
Metodo ou forma de chamada:
GET.
Payload esperado:
`{ token }`.
Resposta esperada:
`{ logs }`.
Arquivos relacionados:
`app.js`, `mock-api.js`, `Code.gs`.
Status:
Implementado.
Observacoes:
Requer permissao `ver_audit_log`.

Endpoints solicitados para verificacao:
- `os.iniciar`: Implementado.
- `os.concluir`: Nao encontrado. Futuro ou equivalente parcial: `os.finalizar_execucao`.
- `os.pausar`: Nao encontrado. Futuro.
- `os.reabrir`: Nao encontrado como action separada. Parcial via `os.aprovar` com `decisao: "REABRIR"`.
- `checklist.concluirItem`: Nao encontrado. Parcial via `checklist.salvar`.
- `checklist.listarPorOS`: Nao encontrado. Parcial via `os.listar`, que retorna checklist junto.
- `eventos.listar`: Nao encontrado. Parcial via `os.listar` e derivacao frontend.
- `kpis.resumo`: Nao encontrado. Parcial via `dashboard` retornado por `os.listar` e calculos frontend.
- `operador.identificar`: Nao encontrado. Parcial via `auth.login`.
- `qr.resolver`: Nao encontrado. Parcial via `findQrTarget` no frontend.

==================================================
8. MODELO DE DADOS ATUAL
==================================================

Entidade:
OS.
Campos encontrados:
`id, ativo_id, componente_id, tipo, checklist_modelo_id, prioridade, criticidade, status, solicitante, responsavel, prazo, descricao, instrucoes, criado_em, iniciado_em, finalizado_em, aprovado_em`.
Campos recomendados:
`motivo_pausa, pausado_em, retomado_em, tempo_pausado_min, encerramento_sem_aprovacao, origem_qr, sla_status`.
Onde aparece no codigo:
`ordens_servico` em `mock-api.js`, `Code.gs`, `PLANILHA_SCHEMA.md`, `app.js`.
Onde provavelmente deve ser armazenada:
Google Sheets aba `ordens_servico`.
Relacoes com outras entidades:
Equipamento, componente, usuario, checklist, historico, eventos e anexos.

Entidade:
Operador/Usuario.
Campos encontrados:
`id, nome, email, senha_hash, token, perfil, status, setor, criado_em`.
Campos recomendados:
`telefone, matricula, ultimo_login, senha_atualizada_em, bloqueado_ate, preferencias`.
Onde aparece no codigo:
`usuarios` em mock/API, login, usuarios view e referencias.
Onde provavelmente deve ser armazenada:
Google Sheets aba `usuarios`.
Relacoes com outras entidades:
OS responsavel/solicitante, audit_log, historico, eventos, permissoes.

Entidade:
Setor.
Campos encontrados:
`id, planta_id, nome, responsavel, status`.
Campos recomendados:
`codigo, turno, centro_custo`.
Onde aparece no codigo:
Cadastros, referencias, QR.
Onde provavelmente deve ser armazenada:
Google Sheets aba `setores`.
Relacoes com outras entidades:
Planta, linhas, equipamentos, usuarios.

Entidade:
Planta.
Campos encontrados:
`id, nome, cnpj, cidade, uf, status`.
Campos recomendados:
`endereco, responsavel_tecnico, timezone`.
Onde aparece no codigo:
Cadastros, QR e referencias.
Onde provavelmente deve ser armazenada:
Google Sheets aba `plantas`.
Relacoes com outras entidades:
Setores.

Entidade:
Linha.
Campos encontrados:
`id, setor_id, nome, capacidade, status`.
Campos recomendados:
`codigo, unidade_capacidade, turno_padrao`.
Onde aparece no codigo:
Cadastros, QR e equipamentos.
Onde provavelmente deve ser armazenada:
Google Sheets aba `linhas`.
Relacoes com outras entidades:
Setor, equipamentos.

Entidade:
Equipamento.
Campos encontrados:
`id, nome, setor_id, linha_id, tipo, fabricante, modelo, numero_serie, data_instalacao, horimetro_atual, descricao, criticidade, qr_code, status`.
Campos recomendados:
`tag, familia, localizacao, plano_preventivo_id, qr_hash, imagem_url`.
Onde aparece no codigo:
Cadastros, QR, OS, parametros, componentes.
Onde provavelmente deve ser armazenada:
Google Sheets aba `equipamentos`.
Relacoes com outras entidades:
Setor, linha, componentes, parametros, OS, historico.

Entidade:
Motor/Componente.
Campos encontrados:
Nao existe entidade "Motor" separada. Existe `componente` com `id, equipamento_id, nome, tipo, criticidade, status`.
Campos recomendados:
Para motor como componente: `potencia, tensao, corrente, rpm, fabricante, numero_serie, vida_util_h`.
Onde aparece no codigo:
`componentes`, `historico_componentes`, QR.
Onde provavelmente deve ser armazenada:
Google Sheets aba `componentes`; dados especificos podem exigir novos campos se aprovados.
Relacoes com outras entidades:
Equipamento, historico_componentes, OS.

Entidade:
Parametro de equipamento.
Campos encontrados:
`id, equipamento_id, nome, valor, unidade, limite_min, limite_max, status_operacional, atualizado_em`.
Campos recomendados:
`tipo, criticidade_parametro, fonte, frequencia_leitura, tolerancia`.
Onde aparece no codigo:
QR, `parametros.registrar_leitura`, schema.
Onde provavelmente deve ser armazenada:
Google Sheets aba `parametros_equipamento`.
Relacoes com outras entidades:
Equipamento, leituras_parametros.

Entidade:
Leitura de parametro.
Campos encontrados:
`id, parametro_id, equipamento_id, valor, unidade, data_hora, origem`.
Campos recomendados:
`usuario, observacao, metodo, status_calculado`.
Onde aparece no codigo:
QR e endpoint `parametros.registrar_leitura`.
Onde provavelmente deve ser armazenada:
Google Sheets aba `leituras_parametros`.
Relacoes com outras entidades:
Parametro e equipamento.

Entidade:
Checklist.
Campos encontrados:
`id, os_id, item_id, pergunta, obrigatorio, resposta, observacao, evidencia, evidencia_obrigatoria, responsavel, data_hora`.
Campos recomendados:
`status_item, motivo_nao_ok, anexo_id, assinado_por, assinado_em`.
Onde aparece no codigo:
OS detalhe, checklist, backend, mock.
Onde provavelmente deve ser armazenada:
Google Sheets aba `checklist_execucao`.
Relacoes com outras entidades:
OS, anexo, usuario.

Entidade:
Modelo de checklist.
Campos encontrados:
`id, nome, tipo_os, versao, status, criado_por, criado_em`.
Campos recomendados:
`categoria_equipamento, validade, aprovado_por, aprovado_em`.
Onde aparece no codigo:
Checklists, criacao de OS, backend.
Onde provavelmente deve ser armazenada:
Google Sheets aba `checklist_modelos`.
Relacoes com outras entidades:
Checklist_modelo_itens, OS.

Entidade:
Item de checklist modelo.
Campos encontrados:
`id, modelo_id, item_id, pergunta, obrigatorio, evidencia_obrigatoria, ordem, status`.
Campos recomendados:
`tipo_resposta, limite_min, limite_max, unidade, instrucao`.
Onde aparece no codigo:
Criacao de modelo e geracao de checklist de OS.
Onde provavelmente deve ser armazenada:
Google Sheets aba `checklist_modelo_itens`.
Relacoes com outras entidades:
Modelo de checklist.

Entidade:
Evento.
Campos encontrados:
`id, os_id, tipo, usuario, resumo, data_hora`.
Campos recomendados:
`tag, ativo_id, severidade, lido_em, destino_perfil`.
Onde aparece no codigo:
Central de eventos, historico, seeds.
Onde provavelmente deve ser armazenada:
Google Sheets aba `eventos`.
Relacoes com outras entidades:
OS, usuario, equipamento indiretamente.

Entidade:
Historico.
Campos encontrados:
`id, os_id, ativo_id, acao, usuario, data_hora, resumo`.
Campos recomendados:
`antes, depois, origem, correlacao_id`.
Onde aparece no codigo:
Detalhe da OS e QR asset history.
Onde provavelmente deve ser armazenada:
Google Sheets aba `historico`.
Relacoes com outras entidades:
OS, equipamento, usuario.

Entidade:
KPI.
Campos encontrados:
`kpis_diarios: id, data, indicador, valor`; `dashboard_cache: id, perfil, usuario, dados_json, data_hora`.
Campos recomendados:
`periodo, setor_id, linha_id, equipamento_id, fonte, calculado_em`.
Onde aparece no codigo:
Dashboard frontend; schema Sheets.
Onde provavelmente deve ser armazenada:
Google Sheets abas `kpis_diarios` e `dashboard_cache`.
Relacoes com outras entidades:
OS, equipamento, setor, linha, checklist, eventos.

Entidade:
Admin.
Campos encontrados:
Usuario com `perfil: Admin`.
Campos recomendados:
`admin_master, pode_excluir_admin_master, nivel_admin`.
Onde aparece no codigo:
Usuarios, permissoes, modulos e menus.
Onde provavelmente deve ser armazenada:
Google Sheets aba `usuarios`.
Relacoes com outras entidades:
Permissoes, modulos, audit_log, config, workflow.

Entidade:
Modulo.
Campos encontrados:
`id, nome, descricao, menu_ids, permissoes, status, ordem, atualizado_em`.
Campos recomendados:
`categoria, bloqueio_exige_senha, descricao_operacional`.
Onde aparece no codigo:
`MODULE_DEFINITIONS`, `modulos`, `modulo_perfis`, tela de permissoes.
Onde provavelmente deve ser armazenada:
Google Sheets abas `modulos` e `modulo_perfis`.
Relacoes com outras entidades:
Perfil, permissao, menu.

Entidade:
Workflow.
Campos encontrados:
`id, acao, nome, status_origem, status_destino, permissao, perfis, exige_responsavel, exige_checklist_ok, status, atualizado_em`.
Campos recomendados:
`motivo_obrigatorio, notificar_perfil, sla_evento`.
Onde aparece no codigo:
Configuracoes, backend, mock.
Onde provavelmente deve ser armazenada:
Google Sheets aba `workflow_regras`.
Relacoes com outras entidades:
OS, permissoes, perfis.

Entidade:
Anexo.
Campos encontrados:
`id, os_id, checklist_id, nome, usuario, data_hora`.
Campos recomendados:
`arquivo_id, url, mime_type, tamanho_bytes, origem_camera, hash`.
Onde aparece no codigo:
Checklist e ficha QR.
Onde provavelmente deve ser armazenada:
Google Sheets aba `anexos`; binario em Drive se implementado.
Relacoes com outras entidades:
OS, checklist, usuario.

Entidade:
Versionamento.
Campos encontrados:
`id, versao, titulo, data, status, escopo, endpoints, schema, observacoes`.
Campos recomendados:
`autor, aprovado_por, checksum, ambiente`.
Onde aparece no codigo:
Versionamento UI, mock, Apps Script.
Onde provavelmente deve ser armazenada:
Google Sheets aba `versionamento`.
Relacoes com outras entidades:
Audit_log e integracoes.

==================================================
9. REGRAS DE NEGOCIO IDENTIFICADAS
==================================================

Regra:
Blueprint primeiro; codigo depois.
Status:
Documental e seguida parcialmente pela estrutura atual.
Onde aparece:
`work/blueprint_text.txt`, `work/guia_text.txt`, README.
Risco se for quebrada:
Criar telas/endpoints fora do escopo e perder governanca.

Regra:
Operador visualiza OS do seu setor/responsabilidade.
Status:
Implementada parcialmente.
Onde aparece:
`canSeeOs` no mock e Apps Script filtra operador por responsavel.
Risco se for quebrada:
Operador pode acessar OS de outro setor/equipe.

Regra:
Admin governa o sistema.
Status:
Implementada.
Onde aparece:
Menus, permissoes, modulos, workflow, usuarios, auditoria, backup, integracoes e versionamento.
Risco se for quebrada:
Gestor/operador podem alterar regras estruturais sem controle.

Regra:
Gestor/PCM opera o que Admin liberou.
Status:
Implementada parcialmente.
Onde aparece:
Modulos por perfil, permissoes e menu.
Risco se for quebrada:
Gestor pode perder ferramentas de PCM ou receber poderes administrativos indevidos.

Regra:
Operador deve ter fluxo mobile rapido.
Status:
Implementada em UI.
Onde aparece:
Bottom nav, Minhas OS, QR, checklist, detalhe de OS.
Risco se for quebrada:
Perda de aderencia no chao de fabrica.

Regra:
QR Code abre OS ou estrutura tecnica.
Status:
Implementada no frontend.
Onde aparece:
`findQrTarget`, `renderQrTargetResult`, `renderQrResult`.
Risco se for quebrada:
Rastreabilidade perde utilidade operacional.

Regra:
Checklist deve evitar erro operacional.
Status:
Implementada.
Onde aparece:
`validateChecklist`, `saveChecklist`, `assertWorkflow`.
Risco se for quebrada:
OS pode ser finalizada sem requisito tecnico.

Regra:
`NAO_OK` exige observacao.
Status:
Implementada.
Onde aparece:
`validateChecklist` no mock e Apps Script.
Risco se for quebrada:
Pendencias tecnicas ficam sem justificativa.

Regra:
Evidencia obrigatoria deve bloquear pendencia.
Status:
Implementada parcialmente.
Onde aparece:
`validateChecklist`, input de evidencia.
Risco se for quebrada:
Checklist critico fica sem prova.

Regra:
Etapas concluídas nao devem ser refeitas sem autorizacao.
Status:
Implementada parcialmente por workflow.
Onde aparece:
`assertWorkflow`, regras ativas.
Risco se for quebrada:
Historico operacional perde confiabilidade.

Regra:
Eventos devem alimentar KPIs e comunicacoes.
Status:
Implementada parcialmente.
Onde aparece:
Central de eventos e dashboard.
Risco se for quebrada:
Gestor perde rastreabilidade analitica.

Regra:
Versao ativa deve ser sincronizada.
Status:
Implementada.
Onde aparece:
`syncActiveVersion` no Apps Script e logica equivalente no mock.
Risco se for quebrada:
Mais de uma versao pode aparecer ativa.

Regra:
Sistema deve funcionar com Google Sheets e Apps Script.
Status:
Implementada.
Onde aparece:
`Code.gs`, `PLANILHA_SCHEMA.md`, `api-client.js`.
Risco se for quebrada:
Perda da arquitetura principal.

Regra:
Toda acao importante deve gerar auditoria.
Status:
Implementada parcialmente.
Onde aparece:
`audit`, `addHistorico`, `addEvento`.
Risco se for quebrada:
Perda de rastreabilidade e governanca.

==================================================
10. RISCOS TECNICOS ATUAIS
==================================================

## Risco de frontend

Risco:
`app.js` concentra UI, estado, regras e handlers.
Gravidade:
Alta.
Causa provavel:
Evolucao rapida em arquivo unico Vanilla JS.
Consequencia:
Alteracoes futuras podem gerar regressao cruzada.
Como mitigar futuramente:
Separar de forma controlada em modulos pequenos sem trocar stack.

Risco:
CSS longo com muitas correcoes sobrepostas.
Gravidade:
Media.
Causa provavel:
Evolucoes visuais sucessivas.
Consequencia:
Contraste e layout podem quebrar em mobile S/M/L.
Como mitigar futuramente:
Criar tokens claros e revisar componentes por viewport.

Risco:
`BarcodeDetector` nao e universal.
Gravidade:
Media.
Causa provavel:
API nativa depende do navegador.
Consequencia:
Leitura por camera pode falhar em alguns celulares.
Como mitigar futuramente:
Manter fallback manual e avaliar biblioteca leve de QR se permitido.

## Risco de backend/API

Risco:
Apps Script e mock podem divergir.
Gravidade:
Alta.
Causa provavel:
Duas implementacoes paralelas dos mesmos contratos.
Consequencia:
Funciona localmente mas falha na planilha real.
Como mitigar futuramente:
Criar checklist de paridade e testes de contrato.

Risco:
Actions ausentes para eventos, QR resolver e KPI resumo.
Gravidade:
Media.
Causa provavel:
Dados agregados retornam por `os.listar`.
Consequencia:
Escalabilidade e filtros ficam limitados.
Como mitigar futuramente:
Criar endpoints dedicados com payloads pequenos.

## Risco de dados/planilhas

Risco:
Google Sheets como banco pode sofrer concorrencia.
Gravidade:
Alta.
Causa provavel:
Planilha nao e banco transacional.
Consequencia:
Corridas em atualizacoes simultaneas de OS/checklist.
Como mitigar futuramente:
Usar LockService no Apps Script para actions criticas.

Risco:
Evidencia sem binario real.
Gravidade:
Alta.
Causa provavel:
Schema atual salva nome/metadado.
Consequencia:
Auditoria visual fica incompleta.
Como mitigar futuramente:
Upload para Drive com ID/URL em `anexos`.

## Risco de versionamento

Risco:
Versionamento depende de seed no codigo.
Gravidade:
Media.
Causa provavel:
Nao ha tela de cadastro de release.
Consequencia:
Atualizacao pode esquecer de registrar nova versao.
Como mitigar futuramente:
Criar rotina de release e validacao de `appVersion`.

## Risco de perda de contexto

Risco:
Muitas regras foram definidas em conversa e documentos.
Gravidade:
Alta.
Causa provavel:
Sistema evolui por iteracoes longas.
Consequencia:
Agente/desenvolvedor pode implementar fora da regra.
Como mitigar futuramente:
Manter `PROJECT_AUDIT.md`, README e schema atualizados.

## Risco de manutencao futura

Risco:
README parcialmente desatualizado.
Gravidade:
Baixa.
Causa provavel:
Endpoints novos nao foram adicionados.
Consequencia:
Setup operacional incompleto.
Como mitigar futuramente:
Atualizar README apos cada release.

Risco:
Permissoes por modulo e matriz legada coexistem.
Gravidade:
Alta.
Causa provavel:
Evolucao de matriz para modulos.
Consequencia:
Fonte de verdade confusa.
Como mitigar futuramente:
Declarar modulos como fonte principal e matriz como derivada.

## Risco de performance

Risco:
`os.listar` retorna muitos dados agregados.
Gravidade:
Media.
Causa provavel:
Endpoint unico para simplificar o MVP.
Consequencia:
Com muitas OS, eventos e anexos, resposta pode ficar lenta.
Como mitigar futuramente:
Paginar e criar endpoints dedicados.

## Risco de seguranca

Risco:
Autenticacao simples por token salvo em planilha/localStorage.
Gravidade:
Alta.
Causa provavel:
MVP em Apps Script/Sheets.
Consequencia:
Tokens podem ser reutilizados se vazarem.
Como mitigar futuramente:
Expiracao de token, rotacao, hash robusto e logs de acesso.

Risco:
Senha local de demo conhecida.
Gravidade:
Media.
Causa provavel:
Ambiente de teste.
Consequencia:
Se usado em producao, acesso indevido.
Como mitigar futuramente:
Remover credenciais demo em producao e forcar troca de senha.

==================================================
11. MELHORIAS FUTURAS RECOMENDADAS
==================================================

## Fase 1 - Estabilizacao

Melhoria:
Criar testes de contrato para 17 endpoints.
Por que fazer:
Garantir paridade mock/Apps Script.
Impacto:
Reduz regressao.
Complexidade:
Media.
Dependencias:
Harness JS simples.
Prioridade:
Alta.
Arquivos provavelmente afetados:
Novos arquivos de teste, sem trocar stack.

Melhoria:
Atualizar README com endpoints novos.
Por que fazer:
Documentacao deve refletir API real.
Impacto:
Reduz erro de setup.
Complexidade:
Baixa.
Dependencias:
Nenhuma.
Prioridade:
Baixa.
Arquivos provavelmente afetados:
`README.md`.

Melhoria:
Declarar fonte de verdade de permissoes.
Por que fazer:
Evitar conflito matriz versus modulos.
Impacto:
Alto em governanca.
Complexidade:
Media.
Dependencias:
Decisao funcional.
Prioridade:
Alta.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`.

## Fase 2 - Fluxo operacional

Melhoria:
Implementar endpoint `qr.resolver`.
Por que fazer:
Backend deve validar acesso a QR.
Impacto:
Alto.
Complexidade:
Media.
Dependencias:
Permissoes por tipo de QR.
Prioridade:
Alta.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`.

Melhoria:
Implementar upload real de evidencias.
Por que fazer:
Checklist precisa prova real.
Impacto:
Alto.
Complexidade:
Alta.
Dependencias:
Drive/App Script.
Prioridade:
Alta.
Arquivos provavelmente afetados:
`app.js`, `Code.gs`, schema.

Melhoria:
Adicionar pausa/retomada de OS.
Por que fazer:
Separar tempo de execucao e espera.
Impacto:
Medio/alto.
Complexidade:
Media.
Dependencias:
Workflow e status.
Prioridade:
Media.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`.

## Fase 3 - Dados e rastreabilidade

Melhoria:
Eventos com tags persistidas ou resolvidas no backend.
Por que fazer:
Central de eventos deve escalar.
Impacto:
Medio/alto.
Complexidade:
Media.
Dependencias:
Endpoint `eventos.listar`.
Prioridade:
Media.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`, schema.

Melhoria:
Historico tecnico filtravel por ativo/componente.
Por que fazer:
Facilitar investigacao de falhas.
Impacto:
Medio.
Complexidade:
Media.
Dependencias:
Historico_componentes.
Prioridade:
Media.
Arquivos provavelmente afetados:
`app.js`, backend.

Melhoria:
Modelos de parametros por equipamento.
Por que fazer:
Padronizar limite e leitura.
Impacto:
Medio.
Complexidade:
Media.
Dependencias:
Definicao de campos.
Prioridade:
Media.
Arquivos provavelmente afetados:
Schema, app, backend.

## Fase 4 - KPIs e gestao

Melhoria:
Endpoint `kpis.resumo`.
Por que fazer:
Separar calculo gerencial do carregamento de OS.
Impacto:
Alto.
Complexidade:
Media.
Dependencias:
Historico e filtros.
Prioridade:
Media.
Arquivos provavelmente afetados:
`app.js`, `mock-api.js`, `Code.gs`.

Melhoria:
Filtros gerenciais por periodo/setor/linha/equipamento.
Por que fazer:
Gestor precisa analise PCM real.
Impacto:
Alto.
Complexidade:
Media.
Dependencias:
Endpoint KPI ou relatorio.
Prioridade:
Media.
Arquivos provavelmente afetados:
`app.js`, backend.

Melhoria:
Relatorio JSON/CSV de KPIs e auditoria.
Por que fazer:
Permitir analise fora do app.
Impacto:
Medio.
Complexidade:
Baixa/media.
Dependencias:
Filtros.
Prioridade:
Media.
Arquivos provavelmente afetados:
`app.js`, backend.

## Fase 5 - Profissionalizacao

Melhoria:
LockService nas actions criticas do Apps Script.
Por que fazer:
Evitar concorrencia em Sheets.
Impacto:
Alto.
Complexidade:
Media.
Dependencias:
Mapeamento de operacoes criticas.
Prioridade:
Alta.
Arquivos provavelmente afetados:
`Code.gs`.

Melhoria:
Politica de senha/token.
Por que fazer:
Seguranca de producao.
Impacto:
Alto.
Complexidade:
Media.
Dependencias:
Modelo de usuario.
Prioridade:
Alta.
Arquivos provavelmente afetados:
`Code.gs`, `mock-api.js`, `app.js`.

Melhoria:
Documentacao operacional de release.
Por que fazer:
Evitar perda de contexto.
Impacto:
Medio.
Complexidade:
Baixa.
Dependencias:
Versionamento.
Prioridade:
Media.
Arquivos provavelmente afetados:
README, `PROJECT_AUDIT.md`, schema.

==================================================
12. BACKLOG TECNICO SUGERIDO
==================================================

## Curto prazo

ID:
CP-01
Titulo:
Atualizar README com endpoints reais.
Descricao:
Adicionar `parametros.registrar_leitura` e `componentes.registrar_evento` na lista de endpoints.
Prioridade:
Baixa.
Tipo:
documentacao.
Criterio de aceite:
README lista os 17 endpoints ativos.
Arquivos envolvidos:
`README.md`.
Risco:
Baixo.

ID:
CP-02
Titulo:
Auditar paridade mock/API.
Descricao:
Comparar actions do mock e Apps Script.
Prioridade:
Alta.
Tipo:
documentacao.
Criterio de aceite:
Tabela de actions com status de paridade.
Arquivos envolvidos:
`mock-api.js`, `Code.gs`.
Risco:
Baixo.

ID:
CP-03
Titulo:
Criar teste manual padrao para login por perfil.
Descricao:
Documentar passos para Operador, Gestor e Admin.
Prioridade:
Media.
Tipo:
documentacao.
Criterio de aceite:
Checklist com resultado esperado por perfil.
Arquivos envolvidos:
README ou novo doc.
Risco:
Baixo.

ID:
CP-04
Titulo:
Criar teste de contrato `auth.login`.
Descricao:
Validar payload e resposta no mock.
Prioridade:
Alta.
Tipo:
melhoria.
Criterio de aceite:
Teste confirma token, usuario, permissoes e menu.
Arquivos envolvidos:
Novo arquivo de teste.
Risco:
Medio.

ID:
CP-05
Titulo:
Criar teste de contrato `os.listar`.
Descricao:
Validar retorno de ordens, checklist, historico, eventos e referencias.
Prioridade:
Alta.
Tipo:
melhoria.
Criterio de aceite:
Teste falha se alguma chave obrigatoria sumir.
Arquivos envolvidos:
Novo arquivo de teste.
Risco:
Medio.

ID:
CP-06
Titulo:
Registrar politica de permissoes por modulo.
Descricao:
Definir que modulos governam permissoes e matriz e derivada.
Prioridade:
Alta.
Tipo:
documentacao.
Criterio de aceite:
Documento descreve regra e risco.
Arquivos envolvidos:
README ou schema.
Risco:
Baixo.

ID:
CP-07
Titulo:
Validar mobile S 320 px.
Descricao:
Criar checklist visual para telas criticas.
Prioridade:
Alta.
Tipo:
bug.
Criterio de aceite:
Login, dashboard, OS, QR, checklist e eventos sem sobreposicao.
Arquivos envolvidos:
`styles.css`, `app.js`.
Risco:
Medio.

ID:
CP-08
Titulo:
Validar finalizacao com checklist pendente.
Descricao:
Testar bloqueio de finalizacao no mock.
Prioridade:
Alta.
Tipo:
melhoria.
Criterio de aceite:
Finalizar OS pendente retorna erro orientativo.
Arquivos envolvidos:
`mock-api.js`, `Code.gs`.
Risco:
Baixo.

ID:
CP-09
Titulo:
Revisar labels com encoding ruim.
Descricao:
Mapear strings visiveis com caracteres quebrados.
Prioridade:
Baixa.
Tipo:
bug.
Criterio de aceite:
Lista de strings afetadas, sem alterar ainda.
Arquivos envolvidos:
`app.js`, docs.
Risco:
Baixo.

ID:
CP-10
Titulo:
Documentar evidencia atual.
Descricao:
Explicar que evidencia salva nome/metadados e nao binario.
Prioridade:
Alta.
Tipo:
documentacao.
Criterio de aceite:
Risco operacional documentado.
Arquivos envolvidos:
`PLANILHA_SCHEMA.md`, README.
Risco:
Baixo.

## Medio prazo

ID:
MP-01
Titulo:
Implementar `qr.resolver`.
Descricao:
Criar action para resolver QR no backend.
Prioridade:
Alta.
Tipo:
feature.
Criterio de aceite:
Payload com token/tipo/valor retorna entidade permitida ou erro de acesso.
Arquivos envolvidos:
`app.js`, `mock-api.js`, `Code.gs`.
Risco:
Alto.

ID:
MP-02
Titulo:
Permissoes por tipo de QR.
Descricao:
Separar leitura de planta, setor, linha, equipamento, componente e OS.
Prioridade:
Alta.
Tipo:
feature.
Criterio de aceite:
Operador nao acessa QR acima do nivel autorizado.
Arquivos envolvidos:
`mock-api.js`, `Code.gs`, `app.js`.
Risco:
Alto.

ID:
MP-03
Titulo:
Upload real de evidencia.
Descricao:
Salvar arquivo no Drive e registrar URL/id no anexo.
Prioridade:
Alta.
Tipo:
feature.
Criterio de aceite:
Arquivo anexado fica acessivel para aprovacao.
Arquivos envolvidos:
`app.js`, `Code.gs`, schema.
Risco:
Alto.

ID:
MP-04
Titulo:
Endpoint `eventos.listar`.
Descricao:
Listar eventos por tag, periodo, OS, ativo e perfil.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
Central nao depende de `os.listar`.
Arquivos envolvidos:
`app.js`, `mock-api.js`, `Code.gs`.
Risco:
Medio.

ID:
MP-05
Titulo:
Endpoint `kpis.resumo`.
Descricao:
Retornar indicadores por periodo e perfil.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
Dashboard carrega resumo sem buscar todos os eventos.
Arquivos envolvidos:
`app.js`, `mock-api.js`, `Code.gs`.
Risco:
Medio.

ID:
MP-06
Titulo:
Pausar e retomar OS.
Descricao:
Criar action, status e historico de pausa.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
Tempo pausado nao entra em execucao real.
Arquivos envolvidos:
`app.js`, `mock-api.js`, `Code.gs`, schema.
Risco:
Alto.

ID:
MP-07
Titulo:
Filtros avancados no dashboard gestor.
Descricao:
Adicionar periodo, setor, linha e equipamento.
Prioridade:
Media.
Tipo:
melhoria.
Criterio de aceite:
Cards e graficos refletem filtro selecionado.
Arquivos envolvidos:
`app.js`, backend.
Risco:
Medio.

ID:
MP-08
Titulo:
Historico de componente filtravel.
Descricao:
Criar visao por componente/acao.
Prioridade:
Media.
Tipo:
melhoria.
Criterio de aceite:
Gestor encontra trocas, ajustes e bloqueios por ativo.
Arquivos envolvidos:
`app.js`, backend.
Risco:
Medio.

ID:
MP-09
Titulo:
Relatorio JSON/CSV.
Descricao:
Exportar OS, eventos, KPIs e auditoria filtrados.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
Download gera arquivo consistente.
Arquivos envolvidos:
`app.js`, backend.
Risco:
Medio.

ID:
MP-10
Titulo:
LockService em actions criticas.
Descricao:
Proteger escrita concorrente em OS/checklist/anexos.
Prioridade:
Alta.
Tipo:
melhoria.
Criterio de aceite:
Actions criticas executam com lock e timeout controlado.
Arquivos envolvidos:
`Code.gs`.
Risco:
Alto.

## Futuro

ID:
FT-01
Titulo:
Plano preventivo por horimetro.
Descricao:
Gerar OS automaticamente por horas de uso.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
Parametro de horimetro dispara pendencia preventiva.
Arquivos envolvidos:
Backend, schema, app.
Risco:
Alto.

ID:
FT-02
Titulo:
Assinatura do operador.
Descricao:
Capturar assinatura na finalizacao quando exigida.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
OS exige assinatura conforme configuracao.
Arquivos envolvidos:
`app.js`, backend, schema.
Risco:
Medio.

ID:
FT-03
Titulo:
Politica de senha robusta.
Descricao:
Expiracao, troca inicial e bloqueio por tentativa.
Prioridade:
Alta.
Tipo:
feature.
Criterio de aceite:
Login bloqueia tentativas e obriga senha nova.
Arquivos envolvidos:
`app.js`, `Code.gs`, schema.
Risco:
Alto.

ID:
FT-04
Titulo:
Modo offline controlado.
Descricao:
Permitir execucao temporaria offline com fila de sync.
Prioridade:
Baixa.
Tipo:
feature.
Criterio de aceite:
Operador salva local e sincroniza depois sem duplicar.
Arquivos envolvidos:
`app.js`, backend.
Risco:
Muito alto.

ID:
FT-05
Titulo:
Geracao dedicada de etiquetas QR.
Descricao:
Layout de impressao por equipamento/linha/setor.
Prioridade:
Baixa.
Tipo:
melhoria.
Criterio de aceite:
Admin imprime etiqueta por ativo.
Arquivos envolvidos:
`app.js`, `styles.css`.
Risco:
Medio.

ID:
FT-06
Titulo:
Dashboard PCM com comparativo mensal.
Descricao:
Comparar backlog, MTTR, MTBF e compliance por mes.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
Grafico mostra tendencia mensal.
Arquivos envolvidos:
`app.js`, backend, `kpis_diarios`.
Risco:
Medio.

ID:
FT-07
Titulo:
Catalogo de falhas e causas.
Descricao:
Padronizar causa, efeito e acao corretiva.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
OS corretiva pode selecionar falha/causa/acao.
Arquivos envolvidos:
Schema, app, backend.
Risco:
Medio.

ID:
FT-08
Titulo:
Materiais da OS.
Descricao:
Usar aba `materiais_os` para materiais consumidos.
Prioridade:
Media.
Tipo:
feature.
Criterio de aceite:
Operador/Gestor registra materiais e quantidades.
Arquivos envolvidos:
`app.js`, backend.
Risco:
Medio.

ID:
FT-09
Titulo:
Relatorio PDF.
Descricao:
Gerar comprovante de OS.
Prioridade:
Baixa.
Tipo:
feature.
Criterio de aceite:
OS concluida gera resumo imprimivel/PDF.
Arquivos envolvidos:
`app.js`, backend.
Risco:
Medio.

ID:
FT-10
Titulo:
Trilha de auditoria imutavel reforcada.
Descricao:
Adicionar hash/correlacao para alteracoes criticas.
Prioridade:
Media.
Tipo:
melhoria.
Criterio de aceite:
Audit_log registra hash antes/depois ou correlacao.
Arquivos envolvidos:
`Code.gs`, schema.
Risco:
Alto.

==================================================
13. ROADMAP RECOMENDADO
==================================================

## Proximos 3 dias

Objetivo:
Congelar entendimento e estabilizar pontos criticos sem refatorar.
Tarefas:
- Atualizar documentacao de endpoints.
- Criar checklist manual de validacao por perfil.
- Validar mobile S/M/L nas telas criticas.
- Validar `os.listar`, `os.iniciar`, `checklist.salvar`, `os.finalizar_execucao` e `os.aprovar`.
- Definir fonte de verdade de permissoes.
Resultado esperado:
Base confiavel para continuar implementando.
Risco:
Detectar divergencia entre mock e Apps Script.
Como validar:
Login nos 3 perfis, executar OS, salvar checklist, abrir central de eventos, abrir QR.

## Proximas 2 semanas

Objetivo:
Fechar rastreabilidade operacional e evidencias.
Tarefas:
- Implementar `qr.resolver`.
- Implementar permissao por tipo de QR.
- Implementar upload real de evidencia.
- Criar `eventos.listar`.
- Criar testes de contrato basicos.
Resultado esperado:
Rastreabilidade e checklist com base profissional.
Risco:
Alterar schema sem migracao controlada.
Como validar:
QR de equipamento, componente, linha, setor e OS por perfil; checklist com evidencia real; eventos filtrados.

## Proximo mes

Objetivo:
Evoluir PCM e indicadores.
Tarefas:
- Criar `kpis.resumo`.
- Adicionar filtros por periodo/setor/linha/equipamento.
- Implementar pausa/retomada.
- Usar `kpis_diarios` ou `dashboard_cache`.
- Relatorios JSON/CSV.
Resultado esperado:
Gestor com painel analitico real.
Risco:
KPIs sem dados historicos suficientes.
Como validar:
Comparar indicadores com dados brutos de OS/eventos.

## Versao profissional final

Objetivo:
Sistema governado, auditavel e seguro.
Tarefas:
- LockService em actions criticas.
- Politica de senha/token.
- Backup real de Sheets.
- Auditoria reforcada.
- Release/versionamento operacional.
- Documentacao final de implantacao.
Resultado esperado:
App pronto para piloto operacional em ambiente industrial pequeno.
Risco:
Limites estruturais de Apps Script/Sheets em alto volume.
Como validar:
Teste de carga leve, concorrencia basica, restauracao de backup e auditoria de ponta a ponta.

==================================================
14. O QUE NAO DEVE SER ALTERADO
==================================================

Funcionalidades ja validadas:
- Scripts carregando sem erro: preservar. Status: Validado no historico.
- Mock com eventos: preservar. Status: Confirmado.
- Localhost sem erro de console: preservar. Status: Validado no historico.
- Central de eventos: preservar. Status: Confirmado.
- Filtro Checklist da central de eventos: preservar. Status: Validado no historico.
- Seeds de eventos: preservar. Status: Confirmado.
- Seeds do setupInicial: preservar. Status: Confirmado.
- Versionamento 1.5.5: preservar. Status: Confirmado.
- Sincronizacao de versao ativa: preservar. Status: Confirmado.

Estrutura atual funcional:
- `index.html` importando scripts na ordem atual.
- `config.js` centralizando `apiUrl`, `storageKey` e `appVersion`.
- `api-client.js` alternando mock/API real.
- `mock-api.js` como contrato local.
- `Code.gs` como backend Apps Script.
- `PLANILHA_SCHEMA.md` como referencia de planilha.

Nomes de actions/endpoints existentes:
- `auth.login`
- `os.listar`
- `os.criar`
- `os.iniciar`
- `checklist.salvar`
- `os.finalizar_execucao`
- `os.aprovar`
- `parametros.registrar_leitura`
- `componentes.registrar_evento`
- `usuarios.salvar`
- `permissoes.listar`
- `permissoes.salvar`
- `modulos.salvar`
- `cadastros.salvar`
- `checklist_modelo.salvar`
- `workflow.salvar`
- `logs.listar`

Estrutura das planilhas:
- Preservar abas ja definidas em `SHEETS`.
- Qualquer nova coluna deve ser justificada e migrada com cuidado.

Fluxos de mock ja funcionando:
- Login demo.
- OS listar/criar/iniciar/finalizar/aprovar.
- Checklist salvar.
- Modulos salvar.
- Cadastros salvar.
- Workflow salvar.
- QR ficha tecnica.
- Eventos por tag.
- Backup local.

Seeds de eventos:
- `EVT-OS108-ATRASO`.
- `EVT-OS121-APROVACAO`.
- `EVT-OS108-CHECKLIST`.
- `EVT-OS102-STATUS`.

Controle de versao ativa:
- `VER-1-5-5` deve continuar ativo enquanto a versao do app for 1.5.5.

Filtro de checklist validado:
- Preservar `EVENT_TAGS`, `setEventTagFilter`, `renderEventCenter` e logica de agrupamento.

Central de eventos validada:
- Preservar botao de notificacoes, tags e grupos.

Itens pendentes de confirmacao:
- Producao real com Web App publicado: Pendente de confirmacao.
- Upload binario real de evidencias: Pendente de confirmacao, pois nao existe no codigo atual.
- QR de usuario: Pendente de confirmacao, pois nao foi encontrado resolvedor especifico.

==================================================
15. RESUMO EXECUTIVO FINAL
==================================================

O que o sistema ja possui:
- App web/mobile funcional em HTML, CSS e JavaScript Vanilla.
- Login por perfil.
- Menus por perfil.
- Governanca por permissoes e modulos.
- OS com criacao, listagem, inicio, checklist, finalizacao, aprovacao e reabertura.
- Checklist com validacoes de obrigatoriedade, `NAO_OK` e evidencia.
- QR Code com camera, fallback manual e ficha tecnica.
- Rastreabilidade inicial por equipamento, componente, parametro, leitura, evidencia e historico.
- Dashboard/KPIs basicos e intermediarios.
- Central de eventos com tags.
- Cadastros hierarquicos.
- Usuarios.
- Workflow configuravel.
- Auditoria/logs.
- Backup local.
- Integracoes/configuracao da API.
- Versionamento 1.5.5.
- Apps Script com 17 actions.
- Google Sheets com 28 abas previstas.

O quao avancado ele esta:
O projeto esta acima de um mock visual simples. Ja existe contrato logico completo entre frontend, mock e Apps Script, com dados seedados, validacoes e fluxo operacional. Ainda nao esta em nivel de producao robusta por falta de upload real de evidencias, endpoint backend de QR, testes automatizados, lock de concorrencia e seguranca reforcada.

Quais partes parecem solidas:
- Contrato central via `SCSApi.call`.
- Paridade geral entre mock e Apps Script.
- Seeds de dados.
- Workflow e validacao de checklist.
- Versionamento ativo.
- Central de eventos por tags.
- Rastreabilidade tecnica inicial via QR.

Quais partes precisam de atencao:
- Evidencias reais.
- QR resolver no backend.
- Permissoes por tipo de QR.
- Risco de divergencia mock/API.
- `app.js` e `Code.gs` muito grandes.
- README desatualizado em endpoints novos.
- Segurança de token/senha.
- Concorrencia no Google Sheets.

Proximas 5 implementacoes mais importantes:
1. Criar endpoint `qr.resolver` com validacao de token, perfil, permissao e tipo de QR.
2. Implementar upload real de evidencias em Drive/Apps Script.
3. Criar `eventos.listar` com filtros por tag, periodo, ativo e perfil.
4. Definir e consolidar governanca de permissoes por modulos.
5. Criar testes de contrato para mock/API nas actions criticas.

Caminho mais seguro para evoluir sem quebrar o que funciona:
Manter a arquitetura atual, evoluir por actions pequenas, validar mock e Apps Script em paralelo, nao alterar nomes de endpoints existentes, nao mudar schema sem migracao explicita, preservar seeds/versionamento, testar sempre Operador/Gestor/Admin e priorizar fluxo mobile do operador antes de melhorias visuais ou analiticas mais complexas.
