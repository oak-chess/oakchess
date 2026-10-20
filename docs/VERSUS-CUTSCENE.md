# Cutscene versus integrada

Protótipo aprovado: Duelo de treinadores. A abertura agora usa a tela versus real, na campanha e na Torre. Não cria uma arena de demonstração: a apresentação se abre para a arena existente antes de chamar o início normal do combate.

- Destaque escolhido apenas entre unidades do campo e adversários daquela rodada; banco excluído.
- Ordem: estrelas, custo, pontuação de atributos e itens. Empates finais conservam a ordem do time.
- Pontuação: PS + Ataque × velocidade × 10 + Poder × 3 + Def × 5 + D.Esp × 5. A previsão usa o mesmo caminho de atributos com itens da ficha de unidade; não altera o contador de unidades de combate.
- Cores derivadas do primeiro tipo de cada destaque; os dois tipos aparecem na legenda.
- Formas, estrelas e sprites shiny correspondem à unidade selecionada.
- Entradas dos treinadores, aparição dos Pokémon, VS, frase e abertura da arena: aproximadamente 9,25 segundos.
- Clique, botão Pular, Enter, Espaço ou Escape iniciam o combate imediatamente. Conclusão protegida contra chamadas duplicadas.
- Efeitos sintetizados e sons dos Pokémon respeitam silenciamento, volume de efeitos, opção de cries e redução de efeitos do jogo.
- Adversários sem treinador destacam o Pokémon. Preserva a silhueta e o nome desconhecido do encontro secreto.
- Imagens usam os recursos locais existentes, com alternativas de retrato e sprite estático. Erro ao montar a apresentação retorna à tela versus anterior.

Verificação realizada: compilação de sintaxe e revisão de integração. Sem teste de partida ou conferência visual nesta alteração.

## Cartão horizontal

Apresentação centralizada em um cartão de 92% da largura e 58% da altura do palco. A arena real continua visível ao redor, sob escurecimento leve. Tipografia e personagens ajustados para a altura menor; sons, seleção do destaque e opção de pular preservados.

Cartão compacto: 78% da largura e 36% da altura do palco, centralizado por posição absoluta. Geometria também definida na montagem da cena, evitando retorno à tela inteira com CSS antigo em cache. Fontes e VS reduzidos proporcionalmente.

Faixa sobre a arena: barras cinematográficas internas removidas; fundo do overlay transparente, sem escurecimento ou desfoque. Conferência por leitura do DOM na aba do usuário encontrou CSS e JS v=1, explicando por que as reduções publicadas não apareciam na sessão já aberta.

Ajuste local pendente de publicação: faixa com 100% da largura do palco e 36% da altura, sem margens ou molduras laterais. Preserva apenas os filetes superior e inferior. Não enviado ao GitHub a pedido do usuário.

Refinamento local de animação e alinhamento: curvas suaves com aceleração e desaceleração nas extremidades; entradas mais longas e com deslocamento menor; escala do VS reduzida de impacto brusco para aproximação leve; brilho e movimento do fundo suavizados. A faixa abre do centro sem mudar sua geometria. Painéis simétricos com nomes, estrelas e tipos centralizados, sem inclinação; fala centralizada em linha separada, com rodapé recolhido durante a fala. Nós visuais reutilizados por quadro e texto atualizado apenas quando necessário. Compilação de sintaxe realizada; sem testes de partida. Alterações continuam locais, sem publicação.

Ritmo e áudio locais: linha do tempo reproduzida a 1,55× (aproximadamente 5,97 segundos), com eventos visuais, sons e timeout final no mesmo relógio. Efeitos priorizam sequências e amostras de fonte Emerald já embutidas: mugshot, Swift, Vital Throw, Teleport e efeitos por tipo. Amostras são decodificadas e reutilizadas em memória; programas de ondas são renderizados no navegador. Sons sintetizados anteriores permanecem como alternativa se um recurso não estiver pronto. Cries locais continuam via SND.cry. Não são gravações completas da execução original do Emerald. Mudanças não publicadas.

Trilha sonora na cutscene (ajuste local): o controlador de música do jogo inicia o modo battle na entrada do versus, selecionando a trilha existente de batalha comum, selvagem, chefe ou encontro secreto conforme a rodada. A chamada ao entrar no combate usa a mesma chave e o mesmo elemento de áudio, sem reiniciar a faixa. Respeita as opções de música, volume musical e silenciamento. Removidas as chamadas de cries na cutscene; os efeitos de transição continuam separados da trilha. Mantidos os cerca de seis segundos e o alinhamento centralizado. Não publicado.

Ajuste local: botão Pular removido da marcação e seu handler retirado. Ritmo de reprodução aumentado de 1,55× para 1,85×, com aproximadamente cinco segundos de duração (9,25 / 1,85). Cliques na faixa e atalhos de teclado conservam o comportamento anterior. Sem publicação no GitHub.

## Entrada Rocket integrada localmente

Apenas rodadas com G.round.event === rocket usam a sequência aprovada. Duração de 5,2 segundos: aviso em faixa preta; três alertas curtos e tremida moderada da arena; fumaça roxa, R, entrada dos recrutas e até dois destaques reais do time inimigo. O treinador principal corresponde ao adversário da rodada; o acompanhante visual é um recruta Rocket. Não cria inimigos extras. A trilha de batalha existente inicia após o aviso e continua sem reiniciar no combate. Silenciamento, volume de efeitos e redução de movimento respeitados. Nenhum botão de pular; preservados clique e atalhos existentes. Restaura transformação da arena e limpa áudio, quadro de animação e timeout ao concluir ou interromper. Sem publicação ao GitHub. Compilação de sintaxe realizada; visual em partida ainda não conferido.

## Entrada dos chefes (local)

Líderes de ginásio, Elite 4, campeão e andares de chefe da Torre recebem um aviso de aproximadamente 0,85 segundo antes da apresentação: título apropriado, nome e local/andar. Insígnia exibida quando o líder possui uma. A entrada mantém os destaques reais, moldura dourada e maior presença do adversário; duração total aproximada de 4,96 segundos. Música de chefe começa no aviso e continua no combate. A rodada da Torre agora informa boss para o seletor de música manter a mesma faixa ao iniciar a batalha. A Rocket conserva seu aviso e animação próprios. Compilação de sintaxe realizada; sem publicação ao GitHub ou testes de partida.

Torre: apresentação limitada aos chefes (floor % 5 === 4, andares 5, 10, 15…60). Nos demais andares, o callback normal do combate é executado diretamente com a trilha de batalha, sem versus nem aviso. Campanha mantém suas apresentações. Ajuste somente local.
