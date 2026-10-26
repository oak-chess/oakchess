# Paleta Rocket compartilhada no Idle

`modes/idle/rocket-theme.css` é carregado depois dos estilos específicos de cada painel e antes da inicialização do Idle. Não altera o modo campanha ou a torre.

## Aparência
- Fundos preto/grafite e cartões em tons escuros de magenta.
- Ações e seleção em vermelho vivo; ações secundárias em magenta.
- Amarelo em títulos, avisos e foco de teclado.
- Controles com acabamento discreto em pixels, mantendo tamanhos e organização existentes.
- Configurações recebem regras específicas para superar a paleta marrom do tema nativo.
- Caixa de capturados e cartão rápido do Pokémon seguem os mesmos fundos.

## Preservado
Tipos de Pokémon, potência/qualidade, IVs, atributos, vida, mensagens de requisito cumprido e estados dos eventos mantêm suas cores de significado. Sprites e artes dos ginásios continuam próprios. Valores, custos, salvamento, probabilidades e combate não mudam.

## Verificação
`scripts/check-idle-rocket-theme.cjs` percorre equipe, ficha, mochila, evolução, PC, loja, caçadas, registros, automação, Jornada, perfil, tarefas, incubadora, formações, Base, laboratório, Pokédex, eventos e configurações com save isolado. Verifica superfícies, ausência de transbordamento horizontal, cor de vida, gráfico de IVs e cadeado. Prévia visual salva de ficha, loja, Jornada, incubadora, PC e configurações.

Também foram executados os testes da ficha (`check-idle-party-sheet.cjs`) e dos painéis da coleção (`check-idle-collection-panels.cjs`).
