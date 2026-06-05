# DOCUMENTAÇÃO DE IMPLEMENTAÇÃO — HOTFIX V2.0.2 LOGIN/SHELL RUNTIME

## 1. Arquitetura

Este hotfix corrige uma falha de runtime no frontend que impedia a conclusão visual do login mesmo quando `auth.login` respondia corretamente.

A correção mantém a arquitetura definida no hotfix V2.0.1:

- login leve via `auth.login`;
- bootstrap mínimo via `sistema.bootstrap`;
- nenhuma leitura operacional pesada no login;
- `os.listar` paginado e controlado por `include`;
- carregamento de OS sob demanda.

O problema identificado nesta etapa não era mais o excesso de leitura da planilha no login. O bloqueio observado na tela ocorria porque, depois do login, `renderShell()` chamava funções inexistentes no escopo do `app.js`.

## 2. Diagnóstico técnico

Após autenticar, o fluxo executava:

```txt
auth.login
→ bootstrapSession
→ emptyOperationalData
→ renderShell
```

Dentro de `renderShell()`, havia chamadas para:

```js
systemConnectivity()
normalizedMenu()
```

Essas funções eram referenciadas, mas não estavam implementadas no arquivo final. Resultado:

```txt
ReferenceError: systemConnectivity is not defined
```

ou, na sequência:

```txt
ReferenceError: normalizedMenu is not defined
```

Como o erro acontecia antes da criação da área de toasts, a função `showError()` não conseguia renderizar mensagem visível. Para o usuário, a tela parecia simplesmente “não logar”.

## 3. Código implementado

### 3.1 `normalizedMenu()`

Foi adicionada uma função de normalização defensiva do menu recebido da API/mock.

Ela aceita:

- array de objetos `{ id, label }`;
- array de arrays `[id, label]`;
- array simples de strings;
- fallback seguro quando o backend não envia menu.

Responsabilidades:

- evitar menu quebrado;
- remover duplicidades;
- preencher ícones via `viewIcon()`;
- preservar compatibilidade com `auth.login` e `sistema.bootstrap`.

### 3.2 `systemConnectivity()`

Foi adicionada função para informar o modo atual do sistema:

- `API real`, quando `SCS_CONFIG.apiUrl` está configurada;
- `Mock local`, quando o app roda com base local do navegador.

A função também informa o modo de carregamento atual:

- `login`;
- `bootstrap`;
- `resumo`;
- `detalhe`;
- `referencias`.

### 3.3 `showError()` com fallback no login

Antes, erros ocorridos na tela de login podiam ficar invisíveis porque o container `#toasts` só existe depois de `renderShell()`.

Agora, quando não existe stack de toast, `showError()` cria uma caixa inline dentro do formulário:

```html
<div id="login-error" class="form-error" role="alert"></div>
```

Isso torna erros de API, senha, CORS, Apps Script ou JavaScript visíveis na própria tela de login.

## 4. Arquivos alterados

```txt
assets/js/app.js
assets/js/config.js
RELEASE_MANIFEST.json
DOCUMENTACAO_IMPLEMENTACAO.md
docs/DOCUMENTACAO_IMPLEMENTACAO_V2_0_2.md
```

## 5. Fluxo lógico corrigido

```txt
Usuário clica Entrar
→ auth.login valida credenciais
→ sessão é salva
→ sistema.bootstrap tenta carregar contexto mínimo
→ state.data recebe emptyOperationalData()
→ renderShell() executa com normalizedMenu() e systemConnectivity() disponíveis
→ dashboard é exibido sem carregar OS pesada
```

## 6. Testes recomendados

### Login mock local

```txt
admin@scs.local / 123456
gestor@scs.local / 123456
operador@scs.local / 123456
```

Resultado esperado:

```txt
Login conclui → shell abre → dashboard aparece → nenhuma chamada pesada de OS no login.
```

### Login com senha errada

Resultado esperado:

```txt
Mensagem visível no formulário de login.
```

### Navegação para OS

Resultado esperado:

```txt
Ao abrir Minhas OS/Gestão OS → chamada os.listar com include=resumo, limit=30, offset=0.
```

### Detalhe de OS

Resultado esperado:

```txt
Ao abrir uma OS específica → chamada os.listar com include=detalhe, id_os e limit=1.
```

## 7. Riscos e observações

- Se o navegador estiver usando cache antigo, forçar reload com `Ctrl + F5`.
- Se estiver usando servidor local, garantir que a pasta servida é a do pacote V2.0.2.
- Se `apiUrl` estiver apontando para Apps Script, o script publicado também precisa estar atualizado com o `Code.gs` do hotfix V2.0.1 ou superior.
- O hotfix não altera schema, dados, permissões ou layout.

## 8. Escalabilidade futura

A próxima melhoria estrutural recomendada continua sendo separar endpoints operacionais:

```txt
dashboard.resumo
os.detalhar
referencias.listar
equipamentos.buscar
usuarios.buscar
```

Isso elimina a sobrecarga conceitual de `os.listar` e reduz riscos em planilhas grandes.
