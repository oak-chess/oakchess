# Compatibilidade de treinadores de outras regiões

Pesquisa de 21/10/2026. Escopo: conferir disponibilidade e compatibilidade; nenhuma alteração no catálogo do protótipo ou no jogo principal.

## Resultado

| Região | Arquivos encontrados | Avaliação |
|---|---|---|
| Hoenn | Sprites de mapa do pokeemerald, incluindo Steven, Wallace, Wally, Birch, Scott, líderes, Elite, Cérebros da Fronteira, Archie e Maxie | Melhor compatibilidade com o padrão GBA atual. A amostra Steven foi inspecionada; os demais nomes foram localizados no catálogo oficial do projeto. |
| Johto | Versões GBA de Lyra, Ethan, Silver, Falkner, Whitney, Jasmine e Clair na coleção Team Aqua | Amostra Lyra inspecionada. A folha mistura animações e fundos de referência; requer separar os quadros e preparar transparência. Os demais foram localizados por nome, sem inspeção individual. |
| Sinnoh | Cynthia e Dawn em estilo RSE; Lucas e líderes em outros conjuntos GBA | Amostra Cynthia inspecionada: folha curta com direções utilizáveis. Outros candidatos ainda precisam de inspeção individual. |
| Unova | Hilbert e Rosa | Amostra Hilbert inspecionada: várias animações na mesma imagem, exigindo organizar os quadros. Rosa localizada no catálogo, sem inspeção visual individual. |
| Kalos | Serena e Calem | Folha conjunta inspecionada; é necessário separar os personagens, as direções e o fundo. |
| Alola | Elio em estilo FRLG | Folha de caminhada inspecionada: estrutura próxima ao padrão atual. Não representa confirmação de todos os personagens de Alola. |
| Galar, Hisui e Paldea | Não foi confirmado um conjunto adequado nesta pesquisa | Não assumir que existem folhas prontas no padrão do protótipo. |

As avaliações visuais são inferências baseadas nas seis amostras inspecionadas, não testes de integração. Nem todo NPC tem gesto de Pokébola; pose de frente e lateral não garantem essa animação.

## Candidatos de Hoenn identificados no catálogo

Roxanne, Brawly, Wattson, Flannery, Norman, Winona, Tate, Liza, Juan; Sidney, Phoebe, Glacia, Drake; Anabel, Brandon, Greta, Lucy, Noland, Spenser, Tucker; Steven, Wallace, Wally, Birch, Scott, Archie e Maxie. Brendan e May já aparecem no protótipo com suas versões Ruby/Sapphire de FireRed.

## Fontes e atribuição

- https://github.com/pret/pokeemerald/tree/master/graphics/object_events/pics/people
- https://github.com/TeamAquasHideout/Team-Aquas-Asset-Repo/tree/main/Overworld%20Trainer%20Sprites
- Johto/Unova/Kalos: arquivos nas pastas kwenio e outros autores identificados pelo catálogo.
- Cynthia RSE: PurrfectDoodle (Eva), com pedido de crédito no README da pasta.
- Elio FRLG: pasta mudskip/FRLG-styled, consultar atribuição do autor antes de integrar.

Amostras para inspeção preservadas em tmp/trainer-region-audit. Antes de implementar versões comunitárias, registrar a atribuição específica de cada conjunto e as condições indicadas pelo autor.
