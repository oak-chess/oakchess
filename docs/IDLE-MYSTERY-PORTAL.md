# Portal misterioso

## Regras

- Sorteia uniformemente entre lendários e míticos desbloqueados. A Equipe Rocket não participa.
- A descoberta fica salva até uma entrada paga. Reabrir, treinar ou usar F5 não muda o adversário.
- Evita repetir a última descoberta quando há outra opção desbloqueada.
- Revelar não consome tentativa. A entrada paga usa uma das três tentativas, com recarga de uma a cada 20 minutos.
- Treino gratuito conserva a descoberta e não concede recompensas. Derrota e interrupção não devolvem uma entrada paga.
- O arquivo consulta requisitos e recompensas; não permite selecionar o próximo lendário.
- Recompensas e força dos bosses permanecem nas regras existentes.

## Aparência e animação

Arte gerada com a ferramenta integrada de imagens, a partir do conceito aprovado pelo jogador. Arquivo: modes/idle/assets/mystery-portal/approved-platform.png.

Prompt da edição: preservar enquadramento, plataforma, painéis, materiais, cores e botões da arte aprovada; remover somente a silhueta fixa para inserir o Pokémon real do jogo; completar o espaço com luz ciano e partículas holográficas.

Sobre a arte, um canvas desenha os arcos de luz da plataforma, partículas ascendentes, indicadores luminosos e a varredura. Antes da descoberta, silhuetas pretas e apagadas alternam lentamente. A revelação intensifica a energia por 4,2 segundos, alternando silhuetas cada vez mais devagar até mostrar o resultado em cores. Com movimento reduzido, usa uma transição curta sem roleta. O Pokémon revelado usa o sprite do catálogo vivo.

O desenho usa até 52 partículas a 30 quadros por segundo, somente com o portal visível. Ao fechar ou acessar o arquivo, a animação para. A preferência de movimento reduzido usa iluminação estática.

Os contadores e as ações são controles reais sobre a arte. O tamanho se ajusta à área útil do jogo, preservando a proporção de 3:2.

## Verificação

scripts/check-idle-mystery-access.cjs verifica sorteio, persistência, bloqueios, não repetição, tentativas e recompensas.
scripts/check-idle-mystery-browser.cjs verifica o painel real, animação, arquivo, F5 e combate.
scripts/check-idle-legendary-access.cjs preserva as verificações anteriores de economia e recuperação de falhas.

## Áudio

A tela usa a trilha Pokémon de ruínas já instalada, pelo mixer nativo; não cria uma segunda música sobre a cena anterior. Abrir/fechar e entrar no arquivo restauram a seleção normal. Sons originais sintetizados acompanham os botões, carga, cada giro e revelação. A música abaixa temporariamente durante a roleta para destacar os efeitos. Volume de efeitos e Silenciar tudo são respeitados; fechar interrompe as notas pendentes.

Ajuste das ações: a arte approved-platform-actions-v2.png remove somente a legenda fixa do botão vermelho, por edição com a ferramenta integrada de imagens. Prompt: preservar toda a interface e retirar apenas REVELAR ENCONTRO, mantendo emblema, seta, moldura e gradiente. O texto agora é vivo, sobre fundo transparente. Treinar tem botão próprio com largura alinhada à ação principal e espaçamento antes do arquivo.

A camada visual usa uma máscara que acompanha a moldura tecnológica. O cenário externo da ilustração não aparece ao redor do painel; posições dos controles e animações permanecem na mesma proporção.

O atalho usa o sprite animado original de Hoopa em assets/dex/pmd/720/Idle-Anim.png. Ele voa livre no cenário; um anel dourado se forma à frente e abre o portal em um ciclo de 7,2 segundos. Uma legenda compacta aparece no mouse/foco. O relógio não reinicia a animação. Movimento reduzido mantém a cena estática. As invasões Rocket continuam separadas.

Os controles ficam acima das camadas decorativas. Bloqueios de entrada são mostrados dentro do portal e não consomem tentativas. O cabeçalho do arquivo separa o retorno ao portal e o fechamento, sem sobreposição.
