/**
 * Confia? · banco de perguntas: validação e sorteio.
 * Status (Adendo ao PRD v1.1): needs_fact_check · needs_editorial_review · verified · published.
 * Entram em partidas só os status de STATUS_JOGAVEIS, e sempre com fonte https.
 * Na versão de teste jogam "published" e "verified"; para o lançamento, deixar só "published".
 */

export const TIPOS = ['direta', 'desvio', 'falsa-pegadinha', 'conexao-improvavel'];
export const DIFICULDADES = ['facil', 'media', 'dificil'];
export const STATUS = ['needs_fact_check', 'needs_editorial_review', 'verified', 'published'];
export const STATUS_JOGAVEIS = ['published', 'verified'];
export const jogavel = q => STATUS_JOGAVEIS.includes(q.status);
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
  if (jogavel(q) && !(Array.isArray(q.sources) && q.sources.length && q.sources.every(s => /^https:\/\//.test(s.url || '')))) p.push('jogável sem fonte https');
  return p;
}

export const jogaveis = banco => banco.filter(q => jogavel(q) && problemasDaPergunta(q).length === 0);

/**
 * Sorteia n perguntas jogáveis, distintas, evitando as vistas recentemente quando possível.
 * @param {object[]} banco @param {number} n @param {string[]} recentes @param {() => number} rng
 */
export function sortearPerguntas(banco, n, recentes, rng) {
  const ok = jogaveis(banco);
  if (ok.length < n) throw new Error(`banco com ${ok.length} perguntas jogáveis; precisa de ${n}`);
  const vistas = new Set(recentes || []);
  const embaralhar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const novas = embaralhar(ok.filter(q => !vistas.has(q.id)));
  const velhas = embaralhar(ok.filter(q => vistas.has(q.id)));
  return [...novas, ...velhas].slice(0, n).map(q => q.id);
}
