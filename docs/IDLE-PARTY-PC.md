# Equipe e PC do Centro Pokémon

- O painel Pokémon mostra somente os parceiros da expedição, agrupados em campo e banco. Pesquisa e ordenação por nome ou nível.
- Ficha reorganizada: barras de PS e XP, atributos compactos, próxima evolução e abas de crescimento/equipamentos.
- PC acessível no Centro Pokémon, na equipe e no histórico de capturas. Armazenamento usa a coleção já existente; não recria indivíduos.
- Visualização em páginas de 30, busca, depósito, retirada para o banco e troca direta com um parceiro da equipe. Guarda favoritos, XP, PS e equipamentos.
- Novas capturas vão para o PC quando a arena está no limite, quando a equipe/banco não tem vaga ou quando a captura é offline. Os Pokémon do banco que já existiam permanecem lá.
- Consultar não pausa a luta. Transferir reorganiza a equipe e retorna à preparação no Centro Pokémon. O depósito impede deixar a arena sem nenhum parceiro; trocar pelo PC permite substituir o último sem perder a formação.
- Limite da expedição: capacidade atual da arena + nove posições de banco. Limite global de capturas existente (300 indivíduos) preservado.
- Sintaxe conferida; não foram executados testes nem validação visual em navegador nesta alteração.

## Lateral compacta da equipe
Treinador separado dos cartões individuais. Cartões arredondados com espaço entre eles, sprite, nome, nível e PS; XP em barra fina e valores completos no tooltip. Mantida a paleta Rocket com fundos grafite e destaques vermelhos. As barras mudam suavemente porque os elementos são preservados entre atualizações, em vez de reconstruídos a cada meio segundo. Efeitos de entrada e hover respeitam a preferência por movimento reduzido. Acesso à ficha continua no clique. Sintaxe conferida; resultado visual ainda precisa de avaliação no navegador.
