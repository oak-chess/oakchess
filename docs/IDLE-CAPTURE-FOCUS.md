# Foco de captura e capturados recentes

- Escolha a espécie em Capturados → Focar captura ou em Automação → Focar captura.
- Todos os Pokémon é o padrão; selecionar uma espécie restringe o arremesso à forma exata, sem alterar encontros, combate ou chances.
- O filtro vale para as tentativas normais online e offline. Outras espécies continuam descobertas e entram no histórico como sem tentativa, sem consumir bola nem disparar efeito de captura.
- Shiny de outra espécie também é ignorado, a menos que Capturar também shiny de outras espécies seja marcado. Esse extra começa desativado. A contagem de encontros shiny continua funcionando independente do arremesso.
- A lista mostra somente os habitantes da caçada atual. A escolha é salva e permanece ao trocar de caçada; se a espécie não habitar a nova área, aparece apenas como foco anterior indisponível, com aviso, até o jogador escolher outro alvo ou Todos os Pokémon. O Safari mantém suas próprias ações e automação.
- A caixa recente mantém o limite de 20 eventos e o contador da sessão. Inclui filtros de shiny, P4/P5 e IV ≥ 150, horário, destino, destaque shiny e atalho ao histórico completo.
- Novas capturas guardam um identificador de captura para abrir a ficha do membro correto, inclusive entre repetidos. Capturas vendidas ou convertidas em doce não abrem a ficha de outro parceiro.
- Verificação: scripts/check-idle-capture-focus.cjs e scripts/check-idle-automation-dashboard.cjs.
