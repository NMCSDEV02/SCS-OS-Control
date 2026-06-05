# Trechos principais de `assets/js/app.js` — V2.1.0

## Estado novo

```js
mobileQuickOpen: false,
qrTimeoutId: null,
qrCountdownTimer: null,
qrScanDeadline: 0,
```

## Bottom nav por perfil

```js
function bottomNavItems() {
  const perfil = state.session.perfil;
  if (perfil === "Operador") {
    return [
      { id: "dashboard", label: "Início", icon: "home" },
      { id: "minhas-os", label: "Minhas OS", icon: "assignment" },
      { id: "qr-code", label: "QR", icon: "qr_code_scanner" },
      { id: "notificacoes", label: "Alertas", icon: "notifications" },
      { id: "meu-perfil", label: "Config.", icon: "tune" }
    ];
  }
}
```

## QR 30 segundos

```js
function startQrCountdown() {
  resetQrCountdown();
  state.qrScanDeadline = Date.now() + 30000;
  // atualiza badge e abre fallback manual ao expirar
}
```
