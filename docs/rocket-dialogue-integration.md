# Diálogos Rocket integrados

`assets/rocket-dialogue.js` e `.css` aplicam a apresentação aprovada ao painel real de `rocket-operation.js`. O protótipo continua independente. Celadon e Lavender compartilham a apresentação.

O host continua criando os botões e associando suas ações reais. A camada move o rodapé, preservando os mesmos elementos, índices e ouvintes. Seletores de Pokémon, caminhos, equipamentos e compras permanecem no corpo. Textos introdutórios e parágrafos narrativos viram páginas de diálogo, com até aproximadamente 210 caracteres por página.

Espaço revela/avança o texto; setas movem o foco nas opções; Enter confirma a opção focada, usando o tratamento existente do host. Tab mantém a contenção de foco. V usa o sistema real de ver tabuleiro. A escrita pausa enquanto o tabuleiro está aberto ou o documento está oculto. Encerrar o painel cancela temporizadores e observadores.

Sons de navegação e confirmação usam SND. Escrita usa tons curtos após interação do usuário, respeitando CFG.mute e CFG.sfx. Movimento reduzido mostra a página imediatamente. Nenhum novo salvamento ou recompensa é introduzido.

Os eventos especiais podem adicionar a arte após a criação do painel; o observador remove o personagem substituto e recolhe parágrafos narrativos adicionais. Erros de sprites conhecidos da médium e Sr. Fuji são evitados usando os recursos locais correspondentes.

Manifesto de recursos regenerado. Não foram executados testes nem conferência visual na partida nesta entrega. Não publicado remotamente.
