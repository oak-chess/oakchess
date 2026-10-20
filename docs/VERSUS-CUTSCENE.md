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
