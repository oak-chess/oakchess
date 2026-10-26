# Automação da caçada em uma tela

## Objetivo
Substituir as cinco abas por três seções visíveis. Configurar os itens de uso comum sem navegar entre captura normal, shiny, recuperação e continuidade. Preservar opções avançadas, estado salvo e regras do jogo.

## Organização
1. **Capturar Pokémon**: bolas para normais e shiny lado a lado; destino dos repetidos e captura offline. Proteção por shiny, potência e IVs fica em uma seção expansível. Regras e chance shiny ficam em uma ajuda expansível.
2. **Recuperar a equipe**: ativação de cura e Revive, seleção dos dois itens, limiar de PS e estoque atual. Reservas e limite de consumo ficam em uma seção expansível.
3. **Continuar a caçada**: avançar ondas automaticamente e continuar depois de derrotas quando for possível recuperar a equipe.

Não existe botão de aplicar. Os controles mantêm os handlers de captura e suprimentos existentes e salvam ao mudar. A apresentação compacta é opcional nos renderizadores compartilhados; demais consumidores mantêm a apresentação original.

## Compatibilidade
`open('shiny')`, `open('recovery')`, `open('expedition')` e `open('protection')` continuam funcionando: focam a configuração correspondente e abrem a proteção quando necessário. Recriar a tela preserva rolagem, foco e seções expansíveis.

`automation.css` mantém a paleta Rocket e a organização em duas colunas no desktop; em telas estreitas, as seções ficam em uma coluna com rolagem. Não altera captura, limites, reserva, custos ou combate.

## Validação
`scripts/check-idle-automation-dashboard.cjs`: todas as opções persistem, incluindo bolas separadas, repetidos, offline, proteção/limiares, itens de recuperação, reservas, limite, cura, Revive, avanço e continuidade após derrota. Confere recarregamento, atalhos antigos, preservação da rolagem e larguras 1440/1366/900/600, com progresso isolado.
