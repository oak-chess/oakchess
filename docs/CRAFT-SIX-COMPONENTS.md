# Craft com seis componentes

O jogo usa PS Extra, Proteína, Cálcio, Carbos, Ferro e Zinco. A matriz é simétrica: 36 células representam 21 receitas únicas. A mesma tabela resolve a criação na bolsa e a combinação automática de dois componentes equipados.

| + | PS Extra | Proteína | Cálcio | Carbos | Ferro | Zinco |
|---|---|---|---|---|---|---|
| PS Extra | Sobras | Capacete de Pedra | Sino de Concha | Cinta de Foco | Orbe de Chamas | Fruta Sitrus |
| Proteína | Capacete de Pedra | Faixa da Escolha | Orbe da Vida | Lente de Alcance | Presa Afiada | Faixa de Especialista |
| Cálcio | Sino de Concha | Orbe da Vida | Óculos de Escolha | Garra Rápida | Colher Torta | Argila Luminosa |
| Carbos | Cinta de Foco | Lente de Alcance | Garra Rápida | Lenço da Escolha | Ferrão Venenoso | Erva Mental |
| Ferro | Orbe de Chamas | Presa Afiada | Colher Torta | Ferrão Venenoso | Protetor | Eviolita |
| Zinco | Fruta Sitrus | Faixa de Especialista | Argila Luminosa | Erva Mental | Eviolita | Colete de Assalto |

Os efeitos seguem os atributos e os recursos do OakChess. Não são uma reprodução exata dos efeitos do Kanto Tactics: Faixa de Especialista concede amplificação geral de dano; Argila Luminosa melhora cura recebida; Cinta de Foco usa a sobrevivência existente. A descrição de cada item informa seu comportamento real.

Chaves antigas de componentes e itens são mantidas, incluindo itens que deixaram de ter receita. Carbos usa `pot_sp`; Zinco usa `pot_zn`. Contadores, recompensas, reciclagem, carrossel e fusão recebem os seis componentes pelas coleções compartilhadas. As receitas antigas com ordem invertida passam a usar o resultado único da matriz. Não há conversão ou remoção do inventário existente.

Sprites locais vêm de PokeAPI/sprites. No computador, tabela e descrição aparecem lado a lado; em telas estreitas a descrição aparece abaixo. A bolsa continua móvel, com posição salva.

Validação realizada: análise da sintaxe dos scripts. A aparência e o combate ainda precisam de conferência no navegador.
