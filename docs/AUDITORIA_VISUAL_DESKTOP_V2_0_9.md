# Auditoria Visual Desktop V2.0.9

## Escopo
Correção exclusivamente visual/UX/frontend desktop. Backend, Apps Script, API, Google Sheets, schema, login, `mock-api.js` e `api-client.js` preservados.

## 1. Containers do shell atual
Antes do hotfix, o shell usava:

- `.layout`
- `.topbar`
- `.brand`
- `.center-nav`
- `.topbar-actions`
- `.main-grid`
- `.sidebar`
- `.content`
- `.bottom-nav`

Após o hotfix, a estrutura visual passa a operar como:

```txt
.app-layout
  .app-topbar
    .topbar-left
    .topbar-center / .center-nav
    .topbar-right
  .workspace / .main-grid
    .sidebar
    .main-content / .content
    .quick-panel
```

## 2. Drawer lateral
Problemas encontrados:

- categoria e subtópico ainda tinham nomenclatura simples demais para SaaS industrial;
- item ativo dependia apenas de `data-view`, sem atualização explícita do grupo;
- drawer fechado precisava manter ícones clicáveis e remover áreas mortas;
- marca grande no topo ocupava espaço indevido.

Correções:

- grupos renomeados para domínios industriais;
- `data-menu-group` usado para ativação correta do grupo;
- ícones preservados no drawer recolhido;
- identidade compacta movida para dentro do drawer.

## 3. Topbar
Problemas encontrados:

- bloco de marca/nome ocupava área excessiva;
- `API real` e perfil `Admin` apareciam como ruído técnico;
- navegação central podia parecer deslocada conforme drawer/painel.

Correções:

- topbar limpa com botão de drawer à esquerda;
- navegação central com `left: 50%` e `transform: translateX(-50%)`;
- ações à direita reduzidas a painel rápido, notificações e nova ação;
- indicadores técnicos ocultados visualmente.

## 4. Área central
Problemas encontrados:

- área útil não era independente de painel direito;
- havia risco de largura fixa e áreas brancas mortas;
- formulários e cards precisavam respeitar `minmax(0, 1fr)`.

Correções:

- workspace em três colunas;
- conteúdo central com `minmax(0, 1fr)`;
- central expande quando drawer ou painel direito recolhem.

## 5. Painel direito
Problema encontrado:

- ações rápidas ficavam em popover pequeno no topo.

Correção:

- criado `.quick-panel` desktop minimizável, com atalhos, notificações e KPIs rápidos.

## 6. Scrollbars
Problemas encontrados:

- scrollbars grossas e visualmente intrusivas;
- risco de scroll horizontal no drawer/conteúdo.

Correções:

- scrollbar fina e transparente;
- `overflow-x: hidden` nas zonas principais.

## 7. Nomenclatura SaaS Industrial
Novo mapa:

1. Operações
   - Centro Operacional
   - Ordens de Serviço
   - Execução Técnica
   - Aprovações
2. Qualidade Técnica
   - Modelos de Checklist
   - Não Conformidades
3. Ativos e Rastreabilidade
   - QR Code
   - Ativos Industriais
   - Histórico Técnico
4. PCM e Performance
   - Programação
   - Indicadores
   - Relatórios Gerenciais
5. Governança
   - Usuários
   - Perfis e Permissões
   - Cadastros Operacionais
   - Workflow
6. Administração do Sistema
   - Auditoria e Logs
   - Backup
   - Integrações
   - Versionamento

## 8. Plano executado por blocos

- Bloco 1: shell desktop em três zonas.
- Bloco 2: topbar limpa e navegação centralizada.
- Bloco 3: menu SaaS Industrial e grupo ativo independente.
- Bloco 4: painel direito minimizável.
- Bloco 5: scrollbars finas.
- Bloco 6: polimento de cards, conteúdo e checklist preservado.
