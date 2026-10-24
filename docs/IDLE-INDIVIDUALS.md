# Perfis individuais — Jornada Idle

## Escopo e isolamento
Esta implementação altera somente arquivos em `prototypes/idle-journey/` e esta documentação. `index.html` da raiz e os módulos compartilhados dos modos Campanha, Torre e Operação Rocket não foram editados para esta funcionalidade. O módulo `individuals.js` é importado somente pelo HTML do protótipo. Os cálculos operam sobre unidades de combate e cópias de atributos; não alteram a tabela nativa de espécies ou de passivas.

Antes de migrar, o protótipo guarda uma cópia em `journey-native-v2-before-individuals`, no seu armazenamento isolado. Nível, XP, evolução, equipamentos, estoque e favoritos existentes são preservados.

## Referências
- [MultiPoke — IV e DNA](https://multipoke.io/pokepedia/guias/ivs): seis atributos individuais, preservados na captura e evolução.
- [Idle Poke Moon — Natures](https://idlepokemoon.com.br/pokepedia/sistemas/natures): 25 Natures; bônus de 10% e penalidade de 10%, ou efeito neutro.
- [Idle Poke Moon — Habilidades](https://idlepokemoon.com.br/pokepedia/sistemas/habilidades): habilidades próprias da espécie, com efeitos adaptados ao jogo.

Não se trata de copiar integralmente as regras de um desses projetos: eles usam escalas, sorteios e formas de desbloqueio diferentes.

## Regras do protótipo
- Seis IVs de 0 a 31: PS, Ataque, Defesa, Poder, Resistência e Velocidade. Cada IV ajusta o atributo entre −6% e +6%, antes da Nature e do talento. Sorteio uniforme por atributo; total 0–186. Não usa a distribuição de 1–32 do MultiPoke.
- 25 Natures da série. Vinte alteram dois atributos em +10%/−10%; cinco são neutras. No protótipo já vêm definidas no indivíduo, sem revelação ou rerrolagem paga.
- Qualidade de novas aparições: faixa 95–110%, com valores altos menos frequentes. Multiplica os seis atributos. Valores antigos são preservados.
- Talento idle sorteado de uma lista por papel/tipos da família: Vigor, Concentração, Ímpeto, Resiliência ou Agilidade. São talentos próprios do OakChess, não habilidades canônicas renomeadas.
- As passivas nativas das espécies permanecem separadas, com os efeitos já existentes. O talento complementa a passiva; não executa novamente sua lógica.
- O perfil do selvagem é definido na geração do encontro. Prévia e combate reutilizam o perfil, e a captura preserva os dados do indivíduo selecionado. Captura offline gera seu próprio indivíduo.
- Evolução, depósito e retirada do PC preservam os dados. Indivíduos antigos sem perfil recebem dados derivados de seu identificador persistente, uma única vez, sem mudar nível nem inventário.

## Ficha
- Cabeçalho com Nature, total de IVs e qualidade.
- Resumo curto do talento na visão geral.
- Aba **Perfil e IVs** com seis barras, bônus e penalidades, passiva nativa e talento idle separados.
- Comparação de repetidos usando a mesma forma e nível, sem equipamentos ou bônus de situação. O total de IVs não é apresentado como medida única de força.
- Resumo do perfil também aparece no PC.

## Limites
A fórmula é adaptada aos atributos do motor OakChess, não aos atributos dos jogos principais. Os valores precisam de avaliação de balanceamento. O sistema não inclui breeding, rerrolagem de IVs/Nature nem habilidades canônicas novas por espécie nesta entrega.

Foi feita checagem de sintaxe e de referências de importação. Não foram executados testes nem validação visual em navegador; isso não é confirmação de ausência de falhas em execução.

## Atualização: potência P1–P5 substitui qualidade percentual
Esta seção substitui as regras anteriores de qualidade 95–110%. Referência: https://pokeidle.io/terms (consultada nesta implementação).

| Potência | Chance em novos perfis | Bônus OakChess |
|---|---:|---:|
| P1 | 74,495% | 0% |
| P2 | 20% | 5% |
| P3 | 5% | 10% |
| P4 | 0,5% | 18% |
| P5 | 0,005% | 30% |

P4 e P5 têm bônus adaptados, diferentes dos 25% e 100% publicados pela referência. O bônus aplica-se uma vez aos seis atributos, independentemente dos IVs, Nature e talento. Não modifica a chance de sucesso da Poké Bola. O perfil continua definido no encontro e é preservado na captura/evolução/PC. Não há rerrolagem de potência.

Migração: qualidade antiga até 100% vira P1; acima de 100% até 105% vira P2; acima de 105% vira P3. O valor anterior fica em legacyQuality. Nenhuma captura antiga recebe sorteio adicional, e nenhuma perde nível, XP, Nature, IVs ou itens. quality permanece somente como valor derivado de compatibilidade; o cálculo usa potency. O backup journey-native-v2-before-potency é gravado antes da normalização.

A ficha apresenta o selo, o bônus e uma explicação recolhível das chances. O PC permite filtrar por potência e ordenar por nível, potência ou IV total. Estes arquivos pertencem somente ao protótipo Jornada Idle. Sintaxe conferida; combate e interface ainda dependem de validação em jogo.
