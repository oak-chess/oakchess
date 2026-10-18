# Camadas adicionais dos golpes

## Sequências e recursos restantes

`emerald-sequences.js` executa sprites secundários da fonte nas fases de preparação e impacto. Eventos de impacto são emitidos somente quando o combate aplica o golpe. Atrasos relativos são preservados dentro de janelas adaptadas; reduções de qualidade distribuem a seleção ao longo da sequência, incluindo seu final. Projéteis continuam no relógio e na trajetória autoritativos do combate.

O catálogo também preserva argumentos e horários de tarefas visuais e comandos de paleta. Realces locais traduzem blends e transições sem modificar os quadros PMD. Deslocamentos de preparação/retorno usam no máximo quatro pixels horizontais na camada separada, nunca deslocamento vertical em Pokémon terrestres.

Folhas compostas de gelo, flores, areia/lama e faíscas foram reconstruídas em ordem de tiles e com índices de paleta, ampliando o conjunto para 359 modelos em 191 folhas/paletas. Não restam referências a sprites sem modelo nos caminhos percorridos pelo importador. A auditoria detalhada está em `assets/move-fx/COVERAGE.md`.

Isso não equivale a executar integralmente os 292 callbacks de sprites e 176 tarefas C referenciados: as famílias têm adaptações locais, e condições exclusivas de turnos, concursos e trocas continuam sendo limites explícitos. O relatório não classifica referências importadas como implementação fiel do motor original.

## Ampliação da apresentação e intervalo entre golpes

A importação passou a incluir os 17 fundos disponíveis com mapas compatíveis e 31 amostras WAV originais utilizadas pelos grupos de instrumentos dos efeitos MIDI. `emerald-instruments.js` associa instrumentos às notas. As amostras são decodificadas localmente, sem requisições de áudio externas; quando ainda não carregaram, há síntese de apoio. Ruído e canais PSG são adaptados no navegador; envelopes e o motor de som original completo não são emulados.

Movimentos de partículas recebem órbitas, espirais de entrada/saída, ricochetes e oscilação local conforme a família do callback da fonte. Isso não altera as trajetórias de dano e não desloca o corpo do Pokémon. Campos persistentes e prévias continuam vinculados ao combate. O intervalo entre habilidades e a reserva de duas cargas estão descritos em `SKILL-RHYTHM.md`.

O resultado audiovisual e o novo equilíbrio de mana ainda não foram conferidos em partida.

## Sons específicos

O importador coleta referências SE dos scripts originais. `scripts/import-move-audio.cjs` extrai 132 sequências MIDI locais do Emerald para `assets/move-fx/emerald-audio.js`. O navegador reproduz as notas com as amostras originais disponíveis e síntese adaptada dos demais instrumentos. Não é emulação fiel do motor de som do GBA. Quando não há uma sequência disponível ou o áudio não está liberado, o som genérico anterior continua sendo usado.

O sintetizador segue o volume de efeitos, mute, pausa e velocidade do combate. Limita filas e vozes simultâneas, usa trechos curtos e volume menor nas passivas. Não muda a música nem o volume dos gritos. `FX.clear` encerra sons e notas pendentes desta camada.

## Movimentos e transformações

Os modelos de efeitos importam sequências numéricas `AFFINEANIMCMD_FRAME` e suas tabelas. A camada de efeitos aplica escala e rotação limitadas ao sprite do golpe, respeitando efeitos reduzidos. Não executa callbacks C nem emula toda a máquina de animação do GBA.

No Pokémon, `move-presentation.js` acrescenta um invólucro `.move-accent` ao redor de `.spr`. Somente essa camada recebe realce e uma deformação breve com origem nos pés. O sprite PMD, seus quadros, suas oito direções e o espelhamento não são alterados. Pokémon terrestres não recebem deslocamento vertical ou rotação nessa camada. Ao iniciar deslocamento, morrer ou terminar o efeito, o realce é removido. Durante movimentação não é iniciada outra transformação do corpo.

## Variações

O catálogo registra ramificações `choosetwoturnanim` como sequências separadas. Golpes com lados alternados escolhem uma variação por ativação. Golpes com preparação e execução usam o ramo de execução no combate atual, que não implementa turnos de carga do GBA. Cada lançamento recebe sua própria cópia do movimento e índice de variação, sem modificar dados compartilhados entre unidades.

Condições de concursos, trocas de Pokémon e todos os estados do jogo original não são emulados. Trata-se de uma adaptação das ramificações disponíveis ao sistema de combate contínuo.

## Fundos e transições

Dezessete fundos foram reconstruídos das folhas e mapas de tiles originais, incluindo Psychic, Ghost, Cosmic, Aurora, Ice, Water e Thunder. Ataques fortes/feixes/meteoros compatíveis podem exibir uma transição de 0,6s, limitada ao tabuleiro, abaixo das unidades e das prévias. Há somente um fundo especial de cada vez e intervalo mínimo de 0,8s entre entradas. A opacidade máxima é 14%, ou 5,5% com efeitos reduzidos. Não há flashes de tela inteira.

## Importação

Executar os importadores de golpes e áudio e `scripts/prepare-move-backgrounds.ps1` com a fonte em `tmp/emerald-source/pokeemerald-master`. Os arquivos distribuídos são locais; o jogo não precisa acessar o repositório para carregar os efeitos.

Não foram executados testes ou partidas para conferir o resultado audiovisual. A arquitetura mantém controles separados de apresentação e combate, mas a ausência de conflitos visuais ainda precisa de conferência em partida.
