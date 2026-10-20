# Torre dos Desafios — 60 andares

## Conteúdo implementado

Os doze setores estão conectados em uma subida de 60 andares. Os setores I–III mantêm suas mecânicas existentes; IV–XII usam definições em `assets/tower-sectors.js`, carregadas antes do controlador `assets/tower.js`.

| Setor | Andares | Chefe | Mecânica principal |
|---|---|---|---|
| I — Fundação de Pedra | 1–5 | Onix | Abalos em colunas. |
| II — Santuário Psíquico | 6–10 | Alakazam | Ondas psíquicas e focos de cura. |
| III — Floresta e Esporos | 11–15 | Venusaur | Raízes, esporos e sementes. |
| IV — Águas Profundas | 16–20 | Gyarados | Poças de poder para Água, correntes e ondas que deslocam. |
| V — Usina Elétrica | 21–25 | Magnezone | Mana em placas condutoras, descargas e alternância das placas. |
| VI — Cratera Vulcânica | 26–30 | Charizard | Brasas, fissuras e cone de fogo com área persistente. |
| VII — Mansão Assombrada | 31–35 | Gengar | Sombras, reflexos visuais, perda de alvo e troca de posição do chefe. |
| VIII — Santuário Glacial | 36–40 | Lapras | Congelamento, rajadas e cristais com uma segunda explosão anunciada. |
| IX — Dojô dos Campeões | 41–45 | Machamp | Círculos de duelo e sequência de três golpes, com final amplo. |
| X — Ruínas e Fósseis | 46–50 | Aerodactyl | Desabamentos, alternância seco/inundado e mergulho com fragmentos posteriores. |
| XI — Ascensão dos Dragões | 51–55 | Dragonite | Rajadas, orbes em coluna e combinação de investida com meteoros. |
| XII — Cume Lendário | 56–60 | Mewtwo | Vigílias de Articuno, Zapdos e Moltres; Mewtwo alterna ondas, deslocamento e elementos. |

## Organização de cada setor

- Primeiro combate: apresentação da mecânica.
- Segundo: perigo ambiental.
- Terceiro: caminho comum ou elite.
- Quarto: evento/refúgio, sem combate.
- Quinto: chefe.
- Total: 48 combates e 12 eventos/refúgios.

### Cadência revisada das relíquias

- Uma relíquia nova, sempre normal, na segunda batalha de cada setor (andares 2, 7, 12…57): até 12 diferentes por subida.
- As demais batalhas comuns concedem ouro, XP e poções, sem carta de relíquia.
- Elite aprimora uma relíquia normal já possuída; não acrescenta uma nova aprimorada.
- Limite global de aprimoradas: 1 em 1–10, 2 em 11–20, 3 em 21–30, 4 em 31–40, 5 em 41–50 e 6 em 51–60. Eventos de aprimoramento respeitam o mesmo limite.
- A Fonte Termal oferece aprimoramento em vez de uma relíquia extra.
- Removido o aprimoramento automático depois de seis relíquias coletadas.
- Recompensa de carta sem opções elegíveis é convertida em 10 ouro. Os ganhos básicos das vitórias e os bônus de elite/shiny permanecem.
- Relíquias de tentativas antigas são preservadas, mesmo acima dos novos limites. A nova cadência vale para as próximas recompensas; o efeito completo de equilíbrio é observado em novas subidas. Ofertas já salvas não são sorteadas novamente.

Os novos setores possuem três equipes possíveis por combate comum/chefe, com composições próprias para elite. As equipes e posições geradas ficam no salvamento do andar. Nos setores tardios, inimigos recebem equipamento; elites recebem um segundo equipamento. Os chefes intensificam ataques abaixo de metade dos PS. Mewtwo tem fases em 66% e 33%.

## Eventos

| Andar | Evento | Escolhas |
|---|---|---|
| 19 | Náufrago da Torre | 6 ouro +10 vida; guarda extra no chefe por +12 ouro na vitória; cura. |
| 24 | Sala de Manutenção | Duas placas perigosas a menos no chefe; equipamento; cura. |
| 29 | Forja Esquecida | Aprimorar relíquia; equipamento; cura. |
| 34 | Quarto Lacrado | Remover maldição de mana (ou preparar escudo se não houver maldição); cura; pagar 10 vida por 14 ouro. |
| 39 | Fonte Termal | Cura; proteção contra perigos do chefe; escolha de relíquia. |
| 44 | Mestre Errante | +6% dano permanente nesta subida; +8 nas duas resistências; cura. |
| 49 | Altar Esquecido | Aprimorar relíquia; equipamento; cura. |
| 54 | Ninho nas Alturas | Proteção contra perigos do chefe; +6% dano nesta subida; cura. |
| 59 | Último Refúgio | Até 40 vida; aprimorar relíquia; equipamento. |

A proteção reduz em 40% o dano dos perigos especiais do próximo chefe. A maldição da elite da mansão reduz a mana inicial em 15 até ser removida. Escolhas, relíquia a aprimorar e equipamento são persistidos; recompensas só são concedidas uma vez. Opções sem efeito possível ficam desabilitadas.

## Perigos e efeitos

- Aviso de 2s antes dos novos perigos; o aviso indica os hexágonos afetados.
- Animação do elemento em cada espaço atingido, mesmo vazio; dano no momento da ativação.
- Fogo permanece por 3s. Esporos, sementes, gelo, reflexos e fragmentos usam o relógio do combate.
- Perigos ambientais atingem ambos os lados; golpes especiais dos novos chefes atingem o jogador.
- Deslocamento respeita limites e espaços livres. Gengar troca com um aliado disponível.
- Aves lendárias ficam visíveis ao lado da arena nos andares 56–58: flutuam na preparação e permanecem paradas durante a luta.
- Os cenários já disponíveis do jogo são reutilizados, incluindo as arenas ilustradas das aves. Cartas e seleção de setores combinam ilustrações existentes com sprites em pixel art; não foram geradas novas imagens nesta entrega.

## Progressão e salvamento

- Equipe, ouro, relíquias, treinamentos e vida continuam entre setores.
- Passagem entre setores: até +20 vida e +4 XP, apenas ao efetivar a subida.
- Derrotas custam no máximo 18 vida em andares comuns, 20 em chefes; não renovam a loja gratuitamente.
- Recuperação por derrota, por andar: +3 ouro na primeira, +2 na segunda e nenhum nas seguintes. O contador `defeatsByFloor` é salvo junto com o ouro; recarregar ou sair não reinicia o limite. Não concede poções, XP ou relíquias e não reduz a recompensa da vitória. Salvamentos antigos começam esse contador a partir da atualização.
- Shiny por encontro: 5% nos andares 1–10, 10% em 11–30, 15% em 31–50, 20% em 51–60. Um adversário pode ser shiny, inclusive o chefe. Bônus existente de 18% em PS/dano; vitória concede +2 ouro.
- Poções por primeira vitória: 1 em combate comum, 2 em elite e 3 em chefe. Usa o mesmo sorteio de frascos, inventário, som e animação da campanha. O inventário é salvo junto ao andar concluído; derrotas, eventos sem combate e retomadas não concedem frascos adicionais.
- Relíquias priorizam opções ainda não apresentadas e depois as menos recentes. Se toda a coleção estiver aprimorada, a recompensa vira 10 ouro.
- Tentativas oficiais, prévia completa e prévias de cada setor usam salvamentos separados. Salvamentos antigos ativos continuam válidos; tentativas já encerradas não são reabertas.
- Recordes preservam o total de andares da versão em que foram registrados; novas tentativas usam 60.

## Acesso para análise

Na entrada da torre, **Escolher setor · Prévia** abre os doze setores. Cada escolha inicia ou retoma sua prévia própria. Nível, estrelas iniciais e ouro aumentam conforme o setor escolhido; a campanha e os recordes oficiais permanecem separados.

## Estado da entrega

### Cartas ilustradas dos eventos

Refúgios e eventos usam cartas completas com molduras ornamentadas, ilustrações temáticas e pergaminhos de título e descrição. Categorias: cura, equipamento, loja, suprimentos, baú sob guarda, armadilhas, purificação, baú assombrado, proteção, treino ofensivo, treino defensivo, aprimoramento, relíquia e tesouro das raízes. As bênçãos da floresta compartilham a categoria correspondente com seu próprio nome e efeito.

Nome, categoria e informações da escolha são escritos dentro dos pergaminhos da carta pelo jogo, acompanhando os valores, itens e limites atuais. As relíquias preservam suas ilustrações individuais dentro das novas molduras de recompensa e aprimoramento. As cartas reutilizam brilho, partículas, navegação com som e movimento reduzido. Nenhuma regra de recompensa foi alterada nesta etapa. Sem testes de combate ou verificação no navegador.

### Rotas alternativas

Nos andares de escolha (3, 8, 13, até 58), cada setor oferece Guardas, Elite e Tesouro vigiado. Guardas mantém a dificuldade, ouro base e 1 poção. Elite concede +4 ouro, 2 poções e uma oportunidade de aprimoramento dentro do limite, enfrentando +30% PS e +15% dano. Tesouro concede +8 ouro e 1 poção contra +15% PS e +25% dano. Todas concedem 2 XP; bônus shiny continuam adicionais. As cartas mostram os valores totais do andar e os riscos antes da escolha.

A rota fica fixada até vencer, inclusive após derrota ou retomada. O mapa registra as novas escolhas por andar. Salvamentos anteriores mantêm a rota atual; escolhas passadas não registradas não são inventadas. As recompensas de relíquias novas continuam uma por setor. Implementação local, sem testes ou deploy.

### Relíquias equipadas e guardadas

A coleção permanece inteira, mas apenas as relíquias equipadas concedem atributos, efeitos condicionais, ícones e destaques de posição. A tentativa começa com 3 espaços; completar os andares 15, 30 e 45 libera, respectivamente, o quarto, quinto e sexto. O mapa separa Equipadas e Guardadas, permite ler cada descrição e trocar durante a preparação. Relíquias novas ocupam automaticamente um espaço livre; sem espaço, ficam guardadas. Aprimoramentos continuam vinculados à relíquia, inclusive quando guardada.

Ao retomar um salvamento anterior sem seleção de equipamentos, aparece uma escolha inicial que preserva a coleção e permite selecionar até o limite atual. A seleção é salva com a tentativa. Esta etapa foi implementada localmente, sem execução de testes ou deploy.

Implementação local. Não foram executados testes de combate nem validação visual no navegador. Equilíbrio dos 60 andares ainda requer partidas. Não foi feito deploy.

## Companheiros iniciais

A escolha agora inclui Bulbasaur, Charmander, Squirtle, Pikachu e Eevee. As cartas exibem papel, descrição curta, tipos e ação compacta. Pikachu usa a linha Pichu/Pikachu/Raichu com duas estrelas no início; essa diferença está indicada na descrição. Eevee abre a escolha de evolução ao atingir duas estrelas, inclusive nas prévias avançadas. A seleção usa a moldura de cartas colecionáveis da campanha, com composição responsiva e sprites locais para as novas opções.

## Indicação visual das relíquias de fileira

Durante a preparação, Juramento da Frente destaca as filas 4–5 com contorno dourado e escudos; Runas da Retaguarda destaca as filas 6–7 com contorno violeta e runas. Uma legenda compacta mostra o bônus normal ou aprimorado. O brilho respeita a intensidade de neon e as opções de movimento reduzido. Os destaques desaparecem no combate: os bônus são aplicados à posição inicial, sem sugerir uma área que acompanha os movimentos dos Pokémon. Nenhum efeito adicional de combate foi acrescentado.

## Visualização dos demais bônus

- Insígnia Solitária: marca o Pokémon isolado e seu hexágono na preparação.
- Estandarte da União: marca os Pokémon com dois aliados adjacentes e desenha conexões curtas entre eles.
- Ícones acima dos Pokémon mostram até três relíquias e um contador das demais. A descrição ao passar o mouse lista os efeitos aplicados, os que aguardam condição e os que já ativaram.
- No combate, os bônus de posição continuam indicados de acordo com sua aplicação inicial; a marcação da área desaparece para não sugerir reaplicação durante deslocamentos.
- Raiz, cura de emergência, escudo do último aliado e velocidade aos 10s recebem anel, brilho e nome no momento em que ativam.
- A leitura dos bônus nos atributos continua usando a simulação de relíquias existente. Não foram executados testes de combate.

## Painéis reposicionáveis

O painel da torre e o painel de estatísticas ao vivo podem ser arrastados pelo cabeçalho, com mouse ou toque. A legenda acompanha a torre. A posição de cada painel é salva separadamente no navegador, limitada à área do jogo e ajustada ao expandir/recolher ou redimensionar. Duplo clique no cabeçalho restaura a posição padrão. Cabeçalhos focados também aceitam setas (5px; Shift: 20px). Botões continuam com sua ação normal. Implementado sem execução de testes.

## Batalha automática

Atualização do controle: clique simples em LUTAR inicia uma batalha; manter pressionado por 650ms ativa o Auto. O clique de soltura após ativar não desliga o modo. Com Auto ligado, um clique simples desativa. Mouse, toque e teclas Espaço/Enter usam o mesmo gesto, com indicação luminosa enquanto segura. Soltar antes do prazo faz apenas a ação normal; sair do botão, cancelar o toque ou perder o foco interrompe a pressão. Derrota continua desativando o Auto. Alteração implementada sem execução de testes.

Controle Auto ao lado de Combater, disponível também durante o combate. Ao ativar, inicia a próxima batalha após 3s de preparação livre. Na torre, avança os mapas de continuidade e reorganiza após derrotas, mantendo os custos e recompensas normais. Não escolhe relíquias, eventos, caminhos ou evoluções: aguarda o jogador e retoma depois da escolha. Mapas abertos para consulta não são fechados automaticamente. Pausa, mochila, configurações e arraste suspendem a contagem. O controle pode ser desligado durante a luta; painéis de escolha também oferecem Desativar Auto. O modo desliga ao terminar a tentativa ou iniciar outra e não fica salvo para a próxima sessão. Implementado sem execução de testes.
