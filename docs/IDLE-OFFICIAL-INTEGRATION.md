# Integração oficial da Jornada Idle

- Entrada na biblioteca principal, ao lado de Campanha, Torre e Operação Rocket.
- Runtime e recursos próprios em `modes/idle/`, com base apontando para a raiz do jogo.
- Botão para salvar e retornar à biblioteca.
- Migração não destrutiva de `idle-sandbox:` para `oakchess-idle:`, sem substituir dados oficiais existentes.
- Recall da campanha não é inicializado dentro do modo idle; o módulo próprio controla treinador e eventos.
- Tutorial revisado para remover referências a protótipo e atualizar a origem dos equipamentos.
- Não houve publicação externa nem execução de testes nesta integração.

## Início novo solicitado
Substitui a migração descrita acima: não há importação do protótipo. A primeira abertura oficial remove somente chaves `oakchess-idle:` de uma eventual importação anterior e grava `official-start-v1`; depois, o modo mantém seus saves normalmente. Os dados do protótipo e dos demais modos não são alterados.

## Venda por arraste desativada
O modo Idle não executa sellUnit da campanha, inclusive pelo atalho de teclado. Soltar na região inferior ou sobre menus restaura a posição e não altera ouro, equipe ou equipamentos. A venda continua disponível somente no fluxo próprio da loja. A barra de venda herdada fica oculta. Correção aplicada ao modo oficial e à cópia histórica. Sem testes executados.

## Atalhos e pausa da campanha desativados
O handler nativo de atalhos não executa ações no idle (XP, loja, combate, visão, venda, mute e pausa). O atalho B da Mochila também foi retirado. Escape para fechar janelas e navegação por teclado dos controles permanecem. O botão superior de pausa e seu overlay ficam ocultos; togglePause da campanha não atua neste modo. A caçada é controlada pelo botão principal do idle. Sem testes executados.
