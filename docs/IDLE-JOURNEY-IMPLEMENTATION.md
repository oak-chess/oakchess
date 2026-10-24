# Jornada Idle — implementação da expansão

Data: 23/10/2026

Foram acrescentadas versões funcionais dos sistemas do plano ao protótipo `prototypes/idle-journey`, sem publicar ou alterar a entrada do jogo principal.

## Entregue

1. Progressão regional com os oito líderes, insígnias, desafios e revanches.
2. Evolução por requisitos, Pokédex de pesquisa e materiais.
3. Formações, prioridades de alvo/golpe, objetivos e recuo.
4. Centro, descanso, amizade, aptidões, títulos e álbum.
5. Atividades da reserva, conservação, ovos e fósseis.
6. Rotas alternativas, pesca/caverna/espíritos, equipamentos de campo, clima, horário e enxames.
7. Missões de NPCs, rival recorrente, Jessie e James, resgates e consequência persistente.
8. Torre, três regras de Liga, desafio de terreno e expedição de cinco etapas.
9. Resumo de batalha, migração local e cópia de segurança do save anterior.

## Decisões de escopo

- Conteúdo e economia são demonstrativos, usando os recursos e o motor existentes.
- Oito líderes têm equipes configuradas e batalha manual. Não há campanha narrativa completa para cada cidade.
- Evoluções são aplicadas às linhas do catálogo nativo. Repetição de sprite não cria uma nova espécie; Eevee pode mudar para uma das três linhas disponíveis.
- Conexão é um material local, sem outro jogador.
- Tarefas são finitas e aguardam recolhimento; não renovam automaticamente nem atribuem o mesmo parceiro a duas atividades.
- Batalhas de eventos e chefes não acionam captura de Pokémon do treinador adversário.
- Offline não vence líderes nem resolve diálogos. Tarefas e incubação avançam até o limite considerado.
- A região resgatada ganha um marcador e uma mudança no boletim; o cenário base completo não foi redesenhado.
- O Centro usa uma cena de sprites e serviços em abas.
- Não foram adicionados IVs, naturezas, moedas premium, rede ou reinício por prestígio.

## Ainda necessário para produção

- Revisão visual e execução de todos os fluxos, inclusive vários tamanhos de tela.
- Equilíbrio de atributos, materiais, probabilidades, duração e economia.
- Maior variedade de equipes, missões, diálogos e cenas por região.
- Entrada própria do modo, substituindo o controlador de demonstração usado no protótipo.
- Política robusta de múltiplas abas e validação aprofundada de saves externos/corrompidos.
- Integração na biblioteca e publicação, mediante autorização.

## Evidência da revisão realizada

`node --check` concluiu sem erros para `idle.js`, `capture.js`, `world-data.js` e `systems.js`. Foram feitas leituras de código e correções de integração, incluindo requisitos de evolução, tarefas indisponíveis, movimentação no desafio de terreno e acesso aos elementos de interface.

O navegador de revisão recusou o protocolo `file:` por sua política de URL. Não foi usado um caminho alternativo para contornar o bloqueio. Portanto, não foi possível confirmar visualmente a tela final nem fazer uma partida completa nesta entrega.

## Reorganização da navegação

Os sistemas não são mais apresentados em uma barra lateral única. Os acessos foram separados por contexto:

- Base: Centro Pokémon, reserva, incubadora e laboratório.
- Equipe: parceiros, formações, Pokédex e álbum; o relatório da última batalha tem acesso próprio pelo painel da equipe.
- Jornada: mapa, preparação da exploração, missões, eventos e desafios.

O mapa apresenta oito pontos compactos e os detalhes de uma região selecionada. As configurações de expedição ficam em sua própria tela. O componente de janela continua compartilhado, mas exibe apenas os serviços do contexto aberto.

## Revisão de equipe, mochila e treinamento

A ficha do parceiro foi unificada no módulo `party.js`. O acesso Equipe e o clique em um parceiro da arena abrem a mesma janela, com busca, filtros (campo, reserva, coleção, atividade) e quatro abas: Resumo, Treinamento, Equipamentos e Evolução.

A organização permite enviar parceiros entre campo/reserva/coleção respeitando vagas e atividades. Equipamentos têm três espaços, descrição dos efeitos, destino explícito e retirada para a mochila.

O treino usa a mesma XP do combate. É possível escolher um doce, cinco, a quantidade para o próximo nível ou todos. A prévia mostra consumo, XP, saldo de doces, nível resultante e crescimento de PS, ataque e poder antes de confirmar. A ficha explica as fontes de XP e separa evolução de aumento de nível.

A nova mochila substitui o painel da partida comum. Suas categorias são Equipamentos, Suprimentos, Evolução e Materiais. Quantidades iguais de equipamentos ficam agrupadas; selecionar um item mostra efeito e parceiro que receberá o item. Doces levam ao treinamento do parceiro correspondente; pedras e conexão mostram estoque e custo de criação.

As janelas antigas permanecem sem acesso no fluxo novo, para preservar compatibilidade com os elementos do motor. O atalho B abre a mochila do idle. As checagens de sintaxe passaram; a revisão visual continua pendente pelo bloqueio de arquivos locais na ferramenta do navegador.

## Implementação do ciclo de caçada

Plano específico: `docs/IDLE-HUNTS-EXPANSION-PLAN.md`.

- O módulo `hunts.js` concentra seleção de área, ondas, suprimentos, loot e registro.
- Bosque, caverna, lago e Torre Pokémon possuem habitantes, requisitos, perfis de XP e loot distintos. O avanço de ondas é manual após três vitórias; o automático repete a onda escolhida.
- A XP regular agora considera os inimigos derrotados, seu custo e nível, o perfil da hunt e o objetivo. Treinador e parceiros sobreviventes ganham XP independentemente. Derrotas podem conceder XP e loot de inimigos efetivamente derrotados.
- Os PS persistem entre encontros e ao sair da batalha. Poções/Revives e descanso na Base permitem recuperação; a automação respeita reservas e limite de Poções.
- As capturas repetidas ficam como indivíduos por padrão, com ID e fator de atributos demonstrativo de 95% a 105%. Conversão automática em doces é uma preferência opcional; conversão manual exige outro parceiro da família e duas ações de confirmação. Favoritos e parceiros em atividade não podem ser convertidos.
- Equipe inclui favoritos, comparação de atributos e identificação individual. A conversão devolve equipamentos à mochila.
- Loot é separado de equipamento e pode ser vendido na Mochila → Materiais. O ouro entra apenas ao vender.
- Mochila → Suprimentos mostra cura, recuperação, compras e automação.
- O registro diferencia moedas, valor de loot, gastos estimados de reposição, XP/h, capturas e derrotados. O custo estimado usa o valor unitário dos recursos; não é uma cobrança adicional nem representa somente as compras da sessão.
- Há especialização elemental (+5% de ataque/poder para o tipo escolhido) e mecanismos demonstrativos distintos nos líderes: armadura, impactos, colunas, regeneração, veneno, drenagem e queimadura. Os detalhes do líder são mostrados no mapa.
- O treino offline acrescenta XP estimada usando um limite conservador do histórico seguro e recolhimento único com o baú; não concede insígnias ou avanço de onda.

Os seis módulos JavaScript passaram pela checagem de sintaxe nesta revisão. Não houve partida completa nem revisão visual nesta etapa; o acesso ao arquivo local já havia sido bloqueado pela ferramenta do navegador. Números e integração continuam sujeitos a validação de execução e equilíbrio.
