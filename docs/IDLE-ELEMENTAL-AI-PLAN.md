# Plano — vantagem elemental e decisões de combate no Idle

Status: implementado localmente no Idle em 1 de novembro de 2026. Este documento preserva o plano original; regras finais, testes, resultados e limites estão em `modes/idle/combat/README.md`. Sem publicação nesta etapa.

Refinamentos durante os testes: a recarga individual também considera 1,5 vez o tempo nominal de recuperar uma carga (teto de 45 s); menus não avançam esse relógio. A preferência antiga de golpe virou somente desempate entre opções próximas. A simulação offline mantém seu caráter de estimativa, sem anunciar paridade com batalhas completas.

## 1. O que existe hoje

- `modes/idle/index.html`: `cast()` usa `u.moves[u.mi++ % u.moves.length]`, uma rotação fixa. `deal()` já informa `type: mv.t` a `hurt()`.
- `hurt()` distingue dano físico, especial e verdadeiro, aplica defesa, resistência, redução, escudo, teto de dano dos bosses e efeitos de sobrevivência. No trecho auditado, não há uma tabela geral de eficácia aplicada ao dano.
- `assets/skill-rhythm.js`: intervalo compartilhado, energia por lançamento igual a `maxMana`, capacidade de duas cargas e bloqueio enquanto a animação/projétil anterior termina. Não há recarga individual dos quatro golpes nesse módulo.
- `modes/idle/combat-continuity.js`: preserva energia e o próximo golpe nas caçadas.
- `modes/idle/move-slots.js`: controla golpes liberados pela evolução; essa progressão deve continuar.
- `modes/idle/hoenn-rules.js`: Guarda Mística de Shedinja verifica tipos específicos. Integrar essa habilidade à nova fonte de eficácia.

Antes de editar, concluir a auditoria de todas as chamadas de dano, ataques básicos, passivas, cópias de golpes, campos, formas e simulação offline. Não presumir que todo dano passa pelo mesmo auxiliar.

## 2. Princípios obrigatórios

1. Mesma tabela, estimador, elegibilidade, pontuação, energia e recargas para os dois lados. Bosses mantêm somente modificadores já declarados.
2. Decidir com informações presentes no combate. Não consultar sorteios futuros, cliques do jogador, futuras capturas ou resultados aleatórios de críticos.
3. Escolher apenas golpes que a espécie já possui e que sua etapa libera. Não criar golpes, mudar evolução ou liberar quatro ataques para formas iniciais.
4. Não obrigar a usar um golpe ruim apenas para exibir os quatro. Variedade vem de funções, alvos e recargas úteis.
5. Não reduzir energia ou recarga de inimigos para compensar uma escolha ruim.
6. Preservar animações, projéteis, danos e efeitos já aprovados; a inteligência decide o uso, não substitui sua apresentação.
7. Ausência de metadados deve gerar aviso de auditoria e comportamento conservador, nunca adivinhar silenciosamente o tipo pelo primeiro tipo do atacante.

## 3. Eficácia elemental

- Uma tabela central dos 18 tipos. Validar as 324 relações contra uma fonte identificada antes da ativação.
- Preservar as relações da tabela; adaptar somente a intensidade dos multiplicadores ao Idle.
- Primeira configuração de teste: vantagem ×1,5; resistência ×0,75; neutro ×1; imunidade ×0.
- Dois tipos distintos: multiplicar relações; vantagem dupla ×2,25; resistência dupla ×0,5625; vantagem com resistência ×1,125 nessa configuração. Não rotular esse último caso como neutro nem omitir o fator real na ficha.
- Uma imunidade resulta em zero, independentemente do outro tipo. Deduplicar tipos iguais.
- Usar os tipos atuais em combate, incluindo mudança de forma, transformação e clima já implementados.
- Sem STAB adicional na primeira entrega: acrescentá-lo junto confundiria a medição do impacto.
- Sem alterar bônus das sinergias. Bônus de equipe e eficácia são etapas diferentes.

## 4. Contrato de dano e efeitos

- Cada evento identifica origem, alvo, tipo, categoria física/especial/verdadeira, natureza direta/indireta, golpe e lançamento.
- Aplicar eficácia uma única vez por alvo e por impacto direto. Áreas e correntes recalculam para cada vítima.
- Tratar imunidade antes do piso atual de dano mínimo 1. Ataque imune não tira PS, escudo ou gera roubo de vida, mana por dano recebido ou gatilhos de acerto.
- Estimador e execução compartilham funções puras de mitigação. A previsão nunca consome escudos, itens, críticos ou habilidades de uso único.
- Manter redução por defesa/resistência e o teto de dano dos bosses na ordem documentada e testada. Não aplicar vantagem depois do teto e ultrapassá-lo.
- Ataque básico: primeira versão mantém dano neutro tipado como básico neutro explícito. Assim não inventa um elemento para contatos genéricos e mantém uma saída mínima para confrontos comuns. Documentar essa adaptação na Wiki.
- Dano verdadeiro, reflexo, auto dano, clima, veneno, queimadura e campos indiretos não recebem o multiplicador direto por padrão. Classificar cada exceção explicitamente.
- Efeitos secundários de golpes ofensivos não acertam através de uma imunidade ao golpe. Golpes puramente de suporte têm elegibilidade própria, independente de multiplicador de dano.
- Auditar imunidades a condições separadamente; não introduzir um sistema incompleto de imunidade a status nesta entrega.
- Guarda Mística continua bloqueando dano direto sem vantagem real, inclusive o básico neutro. Dano indireto permitido continua funcionando. Não contornar sua habilidade para encerrar uma luta.

## 5. Seleção inteligente

Executar uma decisão somente quando a unidade puder agir, não a cada quadro.

### 5.1 Filtrar candidatos

Excluir golpe bloqueado por evolução, sem energia, em recarga, sem alvo válido, fora de alcance real ou impedido por uma condição. Manter o bloqueio compartilhado, animações e projéteis pendentes.

Usar capacidades reais dos executores: não prometer alcance, área, cura ou escolha de aliado que o golpe atual não suporta. Padronizar esse contrato antes da pontuação.

### 5.2 Avaliar pares golpe–alvo

- Primeiro avaliar o alvo atual e aliados realmente atendidos por suporte.
- Para ataques em área/corrente, estimar vítimas atingíveis com as mesmas regras do executor; não somar todos os inimigos da arena.
- Em segunda etapa, permitir retarget entre inimigos alcançáveis. Exigir ganho relevante e manter o alvo por ao menos 1 segundo para evitar mudanças contínuas.
- Congelar a decisão ao iniciar o lançamento. Se o alvo morrer, usar a política atual do executor: cancelar, concluir em área ou redirecionar somente se aquele golpe já permitir.

### 5.3 Pontuação inicial, em equivalentes de PS úteis

`valor = dano útil esperado + cura útil ponderada + proteção útil ponderada + utilidade de condições − desperdício − custo de oportunidade`

- Dano esperado usa defesa, resistência, tipos, modificadores conhecidos, chance média de crítico e acerto quando esse recurso existir. Nunca sorteia crítico para escolher.
- Limitar valor de dano ao PS e escudo restantes; não valorizar excesso de dano como se acertasse outra vítima.
- Cura: contar somente PS realmente recuperáveis e respeitar bloqueio de cura. Vida cheia tem utilidade zero.
- Proteção: descontar escudo existente e estimar risco com base em inimigos próximos e ataques observáveis, sem antecipar ações futuras.
- Condições: valor limitado, descontado quando o alvo já possui efeito equivalente por duração suficiente. Não renovar buffs ou controle continuamente sem ganho.
- Execução de um nocaute pode desempatar; não ganha prioridade absoluta sobre salvar um aliado em risco.
- Todos os pesos e limiares ficam em configuração única, com versão e motivo das decisões disponível em diagnóstico.
- Empate ou diferença menor que 5%: preferir o golpe há mais tempo sem uso, depois ordem estável. Não adicionar aleatoriedade a cada quadro.
- Exemplo de teste: golpe neutro com dano final 300 deve vencer um super eficaz com dano final 180, salvo utilidade de suporte justificável.

### 5.4 Suporte, energia e espera

- Cura prioritária somente quando houver perda relevante (valor inicial para teste: 25% de PS) ou risco de nocaute; usar cura emergencial mesmo antes desse limiar se justificável.
- Não guardar energia indefinidamente por uma cura hipotética ou recarga longa.
- Se não houver habilidade útil disponível, continuar ataque básico/movimentação conforme regras atuais. Reavaliar quando chegar energia, terminar recarga ou mudar o combate.
- Não gastar uma carga só para consumir um golpe ineficaz; suporte aplicável ainda pode ser usado contra alvo ofensivo imune.
- Sem IA que escolha golpes diferentes por ser jogador ou inimigo.

## 6. Recarga individual sem quebrar o ritmo atual

- Manter o intervalo compartilhado atual como trava de animação. Recarga individual é uma segunda trava, não substituta.
- Começar testes com famílias configuráveis: ataque simples 6 s; área/alto impacto 10 s; controle 12 s; cura/proteção/buff 16 s. Valores provisórios, não regras aprovadas de equilíbrio.
- Contar a recarga desde o início efetivo do lançamento e gastar energia uma única vez. Golpe inválido antes de começar não consome recursos.
- Identificar recarga pelo golpe, não pelo slot. Cópia/mudança de forma não pode permitir zerar recarga artificialmente; definir o mapeamento de identidade nesses casos.
- Manter custo atual por carga na primeira versão. Custos diferentes por golpe só após medir essa mudança isoladamente.
- Não aumentar geração de energia nesta entrega. Comparar tempo entre golpes e propor ajustes separados se necessário.
- Atualizar ficha/tooltip: disponível, energia insuficiente, recarga individual ou intervalo compartilhado; retirar indicação falsa de próximo golpe fixo.

## 7. Continuidade, saves e offline

- Novo estado de combate versionado: último golpe lançado, histórico curto de uso e recargas restantes por identificador.
- Nas caçadas comuns, preservar energia e recargas restantes. Descontar tempo simulado de preparação; não reiniciar tudo a cada onda.
- Separar cursor legado de último golpe real. Esboço, transformação, cópia, tooltip e efeitos não podem continuar inferindo último ataque apenas de `mi`.
- Save antigo: aceitar o cursor existente como desempate inicial; sem alterar nível, IVs, potência, golpes, inventário ou captura.
- Bosses e desafios isolados seguem o ciclo de preparação existente; não transferir estados de inimigos entre encontros.
- Offline: reutilizar o mesmo motor se a simulação já o fizer. Se for uma aproximação, documentar e validar a equivalência; não anunciar IA completa offline antes disso.
- Relógio de recarga usa tempo da simulação, não `Date.now()`, para respeitar pausa, velocidade e retorno de aba.

## 8. Impasses e desempenho

- Rastrear PS/escudos, ações úteis e dano recente. Não marcar empate apenas porque houve alguns segundos sem dano durante deslocamento ou cura.
- Manter o limite de batalha existente, se houver, e definir resultado neutro de impasse: sem recompensa, sem vitória e sem captura. Não criar dano que atravesse imunidades.
- Ao detectar impossibilidade de dano, mostrar motivo e permitir interromper/reorganizar. Bosses não concedem vitória gratuita.
- No automático, impedir reentrada infinita no mesmo impasse: pausar a sequência e emitir um aviso agrupado.
- Avaliar no máximo os golpes liberados e alvos elegíveis; cachear relações de tipos. Sem varrer sprites/DOM para decidir ou executar busca exponencial de sequências.

## 9. Interface e transparência

- Dano: indicação curta de eficácia, agrupada por lançamento/alvo, evitando um texto por acerto de ataque múltiplo.
- Fichas: fraquezas, resistências, imunidades e multiplicadores calculados com tipos atuais; não confundir com P1–P5 ou estrelas.
- Preparação: resumo de tipos adversários sem simular vitória garantida.
- Wiki/tutorial: tipos, decisão automática, básico neutro, energia, recargas e exemplos claros. Sem novo painel obrigatório ou botões duplicados.
- Diagnóstico de desenvolvimento registra candidatos, pontuação, motivo, alvo e dano previsto/real; não expor números internos na interface comum.

## 10. Implementação por etapas

1. Auditoria e linha de base: mapear todos os caminhos de dano; salvar cenários e sementes de teste para comparar.
2. Núcleo elemental puro, estimador e testes, ainda desligados no combate real.
3. Integração de dano e regras especiais, mantendo inicialmente a rotação para isolar defeitos.
4. Elegibilidade, seleção inteligente e recargas individuais; integrar continuidade e casos de cópia.
5. Interface, Wiki e diagnóstico; testar retorno de aba, save antigo e offline.
6. Comparação de equilíbrio, ajuste documentado e revisão. Somente então ativar no Idle.
7. Publicar apenas após autorização de envio e validação. Manter retorno ao comportamento anterior por configuração de desenvolvimento, não por uma escolha que permita explorar recompensas.

## 11. Critérios para aprovação

- Tabela inteira e combinações de dois tipos verificadas; tipo desconhecido detectado.
- Zero dano realmente zero; um único multiplicador; área/multiacerto/corrente sem duplicação; teto de boss preservado.
- Mesmo estado com lados invertidos produz a mesma decisão, salvo posicionamento e regras explícitas existentes.
- Nenhum golpe inexistente ou bloqueado selecionado; nenhuma energia negativa; nenhum lançamento simultâneo/projétil pendente ignorado.
- Cura com vida cheia não vence ataque útil; cura emergencial, proteção, controle, sobreposição e nocaute possuem casos de teste.
- Repetir o melhor golpe quando apropriado é permitido; monopolizar por falta de recarga ou leitura errada dos outros é defeito.
- Testar Shedinja, Castform, Esboço, transformação, Megas, lendários/míticos, habilidades reativas, escudos e sobrevivência.
- Testar equipe monotipo/mista, 2/3/4 golpes liberados, começo/meio/fim de jogo e adversários com múltiplos tipos.
- Comparar ao menos 100 sementes por cenário: taxa de vitória, duração, dano, uso de golpes, consumo de cura/revive e recompensa/hora. Investigar alteração maior que 10 pontos percentuais em vitória ou 20% em duração/consumo; são limites de revisão, não garantia automática de equilíbrio.
- Sem erros de interface, travamentos, loop automático de empate, perda de progresso ou degradação perceptível de desempenho.
- Separar alterações de economia, geração de energia e atributos dos bosses; não mascarar defeitos da IA alterando todos ao mesmo tempo.

## Decisões ainda sujeitas ao teste

Multiplicadores moderados, pesos de suporte, recargas por família e limiar de troca de alvo. Os princípios de simetria, progressão preservada, imunidade real e integridade do save são requisitos, não parâmetros de ajuste.
