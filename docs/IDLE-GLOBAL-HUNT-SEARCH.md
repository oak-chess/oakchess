# Busca global de Pokémon nas caçadas

Com o campo vazio, o catálogo mostra somente as caçadas da região atual. Ao digitar um nome que corresponda a uma espécie (também parcialmente, sem diferenciar caixa ou acentos), a lista consulta os habitats das 24 regiões e mostra cada caçada onde esse Pokémon aparece.

Resultados incluem região, continente, nível, disponibilidade e os habitantes. A espécie pesquisada recebe destaque na prévia. Visualizar um resultado não altera a caçada nem a exploração em andamento.

Ir para esta caçada usa a mesma validação de região da Jornada e verifica nível do treinador, insígnias e instrumentos exigidos pela caçada. Não pula bloqueios. A ação pausa a exploração, troca a região e o habitat, restaura a onda salva e abre a configuração da expedição. Uma busca por nome de área que não corresponde a espécie permanece local.

Uma espécie sem habitat regular não é atribuída artificialmente a uma área; a interface lembra que algumas espécies vêm de evolução, ovos ou eventos.

Validação: scripts/check-idle-global-hunt-search.cjs, scripts/check-idle-hunts-layout.cjs.
