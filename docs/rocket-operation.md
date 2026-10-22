# Operação Rocket — Celadon

Primeira operação jogável do modo de infiltração, com dez etapas e combate na arena existente.

## Entrada e equipe

- Biblioteca → Operação Rocket → Iniciar ou continuar.
- Escolha três entre Bulbasaur, Charmander, Squirtle, Voltorb, Gastly e Machop.
- 100 de vida, 10 de ouro, nível 4, sem objetos iniciais.
- Loja com linhas originárias de Kanto; lendários excluídos.
- A campanha, a Torre e a Operação Rocket possuem salvamentos independentes.

## Caminhos

| Etapa | Caminho A | Caminho B |
| --- | --- | --- |
| 1 | Patrulha | Celas |
| 2 | Celas | Depósito |
| 3 | Contrabandista | Abrigo |
| 4 | Terminal | Patrulha arriscada |
| 5 | Celas | Oficial arriscado |
| 6 | Abrigo | Contrabandista |
| 7 | Depósito | Patrulha arriscada |
| 8 | Terminal | Contrabandista |
| 9 | Oficial | Celas |
| 10 | Giovanni | — |

Rotas são salvas antes da escolha. Equipes adversárias, equipamentos oferecidos e Pokémon presos persistem quando a página é recarregada. O estado da arena é salvo antes da batalha; fechar durante o combate retoma sua preparação, como nos demais modos.

## Alerta

- 0: oculto; 1: suspeita.
- 2: os próximos encontros recebem um reforço.
- 3: caminhos de patrulha passam a oferecer oficiais.
- 4: a próxima patrulha/oficial vira uma emboscada anunciada; ao entrar, o alerta cai para 2.
- A primeira derrota de cada etapa e as escolhas arriscadas aumentam o alerta em 1.
- Terminal reduz 2; esconder-se no abrigo reduz 1.
- Sem aumento por tempo decorrido; preparação sem contagem regressiva neste modo.

## Recompensas e derrota

- Patrulha: 6 ouro e 2 XP.
- Celas: 5 ouro, 2 XP e um resgate.
- Oficial: 9 ouro, 2 XP e um equipamento.
- Giovanni: 12 ouro, 2 XP, conclusão e Silph Scope como marco permanente.
- Derrota: dano base da etapa mais os sobreviventes vencedores. Empate também conta como derrota.
- Derrota exige nova tentativa no mesmo encontro; não concede ouro, cura ou itens.
- Vida zero encerra a tentativa.
- Equipamentos do depósito: escolha entre três ofertas salvas.
- Abrigo: +5 vida (limite 100), −1 alerta ou reforço de 12% de ataque/vida por uma batalha.
- Pokémon e suprimentos só podem ser comprados no contrabandista. Venda e organização continuam disponíveis na preparação.

## Resgates

- Ajudar: entra no banco com uma estrela. Banco cheio permite organizar a equipe e retornar à escolha, ou encaminhar para segurança.
- Segurança: conta como protegido, sem ocupar vaga.
- Reserva vigiada: um equipamento adicional por cela e +1 alerta. Não pode repetir após recarregar.
- Possibilidade de resgate shiny, sorteada e salva uma única vez.
- Resgate marca visto. Compra na loja registra; evolução mantém comprovante de compra. O comportamento vem da Pokédex compartilhada.
- Nenhum Pokémon da operação é transferido para a campanha.

## Extração e resultado

- Extração disponível após as etapas 3, 6 e 9, com confirmação de encerramento.
- Salvar e sair preserva a tentativa; extrair encerra.
- Pontuação: 100 por etapa, 150 por resgate, 50 adicionais por protegido, 1000 pela missão concluída, 5 por vida restante, penalidade de 25 por derrota limitada a 300.
- Registros deduplicados pelo identificador da tentativa, máximo de cem registros.
- Silph Scope persistente ao vencer Giovanni. Lavender e Silph Co. aparecem como expansões futuras, sem botões de operação jogável.

## Arquivos e integração

- `assets/rocket-operation.js`: estado, salas, persistência, resgates, conclusão e interface.
- `assets/rocket-operation.css`: identidade Rocket em preto, grafite, vermelho e prata; menu e indicadores.
- `assets/mode-art/rocket-base.svg`: capa vetorial própria da base.
- `assets/game-home/streaming.js`: terceiro cartão e entrada do modo.
- `assets/team-view.js`: botão V revela o tabuleiro real durante escolhas da operação.
- `index.html`: encaminha rodada, preparação, resultado, reinício e salvamento; restringe loja e isola efeitos exclusivos da campanha.

Armazenamento local: `oakchess_rocket_operation_v1`, sufixos `_records` e `_progress`.

## Estado de entrega

Implementação e recursos de distribuição preparados. Não foram executados testes de jogo ou validação visual no navegador. Equilíbrio inicial ainda depende de partidas completas e observação da experiência.
