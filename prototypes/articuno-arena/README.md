# Arena do Articuno

## Identidade glacial do tabuleiro

`../legendary-birds-arena/elemental-platform.js` aplica uma textura própria de gelo azul profundo, moldura de gelo perolado, pequenos cristais nas laterais e um emblema de asas e floco de neve. O banco tem nove assentos de gelo texturizado com brilho frio. Os hexágonos mantêm as coordenadas e a legibilidade. Arte gerada pela ferramenta integrada em `assets/articuno-floor-v1.png`; prompt completo em `assets/ELEMENTAL-FLOOR-PROMPT.txt`. Ainda sem conferência visual no navegador.

Gruta glacial, lago congelado, formações de gelo, neve e banco de gelo. Abra `index.html`. Protótipo independente do jogo, com geometria e motor compartilhados na pasta vizinha `legendary-birds-arena`. Não acessa progresso nem armazena configurações.

## Experimento de ambiente ilustrado

`illustrated.js` aplica a imagem `assets/glacial-cave-v1.png` como ambiente ao redor do tabuleiro. O botão **Cenário ilustrado** compara a nova arte com a versão geométrica original. A neve, névoa, iluminação e câmera continuam funcionando. O arquivo compartilhado das outras arenas não foi alterado. A ilustração é uma camada pintada com deslocamento suave de câmera, não objetos 3D individuais.

Arte criada com a ferramenta integrada de geração de imagens. Prompt em `assets/glacial-cave-v1-prompt.txt`. Integração ainda sem conferência visual no navegador.

### Decoração viva

Grupos ilustrados de rochas, neve, pequenos pinheiros e gelo ficam em uma camada sobre o cenário. Névoa rasteira, partículas de neve carregadas pelo vento e reflexos breves no gelo seguem o relógio do protótipo e respeitam pausa e movimento reduzido. Os controles Decoração, Neve e cristais, Névoa glacial e Qualidade continuam aplicáveis. A arte transparente foi criada com a ferramenta integrada; prompt em `assets/snow-garden-v1-prompt.txt`.

### Articuno e elementos da arena

Mais grupos de decoração ocupam as laterais do ambiente e o perímetro da arena, sem cobrir os hexágonos. Um poleiro ilustrado de gelo fica na borda superior. `articuno.js` usa as animações locais PMD de Articuno: voo durante preparação, descida de 3,2 segundos ao iniciar a simulação, repouso no poleiro e decolagem ao voltar à preparação. A pausa congela o relógio e o movimento reduzido elimina o percurso. O controle Articuno no cenário permite ocultá-lo. O protótipo não executa partidas reais. Arte do poleiro gerada pela ferramenta integrada; prompt em `assets/glacial-perch-v1-prompt.txt`.

O Articuno em voo usa escala 4,8, aproximadamente 2,9 vezes o tamanho normal de 1,65. O pouso interpola posição e tamanho; a decolagem faz o inverso, inclusive se a fase for invertida durante a transição. Agora há 60 grupos ilustrados no ambiente e nas bordas: rochas com pinheiros e jardins de geada com cristais, samambaias e flores. A nova arte está em `assets/frost-garden-v1.png`, gerada pela ferramenta integrada; prompt no arquivo vizinho `frost-garden-v1-prompt.txt`.

### Nevasca e habitantes de gelo

`blizzard.js` adiciona três profundidades de neve, rajadas diagonais com velocidade variável, flocos próximos desfocados, cortinas de neve e um véu nas bordas. A intensidade inicial é 85%; controles de neve, névoa, pausa, qualidade e movimento reduzido são respeitados. Dewgong, Cloyster, Jynx e Lapras usam sprites PMD locais, em seis posições fora do tabuleiro; Dewgong e Jynx alternam repouso com pequenos deslocamentos. O controle Pokémon de gelo permite ocultar os habitantes. Os metadados das animações estão em `assets/ice-pokemon-animation.js`; as imagens originais continuam na pasta compartilhada `assets/pmd/sprite` do projeto. Sem testes ou conferência visual no navegador.

### Expansão glacial

A camada do Articuno é carregada por último: o sprite é desenhado depois dos habitantes, da nevasca e do crescimento de gelo para que esses elementos não cubram seu voo ou pouso.

Revisão de composição atual: 46 peças ilustradas posicionadas manualmente em conjuntos assimétricos. Cada conjunto mistura um ponto principal com peças menores de tipos diferentes, evitando fileiras de elementos iguais. Nove bancos de neve largos conectam visualmente os conjuntos à borda da arena, com recorte para preservar o tabuleiro. A borda larga recebeu textura pintada de gelo. O crescimento foi concentrado em cinco manchas de geada e dois pontos de gelo. Os números descritos abaixo documentam versões anteriores de expansão.

`frozen-life.js` acrescenta 48 grupos ilustrados: oito marcos com cascata e arco rochoso, bancos de neve e bordas com pingentes. Somados aos 60 grupos anteriores, são 108 posicionamentos estáticos. Vinte manchas de geada com ramificações orgânicas se expandem em ciclos de 24 segundos; oito bordas de gelo aparecem gradualmente em ciclos de 28 segundos. Pausa, qualidade leve e movimento reduzido continuam aplicáveis. Os controles Gelo se formando e Decoração extra permitem ajustar os novos elementos. As duas novas artes foram criadas com a ferramenta integrada; prompts completos em `assets/glacial-expansion-prompts.txt`. Integração ainda sem conferência visual no navegador.
