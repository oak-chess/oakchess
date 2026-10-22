# Operação Rocket — Celadon

## Estrutura

- 50 etapas em dez setores de cinco; Giovanni na etapa 50.
- Três iniciais entre Bulbasaur, Charmander, Squirtle, Voltorb, Gastly e Machop.
- Início: 100 vida, 10 ouro, quatro vagas; banco normal.
- Cada setor oferece patrulha/celas, eventos especiais, combate, abrigo/evento e contrabandista. O último setor reserva loja na etapa 49 e Giovanni na 50.
- Os nove eventos especiais são embaralhados uma vez por tentativa e distribuídos sem repetição em salas consecutivas. Todos são oferecidos ao longo do mapa; a escolha de caminho determina quais serão visitados.
- Rotas e ofertas são persistidas. O mapa mantém cinco etapas visíveis e dez setores no indicador.
- Preparação sem cronômetro, visualização do tabuleiro real com V.

## Eventos especiais

| Evento | Regras |
| --- | --- |
| Laboratório Rocket | Resgate de um Pokémon com duas estrelas ou duas cópias de um equipamento escolhido. Espécie e ofertas persistem. |
| Funcionário disfarçado | Duas vitórias de escolta rendem um cartão e acesso ampliado aos terminais. Revela próximas lojas. Derrotas não reiniciam a escolta. |
| Comboio | Combate reforçado: 10 ouro e 3 XP. Escolha um entre três presos; os demais são protegidos. |
| Arquivo de pesquisas | Escolha uma linha da equipe. Uma oferta básica garantida em cada uma das próximas três visitas à loja, inclusive renovações, enquanto houver estoque. Pesquisa nova substitui a anterior. |
| Sala de treinamento | +6 XP ou uma cópia básica de uma linha da equipe. |
| Armadilha | Pagar 4 ouro ou +1 alerta e combate contra guardas. Vitória: 6 ouro e 2 XP. |
| Mercado clandestino | Uma compra de cópia básica de aliado por custo normal +3 ouro. Exige estoque e vaga ou fusão imediata. |
| Depósito trancado | Consumir um cartão ou arrombar com +2 alerta. Escolher equipamento especial. |
| Comunicação interceptada | Revela três etapas futuras e permite evitar uma patrulha comum sem recompensa. Uma oportunidade armazenada; não evita oficiais nem Giovanni. |

Não há perseguidor recorrente ou adversário adaptado à composição.

## Regras compartilhadas

- Terminais: −2 alerta, copiar um cartão, ou equipamento. Após escolta: redução de 3.
- Abrigo: +5 vida, −1 alerta ou +12% de ataque e vida na próxima batalha.
- Patrulha: 6 ouro e 2 XP; celas: 5 ouro, 2 XP e resgate; oficial: 9 ouro, 2 XP e equipamento.
- Derrota causa dano normal, mantém o encontro e não entrega recursos. Primeira derrota de cada etapa aumenta alerta em 1.
- Alertas 2/3 trazem reforços/oficiais; 4 gera emboscada anunciada e volta a 2 ao entrar.
- Resgates e cópias gratuitas contam como vistos. Compras registram; evoluções propagam o comprovante de compra.
- Banco cheio permite organizar a equipe e voltar ao evento. Nenhuma compra é cobrada antes de haver vaga ou fusão.
- Escolhas, submenus, prisioneiros, cartões, escolta, pesquisas e recompensas ficam no salvamento. Recarregar não sorteia novamente uma recompensa já apresentada.
- Extração a cada setor encerrado, exceto após Giovanni. Salvar e sair permite retomar; extrair encerra a tentativa.

## Persistência e migração

Chaves: oakchess_rocket_operation_v1; sufixos _records e _progress.

layoutVersion 3 identifica o mapa de 50 etapas. Saves de dez ou 25 etapas mantêm equipe, inventário, dinheiro, vida e histórico; encontros em andamento são preservados. Se estavam diante do antigo Giovanni, voltam ao mapa no mesmo índice e seguem os novos caminhos. Tentativas encerradas mantêm o total antigo nos resultados.

Os frascos são contados pelos itens da mochila; o contador dinâmico é recriado ao carregar.

## Organização dos arquivos

- assets/rocket-operation.js: fluxo da operação, combate, salvamento e interface principal.
- assets/rocket-operation-events.js: definições, geração dos caminhos e nove eventos novos.
- assets/rocket-operation.css: identidade Rocket e layouts responsivos.
- assets/music/ROCKET-SOURCES.md: fontes das três trilhas.
- assets/team-view.js: consulta ao tabuleiro real.

Implementação preparada sem execução de testes de jogo ou conferência visual no navegador. O equilíbrio de uma partida completa de 50 etapas ainda precisa ser avaliado jogando.
