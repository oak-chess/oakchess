# Torre dos Desafios — primeiro setor

> Histórico da implementação inicial. A versão atual possui 60 andares; consulte `TOWER-60-FLOORS.md` para o funcionamento completo.

## Escopo desta versão

Cinco andares independentes da campanha. A entrada oficial continua exigindo a vitória contra Mewtwo no Difícil. A opção de experimentar o setor está disponível antes do desbloqueio, usa outro salvamento e não registra pontuação oficial.

1. **Portão da Torre:** Geodude e Sandshrew; introdução sem perigo ambiental.
2. **Jardim Suspenso:** dois canteiros recuperam 4% dos PS máximos a cada 2 segundos, para ambos os lados.
3. **Caminhos da Torre:** combate comum ou elite com 30% mais PS e 15% mais dano; a elite concede 4 de ouro adicional e uma relíquia aprimorada.
4. **Refúgio da Chansey:** recuperar até 25 de vida, receber um equipamento ou preparar a próxima loja e receber 3 de ouro.
5. **Sentinela de Pedra:** Onix, Graveler e Sandslash. Onix inicia abalos ao cair abaixo de 50% dos PS. Duas colunas são anunciadas por 2,5 segundos; os ataques se repetem a cada 8 segundos.

## Jornada

- Escolha inicial entre Bulbasaur, Charmander e Squirtle.
- Pidgey e Geodude chegam ao banco; nível inicial 3, 10 de ouro e 100 de vida.
- Uma relíquia após cada vitória nos três primeiros andares; escolha entre três, sem duplicatas.
- Pokémon recuperam seus PS entre combates. Derrotas custam vida do treinador e permitem reorganizar a equipe.
- Ouro, XP e relíquias são concedidos apenas na primeira vitória de cada andar.
- Salvar e sair durante combate retorna ao ponto de preparação daquela batalha.
- Recordes locais específicos do primeiro setor; a prévia não entra na classificação.

## Relíquias

Concha Restauradora (regeneração), Pena do Impulso (velocidade de ataque), Raiz Persistente (cura quando permanece no hexágono), Núcleo de Reserva (defesas pelo banco, até quatro reservas), Medalhão do Último (escudo para o último aliado) e Cristal de Sintonia (dano para equipes com quatro tipos ou mais).

## Arquivos

- `assets/tower.js`: progressão, encontros, economia, escolhas, salvamento e mecânicas.
- `assets/tower.css`: menu, cartas, mapa, resumo e HUD.
- `assets/tower-art/feather.svg`: símbolo próprio da Pena do Impulso.
- O cenário utiliza as arenas existentes nesta primeira versão. A apresentação tem 14 artes novas em pixel art em `assets/tower-art/illustrated/`, além de duas composições com cenas novas e sprites locais.

## Direção visual

- Interface em pixel art, com a estrutura de cartas colecionáveis já usada nas bênçãos e nos desafios.
- A seleção fica diretamente sobre o cenário escurecido: sem um grande painel azul envolvendo as cartas.
- Botões compactos, com rótulos curtos; sem blocos grandes de texto dentro das ações.
- Informações principais sempre visíveis. Regras completas ficam em detalhes expansíveis.
- Ilustrações e sprites aparecem inteiros, sem recorte por preenchimento. Legendas ficam fora da imagem.
- A entrada é uma carta clicável com a nova ilustração completa do Mewtwo. As ações secundárias são botões pequenos abaixo dela.
- Imagens indisponíveis recebem um selo local em pixel art para evitar espaços sem arte.
- As três cartas de relíquia aparecem diretamente para escolha, sem pacote. As ofertas continuam persistidas no salvamento.
- As cartas mantêm a proporção vertical 63:95, as artes próprias e os cantos arredondados.
- Pacotes ficam reservados para futuros eventos com sorteio por carrossel, como os da campanha. A arte da embalagem está preservada para esse uso; esse carrossel ainda não foi implementado na torre.

## Persistência

- Tentativa oficial: `oakchess_tower_sector1_v1`.
- Tentativa de prévia: `oakchess_tower_sector1_v1_preview`.
- Recordes: `oakchess_tower_sector1_v1_records`.
- O modo não grava no salvamento da campanha, `pktft_save_v1`.
- Ofertas, equipamentos de refúgio e decisões são armazenados antes de abrir as escolhas.

## Próximas etapas

Andares 6–10, pactos, novos cenários próprios, outros chefes e recompensas cosméticas ainda não fazem parte desta versão. Os valores desta implementação são iniciais e precisam ser avaliados em partidas.

## Segundo setor — Santuário Psíquico (andares 6–10)

A subida agora continua após Onix, preservando equipe, ouro e relíquias. A passagem recupera até 20 PS do treinador e concede 4 XP uma única vez, ao entrar no andar 6.

6. **Galeria dos Ecos:** Kadabra, Drowzee e Jigglypuff evoluído. Dois focos recuperam 5% dos PS a cada 3s para os dois lados.
7. **Salão das Visões:** Haunter, Hypno e Golbat. Três posições ocupadas são marcadas com 2s de antecedência; a onda causa dano mágico de 10% dos PS máximos antes da resistência, para ambos os lados. Intervalo de 7s após cada onda.
8. **Provação da Mente:** Kadabra, Hypno, Mr. Mime e Venomoth. Escolha comum/elite, com recompensa de 8/12 ouro e relíquia normal/aprimorada.
9. **Refúgio dos Sonhos:** recuperar até 30 de vida, equipamento ou loja renovada com 3 ouro.
10. **Oráculo da Torre:** Alakazam, Hypno e Mr. Mime. Anuncia três posições por 2s; onda mágica de 14% dos PS antes da resistência. Abaixo de metade dos PS, anuncia cinco posições e reduz o intervalo de 7s para 5s.

- Mapa e indicadores mostram apenas os cinco andares do setor atual; o contador geral vai até 10.
- Os salvamentos anteriores ainda ativos continuam compatíveis; tentativas já encerradas permanecem encerradas.
- Recordes antigos mantêm o total de cinco andares; novos recordes usam dez.
- **Prévia · Setor II**, na entrada da torre, inicia diretamente no andar 6: nível 5, 25 ouro e os três companheiros com duas estrelas. Usa salvamento separado (`oakchess_tower_sector1_v1_preview_sector2`) e não registra recordes.
- As artes existentes de cristais e os sprites locais compõem as escolhas do setor psíquico. Não há pacote de relíquias.
- Alteração implementada sem execução de testes ou confirmação visual no navegador.

## Variedade de relíquias

- Conjunto ampliado de 6 para 24 relíquias, incluindo mana inicial e regeneração, PS, dano básico, habilidades, roubo de vida, resistências, crítico, escudo inicial e efeitos de posicionamento.
- Ampulheta Viva ativa velocidade após 10s; Luz do Recomeço cura uma vez por Pokémon ao cair abaixo de 35% dos PS.
- A subida guarda `seenRelics`, incluindo opções recusadas. O sorteio prioriza cartas ainda não apresentadas e exclui as já escolhidas. As seis escolhas previstas usam 18 ofertas, menos que o conjunto de 24.
- Um histórico local das últimas 72 ofertas prioriza as menos recentes entre subidas. Prévia e modo oficial possuem históricos separados. Atualizar a página mantém as ofertas salvas.
- As 18 novas cartas combinam cenários ilustrados existentes com objetos em pixel art locais. Nenhum arquivo de imagem externo novo é necessário.
- Salvamentos anteriores são aceitos; o histórico passa a ser construído a partir da atualização.
- Não foram executados testes de combate.

## Animações dos perigos

- Abalo do Onix: pedras e poeira saem de todos os hexágonos das colunas atingidas, com rachaduras que desaparecem em 0,9s, anéis de impacto e reação no lançador.
- Onda psíquica: explosão e anéis de energia em cada posição marcada, inclusive vazia; Alakazam conecta os alvos com feixes breves.
- Os efeitos iniciam no mesmo instante da aplicação do dano. Usam o relógio do combate e não usam temporizadores externos; as marcas finais somem ao encerrar a luta.
- A opção de efeitos reduzidos diminui partículas e dispensa os feixes adicionais.
- Implementado sem execução de testes de combate.
