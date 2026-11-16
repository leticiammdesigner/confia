// Testes das regras do Confia?  Rodar: node --test testes/
import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../js/motor/regras.js';
import * as P from '../js/motor/plinko.js';
import * as M from '../js/motor/partida.js';
import { textoCompartilhar } from '../js/motor/compartilhar.js';

const IDS = ['q1', 'q2', 'q3', 'q4'];
const Q = id => ({ id, correctAnswer: 'B' });
const fixo = (...vals) => { let i = 0; return () => vals[i++ % vals.length]; };
const nova = (mode = 'rapida') => M.criarPartida({ mode, perguntas: mode === 'completa' ? Array.from({ length: 10 }, (_, i) => 'q' + i) : IDS, agora: new Date('2026-11-07T12:00:00Z'), ...(mode === 'diario' ? { desafioId: '2026-11-07', desafioVersao: 1 } : {}) });

test('arredondamento único: meio para cima, inclusive empates', () => {
  assert.equal(R.arredondar(7.5), 8); assert.equal(R.arredondar(22.5), 23); assert.equal(R.arredondar(7.49), 7); assert.equal(R.arredondar(0), 0);
  assert.equal(R.pontosEmJogo(15, 0.5), 8); assert.equal(R.pontosEmJogo(15, 1.5), 23); assert.equal(R.pontosEmJogo(11, 0.5), 6); assert.equal(R.pontosEmJogo(10, 2), 20);
  assert.throws(() => R.arredondar(-1));
});

test('limites de aposta: seco até o saldo, Plinko até metade', () => {
  assert.deepEqual(R.limitesAposta(100, 'seco'), { min: 10, max: 100 });
  assert.deepEqual(R.limitesAposta(100, 'plinko'), { min: 10, max: 50 });
  assert.deepEqual(R.limitesAposta(35, 'plinko'), { min: 10, max: 17 });
  assert.equal(R.limitesAposta(19, 'plinko'), null, 'Plinko some quando metade do saldo não cobre 10');
  assert.deepEqual(R.limitesAposta(20, 'plinko'), { min: 10, max: 10 });
  assert.deepEqual(R.limitesAposta(6, 'seco'), { min: 6, max: 6 }, 'saldo abaixo de 10: tudo ou nada');
  assert.equal(R.limitesAposta(0, 'seco'), null);
  assert.ok(!R.apostaValida(100, 9, 'seco')); assert.ok(!R.apostaValida(100, 10.5, 'seco')); assert.ok(!R.apostaValida(100, 51, 'plinko')); assert.ok(R.apostaValida(100, 50, 'plinko'));
});

test('atalhos só com valores válidos', () => {
  assert.deepEqual(R.atalhos(100, 'seco').map(a => a.valor), [10, 25, 50, 100]);
  assert.deepEqual(R.atalhos(100, 'plinko').map(a => a.valor), [10, 25, 50]);
  assert.ok(R.atalhos(100, 'plinko').at(-1).max);
  assert.deepEqual(R.atalhos(30, 'seco').map(a => a.valor), [10, 25, 30]);
  assert.deepEqual(R.atalhos(30, 'plinko').map(a => a.valor), [10, 15]);
  assert.deepEqual(R.atalhos(10, 'plinko'), []);
});

test('liquidação: nunca negativa, mesmo no pior Plinko', () => {
  assert.deepEqual(R.liquidar(100, 100, 1, false), { delta: -100, saldo: 0 });
  assert.deepEqual(R.liquidar(100, 50, 2, false), { delta: -100, saldo: 0 });
  assert.deepEqual(R.liquidar(100, 50, 2, true), { delta: 100, saldo: 200 });
  assert.deepEqual(R.liquidar(35, 17, 2, false), { delta: -34, saldo: 1 });
  for (let s = 20; s <= 400; s++) for (const m of [0.5, 1, 1.5, 2]) { const l = R.limitesAposta(s, 'plinko'); assert.ok(R.liquidar(s, l.max, m, false).saldo >= 0); }
});

test('potencial: faixa antes do sorteio e valor exato depois', () => {
  assert.deepEqual(R.potencial(40, 'plinko', null), { ganhoMin: 20, ganhoMax: 80, perdaMin: 20, perdaMax: 80 });
  assert.deepEqual(R.potencial(40, 'plinko', 1.5), { ganhoMin: 60, ganhoMax: 60, perdaMin: 60, perdaMax: 60 });
  assert.deepEqual(R.potencial(40, 'seco', 1), { ganhoMin: 40, ganhoMax: 40, perdaMin: 40, perdaMax: 40 });
});

test('Plinko: tabela tem média 1× e sorteio respeita os pesos', () => {
  const media = P.MULTIPLICADORES.reduce((s, m) => s + m.valor * m.peso, 0) / P.MULTIPLICADORES.reduce((s, m) => s + m.peso, 0);
  assert.equal(media, 1);
  assert.equal(P.sortearMultiplicador(0), 0.5); assert.equal(P.sortearMultiplicador(0.2999), 0.5); assert.equal(P.sortearMultiplicador(0.30), 1);
  assert.equal(P.sortearMultiplicador(0.7499), 1); assert.equal(P.sortearMultiplicador(0.75), 1.5); assert.equal(P.sortearMultiplicador(0.95), 2); assert.equal(P.sortearMultiplicador(0.99999), 2);
  const g = P.geradorComSemente('distribuicao'), n = 200000, c = {};
  for (let i = 0; i < n; i++) { const m = P.sortearMultiplicador(g()); c[m] = (c[m] || 0) + 1; }
  for (const m of P.MULTIPLICADORES) assert.ok(Math.abs(c[m.valor] / n * 100 - m.peso) < 0.6, `${m.valor}: ${c[m.valor] / n * 100}%`);
});

test('Plinko: a bolinha sempre termina na casa do multiplicador sorteado', () => {
  const g = P.geradorComSemente('caminhos');
  for (let i = 0; i < 5000; i++) {
    const j = P.jogarPlinko(g);
    assert.equal(P.CASAS[j.casa], j.multiplicador);
    assert.equal(j.caminho.length, P.FILEIRAS);
    assert.equal(j.caminho.filter(x => x === 'D').length, j.casa);
  }
});

test('Plinko do desafio diário: igual para todos, muda por rodada e por versão', () => {
  const a = P.plinkoDoDesafio('2026-11-07', 1, 2), b = P.plinkoDoDesafio('2026-11-07', 1, 2);
  assert.deepEqual(a, b);
  const varia = new Set([0, 1, 2, 3].map(r => JSON.stringify(P.plinkoDoDesafio('2026-11-07', 1, r))));
  assert.ok(varia.size > 1);
});

test('fluxo seco: aposta → pergunta → resultado → próxima', () => {
  let p = nova();
  assert.equal(p.balance, 100); assert.equal(p.phase, 'aposta');
  p = M.confirmarAposta(p, { valor: 30, modo: 'seco' });
  assert.equal(p.phase, 'pergunta'); assert.equal(p.multiplier, 1);
  p = M.responder(p, 'B', Q('q1'));
  assert.equal(p.balance, 130); assert.equal(p.phase, 'resultado'); assert.equal(p.roundResults[0].delta, 30);
  p = M.avancar(p);
  assert.equal(p.roundIndex, 1); assert.equal(p.phase, 'aposta'); assert.equal(p.betAmount, null);
});

test('fluxo Plinko: multiplicador decidido na confirmação, antes da pergunta', () => {
  let p = M.confirmarAposta(nova(), { valor: 50, modo: 'plinko' }, fixo(0.96, 0.5, 0.1));
  assert.equal(p.phase, 'plinko'); assert.equal(p.multiplier, 2); assert.equal(P.CASAS[p.plinko.casa], 2);
  assert.throws(() => M.responder(p, 'B', Q('q1')), M.ErroDeTransicao, 'não responde antes do Plinko acabar');
  p = M.concluirPlinko(p);
  p = M.responder(p, 'A', Q('q1'));
  assert.equal(p.balance, 0); assert.equal(p.roundResults[0].delta, -100);
});

test('toque duplo: a segunda confirmação e a segunda resposta são recusadas', () => {
  let p = M.confirmarAposta(nova(), { valor: 10, modo: 'seco' });
  assert.throws(() => M.confirmarAposta(p, { valor: 10, modo: 'seco' }), M.ErroDeTransicao);
  p = M.responder(p, 'B', Q('q1'));
  assert.throws(() => M.responder(p, 'A', Q('q1')), M.ErroDeTransicao);
  assert.equal(p.roundResults.length, 1);
});

test('aposta inválida e pergunta errada são recusadas', () => {
  assert.throws(() => M.confirmarAposta(nova(), { valor: 101, modo: 'seco' }), M.ErroDeTransicao);
  assert.throws(() => M.confirmarAposta(nova(), { valor: 60, modo: 'plinko' }, Math.random), M.ErroDeTransicao);
  const p = M.confirmarAposta(nova(), { valor: 10, modo: 'seco' });
  assert.throws(() => M.responder(p, 'B', Q('q2')), M.ErroDeTransicao);
  assert.throws(() => M.responder(p, 'E', Q('q1')), M.ErroDeTransicao);
});

test('zerar na primeira rodada → recuperação gratuita de 10 → partida continua', () => {
  let p = M.responder(M.confirmarAposta(nova(), { valor: 100, modo: 'seco' }), 'A', Q('q1'));
  assert.equal(p.balance, 0);
  p = M.avancar(p);
  assert.equal(p.phase, 'zerado');
  assert.throws(() => M.confirmarAposta(p, { valor: 10, modo: 'seco' }), M.ErroDeTransicao);
  p = M.recuperar(p);
  assert.equal(p.balance, 10); assert.equal(p.freeRecoveryCount, 1); assert.equal(p.roundIndex, 1); assert.equal(p.phase, 'aposta');
  assert.ok(!M.plinkoDisponivel(p), 'com 10 pontos o Plinko não está disponível');
  assert.throws(() => M.recuperar(p), M.ErroDeTransicao, 'não recupera com saldo positivo');
});

test('zerar e encerrar: fim antecipado conta as rodadas jogadas', () => {
  let p = M.avancar(M.responder(M.confirmarAposta(nova(), { valor: 100, modo: 'seco' }), 'A', Q('q1')));
  p = M.encerrar(p);
  const r = M.resumo(p);
  assert.equal(p.phase, 'fim'); assert.equal(r.rodadasJogadas, 1); assert.ok(r.encerradaAntes); assert.equal(r.saldoFinal, 0);
});

test('zerar na última rodada vai direto para o fim', () => {
  let p = nova();
  for (let i = 0; i < 3; i++) p = M.avancar(M.responder(M.confirmarAposta(p, { valor: 10, modo: 'seco' }), 'B', Q(IDS[i])));
  p = M.responder(M.confirmarAposta(p, { valor: p.balance, modo: 'seco' }), 'A', Q('q4'));
  p = M.avancar(p);
  assert.equal(p.phase, 'fim'); assert.equal(p.balance, 0);
});

test('partida rápida tem 4 rodadas e completa tem 10', () => {
  for (const [modo, n] of [['rapida', 4], ['completa', 10]]) {
    let p = nova(modo), rodadas = 0;
    while (p.phase !== 'fim') { p = M.avancar(M.responder(M.confirmarAposta(p, { valor: 10, modo: 'seco' }), 'B', Q(M.perguntaAtual(p)))); rodadas++; }
    assert.equal(rodadas, n); assert.equal(M.resumo(p).acertos, n); assert.equal(p.balance, 100 + 10 * n);
  }
  assert.throws(() => M.criarPartida({ mode: 'rapida', perguntas: ['a', 'b', 'c'] }));
  assert.throws(() => M.criarPartida({ mode: 'rapida', perguntas: ['a', 'a', 'b', 'c'] }));
});

test('desafio diário: sem recuperação; com saldo 0 responde sem apostar e acertos contam', () => {
  let p = nova('diario');
  p = M.avancar(M.responder(M.confirmarAposta(p, { valor: 100, modo: 'seco' }), 'A', Q('q1')));
  assert.equal(p.phase, 'aposta'); assert.equal(p.balance, 0); assert.ok(M.rodadaSemAposta(p));
  assert.throws(() => M.confirmarAposta(p, { valor: 10, modo: 'seco' }), M.ErroDeTransicao);
  p = M.responderSemApostar(p);
  p = M.responder(p, 'B', Q('q2'));
  assert.equal(p.balance, 0); assert.equal(p.roundResults[1].delta, 0); assert.equal(p.roundResults[1].correct, true); assert.equal(p.roundResults[1].betMode, null);
  assert.throws(() => M.recuperar({ ...p, phase: 'zerado' }), M.ErroDeTransicao);
});

test('desafio diário: Plinko igual para quem joga a mesma rodada', () => {
  const a = M.confirmarAposta(nova('diario'), { valor: 20, modo: 'plinko' });
  const b = M.confirmarAposta(nova('diario'), { valor: 50, modo: 'plinko' });
  assert.equal(a.multiplier, b.multiplier); assert.deepEqual(a.plinko, b.plinko);
});

test('resumo: saldo e acertos separados, maior ganho e perda', () => {
  let p = nova();
  p = M.avancar(M.responder(M.confirmarAposta(p, { valor: 40, modo: 'seco' }), 'B', Q('q1')));        // +40 → 140
  p = M.avancar(M.responder(M.concluirPlinko(M.confirmarAposta(p, { valor: 50, modo: 'plinko' }, fixo(0.5, 0.5, 0.3))), 'A', Q('q2'))); // 1× -50 → 90
  p = M.avancar(M.responder(M.confirmarAposta(p, { valor: 10, modo: 'seco' }), 'B', Q('q3')));        // +10 → 100
  p = M.avancar(M.responder(M.confirmarAposta(p, { valor: 10, modo: 'seco' }), 'C', Q('q4')));        // -10 → 90
  const r = M.resumo(p);
  assert.deepEqual([r.saldoFinal, r.acertos, r.erros, r.maiorGanho, r.maiorPerda, r.usosPlinko], [90, 2, 2, 40, 50, 1]);
});

test('compartilhar: sem enunciado nem resposta', () => {
  let p = nova();
  for (const id of IDS) p = M.avancar(M.responder(M.confirmarAposta(p, { valor: 10, modo: 'seco' }), id === 'q3' ? 'A' : 'B', Q(id)));
  const t = textoCompartilhar(p, { url: 'https://exemplo.test' });
  assert.match(t, /^Confia\? · Partida/); assert.match(t, /Matutar Games · Ideias que dão jogo\.$/); assert.doesNotMatch(t, /🎰|🎯|➖/); assert.match(t, /Saldo final: 120 pontos/); assert.match(t, /Acertos: 3\/4/); assert.match(t, /✅ ✅ ❌ ✅/);
  assert.ok(!/q1|q2|Resposta|\bB\b/.test(t));
});

test('restauração: estado salvo coerente passa, estado mexido é recusado', () => {
  const ids = new Set(IDS);
  let p = M.confirmarAposta(nova(), { valor: 20, modo: 'plinko' }, fixo(0.1, 0.1, 0.1));
  const json = JSON.parse(JSON.stringify(p));
  assert.ok(M.estadoValido(json, ids));
  assert.deepEqual(M.concluirPlinko(json).multiplier, p.multiplier, 'refresh no Plinko mantém o resultado');
  assert.ok(!M.estadoValido({ ...json, balance: -5 }, ids));
  assert.ok(!M.estadoValido({ ...json, perguntas: ['x', 'q2', 'q3', 'q4'] }, ids));
  assert.ok(!M.estadoValido({ ...json, phase: 'resultado' }, ids), 'resultado sem rodada registrada');
  assert.ok(!M.estadoValido(null, ids));
});
