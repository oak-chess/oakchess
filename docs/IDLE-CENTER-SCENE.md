# Arena do Centro Pokémon — Jornada Idle

O botão Centro abre um cenário desenhado nos mesmos canvases da arena. O Centro reutiliza a geometria hexagonal, a perspectiva e o banco nativos. Não utiliza mais o salão SVG separado.

O piso tem tons claros de verde, emblema de Poké Bola, balcão de atendimento e mobiliário lateral. Enfermeira, PC, loja, evolução, tarefas e incubadora são estações clicáveis, com sprites locais. Os parceiros aparecem nas posições de campo e banco, com nível, variante e PS atualizados. Clicar abre a ficha.

A camada de serviços acompanha a transformação do tabuleiro. Cabeçalho e rodapé oferecem retorno à caçada e acesso aos demais serviços. Os painéis existentes abrem sobre o cenário. Escape retorna quando não há um painel de serviço aberto.

A troca visual é isolada em center-scene.js e center-scene.css. O desenho original da arena é restaurado ao sair. A consulta ao Centro mantém a simulação existente; descansar usa a confirmação existente, custa 10 ouro e encerra a caçada. A localização só permite serviços exclusivos do Centro quando a caçada está parada. Não há cópia paralela do inventário ou da equipe.

Arquivos compartilhados, campanha, Torre e Operação Rocket não foram alterados. O antigo interior.svg permanece sem uso.

Sintaxe do módulo conferida. Sem teste de combate ou validação visual em navegador nesta alteração.

## Integração na tela principal
O Centro usa somente uma camada de estações dentro de arenaView. Não possui painel, cabeçalho ou rodapé próprios. Equipe lateral, sinergias, recursos, menus laterais e navegação inferior continuam visíveis. O indicador superior existente identifica o Centro; o botão de ação inferior retorna à caçada, assim como clicar novamente em Centro. As nove posições do banco são desenhadas no próprio cenário.

## Cenário externo do Centro
Substituído o salão retangular por uma plataforma elevada no formato da arena, com jardins externos, fachada de telhado vermelho ao fundo e estações independentes nas laterais. Não há piso de sala ou paredes envolvendo toda a tela. Os nomes sobre os parceiros foram removidos para manter a apresentação de sprites da arena; as fichas continuam acessíveis por clique. Canvases de efeitos da arena anterior ficam ocultos enquanto o Centro está ativo. Resultado visual ainda não conferido no navegador.

## Equipe de atendimento e identidade visual
O campus do Centro tem paisagismo com árvores desenhadas no estilo das arenas nativas, caminhos pavimentados, iluminação, bancos de espera, fachada de telhado vermelho e balcão de atendimento. O tabuleiro mantém as posições nativas, com piso de marfim e verde-claro, borda rosa, luzes de recuperação e banco de nove lugares.

A enfermeira atende com Chansey; cientista opera o PC; médico atende os suprimentos; Blissey acompanha a evolução; Mr. Mime oferece acesso às tarefas; Happiny identifica a incubadora e Audino oferece recuperação. São personagens de apresentação com acesso às funções existentes, sem alterar suas regras. Sprites locais de treinadores e GIFs de Pokémon substituem os pequenos ícones de itens; funcionários usam caixas de imagem de 104 px e ajudantes de 73–75 px. Identificação por nome do serviço e descrição ao apontar. Removida a placa de evento Rocket durante a visita ao Centro.

Sem teste ou conferência visual no navegador nesta revisão.

## Revisão: interior reconhecível de Centro Pokémon
Retirado o campus externo e a plataforma com hexágonos elevados. O ambiente passa a ser um interior contínuo de azulejos, com parede creme e faixa vermelha, balcão largo de recepção, monitor de sinais, máquina com seis Poké Bolas, terminal de armazenamento vermelho, armário de suprimentos, leito, incubadora e assentos. As marcações de posicionamento são discretas e planas no piso. A identificação superior existente foi deslocada para deixar a recepção visível.

A enfermeira usa um novo sprite vetorial em pixel art (nurse-joy.svg), com cabelos rosas, touca e uniforme branco; Chansey permanece ao lado. Os serviços continuam abrindo seus painéis existentes. Sem validação visual em navegador nesta revisão.

## Arte final do interior e correção dos sprites
Substituído o cenário desenhado por formas simples por interior-pixel-v2.png, arte original gerada em pixel art (1536 × 1024). O fundo detalhado contém balcão, monitor, máquina de seis Poké Bolas, PC, leitos com cortinas, farmácia, incubadora e sala de espera. A arte é desenhada no canvas nativo da arena, acompanhando a mesma perspectiva dos personagens. Os desenhos antigos de fallback foram retirados.

Enfermeira e cientista usam os primeiros quadros das folhas locais de overworld (16 × 32 por quadro). O sprite SVG improvisado e as poses de batalha dos funcionários deixam de ser usados. Chansey, Blissey, Audino e Happiny usam as animações Idle locais de Mystery Dungeon, carregadas e desenhadas pelo mesmo módulo de sprites do perfil. A atualização visual para quando o Centro fecha. Os móveis de loja e tarefas são pontos de interação, sem personagens de batalha sobrepostos. Serviços, equipe e salvamento mantêm as regras existentes.

A arte e as folhas de sprite foram inspecionadas como imagens locais. A composição em funcionamento no navegador ainda não foi conferida; nenhum teste de jogo foi executado nesta revisão.

## Correção de escala e projeção
A regra nativa #world canvas aplicava posição absoluta e dimensões 1280 × 800 aos pequenos canvases dos ajudantes. Agora #idle-center-scene canvas.ic-staff-pokemon fixa posição estática e tamanho 80 × 88, com prioridade suficiente para isolar o componente. A folha do cientista tem 160 × 32, enquanto a enfermeira tem 64 × 32: o tamanho de fundo agora segue a altura (auto 96px), recortando apenas o primeiro quadro de 16 × 32 em ambos os casos. Não se força mais a mesma largura total às duas folhas.

A perspectiva CSS de arenaView é desativada apenas durante a visita ao Centro, pois a arte já contém perspectiva. Fundo e personagens compartilham as coordenadas planas 1280 × 800. O Centro limita seus elementos ao tamanho do cenário e as regras CSS anteriores foram consolidadas, removendo as sobreposições acumuladas. As regras das demais arenas permanecem as existentes. Posições do cientista e de Chansey ajustadas ao PC e balcão. Sem teste ou validação visual em navegador nesta revisão.

## Equipe da arena com sprites de cenário
Os parceiros em campo e no banco agora usam os mesmos canvases Idle de Mystery Dungeon dos ajudantes, com a espécie evoluída e a variante shiny do indivíduo. Removido o uso de sprFront/Showdown nessa apresentação do Centro. O tamanho continua limitado a 80 × 88 para evitar a regra global de canvas. A lista de animações descarta elementos removidos; mudanças apenas nos PS não recriam os sprites. A mudança é exclusiva da apresentação do Centro.

## Atendimento por diálogo
Clicar na enfermeira, Chansey ou Audino abre uma conversa compacta sobre o cenário, sem abrir Base Pokémon/Descanso da equipe. A enfermeira informa o custo de 10 ouro e o encerramento da caçada quando aplicável. O jogador pode confirmar ou recusar. Ao confirmar, a operação compartilhada restTeam recupera condição e energia, remove fadiga, cobra uma vez e salva usando o fluxo existente. Saldo insuficiente recebe uma fala de aviso.

Depois da confirmação, uma breve fala de atendimento e brilho suave na equipe dão lugar à mensagem de cura concluída. O botão Obrigado encerra a conversa. Escape fecha primeiro a conversa. A animação não bloqueia o salvamento da cura e é cancelada ao sair do Centro. A versão do descanso no menu antigo compartilha a mesma operação. Nenhum teste de jogo foi executado nesta revisão.

## Atendente da loja
Adicionado um atendente clicável atrás do balcão de suprimentos, usando o sprite de cenário local gentleman_normal.png. O projeto não possui uma folha específica de balconista de Poké Mart; este personagem existente representa o vendedor no protótipo. O recorte usa um quadro de 16 × 32, como os demais funcionários. Clicar abre a loja existente.

## Responsáveis por tarefas e recuperação
O posto de tarefas recebeu um funcionário com o sprite de cenário bill_normal.png, com acesso às atividades ao clicar. A recuperação ganhou uma enfermeira ao lado de Audino, mantendo a ajudante Pokémon e o atendimento por diálogo existente. Os funcionários usam um único quadro de 16 × 32, ampliado para 48 × 96, sem modificar regras dos serviços.

## Fontes originais encontradas no repositório local
O repositório pret/pokeemerald está em tmp/emerald-source/pokeemerald-master. Os originais graphics/object_events/pics/people/mart_employee.png e nurse.png foram importados para assets/center/mart-employee-emerald.png e nurse-emerald.png do protótipo. A importação mantém os pixels e a paleta originais e adiciona apenas transparência ao índice zero, conforme a renderização do jogo. O vendedor deixa de usar gentleman; a recepção e o retrato do diálogo usam a enfermeira original de Emerald.

Também existem os tiles do Centro em data/tilesets/secondary/pokemon_center e os efeitos do monitor em graphics/field_effects/pics/pokecenter_monitor. Eles foram localizados, mas não substituem a arte do cenário nesta alteração.

## Cuidadora da incubadora
A incubadora recebeu a personagem original do Day Care de Emerald. A identificação vem do evento LOCALID_DAYCARE_LADY em data/maps/Route117_PokemonDayCare/map.json, que usa OBJ_EVENT_GFX_OLD_WOMAN. A folha old_woman.png foi importada como daycare-lady-emerald.png, preservando a paleta e acrescentando transparência ao índice zero. A Happiny fica ao lado como ajudante. Ambas abrem a incubadora existente ao clicar.
