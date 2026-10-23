# Encaixe no jogo — revisão de 22/10/2026

Os cinco cenários são protótipos independentes, ainda não registrados entre as arenas do jogo.

## Compatibilidade encontrada

- Ambos usam 8 linhas, 7 colunas e banco de 9 posições.
- O jogo usa raio 42, espaçamento horizontal `sqrt(3)*42` e vertical 63. O protótipo agora usa as mesmas medidas, definidas em game-geometry.js.
- O banco real usa posições a cada 60 unidades; o protótipo agora adapta sua decoração para esses mesmos centros.
- O jogo projeta a arena por sua própria transformação; o protótipo agora reproduz a projeção nativa (38°, perspectiva 2200, escala 1,02, origem 640/400), com o mesmo ajuste da janela de 1280×800. Zoom e arraste são controles de inspeção; restaurar retorna ao enquadramento nativo. Na integração, não aplicar as duas projeções juntas.
- O carregamento de arenas aprovadas em index.html ainda não contém fábrica Rocket.

## Adaptação necessária

1. Usar os centros reais `hexXY` e `benchXY` para pisos, encaixes e emblema.
2. Criar um renderizador Rocket seguindo o contrato das arenas existentes, com camadas de cenário e campo separadas.
3. Remover Pokémon demonstrativos, treinador fixo, câmera, música e controles independentes na versão integrada. Usar as entidades e controles reais.
4. Vincular os cenários aos intervalos 1–10, 11–20, 21–30, 31–40, 41–50 da Operação Rocket; manter outros modos com suas arenas.
5. Manter decoração fora da superfície interativa, eventos de ponteiro desativados nas camadas decorativas e encerramento das animações ao sair do modo.
6. Conferir visualmente arraste arena/banco, seleção, barras de vida, efeitos, HUD, loja e eventos nas perspectivas disponíveis e em telas menores.

## Verificação executada

Execução isolada das funções de desenho dos cinco setores, em preparação e combate com alarme, com janela simulada de 1280×720, 1536×864, 1920×1080 e 390×844: sem exceções de JavaScript.

Essa execução usa contexto de desenho simulado: não valida aparência, carregamento dos sprites, desempenho, sobreposições nem cliques reais. O encaixe visual dentro do jogo permanece pendente da adaptação acima.

## Atualização de câmera e geometria

Comparação numérica dos centros das 56 casas e nove posições do banco com as fórmulas do jogo: diferença máxima de zero unidades. Desenho simulado dos cinco setores nas duas perspectivas e quatro tamanhos de janela: sem exceções. Ainda falta conferência visual no navegador e integração com entidades reais.
