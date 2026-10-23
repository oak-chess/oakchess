# Arenas da Operação Rocket

O jogo local carrega `assets/rocket-arena.js`, gerado por `node scripts/build-rocket-arena.cjs` a partir da decoração aprovada em `prototypes/rocket-arena`. Após regenerar, executar `node scripts/build-startup-manifest.cjs`.

## Seleção

`approvedArena()` prioriza a fábrica Rocket somente enquanto `G.rocketOperation` existe. O estado de renderização recebe `step` e `alert`; os intervalos de etapas 1–10, 11–20, 21–30, 31–40 e 41–50 selecionam depósito, contenção, laboratório, comando e Giovanni. O renderizador inativo não avança animações.

## Integração

- Cenário e campo seguem as camadas nativas `scene` e `arena`.
- A projeção do campo desfaz a perspectiva do canvas pai antes do desenho; o jogo aplica sua transformação uma única vez.
- Pokémon de batalha, treinadores, banco interativo, loja, controles, câmera e trilha são os reais. As criaturas decorativas nas cápsulas e gaiolas continuam parte do cenário.
- Não há um segundo loop de animação, canvas interativo, controle de câmera ou armazenamento de partida.
- O relógio acompanha a pausa e a preferência por redução de movimento. A decoração é atualizada no máximo a 8 Hz, ou 4 Hz na qualidade baixa, usando a invalidação existente das arenas.

## Verificações

Executadas verificações de sintaxe e execução isolada do renderizador nas dez fronteiras de etapa, duas perspectivas, preparação/combate, camadas separadas e inatividade: sem exceções. Comparação anterior da geometria: centros das 56 casas e nove vagas coincidem com o jogo.

A política de segurança do navegador bloqueou a abertura de `file:`. Portanto, a conferência visual e os cliques na partida real não foram executados nesta entrega. Abrir o jogo local e retomar a Operação Rocket para essa conferência. Não publicado remotamente.
