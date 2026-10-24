# Revisão de clareza da Jornada Idle

## Organização da tela

- Arena do OakChess preservada no centro.
- Treinador e equipe na lateral esquerda; PS e XP individuais visíveis.
- Navegação inferior com ícones: Caçadas, Pokémon, Mochila, Evolução, Captura, Jornada, Centro e Sinergias.
- Registro e recompensas com acessos próprios no canto superior direito.
- Sinergias em janela própria, sem sobreposição sobre a equipe.
- Azul do HUD do OakChess, detalhes dourados e textos em creme; barras de PS verdes e XP azul clara.

## Progressão corrigida

Referência documentada: [MultiPoke — Progressão](https://multipoke.io/pokepedia/guias/progressao) e [Evolução](https://multipoke.io/pokepedia/guias/evolucao).

O treinador e cada participante vivo recebem a XP inteira por inimigo derrotado. Reserva e desmaiados não recebem a XP daquela derrota. A progressão individual é independente. Curva por nível: `50 × (nível² − 3 × nível + 4)`. Subir de nível não cura PS. Os atributos do novo nível entram no próximo encontro.

Evolução manual no Centro Pokémon, fora da caçada: nível e pedras dos tipos da espécie de destino. Não exige ouro. Os cinco custos nativos do OakChess foram adaptados aos ranks D/C/B/A/S, com requisitos 30/60, 40/80, 60/120, 100/200 e 120/240 para linhas de três estágios. Linhas de dois estágios usam o segundo nível, com a receita correspondente. Eevee permite escolher sua evolução.

A fórmula de XP por inimigo, chance de pedras de 12% por tipo e associação entre custos e ranks são decisões demonstrativas deste protótipo, não regras universais dos PokéIdles. O balanceamento de ritmo ainda precisa de avaliação em jogo.

## Compatibilidade

Esquema 5. Progresso anterior preservado: nível, evoluções já realizadas, Pokémon e equipamentos não são removidos. A fração de XP do nível antigo é transportada para a curva nova. Uma cópia anterior fica em `journey-native-v2-before-progression-rework`, dentro do armazenamento isolado do protótipo.

## Limites desta revisão

Checagem de sintaxe dos módulos JavaScript realizada. Não foi possível fazer revisão visual nem jogar os fluxos no navegador desta sessão. A interface ainda precisa dessa avaliação; não há confirmação de ausência de falhas em execução.

## Revisão: recuperação, evolução e ícones

- Após derrotas, continuar é configurável na Mochila. A recuperação usa os Revives automáticos e respeita sua reserva; se não puder recuperar todos os desmaiados em campo, para sem consumir parcialmente os Revives.
- Poções curam parceiros vivos entre encontros, respeitando o limiar, a reserva e o limite configurados. Revive não é substituído por Poção.
- Requisitos por espécie substituem os ranks da revisão anterior: níveis próprios, pedras apenas nas espécies aplicáveis e troca assistida pelo Centro. A amizade continua na escala adaptada 0–100 do protótipo. Não é uma cópia integral das condições de todos os jogos principais.
- Evoluções por nível realizadas cedo no protótipo anterior retornam à forma compatível com o nível atual. Nível, XP e equipamentos são preservados. A correção é aplicada uma vez; formas não cadastradas ficam bloqueadas para evitar requisitos inventados.
- Ícones de Poké Bola, Poção, Revive, equipamentos, loot e materiais de evolução adicionados. Poção reutiliza a arte SVG existente; Revive e Pedra do Gelo usam novos ícones SVG locais.
- Loja oferece materiais específicos de evolução em aba separada. Preços são demonstrativos.
- Sintaxe conferida; fluxo em navegador ainda não validado.
