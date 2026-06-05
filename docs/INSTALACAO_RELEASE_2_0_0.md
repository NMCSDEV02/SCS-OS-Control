# Instruções de Instalação — SCS OS Control 2.0.0 SaaS UI

## 1. Instalação local

1. Extraia o arquivo ZIP da release.
2. Abra a pasta extraída.
3. Abra `index.html` no navegador.

Para teste com servidor local:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

---

## 2. Publicação no GitHub Pages

Substitua os arquivos do projeto atual por estes arquivos da release:

```text
index.html
assets/css/styles.css
assets/js/app.js
assets/js/config.js
assets/js/config.production.example.js
README.md
CHANGELOG.md
docs/
```

Não substituir manualmente arquivos de backend ou schema se houver alterações locais não versionadas.

---

## 3. Arquivos que foram preservados

```text
apps-script/Code.gs
assets/js/mock-api.js
assets/js/api-client.js
google-sheets/SHEETS_SCHEMA.json
docs/PLANILHA_SCHEMA.md
```

---

## 4. API real

Para usar API real:

1. Configure `assets/js/config.js`.
2. Insira a URL do Web App do Google Apps Script.
3. Configure token se aplicável.
4. Teste login e ações principais.

---

## 5. Modo mock

Se `apiUrl` estiver vazio, o app deve operar em mock local com `mock-api.js`, preservando os testes de frontend.
