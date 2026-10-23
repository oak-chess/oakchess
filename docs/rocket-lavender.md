# Ecos de Lavender

Segundo capítulo da Operação Rocket, desbloqueado pelo marco `silphScope` obtido ao concluir Celadon. Há 50 etapas, com lojas regulares, equipe inicial nova de três Pokémon e a mesma economia e evolução da Base Escondida.

## Estrutura

- Etapas 1–10: entrada da Torre Pokémon.
- 11–20: galeria das memórias.
- 21–30: salão dos ecos.
- 31–40: escadaria dos espíritos; Marowak é obrigatório na etapa 40.
- 41–50: acesso ao refúgio do Sr. Fuji; bloqueio Rocket obrigatório na etapa 50.

Memoriais oferecem 5 de vida ou 4 XP. A névoa permite revelar três encontros e reduzir o alerta, ou obter ouro com risco. A médium oferece redução de alerta ou proteção para uma batalha. Eventos compartilhados incluem treinamento, pesquisa, mercado e comunicações. Recrutas, guardas e Pokémon encurralados compõem os combates comuns.

O Silph Scope é um marco permanente e não é consumido. Marowak não é capturada: vencer apazigua o espírito. Esse diálogo é persistido antes de avançar para evitar repetir a recompensa após recarregar. A vitória final registra `lavender`, `fujiRescued` e `pokeFlute`; a Poké Flauta é um marco narrativo, não um equipamento de combate. Silph sob ataque continua indisponível.

## Salvamento

- Celadon mantém `oakchess_rocket_operation_v1` e seus recordes existentes.
- Lavender usa `oakchess_rocket_operation_v1_lavender` e `_records`.
- Marcos permanecem compartilhados em `oakchess_rocket_operation_v1_progress`.
- O campo `chapter` distingue as tentativas. Saves antigos sem esse campo pertencem a Celadon.
- Ouro, equipe e mochila são independentes por tentativa; compras seguem registrando a Pokédex e resgates seguem contando apenas como vistos.

## Implementação

`assets/rocket-lavender.js` contém rotas, salas e escolhas. O host `assets/rocket-operation.js` compartilha combate, perdas, retomada, recompensas e navegação. A fábrica de arena recebe `rocketChapter` e desenha a torre com a geometria nativa. Cenário em `prototypes/rocket-arena/lavender-scenery.js`; regenerar com `node scripts/build-rocket-arena.cjs` e depois `node scripts/build-startup-manifest.cjs`.

Não foram executados testes nem conferência visual da expansão nesta entrega. A validação de balanceamento e aparência em uma partida completa permanece pendente. Versão local, sem publicação remota.
