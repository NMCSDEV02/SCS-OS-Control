# Documentação de Implementação — SCS OS Control V2.0.3

## 1. Objetivo

Corrigir a falha de login que ainda permanecia após o hotfix V2.0.2. O login autenticava, porém o frontend quebrava durante a renderização do shell por referência a uma função inexistente: `menuButton`.

## 2. Diagnóstico

Após `auth.login` e `sistema.bootstrap`, o método `renderShell()` chama:

```js
groupedMenu().map((group) => menuGroup(group)).join("")
```

Dentro de `menuGroup()`, o código executava:

```js
group.items.map((item) => menuButton(item)).join("")
```

Mas `menuButton()` não estava definido no bundle `assets/js/app.js`. Isso gerava o erro de runtime:

```txt
menuButton is not defined
```

Como esse erro acontece depois da autenticação, a tela parecia “não logar”, mas a causa real era quebra de renderização do menu lateral.

## 3. Implementação realizada

Foi adicionada a função `menuButton(item)` em `assets/js/app.js`, antes de `menuGroup(group)`.

A função implementada:

- renderiza cada item do menu lateral;
- aplica estado ativo conforme `state.view`;
- preserva ícone via `item.icon` ou fallback `viewIcon(item.id)`;
- preserva escape de HTML/atributos com `escapeHtml()` e `escapeAttr()`;
- trata o item `sair` com classe `menu-danger`;
- usa `data-view`, mantendo o fluxo de navegação já existente.

## 4. Arquivos alterados

```txt
assets/js/app.js
assets/js/config.js
RELEASE_MANIFEST.json
DOCUMENTACAO_IMPLEMENTACAO.md
docs/DOCUMENTACAO_IMPLEMENTACAO_V2_0_3.md
```

## 5. Fluxo lógico corrigido

```txt
auth.login
→ sessão salva
→ sistema.bootstrap
→ renderShell()
→ groupedMenu()
→ menuGroup()
→ menuButton()
→ dashboard renderizado
```

## 6. Impacto técnico

A correção é localizada e não altera:

- schema da planilha;
- Google Apps Script;
- endpoints;
- permissões;
- auditoria;
- layout visual;
- mock-api;
- api-client.

## 7. Testes recomendados

1. Substituir a pasta servida localmente pela versão V2.0.3.
2. Executar hard refresh no navegador: `Ctrl + F5`.
3. Testar login com:
   - `admin@scs.local`;
   - `gestor@scs.local`;
   - `operador@scs.local`.
4. Validar se o dashboard abre após autenticação.
5. Abrir DevTools > Console e confirmar ausência de `ReferenceError`.
6. Navegar pelo menu lateral e menu inferior.

## 8. Riscos conhecidos

Se aparecer novo erro após este ponto, ele será outro erro sequencial de runtime pós-login. A autenticação já não deve ser tratada como causa primária sem verificar o Console do navegador.

## 9. Próximo passo recomendado

Adicionar uma pequena proteção global no bootstrap do frontend para capturar erros pós-login e exibir uma mensagem técnica com stack simplificado. Isso reduz ciclos de tentativa quando uma função de UI estiver ausente.
