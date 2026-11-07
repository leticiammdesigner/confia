/**
 * Confia? · máquina de estados da partida. Funções puras: recebem um estado e devolvem um NOVO estado,
 * ou lançam ErroDeTransicao quando a ação não vale naquela fase. A interface nunca altera o estado direto.
 *
 * Fases:  aposta ──(seco)──────────────► pergunta ─► resultado ─► aposta (próxima rodada)
 *            └──(plinko)─► plinko ─►─┘                      ├─► zerado (partida livre com saldo 0)
 *                                                           └─► fim (última rodada)
 *         zerado ─(recuperar)─► aposta      zerado ─(encerrar)─► fim
 *  No desafio diário, saldo 0 não vai para "zerado": as rodadas seguintes são respondidas sem aposta.
 */
import { SALDO_INICIAL, RECUPERACAO_GRATUITA, apostaValida, liquidar, limitesAposta } from './regras.js';
import { jogarPlinko, plinkoDoDesafio } from './plinko.js';

export const VERSAO_ESTADO = 1;
export const RODADAS = Object.freeze({ rapida: 4, completa: 10, diario: 4 });

export class ErroDeTransicao extends Error {
  constructor(msg) { super(msg); this.name = 'ErroDeTransicao'; }
}
function exigir(cond, msg) { if (!cond) throw new ErroDeTransicao(msg); }

/**
 * @typedef {Object} ResultadoRodada
 * @property {string} perguntaId
 * @property {number} betAmount
 * @property {'seco'|'plinko'|null} betMode   null = rodada sem aposta (desafio com saldo zerado)
 * @property {number} multiplier
 * @property {string} answer
 * @property {boolean} correct
 * @property {number} delta
 * @property {number} saldoAntes
 * @property {number} saldoDepois
 *
 * @typedef {Object} Partida
 * @property {number} versao
 * @property {'rapida'|'completa'|'diario'} mode
 * @property {string} gameId
 * @property {string[]} perguntas           ids na ordem da partida
 * @property {string|null} desafioId
 * @property {number|null} desafioVersao
 * @property {number} roundIndex
 * @property {'aposta'|'plinko'|'pergunta'|'resultado'|'zerado'|'fim'} phase
 * @property {number} balance
 * @property {number|null} betAmount
 * @property {'seco'|'plinko'|null} betMode
 * @property {number|null} multiplier
 * @property {{casa:number, caminho:string[]}|null} plinko
 * @property {string|null} selectedAnswer
 * @property {ResultadoRodada[]} roundResults
 * @property {number} freeRecoveryCount
 * @property {boolean} adRecoveryUsed
 * @property {string} startedAt
 * @property {string|null} completedAt
 */

/** @returns {Partida} */
export function criarPartida({ mode, perguntas, gameId, agora = new Date(), desafioId = null, desafioVersao = null }) {
  exigir(mode in RODADAS, 'modo inválido: ' + mode);
  exigir(Array.isArray(perguntas) && perguntas.length === RODADAS[mode], `o modo ${mode} precisa de ${RODADAS[mode]} perguntas`);
  exigir(new Set(perguntas).size === perguntas.length, 'perguntas repetidas na partida');
  exigir(mode !== 'diario' || (desafioId && desafioVersao != null), 'desafio diário precisa de id e versão');
  return {
    versao: VERSAO_ESTADO, mode, gameId: gameId || `${mode}-${agora.getTime().toString(36)}`, perguntas: perguntas.slice(),
    desafioId, desafioVersao, roundIndex: 0, phase: 'aposta', balance: SALDO_INICIAL,
    betAmount: null, betMode: null, multiplier: null, plinko: null, selectedAnswer: null,
    roundResults: [], freeRecoveryCount: 0, adRecoveryUsed: false,
    startedAt: agora.toISOString(), completedAt: null,
  };
}

export const perguntaAtual = p => p.perguntas[p.roundIndex];
export const ultimaRodada = p => p.roundIndex === p.perguntas.length - 1;
/** Desafio diário com saldo zerado: a rodada é respondida sem aposta. */
export const rodadaSemAposta = p => p.mode === 'diario' && p.balance === 0;

/**
 * Confirma a aposta. No Plinko, o multiplicador é decidido AQUI (e salvo), antes de qualquer animação.
 * @param {Partida} p @param {{valor:number, modo:'seco'|'plinko'}} aposta @param {() => number} [rng]
 */
export function confirmarAposta(p, { valor, modo }, rng) {
  exigir(p.phase === 'aposta', 'só dá para apostar na fase de aposta');
  exigir(!rodadaSemAposta(p), 'rodada sem aposta: use responderSemApostar');
  exigir(apostaValida(p.balance, valor, modo), `aposta inválida: ${valor} no ${modo} com saldo ${p.balance}`);
  if (modo === 'seco') return { ...p, betAmount: valor, betMode: 'seco', multiplier: 1, plinko: null, phase: 'pergunta' };
  const j = p.mode === 'diario' ? plinkoDoDesafio(p.desafioId, p.desafioVersao, p.roundIndex) : jogarPlinko(rng);
  return { ...p, betAmount: valor, betMode: 'plinko', multiplier: j.multiplicador, plinko: { casa: j.casa, caminho: j.caminho }, phase: 'plinko' };
}

/** Desafio diário com saldo 0: segue para a pergunta valendo 0. */
export function responderSemApostar(p) {
  exigir(p.phase === 'aposta' && rodadaSemAposta(p), 'só no desafio diário com saldo zerado');
  return { ...p, betAmount: 0, betMode: null, multiplier: 1, plinko: null, phase: 'pergunta' };
}

/** Fim da animação (ou "pular"): libera a pergunta. O resultado já estava decidido. */
export function concluirPlinko(p) {
  exigir(p.phase === 'plinko', 'não há Plinko em andamento');
  return { ...p, phase: 'pergunta' };
}

/**
 * Registra a resposta (uma vez só) e calcula o resultado da rodada.
 * @param {Partida} p @param {string} letra @param {{id:string, correctAnswer:string}} pergunta
 */
export function responder(p, letra, pergunta) {
  exigir(p.phase === 'pergunta', 'só dá para responder com a pergunta aberta');
  exigir(pergunta && pergunta.id === perguntaAtual(p), 'pergunta não corresponde à rodada');
  exigir(['A', 'B', 'C', 'D'].includes(letra), 'alternativa inválida');
  const correct = letra === pergunta.correctAnswer;
  const { delta, saldo } = liquidar(p.balance, p.betAmount, p.multiplier, correct);
  /** @type {ResultadoRodada} */
  const r = { perguntaId: pergunta.id, betAmount: p.betAmount, betMode: p.betMode, multiplier: p.multiplier, answer: letra, correct, delta, saldoAntes: p.balance, saldoDepois: saldo };
  return { ...p, selectedAnswer: letra, balance: saldo, roundResults: [...p.roundResults, r], phase: 'resultado' };
}

/** Depois do resultado: próxima rodada, tela de saldo zerado ou fim. */
export function avancar(p, agora = new Date()) {
  exigir(p.phase === 'resultado', 'só dá para avançar depois do resultado');
  if (ultimaRodada(p)) return { ...p, phase: 'fim', completedAt: agora.toISOString() };
  if (p.balance === 0 && p.mode !== 'diario') return { ...p, phase: 'zerado' };
  return proximaRodada(p);
}

function proximaRodada(p) {
  return { ...p, roundIndex: p.roundIndex + 1, phase: 'aposta', betAmount: null, betMode: null, multiplier: null, plinko: null, selectedAnswer: null };
}

/** Recuperação gratuita (só partidas livres, só com saldo 0). */
export function recuperar(p) {
  exigir(p.phase === 'zerado', 'recuperação só com saldo zerado');
  exigir(p.mode !== 'diario', 'o desafio diário não tem recuperação');
  exigir(p.balance === 0, 'recuperação só com saldo zerado');
  return proximaRodada({ ...p, balance: p.balance + RECUPERACAO_GRATUITA, freeRecoveryCount: p.freeRecoveryCount + 1 });
}

/** Encerrar a partida na tela de saldo zerado. */
export function encerrar(p, agora = new Date()) {
  exigir(p.phase === 'zerado', 'só dá para encerrar com saldo zerado');
  return { ...p, phase: 'fim', completedAt: agora.toISOString() };
}

/** Plinko disponível nesta rodada? (para a interface explicar por que não) */
export function plinkoDisponivel(p) {
  return p.phase === 'aposta' && !rodadaSemAposta(p) && !!limitesAposta(p.balance, 'plinko');
}

/** Números do resultado final. Saldo e acertos são medidas separadas (PRD §2.3). */
export function resumo(p) {
  const r = p.roundResults;
  const deltas = r.map(x => x.delta);
  return {
    saldoFinal: p.balance,
    rodadasJogadas: r.length,
    totalRodadas: p.perguntas.length,
    acertos: r.filter(x => x.correct).length,
    erros: r.filter(x => !x.correct).length,
    maiorGanho: Math.max(0, ...deltas),
    maiorPerda: Math.max(0, ...deltas.map(d => -d)),
    usosPlinko: r.filter(x => x.betMode === 'plinko').length,
    recuperacoes: p.freeRecoveryCount,
    encerradaAntes: p.phase === 'fim' && r.length < p.perguntas.length,
  };
}

/** Confere se um estado salvo é coerente antes de restaurar (localStorage pode estar velho ou mexido). */
export function estadoValido(p, bancoIds) {
  try {
    if (!p || p.versao !== VERSAO_ESTADO || !(p.mode in RODADAS)) return false;
    if (!Array.isArray(p.perguntas) || p.perguntas.length !== RODADAS[p.mode]) return false;
    if (bancoIds && !p.perguntas.every(id => bancoIds.has(id))) return false;
    if (!['aposta', 'plinko', 'pergunta', 'resultado', 'zerado', 'fim'].includes(p.phase)) return false;
    if (!(Number.isInteger(p.balance) && p.balance >= 0)) return false;
    if (!(p.roundIndex >= 0 && p.roundIndex < p.perguntas.length)) return false;
    const esperadoResultados = p.roundIndex + (['resultado', 'zerado', 'fim'].includes(p.phase) ? 1 : 0);
    if (p.phase !== 'fim' && p.roundResults.length !== esperadoResultados) return false;
    if (p.phase === 'plinko' && !(p.plinko && Number.isInteger(p.plinko.casa))) return false;
    return true;
  } catch { return false; }
}
