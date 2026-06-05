# Checklist de Teste — Release 2.0.0 SaaS UI

## 1. Preparação

```text
Abrir index.html em navegador moderno.
Garantir que está em modo mock se não houver API real configurada.
Limpar cache se houver versão antiga carregada.
```

---

## 2. Teste de login

| Perfil | Email | Senha | Esperado |
|---|---|---|---|
| Operador | operador@scs.local | 123456 | Home Operador |
| Gestor / PCM | gestor@scs.local | 123456 | Home Gestor / PCM |
| Admin Master | admin@scs.local | 123456 | Home Admin |

---

## 3. Operador

- [ ] Login abre sem tela branca.
- [ ] Topbar aparece corretamente.
- [ ] Bottom nav aparece no mobile.
- [ ] Home mostra próxima ação.
- [ ] Minhas OS abre.
- [ ] Detalhe da OS abre.
- [ ] Botão Iniciar OS aparece quando permitido.
- [ ] Checklist abre.
- [ ] Salvar checklist funciona.
- [ ] Evidência visual aparece.
- [ ] Finalização bloqueia pendências.
- [ ] QR Code abre.
- [ ] Eventos abre.

---

## 4. Gestor / PCM

- [ ] Dashboard abre.
- [ ] Backlog aparece.
- [ ] Fila de aprovação aparece.
- [ ] OS críticas aparecem.
- [ ] Gestão de OS abre.
- [ ] Criar OS abre.
- [ ] Acompanhamento abre.
- [ ] Aprovar OS funciona quando permitido.
- [ ] Reabrir OS funciona quando permitido.
- [ ] Central de eventos abre.
- [ ] Filtros de eventos funcionam.

---

## 5. Admin Master

- [ ] Dashboard Admin abre.
- [ ] Usuários abre.
- [ ] Permissões abre.
- [ ] Estrutura abre.
- [ ] Workflow abre.
- [ ] Auditoria abre.
- [ ] Backup abre.
- [ ] Integrações abre.
- [ ] Versionamento abre.
- [ ] Cards administrativos aparecem.

---

## 6. QR Code

- [ ] Tela QR abre.
- [ ] Scanner visual aparece.
- [ ] Entrada manual abre.
- [ ] Resultado de ativo aparece.
- [ ] OS vinculadas aparecem.
- [ ] Componentes aparecem.
- [ ] Parâmetros aparecem.
- [ ] Criar OS pelo equipamento aparece para perfil autorizado.

---

## 7. Eventos e auditoria

- [ ] Painel de notificações abre.
- [ ] Central de eventos abre.
- [ ] Filtro Todos funciona.
- [ ] Filtro SLA funciona.
- [ ] Filtro Aprovação funciona.
- [ ] Filtro Checklist funciona.
- [ ] Filtro Técnico funciona.
- [ ] Filtro Sistema funciona.
- [ ] Auditoria carrega logs.
- [ ] Cards por severidade aparecem.

---

## 8. Responsividade

### 360px

- [ ] Sem overflow horizontal.
- [ ] Topbar não quebra.
- [ ] Bottom nav visível.
- [ ] Menu abre como drawer.
- [ ] Dropdowns cabem na tela.
- [ ] Botões têm área clicável.

### 390px

- [ ] Sem quebra lateral.
- [ ] Cards cabem na tela.
- [ ] Checklist é legível.
- [ ] QR é legível.

### 414px

- [ ] Layout mobile confortável.
- [ ] Eventos são legíveis.
- [ ] OS cards são legíveis.

### Notebook

- [ ] Dashboard não fica poluído.
- [ ] Sidebar aberta/fechada funciona.
- [ ] Topbar fica alinhada.
- [ ] Cards usam bem a tela.

### Desktop

- [ ] Grids aproveitam a largura.
- [ ] Sidebar não sobrepõe conteúdo.
- [ ] Tabelas e cards mantêm leitura.
