# Trecho alterado de assets/js/app.js — V2.0.7

```js
  function toggleMobileMenu() {
    setMobileMenuOpen(!state.menuOpen);
  }

  function isMobileShell() {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 840px)").matches;
  }

  function closeMobileMenu() {
    if (isMobileShell() && state.menuOpen) setMobileMenuOpen(false);
  }

  function setMobileMenuOpen(open) {
    state.menuOpen = Boolean(open);
    const mainGrid = app.querySelector(".main-grid");
    const sidebar = app.querySelector("#sidebar-menu");
    const backdrop = app.querySelector(".mobile-menu-backdrop");
    const toggleButton = app.querySelector("[data-action='toggle-menu']");
    if (mainGrid) mainGrid.classList.toggle("expanded", state.menuOpen);
    if (sidebar) sidebar.classList.toggle("is-open", state.menuOpen);
    if (backdrop) backdrop.classList.toggle("is-open", isMobileShell() && state.menuOpen);
    if (toggleButton) toggleButton.setAttribute("aria-expanded", state.menuOpen ? "true" : "false");
  }
```
