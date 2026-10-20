# Loja compacta em pixel art

Os fundos externos das nove peças da interface foram extraídos com transparência real (`*-clean-v2.png`), eliminando os retângulos de cenário dos recortes. Os campos de ouro e probabilidades também cobrem completamente os valores estáticos das artes. A moldura das cartas usa fatias percentuais para manter o contorno ao mudar a resolução da imagem.

## Correção de fidelidade ao protótipo

As peças originais do modelo aprovado agora revestem os painéis de ouro, XP, ações da loja, probabilidades, cadeado, quantidade e batalha. Moldura das cartas reutilizada por recorte de borda; altura ajustada a 138px para preservar a proporção de carta do modelo. As cinco ilustrações do modelo são usadas nas respectivas espécies normais; demais espécies e shiny preservam sprites reais. Arquivos adicionais: assets/pixel-shop-approved.css e assets/ui-pixel-shop/. Os dados e ações continuam reais. Sem testes ou validação no navegador.

Aplicada à interface real de preparação, na campanha e na torre. O protótipo segue separado.

- Cartas de 112 × 112 no palco do jogo, molduras douradas arredondadas, cenário contínuo por tipo, nome e preço sobre degradê sem divisão horizontal. Sprites locais limitados por largura e altura, mantendo a proporção.
- Ouro e nível/XP em uma coluna de 132px à esquerda; Comprar XP e Rolar alinhados abaixo.
- Chances dos cinco custos em uma faixa acima da loja, com o cadeado ao lado sem painel redondo. Os números vêm das probabilidades reais do nível.
- Quantidade de Pokémon em uma faixa horizontal à direita, botão Lutar/Auto de 50px abaixo. Clique inicia; segurar por 650ms ativa Auto. Derrota continua desligando Auto.
- Eventos, compras, economia, sorteios, animações e arraste para vender continuam usando os controles e funções originais. Escolhas de relíquias e companheiros mantêm seus próprios layouts.
- Cartas e ações da loja aceitam Enter/Espaço. Shiny, falta de ouro, possibilidade de fusão e foco por sinergia continuam indicados.

Arquivos: assets/pixel-shop.css, assets/pixel-shop.js e integração em index.html. Foram reutilizadas as artes locais de assets/tower-art/illustrated. Sem execução de testes ou validação no navegador nesta entrega; sem deploy.
