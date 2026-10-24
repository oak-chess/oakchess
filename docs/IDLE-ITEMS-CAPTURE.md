# Bolas, captura e cura — referência e adaptação

## Catálogo
- Poké Bola ×1, Great Ball ×1,5, Ultra Ball ×2.
- Net Ball ×3 para Água/Inseto; ×1 nos demais.
- Repeat Ball ×3 para espécie já capturada; ×1 nas demais.
- Master Ball: captura garantida; não é escolhida automaticamente.
- Poção: 20 PS. Super: 50 PS. Hyper: 200 PS. Max: todos os PS.
- Full Restore: todos os PS e remoção dos estados negativos suportados pelo combate.
- Revive: 50% dos PS. Max Revive: todos os PS.

## Referência
O modelo é **Geração III / Pokémon Emerald**, evitando misturar a cura de gerações modernas com multiplicadores antigos.
- Multiplicadores e fórmula: [pret/pokeemerald, battle_script_commands.c](https://github.com/pret/pokeemerald/blob/master/src/battle_script_commands.c), `Cmd_handleballthrow`.
- Taxas base por espécie: [PokeAPI, pokemon_species.csv](https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon_species.csv). A cópia local está em `species-source.csv`; `capture-rates.js` contém os dados usados em execução. O catálogo PokeAPI é atual; não é uma cópia histórica integral da ROM Emerald.
- Sprites: [PokeAPI/sprites](https://github.com/PokeAPI/sprites/tree/master/sprites/items).

## Adaptação ao idle
A captura acontece após uma vitória e simula o alvo **com 1 PS, sem status**, usando os PS máximos nativos do OakChess na forma inicial. Nos jogos principais, um Pokémon desmaiado não pode ser capturado; esta fase de recuperação para captura é uma adaptação do protótipo. A fórmula e os multiplicadores são os da referência, mas a chance exibida corresponde a esse cenário, não a qualquer batalha de qualquer geração.

Pesquisa de raros garante o encontro, não a captura. Foram removidas as antigas chances fixas de 80/60/40% e a captura garantida pela pesquisa. Não há bônus oculto de aptidão somado à chance.

A bola selecionada tem estoque e reserva próprios. Não ocorre substituição automática por Master Ball ou por outra mais cara. O limite de tentativas da expedição continua compartilhado.

O item de cura escolhido é usado tanto manualmente quanto entre encontros. A cura manual em grupo consome uma unidade por parceiro elegível, somente se houver estoque para todos. Cura automática respeita limiar, reserva e limite. Full Restore não remove estados de aliados fora da seleção nem revive desmaiados.

Preços são valores do protótipo, não preços oficiais. Quantidades antigas de Poké Bolas, Poções e Revives são preservadas. O efeito da Poção antiga de 50% foi substituído por 20 PS, conforme o catálogo escolhido. Itens mais fortes ficam disponíveis na Loja.

## Revisão
Sintaxe dos módulos conferida. Não foram executados testes nem validação visual no navegador nesta alteração.

## Apresentação da captura
A tentativa online tem lançamento da bola selecionada, recolhimento visual do Pokémon, balanço e resultado. O aviso lateral compacto informa captura ou fuga; usa o sprite real da bola comprada. A próxima batalha aguarda a animação. O sorteio e o consumo ocorrem uma única vez; o efeito não altera a chance. Capturas offline não reproduzem efeitos. Pausar ou editar a equipe cancela a apresentação sem desfazer o resultado já salvo. Com redução de efeitos, a apresentação é breve e sem trajetória de movimento.

A animação foi integrada e a sintaxe conferida; ainda requer avaliação visual em navegador.

## Captura por nocaute, sem teto de tentativas
Cada unidade selvagem derrotada recebe exatamente uma tentativa durante a luta, registrada uma única vez por identidade de unidade. Não depende de vitória da equipe. A regra não se aplica aos desafios de treinadores/ginásios. O hook de die aciona o processamento, e o fechamento do combate reconcilia eventuais derrotados ainda não processados.

Limite por expedição, reservas, filtro de espécie e bloqueio artificial de 300 indivíduos foram removidos do caminho de tentativa. As configurações normal/shiny mantêm bolas preferidas separadas. Se a escolhida acabar, seleciona outra desbloqueada em estoque, em ordem de preço. Master Ball continua bloqueada. Uma tentativa consome uma bola e sorteia o resultado uma vez; não há repetição até capturar o mesmo indivíduo. Sem bolas, há registro sem tentativa nem consumo.

As apresentações de captura entram numa fila, preservando o ponto de cada unidade, mesmo quando há dois selvagens da mesma espécie. O gesto do treinador começa ao exibir cada lançamento. A transição aguarda a fila completa e depois processa o resultado da batalha. Custos, bolas gastas e capturas são acumulados por tentativa, inclusive quando a batalha termina em derrota.

O painel de automação e o tutorial foram atualizados para a nova regra. Captura offline permanece optativa e proporcional ao tempo simulado, sem teto artificial por expedição. Sem execução de testes de jogo nesta alteração.

## Correção: somente a bola selecionada
Substitui a regra anterior de troca automática: cada variante usa exclusivamente sua bola selecionada. Sem estoque dessa bola, o evento é registrado sem tentativa, sem consumo e sem alterar a seleção, mesmo que existam outras bolas disponíveis. Normal e shiny mantêm seleções independentes. O orçamento offline também considera apenas o estoque da bola selecionada. Tutorial e painel de automação foram atualizados.

## Apresentação clássica da captura
A fila usa um canvas sobre a arena: bola selecionada com 34 pixels de corpo visível, lançamento em arco, abertura e absorção, queda, três sacudidas e estrelas de sucesso ou abertura com fuga. As imagens são carregadas antes de iniciar cada sequência e suas margens transparentes são recortadas. Duração aproximada de 4,85 segundos por tentativa; movimento reduzido encurta a sequência e reduz deslocamentos. O tempo fica suspenso quando a página está oculta. Esta alteração não teve validação visual no navegador.


## Eventos lendários e equipamentos
Aves alternam Articuno, Zapdos e Moltres em um relógio de 30 minutos; Mew e Mewtwo alternam em outro de 60 minutos. Relógios e evento ativo são salvos. Um único cartão no topo fica disponível até vitória ou dispensa; se ambos os grupos estiverem prontos, o mais antigo aparece primeiro. Não acumula aparições para cada intervalo offline. A derrota permite tentar novamente. O combate é opcional, bloqueado enquanto outra luta ou captura está em andamento, usa cenário correspondente e escala com o nível médio da formação. Cada vitória garante um equipamento aleatório na Mochila, sem recompensa por derrota ou dispensa. O ganho de equipamento a cada cinco vitórias selvagens e as ofertas de equipamentos da loja foram removidos; materiais e pedras selvagens permanecem. Sem testes executados nesta alteração.

## Catálogo de evolução sem pedras fictícias repetidas
A Mochila usa os quinze itens reais referenciados pelas receitas de evolução. Pedras extras antigas (Coração, Casulo, Escuridão, Enigma, Punho, Rocha, Terra, Veneno, Pena, Cristal) e Cabo de Conexão não usados foram retirados do catálogo exibido. Os valores antigos no save não são apagados nem convertidos. Removido o fallback silencioso de sprites para Pedra da Lua; cada chave do catálogo tem seu sprite explícito. A tabela de drops já usa apenas as chaves canônicas mantidas.

## Recompensa lendária rara (substitui a garantia anterior)
Equipamentos têm 1% de chance por vitória contra lendários. O sorteio acontece uma vez na resolução da vitória, antes de remover o evento ativo, e pode terminar sem item. Não há garantia por quantidade de vitórias, nem recompensa de equipamento por derrota, dispensa ou evento Rocket. Card, resultado e descrição da loja informam a chance de 1%.

## Fila inclui a leitura do resultado
A promessa de cada captura só termina depois de manter o resultado por 2,2 segundos visíveis e sair em 0,3 segundo. O aviso seguinte e sua animação aguardam esse período, sem substituir imediatamente capturado/escapou. A espera pausa com a aba oculta e clear cancela também a apresentação do resultado. Sem testes executados.

## Taxa de captura da forma exata
O cálculo recebe o ID da espécie derrotada em vez de consultar sempre a primeira espécie da família. O bônus da Net Ball consulta os tipos dessa forma e a Repeat Ball verifica a espécie/forma já capturada. O painel de chances usa o mesmo ID. Normal e shiny preservam as regras atuais de balanceamento e consomem somente a bola selecionada. A fórmula continua adaptada ao idle. Sem testes executados.
