# Entrada da Torre em pixel art

Integração local do protótipo aprovado. A tela usa a ilustração existente de Mewtwo, moldura pixel art, progresso real, próximo chefe, percurso pelos doze setores e ação principal de continuar.

- Lê o salvamento oficial quando a Torre está liberada; caso contrário, lê o salvamento da prévia.
- Não retoma tentativas encerradas. Preserva a confirmação existente para substituir uma subida.
- Exibe o andar salvo e a contagem de andares efetivamente concluídos.
- Exibe o chefe do setor e o nome real do setor, mesmo antes do andar de chefe.
- Selecionar um emblema só muda a prévia selecionada; não muda o progresso da subida.
- Explorar abre confirmação com acesso ao salvamento independente do setor; mantém acesso à lista completa de setores.
- Recordes, voltar e informação de desbloqueio continuam funcionais.
- Interface adaptável, foco no botão principal e navegação por teclado do painel existente.

Verificação: compilação de sintaxe do menu e scripts inline. Sem conferência visual em partida nesta alteração. Nada enviado ao GitHub.

Sons de navegação: botões e emblemas da entrada usam SND.mnav, um toque de menu mais audível que o hover discreto anterior. Inicializa/retoma o áudio ao entrar no controle. Funciona com mouse e foco por teclado, ignora controles desabilitados e mantém o limite de repetição e o mixer do jogo. Ajuste local, sem publicação.

Feedback visual local: brilho dourado e varredura de luz no botão Continuar; elevação curta e iluminação nos setores e ações secundárias; destaque em Lendários e Voltar; resposta ao pressionar e contorno visível para teclado. Efeitos de movimento desativados com redução de efeitos do jogo ou preferência de movimento reduzido do navegador. Não publicado.

Desempenho local: a classe tower-entry-open suspende o trabalho do loop principal e dos sprites PMD enquanto a entrada da Torre está visível. O loop mantém seu relógio atualizado, evitando acúmulo de tempo ao fechar. A classe é removida pelo fechamento central dos painéis. Animações CSS do mundo/título são pausadas e o desfoque do overlay é desativado. Hover troca cor e borda imediatamente; só a elevação usa 70 ms. Removidas transições de filtro, sombra e cores e a varredura animada. Sintaxe compilada; tempo de resposta ainda não medido em navegador. Sem publicação.
