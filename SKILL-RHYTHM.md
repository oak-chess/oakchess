# Intervalo e reserva de habilidades

Cada unidade pode acumular mana equivalente a duas cargas. O custo de cada habilidade continua sendo `maxMana`: a capacidade passa a `2 * maxMana`. Ao lançar um golpe, somente uma carga é consumida. A segunda carga e qualquer fração restante são preservadas. Regeneração, acertos, dano recebido e bônus de mana respeitam a nova capacidade.

`assets/skill-rhythm.js` controla o intervalo pelo relógio de batalha. A habilidade espera a animação básica em curso terminar. Depois, bloqueia novos ataques do mesmo Pokémon por uma janela de animação específica da família:

| Família | Animação, em segundos de combate |
|---|---|
| Golpe simples, área centrada, contato | 0,75 |
| Drenagem, cura, bônus, barreira | 0,8 |
| Campo | 0,85 |
| Explosão | 0,9 |
| Feixe, corrente | 0,95 |
| Múltiplos alvos | 1,05 |
| Barragem | 1,3 |
| Tempestade | 1,5 |
| Meteoro | 1,55 |

Após essa janela há 0,4s de intervalo até a próxima habilidade. Projéteis associados ao lançamento são contados; enquanto houver um em viagem, outro lançamento não começa. Cada chegada garante ao menos 0,3s antes do próximo golpe. Ataques básicos podem voltar após a janela de animação, enquanto se espera a recarga. Efeitos persistentes de campo não impedem habilidades futuras pelo tempo inteiro de vida do campo.

As passivas não iniciam outro golpe a partir de acertos básicos durante a janela de animação ativa. Não gastam mana e mantêm seu intervalo próprio. Todas as janelas acompanham pausa e velocidade. Contadores são próprios de cada unidade de combate e não modificam o elenco salvo.

A barra de mana tem um divisor central para as duas cargas. Cor dourada indica mana disponível aguardando liberação; brilho indica habilidade em execução. O título da barra informa cargas e intervalo restante.

Esta alteração aumenta a capacidade de reserva, preservando o custo e as fontes de mana. O efeito sobre equilíbrio ainda não foi avaliado em partidas.
