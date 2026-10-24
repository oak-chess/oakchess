# Plano de consolidação e expansão — Jornada Idle

## Objetivo
Concluir o ciclo escolher caçada → lutar → recuperar → capturar → vender → melhorar a equipe, preservando a arena, o combate e a paleta Rocket.

## Etapas de implementação
1. **Caçadas e progressão:** guardar a onda de cada área, permitir foco de espécie, tornar as probabilidades de encontro explícitas, manter recuperação e limites de suprimentos.
2. **Objetivos de caça:** contratos com progresso por inimigo derrotado, recompensas manuais protegidas contra recolhimento duplicado e chefes opcionais ao concluir a onda 10.
3. **Pokédex regional:** espécies vistas, capturas individuais, derrotados, habitats e atalho para rastrear uma espécie disponível na caçada atual.
4. **Equipe e economia:** XP, PS e próxima evolução visíveis no resumo; recuperação manual acessível; compra de equipamentos com preço e efeito explícitos; reserva e equipamentos preservados.
5. **Offline:** relatório separado de tempo considerado, ouro e XP pendentes, capturas e bolas consumidas. Treino offline não simula batalhas nem consome cura; captura offline continua opcional e usa bolas.
6. **Interface:** acessos contextuais em Caçadas, Pokémon e Recompensas; nenhum novo painel permanente na arena. Listas em grade e conteúdo com altura limitada.

## Critérios e limites
- Alterações restritas ao protótipo e assets associados. Não publicar no GitHub nesta tarefa.
- Preservar saves existentes e criar cópia antes da expansão.
- Não inflar níveis para corrigir evolução: preservar a curva e usar os requisitos cadastrados por espécie.
- Raros devem poder surgir normalmente; a pesquisa continua garantindo um encontro raro após oito vitórias.
- Uma espécie rastreada recebe peso maior, sem captura garantida.
- Chefes e contratos não interrompem as caçadas automáticas.
- Valores são uma primeira proposta de balanceamento, não equilíbrio definitivo. Sem execução de testes ou validação visual nesta tarefa.

## Organização dos acessos
- **Caçadas:** área, espécie-alvo, ondas, contratos e chefe da rota.
- **Pokémon:** equipe e Pokédex regional.
- **Mochila:** uso e configuração dos itens.
- **Loja:** compras e vendas.
- **Recompensas:** relatório offline e recolhimento.

## Entrega desta revisão

| Etapa | Resultado implementado |
|---|---|
| Caçadas | Onda persistida por região e modalidade, seletor de espécie-alvo e encontro normal de raros corrigido |
| Contratos | Um contrato ativo; contagem por inimigo derrotado, abandono e recompensa manual única |
| Chefes de rota | Liberados após 3 vitórias na onda 10; desafio manual e recompensa de primeira vitória por região/modalidade |
| Pokédex | Consulta por região, avistamentos ao entrar em combate, capturas, derrotas, indivíduos mantidos e rastreamento contextual |
| Equipe | XP e próxima evolução no resumo; Poção/Revive manual na ficha; comparação e reserva existentes preservadas |
| Economia | Quatro ofertas de equipamentos reais do OakChess; compra única de cada oferta por região e venda separada |
| Captura | Probabilidade por tentativa e peso de encontro visíveis; prioridade e rastreamento não apresentados como garantia |
| Offline | Recibo próprio com tempo limitado, ouro/XP pendentes, capturas e bolas gastas; sem consumo de cura simulado |
| Interface | Acessos contextuais, grades e listas com rolagem interna; HUD principal não recebeu novas mensagens |

### Compatibilidade
Cópia do save anterior em `journey-native-v2-before-consolidation`, dentro do armazenamento isolado do protótipo. Registros antigos não têm contadores históricos de todos os nocautes e capturas: a Pokédex usa os indivíduos existentes como mínimo conhecido e registra novos eventos a partir desta revisão.

### Avaliação ainda necessária
Foi feita revisão de integração e checagem de sintaxe. Não foram executados testes nem houve validação visual em navegador. Dificuldade, tempo de progressão e preços são uma proposta inicial; não é possível afirmar que estejam equilibrados sem sessões de jogo. As regras anteriores de evolução por rank continuam substituídas pelos requisitos por espécie. O relatório offline não equivale a uma simulação completa de combate offline.
