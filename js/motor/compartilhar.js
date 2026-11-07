/** Confia? · texto compartilhável. Nunca inclui enunciados nem respostas (PRD §9.8). */
import { resumo } from './partida.js';

const NOME_MODO = { rapida: 'Partida rápida', completa: 'Partida completa', diario: 'Desafio do dia' };

export function textoCompartilhar(p, { url = '', numeroDesafio = null } = {}) {
  const r = resumo(p);
  const acertos = p.roundResults.map(x => (x.correct ? '✅' : '❌')).join(' ');
  const modos = p.roundResults.map(x => (x.betMode === 'plinko' ? '🎰' : x.betMode === 'seco' ? '🎯' : '➖')).join(' ');
  const titulo = p.mode === 'diario' && numeroDesafio ? `Desafio #${String(numeroDesafio).padStart(3, '0')}` : NOME_MODO[p.mode];
  const linhas = [
    'MATUTAR GAMES · CONFIA?', titulo, '',
    `Saldo final: ${r.saldoFinal} pontos`, `Acertos: ${r.acertos}/${r.rodadasJogadas}`, '',
    acertos, modos, '', 'Você confia no que sabe?',
  ];
  if (url) linhas.push(url);
  return linhas.join('\n');
}
