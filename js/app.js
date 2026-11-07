/**
 * Confia? · controlador da interface. Toda mudança de jogo passa pelo motor (motor/partida.js);
 * aqui só se desenha a fase atual, se salva o estado e se encaminham os toques.
 */
import { BANCO } from './dados/banco.js';
import * as M from './motor/partida.js';
import * as R from './motor/regras.js';
import { MULTIPLICADORES, geradorLivre } from './motor/plinko.js';
import { sortearPerguntas, jogaveis } from './motor/perguntas.js';
import { textoCompartilhar } from './motor/compartilhar.js';
import * as S from './persistencia.js';
import { criarAdaptadorDeAnuncios } from './anuncios.js';
import { svgTabuleiro, animarPlinko, rotuloMult } from './ui/plinko.js';
import { registrar } from './eventos.js';

const app = document.getElementById('app');
const avisos = document.getElementById('avisos');
const POR_ID = new Map(BANCO.map(q => [q.id, q]));
const JOGAVEIS = new Set(jogaveis(BANCO).map(q => q.id));
const anuncios = criarAdaptadorDeAnuncios(null); // sem provedor: opção de anúncio fica escondida
const NOME_MODO = { rapida: 'Partida rápida', completa: 'Partida completa', diario: 'Desafio do dia' };

/** @type {import('./motor/partida.js').Partida|null} */
let partida = null;
let tela = 'home';
let rascunho = { modo: 'seco', valor: null };
let mostrarResultadoPlinko = false;
let confirmandoNova = false;
let animacao = null;
let ocupado = false;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pts = n => `${n} ${Math.abs(n) === 1 ? 'ponto' : 'pontos'}`;
const sinal = n => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');
const reduzirMovimento = () => {
  const p = S.preferencias().reduzirMovimento;
  return p == null ? matchMedia('(prefers-reduced-motion: reduce)').matches : p;
};
const anunciar = t => { avisos.textContent = ''; setTimeout(() => (avisos.textContent = t), 30); };

// ------------------------------------------------------------------ estado
function iniciar() {
  const salva = S.partidaSalva();
  if (salva && M.estadoValido(salva, JOGAVEIS)) { partida = salva; if (partida.phase !== 'fim') tela = 'jogo'; }
  else if (salva) S.apagarPartida();
  const pref = document.getElementById('menosMovimento');
  pref.checked = reduzirMovimento();
  pref.addEventListener('change', () => S.salvarPreferencias({ reduzirMovimento: pref.checked }));
  const dialogo = document.getElementById('comoJogar');
  document.getElementById('abrirComoJogar').addEventListener('click', () => { dialogo.showModal(); registrar('como_jogar_aberto'); });
  app.addEventListener('click', aoClicar);
  document.querySelector('.topo .marca-hub').addEventListener('click', e => { e.preventDefault(); tela = 'home'; confirmandoNova = false; render(); });
  app.addEventListener('input', aoDigitar);
  app.addEventListener('change', aoDigitar);
  render(false);
}

/** Toda transição passa aqui: valida no motor, salva e redesenha. Toque duplo vira erro de transição e é ignorado. */
function aplicar(transicao, evento) {
  if (ocupado) return false;
  ocupado = true;
  try {
    const novo = transicao(partida);
    partida = novo;
    S.salvarPartida(partida);
    if (partida.phase === 'fim') guardarNoHistorico();
    if (evento) registrar(evento.nome, { gameId: partida.gameId, mode: partida.mode, rodada: partida.roundIndex + 1, ...evento.dados });
    return true;
  } catch (e) {
    if (!(e instanceof M.ErroDeTransicao)) throw e;
    return false;
  } finally { ocupado = false; }
}

function guardarNoHistorico() {
  const r = M.resumo(partida);
  if (S.registrarNoHistorico({ gameId: partida.gameId, mode: partida.mode, saldo: r.saldoFinal, acertos: r.acertos, rodadas: r.rodadasJogadas, em: partida.completedAt }))
    registrar('partida_concluida', { gameId: partida.gameId, mode: partida.mode, saldo: r.saldoFinal, acertos: r.acertos, recuperacoes: r.recuperacoes });
}

function novaPartida(mode = 'rapida') {
  const ids = sortearPerguntas(BANCO, M.RODADAS[mode], S.perguntasRecentes(), geradorLivre());
  S.marcarRecentes(ids);
  if (partida && partida.phase !== 'fim') registrar('partida_abandonada', { gameId: partida.gameId, rodada: partida.roundIndex + 1 });
  partida = M.criarPartida({ mode, perguntas: ids });
  S.salvarPartida(partida);
  rascunho = { modo: 'seco', valor: null };
  tela = 'jogo'; confirmandoNova = false; mostrarResultadoPlinko = false;
  registrar('partida_iniciada', { gameId: partida.gameId, mode });
  render();
}

// ------------------------------------------------------------------ eventos
function aoClicar(e) {
  const alvo = e.target.closest('[data-acao]');
  if (!alvo || alvo.disabled || alvo.getAttribute('aria-disabled') === 'true') return;
  const acao = alvo.dataset.acao;
  if (acao === 'nova') { if (partida && partida.phase !== 'fim' && !confirmandoNova) { confirmandoNova = true; render(); return; } return novaPartida('rapida'); }
  if (acao === 'cancelar-nova') { confirmandoNova = false; return render(); }
  if (acao === 'continuar') { tela = 'jogo'; return render(); }
  if (acao === 'inicio') { tela = 'home'; confirmandoNova = false; return render(); }
  if (acao === 'como-jogar') return document.getElementById('comoJogar').showModal();
  if (acao === 'ficha') { rascunho.valor = Number(alvo.dataset.valor); return atualizarAposta(); }
  if (acao === 'menos' || acao === 'mais') { const l = limites(); rascunho.valor = Math.min(l.max, Math.max(l.min, valorAtual() + (acao === 'mais' ? 1 : -1))); return atualizarAposta(); }
  if (acao === 'confirmar') return confirmar(alvo);
  if (acao === 'pular') { animacao?.pular(); return; }
  if (acao === 'revelar') { mostrarResultadoPlinko = false; return render(); }
  if (acao === 'responder') return responder(alvo.dataset.letra);
  if (acao === 'avancar') { if (aplicar(p => M.avancar(p))) { rascunho = { modo: rascunho.modo, valor: null }; if (partida.phase === 'zerado') registrar('saldo_zerado', { gameId: partida.gameId, rodada: partida.roundIndex + 1 }); render(); } return; }
  if (acao === 'recuperar') { if (aplicar(p => M.recuperar(p), { nome: 'recuperacao_gratuita' })) render(); return; }
  if (acao === 'encerrar') { if (aplicar(p => M.encerrar(p))) render(); return; }
  if (acao === 'compartilhar') return compartilhar();
  if (acao === 'copiar') return copiar();
}

function aoDigitar(e) {
  if (e.target.name === 'modo') { rascunho.modo = e.target.value; rascunho.valor = null; return atualizarAposta(true); }
  if (e.target.id === 'faixaAposta') { rascunho.valor = Number(e.target.value); return atualizarAposta(); }
}

function limites() { return R.limitesAposta(partida.balance, rascunho.modo); }
function valorAtual() {
  const l = limites();
  if (!l) return 0;
  const sugerido = rascunho.valor ?? Math.round(partida.balance * 0.25);
  return Math.min(l.max, Math.max(l.min, sugerido));
}

function confirmar(botao) {
  const valor = valorAtual(), modo = rascunho.modo;
  botao.disabled = true;
  const ok = aplicar(p => M.confirmarAposta(p, { valor, modo }, geradorLivre()), { nome: 'aposta_confirmada', dados: { valor, modo, saldo: partida.balance } });
  if (!ok) { botao.disabled = false; return; }
  if (modo === 'plinko') registrar('plinko_sorteado', { gameId: partida.gameId, multiplicador: partida.multiplier });
  mostrarResultadoPlinko = modo === 'plinko';
  render();
}

function responder(letra) {
  app.querySelectorAll('button.alt').forEach(b => (b.disabled = true));
  const q = POR_ID.get(M.perguntaAtual(partida));
  if (!aplicar(p => M.responder(p, letra, q), { nome: 'resposta_registrada', dados: { letra } })) return;
  const r = partida.roundResults.at(-1);
  registrar(r.correct ? 'acerto' : 'erro', { gameId: partida.gameId, delta: r.delta });
  render();
}

// ------------------------------------------------------------------ desenho
function render(mudarFoco = true) {
  animacao = null;
  if (tela === 'home' || !partida) app.innerHTML = telaHome();
  else {
    const f = partida.phase;
    app.innerHTML = placar() + (
      f === 'aposta' ? telaAposta() :
      f === 'plinko' || (f === 'pergunta' && mostrarResultadoPlinko) ? telaPlinko() :
      f === 'pergunta' ? telaPergunta() :
      f === 'resultado' ? telaResultado() :
      f === 'zerado' ? telaZerado() : telaFim());
    if (f === 'plinko') rodarPlinko();
    if (f === 'aposta') atualizarAposta(true);
  }
  if (mudarFoco) { const t = app.querySelector('[data-foco]'); (t || app).focus({ preventScroll: true }); window.scrollTo(0, 0); }
}

function telaHome() {
  const ativa = partida && partida.phase !== 'fim';
  const hist = S.historico().slice(0, 5);
  const fichas = `<svg class="fichas-deco" width="130" height="90" viewBox="0 0 130 90" aria-hidden="true"><g stroke="#1C1A17" stroke-width="3"><circle cx="40" cy="55" r="32" fill="#F6C419"/><circle cx="40" cy="55" r="22" fill="none" stroke-dasharray="6 5"/><circle cx="92" cy="40" r="32" fill="#E2512F"/><circle cx="92" cy="40" r="22" fill="none" stroke-dasharray="6 5"/></g></svg>`;
  return `<section class="home" aria-labelledby="tituloHome">
    <div class="cartaz-confia">
      <p class="selo-jogo">um jogo Matutar Games</p>
      <h1 class="logo-confia" id="tituloHome" tabindex="-1" data-foco>CONFIA<span>?</span></h1>
      <p class="premissa">Você vê as alternativas, aposta e só depois descobre a pergunta.</p>
      ${fichas}
    </div>
    <p class="chamada">Você confia no que sabe?</p>
    ${ativa && confirmandoNova ? `<div class="painel confirma-nova" role="group" aria-label="Começar outra partida">
        <p><b>Você tem uma partida em andamento.</b> Começar outra apaga essa.</p>
        <button class="btn btn-principal" data-acao="nova">Começar outra</button>
        <button class="btn" data-acao="cancelar-nova">Voltar</button></div>` : `
    <div class="acoes-home">
      ${ativa ? `<button class="btn btn-principal btn-modo" data-acao="continuar">Continuar partida<small>Rodada ${partida.roundIndex + 1} de ${partida.perguntas.length} · saldo ${partida.balance}</small></button>
        <button class="btn btn-modo" data-acao="nova">Nova partida rápida<small>4 rodadas · descarta a atual</small></button>`
      : `<button class="btn btn-principal btn-modo" data-acao="nova">Partida rápida<small>4 rodadas · 2 a 3 minutos</small></button>`}
      <button class="btn" data-acao="como-jogar">Como jogar</button>
    </div>`}
    <p class="em-breve">Partida completa e Desafio do dia chegam na próxima etapa.</p>
    ${hist.length ? `<section class="painel anteriores" aria-labelledby="tituloAnteriores"><h2 id="tituloAnteriores">Suas últimas partidas</h2><ol>${hist.map(h =>
      `<li><span>${esc(NOME_MODO[h.mode])} · ${new Date(h.em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span><span><b>${h.saldo}</b> pts · ${h.acertos}/${h.rodadas} acertos</span></li>`).join('')}</ol></section>` : ''}
  </section>`;
}

function placar() {
  const n = partida.perguntas.length;
  const casas = Array.from({ length: n }, (_, i) => {
    const r = partida.roundResults[i];
    const cls = r ? (r.correct ? 'acerto' : 'erro') : i === partida.roundIndex && partida.phase !== 'fim' ? 'atual' : '';
    const sim = r ? (r.correct ? '✓' : '✗') : '';
    const rot = r ? `Rodada ${i + 1}: ${r.correct ? 'acertou' : 'errou'}` : `Rodada ${i + 1}${cls ? ': agora' : ''}`;
    return `<li class="${cls}" aria-label="${rot}">${sim}</li>`;
  }).join('');
  const rodada = partida.phase === 'fim' ? 'Fim de jogo' : `Rodada ${partida.roundIndex + 1} de ${n}`;
  return `<div class="placar"><div class="rodadas"><span class="rodadas-rotulo">${rodada}</span><ol class="casas" aria-label="Progresso">${casas}</ol></div>
    <div class="saldo" aria-label="Saldo: ${pts(partida.balance)}"><small>Saldo</small><b>${partida.balance}</b></div></div>`;
}

function listaAlternativas(q, modo) {
  const res = partida.phase === 'resultado' ? partida.roundResults.at(-1) : null;
  const itens = q.alternatives.map(a => {
    if (modo === 'ver') return `<li><div class="alt"><span class="letra" aria-hidden="true">${a.id}</span><span><span class="sr-only">${a.id}: </span>${esc(a.text)}</span></div></li>`;
    if (modo === 'responder') return `<li><button class="alt" data-acao="responder" data-letra="${a.id}"><span class="letra" aria-hidden="true">${a.id}</span><span><span class="sr-only">Alternativa ${a.id}: </span>${esc(a.text)}</span></button></li>`;
    const certa = a.id === q.correctAnswer, minha = a.id === res.answer;
    const cls = certa ? 'certa' : minha ? 'errada' : '';
    const marca = certa ? (minha ? '✓ Sua resposta, certa' : '✓ Certa') : minha ? '✗ Sua resposta' : '';
    return `<li><div class="alt ${cls}"><span class="letra" aria-hidden="true">${a.id}</span><span><span class="sr-only">${a.id}: </span>${esc(a.text)}</span>${marca ? `<span class="marca">${marca}</span>` : ''}</div></li>`;
  }).join('');
  return `<ol class="alternativas ${modo === 'ver' ? 'so-ver' : ''}" aria-label="Alternativas">${itens}</ol>`;
}

function telaAposta() {
  const q = POR_ID.get(M.perguntaAtual(partida));
  const plinkoOk = M.plinkoDisponivel(partida);
  if (!plinkoOk && rascunho.modo === 'plinko') rascunho.modo = 'seco';
  return `<p class="fase">Rodada ${partida.roundIndex + 1} · primeiro, a aposta</p>
    <h2 class="titulo-fase" tabindex="-1" data-foco>Essas são as alternativas. A pergunta ainda é segredo.</h2>
    ${listaAlternativas(q, 'ver')}
    <p class="aviso-ver"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>Ainda não dá para responder.</p>
    <section class="painel aposta" aria-labelledby="tituloAposta">
      <h3 id="tituloAposta">Vai de quanto?</h3>
      <fieldset class="modos"><legend>Como você quer arriscar?</legend>
        <label class="modo"><input type="radio" name="modo" value="seco" ${rascunho.modo === 'seco' ? 'checked' : ''}><b>No seco</b><span>vale 1×</span></label>
        <label class="modo"><input type="radio" name="modo" value="plinko" ${rascunho.modo === 'plinko' ? 'checked' : ''} ${plinkoOk ? '' : 'disabled aria-describedby="motivoPlinko"'}><b>Plinko</b><span>de 0,5× a 2×</span></label>
      </fieldset>
      ${plinkoOk ? '' : `<p class="motivo" id="motivoPlinko">O Plinko precisa de pelo menos ${R.APOSTA_MINIMA * 2} pontos de saldo.</p>`}
      <div id="controleAposta"></div>
      <button class="btn btn-principal" data-acao="confirmar" id="botaoConfirmar">Confio!</button>
    </section>`;
}

/** Atualiza só o controle de valor (sem redesenhar a tela, para não perder o foco do toque). */
function atualizarAposta(trocouModo = false) {
  const caixa = document.getElementById('controleAposta');
  if (!caixa) return;
  const l = limites(), v = valorAtual(), modo = rascunho.modo;
  const p = R.potencial(v, modo, null, MULTIPLICADORES.map(m => m.valor));
  const faixa = (a, b) => (a === b ? `${a}` : `${a} a ${b}`);
  const htmlControles = `
    <div class="valor">
      <button class="passo" type="button" data-acao="menos" aria-label="Diminuir aposta" ${v <= l.min ? 'disabled' : ''}>−</button>
      <output id="valorAposta" for="faixaAposta" aria-live="polite">${v}<small>de ${l.min} a ${l.max} pontos</small></output>
      <button class="passo" type="button" data-acao="mais" aria-label="Aumentar aposta" ${v >= l.max ? 'disabled' : ''}>+</button>
    </div>
    <label class="sr-only" for="faixaAposta">Valor da aposta</label>
    <input class="faixa" type="range" id="faixaAposta" min="${l.min}" max="${l.max}" step="1" value="${v}" ${l.min === l.max ? 'disabled' : ''} aria-valuetext="${pts(v)}">
    <div class="fichas" role="group" aria-label="Atalhos de aposta">${R.atalhos(partida.balance, modo).map(a =>
      `<button type="button" class="ficha ${a.max ? 'vmax' : 'v' + a.valor}" data-acao="ficha" data-valor="${a.valor}" aria-pressed="${a.valor === v}" aria-label="${a.max ? `Máximo, ${a.valor}` : a.valor} pontos"><span>${a.max ? 'MÁX' : a.valor}</span></button>`).join('')}</div>
    <div class="potencial" aria-live="polite">
      <div class="ganha"><small>Se acertar</small><b>+${faixa(p.ganhoMin, p.ganhoMax)}</b></div>
      <div class="perde"><small>Se errar</small><b>−${faixa(p.perdaMin, p.perdaMax)}</b></div>
    </div>`;
  const faixaEl = document.getElementById('faixaAposta');
  if (faixaEl && !trocouModo && document.activeElement === faixaEl) {
    // arrastando a faixa: atualiza só os textos
    document.getElementById('valorAposta').innerHTML = `${v}<small>de ${l.min} a ${l.max} pontos</small>`;
    faixaEl.setAttribute('aria-valuetext', pts(v));
    caixa.querySelector('.potencial').innerHTML = `<div class="ganha"><small>Se acertar</small><b>+${faixa(p.ganhoMin, p.ganhoMax)}</b></div><div class="perde"><small>Se errar</small><b>−${faixa(p.perdaMin, p.perdaMax)}</b></div>`;
    caixa.querySelectorAll('.ficha').forEach(f => f.setAttribute('aria-pressed', String(Number(f.dataset.valor) === v)));
    caixa.querySelectorAll('.passo')[0].disabled = v <= l.min; caixa.querySelectorAll('.passo')[1].disabled = v >= l.max;
  } else {
    const focado = document.activeElement?.dataset?.acao, focadoValor = document.activeElement?.dataset?.valor;
    caixa.innerHTML = htmlControles;
    if (focado) caixa.querySelector(`[data-acao="${focado}"]${focadoValor ? `[data-valor="${focadoValor}"]` : ''}`)?.focus();
  }
  document.getElementById('botaoConfirmar').textContent = `Confio! Apostar ${v}${modo === 'plinko' ? ' no Plinko' : ''}`;
}

function telaPlinko() {
  const fim = partida.phase === 'pergunta';
  const v = R.pontosEmJogo(partida.betAmount, partida.multiplier);
  return `<p class="fase">Plinko</p>
    <h2 class="titulo-fase" tabindex="-1" data-foco>${fim ? `Caiu no ${rotuloMult(partida.multiplier)}!` : 'Lá vai a bolinha...'}</h2>
    <section class="painel plinko" aria-label="Plinko">
      <div class="plinko-info"><span>Aposta: ${pts(partida.betAmount)}</span><span>Pior caso: −${R.pontosEmJogo(partida.betAmount, 2)}</span></div>
      ${svgTabuleiro(fim ? partida.plinko.casa : null)}
      <p class="multiplicadores" aria-label="Chances">${MULTIPLICADORES.map(m => `<span>${rotuloMult(m.valor)} · ${m.peso}%</span>`).join('')}</p>
      ${fim ? `<div class="plinko-resultado" role="status"><span class="mult">${rotuloMult(partida.multiplier)}</span><span>Agora vale <b>+${v}</b> se acertar e <b>−${v}</b> se errar.</span></div>
        <button class="btn btn-principal" data-acao="revelar">Agora vem a pergunta...</button>`
      : `<button class="btn" data-acao="pular">Pular animação</button>`}
    </section>`;
}

function rodarPlinko() {
  const svg = app.querySelector('.tabuleiro');
  const gameId = partida.gameId, rodada = partida.roundIndex;
  animacao = animarPlinko(svg, partida.plinko, { reduzir: reduzirMovimento() });
  animacao.terminou.then(() => {
    if (!partida || partida.gameId !== gameId || partida.roundIndex !== rodada || partida.phase !== 'plinko') return;
    if (aplicar(p => M.concluirPlinko(p))) { mostrarResultadoPlinko = true; render(); anunciar(`Caiu no ${rotuloMult(partida.multiplier)}.`); }
  });
}

function telaPergunta() {
  const q = POR_ID.get(M.perguntaAtual(partida));
  const v = R.pontosEmJogo(partida.betAmount, partida.multiplier);
  const risco = partida.betMode === 'plinko' ? `Apostou ${partida.betAmount} no Plinko ${rotuloMult(partida.multiplier)} · vale ${v}` : `Apostou ${partida.betAmount} no seco`;
  return `<p class="fase">Agora vem a pergunta...</p>
    <span class="risco">${risco}</span>
    <h2 class="enunciado" tabindex="-1" data-foco>${esc(q.question)}</h2>
    ${listaAlternativas(q, 'responder')}`;
}

function telaResultado() {
  const q = POR_ID.get(M.perguntaAtual(partida));
  const r = partida.roundResults.at(-1);
  const titulo = r.correct ? (r.betAmount >= partida.roundResults.at(-1).saldoAntes * 0.5 ? 'Essa você sabia mesmo!' : 'Acertou! Devia ter apostado mais, hein?') : (r.betAmount >= r.saldoAntes * 0.5 ? 'Ih, apostou alto!' : 'Errou. Ainda bem que foi pouco.');
  const ultima = M.ultimaRodada(partida);
  return `<div class="veredito ${r.correct ? 'acerto' : 'erro'}" role="status"><span class="icone" aria-hidden="true">${r.correct ? '✓' : '✗'}</span>
      <span><span tabindex="-1" data-foco>${r.correct ? 'Acertou!' : 'Errou!'}</span><small>${esc(titulo)}</small></span></div>
    <p class="enunciado" style="animation:none;font-size:16px">${esc(q.question)}</p>
    ${listaAlternativas(q, 'resultado')}
    <p class="conta" aria-label="Saldo de ${r.saldoAntes} para ${r.saldoDepois}">${r.saldoAntes} <span aria-hidden="true">→</span> ${r.saldoDepois}
      <span class="delta ${r.delta > 0 ? 'mais' : r.delta < 0 ? 'menos' : ''}">(${sinal(r.delta)})</span></p>
    <section class="painel explicacao"><p>${esc(q.explanation)}</p>
      <p class="fonte">Fonte: ${q.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.titulo)}</a>`).join(' · ')}</p></section>
    <button class="btn btn-principal" data-acao="avancar">${ultima ? 'Ver resultado final' : 'Próxima rodada'}</button>`;
}

function telaZerado() {
  const anuncioOk = anuncios.estado() === 'disponivel' && !partida.adRecoveryUsed;
  return `<section class="painel zerado" aria-labelledby="tituloZerado">
    <h2 id="tituloZerado" tabindex="-1" data-foco>Zerou!</h2>
    <p>Acontece com quem confia. Ainda faltam ${partida.perguntas.length - partida.roundIndex - 1} ${partida.perguntas.length - partida.roundIndex - 1 === 1 ? 'pergunta' : 'perguntas'}.</p>
    <button class="btn btn-principal" data-acao="recuperar">Pegar ${R.RECUPERACAO_GRATUITA} pontos e continuar</button>
    ${anuncioOk ? '<button class="btn" data-acao="anuncio">Ver um anúncio e ganhar mais 20</button>' : ''}
    <button class="btn" data-acao="encerrar">Encerrar e ver o resultado</button>
  </section>`;
}

function fraseFinal(r) {
  if (r.acertos === r.rodadasJogadas && r.rodadasJogadas === r.totalRodadas) return r.saldoFinal >= 200 ? 'Gabaritou e apostou com coragem!' : 'Acertou tudo! Devia ter apostado mais, hein?';
  if (r.saldoFinal >= 200) return 'Que confiança! O saldo mais que dobrou.';
  if (r.saldoFinal > 100) return 'Saiu no lucro. Confiança bem calibrada.';
  if (r.saldoFinal === 100) return 'Empatou com a banca. Nem ganhou, nem perdeu.';
  if (r.saldoFinal === 0) return 'Zerou, mas descobriu um monte de coisa.';
  return r.acertos >= r.rodadasJogadas / 2 ? 'Sabia bastante. Faltou acertar a aposta.' : 'Hoje a confiança não colaborou. Bora de novo?';
}

function telaFim() {
  const r = M.resumo(partida);
  const linha = partida.roundResults.map(x => `<span aria-hidden="true">${x.correct ? '✅' : '❌'}</span>`).join('');
  return `<section class="fim" aria-labelledby="tituloFim">
    <article class="carta">
      <div class="carta-topo"><span class="logo-mini">CONFIA?</span><span class="marca-hub">MATUTAR <span>GAMES</span></span></div>
      <div class="carta-corpo">
        <h2 class="frase-final" id="tituloFim" tabindex="-1" data-foco>${esc(fraseFinal(r))}</h2>
        <p class="saldo-final">${r.saldoFinal}<small>pontos de saldo final</small></p>
        <p><b>${r.acertos} de ${r.rodadasJogadas}</b> acertos${r.encerradaAntes ? ` (encerrou na rodada ${r.rodadasJogadas} de ${r.totalRodadas})` : ''}</p>
        <p class="linha-rodadas" aria-label="${partida.roundResults.map((x, i) => `rodada ${i + 1} ${x.correct ? 'certa' : 'errada'}`).join(', ')}">${linha}</p>
        <dl class="estatisticas">
          <div><dt>Maior ganho</dt><dd>+${r.maiorGanho}</dd></div>
          <div><dt>Maior perda</dt><dd>−${r.maiorPerda}</dd></div>
          <div><dt>Usou o Plinko</dt><dd>${r.usosPlinko}×</dd></div>
          <div><dt>Recuperações</dt><dd>${r.recuperacoes}</dd></div>
        </dl>
      </div>
    </article>
    <div class="acoes-fim">
      <button class="btn btn-principal" data-acao="compartilhar">Compartilhar resultado</button>
      <p class="status-copia" id="statusCopia" role="status"></p>
      <button class="btn" data-acao="nova">Jogar de novo</button>
      <button class="btn" data-acao="inicio">Voltar ao início</button>
    </div>
  </section>`;
}

// ------------------------------------------------------------------ compartilhar
function texto() {
  const url = /^https?:$/.test(location.protocol) ? location.origin + location.pathname : '';
  return textoCompartilhar(partida, { url });
}
async function compartilhar() {
  const t = texto();
  registrar('resultado_compartilhado', { gameId: partida.gameId });
  if (navigator.share) {
    try { await navigator.share({ text: t }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  copiar();
}
async function copiar() {
  const t = texto(), st = document.getElementById('statusCopia');
  try { await navigator.clipboard.writeText(t); st.textContent = 'Resultado copiado. Sem spoiler das respostas.'; }
  catch {
    st.textContent = 'Não deu para copiar sozinho. Selecione o texto abaixo e copie.';
    if (!document.getElementById('textoCompartilhar')) st.insertAdjacentHTML('afterend', `<label class="sr-only" for="textoCompartilhar">Texto para compartilhar</label><textarea class="texto-compartilhar" id="textoCompartilhar" readonly>${esc(t)}</textarea>`);
    const ta = document.getElementById('textoCompartilhar'); ta.focus(); ta.select();
  }
}

iniciar();
