# Restaurar a caçada após recarregar

A localização escolhida agora é guardada em hunts.selectedLocation com região e habitat. O carregamento restaura esse destino antes de criar o mundo, a arena e os encontros. A onda usa o valor atual do mesmo destino ou waveByArea quando a seleção foi trocada imediatamente antes do F5.

Para saves anteriores sem esse campo, usa a chave de rota salva (quando pertence à região atual), ou o habitat salvo válido, em vez de reconstruir a caçada pela atividade padrão. Não infere destinos inválidos nem reinterpreta um save novo sem caçadas.

Selecionar uma caçada, trocar de região pela Jornada ou recuar automaticamente atualiza o destino. Os salvamentos periódicos e de saída preservam a seleção consistente. O recuo por derrota continua intencional e não é desfeito pelo restaurador.

Validação: scripts/check-idle-hunt-location.cjs verifica estado legado/conflitante e mapas de ondas; scripts/check-idle-hunt-location-browser.cjs verifica a troca para Cânions, recarregamentos imediatos e consecutivos, região explícita e recuo real. scripts/check-idle-global-hunt-search.cjs mantém a cobertura da viagem pela busca.
