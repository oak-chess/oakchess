# Meu Treinador — protótipo de desbloqueios

Abra index.html. Red e Leaf estão disponíveis. Outros quatro treinadores exibem retratos e requisitos de insígnias, Torre, Pokédex e campanha. Treinadores bloqueados podem ser inspecionados, mas não equipados.

Selecione um cartão para examinar e use “Usar” para equipar uma opção disponível. “Ver na arena” mostra o treinador e o parceiro escolhidos na arena original. A demonstração de recolhimento continua disponível.

Em “Experimentar progresso de exemplo”, alterne entre início da jornada e jornada em andamento. Os dados são fictícios e ficam no armazenamento isolado do protótipo. O segundo cenário mostra 3/4 insígnias, 12/20 andares e 6/25 espécies, além de liberar Bulbasaur e Charmander. Ao voltar ao início, parceiros bloqueados são substituídos por Pikachu.

Esta etapa não lê nem altera o progresso real, não modifica os arquivos do jogo principal e não foi publicada no GitHub. Os requisitos são propostas para avaliação visual. Conferência visual pelo jogador pendente.

Sprites de mapa Red e Leaf (green): Pokémon FireRed, https://github.com/pret/pokefirered/tree/master/graphics/object_events/pics/people . Retratos e parceiros usam os recursos locais já presentes no jogo; consulte assets/showdown/trainers/ATTRIBUTION.txt e os créditos do jogo. Personagens e gráficos pertencem aos respectivos titulares.

## Molduras e títulos

Há seis molduras e seis opções de título (incluindo sem título). Madeira clássica, sem título e Novo aventureiro estão disponíveis no início. O progresso fictício “Jornada em andamento” libera a moldura Bosque de Kanto e o título Aprendiz de Kanto. As demais opções exibem requisitos e progresso.

Selecione um cartão para inspecionar os detalhes; use “Usar” para confirmar. A moldura envolve a prévia do treinador e o título aparece abaixo do nome. As escolhas são salvas apenas no protótipo. Trocar para um cenário que não satisfaz os requisitos restaura as opções básicas correspondentes.

## Comemorações de vitória

A aba Vitória oferece Brilho do parceiro, Chuva de estrelas, Explosão de vitória e Meteoro. Selecione um cartão e use “Prévia no perfil” ou “Prévia na arena”. As prévias duram aproximadamente 3 segundos e não simulam nem completam batalhas. Opções bloqueadas podem ser assistidas, mas não equipadas.

O cenário Jornada em andamento libera Chuva de estrelas. Brilho do parceiro está disponível desde o início e usa uma paleta associada ao parceiro escolhido. As escolhas de comemoração ficam salvas apenas no protótipo; a reprodução ocorre pelos botões de prévia nesta etapa. Os efeitos respeitam a preferência do sistema por movimento reduzido. Conferência visual pelo jogador pendente.

## Emotes e backup

A aba Emotes contém oito expressões pixeladas. Equipe até quatro; selecione um cartão e use Remover para abrir espaço antes de trocar. As prévias podem ser vistas no perfil e na arena, inclusive para emotes bloqueados. Os quatro botões abaixo da prévia do treinador reproduzem os emotes equipados no perfil.

“Backup do protótipo”, abaixo da personalização, exporta um arquivo JSON com o nome, treinador, parceiro, moldura, título, comemoração, emotes e cenário fictício escolhido. A importação valida formato e versão, opções conhecidas, requisitos do cenário e o limite de quatro emotes. Antes de aplicar, mostra um resumo com confirmação e cancelamento. Aceita arquivos de até 32 KB. Não é um backup da partida ou do progresso real do jogo.

A etapa permanece isolada. A reprodução de emotes e vitória ainda é manual pelos botões de prévia. Conferência visual e exercício da importação pelo jogador pendentes.

## Refinamento da apresentação e das interações

- Perfil reorganizado com dupla em destaque, busca por nome, coleção compacta e estatísticas do cenário fictício.
- Parceiro renderizado com os quadros reais Idle dos recursos PMD locais, direção ocasional e escala calculada pelos limites do corpo. Fallback para o sprite local quando a animação não estiver disponível.
- Treinador reage às comemorações e usa a pose da Pokébola no recolhimento. O parceiro usa Pose quando essa animação existir, com pequenos saltos nas comemorações e reações específicas aos emotes. Preferência por movimento reduzido respeitada.
- Seis molduras com ornamentos desenhados em pixel art (Pokébola, folhas, pedra, rubi, coroa e estrela psíquica). Títulos recebem insígnias e faixas próprias.
- Comemorações refeitas com preparação, desenvolvimento e encerramento. Brilho do parceiro distingue folhas, água/gelo, fogo, pedra, energia psíquica/fantasma e eletricidade. Explosão usa os sprites locais de chama; o meteoro possui rastro, fragmentos e poeira.
- Emotes com comportamentos próprios: notas e corações que sobem, sono em sequência, gota de suor, raiva e surpresa.
- Próxima recompensa destacada por categoria, com progresso e acesso ao requisito. A mudança do cenário fictício mostra as recompensas recém-liberadas em um painel acessível.

Continua sendo apenas um protótipo isolado. O progresso apresentado é fictício. Nenhuma integração com o jogo principal ou publicação foi realizada nesta etapa. Conferência visual pelo jogador pendente; não foram executados testes nesta etapa.

## Conquistas originais no perfil

O build extrai as 24 definições de assets/achievements.js para achievement-catalog.js. Não altera o sistema original e evita manter uma segunda lista manual de nomes, metas e recompensas.

A aba Conquistas mostra nome, requisito, progresso de exemplo e a recompensa original. “Ver recompensa” abre o título, a moldura ou o rastro correspondente. A aba Rastros permite equipar e ver as partículas ao redor da dupla no perfil e na arena.

As recompensas existentes no protótipo com o mesmo nome foram vinculadas à conquista original: Aprendiz de Kanto → Brock; Campeão de Kanto → Campeão da Liga; Pesquisador de Kanto → comprar 25 espécies; Rubi → formar um Pokémon de três estrelas; Aurora psíquica → derrotar Mewtwo no Difícil. Também entram as demais recompensas originais, incluindo Safira, Maré de Cerulean, Constelação, Tesouro antigo e todos os títulos e rastros originais.

Os cenários continuam fictícios. Jornada em andamento inclui exemplos de Brock, primeira evolução, primeiro craft, time equipado, vitória com um sobrevivente e Misty. Não lê nem importa conquistas da partida real, não concede recompensas ao jogo principal e não usa os botões de resgate do caderno original. O backup do protótipo inclui o rastro escolhido.

Conferência visual pelo jogador pendente.

## Coleção ampliada

- 21 treinadores: Red, Leaf, Treinador Jr., Montanhista, Prof. Carvalho, Blue, Caça-insetos, Cientista, Cavalheiro, Brock, Misty, Ten. Surge, Erika, Koga, Sabrina, Blaine, Giovanni, Lorelei, Bruno, Agatha e Lance. Todos possuem sprites de mapa locais da coleção FireRed (pret/pokefirered). Apenas Red e Leaf possuem a pose específica de recolhimento; os demais mantêm o sprite de mapa durante o feixe.
- Parceiros: catálogo expandido automaticamente para as espécies jogáveis definidas em LINES, com nomes e sprites já disponíveis no jogo. A regra de liberação continua sendo obter o Pokémon na Pokédex de exemplo.
- 36 conquistas na prévia: 24 definições originais, extraídas do jogo, e 12 propostas exclusivas do perfil. As novas propostas incluem marcos de Pokédex, Torre, insígnias, compras, craft, ouro, vitórias e campanhas concluídas. Todas as propostas novas concedem títulos e são identificadas nos detalhes.
- Novo cenário fictício “Coleção de veterano”, para equipar os treinadores adicionais e experimentar a coleção ampliada. O backup reconhece o novo cenário e os novos identificadores.

Novos sprites de mapa: https://github.com/pret/pokefirered/tree/master/graphics/object_events/pics/people . Personagens e gráficos pertencem aos respectivos titulares. O jogo principal e os dados reais de conquistas continuam sem alterações nesta etapa.

## Correção dos sprites e da direção do treinador

Cartões e detalhes dos parceiros agora usam animações PMD dos mesmos arquivos e metadados locais utilizados nas unidades de combate. O carregamento das miniaturas é feito conforme entram na área visível. As imagens antigas de costas (SB) foram removidas da coleção e do fallback da dupla. Caso uma animação não esteja disponível, a miniatura informa a indisponibilidade em vez de trocar de coleção de sprites.

Treinadores aparecem de frente no painel e nos cartões. A arena conserva a posição de lado e o gesto de recolhimento disponível para Red/Leaf.

## Segunda ampliação dos treinadores

A coleção agora tem 45 treinadores. Foram acrescentados Marinheiro, Pescador, Faixa Preta, Modelo, Motoqueiro, Campista, Piqueniqueira, Pokémaníaco, Recruta Rocket, Recruta Rocket F., Enfermeira, Jovem Treinadora, Policial, Médium, Treinador Ás, Treinadora Ás, Operário, Garoto Rico, Nadador, Nadadora, Brendan, May, Bill e Sr. Fuji.

Cada opção usa um sprite de mapa local do pret/pokefirered, com vista frontal no painel e lateral na arena. Os requisitos são propostas offline vinculadas aos marcos e conquistas exibidos na simulação. “Coleção de veterano” permite experimentar todos os treinadores desta coleção. Red e Leaf continuam sendo os únicos com a pose específica de recolhimento.

## Central do Treinador — organização em painel

O perfil foi reorganizado em uma única tela, sem as oito abas de categoria. As coleções ficam em áreas próprias, agrupadas em Sua dupla, Identidade visual, Expressões e comemoração e Progresso e recompensas.

- Prévia da dupla, nome, título, estatísticas e emotes rápidos ficam reunidos na coluna de identidade.
- Busca e filtros são globais. Cada coleção mostra cartões compactos e possui “Ver todos” / “Recolher”, expandindo somente seu espaço.
- O inspetor fixo reúne requisito, progresso, ação de equipar e botões de prévia do item selecionado. Ele permanece visível enquanto as coleções rolam.
- Cabeçalhos das coleções informam quantidade disponível e a opção em uso. A próxima recompensa permanece na identidade.
- Backup e cenários de exemplo ficam dentro de Opções do protótipo e backup.
- Acabamento de console em grafite/verde escuro, com detalhes em âmbar e vermelho, bordas pixeladas e palco da dupla com grade discreta.

O catálogo e o salvamento isolado foram preservados. Continua apenas no protótipo, sem integração ou publicação. Conferência visual pelo jogador pendente.

## Acabamento de Pokédex e feedback visual

A central recebeu uma carcaça vermelha inspirada na Pokédex, lente azul-esverdeada, LEDs de estado, visor verde escuro, indicadores amarelos e marca de Pokébola no rodapé. As coleções continuam agrupadas na mesma tela.

Abertura do visor, realce de cartão, partículas entre a seleção e o inspetor e varredura sobre a dupla dão retorno às interações. Os efeitos respeitam movimento reduzido e são interrompidos ao fechar o perfil. A grade e o palco da dupla foram redesenhados com luzes e um motivo de Pokébola.

Essa alteração permanece somente no protótipo. Conferência visual pelo jogador pendente.

## Organização em três abas

A navegação agora possui apenas Treinador (dupla), Personalização (molduras, títulos, rastros, emotes e comemorações) e Conquistas. Não existem subabas. As coleções usam paginação por setas, substituindo Ver todos/Recolher; o painel não cresce com expansões sucessivas. A seleção permanece no inspetor fixo.

Os controles de simulação e backup aparecem juntos ao abrir uma única área de opções, sem detalhes recolhíveis aninhados. O visual de Pokédex foi mantido. Alteração exclusiva do protótipo, com conferência visual pelo jogador pendente.

## Escolhas diretas e identidade de Kanto

- Clique em uma opção liberada para aplicá-la imediatamente. Emotes e comemorações também reproduzem a prévia automaticamente. Itens bloqueados apenas mostram os requisitos.
- Não há mais botão Usar nem os dois botões de prévia por item. Ver na arena reproduz a expressão/comemoração selecionada quando aplicável.
- Para trocar um emote, selecione um dos quatro espaços e clique no novo emote. Não é preciso remover antes. Desfazer reverte a última mudança de aparência sem desfazer o nome digitado.
- Os três filtros foram substituídos por um único controle Incluir bloqueados; busca e paginação foram preservadas.
- Cartão de Treinador com insígnias reais de Kanto, tipos dos parceiros e informações dos líderes derivadas dos dados do jogo. Conquistas e títulos associados utilizam insígnias/itens correspondentes onde disponíveis.
- As recompensas originais mantêm seus nomes. Molduras e títulos iniciais exclusivos da prévia receberam referências a Pallet, Viridian e à Liga.
- Rastros possuem desenhos próprios por recompensa, compartilhados pelo ícone e pela dupla, em vez de variar apenas a cor de partículas quadradas.

Permanece um protótipo isolado. As conquistas continuam com progresso de exemplo. Conferência visual pelo jogador pendente.


### Visores azuis e organização do perfil
Visores e palco da dupla em azul, transições entre as três abas e retorno luminoso nas escolhas. Personalização mostra o conjunto equipado; conquistas exibem objetivo, recompensa e progresso no cartão, além de resumo e próximo marco. Alterações exclusivas do protótipo; revisão visual pelo jogador pendente.

### Trainer Card — nova organização
Seleção de personagens sem molduras repetidas, personalização em linhas compactas, conquistas em álbum de medalhas e detalhes no rodapé da coleção. Mantém três abas e aplicação direta. Exclusivo do protótipo; aparência pendente de avaliação do jogador.

### Painel do treinador como abertura
Abre no registro do jogador: dupla, progresso, insígnias e conjunto atual. As coleções ficam acessíveis pelas ações Trocar dupla, Personalizar e Ver álbum, com retorno ao painel. Somente protótipo.

### Arena no fundo do cartão
Seletor abaixo da dupla com terminal azul, Viridian e arenas de Brock, Misty, Mewtwo e aves lendárias. Usa os pintores de cenário existentes; escolha local exclusiva do protótipo, sem trocar a arena da partida.

### Cenários e missões de desbloqueio
Inclui demais temas existentes do jogo via ARENA_THEMES. Reenquadramento aproximado do campo e dupla menor, sem sobrepor o banco. Missões propostas por insígnias e andares da Torre usam progresso simulado; cenários bloqueados permitem apenas prévia, não persistem como equipados. Progresso e critérios ainda exclusivos do protótipo.

### Revisão de organização do terminal
Registro único sem duplicar os sprites. Editor mostra uma categoria de cada vez; cenário e missão saem da lateral e ocupam uma seção própria. Carcaça do terminal preservada. Revisão visual pendente, somente protótipo.

### Tela inicial em aplicativos
Abertura como tablet Pokédex com nove aplicativos: Treinador, Parceiro, Cartão, Títulos, Arenas, Conquistas, Emotes, Vitória e Rastros. Cada aplicativo abre diretamente sua função. Botão Aplicativos retorna ao início. Somente protótipo.

### Superfície digital completa
Abertura ocupa toda a área interna; prévia da dupla integrada ao cabeçalho, insígnias e aplicativos com seleção atual e contagens reais do protótipo. Ícones reaproveitam arte das coleções. Mesma navegação direta por função.

### Aplicativos independentes
As nove funções agora abrem novas telas próprias, com cabeçalho, prévia e composição específica. Sem seletor entre aplicativos e sem abrir os editores anteriores. Reaproveita apenas catálogo, regras e persistência do perfil. Treinador em registro, parceiro em fichário, cartão em estúdio, títulos em credenciais, arenas em atlas com missões, conquistas em diário, emotes em comunicador, vitória em palco e rastros em laboratório. Revisão visual pendente.

### Refinamento da abertura e aplicativos
Conteúdo inicial centralizado em largura limitada, título equipado junto ao nome e proporções ajustadas. Parceiros com filtro por tipo; conquistas com progresso e recompensa nos cartões; emotes com quatro espaços visuais; atlas com filtros de cenários; contagens nos cabeçalhos e bloqueios mais claros. A prévia permanece dentro do aplicativo ao alterar escolhas e as listas preservam a rolagem. Apenas protótipo, sem testes executados.

### Registro do treinador centralizado
Cartões compactos em grade, com sprite, nome e origem alinhados ao centro. Busca alinhada à grade e prévia com dados centralizados. Ajustes limitados ao aplicativo Treinador.

### Companheiro fora do campo
Na arena, parceiro passa para o lado externo do treinador, com sombra e rastro acompanhando a nova posição. Composição frontal do cartão preservada.

### Atlas visual de arenas
Lista textual substituída por galeria com miniaturas dos renderizadores reais. Indicação de cenário equipado, liberado ou bloqueado; missão na prévia lateral. Carregamento das miniaturas conforme entram na área visível, sem mudar a seleção.

### Carregamento das prévias lendárias
Miniaturas aguardam as imagens dos renderizadores terminarem de carregar antes de pintar o cenário. Evita capturar apenas a cor de fundo das arenas lendárias. Indicador visual durante a espera.

### Profundidade da arena na prévia
Cenário e piso são pintados em camadas separadas; inclinação de 38 graus aplicada ao piso como no jogo. Treinador e parceiro permanecem em pé, com escala ampliada de 0,72 para 1 no cartão. Reenquadramento da prévia e mesma perspectiva nas miniaturas.

### Identidade no cabeçalho
Carteira em três áreas: prévia ampliada, nome e título, painel próprio das oito insígnias com contagem e progresso. Composição adaptada a telas estreitas.
