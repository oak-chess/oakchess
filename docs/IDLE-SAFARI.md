# Safari de Fuchsia — plano e regras da primeira versão

## Escopo
Área própria dentro de Caçadas, sem combate. Quatro setores: campo, bosque, lago e rochedos. Exige a insígnia de Erika (acesso a Fuchsia); pescar no lago exige a vara já existente.

## Expedição e equilíbrio
- Uma entrada gratuita por dia civil de São Paulo, sem acumular. Após usá-la, entradas extras custam 200 ouro.
- Cada entrada fornece 20 Safari Balls e 100 passos exclusivos. Buscar um encontro custa 5 passos; cada ação no encontro custa 1. Com 5 passos ou menos e nenhum encontro, a exploração termina.
- Bolas e passos restantes não viram itens ou ouro. Não há XP, loot ou vitórias de caçada.
- Níveis fixados em 25–35 por setor, sem escalar com o treinador. Genes usam o gerador atual, sem bônus novo de IV, potência ou shiny.
- A garantia shiny de 4.000 Pokémon elegíveis é compartilhada com as caçadas, além da chance aleatória de 0,0122%; qualquer shiny encontrado reinicia a sequência. Veja `IDLE-SHINY-GUARANTEE.md`.
- Fórmulas próprias do OakChess, não uma reprodução exata de qualquer geração: captura = 12% + 60% × taxa da espécie / 255; fuga = 12% + 28% × (1 − taxa / 255).
- Alimento por três ações: captura ×0,7; fuga ×0,5. Aproximação por três ações: captura ×1,35; fuga ×1,6. Não acumulam; uma postura substitui a outra. Fuga é rolada após ações e bolas que falham, nunca após captura bem-sucedida. Chances limitadas a 95%.

## Capturas
Revelar IVs e potência somente após capturar. Sempre guardar no PC (máximo 300), sem converter em doces. Aplicar as regras existentes de cadeado automático e registrar na Pokédex, objetivos de coleção, histórico geral e caixa de capturados. Safari Balls não alteram o estoque normal.

## Interface e automação
Mapa de setores na lateral, encontro no centro e chances/ações abaixo. Navegação por mouse e teclado, botões de tamanho moderado, resumo ao concluir. Automação com alvos: todos, espécies ainda não capturadas ou espécie escolhida; shiny sempre recebe tentativa. Usa Safari Balls diretamente, com os mesmos custos e probabilidades do manual. Não troca de setor sozinha.

## Salvamento e interrupções
Salvar recursos, genes do encontro e resultados após cada ação. Reabrir ou recarregar não rerrola o encontro nem concede uma nova entrada. Fechar o painel, trocar de aba ou abrir outro menu interrompe a automação; a expedição fica suspensa e pode ser retomada. Não simular Safari offline. A caçada comum continua enquanto o Safari está aberto. Os recursos e resultados são independentes; desafios opcionais bloqueiam a entrada.

## Verificação
Testes determinísticos de custos, chances, alimento/aproximação, fuga/captura, passos/bolas esgotados, PC cheio, acesso, troca de dia e salvamento. Testes no navegador com save isolado para navegação, captura e registros, qualidade oculta, retomada, automação e limites visuais.

## Implementação concluída
- Acesso: **Caçadas → Safari**. Os setores ficam no painel próprio; a caçada comum continua durante a expedição.
- `safari.js`: regras e estado salvos em `state.safari`, com probabilidades e recursos independentes.
- `safari-ui.js` / `safari.css`: entrada, encontro, automação e resumo com capturas. Há confirmação antes de encerrar e descartar recursos restantes.
- Integração com `capture.js`: capturas mantidas no PC, proteção automática, Pokédex, coleção, histórico e caixa de capturados. Tentativas que falham não revelam IVs/potência.
- Históricos identificam Safari Ball e Safari de Fuchsia, sem adicionar a bola à loja ou ao estoque comum.
- `scripts/check-idle-safari.cjs`: regras determinísticas, bloqueios e retomada.
- `scripts/check-idle-safari-browser.cjs`: jogo real com save isolado, capturas, registros, recursos, encerramento, pausa ao trocar de aba/menu e larguras 1440, 1366, 900 e 600.
- Regressões verificadas: painéis de equipe/evolução/PC e cartão rápido do Pokémon.
