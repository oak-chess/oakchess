# Progressão das caçadas — ondas de cinco níveis

- A região introdutória conserva dez ondas com +1 nível para não bloquear o início.
- A partir de Cerulean, cada onda soma cinco níveis: a onda 10 fica 45 níveis acima da primeira.
- As áreas regulares seguintes começam pelo menos 50 níveis acima da anterior.
- Cerulean: 12–57, 62–107, 112–157. Misty: nível 162. Vermilion começa no 167.
- Cada ginásio fica cinco níveis acima do final das áreas regulares; o próximo destino começa cinco níveis acima do ginásio.
- A Fronteira sem fim permanece opcional, ajustável e fora da sequência obrigatória.
- A mesma função calcula os inimigos, suas escalas de atributos, a lista de habitantes, os cartões e as prévias.
- Chefes regionais ficam cinco níveis acima da onda final de sua caçada. Os multiplicadores próprios dos chefes permanecem.
- XP já depende do nível real derrotado. Coins recebem um fator moderado pela raiz da razão nível atual/nível inicial; os bônus das faixas de dificuldade permanecem.
- Não altera dados dos Pokémon, saldos, insígnias ou ondas salvas. A migração mantém selecionáveis as rotas já registradas no save; novos destinos continuam com os requisitos normais.
- Não muda os níveis dos eventos lendários, míticos ou Megas, que têm suas próprias regras.

Validação: scripts/check-idle-hunt-wave-curve.cjs cobre as três faixas de Cerulean, ondas 1/5/10, força real, chefes, continuidade de todas as 40 regiões, recompensas, texto dos cartões e migração de saves. scripts/check-idle-tutorial-content.cjs valida as instruções atualizadas.
