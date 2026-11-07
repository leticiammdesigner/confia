/**
 * Confia? · regras de aposta e pontuação (sem interface, sem estado global).
 * Valores numéricos são hipóteses de MVP (PRD §19): mudar aqui muda o jogo todo.
 */

export const SALDO_INICIAL = 100;
export const APOSTA_MINIMA = 10;
export const RECUPERACAO_GRATUITA = 10;
/** Pior multiplicador possível do Plinko: limita a aposta para nunca perder mais do que o saldo. */
export const EXPOSICAO_MAXIMA_PLINKO = 2;

/** @typedef {'seco'|'plinko'} ModoAposta */

/**
 * Arredondamento único do jogo: meio para cima (7,5 → 8). Só recebe valores >= 0.
 * @param {number} x
 */
export function arredondar(x) {
  if (!(x >= 0)) throw new RangeError('arredondar espera valor >= 0');
  return Math.floor(x + 0.5 + 1e-9);
}

/**
 * Faixa de aposta permitida, ou null se a modalidade não está disponível.
 * Decisão de MVP: com saldo abaixo de 10, a aposta seca mínima vira o próprio saldo (tudo ou nada),
 * para o jogador não ficar travado. O Plinko exige que metade do saldo cubra a aposta mínima.
 * @param {number} saldo @param {ModoAposta} modo
 * @returns {{min:number,max:number}|null}
 */
export function limitesAposta(saldo, modo) {
  if (!(saldo > 0)) return null;
  if (modo === 'seco') return { min: Math.min(APOSTA_MINIMA, saldo), max: saldo };
  if (modo === 'plinko') {
    const max = Math.floor(saldo / EXPOSICAO_MAXIMA_PLINKO);
    return max >= APOSTA_MINIMA ? { min: APOSTA_MINIMA, max } : null;
  }
  throw new Error('modo de aposta desconhecido: ' + modo);
}

/** @param {number} saldo @param {number} valor @param {ModoAposta} modo */
export function apostaValida(saldo, valor, modo) {
  const l = limitesAposta(saldo, modo);
  return !!l && Number.isInteger(valor) && valor >= l.min && valor <= l.max;
}

/** Atalhos 10, 25, 50 e máximo, só os válidos, sem repetição. */
export function atalhos(saldo, modo) {
  const l = limitesAposta(saldo, modo);
  if (!l) return [];
  const lista = [10, 25, 50].filter(v => v >= l.min && v <= l.max);
  if (!lista.includes(l.max)) lista.push(l.max);
  return lista.map(v => ({ valor: v, max: v === l.max }));
}

/** Pontos em jogo numa aposta já com multiplicador. */
export function pontosEmJogo(valor, multiplicador) {
  return arredondar(valor * multiplicador);
}

/**
 * Ganho e perda possíveis antes da pergunta.
 * No Plinko ainda não sorteado, devolve a faixa (pior e melhor caso).
 * @param {number} valor @param {ModoAposta} modo @param {number|null} multiplicador
 */
export function potencial(valor, modo, multiplicador, multiplicadores = [0.5, 2]) {
  if (modo === 'seco') return { ganhoMin: valor, ganhoMax: valor, perdaMin: valor, perdaMax: valor };
  if (multiplicador != null) { const v = pontosEmJogo(valor, multiplicador); return { ganhoMin: v, ganhoMax: v, perdaMin: v, perdaMax: v }; }
  const lo = Math.min(...multiplicadores), hi = Math.max(...multiplicadores);
  return { ganhoMin: pontosEmJogo(valor, lo), ganhoMax: pontosEmJogo(valor, hi), perdaMin: pontosEmJogo(valor, lo), perdaMax: pontosEmJogo(valor, hi) };
}

/**
 * Resultado da aposta. O saldo nunca fica negativo.
 * @returns {{delta:number, saldo:number}}
 */
export function liquidar(saldo, valor, multiplicador, acertou) {
  const v = pontosEmJogo(valor, multiplicador);
  if (acertou) return { delta: v, saldo: saldo + v };
  const perda = Math.min(v, saldo);
  return { delta: -perda, saldo: saldo - perda };
}
