/**
 * Confia? · persistência local. Tudo protegido: sem localStorage (aba anônima, bloqueio), o jogo segue em memória.
 * O armazenamento local evita repetições acidentais; não é proteção antifraude (PRD §2.3).
 */
const CHAVES = { partida: 'confia:partida:v1', historico: 'confia:historico:v1', recentes: 'confia:recentes:v1', prefs: 'confia:prefs:v1' };
const memoria = {};

function ler(chave, padrao) {
  try { const v = localStorage.getItem(chave); return v == null ? padrao : JSON.parse(v); }
  catch { return chave in memoria ? memoria[chave] : padrao; }
}
function gravar(chave, valor) {
  memoria[chave] = valor;
  try { if (valor === null) localStorage.removeItem(chave); else localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* segue em memória */ }
}

export const partidaSalva = () => ler(CHAVES.partida, null);
export const salvarPartida = p => gravar(CHAVES.partida, p);
export const apagarPartida = () => gravar(CHAVES.partida, null);

/** Histórico: guarda só o resumo de partidas concluídas, sem duplicar a mesma partida (refresh). */
export const historico = () => ler(CHAVES.historico, []);
export function registrarNoHistorico(item) {
  const h = historico();
  if (h.some(x => x.gameId === item.gameId)) return false;
  gravar(CHAVES.historico, [item, ...h].slice(0, 30));
  return true;
}

export const perguntasRecentes = () => ler(CHAVES.recentes, []);
export function marcarRecentes(ids) { gravar(CHAVES.recentes, [...ids, ...perguntasRecentes().filter(x => !ids.includes(x))].slice(0, 16)); }

export const preferencias = () => ler(CHAVES.prefs, { reduzirMovimento: null });
export const salvarPreferencias = p => gravar(CHAVES.prefs, { ...preferencias(), ...p });
