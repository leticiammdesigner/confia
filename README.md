# Confia? · Matutar Games

Quiz de apostas fictícias: você vê as quatro alternativas, aposta (no seco ou no Plinko) e só depois descobre a pergunta.
*Você confia no que sabe?*

## Rodar e testar
- Jogar localmente: `python3 -m http.server 8000` na raiz e abrir http://localhost:8000
- Testes de regras e conteúdo: `npm test` (Node 20+, sem dependências)

## Estrutura
- `js/motor/` regras puras e testáveis: `regras.js` (aposta, arredondamento, liquidação), `plinko.js` (sorteio e caminho determinístico), `partida.js` (máquina de estados), `perguntas.js` (validação e sorteio), `compartilhar.js`
- `js/dados/` bancos de perguntas: `perguntas-originais.js` (banco da idealizadora, prioridade) e `perguntas.js` (demonstrativo)
- `js/app.js` interface; `js/ui/plinko.js` desenho e animação; `js/persistencia.js` localStorage; `js/anuncios.js` adaptador preparado e inativo; `js/eventos.js` eventos de uso sem envio
- `css/matutar-base.css` base compartilhada do hub; `css/confia.css` identidade do jogo

Decisões de implementação: ver `DECISOES.md`.

## Status: v1.0 da Partida Rápida (lançamento da Matutar Games)

**Pronto e no ar** em https://confia-matutar.netlify.app
- Partida Rápida: 4 rodadas, 100 pontos iniciais, aposta no seco ou no Plinko, recuperação gratuita de 10 pontos ao zerar.
- Experiência mobile-first aprovada em 10/11/2026 (commit `61f2b4c`). Sem refinamentos visuais até nova decisão.
- Conteúdo: só as 20 perguntas originais revisadas (Q001 a Q020). As 23 demonstrativas ficam no código, fora do jogo (`INCLUIR_NAO_REVISADAS_NO_TESTE = false`).
- Compartilhamento sem spoiler (Web Share com cópia de reserva), histórico local, retomada após atualizar a página, movimento reduzido.
- Pontos fictícios, sem anúncios e sem monetização.

**Limite conhecido do conteúdo:** com 20 perguntas, o jogo evita repetir as últimas 16 vistas. Quem jogar mais de 5 partidas começa a rever perguntas.

**Fica para atualizações futuras** (aprovado em 10/11/2026, não implementar antes do lançamento)
- Ampliar o banco editorial: recuperar Q021 a Q027 e revisar as 23 demonstrativas antes de qualquer uso público.
- Aumentar a variedade de perguntas inesperadas e desvios (hoje: 14 diretas, 5 conexões improváveis, 1 desvio, nenhuma falsa pegadinha).
- Evitar repetição perceptível entre partidas (hoje a 6ª partida já repete perguntas).
- Desenvolver o Desafio do Dia, com as regras já aprovadas.
- Partida completa (10 rodadas): o motor já suporta, mas não há entrada na interface.
- Comparação coletiva e ranking (Supabase), sequência de dias jogados.
- Anúncios: o adaptador existe e está desligado. Só com configuração e autorização explícitas.

## Integração com a home da Matutar Games
- **Ficha do jogo para a home:** nome *Confia?*; chamada *"Veja as respostas, aposte e só então descubra a pergunta."*; pergunta-assinatura *"Você confia no que sabe?"*; cores lilás `#B7A1E6` e coral `#E2512F`; letreiro em Bungee; endereço https://confia-matutar.netlify.app
- **Voltar para a home:** preencher `URL_HUB` em `js/config.js` com o endereço aprovado da home. A marca MATUTAR GAMES do topo passa a levar para a home. Vazio, ela volta ao início do Confia?.
- **Independência:** o jogo não depende da home. Os dados locais usam só chaves `confia:*`, sem conflito com os outros jogos. O link de compartilhamento usa o endereço em que o jogo está, então continua certo se o jogo mudar de domínio.
- `css/matutar-base.css` é a base compartilhada do hub (cores, fontes, botões). Mudanças nela devem valer para todos os jogos ao mesmo tempo.
