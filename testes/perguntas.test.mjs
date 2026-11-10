// Validação do banco de perguntas. Rodar: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { BANCO } from '../js/dados/banco.js';
import { PERGUNTAS_ORIGINAIS } from '../js/dados/perguntas-originais.js';
import { PERGUNTAS_DEMONSTRATIVAS } from '../js/dados/perguntas.js';
import { problemasDaPergunta, jogaveis, sortearPerguntas, naoRevisadaDeTeste, jogavel } from '../js/motor/perguntas.js';
import { geradorComSemente } from '../js/motor/plinko.js';

test('todas as perguntas passam na validação', () => {
  for (const q of BANCO) assert.deepEqual(problemasDaPergunta(q), [], q.id);
});

test('lançamento: só as 20 originais revisadas jogam; demonstrativas e Q021 fora', () => {
  assert.equal(new Set(BANCO.map(q => q.id)).size, BANCO.length);
  assert.equal(jogaveis(PERGUNTAS_ORIGINAIS).length, 20);
  assert.equal(jogaveis(PERGUNTAS_DEMONSTRATIVAS).length, 0);
  assert.equal(jogaveis(BANCO).length, 20);
  assert.ok(jogaveis(BANCO).every(q => q.origem === 'idealizadora' && ['verified', 'published'].includes(q.status)));
  assert.ok(!jogaveis(BANCO).some(q => q.id === 'Q021'));
});

test('demonstrativas: separadas, não revisadas, nunca verificadas e fora do desafio diário', () => {
  for (const q of PERGUNTAS_DEMONSTRATIVAS) {
    assert.equal(q.origem, 'demonstrativo', q.id);
    assert.equal(q.status, 'needs_editorial_review', q.id);
    assert.ok(naoRevisadaDeTeste(q) && !jogavel(q), q.id);
  }
  assert.ok(PERGUNTAS_ORIGINAIS.every(q => q.origem === 'idealizadora'));
  const diario = jogaveis(BANCO, { diario: true });
  assert.equal(diario.length, 20);
  assert.ok(diario.every(q => q.origem === 'idealizadora'));
  const rng = geradorComSemente('diario');
  for (let i = 0; i < 100; i++) assert.ok(sortearPerguntas(BANCO, 4, [], rng, { diario: true }).every(id => /^Q0(0\d|1\d|20)$/.test(id)));
});

test('Britney só aparece uma vez (versão original)', () => {
  assert.equal(BANCO.filter(q => /Britney/.test(q.question)).map(q => q.id).join(), 'Q013');
});

// Equilíbrio entre tipos editoriais é meta para a ampliação do banco (ver DECISOES.md),
// não trava de lançamento: o banco revisado de lançamento tem 14 diretas, 5 conexões improváveis e 1 desvio.
test('banco jogável: tipos editoriais válidos', () => {
  assert.ok(jogaveis(BANCO).every(q => ['direta', 'desvio', 'falsa-pegadinha', 'conexao-improvavel'].includes(q.editorialType)));
});

test('banco demonstrativo: resposta certa espalhada entre A, B, C e D', () => {
  const c = { A: 0, B: 0, C: 0, D: 0 }; PERGUNTAS_DEMONSTRATIVAS.forEach(q => c[q.correctAnswer]++);
  for (const l of 'ABCD') assert.ok(c[l] >= 4 && c[l] <= 8, JSON.stringify(c));
});

test('sorteio: n distintas, só jogáveis, evita as recentes quando dá', () => {
  const rng = geradorComSemente('sorteio');
  for (let i = 0; i < 200; i++) {
    const ids = sortearPerguntas(BANCO, 4, [], rng);
    assert.equal(new Set(ids).size, 4); assert.ok(!ids.includes('Q021'));
  }
  const recentes = jogaveis(BANCO).slice(0, 16).map(q => q.id);
  assert.ok(sortearPerguntas(BANCO, 4, recentes, rng).every(id => !recentes.includes(id)));
  assert.throws(() => sortearPerguntas(BANCO.slice(0, 3), 4, [], rng));
});

test('pergunta sem fonte não pode ser jogável', () => {
  const q = { ...PERGUNTAS_ORIGINAIS[0], id: 'x-1', status: 'needs_fact_check', sources: [] };
  assert.deepEqual(problemasDaPergunta(q), []);
  assert.ok(!jogaveis([q]).length);
  assert.ok(problemasDaPergunta({ ...q, status: 'verified' }).includes('jogável sem fonte https'));
});
