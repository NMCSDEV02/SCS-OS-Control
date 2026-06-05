# Teste manual - Checklist Dinamico V1.5.7

## Objetivo
Validar o motor de checklist dinamico tecnico no SCS OS Control.

## O que foi implementado
- Tipos de resposta: `OK_NOK`, `OK_NOK_NA`, `TEXTO`, `NUMERICO`, `SELECT`, `DATA`, `FOTO`, `LEITURA_TECNICA`.
- Campos tecnicos: unidade, valor minimo, valor maximo, valor esperado e opcoes.
- Regras condicionais de evidencia e observacao.
- Bloqueio de finalizacao para pendencias, evidencia ausente, valor invalido ou item critico NOK.
- Modelos de exemplo:
  - `Motor WEG 15 cv - Lubrificacao`
  - `Motor WEG 15 cv - Inspecao`

## Passo a passo

1. Abrir o app em modo mock local.
2. Entrar como Admin: `admin@scs.local` / `123456`.
3. Ir em `Checklists`.
4. Confirmar que os modelos WEG aparecem.
5. Criar uma OS com:
   - Tipo: `Lubrificacao`.
   - Modelo: `Motor WEG 15 cv - Lubrificacao`.
   - Responsavel: Operador.
   - Modo: liberar.
6. Entrar como Operador: `operador@scs.local` / `123456`.
7. Abrir a OS criada.
8. Iniciar a OS.
9. Validar os campos:
   - `SELECT` para tipo de graxa.
   - `NUMERICO` para quantidade de graxa.
   - `OK/NOK` para ruido e protecao.
   - Evidencia obrigatoria na protecao.
10. Tentar salvar valor fora do limite sem observacao/evidencia.
11. Confirmar que o sistema bloqueia.
12. Corrigir preenchimento.
13. Finalizar a OS.
14. Confirmar que a OS vai para `AGUARDANDO_APROVACAO`.

## Resultado esperado
O checklist deve funcionar como checklist tecnico real, não apenas OK/NOK simples.
