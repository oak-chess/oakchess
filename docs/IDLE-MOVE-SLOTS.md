# Conjuntos de golpes para famílias curtas no Idle

## Regra final
- Famílias com três estágios mantêm a progressão original por estrelas: até 2, 3 e 4 golpes.
- Famílias com dois estágios: o estágio inicial mantém o conjunto original e somente a forma final recebe até 4 golpes cadastrados.
- Espécies sem evolução recebem até 4 golpes cadastrados, mesmo com uma estrela.
- Lendários e míticos mantêm o conjunto especial de até 4 golpes.

Exemplos: Squirtle 2, Wartortle 3, Blastoise 4; Spearow 2, Fearow 4; Pinsir, Tauros e Lapras até 4. Surf não é liberado antecipadamente para Squirtle.

O módulo move-slots.js consulta as relações evolutivas do catálogo local, limitadas ao elenco presente. Isso impede que Eevee, Tyrogue ou uma forma separada em outra linha seja confundida com uma espécie sem evolução. Famílias de três estágios divididas em linhas internas mantêm a progressão anterior.

Os golpes continuam vindo do PLAYABLE_MOVES da própria espécie. A ordem, os intervalos, os atributos, as passivas e a evolução não são alterados. Espécies com menos golpes suportados mantêm seu repertório; não são adicionados golpes falsos ou duplicados.

Preparação, tooltip, ficha e combate usam a mesma regra. A campanha mantém a seleção original. Não há migração de save; a lista é reconstruída ao carregar o Idle.

## Validação
- scripts/check-idle-move-slots.cjs: todas as formas, learnsets locais, famílias de três estágios, formas finais curtas e exceções com ramificações.
- scripts/check-idle-move-slots-browser.cjs: Pinsir, Fearow e Charizard com quatro golpes; Squirtle e Wartortle com dois e três na preparação, ficha e combate, incluindo a rotação real dos golpes.
