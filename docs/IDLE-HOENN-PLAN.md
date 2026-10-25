# Hoenn no Jornada Idle — plano de implementação

Estado: implementação local concluída e verificada; publicação no GitHub pendente.
Auditoria local: 25/10/2026. Continuação do trabalho documentado em IDLE-JOHTO-PLAN.md.

## Objetivo e decisões de escopo

Adicionar os 135 Pokémon da terceira geração (#252 Treecko a #386 Deoxys), famílias evolutivas, golpes próprios, sprites PMD normais/shiny, oito destinos com ginásios, insígnias, caçadas e eventos de Hoenn. Preservar os Pokémon, índices e conquistas existentes.

Hoenn será liberada após vencer Clair e conquistar a insígnia Ascensão. O acesso às regiões anteriores permanece disponível. Os novos ginásios ocupam os índices 16–23; Kanto continua 0–7 e Johto 8–15. Total de 24 insígnias.

Referência dos ginásios: Pokémon Emerald. Assim, Sootopolis usa Juan; Wallace pode entrar posteriormente em um desafio da Liga. Tate e Liza formam um único ginásio, com os dois retratos e uma equipe compartilhada. Equipes, níveis e mecânicas do Idle devem ser identificados como adaptações, sem apresentar a expansão como reprodução integral do cartucho.

Golpes seguem o padrão atual de aprendizados por espécie, incluindo máquinas e tutores de versões registradas. A expansão de uma geração não exige limitar todos os aprendizados a Ruby/Sapphire/Emerald. Mega Evoluções, Reversão Primitiva e evoluções novas de outras gerações ficam fora desta entrega.

## Auditoria inicial do projeto (antes da implementação)

| Parte | Já disponível | Trabalho restante |
|---|---|---|
| Espécies | 135/135 no catálogo de pesquisa | Acrescentar as famílias ao elenco jogável |
| Aprendizados | 135/135 registrados localmente | Gerar e verificar os conjuntos de golpes |
| Conjuntos de combate do elenco | 0/135 | Implementar e validar |
| PMD incorporado ao renderizador | 0 normais / 0 shiny | Baixar, atribuir créditos e incorporar |
| GIFs alternativos Showdown locais | 0 normais / 0 shiny | Completar a alternativa visual dos menus |
| Retratos dos líderes | Ausentes nos caminhos usados pelo Idle | Baixar da fonte e verificar cada caminho |
| Insígnias | Ausentes nos arquivos 17–24 | Baixar, conferir a ordem e integrar |
| Regiões/habitats | Existem apenas Kanto e Johto | Adicionar Hoenn e seus encontros |

A presença de uma espécie no catálogo não significa que seus sprites e regras já estejam prontos para o combate. Os números acima são de arquivos efetivamente usados pelo elenco/renderizador, não de imagens que possam existir em outros catálogos do projeto.

## Etapa 1 — dados e famílias

1. Criar um gerador para Hoenn reutilizando o processo de Johto. Acrescentar as famílias ao final de LINES, preservando todas as famílias existentes e os números das formas salvas.
2. Separar linhagens ramificadas quando necessário. Formas alternativas não devem ocupar posições de evolução: mudar Castform ou Deoxys de forma não pode aumentar a estrela nem o nível.
3. Conferir nomes canônicos, IDs e referências de captura, ginásio e evento. Evitar falhas como divergências entre nomes de exibição e o nome cadastrado do Pokémon.
4. Gerar golpes exclusivamente a partir do aprendizado da espécie. A disponibilidade de um asset de golpe não autoriza associá-lo a outro Pokémon apenas por ter o mesmo tipo.
5. Listar efeitos de combate que o motor ainda não executa corretamente. Implementar o comportamento ou documentar uma adaptação explícita; não transformar automaticamente golpes de status em ataques de dano.
6. Distribuir espécies comuns, raras, fósseis e bebês entre caçadas, incubadora e laboratório. Nenhuma espécie deve ficar sem uma forma definida de obtenção ou desafio.

Casos que exigem regra própria antes de concluir a etapa:

| Família/espécie | Regra e cuidado no Idle |
|---|---|
| Wurmple | Silcoon ou Cascoon a partir do nível 7; resultado persistente ligado ao indivíduo, sem novo sorteio ao recarregar |
| Nincada | Ninjask no nível 20; Shedinja como parceiro adicional, com vaga disponível e Poké Bola. Validar os recursos antes da evolução e impedir duplicação por recarga |
| Shedinja | PS máximo 1 mesmo após nível, IVs e equipamentos; proteção de Wonder Guard precisa respeitar vantagens de tipo e as exceções de dano indireto |
| Azurill / Wynaut | Evolução por amizade para Marill / Wobbuffet sem reordenar as famílias existentes de Johto |
| Feebas | Usar a troca assistida com Escama Prisma, que o projeto já prevê. Explicar que é uma alternativa canônica de versões posteriores; não inventar evolução comum por nível |
| Clamperl | Huntail ou Gorebyss por troca assistida e o material correspondente, com escolha explícita na tela |
| Castform | Forma, tipo e sprite coerentes com o clima. Não associar neblina a granizo; a forma de neve depende de uma condição de clima suportada |
| Deoxys | Formas Normal, Ataque, Defesa e Velocidade representadas como formas, com atributos correspondentes e a mesma identidade da espécie |
| Slaking | Mecânica de Truant adaptada e explicada; não compensar apenas com uma passiva genérica de tipo Normal |
| Relicanth / Wailord | Participação nas condições de acesso aos Regis pode usar a coleção, sem prender os dois na equipe de combate |
| Anorith / Lileep | Restauração no laboratório com escolha explícita de fóssil, consumo e espaço verificados |

Essas regras serão conferidas nos dados de evolução e nas fontes de referência durante a implementação. A simples existência de um sprite não encerra os casos especiais.

## Etapa 2 — sprites e apresentação

- Incorporar PMD para todas as 135 espécies desde o início: 270 conjuntos básicos normal/shiny. Evitar liberar a região com a maioria dos Pokémon usando um estilo alternativo na arena.
- Prever as três formas adicionais de Castform e as três adicionais de Deoxys, com shiny: mais 12 conjuntos, total planejado de 282. Conferir disponibilidade, caminhos e créditos na revisão escolhida da fonte.
- Não importar variantes cosméticas, sprites de cutscene ou Altcolor como espécies ou formas canônicas de combate.
- Fixar uma revisão do SpriteCollab, baixar XMLs e PNGs correspondentes e verificar aliases, dimensões e quadros. Preservar todas as outras espécies do manifesto.
- Recalcular os limites de transparência para encaixe nos hexágonos, incluindo formas grandes, voadoras e flutuantes.
- Validar carregamento normal/shiny, orientações, caminhada, ataque, habilidade, dano, entrada e saída. Respeitar as animações existentes na fonte, sem inventar quadros ou redesenhar o material.
- Manter sprites frontais/de costas dos menus como alternativa, retratos dos líderes, insígnias e créditos. Não confundir esses arquivos com a padronização PMD da arena.

## Etapa 3 — jornada, caçadas e ginásios

Proposta inicial de progressão, a ajustar em testes de combate. Os níveis desta tabela são balanceamento do Idle; não são os níveis dos ginásios de Emerald.

| Ordem | Cidade | Líder | Tipo | Insígnia de referência | Piso inicial das caçadas | Nível proposto do ginásio |
|---:|---|---|---|---|---:|---:|
| 1 | Rustboro | Roxanne | Pedra | Stone | 190 | 195 |
| 2 | Dewford | Brawly | Lutador | Knuckle | 202 | 207 |
| 3 | Mauville | Wattson | Elétrico | Dynamo | 214 | 219 |
| 4 | Lavaridge | Flannery | Fogo | Heat | 226 | 231 |
| 5 | Petalburg | Norman | Normal | Balance | 238 | 243 |
| 6 | Fortree | Winona | Voador | Feather | 250 | 255 |
| 7 | Mossdeep | Tate e Liza | Psíquico | Mind | 262 | 267 |
| 8 | Sootopolis | Juan | Água | Rain | 274 | 280 |

Cada destino terá três habitats, total de 24. As listas de espécies serão definidas por ambiente, evolução e raridade, com cinco a sete espécies por habitat. Evitar repetir espécies entre os três habitats do mesmo destino.

| Destino | Habitats propostos |
|---|---|
| Rustboro | Rotas iniciais, Bosque de Petalburg, Túnel de Rusturf |
| Dewford | Caverna de Granito, Praia de Dewford, Águas costeiras |
| Mauville | Rotas do ciclismo, Nova Mauville, Margens de rio |
| Lavaridge | Monte Chimney, Caminho de Jagged, Deserto da rota 111 |
| Petalburg | Reserva de Petalburg, Pradarias dos parceiros, Parque de treinamento |
| Fortree | Rotas de chuva, Mata de Fortree, Arredores do Instituto do Clima |
| Mossdeep | Costa de Mossdeep, Caverna de Shoal, Recifes e mergulho |
| Sootopolis | Águas de Sootopolis, Rotas oceânicas avançadas, Estrada da Vitória |

Nem todo nome acima é um mapa oficial independente: os habitats são agrupamentos de caçada do Idle. Abrir uma nova região precisa alterar os encontros, raridades, recursos e chefes, além do cenário. Novas artes de arena podem ser adicionadas depois; a primeira implementação pode reutilizar cenários existentes de forma declarada.

## Etapa 4 — eventos lendários e míticos

Incluir os dez Pokémon em eventos, mantendo-os fora das caçadas comuns e preservando o modelo atual de recompensas de desafio.

| Grupo | Pokémon | Proposta de desbloqueio |
|---|---|---|
| Ruínas antigas | Regirock, Regice, Registeel | Progresso em Hoenn e uma investigação permanente das ruínas |
| Encontros itinerantes | Latias, Latios | Após Winona |
| Terra e mar | Groudon, Kyogre | Após Juan |
| Pilar Celeste | Rayquaza | Após Juan e a apresentação dos eventos de terra/mar |
| Evento mítico | Jirachi | Missão permanente após concluir os ginásios de Hoenn |
| Ilha distante | Deoxys | Missão permanente após concluir os ginásios de Hoenn |

Os desbloqueios acima são propostas do Idle. Os níveis dos encontros precisam registrar a versão de referência escolhida, pois variam entre os jogos; não usar o nível de uma região anterior como substituto. Força do chefe, HP e dano precisam ser conferidos junto do nível.

Agendamento:
- Uma única vaga ativa para todos os eventos de Kanto, Johto e Hoenn.
- Adicionar os relógios de Hoenn quando seus requisitos forem atendidos, sem reiniciar os relógios existentes.
- Usar fila por vencimento e alternância para impedir que um grupo frequente bloqueie os demais.
- Mostrar qual evento está ativo, o próximo evento elegível e o requisito dos grupos ainda bloqueados.
- Definir intervalos após simular a fila completa. Não escolher horários isolados que pareçam bons, mas causem sobreposição ou espera excessiva com os grupos já existentes.
- As notificações devem mostrar o Pokémon/forma efetivamente cadastrados e continuar corretas após trocar de aba no navegador.

## Etapa 5 — tornar a interface independente de duas regiões

Antes de acrescentar Hoenn, corrigir os pontos que hoje assumem apenas Kanto/Johto:

1. Criar metadados de continente com ID, nome e intervalo de ginásios. Usar esses dados no mapa, estojo, perfil, missões e Pokédex.
2. Substituir expressões do tipo `area >= 8 ? Johto : Kanto`; os índices 16–23 não podem ser classificados como Johto.
3. Restringir a contagem das insígnias de Johto aos índices 8–15. Uma insígnia de Hoenn não pode completar uma missão de Johto.
4. Mostrar três abas compactas de continente e oito seletores por aba. Manter os estojos separados e o total global de 24.
5. Suportar dois retratos para Tate e Liza e permitir voltar ao ginásio correto ao abrir pelo estojo.
6. Adicionar filtro Hoenn na Pokédex, com 135 espécies, incluindo os eventos. Mostrar corretamente as formas alternativas e como obter bebês/fósseis.
7. Incluir os novos itens evolutivos e materiais apenas onde necessários, com receita, estoque, ícone e fonte de obtenção.
8. Preservar busca, favoritos, cadeados, proteção automática, comparações e qualidade das capturas para as espécies novas.

## Etapa 6 — compatibilidade e verificações

- Fazer uma cópia do save antes da migração de Hoenn. Acrescentar as oito posições novas de progresso sem apagar ou reinterpretar as 16 anteriores.
- Preservar IDs individuais, família, forma, nível, XP, IVs, potência, shiny, itens, favorito, cadeado, tarefas, ovos e formações.
- Não baixar ou carregar assets remotos durante uma batalha: o conteúdo necessário deve estar disponível localmente e funcionar por file:// e hospedado.
- Conferir 135 IDs únicos, aprendizados e obtenção. As formas adicionais não contam como novas espécies.
- Testar níveis/itens/amizade, Wurmple após recarga, Shedinja sem vaga/Poké Bola, limite de PS de Shedinja, evolução de Clamperl e bebês de famílias já salvas.
- Conferir PMD normal/shiny, aliases, arquivos, encaixe e carregamento de todas as variantes. Fazer uma batalha de teste e revisão visual.
- Verificar mudanças de forma de Castform e Deoxys sem alterar identidade ou contar uma nova captura indevidamente.
- Testar desbloqueio de cada ginásio, sua equipe, nível e recompensa única; abertura pelo mapa e pelo estojo.
- Simular a agenda com todos os grupos habilitados, expiração, vitória, derrota, recarga e tempo em outra aba. Nunca apresentar dois desafios ativos ao mesmo tempo.
- Exercitar saves antigos, intermediários em Johto e completos nas 16 insígnias. Testar caça, captura, PC, evolução, incubadora e formações com espécies das três regiões.

## Ordem de entrega

1. Base de continentes e migração.
2. Elenco, aprendizados e regras especiais.
3. Assets PMD completos e créditos.
4. Caçadas e obtenção das espécies.
5. Oito ginásios, insígnias e apresentação.
6. Eventos e fila compartilhada.
7. Verificação completa e revisão do balanceamento.

Cada etapa deve ficar verificável antes da próxima. Hoenn não deve ser declarada pronta apenas porque as 135 entradas aparecem na Pokédex. Publicação no GitHub é uma etapa posterior à implementação e verificação.

## Fontes e material de apoio

- Auditoria local em tmp/hoenn-audit.json.
- Catálogo, aprendizados e movimentos: assets/dex/catalog.js, assets/dex/learnsets.js, assets/dex/moves.js.
- Evoluções: tmp/dex-source/pokemon_evolution.csv e pokemon_species.csv, derivados de PokeAPI.
- [SpriteCollab](https://github.com/PMDCollab/SpriteCollab): sprites PMD e créditos; usar revisão fixada e respeitar a licença já documentada em assets/pmd.
- [Catálogo de treinadores do Showdown](https://play.pokemonshowdown.com/sprites/trainers/): conferir os retratos e seus autores.
- [Ginásio de Sootopolis em Emerald](https://github.com/pret/pokeemerald/blob/master/data/maps/SootopolisCity_Gym_1F/scripts.inc): Juan e a oitava insígnia.
- [Ginásio de Mossdeep em Emerald](https://github.com/pret/pokeemerald/blob/master/data/maps/MossdeepCity_Gym/scripts.inc): Tate e Liza em um desafio conjunto.


## Entrega realizada — 25/10/2026

- 135 espécies da geração III em 80 famílias acrescentadas ao final do elenco, preservando os índices antigos.
- Oito destinos e ginásios de Hoenn, 24 habitats e 24 insígnias no total. Hoenn é liberada após Clair.
- Golpes conferidos contra os aprendizados por espécie, incluindo máquinas e tutores das versões registradas. Leaf Blade, Muddy Water, Blaze Kick, Meteor Mash, Weather Ball e Psycho Boost receberam tratamento no conjunto de golpes.
- 282 conjuntos PMD normais, shiny e formas alternativas, com 4.888 folhas físicas de animação. Castform e Deoxys têm formas próprias; retratos dos nove líderes e oito insígnias instalados.
- Evoluções ramificadas, bebês, fósseis e itens próprios integrados. Wurmple usa um resultado persistente derivado do indivíduo. Nincada evolui para Ninjask; Shedinja é um bônus adicional somente com vaga no PC e uma Poké Bola comum, sem duplicação.
- Shedinja tem 1 PS e proteção contra dano direto que não seja supereficaz; dano indireto continua permitido. Slakoth/Slaking alternam ação e descanso, enquanto Vigoroth não descansa.
- Castform acompanha o clima do encontro; a caça gelada de Hoenn usa granizo. Deoxys permite selecionar quatro formas com atributos correspondentes. Psycho Boost reduz o poder especial após o uso.
- Dez lendários/míticos distribuídos em seis grupos de eventos: Regis, Eon, clima, céu, desejo e espaço. A fila compartilhada mantém um único evento ativo.

### Eventos e desbloqueios

| Grupo | Níveis | Condição |
|---|---|---|
| Regirock, Regice e Registeel | 40 | Missão após Norman, com Relicanth e Wailord na coleção/equipe |
| Latias e Latios | 50 e 40 | Insígnia de Fortree |
| Groudon e Kyogre | 70 | Oito insígnias de Hoenn |
| Rayquaza | 70 | Oito insígnias e vitórias contra Groudon e Kyogre |
| Jirachi | 5 | Missão própria após as oito insígnias |
| Deoxys | 30 | Missão própria após as oito insígnias |

Os grupos usam intervalos de 42, 52, 62, 72, 82 e 92 minutos, respectivamente. Os níveis de Groudon, Kyogre, Rayquaza e Regis foram conferidos nos scripts de Emerald; Latias usa a referência de Southern Island e Latios a de encontro itinerante. Jirachi usa a referência de distribuição. Os eventos mantêm o modelo de recompensas do Idle.

### Adaptações e limites explícitos

A progressão de Hoenn nos níveis 190–280 é balanceamento do Idle. O combate mantém as adaptações existentes do motor, inclusive Counter/Mirror Coat e Sketch temporário; não reproduz integralmente o cartucho. O descanso de Truant segue os intervalos de ações do jogo. Arenas e trilhas existentes foram reutilizadas conforme o ambiente. Os efeitos PokéTibia continuam no protótipo separado.

### Verificação

Os verificadores de Hoenn e Johto passaram para elenco, aprendizados, obtenção das famílias, evolução, migração, formas, regras especiais e integridade dos arquivos PMD. A agenda foi simulada durante 24 horas com os 12 grupos habilitados, sem eventos simultâneos. A verificação em navegador isolado cobriu os três continentes, 24 insígnias, Pokédex de Hoenn, carregamento dos 282 conjuntos PMD, combate com seis espécies, Shedinja com 1 PS, Castform no granizo e evento de Deoxys Velocidade. Nenhum perfil ou save do navegador do usuário foi usado nos testes.

O carregamento cria uma cópia de segurança local antes da migração de Hoenn. As alterações desta entrega ainda não foram publicadas no GitHub.
