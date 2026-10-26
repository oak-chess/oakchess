# Ficha do Pokémon — análise individual

A visão geral separa condição, atributos, IVs, Nature, potência, talento, golpes e evolução. Os números vêm de `ctx.stats`, `ctx.liveHealth`, `IDLE_XP` e `IDLE_INDIVIDUALS`; a interface não altera genes, atributos ou progressão. A velocidade de ataque mostra duas casas decimais e a unidade por segundo. A cor da vida muda conforme a condição, com o percentual escrito.

Os gráficos medem apenas IVs, sempre de 0 a 31. A soma mostra 0–186 e sua proporção; não representa chance de captura. O gráfico hexagonal usa seis eixos com escala idêntica, acompanhado das barras e dos valores acessíveis. Nature aparece como um efeito separado. Os bônus individuais são calculados por `IDLE_INDIVIDUALS.modifiers`, incluindo sua composição multiplicativa, e arredondados a uma casa decimal.

A comparação mantém o mesmo nível, espécie, forma evolutiva e forma alternativa para ambos os indivíduos. A lista e a tabela ficam em uma seção expansível. Favoritos, cadeados, manejo, treino e equipamentos mantêm suas ações anteriores.

Estilos específicos: `modes/idle/party-sheet.css`; a organização é restrita à ficha, sem mudar outras janelas. A visão geral foi conferida sem rolagem interna em 1440×1000 e 1366×768, incluindo quatro golpes. Telas menores mantêm rolagem vertical para preservar o conteúdo.

Verificações: `scripts/check-idle-party-sheet.cjs` cobre atributos, percentuais, escala dos IVs, comparação, ações e dimensões; `scripts/check-idle-party-iv-extremes.cjs` cobre IVs mínimos, perfeitos e um lendário com quatro golpes. Ambos usam saves artificiais e perfis temporários do Chrome, sem acessar o perfil do jogador.
