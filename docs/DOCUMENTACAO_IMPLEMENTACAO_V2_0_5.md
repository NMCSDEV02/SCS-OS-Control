# DOCUMENTAÇÃO DE IMPLEMENTAÇÃO — SCS OS Control V2.0.5

## 1. Objetivo

Corrigir o desaparecimento dos ícones do menu central superior do painel autenticado.

O problema não era login, API, permissões ou drawer. O shell já estava carregando. O defeito estava na regra CSS da navegação central.

## 2. Diagnóstico técnico

A função `centerNavButton(item)` renderizava cada botão assim:

```html
<button>
  <span class="material-symbols-rounded">dashboard</span>
  <span>Dashboard</span>
</button>
```

Mas o CSS antigo usava um seletor genérico:

```css
.center-nav button span {
  display: none;
}
```

Esse seletor escondia **todos** os `span` dentro do botão, incluindo o `span.material-symbols-rounded` usado pelo ícone.

Resultado visual: os botões existiam, mas apareciam vazios.

## 3. Implementação realizada

### 3.1. `assets/js/app.js`

Alterado `centerNavButton(item)` para separar semanticamente o texto/tooltip do ícone.

Antes:

```js
${matIcon(item.icon)}<span>${escapeHtml(item.label)}</span>
```

Depois:

```js
${matIcon(item.icon)}<span class="center-nav-label">${escapeHtml(item.label)}</span>
```

### 3.2. `assets/css/styles.css`

Removido o seletor genérico que escondia todo `span` dentro de `.center-nav button`.

Antes:

```css
.center-nav button span { display: none; }
.center-nav button:hover span { display: block; }
```

Depois:

```css
.center-nav .material-symbols-rounded {
  display: inline-block;
}

.center-nav .center-nav-label {
  display: none;
}

.center-nav button:hover .center-nav-label,
.center-nav button:focus-visible .center-nav-label {
  display: block;
}
```

## 4. Código antigo removido/substituído

Para evitar repetição e conflito de CSS, o código antigo **não foi duplicado**. Ele foi substituído diretamente.

Removido/substituído:

```css
.center-nav button span
.center-nav button:hover span
```

Adicionado no lugar:

```css
.center-nav .material-symbols-rounded
.center-nav .center-nav-label
.center-nav button:hover .center-nav-label
.center-nav button:focus-visible .center-nav-label
```

## 5. Arquivos alterados

```txt
assets/js/app.js
assets/css/styles.css
assets/js/config.js
RELEASE_MANIFEST.json
DOCUMENTACAO_IMPLEMENTACAO.md
docs/DOCUMENTACAO_IMPLEMENTACAO_V2_0_5.md
```

## 6. Impacto técnico

- Ícones centrais voltam a aparecer.
- Tooltips continuam funcionando ao passar o mouse.
- Navegação por `data-view` não foi alterada.
- Drawer/menu lateral não foi alterado.
- Backend, Apps Script, Google Sheets, schema, mock API e `api-client.js` não foram alterados.

## 7. Testes recomendados

1. Substituir a pasta servida pelo conteúdo deste ZIP.
2. Executar `Ctrl + F5` no navegador.
3. Fazer login com `admin@scs.local` / `123456`.
4. Validar se os ícones aparecem no centro superior:
   - Dashboard;
   - Ordens de Serviço;
   - Checklists;
   - QR Code;
   - Analytics/Eventos.
5. Passar o mouse sobre cada botão e validar se o tooltip aparece.
6. Clicar em cada botão e validar se a troca de view ocorre normalmente.

## 8. Riscos conhecidos

Se a fonte do Google Material Symbols não carregar por falta de internet, o navegador pode exibir texto ou fallback da fonte. Isso é diferente deste bug. Este hotfix corrige o CSS que escondia o ícone mesmo quando a fonte estava disponível.

## 9. Próximos passos recomendados

Para tornar o app mais robusto em ambiente offline/local, considerar empacotar um fallback local de ícones ou substituir os ícones de topo por SVGs internos. Isso deve ser feito em outra etapa, porque altera estratégia de assets visuais.
