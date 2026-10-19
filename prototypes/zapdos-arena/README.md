# Arena do Zapdos · versão ilustrada

Abra `index.html`. Protótipo independente, sem acesso ao progresso do jogo. Usa a geometria e o relógio compartilhados em `../legendary-birds-arena`.

## Cenário

Usina abandonada com piso molhado, vegetação entre ruínas, transformadores, gabinetes de comando, isoladores cerâmicos, cabos e plataformas elétricas. `station.js` organiza os equipamentos em conjuntos assimétricos; não usa manchas escuras grandes sob as peças. O carregamento aguarda as artes para não mostrar o cenário geométrico anterior.

`station-platform.js` projeta a textura do pátio na arena e nos nove assentos do banco. Os hexágonos continuam legíveis e o emblema central fica gravado no piso. As imagens ficam em `assets/power-station-v1.png`, `assets/transformer-v1.png`, `assets/switchgear-v1.png` e `assets/substation-perch-v1.png`. Foram produzidas com a ferramenta integrada de geração de imagens; prompts completos em `assets/ART-PROMPTS.txt`.

## Movimento e clima

Chuva diagonal em camadas, anéis nas poças, nuvens discretas, luzes de sinalização e arcos elétricos intermitentes entre equipamentos. Os efeitos respeitam pausa, intensidade da tempestade, qualidade e movimento reduzido. Existem controles separados para Pokémon elétricos e arcos.

Pikachu, Magnemite, Voltorb e Electabuzz usam sprites PMD locais nas laterais. Magnemite flutua; os demais alternam pequenos movimentos e repouso. `assets/pokemon-animation.js` contém os metadados das animações.

`zapdos.js` mantém o lendário à frente dos efeitos: voo grande durante a preparação, descida com redução suave ao tamanho normal ao iniciar a simulação, pouso no suporte superior e decolagem ao voltar à preparação.

Sem alteração no jogo principal, sem deploy e sem testes ou conferência visual no navegador.

## Organização por setores e tempestade

O suporte central de pouso agora é único. As plataformas laterais repetidas foram substituídas por uma torre danificada de transmissão, carretéis de cabos e conjuntos de refrigeração com válvulas. Os equipamentos estão organizados em setores de transmissão, transformadores, manutenção e tubulações. Três artes novas foram produzidas com a ferramenta integrada: `assets/broken-pylon-v1.png`, `assets/cable-reel-v1.png` e `assets/cooling-manifold-v1.png`. Prompts completos em `assets/SECTOR-PROMPTS.txt`.

`thunderstorm.js` acrescenta relâmpagos com intervalos irregulares, clarões localizados e reflexos breves nas poças. Não há preenchimento branco piscando por toda a tela. Um estalo acompanha o raio; o estrondo grave chega 0,8 a 2,3 segundos depois. Os sons são sintetizados e só tocam com o som ativado. O nível dos trovões foi reforçado em relação ao vento, seguindo o volume ambiente com uma curva mais audível em valores baixos. Pausa, aba oculta, controles de efeitos e movimento reduzido são respeitados. O controle Relâmpagos e trovões permite desligar o conjunto.

A chuva tem três camadas de tamanho e velocidade, rajadas de vento, respingos no impacto, anéis nas poças e névoa fina arrastada. Um ruído filtrado de chuva se soma ao vento quando o áudio está ativado. A iluminação dos relâmpagos foi reforçada com decaimento suave nas nuvens e no chão molhado.

## Identidade do tabuleiro

O piso ganhou uma arte própria de aço azul-escuro desgastado, com detalhes periféricos de cobre e dourado. A arena tem uma moldura dourada, presilhas de canto e pequenos capacitores com iluminação suave nas laterais. Um emblema de asas angulares e raio substitui a Pokébola central. O banco usa nove encaixes de metal e latão, com numeração e rebites. O campo mantém os hexágonos originais e a diferença de intensidade entre preparação e combate.

Textura produzida pela ferramenta integrada de geração de imagens, salva em `assets/zapdos-floor-v1.png`; prompt completo em `assets/ZAPDOS-FLOOR-PROMPT.txt`. Integração ainda sem conferência visual no navegador.
