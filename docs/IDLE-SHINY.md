# Shiny — regras do protótipo Jornada Idle

## Sorteio
- Chance fixa de 0,0122% por Pokémon gerado em encontros online, independente da espécie, bola ou derrotas anteriores. Não usa contador, garantia ou limite de azar. A porcentagem é 0.000122 no código.
- O perfil, a variante e o potencial são definidos juntos no encontro e preservados na captura. A prévia e o combate usam o mesmo perfil salvo. Capturas antigas não são sorteadas novamente. Backup before-shiny antes da migração.
- Shiny tem potência mínima P4 (95% P4 e 5% P5 entre os shinies) e IVs independentes de 26 a 31, total mínimo 156/186. Nature e talento continuam seguindo suas regras. O bônus é o da potência; não há multiplicador shiny adicional escondido.
- Neste protótipo não há geração de shiny offline.

## Captura
- Normal: regra existente por espécie/bola.
- Shiny: 25% da chance normal da espécie com a bola configurada para shiny, limitado a 25% finais. Master Ball é exceção: 100%.
- Uma tentativa por batalha; shiny elegível tem prioridade por padrão, configurável. Se suas reservas/limites impedirem a tentativa, o motivo fica no histórico e nenhuma bola é consumida. Estoques de bolas são compartilhados, mas escolha da bola, ativação, prioridade, reserva e contador/limite de expedição são separados.
- O filtro de espécies novas da configuração shiny considera apenas indivíduos shiny possuídos. Shiny nunca é convertido automaticamente em doces. A equipe/banco e o PC preservam a variante na evolução.

## Interface
- Automação com abas Captura normal e Captura shiny.
- Arena e sprites das fichas, equipe, evolução, PC, venda e histórico respeitam a variante.
- O mini HUD mostra a bola shiny durante alguns segundos após uma tentativa shiny, depois volta à seleção normal.
- Taxas e pisos são escolhas de balanceamento do OakChess, não atribuídos a regras oficiais do Pokémon ou PokéIdle.

Sintaxe conferida. Não foram executados testes nem validação de combate em navegador. Mudanças apenas no protótipo idle.
