/**
 * Confia? · Plinko. O resultado é sorteado pelo motor ANTES da animação;
 * a bolinha só desenha o caminho até a casa já decidida (PRD §5.3).
 */

/** Hipótese de MVP (PRD §5.2): média ponderada = 1×. */
export const MULTIPLICADORES = Object.freeze([
  { valor: 0.5, peso: 30 },
  { valor: 1, peso: 45 },
  { valor: 1.5, peso: 20 },
  { valor: 2, peso: 5 },
]);

/** Casas do tabuleiro (9 casas, 8 fileiras de pinos). Só aparência: a probabilidade vem de MULTIPLICADORES. */
export const CASAS = Object.freeze([2, 1.5, 1, 0.5, 1, 0.5, 1, 1.5, 2]);
export const FILEIRAS = CASAS.length - 1;

/** Sorteia o multiplicador a partir de um número em [0,1). */
export function sortearMultiplicador(r, tabela = MULTIPLICADORES) {
  if (!(r >= 0 && r < 1)) throw new RangeError('r deve estar em [0,1)');
  const total = tabela.reduce((s, m) => s + m.peso, 0);
  let x = r * total;
  for (const m of tabela) { if (x < m.peso) return m.valor; x -= m.peso; }
  return tabela[tabela.length - 1].valor;
}

/** Escolhe em qual casa a bolinha cai, entre as casas que têm aquele multiplicador. */
export function casaPara(multiplicador, r) {
  const opcoes = CASAS.map((v, i) => (v === multiplicador ? i : -1)).filter(i => i >= 0);
  if (!opcoes.length) throw new Error('multiplicador sem casa no tabuleiro: ' + multiplicador);
  return opcoes[Math.min(opcoes.length - 1, Math.floor(r * opcoes.length))];
}

/**
 * Caminho da bolinha: uma decisão por fileira ('E' ou 'D'); o número de 'D' é o índice da casa.
 * @param {number} casa @param {() => number} rng
 */
export function caminhoAte(casa, rng) {
  const passos = Array.from({ length: FILEIRAS }, (_, i) => (i < casa ? 'D' : 'E'));
  for (let i = passos.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [passos[i], passos[j]] = [passos[j], passos[i]]; }
  return passos;
}

/** Jogada completa do Plinko a partir de um gerador. */
export function jogarPlinko(rng) {
  const multiplicador = sortearMultiplicador(rng());
  const casa = casaPara(multiplicador, rng());
  return { multiplicador, casa, caminho: caminhoAte(casa, rng) };
}

/** Gerador determinístico (mulberry32) a partir de um texto. */
export function geradorComSemente(texto) {
  let h = 1779033703 ^ texto.length;
  for (let i = 0; i < texto.length; i++) { h = Math.imul(h ^ texto.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Desafio diário: mesmo resultado para todo mundo naquela rodada (PRD §5.5). */
export function plinkoDoDesafio(desafioId, versao, rodada) {
  return jogarPlinko(geradorComSemente(`confia:${desafioId}:v${versao}:r${rodada}`));
}

/** Partidas livres: aleatório de verdade quando o navegador oferece. */
export function geradorLivre() {
  const c = globalThis.crypto;
  if (c && c.getRandomValues) {
    const buf = new Uint32Array(1);
    return () => { c.getRandomValues(buf); return buf[0] / 4294967296; };
  }
  return Math.random;
}
