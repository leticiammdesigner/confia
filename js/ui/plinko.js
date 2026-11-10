/**
 * Confia? · desenho e animação do Plinko. Só apresentação: a casa final e o caminho (E/D por fileira)
 * vêm prontos do motor. Aqui entram só detalhes visuais aleatórios (altura dos quiques, ritmo, pequenos
 * desvios), que nunca mudam o resultado. Uma falha ou um "pular" na animação também não muda nada.
 */
import { CASAS, FILEIRAS } from '../motor/plinko.js';

const W = 320, CX = 160, DX = 16, Y0 = 28, DY = 24;
const R_PINO = 3.5, R_BOLA = 8;
const Y_CASA = Y0 + FILEIRAS * DY - 6, ALT_CASA = 36, H = Y_CASA + ALT_CASA + 6;
const xNaFileira = (r, direitas) => CX + (2 * direitas - r) * DX;
const classe = m => ({ 2: 'm2', 1.5: 'm15', 1: 'm1', 0.5: 'm05' }[m]);
export const rotuloMult = m => String(m).replace('.', ',') + '×';
const XY = (x, y) => `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
const pousoX = casa => xNaFileira(FILEIRAS, casa);
const POUSO_Y = Y_CASA + ALT_CASA - R_BOLA - 5;
/** Último caminho desenhado, para o rastro continuar à vista depois que a tela é redesenhada. */
let rastroAnterior = null;
const dRastro = pts => 'M' + pts.filter((_, i) => i % 2 === 0).map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L');

/** SVG do tabuleiro. `casaFinal` destaca a casa onde a bolinha parou. */
export function svgTabuleiro(casaFinal = null) {
  let pinos = '';
  for (let r = 0; r < FILEIRAS; r++) for (let j = 0; j <= r; j++) pinos += `<circle class="pino" data-p="${r}-${j}" cx="${xNaFileira(r, j)}" cy="${Y0 + r * DY}" r="${R_PINO}"/>`;
  const casas = CASAS.map((m, k) => {
    const x = xNaFileira(FILEIRAS, k);
    return `<g class="casa ${classe(m)}${k === casaFinal ? ' final' : ''}"><rect x="${x - 15}" y="${Y_CASA}" width="30" height="${ALT_CASA}" rx="5"/><text x="${x}" y="${Y_CASA + 15}">${rotuloMult(m)}</text></g>`;
  }).join('');
  const bx = casaFinal == null ? CX : pousoX(casaFinal), by = casaFinal == null ? 8 : POUSO_Y;
  return `<svg class="tabuleiro" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tabuleiro do Plinko com casas de ${[...new Set(CASAS)].sort().map(rotuloMult).join(', ')}">${pinos}${casas}<path class="rastro" d="${casaFinal != null && rastroAnterior?.casa === casaFinal ? rastroAnterior.d : ''}"/><circle class="bolinha" cx="0" cy="0" r="${R_BOLA}" style="transform:${XY(bx, by)}"/></svg>`;
}

const sorteio = (a, b) => a + Math.random() * (b - a);

/**
 * Monta a trajetória: queda inicial, um quique em cada fileira (para o lado que o motor decidiu),
 * e a chegada na casa com dois quiques curtos. Devolve quadros com tempo absoluto e os toques nos pinos.
 */
function trajetoria(plinko) {
  const pts = [], toques = [];
  let t = 0, direitas = 0;
  const contato = r => ({ x: xNaFileira(r, direitas) + sorteio(-2.5, 2.5), y: Y0 + r * DY - R_PINO - R_BOLA + 1 });
  // queda inicial: sai de um ponto um pouco deslocado do centro e acelera
  let a = { x: CX + sorteio(-7, 7), y: 4 }, b = contato(0);
  const queda = 260;
  for (let i = 1; i <= 6; i++) { const u = i / 6; pts.push({ t: t + queda * u, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u * u }); }
  t += queda; toques.push({ t, p: `0-0` });
  plinko.caminho.forEach((d, r) => {
    const de = pts.at(-1);
    if (d === 'D') direitas++;
    const ultimo = r === FILEIRAS - 1;
    const para = ultimo ? { x: pousoX(plinko.casa), y: POUSO_Y } : contato(r + 1);
    const altura = sorteio(5, 13) + (ultimo ? 4 : 0);
    const dur = sorteio(150, 230) + (ultimo ? 90 : 0);
    // às vezes a bolinha dá um toquinho extra antes de seguir: só charme visual
    if (!ultimo && r > 0 && Math.random() < 0.18) {
      const meio = 90;
      for (let i = 1; i <= 3; i++) { const u = i / 3; pts.push({ t: t + meio * u, x: de.x, y: de.y - 6 * 4 * u * (1 - u) }); }
      t += meio; toques.push({ t, p: `${r}-${direitas - (d === 'D' ? 1 : 0)}` });
    }
    for (let i = 1; i <= 7; i++) {
      const u = i / 7, ux = 1 - (1 - u) * (1 - u);
      pts.push({ t: t + dur * u, x: de.x + (para.x - de.x) * ux, y: de.y + (para.y - de.y) * u * u - altura * 4 * u * (1 - u) });
    }
    t += dur;
    if (!ultimo) toques.push({ t, p: `${r + 1}-${direitas}` });
  });
  // chegada: dois quiques que morrem dentro da casa
  const fim = pts.at(-1);
  for (const [h, dur] of [[9, 170], [3, 110]]) {
    for (let i = 1; i <= 4; i++) { const u = i / 4; pts.push({ t: t + dur * u, x: fim.x, y: fim.y - h * 4 * u * (1 - u) }); }
    t += dur;
  }
  return { pts, toques, total: t, chegada: t - 280 };
}

/**
 * Anima a bolinha pelo caminho já sorteado.
 * @param {SVGSVGElement} svg @param {{casa:number, caminho:string[]}} plinko @param {{reduzir?:boolean}} op
 * @returns {{terminou: Promise<void>, pular: () => void}}
 */
export function animarPlinko(svg, plinko, { reduzir = false } = {}) {
  const bola = svg.querySelector('.bolinha');
  const casa = svg.querySelectorAll('.casa')[plinko.casa];
  const extras = [];
  let marcado = false;
  const desenharRastro = pts => {
    const r = svg.querySelector('.rastro');
    if (!r || !pts) return;
    rastroAnterior = { casa: plinko.casa, d: dRastro(pts) };
    r.setAttribute('d', rastroAnterior.d);
  };
  const marcarFinal = pts => {
    if (marcado) return; marcado = true;
    extras.forEach(a => { try { a.cancel(); } catch { /* já acabou */ } });
    svg.querySelectorAll('.pino.bateu').forEach(p => p.classList.remove('bateu'));
    casa?.classList.add('final');
    bola.style.transform = XY(pousoX(plinko.casa), POUSO_Y);
    desenharRastro(pts);
  };
  if (reduzir || typeof bola.animate !== 'function') { marcarFinal(null); return { terminou: Promise.resolve(), pular() {} }; }

  const { pts, toques, total, chegada } = trajetoria(plinko);
  let anim;
  try {
    anim = bola.animate([{ transform: XY(pts[0].x, 4), offset: 0 }, ...pts.map(p => ({ transform: XY(p.x, p.y), offset: Math.min(1, p.t / total) }))], { duration: total, fill: 'forwards', easing: 'linear' });
  } catch { marcarFinal(null); return { terminou: Promise.resolve(), pular() {} }; }
  // pinos acendem e pulsam quando a bolinha bate
  for (const { t, p } of toques) {
    const pino = svg.querySelector(`[data-p="${p}"]`);
    if (!pino) continue;
    try { extras.push(pino.animate([{ transform: 'scale(1)', fill: '#1C1A17' }, { transform: 'scale(1.9)', fill: '#E2512F', offset: 0.25 }, { transform: 'scale(1)', fill: '#1C1A17' }], { duration: 320, delay: t, easing: 'ease-out' })); } catch { /* sem efeito */ }
  }
  // a casa afunda um pouquinho quando a bolinha chega
  try { extras.push(casa.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)', offset: 0.35 }, { transform: 'translateY(0)' }], { duration: 380, delay: chegada, easing: 'ease-out' })); } catch { /* sem efeito */ }

  const terminou = anim.finished.catch(() => {}).then(() => marcarFinal(pts));
  return { terminou, pular: () => { try { anim.finish(); } catch { marcarFinal(pts); } } };
}
