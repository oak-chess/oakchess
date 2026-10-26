# Shiny: sorteio e garantia de 4.000

- Chance aleatória preservada: 0,0122% (aproximadamente 1/8.197) por Pokémon elegível.
- Após 3.999 Pokémon elegíveis sem shiny, o 4.000º é shiny. Um shiny aleatório reinicia a sequência antes desse limite.
- A garantia é de **aparecimento**, não de captura. Fugir, perder a batalha ou não ter bolas não devolve a contagem anterior. A dificuldade de captura não foi alterada.
- Contador compartilhado entre selvagens enfrentados nas caçadas e Pokémon encontrados no Safari; persistido em `state.shinyProgress`.
- Prévia de arena, menus, atualização da tela e recarregamento não contam novamente. Genes salvos recebem um marcador para evitar duplicação. O encontro das caçadas é registrado depois de passar pela verificação de equipe/suprimentos, antes de começar o combate.
- Chefes, treinadores, lendários, míticos, ovos e simulação offline não entram nessa garantia. Ovos mantêm seu sorteio existente.
- Shiny garantido usa os mesmos IVs de 26–31 e potência P4/P5 do shiny aleatório.
- Saves anteriores começam a contagem em zero, sem estimar encontros antigos a partir de capturas ou vitórias.
- Progresso visível em Caçadas → Habitantes, Automação → captura shiny e no rodapé do Safari.

Validação: `scripts/check-idle-shiny-guarantee.cjs`, `scripts/check-idle-shiny-guarantee-browser.cjs` e regressões do Safari.
