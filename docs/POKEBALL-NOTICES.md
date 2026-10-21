# Notificações com Pokébola

Integração local do protótipo aprovado: Pokébola cai de cima, abre e libera luz para os lados; o texto surge com a luz, sem caixa retangular ou cantos. A névoa azul escura sob a mensagem preserva a leitura sem bloquear a arena.

Usa a fila NOTICE já existente, preservando prioridades, limite de três avisos, deduplicação e atualização por chave. A atualização de um aviso ativo altera só o conteúdo e o nível, sem destruir a animação. A duração de leitura anterior é preservada e acrescida de 0,95 segundo para entrada e 0,5 segundo para recolhimento. Interrupções cancelam o quadro anterior e o observador de tamanho.

Recursos: sprite local da Pokébola via ITI; notificações mantêm o HTML e os ícones originais. Som usa playNoticeTone e seu controle de volume. A preferência de movimento reduzido troca deslocamentos e partículas por aparição suave. Sem novos downloads ou bibliotecas. Se o módulo falhar, usa a notificação anterior.

Verificação: compilação de sintaxe do módulo e scripts inline. Sem conferência visual em partida nesta alteração. Não enviado ao GitHub.

## Conquistas e resumo de batalha

Notificações laterais agora usam a mesma revelação com luz, lançando a Pokébola pela direita. Reutiliza os elementos existentes, preservando os botões de detalhes/dispensa, acesso ao caderno de conquistas, contagens, foco e pausas de duração ao passar o mouse. Remove só a moldura retangular e o ícone decorativo anterior. Os painéis completos de conquistas e relatórios permanecem com seu layout anterior. Conteúdo e estados de fila continuam nos módulos originais. Observador encerra a animação se a notificação for ocultada. Sem publicação.
