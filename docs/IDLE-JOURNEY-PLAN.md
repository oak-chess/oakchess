# OakChess — plano completo da Jornada Idle

Data: 23/10/2026 · Status: proposta de desenvolvimento

## 1. Objetivo

Criar um modo idle com a identidade do OakChess: combate em hexágonos, posicionamento, sprites animados, golpes, equipamentos e sinergias. O jogador mantém sua coleção, prepara equipes, escolhe um objetivo e deixa a expedição avançar. Ao retornar, decide como usar os recursos e quais desafios enfrentar.

Ciclo principal: preparar equipe → escolher rota e objetivo → explorar e combater → capturar e receber recursos → treinar/evoluir → desafiar o líder → liberar novas possibilidades.

Este documento reúne as ideias discutidas. A existência de uma ideia neste plano não significa que ela já esteja implementada ou balanceada. A execução e a publicação no jogo principal são etapas posteriores.

## 2. Diretrizes

- Reutilizar o motor e os recursos do OakChess, com painéis próprios para a jornada idle.
- Preservar decisões de formação, sinergia, golpes e equipamento.
- Evitar exigir cliques frequentes para manter a progressão básica.
- Mostrar custos, probabilidades, requisitos, ganhos e motivos de interrupção.
- Não perder coleção, evolução ou equipamentos ao sofrer derrota.
- Chefes, mudanças importantes de rota e escolhas narrativas exigem uma decisão do jogador.
- Manter salvamento separado de Campanha, Torre e Operação Rocket.
- Começar com ouro, XP, Poké Bolas, doces por espécie e materiais com função definida. Novas moedas só entram quando necessárias.
- Não estabelecer prazos antes de fechar o escopo de cada etapa.

## 3. Situação atual

Já existe no protótipo, sem validação completa de execução ou equilíbrio:

- Arena e motor de combate do jogo, preparação e sequência automática.
- Equipe persistente, banco, sinergias e equipamentos.
- XP de parceiros, XP do treinador e três a seis espaços em campo.
- Doces e evolução genérica por nível e ouro.
- Três áreas demonstrativas, com encontros repetíveis.
- Painéis de expedição, equipe, mapa, captura e recompensas offline.
- Captura após vitórias, espécies por área, prioridades, estoque e limites de bolas.
- Doces por repetidos, histórico, coleção e pesquisa de raro garantido.
- Ouro offline, captura offline opcional e simulador de retorno.

Ainda não existem como sistemas completos:

- Progressão por líderes e insígnias; as indicações de próximo chefe são informativas.
- Requisitos de evolução individuais.
- Missões, incubadora, amizade, expedições da reserva e Centro Pokémon.
- Decisões avançadas de comportamento, equipamentos de campo e eventos próprios do modo.

Limitações estruturais: o protótipo usa uma cópia da página principal e adapta a sequência de demonstração. Antes de integrar o modo, será necessário criar uma entrada própria e um controlador explícito de expedições. Os valores atuais são experimentais.

## 4. Organização dos painéis

### Tela de exploração

- Arena ao centro; sinergias à esquerda; progresso e próximo marco no topo.
- Banco para reservas e formação.
- Painel inferior: área, estado da expedição, ouro, nível do treinador, vagas e explorar/pausar.
- Acessos: Equipe, Captura, Jornada, Mochila e Recompensas.
- Durante o combate, esconder opções que exigem preparação; permitir consultar coleção, capturas e relatórios.

### Equipe e parceiro

- Coleção pesquisável, filtros por tipo, função, nível e atividade.
- Seleção de formação, reservas e equipes salvas.
- Detalhe do parceiro: XP, doces, amizade, golpes, aptidões e equipamentos.
- Evolução com requisitos e previsão do resultado.
- Identificação clara de parceiro em campo, descansando ou em expedição secundária.

### Captura

- Habitantes da área: raridade, descoberta, coleção e favoritos.
- Automação: prioridades, tipo de bola, reserva e orçamento.
- Histórico: capturas, fugas, doces e motivos para não tentar.
- Pesquisa de raros com progresso persistente e regra de garantia visível.

### Jornada

- Mapa, requisitos, líderes, insígnias, ramificações e atividades disponíveis.
- Escolha de objetivo da expedição e rota de recuo.
- Clima, horário, enxames e bônus atuais.

### Centro Pokémon e recompensas

- Centro Pokémon como base de administração, com parceiros no cenário.
- Áreas da base: descanso, incubadora, conservação, laboratório e quadro de missões.
- Resumo de retorno: tempo considerado, recursos, capturas, atividades concluídas e limites atingidos.
- Evitar criar um painel permanentemente aberto para cada sistema.

## 5. Etapas de desenvolvimento

### Etapa 0 — Consolidar o protótipo

Dependência: nenhuma. Prioridade: imediata.

- Remover controles e textos herdados que não correspondem ao modo.
- Garantir consistência entre slots liberados, nível, XP, coleção e banco.
- Estabelecer estados explícitos: preparação, explorando, resultado, descanso e desafio.
- Centralizar regras de recompensa, captura, equipamentos e progressão.
- Definir um salvamento versionado, com migração e recuperação sem duplicar recompensas.
- Resolver pausa, retorno de aba, encerramento, expedição interrompida e saldo de recursos.
- Documentar o que é ganho online e offline.
- Planejar a substituição da cópia do HTML e do uso do controlador de demonstração antes da integração definitiva.

Critério de conclusão: o ciclo preparar → explorar → parar → salvar → retornar mantém a equipe e os recursos coerentes; os painéis exibem suas funções reais.

### Etapa 1 — Jornada, líderes e insígnias

Dependência: etapa 0. Primeira entrega jogável: Viridian e Brock.

- Separar rotas selvagens de cidades e arenas de líderes.
- Usar progresso da região para liberar a tentativa de chefe.
- Painel de desafio: líder, equipe adversária, condições e recompensas.
- Desafio iniciado pelo jogador, com repetição disponível após derrota.
- Vitória concede insígnia uma única vez e libera a próxima região.
- Completar Pewter antes de expandir para Misty e os demais líderes de Kanto.
- Missões de exploração iniciais: descobrir espécies e vencer com determinada composição.
- Mostrar objetivos alcançáveis mesmo quando a equipe ainda não consegue vencer o chefe.

Critério de conclusão: uma jornada vai da primeira rota à primeira insígnia e ao desbloqueio seguinte, sem a progressão depender apenas de um contador global de vitórias.

### Etapa 2 — Captura, evolução e Pokédex de pesquisa

Dependência: etapas 0–1.

- Consolidar captura por habitat, probabilidades, automação e pesquisa de raros.
- Corrigir limites de coleção, favoritos, orçamento e envio de parceiros ao banco.
- Pokédex própria do modo, reutilizando catálogo, sprites e dados do jogo.
- Registrar visto, capturado, evoluído, habitat e objetivos de pesquisa.
- Pesquisa concede recompensas por marcos; não concede poder ilimitado por repetição.
- Evoluções por nível, pedra, amizade e troca adaptada.
- Para troca, oferecer uma atividade ou item de conexão local, sem exigir outro jogador.
- Definir tratamento de espécies com ramificações e evoluções especiais.
- Exibir os requisitos antes de consumir materiais.
- Coleção mantém a espécie descoberta; repetidos continuam úteis como doces.

Critério de conclusão: é possível procurar uma espécie, capturá-la, pesquisar seu habitat e evoluí-la por uma regra identificável.

### Etapa 3 — Formações salvas e comportamento dos parceiros

Dependência: etapas 1–2.

- Formações salvas para chefes, captura e treinamento: membros, posições, equipamentos e objetivo.
- Validar parceiros indisponíveis, vagas, equipamentos em uso e posições ao carregar uma formação.
- Comportamentos configuráveis: proteger, buscar inimigos próximos ou atacar a retaguarda, respeitando alcance e mobilidade.
- Golpe preferido entre os golpes aprendidos, respeitando energia, intervalo e condições de uso.
- Não garantir que uma ordem impossível será executada; indicar alternativa usada pelo parceiro.
- Desafios de formação com posições bloqueadas e condições de terreno.
- Relatório com dano, suporte, efeitos e motivos de derrota, reaproveitando o relatório do jogo.
- Recuo automático configurável após derrotas consecutivas, para uma rota segura escolhida.
- Objetivo de expedição: XP, espécies ou materiais. Cada objetivo altera recompensas/ações de forma explícita e com contrapartida.

Critério de conclusão: mudar formação e prioridades modifica o comportamento da equipe de maneira compreensível, sem remover as decisões estratégicas do tabuleiro.

### Etapa 4 — Centro Pokémon, amizade e coleção viva

Dependência: etapas 2–3.

- Centro Pokémon como base visual: parceiros no cenário e acessos aos serviços.
- Descanso e recuperação. Se houver energia persistente, oferecer recuperação automática e alternativas de equipe, sem bloquear toda a jornada por espera.
- Amizade por participação e atividades, com benefícios pequenos e requisitos de evolução.
- Títulos de parceiros por conquistas específicas; cosméticos por padrão.
- Álbum com primeiras capturas, evoluções, insígnias e momentos de exploração.
- Aptidões individuais para batalha, captura ou exploração; evitar gerar parceiros inutilizáveis ou exigir substituição contínua por atributos raros.
- Estabelecer se aptidões podem ser treinadas antes de adicionar variação aleatória.

Critério de conclusão: a base concentra a administração e o jogador reconhece os parceiros por sua trajetória, sem precisar abrir muitos painéis repetidos.

### Etapa 5 — Reserva ativa, ovos, conservação e fósseis

Dependência: etapas 2 e 4.

- Expedições secundárias para parceiros da reserva: materiais, pesquisa ou treino.
- Centro de conservação: atribuir especialidades a tarefas com produção limitada.
- Usar o mesmo sistema de atribuição para conservação e expedições; evitar atividades duplicadas com nomes diferentes.
- Parceiro não pode estar em combate e em tarefa secundária ao mesmo tempo.
- Ovos recebidos em exploração e missões; incubação pelo progresso em atividades.
- Mostrar origem, progresso e informações de espécie conforme a regra definida.
- Fósseis encontrados em áreas apropriadas, restaurados no laboratório após reunir partes.
- Filas e resumo de conclusão; respeitar a janela offline.

Critério de conclusão: reservas e atividades secundárias têm utilidade própria e não exigem recolhimento constante para continuar.

### Etapa 6 — Exploração ampliada e mundo dinâmico

Dependência: etapas 1–2; parte visual depende da etapa 4.

- Clima e horário afetam encontros e condições de combate; exibir efeitos antes de partir.
- Enxames aumentam temporariamente a presença de espécies, com recorrência e forma de descobrir sua próxima ocorrência.
- Rastros conduzem a espécies raras usando a mesma infraestrutura de pesquisa, sem adicionar uma segunda garantia conflitante.
- Pesca e cavernas abrem habitats próprios.
- Itens de campo: vara de pescar, bicicleta e Silph Scope liberam atividades ou caminhos.
- Rotas alternativas com escolhas explícitas de risco, encontros e recompensa.
- Boletim regional reúne enxames, clima, pedidos de moradores e atividade Rocket.
- Horários não devem tornar uma espécie permanentemente inacessível à rotina do jogador; prever alternativa de pesquisa ou evento recorrente.

Critério de conclusão: escolher onde e quando explorar tem consequências visíveis, com informação suficiente para planejar.

### Etapa 7 — NPCs, rivais e eventos Rocket

Dependência: etapas 1, 3 e 6.

- Pedidos de NPCs: localizar espécies, entregar materiais ou resolver encontros locais.
- Rivais recorrentes crescem com a jornada, sem copiar automaticamente a força exata do jogador.
- Interceptações Rocket durante a exploração, com aviso e condições de resolução.
- Jessie e James como encontros especiais, com diálogos e recompensas próprias.
- Resgates de Pokémon e moradores, sem captura de Pokémon pertencentes a outros treinadores.
- Consequências visuais e narrativas persistentes na região após certos resgates.
- Reutilizar sprites, diálogos, cutscenes e arenas existentes quando compatíveis.
- Não transferir nem alterar o progresso salvo da Operação Rocket do jogo principal.
- Cenas únicas podem aguardar o jogador; repetições conhecidas precisam de opção de avanço rápido.

Critério de conclusão: eventos acrescentam variedade sem interromper toda expedição com diálogos repetidos ou escolhas automáticas irreversíveis.

### Etapa 8 — Desafios opcionais e continuidade

Dependência: etapas 1–3 e economia consolidada.

- Torre de treinamento: medir até onde uma composição chega, sem perda da coleção.
- Liga com regras especiais: limite de equipe, tipos e equipamentos permitidos.
- Revanche dos líderes com novas formações e estratégias, além de aumento de atributos.
- Expedição longa com desgaste, pontos de descanso e decisão de continuar ou retornar.
- Recompensas de domínio: títulos, registros, visuais e recursos com limites definidos.
- Reutilizar a infraestrutura da Torre existente sem misturar seus salvamentos ou assumir que suas regras servem integralmente ao idle.

Critério de conclusão: existe conteúdo para equipes avançadas sem tornar obrigatória uma rotina de tarefas para manter o progresso básico.

### Etapa 9 — Equilíbrio, acabamento e integração

Dependência: cada etapa anterior deve fechar seu escopo antes de ampliar o conteúdo correspondente.

- Definir curvas de ouro, XP, doces, materiais, equipamentos e dificuldade.
- Equilibrar capturas novas, repetidos, reserva de bolas e garantias de raros.
- Estabelecer retornos offline por atividade, com limite inicial de oito horas e resumo auditável pelo jogador.
- Impedir repetição da mesma recompensa ao recarregar, recolher ou concluir um evento.
- Tratar relógio retrocedendo, janela muito longa e múltiplas abas de forma consistente.
- Ajustar menus, foco de teclado, textos, ícones, contraste, sons e opções de reduzir flashes/movimento.
- Trocar o acoplamento ao modo demonstrativo por uma entrada própria, compartilhando o motor do jogo.
- Criar cartão Jornada Idle na tela inicial quando houver um recorte estável e revisado.
- Manter jogos salvos separados; não migrar campanha para idle automaticamente.
- Publicar apenas mediante autorização específica.

Critério de conclusão: o modo possui fluxo completo, separação de saves, interface coerente e critérios de revisão atendidos no escopo entregue.

## 6. Regras comuns de automação e offline

| Atividade | Online | Offline planejado |
|---|---|---|
| Exploração de rota já segura | Combate e progresso normal | Recursos estimados dentro do limite |
| Captura comum/incomum | Após vitórias, seguindo filtros | Opcional, respeitando bolas e orçamento |
| Pesquisa de raros | Avança em vitórias válidas | Inicialmente não avança |
| Chefes, insígnias e escolhas | Decisão do jogador | Não conclui automaticamente |
| Incubação | Progresso por atividade | Progresso limitado à atividade elegível |
| Tarefas da reserva | Progresso por duração/atividade | Até o limite do período |
| Eventos narrativos únicos | Apresentar ao jogador | Registrar descoberta e aguardar retorno |
| Equipamentos e formação | Organizados pelo jogador | Não trocar silenciosamente |

O cálculo offline será estimado; não é necessário simular cada combate completo. As regras precisam produzir um resumo compreensível e impedir recompensas repetidas. Capturas raras offline podem ser reavaliadas depois do equilíbrio inicial.

## 7. Dependências técnicas e dados

- Modo: controlador de estados, motor compartilhado e ponto de entrada próprio.
- Salvamento: versão, coleção, equipes, progressão regional, atividades e recibos de recompensas.
- Parceiro: espécie, evolução, XP, doces, amizade, aptidão, itens e atividade atual.
- Região: habitats, probabilidades, progresso, chefe, insígnia, condições e desbloqueios.
- Captura: estoque, filtros, orçamento, favoritos, pesquisa e histórico.
- Atividade: duração, participantes, requisito, recompensa e estado de recolhimento.
- Narrativa: identificador único, escolhas, consequências e marca de recompensa recebida.
- Interface: componentes compartilhados de janela, lista, progresso e resumo de recursos.

A coleção deve ter identidade própria e limites independentes dos seis espaços em campo e do banco. A representação de evolução por estrelas do motor atual precisa ser separada dos níveis persistentes e da identidade da espécie no save.

## 8. Economia e decisões ainda abertas

- Ouro: suprimentos e serviços, evitando custo para toda interação básica.
- XP de treinador: desbloqueios e vagas; XP de parceiro: crescimento individual.
- Doces: treino e requisitos específicos; origem em repetidos e atividades definidas.
- Materiais: somente quando houver uso concreto em evolução, equipamento ou exploração.
- Insígnias: desbloqueios permanentes, sem consumo.

Antes de cada sistema, fechar:

1. Qual decisão ele acrescenta?
2. De onde vem e onde é usado seu recurso?
3. Como funciona para um jogador que ficou dias sem entrar?
4. O que acontece ao faltar espaço, estoque ou parceiro disponível?
5. Quais ações exigem confirmação?
6. Qual informação o painel precisa mostrar?

Deixar para avaliação posterior: IVs, naturezas, moedas adicionais, prestígio/reset de coleção e novos atributos aleatórios. Não foram aprovados como requisitos da primeira versão.

## 9. Marcos de entrega

| Marco | Conteúdo | Resultado |
|---|---|---|
| A — Base estável | Etapa 0 | Expedição e salvamento coerentes |
| B — Primeira jornada | Etapas 1–2, recorte Viridian/Pewter | Captura, evolução e primeira insígnia |
| C — Estratégia | Etapa 3 | Formações, comportamentos e objetivos |
| D — Coleção viva | Etapas 4–5 | Centro, amizade, reservas, ovos e fósseis |
| E — Região viva | Etapas 6–7 | Exploração dinâmica, NPCs e Rocket |
| F — Longa duração | Etapa 8 | Desafios avançados e revanches |
| G — Integração | Etapa 9 | Jornada Idle disponível no jogo principal |

O acabamento e o equilíbrio acontecem em cada marco, além da revisão final. Não é necessário construir todo Kanto antes de fechar o primeiro percurso completo.

## 10. Critérios de revisão propostos

Esta seção define trabalho futuro; nenhum teste foi executado para produzir este plano. A execução de testes deve ser solicitada antes de rodá-los.

- Revisão visual em telas largas e pequenas, com menus sem sobreposição e sem controles antigos.
- Fluxo inicial com poucos recursos e fluxo avançado com coleção grande.
- Pausar, reorganizar, equipar, retomar, vencer, perder e trocar de rota.
- Captura sem bolas, reserva atingida, limite atingido, raro garantido e banco cheio.
- Insígnias e recompensas únicas após recarregar.
- Offline sem recursos suficientes, durante atividade, com relógio alterado e após retorno longo.
- Formação salva com membro indisponível ou item movido.
- Convivência com saves de Campanha, Torre e Rocket.

## 11. Próxima execução recomendada

Concluir a etapa 0 e construir a etapa 1 como um percurso fechado: Floresta de Viridian → preparação contra Brock → vitória e insígnia → desbloqueio de Cerulean. Esse percurso será a referência para expandir os outros sistemas e regiões.
