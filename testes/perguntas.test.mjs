// Validação do banco de perguntas. Rodar: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { BANCO } from '../js/dados/banco.js';
import { PERGUNTAS_ORIGINAIS } from '../js/dados/perguntas-originais.js';
import { PERGUNTAS_DEMONSTRATIVAS } from '../js/dados/perguntas.js';
import { PERGUNTAS_REVISADAS } from '../js/dados/perguntas-revisadas.js';
import { PERGUNTAS_PROPOSTAS } from '../js/dados/perguntas-propostas.js';
import { problemasDaPergunta, jogaveis, sortearPerguntas, naoRevisadaDeTeste, jogavel } from '../js/motor/perguntas.js';
import { geradorComSemente } from '../js/motor/plinko.js';

test('todas as perguntas passam na validação', () => {
  for (const q of BANCO) assert.deepEqual(problemasDaPergunta(q), [], q.id);
});

test('lançamento: só o que a idealizadora revisou joga', () => {
  assert.equal(new Set(BANCO.map(q => q.id)).size, BANCO.length);
  assert.equal(jogaveis(PERGUNTAS_ORIGINAIS).length, 21);
  assert.equal(jogaveis(PERGUNTAS_REVISADAS).length, 33);
  assert.equal(jogaveis(PERGUNTAS_DEMONSTRATIVAS).length, 22);
  assert.equal(jogaveis(PERGUNTAS_PROPOSTAS).length, 20);
  assert.equal(jogaveis(BANCO).length, 96);
  // quem escreveu não importa para jogar; importa ter passado pela revisão da idealizadora
  assert.ok(jogaveis(BANCO).every(q => ['verified', 'published'].includes(q.status)));
  // o que está fora é decisão editorial registrada, não esquecimento
  assert.deepEqual(BANCO.filter(q => !jogaveis([q]).length).map(q => q.id), ['R010', 'ani-001']);
});

test('propostas do assistente: só jogam depois da revisão, e sempre com link', () => {
  for (const q of PERGUNTAS_PROPOSTAS) {
    assert.equal(q.origem, 'assistente', q.id);
    assert.ok(['verified', 'needs_editorial_review'].includes(q.status), q.id);
    assert.match(q.sources[0].url, /^https:\/\//, q.id);
    assert.match(q.auditoria, /1[89]\/11\/2026/, q.id);
    // pendente de revisão não joga nem na versão de teste: origem 'assistente' não é 'demonstrativo'
    if (q.status === 'needs_editorial_review') assert.ok(!jogavel(q) && !naoRevisadaDeTeste(q), q.id);
  }
});

test('princípio do Confia?: a resposta certa se espalha pelas quatro letras', () => {
  // Gabarito concentrado numa letra ensina a chutar. Nenhuma letra pode ficar acima de 35% nem
  // abaixo de 15% do que está em jogo. Perguntas com alternativas numéricas mantêm a ordem natural.
  const J = jogaveis(BANCO);
  const conta = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of J) conta[q.correctAnswer]++;
  for (const letra of ['A', 'B', 'C', 'D']) {
    const fatia = conta[letra] / J.length;
    assert.ok(fatia >= 0.15 && fatia <= 0.35, `letra ${letra} com ${conta[letra]} de ${J.length}`);
  }
});

test('revisadas: fonte https em tudo que joga, e fora de partida quando falta link ou repete fato', () => {
  for (const q of PERGUNTAS_REVISADAS) {
    assert.equal(q.origem, 'idealizadora', q.id);
    assert.ok(['verified', 'needs_fact_check'].includes(q.status), q.id);
    assert.ok(q.auditoria && q.sources.length === 1, q.id);
    if (q.status === 'verified') assert.match(q.sources[0].url, /^https:\/\//, q.id);
    else assert.ok(!jogavel(q), q.id);     // sem link ou repetida: não entra em partida
  }
  // Em 19/11/2026 as sete sem link ganharam fonte conferida. Só a R010 segue fora, por repetir
  // o fato da cin-001 (a pílula de Matrix), e espera a escolha de qual das duas fica.
  const fora = PERGUNTAS_REVISADAS.filter(q => q.status !== 'verified').map(q => q.id);
  assert.deepEqual(fora, ['R010']);
});

test('nada entra em partida sem revisão da idealizadora, nem no desafio diário', () => {
  for (const q of PERGUNTAS_DEMONSTRATIVAS) {
    assert.equal(q.origem, 'demonstrativo', q.id);
    assert.ok(['verified', 'needs_editorial_review', 'aposentada'].includes(q.status), q.id);
    if (q.status === 'needs_editorial_review') assert.ok(naoRevisadaDeTeste(q) && !jogavel(q), q.id);
    if (q.status === 'aposentada') assert.ok(!jogavel(q), q.id);     // fora de partida para sempre
    assert.match(q.auditoria, /idealizadora/, q.id);     // quem revisou, e o que falta quando está fora
  }
  assert.ok(PERGUNTAS_ORIGINAIS.every(q => q.origem === 'idealizadora'));
  const diario = jogaveis(BANCO, { diario: true });
  assert.equal(diario.length, 96);
  assert.ok(diario.every(q => ['verified', 'published'].includes(q.status)));
  const rng = geradorComSemente('diario');
  const idsJogaveis = new Set(diario.map(q => q.id));
  for (let i = 0; i < 100; i++) assert.ok(sortearPerguntas(BANCO, 4, [], rng, { diario: true }).every(id => idsJogaveis.has(id)));
});

test('Britney só aparece uma vez (versão original)', () => {
  assert.equal(BANCO.filter(q => /Britney/.test(q.question)).map(q => q.id).join(), 'Q013');
});

// Equilíbrio entre tipos editoriais é meta para a ampliação do banco (ver DECISOES.md),
// não trava de lançamento: o banco revisado de lançamento tem 14 diretas, 5 conexões improváveis e 1 desvio.
test('banco jogável: tipos editoriais válidos', () => {
  assert.ok(jogaveis(BANCO).every(q => ['direta', 'desvio', 'falsa-pegadinha', 'conexao-improvavel'].includes(q.editorialType)));
});

// A regra do gabarito espalhado vale para o que está em jogo, não arquivo por arquivo:
// o teste 'princípio do Confia?' acima cobre isso sobre jogaveis(BANCO).

test('sorteio: n distintas, só jogáveis, evita as recentes quando dá', () => {
  const rng = geradorComSemente('sorteio');
  for (let i = 0; i < 200; i++) {
    const ids = sortearPerguntas(BANCO, 4, [], rng);
    assert.equal(new Set(ids).size, 4);
    assert.ok(!ids.includes('ani-001') && !ids.includes('R010'));     // as duas que estão fora
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
