# Tutorial do Professor Carvalho — Jornada Idle

## Acesso
O botão do Professor Carvalho fica nos atalhos de coleção, depois do treinador e da Pokédex. O sprite vem de assets/trainer-profile/sprites/oak_normal.png; a conversa usa o retrato local assets/showdown/trainers/oak.png. O guia é exclusivo do protótipo.

Na primeira abertura, o jogador é recebido e pode começar ou fechar para depois. Começar pausa a caçada pelo controlador existente. Reabrir retoma o assunto salvo. O seletor permite consultar qualquer capítulo; fechar não perde progresso. O último capítulo oferece Concluir tutorial.

## Conteúdo
São 23 assuntos: boas-vindas, interface, equipe, formação/sinergias, atributos e qualidade, catálogo de caçadas, ondas e dificuldade, rastreamento e especialização, combate automático, captura normal, shiny, cura e Revive, suprimentos rápidos, Centro/descanso, PC, evolução, mochila, loja e vendas, Pokédex/drops/contratos, Jornada/ginásios, registros, offline e personalização do treinador.

O guia usa as regras existentes do protótipo, incluindo seis parceiros em campo, nove no banco, dez ondas, três vitórias, cura por dez ouro, shiny de 0,0122%, evolução por espécie e ausência de teto de nível. O botão Abrir de cada assunto chama o menu correspondente. Não compra itens, consome suprimentos, escolhe caçadas ou inicia batalhas. Os próprios menus continuam com suas ações e confirmações.

## Apresentação e estado
A explicação é uma conversa sobre a arena, com opção de recolher, voltar e avançar. Ao abrir um sistema, o guia fica compacto. A área correspondente recebe um contorno temporário removido ao trocar ou fechar o assunto. Escape fecha o guia antes de atingir os outros menus. O progresso é salvo em state.tutorial, no mesmo armazenamento isolado da Jornada Idle.

Ao integrar a etapa shiny, foi corrigido o encaminhamento do argumento shiny entre automationUI e captureSystem.renderSettings. O painel de recuperação da automação recebe automaticOnly para não misturar controles manuais.

Arquivos novos: tutorial.js e tutorial.css. Integração no HTML e controlador do protótipo. Nenhum arquivo compartilhado dos outros modos foi alterado. Nenhum teste de combate ou conferência visual no navegador foi executado nesta implementação.

## Revisão de apresentação do diálogo
O guia passa a usar uma caixa de diálogo clara, retrato ampliado e uma explicação por vez, em vez da lista de tópicos simultânea. Cada assunto tem três falas, acessíveis por Continuar, voltar ou pelos pontos de progresso. A posição da fala também é salva. O seletor completo de capítulos fica recolhido no botão Assuntos. Mostrar abre o sistema correspondente e mantém uma versão compacta do diálogo. Conteúdo dos 23 assuntos preservado. Sem conferência visual no navegador nesta revisão.

## Referência de interação: tutorial da campanha
A apresentação foi refeita com base no script tutorial-carvalho-js e no estilo tutorial-carvalho do index.html principal, sem alterá-los. O guia idle agora usa camada escura recortada no alvo, contorno de destaque, bloqueio de cliques fora do alvo nas etapas práticas e diálogo na parte oposta da tela. O retrato e a caixa reproduzem o padrão visual da campanha.

As falas são digitadas gradualmente; clique, Enter ou Espaço completa a fala e depois avança. Movimento reduzido apresenta o texto completo imediatamente. Nas etapas práticas, o guia aguarda o menu correspondente abrir; o botão contextual Abrir oferece acesso direto ao sistema correto e Pular esta etapa permite continuar sem executar a ação. O botão Continuar depois mantém o progresso. Os 23 assuntos e as regras específicas do idle são preservados; não se copiam juros, compra de XP, fusão de cópias nem perda de vida da campanha.

Começar ou retomar pausa a caçada via controlador existente. O guia não retoma a caçada automaticamente. Nenhuma compra, captura, cura ou evolução é executada pelo tutorial. A conferência visual e o fluxo em navegador permanecem pendentes.
