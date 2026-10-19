# Emblema de preparação e Pokébola de combate

`emblem-transition.js` é carregado apenas pelos protótipos de Articuno, Moltres e Zapdos. As plataformas registram seus próprios desenhos de emblema; a rotina compartilhada desenha o centro depois do cenário em cache e antes dos habitantes e efeitos.

Ao iniciar a simulação, o emblema desaparece e a Pokébola é desenhada em etapas: contorno circular, metades vermelha e clara, linha divisória e botão. Duração de entrada: 1,8 segundo. Ao voltar à preparação, a transição é revertida em 1,35 segundo. Trocar a fase durante a animação reverte o progresso atual, sem reiniciar abruptamente.

O relógio é o mesmo do ambiente: pausa interrompe a transição, câmera e perspectiva são preservadas. Movimento reduzido troca diretamente para o desenho correspondente. A animação não exige reconstruir as texturas da arena a cada quadro.

Sem integração no jogo principal e sem conferência visual no navegador.
