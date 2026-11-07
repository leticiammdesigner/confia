# Decisões tomadas na implementação (MVP, etapa 1)

Escopo desta etapa, como combinado: **Partida rápida de 4 rodadas completa, com Plinko**. O motor já aceita partida completa (10) e desafio diário (Plinko determinístico por desafio e rodada, rodadas sem aposta com saldo zerado), mas a interface desses modos fica para a próxima etapa.

## Regras
- **Arredondamento único:** meio para cima (7,5 → 8), em `regras.arredondar`. Vale para ganho e perda.
- **Saldo abaixo de 10:** a aposta seca mínima vira o próprio saldo (tudo ou nada), para ninguém ficar travado. O PRD não cobria esse caso.
- **Plinko só aparece com 20 pontos ou mais** (metade do saldo precisa cobrir a aposta mínima). A tela explica o motivo.
- **Valor sugerido da aposta:** 25% do saldo, ajustável. Sem escolha prévia, para não induzir aposta mínima nem máxima.
- **Recuperação gratuita:** +10 pontos e segue para a próxima rodada. Sem limite, porque o PRD diz "disponível quando necessário".
- **O multiplicador do Plinko é sorteado ao confirmar a aposta** e salvo antes da animação. Atualizar a página ou pular a animação não muda nada.

## Conteúdo
- **Status (adendo v1.1):** jogam `published` e `verified` nesta versão de teste. Para o lançamento, deixar só `published` em `STATUS_JOGAVEIS`.
- **Banco original:** o anexo recebido terminou no meio da Q021. Q001 a Q020 entram; Q021 fica como `needs_editorial_review`; Q022 a Q027 ainda não chegaram.
- **Banco demonstrativo:** 23 perguntas escritas pela IA, com fonte consultada em 07/11/2026. Status `needs_editorial_review` e `origem: demonstrativo`: não contam como verificadas. Entram só na versão de teste, nas partidas rápida e completa (`INCLUIR_NAO_REVISADAS_NO_TESTE` em `js/motor/perguntas.js`), com o selo "Pergunta de teste, ainda sem revisão editorial" na explicação. Nunca entram no desafio diário. Para o lançamento, mudar a constante para `false` ou revisar cada uma. A Britney saiu dele (vale a Q013 original). Na pergunta do polvo, "Lula" saiu das alternativas: lula também tem três corações.
- **Sorteio:** evita repetir as perguntas das últimas partidas no mesmo navegador.

## Interface
- A home só mostra o que funciona: Partida rápida e Como jogar. Partida completa e Desafio do dia aparecem como texto "na próxima etapa", sem botão.
- "Voltar ao Matutar Games": enquanto o hub não existe, a marca leva ao início do Confia?.
- Anúncio recompensado: adaptador pronto e desligado; a opção não aparece.
- Eventos de uso: disparados como `confia:evento` no navegador, sem envio a servidor.

## Balanceamento a observar nos testes
Quem aposta sempre o mínimo termina perto de 100 e sem emoção; quem aposta tudo zera rápido. A tabela do Plinko tem média 1×. Nada disso foi ajustado para favorecer recuperação ou anúncio.
