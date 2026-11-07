/**
 * Confia? · desenho e animação do Plinko. Só apresentação: a casa final vem pronta do motor.
 * Uma falha ou um "pular" na animação nunca muda o resultado.
 */
import { CASAS, FILEIRAS } from '../motor/plinko.js';

const W = 320, CX = 160, DX = 16, Y0 = 50, DY = 30, Y_CASA = Y0 + FILEIRAS * DY + 4, H = Y_CASA + 52;
const xNaFileira = (r, direitas) => CX + (2 * direitas - r) * DX;
const classe = m => ({ 2: 'm2', 1.5: 'm15', 1: 'm1', 0.5: 'm05' }[m]);
export const rotuloMult = m => String(m).replace('.', ',') + '×';

/** SVG do tabuleiro. `casaFinal` destaca a casa onde a bolinha parou. */
export function svgTabuleiro(casaFinal = null) {
  let pinos = '';
  for (let r = 0; r < FILEIRAS; r++) for (let j = 0; j <= r; j++) pinos += `<circle class="pino" cx="${xNaFileira(r, j)}" cy="${Y0 + r * DY}" r="4"/>`;
  const casas = CASAS.map((m, k) => {
    const x = xNaFileira(FILEIRAS, k);
    return `<g class="casa ${classe(m)}${k === casaFinal ? ' final' : ''}"><rect x="${x - 15}" y="${Y_CASA}" width="30" height="44" rx="5"/><text x="${x}" y="${Y_CASA + 27}">${rotuloMult(m)}</text></g>`;
  }).join('');
  const bolinhaY = casaFinal == null ? 18 : Y_CASA + 12, bolinhaX = casaFinal == null ? CX : xNaFileira(FILEIRAS, casaFinal);
  return `<svg class="tabuleiro" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tabuleiro do Plinko com casas de ${[...new Set(CASAS)].sort().map(rotuloMult).join(', ')}">${pinos}${casas}<circle class="bolinha" cx="0" cy="0" r="9" style="transform:translate(${bolinhaX}px,${bolinhaY}px)"/></svg>`;
}

/**
 * Anima a bolinha pelo caminho já sorteado.
 * @param {SVGSVGElement} svg @param {{casa:number, caminho:string[]}} plinko @param {{reduzir?:boolean, duracao?:number}} op
 * @returns {{terminou: Promise<void>, pular: () => void}}
 */
export function animarPlinko(svg, plinko, { reduzir = false, duracao = 2300 } = {}) {
  const bola = svg.querySelector('.bolinha');
  const quadros = [{ transform: `translate(${CX}px,18px)`, offset: 0 }];
  let direitas = 0;
  const passo = 0.9 / (FILEIRAS + 1);
  plinko.caminho.forEach((d, r) => {
    const x = xNaFileira(r, direitas), y = Y0 + r * DY - 12;
    const base = 0.04 + r * passo;
    quadros.push({ transform: `translate(${x}px,${y}px)`, offset: base + passo * 0.75, easing: 'ease-out' });
    const lado = d === 'D' ? 1 : -1;
    quadros.push({ transform: `translate(${x + lado * 7}px,${y - 6}px)`, offset: base + passo, easing: 'ease-in' });
    if (d === 'D') direitas++;
  });
  const xf = xNaFileira(FILEIRAS, plinko.casa);
  quadros.push({ transform: `translate(${xf}px,${Y_CASA - 6}px)`, offset: 0.95, easing: 'ease-in' });
  quadros.push({ transform: `translate(${xf}px,${Y_CASA + 12}px)`, offset: 1 });
  const marcarFinal = () => { svg.querySelectorAll('.casa')[plinko.casa]?.classList.add('final'); bola.style.transform = `translate(${xf}px,${Y_CASA + 12}px)`; };
  if (reduzir || typeof bola.animate !== 'function') { marcarFinal(); return { terminou: Promise.resolve(), pular() {} }; }
  let anim;
  try { anim = bola.animate(quadros, { duration: duracao, fill: 'forwards' }); }
  catch { marcarFinal(); return { terminou: Promise.resolve(), pular() {} }; }
  const terminou = anim.finished.catch(() => {}).then(marcarFinal);
  return { terminou, pular: () => { try { anim.finish(); } catch { marcarFinal(); } } };
}
