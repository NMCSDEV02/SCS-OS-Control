# Hotfix 2.0.0-login.1 — Correção de login no modo mock

## Causa provável

A release 2.0.0 preservou o `storageKey` antigo:

```text
scs-os-control-local-db-v1
```

Como o mock local usa `localStorage`, navegadores que já haviam aberto versões anteriores podiam carregar uma base local antiga, com usuários, senhas, permissões ou tokens diferentes.

Isso podia causar falha de login mesmo com:

```text
operador@scs.local / 123456
gestor@scs.local / 123456
admin@scs.local / 123456
```

## Correção aplicada

Foi alterado o `storageKey` para:

```text
scs-os-control-local-db-v2
```

Assim, o navegador cria uma base mock limpa para a versão 2.0.0.

## Arquivos alterados

```text
assets/js/config.js
assets/js/config.production.example.js
CHANGELOG.md
docs/HOTFIX_LOGIN_MOCK_STORAGEKEY_V2.md
```

## Backend preservado

Não foram alterados:

```text
apps-script/Code.gs
assets/js/mock-api.js
assets/js/api-client.js
google-sheets/SHEETS_SCHEMA.json
docs/PLANILHA_SCHEMA.md
```

## Alternativa manual sem hotfix

No navegador, abrir o console e executar:

```javascript
localStorage.removeItem("scs-os-control-local-db-v1");
sessionStorage.removeItem("scs-os-control-session");
location.reload();
```
