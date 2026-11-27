/**
 * Confia? · liga os eventos que o jogo já emite à medição do hub.
 *
 * js/eventos.js registra o que acontece na partida e dispara 'confia:evento' no window, com a
 * nota de que quem quiser medir é só escutar. É o que este arquivo faz: escuta e traduz. A
 * lógica do jogo não sabe que existe medição, e tirar este arquivo não muda nada no jogo.
 *
 * Vai só o funil, com nome e mais nada: quantos começam, quantos terminam, quantos abandonam e
 * quantos compartilham. Nem gameId, nem modo, nem rodada, nem acerto ou erro, nem saldo. Esses
 * dados existem no objeto do evento e ficam onde estão: dizem respeito à partida de uma pessoa.
 */
const FUNIL = {
  partida_iniciada: 'confia-inicia',
  partida_concluida: 'confia-termina',
  partida_abandonada: 'confia-abandona',
  resultado_compartilhado: 'confia-compartilha',
};

window.addEventListener('confia:evento', (e) => {
  const nome = FUNIL[e.detail && e.detail.nome];
  if (!nome) return;
  try { window.medir && window.medir(nome); } catch { /* medição nunca atrapalha o jogo */ }
});
