# Setor III — Floresta e Esporos

> Histórico da entrega do terceiro setor. A continuação até o andar 60 está descrita em `TOWER-60-FLOORS.md`.

Parte do plano de 60 andares. Esta entrega estende o conteúdo jogável de 10 para 15 andares; os setores IV–XII ainda não estão implementados.

## Andares

| Andar | Encontro | Mecânica |
|---|---|---|
| 11 | Trilha das Vinhas | Três posições ocupadas recebem aviso de 2s; raízes causam 7% dos PS como dano mágico antes da resistência e imobilizam com atordoamento de 1s. Ambos os lados são afetados. |
| 12 | Clareira dos Esporos | Duas regiões ao redor de ocupantes são anunciadas por 2s. As nuvens duram 4s e causam 3% dos PS por segundo antes da resistência aos dois lados. |
| 13 | Colmeia Partida | Três composições comuns de insetos; elite específica com Scyther. Elite: +30% PS, +15% dano, +4 ouro e relíquia aprimorada. |
| 14 | Árvore Ancestral | Escolher até 30 de vida, aprimorar uma relíquia normal sorteada ou receber 10 ouro. A opção indisponível fica desabilitada. |
| 15 | Venusaur — Guardião da Floresta | Três sementes com aviso de 2s florescem por 4s. Curam inimigos em 3% dos PS/s e ferem aliados em 4% dos PS/s antes da resistência. Abaixo de metade da vida, são cinco sementes e o intervalo diminui. |

## Variedade e shiny

- Os quatro combates possuem três equipes possíveis; a elite tem uma composição própria.
- A equipe sorteada, posições e condição shiny ficam no salvamento do encontro; recarregar ou repetir uma derrota não sorteia novamente.
- Nos novos combates, há 10% de chance de um adversário shiny. Pode incluir Venusaur.
- Shiny utiliza o bônus existente de 18% em PS e dano. Vencer esse encontro concede +2 ouro, uma única vez.
- Há anúncio de adversário shiny na preparação e o sprite correspondente no campo.

## Continuidade e apresentação

- Após Alakazam, a equipe continua no andar 11, com ouro e relíquias preservados.
- A passagem entre setores concede até 20 de vida e 4 XP, apenas ao efetivar a subida.
- Raízes, esporos e sementes têm aviso, animação de ativação e efeitos visuais durante a duração. Usam o tempo do combate; pausa e encerramento interrompem sua progressão.
- Cenário de floresta existente; cartas compostas com artes ilustradas existentes e sprites locais de Beedrill, Venomoth, Scyther e Venusaur.
- **Prévia · Setor III** no menu começa no andar 11 com nível 6, 35 ouro, 100 de vida e três companheiros de duas estrelas. Salvamento separado: `oakchess_tower_sector1_v1_preview_sector3`.
- Salvamentos ativos dos setores anteriores continuam compatíveis. Tentativas já encerradas não são reabertas.

Implementado sem executar testes de combate ou validação visual no navegador. Ainda não publicado.
