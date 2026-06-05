# Deploy real - SCS OS Control 1.5.7

Este guia coloca o sistema para funcionar com:

- Frontend: HTML, CSS e JavaScript Vanilla
- Backend/API: Google Apps Script
- Banco de dados: Google Sheets
- Publicacao frontend: GitHub Pages

## 1. Criar a planilha Google Sheets

1. Crie uma nova planilha no Google Drive.
2. Nome sugerido: `SCS_OS_CONTROL_DB`.
3. Abra `Extensoes > Apps Script`.
4. No Apps Script, crie ou mantenha o arquivo `Code.gs`.
5. Cole o conteudo de:

```text
apps-script/Code.gs
```

6. Se estiver usando o editor com manifest visivel, configure `appsscript.json` com:

```text
apps-script/appsscript.json
```

7. Salve o projeto.

## 2. Criar abas e dados iniciais

1. No Apps Script, selecione a funcao:

```text
setupInicial
```

2. Execute uma vez.
3. Autorize o script.
4. Verifique se as abas foram criadas.

Arquivos de conferencia:

```text
google-sheets/SHEETS_SCHEMA.json
google-sheets/SHEETS_HEADERS.csv
docs/PLANILHA_SCHEMA.md
```

Credenciais iniciais:

```text
Operador: operador@scs.local / 123456
Gestor: gestor@scs.local / 123456
Admin: admin@scs.local / 123456
```

Depois do primeiro acesso real, altere as senhas pelo painel Admin.

## 3. Publicar Apps Script como Web App

1. Clique em `Implantar > Nova implantacao`.
2. Tipo: `App da Web`.
3. Executar como: `Eu`.
4. Quem pode acessar: `Qualquer pessoa`.
5. Publique.
6. Copie a URL final terminada em `/exec`.

Exemplo:

```text
https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

## 4. Configurar o frontend

Abra:

```text
assets/js/config.js
```

Configure:

```js
window.SCS_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/SEU_DEPLOY_ID/exec",
  storageKey: "scs-os-control-local-db-v1",
  appVersion: "1.5.7"
};
```

Referencia:

```text
assets/js/config.production.example.js
```

Com `apiUrl` vazio, o app usa mock local. Com `apiUrl` preenchido, o app usa Google Apps Script.

## 5. Teste real antes do GitHub Pages

1. Abra `index.html` localmente ou rode um servidor local.
2. Login Admin:

```text
admin@scs.local / 123456
```

3. Validar:

- Login Admin, Gestor e Operador.
- Dashboard abre sem erro.
- Admin acessa Versionamento.
- Admin acessa Identidades.
- Gestor cria OS.
- Operador inicia OS.
- Operador salva checklist.
- Operador finaliza OS.
- Gestor aprova ou reabre OS.
- Auditoria registra login, OS, checklist e alteracoes.

## 6. Publicar no GitHub Pages

1. Crie um repositorio Git.
2. Copie para o repositorio estes arquivos e pastas:

```text
index.html
assets/
apps-script/
google-sheets/
docs/
README.md
CHANGELOG.md
PROJECT_AUDIT.md
```

3. Suba para o GitHub.
4. Em `Settings > Pages`, publique a branch principal.
5. Acesse a URL gerada pelo GitHub Pages.
6. Confirme que `assets/js/config.js` esta apontando para a URL `/exec` do Apps Script.

## 7. Regras de manutencao

- Toda versao publicada deve atualizar `CHANGELOG.md`.
- Toda versao publicada deve atualizar `assets/js/config.js`.
- Toda versao publicada deve inserir registro na aba `versionamento`.
- Nao alterar schema da planilha sem documentar migracao.
- Nao alterar contrato de endpoint sem atualizar frontend, Apps Script e changelog.
- Nao apagar linhas de `audit_log`, `historico`, `eventos` ou `versionamento`.
