(function () {
  "use strict";

  const CONFIG = window.SCS_CONFIG;

  async function request(action, payload, method) {
    const body = payload || {};
    if (!CONFIG.apiUrl) {
      return window.SCSMockApi.request(action, body, method || "POST");
    }

    const httpMethod = method || (action === "os.listar" || action === "logs.listar" || action === "permissoes.listar" || action === "sistema.bootstrap" ? "GET" : "POST");
    if (httpMethod === "GET") {
      const url = new URL(CONFIG.apiUrl);
      url.searchParams.set("action", action);
      Object.keys(body).forEach((key) => {
        if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
          url.searchParams.set(key, body[key]);
        }
      });
      return parseResponse(await fetch(url.toString(), { method: "GET" }));
    }

    return parseResponse(await fetch(CONFIG.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload: body })
    }));
  }

  async function parseResponse(response) {
    const text = await response.text();
    if (!text) {
      return {
        ok: false,
        status: response.status,
        error: { message: "API retornou resposta vazia." }
      };
    }

    try {
      const json = JSON.parse(text);
      if (!json.ok && !json.error) {
        json.error = { message: "API retornou erro sem mensagem orientativa." };
      }
      return json;
    } catch (error) {
      return {
        ok: false,
        status: response.status,
        error: { message: "API retornou conteudo que nao e JSON valido." }
      };
    }
  }

  async function call(action, payload, method) {
    const result = await request(action, payload, method);
    if (!result.ok) {
      const message = result.error && result.error.message
        ? result.error.message
        : "Nao foi possivel concluir a acao.";
      const error = new Error(message);
      error.status = result.status || 400;
      error.details = result.error && result.error.details ? result.error.details : [];
      throw error;
    }
    return result.data;
  }

  window.SCSApi = { call };
})();
