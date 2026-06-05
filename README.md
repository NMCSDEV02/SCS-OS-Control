# SCS OS Control

**Versão atual:** `2.0.0 - SaaS UI Implementation`  
**Status:** Release Candidate visual / Pré-produção controlada  
**Stack:** HTML + CSS + JavaScript Vanilla + Google Apps Script + Google Sheets

---

## Resumo

O SCS OS Control é um CMMS industrial mobile-first para controle de Ordens de Serviço, checklist técnico, QR Code, eventos, auditoria, permissões e indicadores operacionais.

Esta release aplica a nova interface SaaS industrial, mantendo a base funcional existente.

---

## Escopo da versão 2.0.0

```text
UI Shell + CSS Base
Dashboard por perfil
Telas operacionais
Eventos e notificações
Auditoria visual
Responsividade e polimento final
Documentação e release final
```

---

## Arquitetura

```text
Frontend: HTML + CSS + JavaScript Vanilla
Backend/API: Google Apps Script
Banco: Google Sheets
Mock local: localStorage via mock-api.js
API Client: assets/js/api-client.js
Aplicação principal: assets/js/app.js
Estilo principal: assets/css/styles.css
```

---

## Perfis

```text
Operador
Gestor / PCM
Admin Master
```

---

## Como testar

```text
operador@scs.local / 123456
gestor@scs.local / 123456
admin@scs.local / 123456
```

---

## Documentação principal

```text
docs/RELEASE_2_0_0_SAAS_UI.md
docs/CHECKLIST_TESTE_RELEASE_2_0_0.md
docs/INSTALACAO_RELEASE_2_0_0.md
docs/BLOCO_1_UI_SHELL_CSS_BASE.md
docs/BLOCO_2_DASHBOARD_POR_PERFIL.md
docs/BLOCO_3_TELAS_OPERACIONAIS.md
docs/BLOCO_4_EVENTOS_NOTIFICACOES_AUDITORIA.md
docs/BLOCO_5_RESPONSIVIDADE_POLIMENTO_FINAL.md
```

---

## Validação técnica

```text
node --check assets/js/app.js
Resultado: OK
```

---

## Observação

Esta release não altera Apps Script, schema da planilha, mock local ou API Client.


---

## Hotfix de login

Esta versão usa:

```text
storageKey: scs-os-control-local-db-v2
```

Isso evita carregar base mock antiga do navegador. Caso ainda falhe, limpe dados do site ou execute no console:

```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```
