# Padrão visual dos menus idle

O tema compartilhado está em `prototypes/idle-journey/menu-theme.css` e se aplica somente ao protótipo.

- **Caçadas:** cartões com sprites; selecionar abre detalhes da área. Configurações de ondas, rastreamento e contratos ficam em Expedição, separadas da escolha da área.
- **Captura:** chance, peso de encontro e prioridade recolhidos em detalhes do cartão.
- **Loja:** produtos em cartões; descrição de efeito aberta sob demanda, com preço e estoque visíveis.
- **Mochila:** grupos preservados com cartões arredondados, melhor espaçamento e rolagem interna.
- **Centro Pokémon:** seis serviços independentes; descanso e boletim abrem sua própria visão. PC segue com painel próprio.
- **Jornada, evolução, pesquisa, relatórios e PC:** molduras, abas, botões, campos e cartões harmonizados ao padrão da equipe.
- Mantida a paleta Rocket de grafite, branco e vermelho/vinho. Transições discretas; preferência de movimento reduzido respeitada.

Consultar os menus mantém o combate em andamento. Ações de alteração de equipe, troca de caçada, descanso e desafios preservam suas regras de pausa anteriores.

Revisão de integração e sintaxe realizadas. Não houve execução de testes nem validação visual no navegador nesta tarefa.

## Jornada e ginásios
O mapa agora usa as oito insígnias como seletores. A ficha de cada ginásio mostra cidade, sprite do líder, especialidade, insígnia e os Pokémon efetivamente configurados para o desafio do protótipo. As equipes não são apresentadas como cópias das equipes de uma edição específica dos jogos principais. Estados de bloqueio e conquista são indicados na insígnia; rota e estratégia ficam em detalhes recolhidos. Os sprites reutilizam os arquivos locais Showdown/trainers, PokeAPI/badges e Pokémon já presentes no projeto. Sintaxe conferida; apresentação ainda precisa de revisão no navegador.
