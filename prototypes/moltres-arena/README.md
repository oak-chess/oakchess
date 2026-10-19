# Arena do Moltres

## Identidade vulcânica do tabuleiro

`../legendary-birds-arena/elemental-platform.js` aplica uma textura própria de basalto escuro, moldura de obsidiana com tons de bronze, pequenos pontos de brasa nas laterais e um emblema de asas flamejantes. O banco tem nove assentos de rocha vulcânica texturizada. Os hexágonos mantêm as coordenadas e a legibilidade. Arte gerada pela ferramenta integrada em `assets/moltres-floor-v1.png`; prompt completo em `assets/ELEMENTAL-FLOOR-PROMPT.txt`. Ainda sem conferência visual no navegador.

Cratera vulcânica, lava, basalto, fogo, brasas, fumaça e banco de pedra vulcânica. Abra `index.html`. Protótipo independente do jogo, com geometria e motor compartilhados na pasta vizinha `legendary-birds-arena`. Não acessa progresso nem armazena configurações.

## Ambiente ilustrado

Três artes criadas com a ferramenta integrada de geração de imagens: `assets/caldera-v1.png`, `assets/basalt-garden-v1.png` e `assets/lava-perch-v1.png`. Os prompts completos estão em `assets/ART-PROMPTS.txt`.

`volcanic.js` monta a paisagem pintada, grupos de rochas e vegetação vulcânica com tamanhos variados e bases de terreno conectando os conjuntos. A textura se estende à borda da arena, preservando os hexágonos. O carregamento inicial aguarda as artes para evitar mostrar o antigo ambiente geométrico.

Efeitos: fissuras aquecidas, luz de lava pulsante, brasas subindo, cinzas em suspensão e fumaça. Os controles de atividade, efeitos, fumaça, pausa, qualidade e movimento reduzido se aplicam. Vulpix, Growlithe, Ponyta e Magmar usam animações PMD compartilhadas pelo projeto e ficam fora do tabuleiro.

`moltres.js` desenha Moltres por último para que a decoração não encubra seu voo. Durante a preparação ele voa em tamanho grande; ao iniciar a simulação, desce em 3,2 segundos e reduz ao tamanho normal sobre o poleiro. Ao voltar à preparação, decola. Os metadados dos cinco Pokémon estão em `assets/pokemon-animation.js`.

Não há alteração no jogo principal nem publicação automática. Implementação sem testes ou conferência visual no navegador.

## Revisão de materiais

As manchas opacas sob os grupos decorativos foram removidas. `rock-platform.js` projeta a textura pintada de basalto sobre a arena e os nove assentos individuais do banco, com uma malha de triângulos para acompanhar a perspectiva. Os hexágonos e o emblema são desenhados por cima da textura. O retângulo escuro grande sob o banco foi removido. A sombra do Moltres usa uma transição suave de transparência em vez de uma elipse com borda dura.

## Lava em movimento

`lava-flow.js` separa o cenário em chão e decoração e anima apenas os pontos de lava já pintados nas artes. Os rios vetoriais e poças artificiais da primeira versão foram removidos. Pequenos deslocamentos dos detalhes luminosos ficam recortados às fissuras originais; ondas de luminosidade variam por posição, sem criar novas faixas sobre o terreno. Os controles Lava em movimento e Pulsação da lava permitem ajustes separados. Pausa, intensidade vulcânica, qualidade e movimento reduzido são respeitados. É uma animação visual 2D, sem simulação física de fluido e sem alteração das regras da arena.

`scripts/prepare-moltres-heat.cjs` lê as cores quentes dos três arquivos de arte e grava apenas coordenadas/intensidades em `assets/heat-data.js`. As imagens originais não são modificadas; o navegador usa esses dados para recortar os efeitos, inclusive ao abrir via `file://`.

## Novos detalhes do perímetro

`arena-details.js` adiciona oito posições nas bordas da arena, com três artes novas: braseiros de basalto, geodos de obsidiana e fumarolas de enxofre. Pequenas peças antigas próximas foram substituídas para evitar sobreposição. Braseiros emitem brasas e luz suave; fumarolas liberam vapor. O controle Detalhes da arena permite ocultar esse conjunto. Artes produzidas pela ferramenta integrada, salvas em `assets/basalt-brazier-v1.png`, `assets/obsidian-geode-v1.png` e `assets/sulfur-vent-v1.png`; prompts completos em `assets/ARENA-DETAIL-PROMPTS.txt`. Sem conferência visual no navegador.
