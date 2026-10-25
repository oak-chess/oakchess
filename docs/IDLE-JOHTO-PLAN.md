# Johto no Jornada Idle

## Objetivo
Completar as 100 espécies da segunda geração, suas famílias evolutivas e golpes próprios, oito rotas e ginásios de Johto, insígnias e seis eventos lendários/mítico. Manter IDs e formas dos Pokémon salvos e o progresso de Kanto. Efeitos PokéTibia continuam no laboratório; sua integração no combate é uma mudança separada.

## Etapas de implementação
1. Auditar espécies presentes e acrescentar apenas as ausentes ao final do elenco. Gerar golpes a partir dos learnsets já registrados. Completar sprites normais/shiny e requisitos evolutivos.
2. Adicionar as oito regiões de Johto após Kanto, com habitats distintos, níveis de progressão próprios e equipes dos líderes. Liberar Violet após a insígnia Terra e as seguintes pelo ginásio anterior.
3. Completar a apresentação: escolha de Kanto/Johto na jornada e no estojo, retratos dos oito líderes, oito sprites de insígnias e contadores por região.
4. Adicionar Raikou, Entei, Suicune, Lugia, Ho-Oh e Celebi ao agendador. Usar uma única vaga ativa de evento, horários alternados e desbloqueios por progresso, preservando os relógios existentes.
5. Verificar cobertura das espécies, legalidade dos golpes, habitats, evoluções, referências dos assets, migração de saves e progressão dos ginásios. Exercitar a interface quando houver navegador disponível.

## Critérios
- Nenhuma família existente é reordenada; evoluções ramificadas transferem o parceiro preservando ID, IVs, potência, favorito e cadeado.
- Níveis de caçadas e ginásios são balanceamento do Idle, explicitamente separados dos jogos oficiais.
- Eventos lendários mantêm a regra atual de desafio com equipamento raro, sem tornar os lendários encontros comuns de caçada.
- Todos os golpes selecionados precisam constar no learnset da espécie. Um efeito visual disponível não autoriza um Pokémon a aprender o golpe.
- O save anterior recebe uma cópia de segurança antes da migração. Kanto mantém índices 0–7; Johto usa 8–15.

## Andamento
- Implementação local concluída: 100 espécies cobertas no elenco; 58 famílias acrescentadas ao final, mantendo os índices anteriores. Sprites normais, shiny e de costas completos para os 100 Pokémon.
- Oito regiões e ginásios, 24 habitats, dois estojos, líderes e insígnias adicionados. Violet é liberada após Giovanni; a jornada segue até Clair. Pokédex com filtros de Kanto/Johto e espécies de eventos incluídas no catálogo completo.
- Novas opções evolutivas: Bellossom, Politoed, Slowking, Espeon, Umbreon e Porygon2, além dos bebês e famílias novas. Loja e drops oferecem Pedra Solar, Pedra do Rei e Upgrade.
- Eventos: Raikou/Entei/Suicune após Morty (intervalo de grupo 35 min); Lugia/Ho-Oh após Clair (50 min); Celebi após Clair (65 min). Rotação dentro de cada grupo, apenas um evento ativo de cada vez. Os relógios existentes de Kanto permanecem. Níveis fixos desta versão: trio 40, guardiões 45, Celebi 30.
- Verificação automatizada: 100 espécies, legalidade dos golpes selecionados, 400 sprites animados, referências dos ginásios/habitats, preservação da migração, ramificações evolutivas e desbloqueio dos relógios. Código dos scripts inline e módulos verificado.
- Navegador de teste: partida nova sem erros; seleção de Johto e bloqueio após Giovanni; 16 cartões de insígnias; habitats e batalha de Violet funcionando; evento de Lugia mostrando nível e apenas um cartão ativo. Filtro da Pokédex confirmado com 100 espécies de Johto. Saves de teste isolados do navegador do usuário.

## Adaptações e limites
- Níveis de Johto sobem de 90 nas primeiras caçadas a 180 no ginásio de Clair, para continuar o progresso de Kanto. São números de balanceamento desta implementação.
- Equipes dos líderes são adaptações do Idle, não uma reprodução de uma edição específica. Cenários, trilhas e passivas reutilizam o sistema existente.
- Os golpes respeitam os learnsets da espécie, incluindo máquinas/tutores, conforme o padrão já utilizado pelo Idle. Counter e Mirror Coat usam a adaptação de dano direto do motor, sem a fórmula de retaliação dos jogos principais. Esboço copia um golpe do alvo durante a batalha, sem aprendizado permanente no save.
- Eventos mantêm a recompensa atual de equipamento raro; não inserem lendários nas caçadas comuns. PokéTibia permanece no laboratório separado.
- Fontes dos dados: catálogo e learnsets locais derivados de PokeAPI; requisitos em tmp/dex-source/pokemon_evolution.csv. Sprites: PokeAPI/sprites (normais, shiny, costas e insígnias); líderes: Pokémon Showdown, com referência de atribuição em assets/showdown/trainers/ATTRIBUTION.txt.
- Alterações locais; ainda sem publicação no GitHub.

## Padronização PMD de Johto concluída
- Os 100 Pokémon de Johto agora têm sprites PMD normais e shiny: 200 conjuntos e 3.724 folhas de animação. Fonte SpriteCollab fixada na revisão `27da8bb6f0d5c11134127a8fccd50080c51d030a`.
- XMLs e folhas da mesma versão, dimensões e aliases conferidos; limites de transparência recalculados para o encaixe na arena. Outros Pokémon do manifesto foram preservados.
- Créditos por espécie e por variante em assets/pmd/CREDITS.md, com históricos de autoria junto dos assets. Mesma licença não comercial já utilizada para os sprites PMD existentes.
- Teste de navegador: o renderizador carregou os 200 conjuntos sem falhas. Uma batalha com Chikorita, Cyndaquil, Totodile, Hoothoot shiny, Mareep shiny e Larvitar shiny usou os canvases PMD, sem requisições PMD ausentes nem erro do jogo. Conferência visual da preparação e da batalha concluída.
- Corrigida também a correspondência do nome Ho-Oh entre o elenco e o evento, mantendo o ID da espécie e a ordem das famílias.
- Reexecução: scripts/download-idle-johto-pmd.py, scripts/build-idle-johto-pmd.cjs, scripts/prepare-pmd-bounds.cjs, scripts/check-idle-johto-pmd.cjs. Regressão de espécies/evoluções/eventos: scripts/check-idle-johto.cjs.
