# Schema Google Sheets

Abas usadas pela versao inicial, agrupadas conforme o blueprint.

## CADASTROS

### `plantas`
`id, nome, cnpj, cidade, uf, status`

### `setores`
`id, planta_id, nome, responsavel, status`

### `linhas`
`id, setor_id, nome, capacidade, status`

### `equipamentos`
`id, nome, setor_id, linha_id, tipo, fabricante, modelo, numero_serie, data_instalacao, horimetro_atual, descricao, criticidade, qr_code, status`

### `componentes`
`id, equipamento_id, nome, tipo, criticidade, status`

### `parametros_equipamento`
`id, equipamento_id, nome, valor, unidade, limite_min, limite_max, status_operacional, atualizado_em`

### `leituras_parametros`
`id, parametro_id, equipamento_id, valor, unidade, data_hora, origem`

Alimentada pelo endpoint `parametros.registrar_leitura`. Cada leitura atualiza o valor atual e o `status_operacional` em `parametros_equipamento`.

### `historico_componentes`
`id, componente_id, equipamento_id, acao, descricao, vida_util_h, horimetro_evento, usuario, data_hora`

Alimentada pelo endpoint `componentes.registrar_evento`. Acoes validas: `INSPECAO`, `AJUSTE`, `TROCA`, `BLOQUEIO`. `BLOQUEIO` muda o status do componente para `BLOQUEADO`; `AJUSTE` e `TROCA` retornam o componente para `ATIVO`.

### `usuarios`
`id, nome, email, senha_hash, token, perfil, status, setor, criado_em`

### `permissoes`
`id, perfil, chave, liberado, atualizado_em`

### `modulos`
`id, nome, descricao, menu_ids, permissoes, status, ordem, atualizado_em`

### `modulo_perfis`
`id, modulo_id, perfil, liberado, permissoes_bloqueadas, atualizado_em`

### `listas`
`id, tipo, valor, status`

### `config`
`id, chave, valor, status`

### `workflow_regras`
`id, acao, nome, status_origem, status_destino, permissao, perfis, exige_responsavel, exige_checklist_ok, status, atualizado_em`

### `checklist_modelos`
`id, nome, tipo_os, versao, status, criado_por, criado_em`

### `checklist_modelo_itens`
`id, modelo_id, item_id, pergunta, obrigatorio, evidencia_obrigatoria, ordem, status, tipo_resposta, unidade, valor_min, valor_max, valor_esperado, opcoes, critico, evidencia_regra, observacao_regra, status_item`



### Checklist dinamico - V1.5.7

A partir da versao `1.5.7`, os itens de checklist suportam campos tecnicos dinamicos:

- `tipo_resposta`: `OK_NOK`, `OK_NOK_NA`, `TEXTO`, `NUMERICO`, `SELECT`, `DATA`, `FOTO`, `LEITURA_TECNICA`;
- `unidade`: unidade tecnica do valor (`V`, `A`, `°C`, `g`, `bar`, `mm`, etc.);
- `valor_min` e `valor_max`: limites de aceitacao para respostas numericas;
- `valor_esperado`: referencia esperada, como tipo de graxa ou corrente nominal;
- `opcoes`: lista para campos `SELECT`, separada por ponto e virgula;
- `critico`: quando verdadeiro, resposta `NAO_OK` bloqueia finalizacao da OS;
- `evidencia_regra`: `NUNCA`, `SEMPRE`, `SE_NOK`, `FORA_LIMITE`, `SE_OUTRO`;
- `observacao_regra`: `NUNCA`, `SE_NOK`, `FORA_LIMITE`, `SE_OUTRO`;
- `status_item`: resultado calculado (`OK`, `ALERTA`, `PENDENTE`).

Compatibilidade: checklists antigos sem esses campos devem assumir `tipo_resposta = OK_NOK`, `observacao_regra = SE_NOK` e `evidencia_regra = SE_NOK` ou `SEMPRE` quando `evidencia_obrigatoria` for verdadeiro.

## OPERACAO

### `ordens_servico`
`id, ativo_id, componente_id, tipo, checklist_modelo_id, prioridade, criticidade, status, solicitante, responsavel, prazo, descricao, instrucoes, criado_em, iniciado_em, finalizado_em, aprovado_em`

### `checklist_execucao`
`id, os_id, item_id, pergunta, obrigatorio, resposta, observacao, evidencia, evidencia_obrigatoria, responsavel, data_hora, tipo_resposta, unidade, valor_min, valor_max, valor_esperado, opcoes, critico, evidencia_regra, observacao_regra, status_item`

### `historico`
`id, os_id, ativo_id, acao, usuario, data_hora, resumo`

### `materiais_os`
`id, os_id, material, quantidade, usuario, data_hora`

### `eventos`
`id, os_id, tipo, usuario, resumo, data_hora`

Na versao `1.5.5`, a interface deriva tags a partir de `tipo` e do contexto da OS, sem alterar colunas: `SLA`, `Aprovacao`, `Checklist`, `Operacao`, `Tecnico` e `Sistema`.

### `anexos`
`id, os_id, checklist_id, nome, usuario, data_hora`

Na versao `1.5.4`, a captura por camera/arquivo grava o nome e metadados do arquivo no campo `nome`, mantendo o mesmo contrato da planilha para nao exigir migracao de colunas.

## ANALYTICS_LOGS

### `kpis_diarios`
`id, data, indicador, valor`

### `dashboard_cache`
`id, perfil, usuario, dados_json, data_hora`

### `audit_log`
`id, usuario, perfil, acao, modulo, registro_id, antes, depois, data_hora`

### `sync_log`
`id, origem, status, resumo, data_hora`

### `relatorios`
`id, nome, filtro_json, usuario, data_hora`

### `versionamento`
`id, versao, titulo, data, status, escopo, endpoints, schema, observacoes`

Versao atual do frontend/mock/backend: `1.5.7`.
