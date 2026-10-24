# Drops por espécie — Jornada Idle

Referência de estrutura: [PokéIdle.io](https://pokeidle.io/) descreve loot das hunts enviado à bolsa, e [PokeIdle](https://pokeidle.games/) documenta consulta de drops pela Pokédex. Não foi obtida uma tabela oficial de probabilidades por espécie do pokeidle.io. Todos os itens, chances e preços abaixo são balanceamento próprio do OakChess.

O módulo drops-data.js define materiais vendáveis, tabelas por famílias de espécies e cobertura por tipo para as demais famílias. A tabela retornada pela consulta é a mesma usada no sorteio. Famílias compartilham tabelas entre formas; não há multiplicador oculto por evolução. Cada entrada possui chance independente e quantidade mínima/máxima. É possível não cair nenhum material. O sorteio ocorre uma única vez por inimigo derrotado no fluxo normal de caçadas, protegido pelo marcador existente _idleRewarded. Não depende de vitória final nem de captura.

O loot por região garantido anterior foi substituído por esses sorteios. Ouro e XP seguem as regras existentes. Pedras de evolução continuam no sorteio independente já existente de 12% por tipo correspondente e não entram na venda de materiais. Os materiais usam sprites Pokémon existentes; os nomes adaptados não representam equipamentos utilizáveis.

Pokédex: lista item, chance, quantidade e preço. Mochila e loja: compartilham o mesmo catálogo/estoque. Loja mostra somente materiais em estoque. Estoques antigos fiber, ore, shell e essence e seus preços são preservados. O relatório continua contabilizando valor do loot adquirido, sem tratá-lo como saldo disponível. Não há drops offline novos nesta entrega.

Mudanças isoladas em prototypes/idle-journey/. Sintaxe conferida; não foi feita validação de combate em navegador.

## Catálogo ampliado de sprites
Foram importados mais 70 PNGs da wiki do PokeXGames, além dos oito iniciais (78 arquivos de sprite no pacote local). Parte substitui ícones aproximados em materiais existentes sem mudar suas chaves, quantidades ou preços. Os demais acrescentam itens e associações por espécie. A origem e as associações ficam em assets/loot/SOURCES.md e expansion-manifest.json. As probabilidades são balanceamento próprio do OakChess; não são taxas oficiais do jogo de origem.

As tabelas combinam materiais comuns da família com materiais específicos da forma atual. Quando uma forma não tem definição própria, usa a definição da família; os itens duplicados são removidos antes do sorteio, preservando a primeira chance publicada. A Pokédex agora apresenta as tabelas de todas as formas da linha evolutiva separadamente. Estoques antigos permanecem nas mesmas chaves. PNGs conferidos quanto à presença e formato; sintaxe dos módulos conferida. Não foi feita validação em combate ou publicação nesta tarefa.

## Pedras raras por espécie — regra atual
Substitui o sorteio antigo de 12% por tipo: chance total de 0,5% por inimigo derrotado, no máximo um material de evolução por derrota. A pedra é determinada pela espécie/forma: primeiro exceções explícitas (Pikachu → Trovão, Clefairy → Lua, Eevee → Fogo/Água/Trovão); depois o item exigido pela próxima evolução; depois afinidade elemental. Havendo várias possibilidades, cada uma recebe uma fração igual dos 0,5%. Não há piso de nível nem garantia cumulativa nesta adaptação. Taxas e regras são próprias do OakChess, não foram confirmadas como taxas do pokeidle.io.

O mesmo stoneTable alimenta o sorteio e a consulta da Pokédex. Pedras vão para world.stones, com aviso de drop raro, e ficam fora da venda de loot. Materiais de troca (por exemplo Revestimento Metálico) mantêm seus requisitos existentes. Estoque e receitas anteriores não são apagados. Não são geradas pedras offline.

Referência consultada: https://pokeidle.io/terms publica que cada drop tem sua própria chance na Pokédex, mas não estabelece uma taxa geral de pedras de evolução. https://pokeidle.games/ descreve Stones raras por tipo, com outra finalidade (potencial) e exigência de nível própria daquele jogo; essas regras não foram copiadas como se fossem equivalentes.
