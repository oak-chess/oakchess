# Centro e arena: treinador no modo idle

O módulo trainer.js adiciona o avatar do jogador ao lado do banco, usando o personagem e o nome do perfil existente. O botão Meu treinador fica imediatamente depois da Pokédex e abre a personalização existente. Trocas no perfil atualizam o avatar; no Centro ele ocupa um ponto de circulação próximo à entrada.

A captura usa a mão do avatar como origem do arco da bola e aciona a pose de lançamento disponível para Red e Leaf. Os outros personagens mantêm seu sprite escolhido e fazem um gesto curto. Movimento reduzido elimina o gesto e encurta o efeito de retorno.

O módulo implementa a interface TRAINER_RECALL isolada do protótipo, pois o módulo compartilhado de recolhimento ignora páginas em prototypes. A função nativa die continua responsável por marcar o nocaute. Para aliados, o efeito visual recolhe o Pokémon por um feixe até a bola do treinador, oculta a unidade derrotada e conclui antes da reconstrução do próximo encontro. O resultado e a condição de desmaio permanecem sob controle do combate. Inimigos mantêm o efeito existente. A captura e os retornos são aguardados em conjunto antes de reconstruir a arena.

As alterações ficam nos arquivos do protótipo; nenhum módulo compartilhado foi alterado. Sem teste de combate ou conferência visual no navegador nesta implementação.

## Posição da campanha e torre
A posição do treinador idle foi alinhada ao módulo compartilhado assets/trainer-recall.js: âncora nativa x=345, y=590, escala 3,75 (altura 120 px), quadro 2 espelhado horizontalmente. O gesto mantém o espelhamento. O Centro conserva sua posição de circulação específica. Nenhum arquivo compartilhado foi modificado.

## Sincronização de lançamento e nocaute
O gesto usa uma sequência de quadros 3 → 4 → 5 → 4 → 3 da folha de ação de Red/Leaf, com preparação e liberação. A bola começa o voo após 300 ms de preparação e a transição de encontro espera os 2600 ms do efeito completo. Uma falha na pose não impede a execução do efeito de captura.

O die da cópia HTML do protótipo chama explicitamente IDLE_TRAINER.recall, com proteção de erro e sem alterar o HTML principal. Há também uma reconciliação dos aliados derrotados ao concluir o combate, antes de reconstruir a equipe. O retorno dura 1350 ms (650 ms em movimento reduzido), com brilho na mão e feixe. O próximo encontro continua aguardando os retornos pendentes.

Sem confirmação em navegador ou teste de combate nesta revisão.

## Causa corrigida: contêiner de unidade sem tamanho
O motor define .unit com width:0 e height:0. O recolhimento anterior chamava point(u.el), que rejeitava essa caixa e retornava false antes de criar a animação. Esse caminho foi substituído por bodySnapshot, usando o canvas PMD ou a imagem interna e os limites do corpo, como no recolhimento da campanha.

O ponto do efeito é obtido do retângulo do corpo renderizado, convertido para o palco. Quando indisponível, unitPoint projeta as coordenadas nativas u.x/u.y através de um marcador temporário dentro de arenaView. Não depende do tamanho do contêiner nem da unidade continuar visível. O hook direto de die aciona o retorno no momento do nocaute. A mesma projeção é usada pelo alvo da captura, eliminando a posição genérica por falha de medição.

A causa foi identificada no código; sem execução de teste no navegador nesta revisão.

## Renderizador de campanha reutilizado
O efeito DOM anterior foi removido. A função drawJob do módulo compartilhado assets/trainer-recall.js foi incorporada sem alterações à integração idle: mesma imagem rosa, feixes de três espessuras, curva de encolhimento, brilho final e duração total de 2,5 s. A projeção para coordenadas nativas usa toWorld, como a campanha. O treinador é desenhado pelo TRAINER_DUO no canvas de primeiro plano, no mesmo ponto (345,590), em vez de uma segunda implementação em CSS. O hook de die e a espera pelas animações continuam isolados no protótipo.

Durante captura, os quadros de ação 3,4,5,4 são desenhados diretamente no mesmo canvas, com a bola saindo aos 400 ms. Red e Leaf usam folhas de ação reais. Personagens sem folha de ação própria mantêm o escolhido e o gesto de corpo. O companheiro do perfil permanece desenhado na lateral durante o lançamento. A sequência de captura agora dura 2700 ms. Não foi feita execução de combate no navegador nesta alteração.

## Painel do Pokémon ao passar o mouse
O tooltip da arena agora separa identidade, progressão, atributos e habilidades. Mostra nível real, XP, energia, Nature, potência e talento dos membros da equipe. A previsão fora da luta usa a escala do nível e os modificadores individuais pelo mesmo método aplicado à unidade no combate. Durante a luta mantém os atributos vivos, PS, mana e recargas. O custo de compra da campanha foi ocultado; alcance, defesa especial e ataques por segundo têm rótulos explícitos. Estilo restrito ao protótipo idle. Sem execução de testes ou validação visual nesta alteração.

## Evento Rocket no idle
Jessie e James passam a integrar a fila única de eventos, com intervalo de 45 minutos. Interceptações Rocket já geradas pela jornada também entram no cartão quando não há outro evento ativo. O desafio usa Ekans, Koffing e Meowth, a arena nativa Rocket e os sprites originais da dupla (`rocket-duo/*-color.png`). O render replica o layout lateral e os quadros usados pelo modo Rocket. Os inimigos derrotados usam o mesmo recolhimento da campanha: Ekans para Jessie, Koffing/Meowth para James. A fila de recolhimentos é aguardada antes da reconstrução da arena. Vitória mantém as recompensas de resgate existentes; equipamentos seguem exclusivos dos lendários. Mew usa a arena Mewtwo; as três aves usam suas arenas próprias. Sem testes executados nesta alteração.

## Aviso de chegada dos eventos
Ao aparecer um evento, o card recebe um destaque animado e a tela mostra uma notificação com sprite, nome, botão Ver evento e fechar. O som usa o sistema do jogo e respeita suas configurações. A notificação desaparece após oito segundos; o card continua disponível. A marca notifiedAt é salva no evento para evitar repetição a cada segundo ou recarga. Em aba oculta o aviso aguarda o retorno. Não inicia combate nem interrompe a luta. Movimento reduzido troca a animação por contorno estático. Sem testes executados.

## Entrada dos visitantes sem avisos duplicados
A chegada agora oculta temporariamente o card persistente: o sprite do lendário cruza o topo da tela em primeiro plano enquanto uma notificação sem retrato duplicado é revelada atrás. Jessie e James usam sua dupla de sprites na mesma travessia. Após 7,5 segundos, fechar ou Ver desafio, a apresentação sai e o card retorna. Movimento reduzido mostra apenas a notificação estática. Chance de equipamento permanece 1% por vitória lendária. Sem testes executados.

## Janela de um minuto para aceitar
O card disponível agora mostra apenas nome, contagem regressiva e Enfrentar, sem botão de dispensa ou texto de drop. Cada evento salva expiresAt de 60 segundos; recarregar não reinicia o prazo. Ao expirar sem combate iniciado, o evento sai e entra o grupo seguinte (aves → Rocket → psíquicos), sem sobreposição. Uma batalha aceita não é encerrada pelo prazo. A apresentação de chegada informa o limite de um minuto. Sem testes executados.

## Correção do intervalo após expirar
O prazo de 60 segundos é apenas para aceitar. Expiração e vitória reiniciam os relógios completos (aves 30 minutos, Rocket 45 minutos, Mew/Mewtwo 60 minutos), sem ativar imediatamente outro grupo. A migração scheduleVersion 2 limpa os prazos forçados pela implementação anterior. Eventos Rocket por quantidade de vitórias não antecipam mais o cartão cronometrado. O painel disponível passa a uma linha com sprite, nome/tempo e Enfrentar, mais barra inferior; títulos e legendas repetidos ficam ocultos. Sem testes executados.

## Cenário Rocket sem sobreposição
O cenário aprovado Rocket e os efeitos da floresta podiam ficar ativos ao mesmo tempo: a ativação de Viridian dependia somente do tema anterior. Agora Viridian só recebe active quando não há outra arena aprovada. O desafio Rocket também define um tema explícito antes de pintar, evitando conservar clima/tema da caçada anterior. Sem testes executados.
