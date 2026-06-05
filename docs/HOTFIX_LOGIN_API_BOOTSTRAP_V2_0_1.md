# Hotfix Login/API Bootstrap V2.0.1

## Problema corrigido

O fluxo de entrada da V2.0.0 autenticava o usuario e, em seguida, chamava `os.listar` sem filtros. Esse endpoint montava a resposta com OS, checklist, historico, eventos, anexos e referencias completas, incluindo varias abas inteiras da Google Sheet.

Com planilhas extensas, o Apps Script podia ficar lento, exceder tempo de execucao ou devolver erro antes do frontend concluir o login.

## Principio da correcao

O login e o bootstrap agora carregam apenas identidade, perfil, permissoes, menu, modulos liberados, versao ativa e metadados minimos do ambiente.

Dados operacionais passam a ser carregados sob demanda.

## Mudancas aplicadas

### Frontend

- `auth.login` nao dispara mais `os.listar` automaticamente.
- Sessao salva somente com payload leve de autenticacao/bootstrap.
- Novo fluxo chama `sistema.bootstrap` para revalidar permissao/menu sem carregar OS.
- `os.listar` passa a ser chamado apenas quando a view exige dados operacionais.
- Detalhe de OS chama `os.listar` com `id_os`, `limit: 1` e `include: "detalhe"`.

### API client

- `sistema.bootstrap` foi registrado como endpoint GET.

### Apps Script

- Novo endpoint `sistema.bootstrap`.
- `os.listar` agora aceita:
  - `limit`
  - `offset`
  - `status`
  - `perfil`
  - `responsavel`
  - `setor`
  - `ativo_id`
  - `id_os`
  - `include`
- Padrao de `os.listar`: `limit=30`, `offset=0`, `include="resumo"`.
- `include="resumo"` nao carrega checklist, historico, eventos, anexos, equipamentos, componentes, parametros, leituras, versionamento ou auditoria.
- `include="detalhe"` carrega dados operacionais apenas das OS paginadas/filtradas.
- `include="referencias"` carrega referencias completas apenas sob demanda.

### Mock API

- Mantida paridade funcional com Apps Script.
- Adicionado `sistema.bootstrap`.
- `os.listar` no mock replica filtros, paginacao e semantica de `include`.

## Contrato recomendado

```js
await SCSApi.call("auth.login", { email, senha });
await SCSApi.call("sistema.bootstrap", { token }, "GET");
await SCSApi.call("os.listar", { token, limit: 30, offset: 0, include: "resumo" }, "GET");
await SCSApi.call("os.listar", { token, id_os, limit: 1, include: "detalhe" }, "GET");
```

## Risco residual conhecido

Views administrativas que precisam de cadastro completo ainda podem carregar referencias completas, mas isso acontece somente por acao explicita do usuario, nao no login.
