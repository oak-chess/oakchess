# Arena Rocket — protótipo independente

O seletor “Setor da base”, no canto superior direito, alterna entre cinco ambientes: entrada e depósito (1–10), contenção (11–20), laboratório (21–30), central de comando (31–40) e quartel de Giovanni (41–50). A contenção mantém a decoração anterior. Os outros setores possuem cenografia própria em sectors.js, compartilhando a estrutura de batalha e os controles de arena.js. O quartel representa o setor final; o protótipo não implementa o encontro com Giovanni.

Abra index.html através do servidor local do projeto. Canvas desenha uma base industrial com 56 hexágonos (8 × 7), banco com nove vagas, celas com Pokémon, terminais, porta Rocket e treinadores nos cantos opostos.

Controles: câmera por arraste, zoom pela roda, preparação/combate, alarme, Pokémon, efeitos e música. A música só começa por ação do usuário. Animações respeitam a preferência do sistema por movimento reduzido.

Não acessa saves, não altera a campanha e não foi integrado ao jogo. Sprites, trilha e créditos são os mesmos recursos do projeto. Sem execução de testes ou conferência visual no navegador nesta entrega.
