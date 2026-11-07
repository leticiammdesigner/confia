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
