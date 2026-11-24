/**
 * Confia? · banco de perguntas: validação e sorteio.
 *
 * Caminho de uma pergunta:
 *   needs_fact_check        escrita, esperando conferência de fato ou de fonte
 *   needs_editorial_review  conferida, esperando a decisão da idealizadora
 *   verified                aprovada por ela, mas ainda não publicada
 *   published               no ar, entrando em partidas
 *   aposentada              fora de partida para sempre, por decisão editorial, sem apagar o
 *                           registro do arquivo
 *
 * Só 'published' entra em partida, e sempre com fonte https.
 *
 * Até 24/11/2026 'verified' também jogava, e havia aqui uma nota mandando deixar só 'published'
 * no lançamento. As 96 perguntas em partida eram todas 'verified': seguir a nota teria deixado o
 * jogo sem pergunta nenhuma. As duas coisas foram resolvidas de uma vez, promovendo as 96 e
 * fechando STATUS_JOGAVEIS em 'published'.
 *
 * Uma pergunta aprovada que ficar parada em 'verified' não joga. Para isso não acontecer em
 * silêncio, o teste do banco cobra: toda pergunta fora de partida precisa dizer na auditoria por
 * que está fora.
 */

export const TIPOS = ['direta', 'desvio', 'falsa-pegadinha', 'conexao-improvavel'];
export const DIFICULDADES = ['facil', 'media', 'dificil'];
export const STATUS = ['needs_fact_check', 'needs_editorial_review', 'verified', 'published', 'aposentada'];
export const STATUS_JOGAVEIS = ['published'];
export const jogavel = q => STATUS_JOGAVEIS.includes(q.status);

/**
 * Perguntas demonstrativas (escritas pela IA, ainda sem revisão editorial).
 * Lançamento: desligado. Só as perguntas revisadas entram em partida.
 * Ligar só numa versão de teste, nunca em produção. Elas nunca entram no desafio diário.
 */
export const INCLUIR_NAO_REVISADAS_NO_TESTE = false;
export const naoRevisadaDeTeste = q => q.origem === 'demonstrativo' && q.status === 'needs_editorial_review';
const temFonteHttps = q => Array.isArray(q.sources) && q.sources.length > 0 && q.sources.every(s => /^https:\/\//.test(s.url || ''));
const LETRAS = ['A', 'B', 'C', 'D'];

/** Lista os problemas de uma pergunta (vazia = ok). */
export function problemasDaPergunta(q) {
  const p = [];
  if (!q || typeof q.id !== 'string' || !q.id) return ['sem id'];
  if (!Array.isArray(q.alternatives) || q.alternatives.length !== 4) p.push('precisa de 4 alternativas');
  else {
    if (q.alternatives.map(a => a.id).join('') !== 'ABCD') p.push('alternativas fora da ordem A-D');
    const textos = q.alternatives.map(a => String(a.text || '').trim().toLocaleLowerCase('pt-BR'));
    if (textos.some(t => !t)) p.push('alternativa vazia');
    if (new Set(textos).size !== 4) p.push('alternativas repetidas');
  }
  if (!LETRAS.includes(q.correctAnswer)) p.push('resposta correta inválida');
  if (!q.question || q.question.trim().length < 15) p.push('enunciado curto ou vazio');
  if (!q.explanation) p.push('sem explicação');
  if (!TIPOS.includes(q.editorialType)) p.push('tipo editorial inválido');
  if (!DIFICULDADES.includes(q.difficulty)) p.push('dificuldade inválida');
  if (!STATUS.includes(q.status)) p.push('status inválido');
  if (!q.realCategory || !q.apparentCategory) p.push('falta tema real ou tema sugerido');
  if ((jogavel(q) || naoRevisadaDeTeste(q)) && !temFonteHttps(q)) p.push('jogável sem fonte https');
  return p;
}

/** Perguntas que podem entrar em partida. `diario: true` aceita só conteúdo verificado ou publicado. */
export const jogaveis = (banco, { diario = false } = {}) => banco.filter(q =>
  (jogavel(q) || (!diario && INCLUIR_NAO_REVISADAS_NO_TESTE && naoRevisadaDeTeste(q))) && problemasDaPergunta(q).length === 0);

/**
 * Sorteia n perguntas jogáveis, distintas, evitando as vistas recentemente quando possível.
 * @param {object[]} banco @param {number} n @param {string[]} recentes @param {() => number} rng @param {{diario?: boolean}} op
 */
export function sortearPerguntas(banco, n, recentes, rng, { diario = false } = {}) {
  const ok = jogaveis(banco, { diario });
  if (ok.length < n) throw new Error(`banco com ${ok.length} perguntas jogáveis; precisa de ${n}`);
  const vistas = new Set(recentes || []);
  const embaralhar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const novas = embaralhar(ok.filter(q => !vistas.has(q.id)));
  const velhas = embaralhar(ok.filter(q => vistas.has(q.id)));
  return [...novas, ...velhas].slice(0, n).map(q => q.id);
}
