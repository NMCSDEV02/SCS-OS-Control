# Google Sheets - Setup da base SCS OS Control

## Criacao automatica

O Apps Script cria todas as abas e cabecalhos automaticamente.

Execute uma vez:

```text
setupInicial()
```

O script vai:

- Criar todas as abas listadas em `SHEETS_SCHEMA.json`.
- Inserir cabecalhos oficiais.
- Criar usuarios iniciais.
- Criar permissoes, modulos e fluxos padrao.
- Criar plantas, setores, linhas, equipamentos e componentes de teste.
- Criar parametros tecnicos e leituras iniciais.
- Criar modelos de checklist.
- Criar OS iniciais.
- Criar historico, eventos, anexos e versionamento.

## Usuarios iniciais

```text
Operador: operador@scs.local / 123456
Gestor: gestor@scs.local / 123456
Admin: admin@scs.local / 123456
```

## Abas criticas

- `usuarios`: login, perfil, status e setor.
- `ordens_servico`: dados principais das OS.
- `checklist_execucao`: respostas e evidencias de checklist.
- `audit_log`: auditoria das acoes importantes.
- `eventos`: central de eventos e notificacoes.
- `versionamento`: controle de versao online.
- `workflow_regras`: automacao de status da OS.
- `modulos` e `modulo_perfis`: governanca por perfil.

## Regra de preservacao

Nao apague:

- `audit_log`
- `historico`
- `eventos`
- `versionamento`
- `checklist_execucao`

Essas abas alimentam auditoria, rastreabilidade e KPIs.

## Conferencia manual

Use:

```text
SHEETS_SCHEMA.json
SHEETS_HEADERS.csv
```

Se alguma aba for editada manualmente, os cabecalhos precisam permanecer exatamente iguais.
