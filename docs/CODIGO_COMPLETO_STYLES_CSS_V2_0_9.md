# Código completo — `assets/css/styles.css` V2.0.9

```css

/* ==========================================================================
   SCS OS Control — 2.0.0 SaaS UI / Bloco 1
   Escopo: UI Shell + CSS Base. Não altera API, Apps Script, mock ou schema.
   ========================================================================== */

:root{
  --bg:#f3f6fa;
  --surface:#ffffff;
  --surface-2:#f8fafc;
  --surface-3:#eef3f8;
  --line:#d9e2ef;
  --line-strong:#c7d3e1;
  --text:#101828;
  --text-2:#344054;
  --muted:#667085;
  --muted-2:#98a2b3;
  --primary:#2563eb;
  --primary-700:#1d4ed8;
  --primary-soft:#eaf1ff;
  --green:#16a34a;
  --green-soft:#eaf8ef;
  --red:#dc2626;
  --red-soft:#fee2e2;
  --amber:#d97706;
  --amber-soft:#fff7ed;
  --purple:#6d28d9;
  --purple-soft:#f3e8ff;
  --shadow:0 14px 34px rgba(16,24,40,.10);
  --shadow-soft:0 1px 2px rgba(16,24,40,.05);
  --radius:16px;
  --radius-sm:12px;
  --topbar-h:58px;
  --bottomnav-h:66px;
  color-scheme:light;
}

*,
*::before,
*::after{box-sizing:border-box}

html,
body{
  min-height:100%;
  margin:0;
  background:var(--bg);
  color:var(--text);
  font-family:Inter,"Segoe UI",Arial,sans-serif;
  font-size:14px;
  line-height:1.35;
  overflow-x:hidden;
}

button,input,select,textarea{font:inherit}
button{cursor:pointer}
a{color:inherit;text-decoration:none}
h1,h2,h3,p{margin-top:0}
h1{font-size:22px;line-height:1.15;margin-bottom:4px;letter-spacing:-.02em}
h2{font-size:18px;line-height:1.2;margin-bottom:6px}
h3{font-size:15px;line-height:1.2;margin-bottom:5px}
p{color:var(--muted);margin-bottom:0}
strong,b{color:var(--text)}

.material-symbols-rounded{
  font-family:"Material Symbols Rounded";
  font-weight:500;
  font-style:normal;
  font-size:21px;
  line-height:1;
  letter-spacing:normal;
  text-transform:none;
  display:inline-block;
  white-space:nowrap;
  word-wrap:normal;
  direction:ltr;
  -webkit-font-feature-settings:"liga";
  -webkit-font-smoothing:antialiased;
  font-variation-settings:"FILL" 0,"wght" 500,"GRAD" 0,"opsz" 24;
}

.app-shell,
.layout{
  min-height:100vh;
  background:var(--bg);
  color:var(--text);
}

/* Login */
.login-screen{
  min-height:100vh;
  display:grid;
  place-items:center;
  padding:24px;
  background:linear-gradient(180deg,#f8fafc,#eef3f8);
}
.login-panel{
  width:min(440px,100%);
  border:1px solid var(--line);
  border-radius:20px;
  background:#fff;
  padding:24px;
  box-shadow:var(--shadow);
}
.brand-block{display:flex;gap:12px;align-items:center;margin-bottom:18px}
.brand-logo-small{width:44px;height:44px;border-radius:12px;object-fit:cover;border:1px solid var(--line)}

/* Topbar */
.topbar{
  position:sticky;
  top:0;
  z-index:80;
  min-height:var(--topbar-h);
  display:grid;
  grid-template-columns:minmax(230px,280px) minmax(320px,1fr) minmax(260px,330px);
  align-items:center;
  gap:10px;
  padding:0 14px;
  border-bottom:1px solid var(--line);
  background:rgba(255,255,255,.97);
  backdrop-filter:blur(14px);
}

.brand,
.topbar-title{
  display:flex;
  align-items:center;
  gap:10px;
  min-width:0;
}
.brand-text,
.topbar-title>div{min-width:0}
.brand strong,
.topbar-title strong{
  display:block;
  font-size:15px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.brand span,
.topbar-title span{
  display:block;
  color:var(--muted);
  font-size:12px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.brand-system-mark{
  width:34px;
  height:34px;
  border-radius:10px;
  background:#111827;
  color:#fff;
  display:grid;
  place-items:center;
  font-size:12px;
  font-weight:900;
  flex:0 0 auto;
}

.icon-action,
.menu-toggle{
  width:38px;
  height:38px;
  flex:0 0 38px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#fff;
  color:#344054;
  display:grid;
  place-items:center;
  position:relative;
}
.icon-action:hover,
.menu-toggle:hover{
  background:#f8fafc;
  border-color:var(--line-strong);
}

.center-nav{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;
}
.center-nav-button{
  height:42px;
  min-width:72px;
  border:1px solid transparent;
  border-radius:12px;
  background:transparent;
  color:#475467;
  display:grid;
  place-items:center;
  position:relative;
}
.center-nav-button.active{
  background:var(--primary-soft);
  border-color:#bdd1ff;
  color:var(--primary);
}
.center-nav-button:hover{
  background:#f8fafc;
  border-color:var(--line);
}
.center-nav-button .material-symbols-rounded{
  display:inline-block;
  font-size:21px;
  line-height:1;
}
.center-nav-tooltip{
  display:none;
  position:absolute;
  top:46px;
  background:#111827;
  color:#fff;
  border-radius:8px;
  padding:4px 8px;
  font-size:12px;
  font-weight:700;
  white-space:nowrap;
  box-shadow:var(--shadow);
  z-index:650;
}
.center-nav-button:hover .center-nav-tooltip,
.center-nav-button:focus-visible .center-nav-tooltip{display:block}

.topbar-actions{
  display:flex;
  justify-content:flex-end;
  align-items:center;
  gap:8px;
  min-width:0;
}
.system-status,
.session-pill{
  height:32px;
  border:1px solid var(--line);
  border-radius:999px;
  background:#fff;
  padding:0 11px;
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-weight:850;
  color:#334155;
  white-space:nowrap;
}
.system-status i{
  width:8px;
  height:8px;
  border-radius:50%;
  background:var(--green);
}
.system-status.is-offline i{background:var(--red)}
.system-status.is-local i{background:#0891b2}

.notification-action b{
  position:absolute;
  right:-6px;
  top:-6px;
  background:var(--red);
  color:#fff;
  border:2px solid #fff;
  min-width:20px;
  height:20px;
  border-radius:999px;
  font-size:11px;
  display:grid;
  place-items:center;
}

.topbar-popover{position:relative}
.dropdown-panel{
  position:absolute;
  right:0;
  top:46px;
  z-index:120;
  width:360px;
  max-width:calc(100vw - 20px);
  display:none;
  padding:10px;
  border:1px solid var(--line);
  border-radius:16px;
  background:#fff;
  box-shadow:var(--shadow);
}
.topbar-popover:hover .dropdown-panel,
.topbar-popover:focus-within .dropdown-panel{display:block}
.dropdown-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:8px;
}
.dropdown-head span{color:var(--muted);font-size:12px;font-weight:850}
.action-panel button,
.notification-mini{
  width:100%;
  min-height:40px;
  border:1px solid var(--line);
  background:#fff;
  border-radius:12px;
  text-align:left;
  padding:8px 12px;
  margin:6px 0;
  font-weight:900;
  color:var(--text);
  display:flex;
  align-items:center;
  gap:8px;
}
.notification-mini{
  display:grid;
  gap:2px;
  background:#f8fafc;
  border-left:4px solid var(--primary);
}
.notification-mini.critical,
.notification-mini.red{border-left-color:var(--red)}
.notification-mini.warning,
.notification-mini.amber{border-left-color:var(--amber)}
.notification-mini small{color:var(--muted);font-weight:700}

/* Shell / sidebar */
.main-grid{
  display:grid;
  grid-template-columns:72px minmax(0,1fr);
  min-height:calc(100vh - var(--topbar-h));
}
.main-grid.expanded{grid-template-columns:246px minmax(0,1fr)}

.sidebar{
  position:sticky;
  top:var(--topbar-h);
  width:72px;
  height:calc(100vh - var(--topbar-h));
  overflow:auto;
  padding:10px;
  border-right:1px solid var(--line);
  background:#fff;
  transition:width .18s ease;
}
.main-grid.expanded .sidebar{width:246px}
.menu-list{display:grid;gap:0}

.nav-group{
  border-bottom:1px solid #eef2f7;
  padding:6px 0;
}
.nav-head{
  height:42px;
  width:100%;
  border:0;
  background:transparent;
  color:#344054;
  display:flex;
  align-items:center;
  gap:12px;
  border-radius:12px;
  padding:0 11px;
  font-weight:900;
}
.nav-head:hover,
.nav-head.active{
  background:var(--primary-soft);
  color:var(--primary);
}
.nav-sub{
  display:none;
  padding:4px 0 4px 42px;
}
.main-grid.expanded .nav-sub{display:grid;gap:4px}
.nav-item,
.menu-list>button{
  min-height:34px;
  border:0;
  background:transparent;
  color:#475467;
  display:flex;
  align-items:center;
  gap:8px;
  border-radius:9px;
  padding:6px 10px;
  font-weight:800;
  text-align:left;
}
.nav-item:hover,
.menu-list>button:hover{background:#f8fafc}
.nav-item.active,
.menu-list>button.active{
  background:var(--primary-soft);
  color:var(--primary);
}
.menu-danger{color:var(--red)!important}
.main-grid:not(.expanded) .nav-head span:not(.material-symbols-rounded),
.main-grid:not(.expanded) .nav-sub{display:none}
.main-grid:not(.expanded) .nav-head{
  justify-content:center;
  padding:0;
}

/* Content */
.content{
  min-width:0;
  padding:14px 18px 22px;
}

.panel,
.card,
.metric-card,
.kpi-card,
.static-info-card,
.entity-card,
.model-card,
.audit-card,
.event-list-card,
.event-summary-card,
.parameter-card,
.component-trace-card,
.evidence-card,
.execution-card,
.os-card,
.module-card,
.flow-card,
.builder-step,
.checklist-item,
.checklist-builder-item,
.qr-panel,
.asset-hero,
.cadastro-form,
.cadastro-table-panel,
.cadastro-tab-panel{
  background:#fff!important;
  color:var(--text)!important;
  border:1px solid var(--line);
  border-radius:var(--radius);
  box-shadow:var(--shadow-soft);
}

.panel,
.card,
.metric-card,
.kpi-card,
.static-info-card,
.entity-card,
.model-card,
.audit-card,
.event-list-card,
.event-summary-card,
.parameter-card,
.component-trace-card,
.evidence-card,
.execution-card,
.os-card,
.module-card,
.flow-card,
.builder-step,
.checklist-item,
.checklist-builder-item{
  padding:12px;
}

.panel+ .panel{margin-top:12px}
.panel-head,
.entity-card-head,
.model-card-head,
.module-card-head,
.checklist-item-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:10px;
  margin-bottom:10px;
}
.section-kicker,
.asset-kicker,
.flow-kicker,
.inline-meta,
.small-note,
.muted,
.card-subtitle,
.os-card-subtitle,
.event-card-meta,
.model-meta-strip,
.checklist-meta-line,
.checklist-line,
.asset-state,
.audit-head,
.audit-mark,
.reading-row,
.log-row,
.data-row,
.asset-stat,
.model-stats{
  color:var(--muted);
  font-size:.82rem;
}

.dashboard-grid,
.compact-dashboard-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
  margin-top:8px;
}
.analytics-grid{
  display:grid;
  grid-template-columns:1.1fr 1.1fr .9fr;
  gap:10px;
  margin-top:10px;
}
.cards-grid,
.entity-card-grid,
.model-card-grid,
.parameter-grid,
.component-trace-grid,
.evidence-grid,
.asset-quick-grid,
.detail-grid,
.permission-grid,
.endpoint-grid,
.module-profile-grid,
.form-grid,
.risk-grid,
.event-summary-grid{
  display:grid;
  gap:10px;
}
.cards-grid,
.entity-card-grid,
.model-card-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.risk-grid,
.event-summary-grid{grid-template-columns:repeat(4,minmax(0,1fr))}

.kpi-card h3,
.metric-card h3{
  margin:0 0 2px;
  color:var(--muted);
  font-size:.7rem;
  font-weight:900;
  letter-spacing:.04em;
  text-transform:uppercase;
}
.kpi-card strong,
.metric-card strong{
  display:block;
  color:var(--text);
  font-size:1.35rem;
  line-height:1.05;
}
.kpi-card p,
.metric-card p{font-size:.78rem;color:var(--text-2)}

.kpi-bar,
.bar-track{
  height:5px;
  background:#dce4ee;
  border-radius:999px;
  overflow:hidden;
  margin-top:8px;
}
.kpi-bar span,
.bar-track i,
.bar-track span{
  display:block;
  height:100%;
  background:var(--primary);
  border-radius:inherit;
}

.bar-list,
.os-list,
.execution-list,
.data-list,
.audit-timeline,
.reading-timeline,
.event-list,
.event-group-stack,
.checklist-list{
  display:grid;
  gap:8px;
}
.bar-row{
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(90px,110px) auto;
  align-items:center;
  gap:8px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#f8fafc;
  padding:8px;
}
.bar-row strong{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.bar-row small,
.bar-row span{color:var(--muted);font-size:.76rem;font-weight:800}

.primary-action,
.secondary-action,
.danger-action,
.ghost-action,
.add-inline-action,
.tab-action,
.chip-action,
.btn{
  min-height:40px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#fff;
  color:var(--text);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:8px 13px;
  font-weight:900;
  text-decoration:none;
}
.primary-action,
.btn.primary{
  background:var(--primary);
  border-color:var(--primary);
  color:#fff;
}
.danger-action,
.btn.red{
  background:var(--red);
  border-color:var(--red);
  color:#fff;
}
.secondary-action:hover,
.ghost-action:hover,
.add-inline-action:hover,
.tab-action:hover,
.chip-action:hover,
.btn:hover{filter:brightness(.985)}

.quick-actions,
.mini-actions,
.footer-actions{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin:10px 0;
}

.tag,
.status-chip,
.status-badge,
.badge,
.status{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:25px;
  padding:0 9px;
  border:1px solid var(--line);
  border-radius:999px;
  background:#f8fafc;
  color:var(--text-2);
  font-size:.76rem;
  font-weight:900;
  white-space:nowrap;
}
.tag.blue,
.blue,
.status-planejada,
.status-liberada{background:var(--primary-soft);border-color:#bdd1ff;color:var(--primary)}
.tag.green,
.green,
.status-concluida{background:var(--green-soft);border-color:#bbf7d0;color:var(--green)}
.tag.red,
.red,
.status-reaberta,
.status-cancelada{background:var(--red-soft);border-color:#fecaca;color:var(--red)}
.tag.amber,
.amber,
.status-execucao,
.status-aprovacao{background:var(--amber-soft);border-color:#fed7aa;color:var(--amber)}

input,
select,
textarea{
  width:100%;
  min-height:40px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#fff;
  color:var(--text);
  padding:8px 10px;
  outline:none;
}
textarea{min-height:78px;resize:vertical}
label{
  display:grid;
  gap:5px;
  color:var(--text);
  font-weight:800;
  font-size:.84rem;
}
input:focus,
select:focus,
textarea:focus,
button:focus-visible{
  outline:none;
  border-color:#93b4ff;
  box-shadow:0 0 0 3px rgba(37,99,235,.14);
}

table{
  width:100%;
  border-collapse:collapse;
  background:#fff;
  color:var(--text);
}
th,td{
  padding:9px 10px;
  border-bottom:1px solid var(--line);
  text-align:left;
}
th{
  background:#f8fafc;
  color:#475467;
  font-size:.75rem;
  font-weight:900;
  text-transform:uppercase;
}

.qr-scanner,
.qr-camera-state{
  min-height:230px;
  display:grid;
  place-items:center;
  border:1px solid var(--line);
  border-radius:var(--radius);
  background:#eef3f8;
  color:var(--text);
}
.qr-camera-state>div,
.qr-camera-state .empty-state{
  width:min(460px,90%);
  border:1px solid var(--line);
  border-radius:16px;
  background:#fff;
  padding:24px;
  text-align:center;
}
.qr-video{
  width:100%;
  max-height:360px;
  border-radius:var(--radius);
  background:#dce4ee;
}

.module-board,
.workflow-board,
.checklist-builder,
.builder-steps{
  display:grid;
  gap:10px;
}
.module-profile-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.module-profile,
.module-permission,
.permission-row{
  display:flex;
  align-items:center;
  gap:8px;
  min-height:38px;
  padding:8px 10px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#fff;
  color:var(--text);
  font-weight:850;
}
.module-profile.active,
.module-permission.active,
.permission-row.active{
  border-color:#bbf7d0;
  background:var(--green-soft);
  color:var(--green);
}

.builder-step{
  display:grid;
  grid-template-columns:36px minmax(0,1fr);
  gap:12px;
}
.builder-step>.step-number,
.builder-step>span:first-child{
  width:32px;
  height:32px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:var(--primary-soft);
  color:var(--primary);
  font-weight:900;
}
.checklist-item{border-left:4px solid var(--primary)}
.checklist-ok{border-left-color:var(--green)}
.checklist-nok{border-left-color:var(--red)}
.checklist-na{border-left-color:var(--muted)}

.event-command-center{display:grid;gap:10px}
.event-tag-strip,
.segmented{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}
.event-tag-strip button,
.segmented button{
  min-height:34px;
  padding:0 12px;
  border:1px solid var(--line);
  border-radius:999px;
  background:#fff;
  color:var(--text);
  font-size:.8rem;
  font-weight:850;
}
.event-tag-strip button.active,
.segmented button.active{
  background:var(--primary-soft);
  border-color:#bdd1ff;
  color:var(--primary);
}
.event-group{
  padding:12px;
  border:1px solid var(--line);
  border-radius:var(--radius);
  background:#fff;
}
.event-list-card{border-left:4px solid var(--primary)}
.event-list-card.red{border-left-color:var(--red)}
.event-list-card.amber{border-left-color:var(--amber)}
.event-list-card.green{border-left-color:var(--green)}

.toast-stack{
  position:fixed;
  right:18px;
  bottom:18px;
  z-index:160;
  display:grid;
  max-width:360px;
  gap:8px;
}
.toast{
  border:1px solid var(--line);
  border-left:4px solid var(--primary);
  border-radius:14px;
  background:#fff;
  padding:10px 12px;
  color:var(--text);
  box-shadow:var(--shadow);
}
.toast.error{border-left-color:var(--red)}
.toast.success{border-left-color:var(--green)}
.empty-state{
  border:1px solid var(--line);
  border-radius:var(--radius);
  background:#fff;
  padding:18px;
  color:var(--muted);
}
.empty-state.small{padding:10px;font-size:.85rem}

.mobile-menu-backdrop{display:none}
.bottom-nav{display:none}
.hidden,[hidden]{display:none!important}
.sr-only{
  position:absolute;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}

/* Dark purge */
[class*="dark"],
[class*="navy"],
.module-card,
.flow-card,
.workflow-board,
.checklist-builder,
.qr-panel,
.event-group,
.audit-card,
.panel{
  background-color:#fff!important;
  color:var(--text)!important;
}

/* Responsive */
@media(max-width:1220px){
  .topbar{grid-template-columns:minmax(210px,245px) minmax(220px,1fr) minmax(230px,245px)}
  .dashboard-grid,
  .compact-dashboard-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
  .analytics-grid{grid-template-columns:1fr 1fr}
  .risk-grid,
  .event-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .side{grid-template-columns:1fr 1fr}
}

@media(max-width:840px){
  :root{--topbar-h:56px}
  .topbar{
    min-height:var(--topbar-h);
    grid-template-columns:1fr auto;
    gap:6px;
    padding:0 8px;
  }
  .center-nav{display:none}
  .brand span,
  .topbar-title span,
  .system-status b,
  .session-pill{display:none}
  .brand strong,
  .topbar-title strong{
    max-width:120px;
  }
  .topbar-actions{gap:5px}
  .icon-action,
  .menu-toggle{
    width:36px;
    height:36px;
    flex-basis:36px;
  }
  .brand-system-mark{
    width:32px;
    height:32px;
  }

  .main-grid,
  .main-grid.expanded{
    display:block;
    min-height:calc(100vh - var(--topbar-h));
  }
  .content{
    padding:12px 10px calc(var(--bottomnav-h) + 26px);
  }
  .sidebar{
    position:fixed;
    left:0;
    top:var(--topbar-h);
    bottom:0;
    z-index:120;
    width:min(76vw,260px)!important;
    height:calc(100vh - var(--topbar-h));
    transform:translateX(-110%);
    box-shadow:var(--shadow);
  }
  .sidebar.is-open{transform:translateX(0)}
  .mobile-menu-backdrop{
    position:fixed;
    inset:var(--topbar-h) 0 0;
    z-index:110;
    display:none;
    background:rgba(15,23,42,.28);
  }
  .mobile-menu-backdrop.is-open{display:block}
  .sidebar .nav-head span,
  .sidebar .nav-sub{display:grid!important}
  .sidebar .nav-head{
    justify-content:flex-start!important;
    padding:0 11px!important;
  }
  .sidebar .nav-sub{padding-left:42px}

  .dropdown-panel{
    right:-62px;
    width:300px;
  }
  .action-panel{
    right:0;
    width:245px;
  }

  .dashboard-grid,
  .compact-dashboard-grid,
  .analytics-grid,
  .cards-grid,
  .entity-card-grid,
  .model-card-grid,
  .parameter-grid,
  .component-trace-grid,
  .evidence-grid,
  .asset-quick-grid,
  .detail-grid,
  .permission-grid,
  .endpoint-grid,
  .module-profile-grid,
  .form-grid,
  .risk-grid,
  .event-summary-grid{
    grid-template-columns:1fr;
  }
  .bar-row{
    grid-template-columns:1fr;
  }
  .quick-actions,
  .mini-actions,
  .footer-actions{
    display:grid;
    grid-template-columns:1fr;
  }
  .primary-action,
  .secondary-action,
  .danger-action,
  .ghost-action,
  .add-inline-action,
  .tab-action,
  .chip-action,
  .btn{width:100%}
  .panel,
  .card,
  .metric-card,
  .kpi-card,
  .os-card{padding:11px}

  .bottom-nav{
    position:fixed;
    left:10px;
    right:10px;
    bottom:10px;
    z-index:130;
    height:var(--bottomnav-h);
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:4px;
    padding:8px;
    border:1px solid var(--line);
    border-radius:24px;
    background:rgba(255,255,255,.97);
    box-shadow:var(--shadow);
    backdrop-filter:blur(14px);
  }
  .bottom-nav button{
    border:0;
    background:transparent;
    border-radius:16px;
    color:#475467;
    display:grid;
    place-items:center;
  }
  .bottom-nav button.active{
    background:#eef4ff;
    color:var(--primary);
  }
  .bottom-nav .material-symbols-rounded{
    font-size:23px;
  }
  .toast-stack{
    left:10px;
    right:10px;
    bottom:calc(var(--bottomnav-h) + 20px);
    max-width:none;
  }
}

@media(max-width:420px){
  body{font-size:13px}
  .content{padding-inline:8px}
  .brand strong,
  .topbar-title strong{max-width:100px}
  h1{font-size:20px}
}


/* ==========================================================================
   SCS OS Control — 2.0.0 SaaS UI / Bloco 2
   Dashboards por perfil: Operador, Gestor/PCM e Admin Master
   ========================================================================== */

.profile-dashboard{
  display:grid;
  gap:10px;
}

.operation-hero{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:center;
  gap:16px;
  border-left:4px solid var(--primary);
}
.operation-hero.is-critical{
  border-left-color:var(--red);
}
.operation-hero h2{
  margin:4px 0;
  font-size:1.3rem;
}
.hero-actions{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  flex-wrap:wrap;
  gap:8px;
  min-width:240px;
}

.operator-work-grid,
.manager-grid,
.admin-command-grid{
  display:grid;
  gap:10px;
}
.operator-work-grid{
  grid-template-columns:.9fr 1.1fr;
}
.manager-grid{
  grid-template-columns:1fr 1fr;
}
.admin-command-grid{
  grid-template-columns:repeat(3,minmax(0,1fr));
}

.priority-panel{
  min-height:100%;
}

.dashboard-os-list{
  display:grid;
  gap:8px;
}
.dashboard-os-card{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:12px;
  align-items:center;
  padding:10px;
  border:1px solid var(--line);
  border-left:4px solid var(--primary);
  border-radius:14px;
  background:#fff;
}
.dashboard-os-card.os-critical{
  border-left-color:var(--red);
}
.dashboard-os-card.os-warn{
  border-left-color:var(--amber);
}
.dashboard-os-card.os-ok{
  border-left-color:var(--green);
}
.dashboard-os-card strong{
  display:block;
  margin-bottom:2px;
}
.dashboard-os-card small{
  display:block;
  color:var(--muted);
}
.dashboard-os-actions{
  display:flex;
  justify-content:flex-end;
  flex-wrap:wrap;
  gap:6px;
}
.dashboard-os-actions .secondary-action,
.dashboard-os-actions .ghost-action{
  min-height:34px;
  padding:6px 10px;
  font-size:.82rem;
}
.secondary-action.green{
  color:var(--green);
  border-color:#bbf7d0;
  background:var(--green-soft);
}
.secondary-action.amber{
  color:var(--amber);
  border-color:#fed7aa;
  background:var(--amber-soft);
}

.stepper-list{
  display:grid;
  gap:8px;
}
.operator-step{
  display:grid;
  grid-template-columns:30px minmax(0,1fr) auto;
  gap:8px;
  align-items:center;
  padding:9px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#f8fafc;
}
.operator-step>span{
  width:26px;
  height:26px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:var(--primary-soft);
  color:var(--primary);
  font-weight:900;
}
.operator-step.done>span{
  background:var(--green);
  color:#fff;
}
.operator-step.block>span{
  background:var(--red);
  color:#fff;
}
.operator-step em{
  font-style:normal;
}

.admin-command-card{
  min-height:180px;
  display:grid;
  grid-template-rows:auto 1fr auto;
  gap:10px;
  padding:14px;
  border:1px solid var(--line);
  border-radius:var(--radius);
  background:#fff;
  box-shadow:var(--shadow-soft);
}
.admin-command-icon{
  width:42px;
  height:42px;
  display:grid;
  place-items:center;
  border-radius:14px;
  color:var(--primary);
  background:var(--primary-soft);
}
.admin-command-icon .material-symbols-rounded{
  font-size:25px;
}
.admin-command-card h3{
  margin-bottom:4px;
}
.admin-command-card p{
  font-size:.86rem;
}

.data-list{
  display:grid;
  gap:7px;
}

@media(max-width:1220px){
  .operator-work-grid,
  .manager-grid,
  .admin-command-grid{
    grid-template-columns:1fr 1fr;
  }
  .operation-hero{
    grid-template-columns:1fr;
  }
  .hero-actions{
    justify-content:flex-start;
    min-width:0;
  }
}

@media(max-width:840px){
  .operation-hero,
  .dashboard-os-card,
  .operator-step{
    grid-template-columns:1fr;
  }
  .operator-work-grid,
  .manager-grid,
  .admin-command-grid{
    grid-template-columns:1fr;
  }
  .hero-actions,
  .dashboard-os-actions{
    display:grid;
    grid-template-columns:1fr;
    width:100%;
  }
  .operator-step>span{
    grid-row:1;
  }
  .operator-step em{
    width:max-content;
  }
  .admin-command-card{
    min-height:auto;
  }
}


/* ==========================================================================
   SCS OS Control — 2.0.0 SaaS UI / Bloco 3
   Telas operacionais: OS, detalhe, checklist, QR, eventos, histórico e auditoria
   ========================================================================== */

.operational-page,
.os-detail-page,
.qr-operational-page{
  display:grid;
  gap:10px;
}

.operation-toolbar{
  display:grid;
  gap:10px;
}
.toolbar-controls{
  display:grid;
  grid-template-columns:minmax(0,1fr) 230px;
  gap:8px;
  align-items:end;
}
.status-filter-strip{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}
.status-filter-strip button{
  min-height:32px;
  border:1px solid var(--line);
  border-radius:999px;
  background:#fff;
  color:var(--text-2);
  padding:0 10px;
  font-size:.78rem;
  font-weight:900;
}
.status-filter-strip button.active{
  color:var(--primary);
  border-color:#bdd1ff;
  background:var(--primary-soft);
}
.status-filter-strip b{
  margin-left:4px;
}

.operational-os-list{
  display:grid;
  gap:8px;
}
.operational-os-card{
  display:grid;
  grid-template-columns:minmax(0,1fr) 220px;
  gap:14px;
  align-items:center;
  padding:12px;
  border-left-width:4px;
}
.operational-os-card.os-card-critical{
  border-left-color:var(--red);
}
.os-card-title-line{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  margin-bottom:4px;
}
.os-number{
  display:inline-flex;
  min-height:26px;
  align-items:center;
  border-radius:999px;
  background:#111827;
  color:#fff;
  padding:0 9px;
  font-size:.78rem;
  font-weight:900;
}
.os-card-side{
  display:grid;
  gap:8px;
  justify-items:stretch;
}
.mini-progress{
  height:7px;
  border-radius:999px;
  background:#dce4ee;
  overflow:hidden;
}
.mini-progress i{
  display:block;
  height:100%;
  background:var(--primary);
  border-radius:inherit;
}

.os-detail-hero{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:14px;
  align-items:center;
  border-left:4px solid var(--primary);
}
.os-detail-hero.is-critical{
  border-left-color:var(--red);
}
.os-detail-title{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:8px;
}
.os-detail-title h2{
  margin:0;
}
.os-detail-actions{
  max-width:420px;
}
.os-action-bar{
  justify-content:flex-end;
}

.os-detail-grid{
  display:grid;
  grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr);
  gap:10px;
}
.operational-data-list{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}
.operational-data-list .data-row{
  margin:0;
  padding:9px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#f8fafc;
}
.os-progress-panel{
  align-self:start;
}
.os-progress-meter{
  display:grid;
  gap:7px;
  margin-bottom:10px;
}
.os-progress-meter strong{
  font-size:1.8rem;
}
.checklist-execution-panel{
  border-left:4px solid var(--primary);
}
.operational-checklist-list{
  display:grid;
  gap:10px;
}
.operational-checklist-item{
  border-left-width:4px;
}
.checklist-response-box{
  margin:10px 0;
  padding:10px;
  border:1px solid var(--line);
  border-radius:14px;
  background:#f8fafc;
}
.evidence-observation-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}
.evidence-control{
  display:grid;
  gap:6px;
  border:1px dashed var(--line-strong);
  border-radius:12px;
  padding:8px;
  background:#fff;
}
.checklist-footer{
  align-items:center;
}

.qr-hero-panel{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:10px;
  border-left:4px solid var(--primary);
}
.qr-result-panel{
  min-height:140px;
}
.qr-pending-list{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin:10px 0;
}
.asset-section{
  margin-top:14px;
}
.asset-hero{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:12px;
  align-items:center;
  padding:12px;
  border:1px solid var(--line);
  border-radius:var(--radius);
  background:#fff;
}
.asset-state{
  display:grid;
  gap:2px;
  min-width:160px;
  padding:10px;
  border-radius:14px;
  border:1px solid var(--line);
  background:#f8fafc;
}
.asset-state.critico{
  border-color:#fecaca;
  background:var(--red-soft);
  color:var(--red);
}
.asset-state.atencao{
  border-color:#fed7aa;
  background:var(--amber-soft);
  color:var(--amber);
}
.asset-state.normal{
  border-color:#bbf7d0;
  background:var(--green-soft);
  color:var(--green);
}

.log-row.panel,
.audit-card{
  border-left:4px solid var(--primary);
}
.audit-card{
  display:grid;
  grid-template-columns:42px minmax(0,1fr);
  gap:10px;
  align-items:start;
}
.audit-mark{
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  border-radius:14px;
  background:var(--primary-soft);
  color:var(--primary);
  font-weight:900;
}
.audit-head{
  display:flex;
  justify-content:space-between;
  gap:10px;
  align-items:center;
}
.event-card-meta{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  margin-top:6px;
}
.event-card-meta span{
  display:inline-flex;
  min-height:24px;
  align-items:center;
  border-radius:999px;
  background:#f8fafc;
  border:1px solid var(--line);
  padding:0 8px;
  color:var(--muted);
  font-size:.76rem;
  font-weight:800;
}

@media(max-width:1220px){
  .operational-os-card,
  .os-detail-hero,
  .os-detail-grid,
  .asset-hero{
    grid-template-columns:1fr;
  }
  .os-detail-actions,
  .asset-state{
    max-width:none;
    width:100%;
  }
}

@media(max-width:840px){
  .toolbar-controls,
  .operational-data-list,
  .evidence-observation-grid{
    grid-template-columns:1fr;
  }
  .operational-os-card{
    grid-template-columns:1fr;
  }
  .os-card-side{
    justify-items:stretch;
  }
  .os-card-title-line,
  .audit-head{
    align-items:flex-start;
    flex-direction:column;
  }
  .qr-hero-panel{
    flex-direction:column;
  }
  .asset-hero{
    padding:10px;
  }
  .qr-pending-list{
    display:grid;
    grid-template-columns:1fr;
  }
}


/* ==========================================================================
   SCS OS Control — 2.0.0 SaaS UI / Bloco 4
   Eventos, notificações e auditoria visual
   ========================================================================== */

.event-command-center-v2{
  display:grid;
  gap:10px;
}
.event-center-hero{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:center;
  gap:14px;
  border-left:4px solid var(--primary);
}
.event-center-total{
  min-width:140px;
  display:grid;
  place-items:center;
  border:1px solid var(--line);
  border-radius:16px;
  background:#f8fafc;
  padding:12px;
}
.event-center-total strong{
  font-size:2rem;
  line-height:1;
}
.event-center-total span{
  color:var(--muted);
  font-size:.78rem;
  font-weight:850;
}
.event-summary-grid-v2{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
}
.event-summary-grid-v2 .event-summary-card{
  display:grid;
  grid-template-columns:44px minmax(0,1fr);
  gap:10px;
  align-items:center;
}
.event-summary-icon{
  width:42px;
  height:42px;
  display:grid;
  place-items:center;
  border-radius:14px;
  background:#fff;
  border:1px solid rgba(255,255,255,.6);
}
.event-summary-card.red .event-summary-icon{color:var(--red)}
.event-summary-card.amber .event-summary-icon{color:var(--amber)}
.event-summary-card.green .event-summary-icon{color:var(--green)}
.event-summary-card.blue .event-summary-icon{color:var(--primary)}

.event-focus-grid{
  display:grid;
  grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);
  gap:10px;
}
.event-priority-list,
.event-list-v2,
.event-group-stack-v2{
  display:grid;
  gap:8px;
}
.event-list-card-v2{
  display:grid;
  grid-template-columns:42px minmax(0,1fr) auto;
  gap:10px;
  align-items:center;
  border-left-width:4px;
  background:#fff;
}
.event-list-card-v2.risk{
  border-left-color:var(--red);
}
.event-list-card-v2.approval{
  border-left-color:var(--amber);
}
.event-list-card-v2.event{
  border-left-color:var(--primary);
}
.event-card-icon{
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  border-radius:14px;
  background:var(--primary-soft);
  color:var(--primary);
}
.event-list-card-v2.risk .event-card-icon{
  background:var(--red-soft);
  color:var(--red);
}
.event-list-card-v2.approval .event-card-icon{
  background:var(--amber-soft);
  color:var(--amber);
}
.event-card-body{
  min-width:0;
}
.event-card-body h3{
  margin:3px 0;
}
.event-card-tags{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}
.event-card-tags span{
  display:inline-flex;
  min-height:23px;
  align-items:center;
  border-radius:999px;
  background:#f8fafc;
  border:1px solid var(--line);
  color:var(--text-2);
  padding:0 8px;
  font-size:.72rem;
  font-weight:900;
}
.event-card-tags small{
  color:var(--muted);
  font-size:.72rem;
  font-weight:800;
}
.event-open-indicator{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:32px;
  min-width:78px;
  padding:0 10px;
  border-radius:999px;
  background:var(--primary-soft);
  color:var(--primary);
  font-size:.78rem;
  font-weight:900;
}
.event-tag-strip{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}
.event-tag-strip button{
  min-height:36px;
  display:flex;
  align-items:center;
  gap:7px;
  border:1px solid var(--line);
  border-radius:999px;
  background:#fff;
  padding:0 11px;
  color:var(--text-2);
}
.event-tag-strip button.active{
  background:var(--primary-soft);
  border-color:#bdd1ff;
  color:var(--primary);
}
.event-tag-strip button strong{
  font-size:.8rem;
}
.event-tag-strip button span{
  min-width:22px;
  height:22px;
  border-radius:999px;
  display:grid;
  place-items:center;
  background:#f1f5f9;
  font-size:.72rem;
}

.audit-command-center{
  display:grid;
  gap:10px;
}
.audit-hero-panel{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:center;
  gap:14px;
  border-left:4px solid var(--primary);
}
.audit-summary-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
}
.audit-timeline-visual{
  display:grid;
  gap:8px;
}
.audit-timeline-visual .audit-card{
  border-left-width:4px;
}
.audit-card.audit-critico{
  border-left-color:var(--red);
}
.audit-card.audit-atencao{
  border-left-color:var(--amber);
}
.audit-card.audit-info{
  border-left-color:var(--primary);
}
.audit-card.audit-critico .audit-mark{
  background:var(--red-soft);
  color:var(--red);
}
.audit-card.audit-atencao .audit-mark{
  background:var(--amber-soft);
  color:var(--amber);
}
.audit-card.audit-info .audit-mark{
  background:var(--primary-soft);
  color:var(--primary);
}
.audit-mark .material-symbols-rounded{
  font-size:22px;
}

.notification-panel .notification-mini{
  cursor:pointer;
}
.notification-panel .notification-mini:hover,
.event-list-card-v2:hover,
.audit-card:hover{
  transform:translateY(-1px);
  box-shadow:var(--shadow-soft);
}

@media(max-width:1220px){
  .event-summary-grid-v2,
  .audit-summary-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
  .event-focus-grid{
    grid-template-columns:1fr;
  }
}

@media(max-width:840px){
  .event-center-hero,
  .audit-hero-panel,
  .event-list-card-v2{
    grid-template-columns:1fr;
  }
  .event-center-total{
    width:100%;
  }
  .event-summary-grid-v2,
  .audit-summary-grid{
    grid-template-columns:1fr;
  }
  .event-summary-grid-v2 .event-summary-card{
    grid-template-columns:42px minmax(0,1fr);
  }
  .event-open-indicator{
    width:100%;
  }
  .event-card-tags{
    flex-direction:column;
    align-items:flex-start;
  }
}


/* ==========================================================================
   SCS OS Control — 2.0.0 SaaS UI / Bloco 5
   Responsividade e polimento final
   Alvos: 360px, 390px, 414px, tablet, notebook e desktop.
   ========================================================================== */

/* Polimento global */
html, body {
  max-width: 100%;
}

img, video, canvas, svg {
  max-width: 100%;
}

.content,
.panel,
.card,
.os-card,
.dashboard-os-card,
event-list-card,
.audit-card {
  min-width: 0;
}

.view-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.view-header h2 {
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.view-header p {
  margin: 0;
  color: var(--muted);
}

/* Melhor uso em notebook */
@media (min-width: 841px) and (max-width: 1366px) {
  .content {
    padding: 12px 14px 20px;
  }

  .topbar {
    grid-template-columns: 230px minmax(280px, 1fr) 285px;
  }

  .center-nav button {
    min-width: 62px;
  }

  .dashboard-grid,
  .compact-dashboard-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .analytics-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .metric-card,
  .kpi-card,
  .panel,
  .card {
    padding: 10px;
  }

  .kpi-card strong,
  .metric-card strong {
    font-size: 1.18rem;
  }

  .admin-command-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .admin-command-card {
    min-height: 150px;
  }
}

/* Tablet */
@media (min-width: 841px) and (max-width: 1100px) {
  .topbar {
    grid-template-columns: 220px minmax(240px, 1fr) 230px;
  }

  .system-status b {
    display: none;
  }

  .session-pill {
    max-width: 88px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dashboard-grid,
  .compact-dashboard-grid,
  .event-summary-grid-v2,
  .audit-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .manager-grid,
  .operator-work-grid,
  .admin-command-grid,
  .os-detail-grid,
  .event-focus-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile base */
@media (max-width: 840px) {
  body {
    min-width: 0;
  }

  .topbar {
    width: 100%;
    overflow: visible;
  }

  .brand {
    gap: 7px;
  }

  .brand-system-mark {
    flex: 0 0 32px;
  }

  .topbar-actions {
    min-width: auto;
  }

  .topbar-popover {
    position: static;
  }

  .dropdown-panel {
    position: fixed;
    top: calc(var(--topbar-h) + 8px);
    right: 8px;
    left: 8px;
    width: auto;
    max-width: none;
    max-height: calc(100vh - var(--topbar-h) - var(--bottomnav-h) - 28px);
    overflow: auto;
  }

  .action-panel,
  .notification-panel {
    right: 8px;
    left: 8px;
    width: auto;
  }

  .view-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .view-header > button,
  .view-header > .primary-action,
  .view-header > .secondary-action,
  .view-header > .ghost-action {
    width: 100%;
  }

  .content {
    width: 100%;
    max-width: 100vw;
  }

  .panel,
  .card,
  .metric-card,
  .kpi-card,
  .os-card,
  .dashboard-os-card,
  .event-list-card,
  .audit-card {
    width: 100%;
    max-width: 100%;
  }

  .inline-meta,
  .meta,
  .event-card-meta,
  .checklist-meta-line,
  .status-filter-strip {
    gap: 5px;
  }

  .tag,
  .status-chip,
  .status-badge,
  .badge,
  .status {
    max-width: 100%;
    white-space: normal;
    text-align: center;
    line-height: 1.2;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .toolbar,
  .toolbar-controls {
    grid-template-columns: 1fr;
  }

  .toolbar input,
  .toolbar select,
  .toolbar-controls input,
  .toolbar-controls select {
    width: 100%;
  }

  .operational-os-card,
  .dashboard-os-card,
  .event-list-card-v2,
  .audit-card {
    gap: 8px;
  }

  .dashboard-os-actions,
  .os-card-side,
  .hero-actions,
  .os-detail-actions,
  .footer-actions,
  .quick-actions,
  .mini-actions {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }

  .footer-actions > *,
  .quick-actions > *,
  .mini-actions > *,
  .dashboard-os-actions > *,
  .os-card-side > *,
  .hero-actions > *,
  .os-detail-actions > * {
    width: 100%;
  }

  .qr-scanner {
    min-height: 190px;
  }

  .qr-camera-state {
    min-height: 160px;
    text-align: center;
    padding: 10px;
  }

  .data-row {
    word-break: break-word;
  }

  .spec-table,
  table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .toast-stack {
    pointer-events: none;
  }

  .toast {
    width: 100%;
    pointer-events: auto;
  }
}

/* 414px */
@media (max-width: 414px) {
  :root {
    --bottomnav-h: 64px;
  }

  body {
    font-size: 13px;
  }

  .content {
    padding: 10px 8px calc(var(--bottomnav-h) + 24px);
  }

  .topbar {
    padding: 0 7px;
  }

  .brand strong,
  .topbar-title strong {
    max-width: 108px;
  }

  .icon-action,
  .menu-toggle {
    width: 35px;
    height: 35px;
    flex-basis: 35px;
  }

  .system-status,
  .session-pill {
    height: 30px;
    padding: 0 8px;
  }

  .panel,
  .card,
  .metric-card,
  .kpi-card,
  .os-card,
  .dashboard-os-card {
    padding: 10px;
    border-radius: 14px;
  }

  .event-summary-card {
    padding: 10px;
  }

  .bottom-nav {
    left: 8px;
    right: 8px;
    bottom: 8px;
    height: 62px;
    border-radius: 22px;
  }
}

/* 390px */
@media (max-width: 390px) {
  .brand strong,
  .topbar-title strong {
    max-width: 96px;
  }

  .brand-system-mark {
    width: 30px;
    height: 30px;
    flex-basis: 30px;
    font-size: 11px;
  }

  .topbar-actions {
    gap: 4px;
  }

  .icon-action,
  .menu-toggle {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }

  h1,
  .view-header h2 {
    font-size: 19px;
  }

  .operation-hero h2,
  .os-detail-title h2 {
    font-size: 1.1rem;
  }

  .kpi-card strong,
  .metric-card strong {
    font-size: 1.12rem;
  }

  .event-card-icon,
  .audit-mark,
  .admin-command-icon {
    width: 36px;
    height: 36px;
  }

  .operator-step,
  .step {
    padding: 8px;
  }

  .status-filter-strip button {
    min-height: 30px;
    font-size: .74rem;
  }
}

/* 360px */
@media (max-width: 360px) {
  .content {
    padding-left: 7px;
    padding-right: 7px;
  }

  .brand {
    gap: 5px;
  }

  .brand strong,
  .topbar-title strong {
    max-width: 82px;
  }

  .system-status {
    display: none;
  }

  .icon-action,
  .menu-toggle {
    width: 33px;
    height: 33px;
    flex-basis: 33px;
  }

  .material-symbols-rounded {
    font-size: 20px;
  }

  .panel,
  .card,
  .metric-card,
  .kpi-card,
  .os-card,
  .dashboard-os-card {
    padding: 9px;
    border-radius: 13px;
  }

  .primary-action,
  .secondary-action,
  .danger-action,
  .ghost-action,
  .add-inline-action,
  .tab-action,
  .chip-action,
  .btn {
    min-height: 42px;
    padding: 8px 10px;
  }

  .bottom-nav {
    left: 6px;
    right: 6px;
    bottom: 6px;
    height: 60px;
    padding: 7px;
  }

  .bottom-nav button {
    border-radius: 14px;
  }

  .dropdown-panel {
    left: 6px;
    right: 6px;
  }
}

/* Impressão / apresentação */
@media print {
  .topbar,
  .sidebar,
  .bottom-nav,
  .mobile-menu-backdrop,
  .toast-stack,
  .topbar-actions {
    display: none !important;
  }

  .main-grid,
  .main-grid.expanded {
    display: block !important;
  }

  .content {
    padding: 0 !important;
  }

  body {
    background: #fff !important;
  }

  .panel,
  .card,
  .os-card {
    break-inside: avoid;
    box-shadow: none !important;
  }
}


/* ========================================================================== 
   Hotfix 2.0.9 — Reorganização Visual Desktop SaaS Industrial
   Escopo: shell desktop, topbar, drawer, painel direito, menu e acabamento visual.
   ========================================================================== */
:root {
  --sidebar-open-w: 246px;
  --sidebar-closed-w: 72px;
  --quick-panel-open-w: 320px;
  --quick-panel-closed-w: 56px;
  --workspace-gap: 0px;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(100,116,139,.35) transparent;
}

*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: rgba(100,116,139,.28);
  border-radius: 999px;
}

*::-webkit-scrollbar-thumb:hover {
  background: rgba(100,116,139,.45);
}

body.is-authenticated {
  overflow-x: hidden;
  background: var(--bg);
}

body.is-authenticated .app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

/* Topbar limpa: esquerda / centro absoluto / direita. */
body.is-authenticated .app-topbar,
body.is-authenticated .topbar {
  position: sticky;
  top: 0;
  z-index: 700;
  width: 100%;
  min-height: var(--topbar-h);
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 180px;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
  background: rgba(255,255,255,.94);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgba(15,23,42,.02);
}

.topbar-left,
.topbar-right {
  min-width: 0;
  display: flex;
  align-items: center;
}

.topbar-left { justify-self: start; }
.topbar-right { justify-self: end; gap: 8px; }

body.is-authenticated .brand,
body.is-authenticated .brand-text,
body.is-authenticated .brand-system-mark,
body.is-authenticated .system-status,
body.is-authenticated .session-pill {
  display: none !important;
}

body.is-authenticated .topbar-center,
body.is-authenticated .center-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: auto;
  max-width: min(520px, calc(100vw - 330px));
  pointer-events: auto;
}

.center-nav-button {
  width: 44px;
  height: 40px;
  min-width: 44px;
  min-height: 40px;
  max-height: 40px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #667085;
  background: transparent;
}

.center-nav-button:hover,
.center-nav-button.active {
  color: var(--primary);
  border-color: #c7d7ff;
  background: var(--primary-soft);
}

.center-nav-button .material-symbols-rounded {
  display: inline-flex;
  font-size: 21px;
}

.center-nav-tooltip {
  display: none;
  position: absolute;
  top: 48px;
  z-index: 900;
  padding: 5px 8px;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: var(--shadow);
}

.center-nav-button:hover .center-nav-tooltip,
.center-nav-button:focus-visible .center-nav-tooltip {
  display: block;
}

/* Workspace de três zonas. */
body.is-authenticated .workspace,
body.is-authenticated .main-grid {
  --sidebar-width: var(--sidebar-closed-w);
  --quick-panel-width: var(--quick-panel-open-w);
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr) var(--quick-panel-width);
  min-height: calc(100vh - var(--topbar-h));
  width: 100%;
  transition: grid-template-columns .18s ease;
  background: var(--bg);
}

body.is-authenticated .workspace.expanded,
body.is-authenticated .main-grid.expanded {
  --sidebar-width: var(--sidebar-open-w);
}

body.is-authenticated .workspace.quick-collapsed,
body.is-authenticated .main-grid.quick-collapsed {
  --quick-panel-width: var(--quick-panel-closed-w);
}

/* Drawer esquerdo. */
body.is-authenticated .sidebar {
  position: sticky;
  top: var(--topbar-h);
  width: var(--sidebar-width);
  height: calc(100vh - var(--topbar-h));
  overflow-x: hidden;
  overflow-y: auto;
  padding: 12px 10px;
  border-right: 1px solid var(--line);
  background: rgba(255,255,255,.96);
  z-index: 450;
  transition: width .18s ease;
}

.drawer-identity {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px 10px;
  margin-bottom: 4px;
  border-bottom: 1px solid #eef2f7;
  color: #0f172a;
}

.drawer-mark {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: inline-grid;
  place-items: center;
  border-radius: 11px;
  background: #0f172a;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .04em;
}

.drawer-title {
  font-weight: 900;
  white-space: nowrap;
}

.main-grid:not(.expanded) .drawer-identity {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.main-grid:not(.expanded) .drawer-title {
  display: none;
}

.menu-list {
  display: grid;
  gap: 2px;
}

.nav-group {
  min-width: 0;
  padding: 5px 0;
  border-bottom: 1px solid #eef2f7;
}

.nav-head,
.nav-item,
.menu-list > button {
  width: 100%;
  max-height: 42px;
  min-height: 38px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #475467;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  text-align: left;
  font-weight: 850;
  cursor: pointer;
}

.nav-head:hover,
.nav-item:hover,
.nav-group.active .nav-head,
.nav-head.active,
.nav-item.active {
  background: var(--primary-soft);
  color: var(--primary);
}

.nav-head .material-symbols-rounded,
.nav-item .material-symbols-rounded {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  flex: 0 0 22px;
  font-size: 21px;
}

.nav-sub {
  display: grid;
  gap: 3px;
  padding: 4px 0 4px 34px;
}

.main-grid:not(.expanded) .nav-head,
.main-grid:not(.expanded) .nav-item {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
  pointer-events: auto;
}

.main-grid:not(.expanded) .nav-head span:not(.material-symbols-rounded),
.main-grid:not(.expanded) .nav-item span:not(.material-symbols-rounded),
.main-grid:not(.expanded) .nav-sub {
  display: none !important;
}

.main-grid.expanded .nav-head,
.main-grid.expanded .nav-item {
  justify-content: flex-start;
}

.main-grid.expanded .nav-head span:not(.material-symbols-rounded),
.main-grid.expanded .nav-item span:not(.material-symbols-rounded) {
  display: inline;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-danger { color: var(--red) !important; }

/* Conteúdo central expansível. */
body.is-authenticated .main-content,
body.is-authenticated .content {
  min-width: 0;
  width: 100%;
  max-width: none;
  overflow-x: hidden;
  padding: 18px 24px 26px;
  background: var(--bg);
}

.content > .view-header,
.content > .view-title,
.content > section,
.content > .panel,
.content > .dashboard-grid,
.content > .card-grid,
.content > .checklist-workspace {
  max-width: 100%;
}

.panel,
.card,
.form-card,
.module-card,
.workflow-card,
.checklist-card,
.metric-card,
.kpi-card,
.os-card,
.dashboard-os-card,
.event-list-card,
.audit-card,
.quick-panel-section {
  min-width: 0;
  overflow: hidden;
}

.form-grid,
.form-section,
.card-grid,
.permission-grid,
.module-profile-grid,
.workflow-controls,
.toolbar,
.toolbar-controls {
  min-width: 0;
}

/* Painel direito. */
.quick-panel {
  position: sticky;
  top: var(--topbar-h);
  height: calc(100vh - var(--topbar-h));
  width: var(--quick-panel-width);
  overflow-x: hidden;
  overflow-y: auto;
  border-left: 1px solid var(--line);
  background: rgba(255,255,255,.96);
  padding: 14px;
  z-index: 430;
  transition: width .18s ease, padding .18s ease;
}

.quick-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #eef2f7;
}

.quick-panel-head small,
.section-title-row span,
.quick-panel-action span,
.quick-notification small,
.quick-panel-kpis span {
  color: var(--muted);
}

.quick-panel-head strong,
.section-title-row strong {
  display: block;
  color: #101828;
}

.quick-panel-body {
  display: grid;
  gap: 14px;
}

.quick-panel-section {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
  padding: 12px;
  box-shadow: 0 6px 20px rgba(15,23,42,.04);
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.quick-panel-actions {
  display: grid;
  gap: 8px;
}

.quick-panel-action,
.quick-notification {
  width: 100%;
  border: 1px solid var(--line);
  background: #fff;
  color: #344054;
  border-radius: 14px;
  min-height: 40px;
  max-height: none;
  padding: 9px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
}

.quick-panel-action:hover,
.quick-notification:hover {
  border-color: #c7d7ff;
  color: var(--primary);
  background: #f8fbff;
}

.quick-notification {
  display: grid;
  gap: 3px;
  align-items: start;
  margin-bottom: 8px;
}

.quick-panel-kpis {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.quick-panel-kpis div {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px;
  display: grid;
  gap: 2px;
}

.quick-panel-collapsed-actions {
  display: none;
}

.quick-panel.is-collapsed {
  padding: 10px 8px;
}

.quick-panel.is-collapsed .quick-panel-head,
.quick-panel.is-collapsed .quick-panel-body {
  display: none;
}

.quick-panel.is-collapsed .quick-panel-collapsed-actions {
  display: grid;
  justify-items: center;
  gap: 10px;
}

/* Inputs booleanos não podem herdar width/min-height global. */
input[type="checkbox"],
input[type="radio"] {
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  max-width: 18px;
  max-height: 18px;
  padding: 0;
  margin: 0;
  flex: 0 0 auto;
  display: inline-block;
  accent-color: var(--primary);
}

.checkbox-row,
.switch-row,
.permission-row,
.workflow-profile-row,
.module-permission-row,
.switch-cell,
.module-permission,
.workflow-controls label {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Botões com altura controlada. */
button,
.btn,
.primary-action,
.secondary-action,
.danger-action,
.ghost-action,
.add-inline-action,
.tab-action,
.chip-action {
  min-height: 38px;
  max-height: 44px;
  padding: 8px 14px;
  border-radius: 12px;
  line-height: 1.15;
}

.icon-action,
.menu-toggle {
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  max-width: 38px;
  max-height: 38px;
  padding: 0;
  display: inline-grid;
  place-items: center;
}

/* Checklist mantém grid funcional do V2.0.8. */
.checklist-workspace {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(520px, 1.35fr) minmax(320px, .85fr);
  gap: 16px;
  align-items: start;
}

.checklist-builder,
.checklist-form,
.checklist-editor,
.checklist-model-form {
  width: 100%;
  max-width: none;
}

.checklist-create-panel,
.checklist-editor-panel {
  width: 100%;
}

.checklist-editor-panel {
  display: grid;
  grid-template-columns: minmax(420px, 760px) minmax(260px, 1fr);
  gap: 16px;
  align-items: start;
}

.checklist-main-column,
.checklist-side-column {
  min-width: 0;
  width: 100%;
}

.action-card {
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  padding: 14px;
}

.view-checklists .form-grid,
.view-checklists .panel,
.view-checklists .model-card,
.view-checklists .checklist-builder-item {
  max-width: none;
  min-width: 0;
}

@media (max-width: 1200px) {
  body.is-authenticated .workspace,
  body.is-authenticated .main-grid {
    --quick-panel-open-w: 280px;
  }

  body.is-authenticated .topbar-center,
  body.is-authenticated .center-nav {
    max-width: min(440px, calc(100vw - 260px));
    gap: 8px;
  }
}

@media (max-width: 1100px) {
  .checklist-workspace,
  .checklist-editor-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 840px) {
  body.is-authenticated .app-topbar,
  body.is-authenticated .topbar {
    grid-template-columns: 52px 1fr 140px;
    padding: 0 10px;
  }

  body.is-authenticated .topbar-center,
  body.is-authenticated .center-nav {
    display: none;
  }

  body.is-authenticated .workspace,
  body.is-authenticated .workspace.expanded,
  body.is-authenticated .main-grid,
  body.is-authenticated .main-grid.expanded {
    display: block;
    min-height: calc(100vh - var(--topbar-h));
  }

  body.is-authenticated .sidebar {
    position: fixed;
    top: var(--topbar-h);
    left: 0;
    width: min(82vw, 300px) !important;
    height: calc(100vh - var(--topbar-h));
    transform: translateX(-105%);
    transition: transform .18s ease;
    z-index: 650;
    overflow-x: hidden;
    overflow-y: auto;
  }

  body.is-authenticated .sidebar.is-open {
    transform: translateX(0);
  }

  .mobile-menu-backdrop {
    display: none;
  }

  .mobile-menu-backdrop.is-open {
    display: block;
    position: fixed;
    inset: var(--topbar-h) 0 0 0;
    background: rgba(15, 23, 42, .35);
    z-index: 640;
  }

  .sidebar .drawer-title,
  .sidebar .nav-head span,
  .sidebar .nav-item span {
    display: inline !important;
  }

  .sidebar .nav-sub {
    display: grid !important;
    gap: 4px;
  }

  .sidebar .nav-head,
  .sidebar .nav-item {
    justify-content: flex-start !important;
  }

  body.is-authenticated .content,
  body.is-authenticated .main-content {
    width: 100%;
    padding: 14px 12px calc(var(--bottomnav-h) + 16px);
  }

  .quick-panel {
    display: none;
  }
}
```
