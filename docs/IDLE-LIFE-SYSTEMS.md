# Surtos, berçário, especializações e coleções

Implementação local em 25/10/2026. Os sistemas ampliam os menus existentes; não alteram a taxa de shiny, os IVs ou a potência das capturas.

## Surtos — Caçadas

Cada destino tem um surto de 20 minutos por hora, com área e espécie escolhidas de forma determinística a partir da hora e do destino. Recarregar ou trocar de área não sorteia outro surto. Somente uma espécie já presente naquela caçada pode ser escolhida, sem lendários ou invasões de espécies de outra região.

Na caçada correspondente, o peso de encontro daquela espécie é multiplicado por três. Rastreamento e raridade continuam contando. O bônus não é aplicado às outras caçadas, não garante encontros e não altera captura, potência, IVs ou shiny. O painel mostra área, espécie e tempo restante; fora da janela, mostra o próximo horário.

## Berçário — Centro → Incubadora e berçário

- Um casal por vez; parceiros livres do banco ou PC. É necessário estar no Centro com a caçada encerrada para iniciar.
- Compatibilidade pelos grupos de ovos e gênero da PokéAPI. O gênero do indivíduo é derivado de sua identidade genética e não muda ao recarregar. Ditto combina com espécies elegíveis, mas não com outro Ditto. Bebês, lendários, míticos e o grupo Não descoberto são bloqueados.
- Custo de 50 ouro e 5 materiais; 30 minutos para produzir um ovo. O avanço offline respeita o limite existente de oito horas e nunca inicia outra criação automaticamente.
- Três IVs distintos são herdados, cada um sorteado entre os pais. Os outros atributos genéticos, Nature, potência e shiny seguem sorteio próprio. Não há herança garantida de shiny, potência alta ou IVs altos.
- O resultado genético fica salvo ao iniciar; recolher ou recarregar não sorteia novamente. Ovos de criação nascem como indivíduos novos.
- Os pais ficam ocupados até recolher ou cancelar, inclusive quando o ovo já está pronto. O bloqueio existente das atividades também impede luta, venda, troca de posição no PC, evolução, conversão e atribuição a tarefas.
- Recolher ou cancelar impõe 60 minutos de descanso antes de criar outro ovo. Cancelamento exige confirmação e não devolve recursos.
- A criação não inicia nem entrega com dez ou mais ovos na reserva; ovos e recompensas já existentes são preservados. Quando a reserva está cheia, o ovo pronto e os pais aguardam sem perder o resultado. O ovo recolhido entra na reserva e usa as incubadoras existentes, com 24 passos.
- PC cheio impede o nascimento, preservando o ovo pronto. Cada nascimento consome o ovo uma única vez, inclusive em comandos repetidos, e recebe um identificador individual novo. A proteção automática configurada pelo jogador também se aplica aos nascimentos.

Adaptação explícita: o filhote é a forma inicial jogável da família da fêmea ou do parceiro de Ditto, sem exigência de incensos. Não há reprodução integral de regras específicas de cada cartucho, golpes herdados ou herança de Nature.

## Especializações — Tarefas → Especializações

Pesquisa, Coleta e Conservação têm progresso separado por indivíduo. Cada tarefa recolhida concede um ponto à função correspondente. Quatro pontos sobem um nível; máximo nível 5 e 16 pontos. O Treino da reserva mantém sua função de XP/amizade e não treina essas especializações.

Cada nível acima do primeiro reduz o tempo daquela função em 5%, até 20%. Níveis 3 e 5 acrescentam, respectivamente, um e dois materiais por tarefa. O bônus é fixado ao iniciar a tarefa e aparece na recompensa. Tarefas antigas preservam seu tempo e recompensa; a primeira conclusão após a atualização já treina a função. Recolher novamente não concede XP ou recompensa extra. Nível 5 concede um título ao parceiro.

## Coleções — Pokédex → Coleções regionais

Cada geração tem nove metas: espécies registradas (10, 25, 50 e todas), famílias completas (3, 10 e todas) e tipos registrados (6 e todos). Famílias consideram apenas as espécies da geração selecionada, agrupadas pela cadeia evolutiva dos dados de espécie. Lendários e míticos ficam fora das metas.

Capturas, evoluções e nascimentos registram a espécie de forma permanente. Vistos não contam. Vender, mover ou evoluir não remove registros. Cada recompensa é recolhida uma única vez, com ouro e materiais; as metas finais também concedem títulos equipáveis no Perfil do treinador.

A migração usa os indivíduos existentes e contadores de captura preservados. Não presume que espécies apenas vistas foram possuídas. Formas evoluídas e vendidas antes desta atualização podem não ter evidência suficiente para migração; novos registros permanecem completos a partir de agora.

## Persistência e fontes

Estado novo em `world.life`; especializações e descanso de criação ficam em cada parceiro. Saves sem esses campos recebem valores iniciais, preservando equipe, PC, ovos, tarefas e conquistas. Uma cópia anterior à expansão é guardada em `journey-native-v2-before-life-systems`, quando houver espaço. Falha de espaço no backup não impede o carregamento do progresso atual.

Metadados locais gerados por `scripts/build-idle-breeding.cjs`, a partir de `pokemon_species.csv` e `pokemon_egg_groups.csv` do [repositório PokéAPI](https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv). Não há consulta de rede durante o jogo. [Documentação dos dados de espécies e grupos](https://pokeapi.co/docs/v2#pokemon-species).

Verificadores: `scripts/check-idle-life.cjs` e as regressões de Hoenn e Johto. Navegador isolado: surtos/pesos, metas e recolhimento único, criação e bloqueios, incubação/nascimento e especializações. Saves do perfil real do usuário não foram usados nos testes.
