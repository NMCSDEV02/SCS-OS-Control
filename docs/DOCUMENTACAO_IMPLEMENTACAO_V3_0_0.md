# SCS OS Control V3.0.0 — Implementação 1

## Escopo

Implementação visual/UX focada em navegação, drawer acordeão e ações rápidas configuráveis.

Não foram alterados backend, API, Apps Script, Google Sheets, schema, login, `mock-api.js` ou `api-client.js`.

## Auditoria antes da implementação

### Problemas encontrados

1. O botão/dock com ícone de raio no painel direito recolhido duplicava o botão principal de ações rápidas da topbar.
2. O menu lateral ainda expunha subtópicos de forma permanente, deixando a navegação visualmente pesada.
3. Os tópicos principais do drawer não funcionavam como domínio recolhível/expansível.
4. A configuração das ações rápidas existia apenas como intenção visual, mas não permitia selecionar atalhos do painel.
5. No mobile, o drawer ficava atrás da bottom nav e parecia ser cortado.
6. No mobile, o header podia parecer deslocado durante rolagem de conteúdo.

## Plano de impacto

| Área | Alteração | Impacto esperado | Risco |
|---|---|---|---|
| Desktop topbar | Manter apenas o botão do painel direito | Menos duplicidade visual | Baixo |
| Painel direito | Remover dock de raio recolhido | Evita dois botões com função semelhante | Baixo |
| Drawer | Converter grupos em acordeão | Menu mais limpo e administrativo | Médio visual |
| Ações rápidas | Configuração visual local por checkbox | Atalhos configuráveis sem backend novo | Baixo |
| Mobile drawer | Compactar e elevar z-index | Drawer não fica sobreposto pela bottom nav | Baixo |
| Mobile header | Sticky/top estável | Header não desloca no scroll | Baixo |

## Implementação

### 1. Drawer lateral acordeão

O `menuGroup(group)` agora renderiza o tópico principal com:

```js
data-action="toggle-nav-group"
aria-expanded="true|false"
```

O grupo abre ou fecha os subtópicos sem navegar automaticamente. A navegação acontece nos itens internos (`nav-item`).

### 2. Ações rápidas configuráveis

Foi criado um catálogo visual com `id`, `perfil`, `dispositivo`, `módulo` e `permissão`.

O botão de editar do painel abre uma seção de configuração local com checkboxes. A seleção é salva em:

```txt
localStorage: scs-os-control-quick-actions-v3
```

Sem schema novo. Sem backend novo.

### 3. Remoção do dock redundante

O bloco de dock/raio do painel recolhido foi removido da renderização e protegido no CSS:

```css
.quick-panel-collapsed-actions { display: none !important; }
```

### 4. Mobile

O drawer mobile agora fica acima da bottom nav, com largura menor, espaçamento reduzido e subtópicos recolhíveis.

## Arquivos alterados

- `assets/js/app.js`
- `assets/css/styles.css`
- `assets/js/config.js`
- `CHANGELOG.md`
- `RELEASE_MANIFEST.json`
- `DOCUMENTACAO_IMPLEMENTACAO.md`
- `docs/DOCUMENTACAO_IMPLEMENTACAO_V3_0_0.md`

## Arquivos preservados

- `apps-script/Code.gs`
- `assets/js/api-client.js`
- `assets/js/mock-api.js`
- `google-sheets/SHEETS_SCHEMA.json`
- `google-sheets/SHEETS_HEADERS.csv`
- `index.html`

## Testes recomendados

### Desktop

1. Abrir e fechar o painel direito pela topbar.
2. Confirmar que o botão de raio lateral não aparece mais.
3. Clicar em Operações, Qualidade Técnica, Ativos e Rastreabilidade, PCM, Governança e Sistema.
4. Confirmar que cada grupo abre/fecha seus subtópicos.
5. Navegar por subtópicos e verificar item ativo.
6. Clicar em editar ações rápidas e marcar/desmarcar atalhos.

### Mobile

1. Abrir drawer em 320px e 390px.
2. Confirmar que bottom nav não cobre o drawer.
3. Confirmar que o header não se move indevidamente no scroll.
4. Confirmar que FAB continua no canto inferior direito.

## Próximos blocos V3

1. Implementar acompanhamento de ativo/componente/linha/setor com notificações dedicadas.
2. Separar Indicadores de Relatórios Gerenciais: gráficos/KPIs versus documento imprimível.
3. Evoluir Programação de Manutenção para corretiva planejada, emergencial e preventiva com prazos técnicos.
