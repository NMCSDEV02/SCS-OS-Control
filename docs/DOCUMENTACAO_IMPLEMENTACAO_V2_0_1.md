# Documentação de Implementação — SCS OS Control V2.0.1 Hotfix Login/API

## 1. Objetivo

Este hotfix corrige o problema de login e carregamento inicial do SCS OS Control V2.0.0 SaaS sem recriar o aplicativo, sem alterar o design e sem modificar o schema da planilha.

O problema tratado não era visual. A causa principal era arquitetural: após autenticar, o frontend chamava `os.listar`, e a API carregava dados operacionais e referências extensas da Google Sheet, provocando lentidão, timeout ou falha no Apps Script.

## 2. Diagnóstico técnico

Fluxo anterior problemático:

```txt
auth.login
→ salva sessão
→ chama os.listar automaticamente
→ os.listar monta OS completas
→ carrega checklist, histórico, eventos, anexos e referências
→ referencesFor() lê várias abas completas
→ Apps Script fica lento ou estoura limite de execução
```

Esse comportamento fazia o login depender da leitura de dados operacionais pesados, especialmente quando a planilha crescia.

## 3. Arquitetura implementada

O carregamento foi separado em três responsabilidades:

1. `auth.login`
   - valida credenciais;
   - retorna token;
   - retorna usuário;
   - retorna perfil;
   - retorna permissões;
   - retorna menu;
   - não carrega dados operacionais.

2. `sistema.bootstrap`
   - retorna informações mínimas de ambiente;
   - retorna usuário/perfil/permissões/menu;
   - retorna módulos liberados;
   - retorna versão ativa;
   - não lê ordens, checklist, histórico, eventos, anexos ou referências pesadas.

3. `os.listar`
   - passa a aceitar paginação, filtros e `include`;
   - padrão seguro: `include: "resumo"`, `limit: 30`, `offset: 0`;
   - dados detalhados são carregados somente quando solicitados.

## 4. Fluxo novo

```txt
auth.login
→ salva sessão leve
→ sistema.bootstrap
→ renderiza shell/dashboard
→ carrega OS apenas quando uma tela operacional precisa
→ carrega detalhe apenas da OS selecionada
```

## 5. Endpoints afetados

### 5.1 `auth.login`

Uso esperado:

```js
await SCSApi.call('auth.login', {
  email,
  senha
});
```

Retorno esperado:

```js
{
  ok: true,
  token: '...',
  usuario: {...},
  perfil: '...',
  permissoes: [...],
  menu: [...]
}
```

Não deve retornar:

- ordens;
- checklist;
- histórico;
- eventos;
- anexos;
- equipamentos;
- componentes;
- parâmetros;
- leituras;
- versionamento;
- auditoria.

### 5.2 `sistema.bootstrap`

Uso esperado:

```js
await SCSApi.call('sistema.bootstrap', {
  token
}, 'GET');
```

Retorno máximo:

```js
{
  ok: true,
  usuario: {...},
  perfil: '...',
  permissoes: [...],
  menu: [...],
  modulos: [...],
  versao: '2.0.1',
  ambiente: {...}
}
```

### 5.3 `os.listar`

Uso resumido:

```js
await SCSApi.call('os.listar', {
  token,
  limit: 30,
  offset: 0,
  include: 'resumo'
}, 'GET');
```

Uso detalhado:

```js
await SCSApi.call('os.listar', {
  token,
  id_os,
  limit: 1,
  include: 'detalhe'
}, 'GET');
```

Filtros suportados:

```js
{
  limit,
  offset,
  status,
  perfil,
  responsavel,
  setor,
  ativo_id,
  id_os,
  include
}
```

Valores de `include`:

| Valor | Comportamento |
|---|---|
| `resumo` | Retorna OS paginadas e campos mínimos para listagem/dashboard. |
| `detalhe` | Retorna dados operacionais da OS filtrada. |
| `referencias` | Retorna referências completas apenas quando explicitamente solicitado. |

## 6. Arquivos alterados

| Arquivo | Alteração |
|---|---|
| `apps-script/Code.gs` | Adicionado `sistema.bootstrap`; otimizado `os.listar`; reduzido carregamento pesado por padrão. |
| `assets/js/api-client.js` | Ajustado cliente para suportar chamadas leves e bootstrap. |
| `assets/js/app.js` | Removida chamada automática pesada de `os.listar` no login; carregamento operacional sob demanda. |
| `assets/js/mock-api.js` | Mock alinhado ao novo contrato de bootstrap e listagem paginada. |
| `RELEASE_MANIFEST.json` | Atualizado para V2.0.1 hotfix. |
| `docs/HOTFIX_LOGIN_API_BOOTSTRAP_V2_0_1.md` | Documentação técnica específica do hotfix. |
| `DOCUMENTACAO_IMPLEMENTACAO.md` | Documento raiz com resumo completo do que foi feito. |

## 7. Compatibilidade

Mantido:

- frontend existente;
- backend Apps Script;
- Google Sheets;
- schema atual;
- permissões;
- workflow;
- auditoria;
- mock local;
- API client;
- design visual.

Não foi feito:

- recriação do app;
- troca de tecnologia;
- alteração de layout;
- exclusão de dados;
- alteração estrutural de schema.

## 8. Riscos conhecidos

1. Se alguma tela administrativa chamar `include: "referencias"` sem necessidade, ainda poderá haver lentidão em planilhas grandes.
2. O Apps Script publicado precisa ser redeployado com o novo `Code.gs`; alterar apenas o frontend não corrige a URL pública.
3. Caso existam views antigas chamando `os.listar` sem filtros, o backend usa defaults seguros, mas a UX pode precisar disparar carregamento explícito.
4. Se a planilha tiver abas com milhares de linhas, o próximo gargalo será busca sem índice/cache.

## 9. Testes recomendados

### Login

- Entrar com usuário válido.
- Confirmar que a tela principal abre sem aguardar OS.
- Confirmar que nenhuma chamada pesada é feita antes do bootstrap.

### Bootstrap

- Chamar `sistema.bootstrap` com token válido.
- Validar retorno de usuário, perfil, permissões, menu, módulos e versão.
- Confirmar ausência de ordens, eventos, checklist e anexos.

### OS

- Chamar `os.listar` com `include: "resumo"` e `limit: 30`.
- Validar paginação.
- Abrir detalhe de uma OS específica com `include: "detalhe"`.
- Confirmar que dados pesados aparecem apenas no detalhe.

## 10. Próximas melhorias recomendadas

1. Criar endpoint dedicado `dashboard.resumo`.
2. Criar endpoint dedicado `os.detalhar`.
3. Criar endpoint dedicado `referencias.listar` com cache.
4. Implementar cache curto para permissões/menu.
5. Implementar índices auxiliares por `status`, `responsavel`, `setor` e `ativo_id`.
6. Adicionar telemetria de tempo de execução por endpoint no Apps Script.
7. Adicionar testes de contrato para impedir regressão no login.

## 11. Convenção para entregas futuras

A partir deste pacote, toda criação ou alteração de artefato deve incluir um arquivo `.md` de documentação contendo, no mínimo:

- objetivo;
- diagnóstico ou contexto;
- arquivos alterados;
- decisões arquiteturais;
- fluxo lógico;
- instruções de uso/deploy;
- riscos conhecidos;
- testes recomendados;
- próximos passos.
