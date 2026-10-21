# Interações aprovadas na arena

Integração local dos protótipos aprovados de Terremoto, Surf, Gelo, Fogo, Eletricidade, Vento, Pedra e Veneno.

## Origem e manutenção

- `assets/arena-interactions.js`: renderizadores e ciclo de vida em combate.
- `assets/arena-interactions.css`: reações do sprite, incluindo eletrocussão e redução de movimento.
- `scripts/arena-interactions-runtime.txt`: origem do controlador de produção.
- `scripts/build-arena-interactions.cjs`: extrai os renderizadores aprovados dos protótipos e os adapta ao combate. Executar após editar as fontes ou os protótipos de referência.
- Os protótipos separados continuam preservados em `prototypes/`.

## Comportamento

As animações exclusivas são identificadas pelo golpe: Surf (`SURF`/57), Terremoto (`EARTHQUAKE`/89) e tornados (`WHIRLWIND`, `TWISTER`, `HURRICANE`). Um golpe de Água não recebe automaticamente a onda do Surf; um golpe de Terra não recebe automaticamente a fratura do Terremoto; um golpe Voador não recebe automaticamente tornados. Campos genéricos de Água e Terra mantêm sua apresentação anterior. Fogo, gelo, eletricidade, pedra e veneno continuam como interações elementais no ponto de impacto.

| Interação | Piso e reação |
|---|---|
| Terremoto | Fragmentos irregulares do piso original, tremor independente por hexágono e reação rápida do atingido. |
| Surf | Onda contínua, respingos, superfície molhada e deslocamento visual dos atingidos. |
| Gelo | Piso com volume, reflexos e cristais; perda de aderência e deslizamento visual. |
| Fogo | Sprites de chamas do Emerald no piso e no corpo, brasas e marcas de queimado. |
| Eletricidade | Descargas pelo chão, arcos no corpo, flashes e vibração do sprite. |
| Vento | Tornados e giro em pé, desenhado pelas oito direções do sprite PMD. |
| Pedra | Fragmentos com faces iluminadas, sombras, rotação e saltos. |
| Veneno | Poças irregulares com profundidade, reflexos e bolhas. |

Os eventos são disparados pelos golpes que realmente acertam e pelos campos elementais existentes. Alvos são agrupados por lançamento; o efeito respeita o centro e o raio reais. Campos compostos mantêm suas regras: fogo ampliado usa chamas, água eletrificada usa descargas, geada usa gelo e esporos usam veneno. Grama, cura e vapor conservam a apresentação anterior.

Animações usam o relógio de combate. São limpas na troca de rodada e ao finalizar a batalha. Há limite de quatro apresentações simultâneas (duas no nível baixo de efeitos) e prioridade para os efeitos maiores. Reações sobre o mesmo alvo não são acumuladas.

O deslocamento dos Pokémon é visual e retorna suavemente à posição de combate. Não modifica dano, alcance, casa ocupada nem regras de colisão. A loja e os controles não tremem. Preferências de efeitos reduzidos são respeitadas; a preferência do sistema também reduz flashes e giro dos sprites.

## Conferência

Sintaxe dos scripts conferida. A integração ainda precisa de conferência visual em combate real; não foram executados testes automatizados nem publicação nesta etapa.
