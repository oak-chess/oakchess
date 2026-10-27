# Cura com múltiplas poções

A recuperação automática calcula quantas unidades do item escolhido são necessárias para completar os PS de cada parceiro vivo em campo. O percentual configurado continua sendo o gatilho para começar; iniciado o tratamento, a cura segue até 100% ou o orçamento permitido.

O cálculo respeita o estoque, a reserva e o limite de poções da expedição. O último item pode recuperar menos PS que seu valor nominal, mas não há consumo de poções adicionais após a vida completa. Max Poção e Full Restore precisam de uma unidade por parceiro. A contagem usada e o custo no registro da caçada incluem todas as unidades consumidas.

Revive permanece com uma unidade por parceiro desmaiado. Após reviver, a recuperação automática pode completar os PS com poções se a cura estiver ligada e os PS estiverem abaixo do gatilho configurado.

A ação manual Curar equipe também calcula a quantidade total para completar a vida e usa os PS atuais de combate. Preserva a regra anterior de estoque suficiente para todos os alvos: sem o total necessário, avisa e não consome nada. O botão mostra a quantidade prevista. Parceiros no banco, PC ou desmaiados não recebem poções. A cura manual mantém a independência das reservas/limites automáticos.

Teste: scripts/check-idle-full-healing.cjs verifica quantidades e custos, reservas, limite, tipos de poção, cura após Revive, vida atual do combate, estoque insuficiente e exclusão do banco/desmaiados.
