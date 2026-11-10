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

## Revisão de UX mobile (10/11/2026)

- **Plinko sem viés:** em 200 mil jogadas simuladas os multiplicadores bateram com as chances configuradas (qui² 4,44, abaixo do limite de 7,81 a 5%), nenhuma casa mostrada ficou diferente do multiplicador sorteado e 50,05% dos quiques foram para a direita. A sensação de "sempre para a direita" vinha da animação: ziguezague curto e sempre igual. Script: `node` com `jogarPlinko` e `geradorLivre`, mesmo cálculo do motor.
- **Animação nova, mesmo resultado:** a bolinha segue o caminho E/D decidido pelo motor. Altura dos quiques, ritmo, pequenos desvios e um toque extra ocasional são aleatórios só no desenho. Pinos acendem quando a bolinha bate, a casa afunda na chegada e o rastro fica marcado no tabuleiro. "Deu X×!" só aparece depois que a bolinha para.
- **Aposta:** as fichas são o jeito principal de escolher. − e + ajustam de 5 em 5 (antes de 1 em 1). A faixa deslizante saiu. Limites, aposta sugerida e economia não mudaram.
- **Ação principal** fica numa barra grudada no rodapé da tela (sticky, dentro do fluxo), então não cobre conteúdo e respeita a área segura.
- **Textos:** uma instrução por momento. A regra completa do Plinko e o aviso de pontos fictícios ficam no Como jogar e no rodapé da página inicial. "Reduzir animações" foi para o Como jogar.

## Lançamento da Matutar Games (10/11/2026)

- O Confia? entra no lançamento só com a Partida Rápida, conteúdo das 20 perguntas originais revisadas. As demonstrativas saem do jogo (continuam no código, marcadas como não revisadas).
- O teste de equilíbrio entre tipos editoriais deixou de travar o lançamento: o banco revisado é majoritariamente de perguntas diretas. Equilibrar é meta da ampliação do banco.
- Ligação com a home preparada por `js/config.js` (`URL_HUB`), sem mudar endereço nenhum.

## Desafio do Dia: regras aprovadas para implementação futura (10/11/2026)

1. O dia vira à meia-noite no horário de Brasília.
2. Plinko: mesmo multiplicador para todos em cada rodada do mesmo desafio (`plinkoDoDesafio(id, versão, rodada)`).
3. Uma tentativa oficial por navegador, sem login. Limitação conhecida: limpar o navegador ou trocar de aparelho permite jogar de novo.
4. Quem sai no meio retoma no mesmo dia, com as rodadas concluídas preservadas.
5. Comparação coletiva fica para a atualização com Supabase.
6. Sequência de dias jogados fica para depois.
7. Perguntas sorteadas de forma reproduzível só entre as revisadas; o calendário passa por aprovação editorial antes de publicar.
- Já garantido no motor: 4 rodadas iguais para todos, sem recuperação de saldo no diário, quem zera segue respondendo sem apostar.
