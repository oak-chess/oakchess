# Expansão da Pokédex

## Implementado
- Catálogo separado em assets/dex/catalog.js: 984 espécies com ao menos uma forma PMD disponível.
- Tipos e famílias evolutivas da PokéAPI, formas e créditos do SpriteCollab.
- Filtros de disponibilidade; novas espécies consultáveis sem descoberta ou captura fictícia.
- Prévia PMD Idle/Walk com metadados e folha carregados sob demanda, cache em memória e respeito a movimento reduzido.
- Nenhuma inclusão na loja ou na Torre.

## Próximas etapas
- Importador reproduzível e atualização do levantamento. Fontes originais atuais em tmp/dex-source e tmp/pmd-tracker.json.
- Condições detalhadas de evolução, tradução dos nomes das formas e créditos mais amigáveis na ficha.
- Auditar e importar os golpes adicionais de rh-hideout/pokeemerald-expansion; classificar pronto/adaptado/pendente.
- Associar golpes por espécie com fonte verificável e habilitar prévias.
- Propor expansão da Torre antes de implementá-la.

## Limites
A disponibilidade é o inventário do repositório, não promessa de animação completa. As prévias novas precisam de internet; falhas mostram mensagem e permitem tentar reabrindo a ficha. Não foi realizada validação visual em navegador nesta etapa.

## Segunda entrega — catálogo de golpes
- 919 registros de movimentos da PokéAPI, com nomes em inglês, tipo, geração, categoria, poder e precisão.
- 354 registros ligados ao catálogo local adaptado do Emerald; 565 adicionais pendentes.
- Análise de referências a animações do pokeemerald-expansion, sem tratar compatibilidade de templates como animação final pronta.
- Aba Catálogo de golpes na Pokédex, busca, filtros, paginação de 40 e prévia isolada dos efeitos locais. Prévia não altera dano, mana ou estado de combate.
- Importador reproduzível: scripts/build-dex-moves.cjs; resultados em docs/DEX-MOVE-AUDIT.md.
- Próximo trabalho: obter os recursos gráficos novos, portar sequências e associar movimentos às espécies por fonte verificável.
- Não foi executada validação visual em navegador.

## Correção das imagens da expansão
- Sprites estáticos locais para todas as 984 espécies catalogadas.
- 984 prévias normais PMD com metadados locais compilados em pmd-local.js; sem fetch de XML na abertura da ficha normal.
- Formas alternativas e shiny não baixadas nesta correção continuam sob demanda na fonte externa.
- Proporção do canvas preservada.
- assets/dex/pmd excluído do carregamento inicial; folhas carregam apenas na consulta.
- Metadados recompiláveis por scripts/build-dex-pmd-local.cjs.

## Terceira entrega — associações e sequências adicionais
- 984 espécies com listas de aprendizado da PokéAPI, versão mais recente disponível por espécie padrão; métodos e níveis preservados. Não extrapola para formas alternativas.
- Fichas novas exibem golpes em páginas de 8 e levam ao detalhe do catálogo.
- 129 sequências adicionais da expansão adaptadas para prévia isolada com templates locais existentes. Recursos de sprites e tempos extraídos, mas sem interpretação de tarefas C, câmera ou áudio original.
- 483 registros com integração adaptada (354 anteriores + 129 novos); 436 pendentes. Nenhuma alteração em habilidades do elenco.
- Reprodutibilidade: scripts/build-dex-learnsets.cjs e scripts/build-dex-moves.cjs.
- Não foi realizada validação visual em navegador.

## Prévia com Pokémon executando o ataque
- Catálogo usa Pokémon compatível pela lista de aprendizado; ao entrar pela ficha, mantém a espécie escolhida.
- Pose corporal Attack/Strike/Shoot local, quando disponível, acompanhada dos sprites do efeito e de um alvo Pokémon.
- Reprodução usa eventos de sprites diretamente em renderizador isolado. Exceções agora aparecem na interface em vez de deixar o estado Carregando indefinidamente.
- Painel volta ao topo ao selecionar novo golpe.
- Nenhuma execução visual de navegador nesta correção.

## Fase de proposta da Torre
Proposta concreta em docs/TOWER-EXPANSION-PROPOSAL.md e catálogo de candidatos em docs/TOWER-EXPANSION-PROPOSAL.json. Extensão opcional de 60 para 100 andares em quatro blocos, com primeiro bloco 61–70. Conteúdo ainda não ativado; implementação depende da revisão da proposta conforme o plano acordado.

## Atualização do elenco de combate

- 164 espécies das 89 linhas existentes usam conjuntos por espécie, derivados de listas completas de aprendizado da série principal. Jogos com listas de batalha ou aprendizado reduzidas não substituem essas fontes.
- Seleção compartilhada por combate, descrições e Pokédex; 2/3/4 espaços por estrela, respeitando espécies com menos opções.
- Identificador exato e tipo do golpe chegam ao renderizador, incluindo sequências da expansão compatíveis.
- Golpes passivos consultam a espécie atual. Splash não causa dano, Teleport reposiciona e Transform copia o conjunto de golpes nesta batalha.
- Cura e fortalecimento pessoais respeitam o usuário. Distribuição de efeitos diferencia preparação, deslocamento e impacto.
- Sintaxe compilada localmente; ainda não há aprovação visual de todos os efeitos nem avaliação de equilíbrio desta mudança.

## Nove animações pendentes do elenco

Surf, Harden, Aura Sphere, Dark Pulse, Night Slash, Air Slash, Dragon Pulse, Flash Cannon e Iron Head receberam execução específica. Catálogo: 489 adaptados e 430 pendentes; 104/104 golpes dos conjuntos atuais possuem efeito disponível. Ver assets/move-fx/README.md e nine-sources.json para origem e limites. Verificação de execução: 489 efeitos, zero exceções, zero efeitos sem emissão e zero folhas ausentes. Isso não substitui avaliação visual de cada efeito.
