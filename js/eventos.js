/**
 * Confia? · eventos de uso (PRD §13), sem dados pessoais e sem envio para servidor por enquanto.
 * Quem quiser medir escuta o evento "confia:evento" no window e envia para a ferramenta escolhida.
 */
const ultimos = [];
export function registrar(nome, dados = {}) {
  const ev = { nome, ...dados, em: new Date().toISOString() };
  ultimos.push(ev); if (ultimos.length > 100) ultimos.shift();
  try { window.dispatchEvent(new CustomEvent('confia:evento', { detail: ev })); } catch { /* sem window */ }
}
export const eventosRecentes = () => ultimos.slice();
