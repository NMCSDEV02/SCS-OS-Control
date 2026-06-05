# Auditoria Final Mobile V2.1.0

## Diagnóstico

A interface mobile estava funcional, porém ainda carregava decisões de layout desktop. Isso prejudicava a operação em campo, onde o fluxo prioritário é: abrir, ler QR, acessar OS, executar checklist e finalizar.

## Problemas encontrados

1. Painel direito desktop não era adequado para mobile.
2. Botão de painel direito competia com ações operacionais na topbar mobile.
3. QR Code aparecia em mais de um nível visual.
4. A navegação mobile não estava segmentada por perfil operacional.
5. Gestor/Admin precisavam de compactação em “Mais”.
6. A tela de QR tinha ação de câmera manual, mas não fluxo direto com temporizador de falha.
7. A home do operador ainda tinha elementos de painel, não só operação imediata.
8. Desktop precisava apenas aproximar botões direitos da topbar.

## Plano de impacto

- Baixo impacto funcional: alterações restritas a renderização visual e estado local de UI.
- Nenhum impacto em dados: schema, planilha e endpoints preservados.
- Risco principal: variação de suporte mobile a câmera e `BarcodeDetector`; mitigado com fallback manual.

## Resultado

- FAB mobile criado.
- Bottom sheet criado.
- Bottom nav reorganizada por perfil.
- Painel direito desktop ocultado no mobile.
- QR mobile inicia câmera automaticamente quando permitido.
- Contador de 30 segundos criado.
- Entrada manual destacada por falha/tempo.
- Desktop preservado.
