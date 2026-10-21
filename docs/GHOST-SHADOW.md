# Avanço pela sombra

A apresentação aprovada foi integrada ao deslocamento `shadow` de `blinkBehind`.

- Gastly, Haunter e Gengar afundam na própria sombra, deslizam no chão e emergem ao lado do alvo.
- O contorno e o rosto na sombra respeitam a espécie. Misdreavus, que também já possui a passiva, tem um desenho próprio.
- Outros estilos de teleporte conservam os efeitos existentes.
- Destino, ocupação das casas, alcance, dano e intervalo da habilidade continuam sob as regras originais. O deslocamento da sombra é uma apresentação visual do teleporte.
- A animação usa o relógio do combate, acompanha pausa e velocidade e limpa suas camadas na derrota, troca de rodada ou interrupção. Também aparece nas batalhas demonstrativas da tela inicial.
- Há fallback para o efeito anterior caso o sprite ainda não esteja pronto.

Fontes: `scripts/ghost-shadow-runtime.txt` e os desenhos aprovados em `prototypes/ghost-shadow/impact.js`. Gerar `assets/ghost-shadow.js` com `node scripts/build-ghost-shadow.cjs` após alterações.

Sintaxe conferida; conferência visual da integração em combate real ainda pendente. Não houve publicação nesta etapa.
