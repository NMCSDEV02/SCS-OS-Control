# DOCUMENTAÇÃO DE IMPLEMENTAÇÃO — SCS OS Control V2.0.4

## Resumo

Hotfix para restaurar a visibilidade do shell autenticado após login: topbar, drawer/menu lateral e botões de ação.

A correção não altera schema, não recria o aplicativo, não muda tecnologia e não força leitura pesada da planilha no login.

## Diagnóstico

Depois dos hotfixes anteriores, o login passou a avançar, mas a interface autenticada podia ficar visualmente inconsistente: o conteúdo operacional aparecia grande na tela, enquanto o drawer e os botões de navegação não ficavam visíveis.

Causas prováveis mitigadas neste pacote:

1. O menu lateral iniciava fechado em desktop.
2. O navegador podia restaurar scroll antigo após reload/login.
3. Imagens/documentos operacionais grandes podiam dominar a área de conteúdo.
4. A topbar precisava de maior prioridade visual e de empilhamento (`z-index`) no shell autenticado.

## Arquivos alterados

- `assets/js/app.js`
- `assets/css/styles.css`
- `RELEASE_MANIFEST.json`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/DOCUMENTACAO_IMPLEMENTACAO_V2_0_4.md`

## Implementação

### 1. Estado visual autenticado

O frontend agora aplica classes no `body`:

- `is-login` na tela de login;
- `is-authenticated` no shell autenticado.

Isso permite CSS específico para a aplicação logada sem afetar o formulário de login.

### 2. Drawer aberto em desktop

Em telas `>= 841px`, o drawer é iniciado aberto por padrão para manter navegação lateral visível.

### 3. Scroll seguro

Foi adicionada rotina `safeScrollTop()` para evitar que o navegador restaure uma posição de rolagem antiga e esconda o topo da interface após login/reload.

### 4. Topbar e drawer protegidos

O CSS do shell autenticado força:

- topbar sticky com `z-index` alto;
- layout autenticado em coluna;
- drawer com prioridade de empilhamento;
- conteúdo com `overflow-x: hidden`.

### 5. Imagens operacionais contidas

Imagens, vídeos, canvas e SVG dentro da área de conteúdo agora respeitam limites de largura. Imagens operacionais também recebem altura máxima para não cobrir navegação e botões.

## Fluxo lógico esperado

```txt
auth.login
→ sistema.bootstrap
→ body.is-authenticated
→ drawer aberto em desktop
→ topbar visível
→ conteúdo renderizado dentro da área principal
→ imagens/documentos contidos
```

## Impacto técnico

- Não altera Apps Script.
- Não altera Google Sheets.
- Não altera schema.
- Não altera permissões.
- Não altera mock-api.js.
- Não altera api-client.js.
- Não carrega dados pesados no login.

## Testes recomendados

1. Substituir a pasta servida no `192.168.1.2:5000` pelo conteúdo deste ZIP.
2. Fazer `Ctrl + F5` no navegador.
3. Abrir DevTools > Application > Session Storage e remover `scs-os-control-session` se houver sessão antiga inconsistente.
4. Logar com:
   - `operador@scs.local` / `123456`
   - `gestor@scs.local` / `123456`
   - `admin@scs.local` / `123456`
5. Confirmar:
   - topbar visível;
   - drawer lateral visível no desktop;
   - botões superiores visíveis;
   - conteúdo não cobre a navegação;
   - imagens/documentos não explodem a altura da tela.

## Riscos remanescentes

- Se o servidor local ainda entregar arquivos antigos por cache, a correção não aparecerá.
- Se houver dados reais com imagens externas muito grandes, pode ser necessário criar visualizador dedicado de anexos.
- Se a API publicada ainda estiver em versão antiga, telas operacionais podem falhar ao carregar dados, mas o login/shell devem abrir.

## Próximos passos recomendados

Criar um componente dedicado para anexos/documentos:

```txt
attachments.viewer
→ thumbnail leve
→ abrir em modal
→ lazy loading
→ limite de tamanho
```

Isso evita que evidências/documentos técnicos grandes afetem o layout principal.
