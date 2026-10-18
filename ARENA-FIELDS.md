# Efeitos persistentes da arena

`assets/arena-fields.js` desenha os campos de combate usando os sprites e paletas do catálogo Emerald. A camada é inserida entre o tabuleiro e os Pokémon dentro de `arenaView`, acompanhando a perspectiva e a escala da arena sem cobrir unidades ou HUD.

| Campo | Visual |
|---|---|
| Fogo e incêndio | Brasas e chamas sobre marcas quentes |
| Água | Superfície azul com partículas de água |
| Eletricidade | Faíscas sobre casas marcadas |
| Água eletrificada | Água e faíscas combinadas |
| Gelo e geada | Cristais e marcas de gelo |
| Planta | Vinhas sobre raízes em pixel art |
| Canteiro curativo | Flores e vinhas |
| Veneno | Bolhas roxas |
| Plantas envenenadas | Vinhas e bolhas venenosas |
| Vapor | Fumaça clara |
| Terra e pedra | Fragmentos sobre marcas de solo |

## Ciclo de vida

O renderizador lê diretamente `B.fields`: não cria outro relógio de duração. As casas são selecionadas pelo mesmo `hdist <= radius` da aplicação de efeitos. Campos estreitos de rastros continuam ocupando uma única casa. Entrada e saída usam uma transição de opacidade curta dentro do tempo de vida real.

Reações encerram o campo anterior por `age = life`, e a nova camada deixa de desenhá-lo imediatamente. Também desaparecem campos removidos pelo limite de 12, campos expirados e campos de batalhas encerradas. `FX.clear` limpa a camada. Pausa e velocidade seguem as idades calculadas pelo combate.

`setArenaField` deixa de criar a antiga zona visual independente quando a camada nova reconhece o campo. Se o módulo não estiver disponível, mantém a zona antiga. Sprites ainda indisponíveis usam pequenas partículas em pixel art como alternativa.

Qualidade baixa usa uma partícula por casa; efeitos reduzidos usam duas. Não há temporizadores, sons adicionais nem alterações em dano, cura ou condições dos campos. Feixes, impactos e indicadores transitórios continuam sob responsabilidade do renderizador de golpes.

Resultado visual ainda não conferido em partida.

## Prévia dos golpes nos hexágonos

`assets/hex-attacks.js` acrescenta marcações de carga no mesmo canvas, abaixo dos Pokémon. Usa `B.t`, portanto pausa e velocidade acompanham a simulação.

- Feixes: traçado recalculado durante a carga e fixado com as coordenadas reais no disparo. Seleção de casas usa o mesmo segmento e a mesma largura `HW * .55` usados pelo dano. Uma faixa de iluminação percorre o traçado após o disparo; isso é visual, pois o dano do feixe continua instantâneo.
- Explosões e meteoros: área pelo mesmo raio em distância hexagonal. O meteoro fixa o local quando o jogo captura o ponto de queda.
- Projéteis: a casa sob o projétil se ilumina e a prévia restante acompanha a posição e o alvo atuais. Não marca dano ao longo do caminho; impactos simples afetam apenas o alvo, como antes.
- Investidas: o caminho calculado pela movimentação recebe marcação progressiva.
- Correntes: as conexões são marcadas apenas para os alvos escolhidos pela lógica existente.
- Cura, bônus e barreiras: prévia da área prevista para a habilidade. Alvos aleatórios de tempestades só são marcados quando são selecionados.

Contornos tracejados e preenchimento crescente indicam carga; contornos contínuos indicam ativação. A cor vem do elemento. Marcas breves terminam após o ataque; campos persistentes continuam seguindo `B.fields`. `FX.clear` remove todas as prévias. Nenhum tempo de dano, alvo ou regra de combate foi alterado. Prévia visual ainda não conferida em partida.

A prévia possui contorno escuro de contraste, borda elemental espessa, linha interna clara e uma faixa que sobe durante a carga. Partículas em pixel art convergem durante a carga e se espalham na ativação, com bolhas, cristais, faíscas ou folhas conforme o elemento. A casa sob o projétil recebe destaque adicional. Partículas usam o relógio da batalha, sem temporizadores adicionais; há orçamento global por quadro conforme a qualidade. Efeitos reduzidos diminuem partículas e movimento e removem a pulsação e o deslocamento do tracejado.

### Variações por elemento e cobertura das habilidades

Todas as famílias de habilidades possuem entrada no sistema: feixe, explosão, área centrada, investida, drenagem, múltiplos alvos, correntes, tempestade, cura, campo, barragem, meteoro, bônus e barreira. A seleção de múltiplos alvos produz prévias individuais quando a lista real é escolhida; barragens marcam cada projétil emitido. Tempestades e meteoros carregam somente suas casas de queda enquanto o projétil desce, sem sugerir uma coluna inteira de dano.

As assinaturas gráficas incluem rachaduras com fase deslocada pela distância para Terra/Pedra, raízes para Planta/Inseto, linhas onduladas para Água/Voador, cristais descendentes para Gelo, brasas/bolhas para Fogo/Veneno e contornos expansivos para Psíquico/Fantasma/Fada/Dragão/Sombrio. Os demais elementos mantêm contorno, partículas e um sinal central. São variações visuais sobre o alcance existente; não acrescentam ondas de dano ou novas habilidades ao elenco.

Golpes passivos de contato, cura e proteção também recebem uma marca menor no alvo, além dos projéteis passivos que já usavam o sistema. A ativação acompanha o callback do golpe. Qualidade baixa omite os desenhos internos adicionais; efeitos reduzidos diminuem o movimento. Não foram executadas partidas para avaliar o resultado visual.

### Reações defensivas e teleporte

`assets/reactive-previews.js` acrescenta pulsos menores na casa protegida ao executar `FX.shieldFx`, incluindo escudos reativos, barreiras de aliados e proteção concedida pelas passivas. Couraça/Robustez e campos defensivos também indicam sua ativação. Reflexão de dano, Ponto Venenoso e Corpo Amaldiçoado mostram uma conexão curta do defensor ao atacante somente quando o gatilho real ocorre. Teleportes marcam separadamente origem e destino, sem sinalizar dano nas casas entre eles. Mobilidade com esquiva/aceleração recebe um pulso de Voador no destino.

Pulsos repetidos da mesma defesa são limitados visualmente a um por 0,3s por unidade, sem limitar seu efeito de combate. Os sinais usam o relógio e a limpeza já existentes. Não alteram probabilidades, escudos, dano ou deslocamento.
