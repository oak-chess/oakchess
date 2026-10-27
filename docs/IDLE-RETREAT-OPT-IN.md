# Recuo apenas por escolha explícita

O retorno à região inicial após derrotas era causado pela regra antiga: rota segura 0 e recuo após duas derrotas eram padrões ativos, mesmo sem o jogador ligar esse comportamento. A restauração após F5 não impede uma troca intencional feita por essa regra no fim da luta.

Agora world.retreatEnabled começa false, inclusive para saves antigos sem essa propriedade. Rota segura e número de derrotas anteriores são preservados como preferências, mas não provocam viagem até o jogador marcar Ativar recuo automático por derrotas em Formações → Recuo automático. Ativar/desativar zera a contagem antiga. Vitórias continuam zerando as derrotas consecutivas.

Trocar manualmente de região ou caçada também zera as derrotas acumuladas da tentativa anterior. Com o recuo desligado, derrotas mantêm a região e a caçada; a continuidade ainda depende das regras de Revive/Poções. Com recuo ligado, o destino é persistido normalmente e sobrevive ao recarregamento.

Validação: scripts/check-idle-retreat-opt-in.cjs usa o encerramento real de uma vitória e duas derrotas, recarrega, ativa pela interface e só então confirma a viagem após derrota. scripts/check-idle-hunt-location-browser.cjs verifica a persistência e o recuo explicitamente ativado.
