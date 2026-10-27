# Wiki e revisão do tutorial do Idle

## Wiki
O livro próximo a áudio e configurações abre um painel de consulta com busca textual, sete filtros de categoria (incluindo Todos), lista de assuntos e 25 artigos. Os artigos cobrem equipe, sinergias, IVs, potência, golpes, evolução, PC, proteção, caçadas, busca global, ondas, surtos, captura, foco, shiny, registros, cura, loja, Safari, ovos, berçário, reserva, coleção, Jornada, eventos, desafios, dados e configurações (alguns compartilham artigo).

Informações numéricas de shiny, potência, recuperação e Safari são lidas dos dados atuais do jogo. Ações abrem os sistemas correspondentes. A Wiki não pausa a caçada; iniciar o tutorial mantém a pausa do guia existente. Não abre navegador externo nem busca informações de regras dos jogos oficiais.

## Tutorial
Preserva o progresso e os assuntos anteriores, sem forçar uma nova apresentação ao jogador antigo. Corrige cura gratuita, garantia shiny de 4000, captura desligável/foco, poções até vida completa, venda automática de loot, proteção, listas de capturas, busca global, restauração após F5 e quantidade de golpes por família. Acrescenta capítulos de Safari, incubadora/berçário, especialização, eventos e Wiki. A versão de conteúdo passa a 2.

O painel do tutorial agora preenche o stage explicitamente, impedindo que o posicionamento genérico de janelas desloque a máscara e o destaque. O teste compara os centros do destaque e do controle após mudar o tamanho da tela.

## Verificação
scripts/check-idle-wiki-browser.cjs: ícone, busca, vazio, atalhos, Escape/retorno do foco, larguras 1440/1366/900/600, textos atuais de cura/shiny, capítulos adicionais e geometria do destaque. Perfil de teste isolado.
