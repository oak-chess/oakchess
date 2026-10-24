# Ampliação das caçadas e retorno do botão Explorar

O catálogo passou de 4 para 20 áreas. As novas definições ficam em prototypes/idle-journey/hunt-areas.js, carregado antes de hunts.js. Inclui pradaria, jardim, colmeia, penhascos, praia, pântano, dunas, pedreira, usina, dojo, ruínas psíquicas, brasas, vulcão, gelo, reserva e dragões.

Cada definição declara espécies, raridades, modificadores de XP/ouro, nível mínimo e possíveis exigências de insígnias/equipamentos. Níveis escalam com a região atual. Espécies ausentes da tabela nativa são filtradas pelo mecanismo existente. Nenhum recurso novo é desbloqueado gratuitamente. Ondas continuam salvas por região e caçada; a seleção personalizada persiste como atividade hunt:identificador. Alterações de área invalidam encontros e perfis de inimigos anteriores.

Explorar: os bloqueios de preflight agora geram aviso visível com acessos a Caçadas, Automação, Loja e Centro. Inicialização de áudio não impede o comando de caçada, valores de itens de cura antigos são normalizados e o estado global de fim de jogo é limpo antes do combate. Não foi confirmada em navegador a causa específica relatada pelo usuário; estes ajustes cobrem bloqueios silenciosos e estados residuais identificados na revisão de código. Não foi feito teste de combate. Sintaxe JavaScript conferida.

Somente o protótipo Jornada Idle foi alterado.
