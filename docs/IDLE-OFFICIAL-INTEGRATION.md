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
