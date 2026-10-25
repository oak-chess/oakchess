# Desafios e torre de treinamento

A seção Jornada → Desafios tem quatro categorias: Torre de treinamento, Regras especiais, Expedição longa e Revanche. Os desafios existentes mantêm requisitos e recompensas; seus cards mostram a restrição e o motivo de bloqueio sem repetir a mesma frase no botão.

## Torre

- Andar seguinte, total concluído e caminho de cinco andares visíveis.
- A torre usa as 370 espécies comuns do elenco atual, incluindo formas evoluídas e espécies adicionais já jogáveis. Lendários e míticos são excluídos pelos metadados da espécie. O catálogo é montado a partir do elenco, sem uma lista fixa de 32 espécies.
- Uma espécie central determina o tema de tipo do andar. Os companheiros favorecem esse tipo e famílias diferentes; quando necessário, o grupo é completado com outras espécies elegíveis. A seleção é determinística por andar e não muda ao recarregar.
- Os requisitos numéricos das evoluções são respeitados, inclusive os estágios anteriores da família. Evoluções por pedra, amizade ou troca têm uma liberação de torre adaptada ao nível 20; espécies de custo 3 entram a partir do nível 10 e as de custo 4/5 a partir do nível 20. Shedinja exige nível 20. Esses limites organizam a dificuldade da torre e não alteram os requisitos de evolução do jogador.
- A rotação principal percorre todo o catálogo. Espécies ainda inadequadas ao nível do andar são substituídas por elegíveis e entram nas próximas rotações; o teste de duas rotações completas confirma cobertura das 370 espécies.
- Três adversários por andar normal; um quarto adversário guardião a cada cinco andares. A prévia e a batalha usam a mesma definição.
- Nível adaptado ao Idle: 3 + 2 × andar. Escala normal: 1 + (nível − 1) × 0,12; guardiões têm multiplicador adicional de 1,15.
- Recompensa: 20 + 5 × andar em ouro. Guardiões concedem mais 5 materiais e 5 Poké Bolas, uma única vez por marco.
- Somente o próximo andar pode ser iniciado. Vitórias salvam o avanço; derrotas preservam o melhor andar. Interrupções não contam como vitória.
- O valor salvo de towerBest é preservado. Não há pagamento retroativo dos novos marcos para andares já concluídos antes desta atualização.

## Verificação

O verificador de regras cobre 160 andares e duas rotações de todo o catálogo, presença das 370 espécies, exclusão de lendários/míticos, requisitos de nível, ausência de espécies repetidas no mesmo grupo, determinismo, recompensas, marcos, progressão antiga, derrotas, bloqueio de andares fora da sequência e recolhimento único. O teste em navegador verifica categorias, navegação de ida e volta, bloqueios, controles visíveis, prévia de guardião e início do combate do andar 5 com os quatro adversários exibidos.

Arquivos: modes/idle/challenges.js e challenges.css; integração em systems.js. Testes: scripts/check-idle-challenges.cjs e scripts/check-idle-challenges-browser.cjs.

## Avanço automático

A opção Continuar após vencer é salva como preferência. O jogador inicia a subida explicitamente; cada vitória agenda o próximo andar com o intervalo existente entre batalhas. A recuperação usa os itens e regras da Automação. Derrota, pausa ou falta de suprimentos interrompem a sequência. Pausar entre andares elimina o desafio agendado. Recarregar a página preserva o melhor andar e a preferência, sem reiniciar batalhas sozinho.
