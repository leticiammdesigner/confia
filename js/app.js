/**
 * Confia? · controlador da interface. Toda mudança de jogo passa pelo motor (motor/partida.js);
 * aqui só se desenha a fase atual, se salva o estado e se encaminham os toques.
 */
import { URL_HUB } from './config.js';
import { BANCO } from './dados/banco.js';
import * as M from './motor/partida.js';
import * as R from './motor/regras.js';
import { MULTIPLICADORES, geradorLivre } from './motor/plinko.js';
import { sortearPerguntas, jogaveis, naoRevisadaDeTeste } from './motor/perguntas.js';
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
/** Ajuste fino da aposta (botões − e +). Só interface: não muda limites nem economia. */
const PASSO = 5;
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
  const marca = document.querySelector('.topo .marca-hub');
  if (URL_HUB) { marca.href = URL_HUB; marca.setAttribute('aria-label', 'Matutar Games, todos os jogos'); }
  else marca.addEventListener('click', e => { e.preventDefault(); tela = 'home'; confirmandoNova = false; render(); });
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
  const ids = sortearPerguntas(BANCO, M.RODADAS[mode], S.perguntasRecentes(), geradorLivre(), { diario: mode === 'diario' });
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
  if (acao === 'menos' || acao === 'mais') { const l = limites(); rascunho.valor = Math.min(l.max, Math.max(l.min, valorAtual() + (acao === 'mais' ? PASSO : -PASSO))); return atualizarAposta(); }
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
/*
 * Mobile-first: cada fase tem um título curto, o conteúdo da decisão e uma barra de ação
 * grudada no rodapé da tela (sticky, dentro do fluxo: nunca cobre conteúdo).
 * Regras completas ficam no "Como jogar"; aqui vai uma instrução por momento.
 */
function render(mudarFoco = true) {
  animacao = null;
  const emJogo = !(tela === 'home' || !partida);
  document.body.classList.toggle('em-jogo', emJogo);
  if (!emJogo) app.innerHTML = telaHome();
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
  document.body.classList.toggle('com-barra', !!app.querySelector('.barra-acao'));
  if (mudarFoco) { const t = app.querySelector('[data-foco]'); (t || app).focus({ preventScroll: true }); window.scrollTo(0, 0); }
}

const barra = conteudo => `<div class="barra-acao"><div class="barra-dentro">${conteudo}</div></div>`;

function telaHome() {
  const ativa = partida && partida.phase !== 'fim';
  const hist = S.historico().slice(0, 3);
  const fichas = `<svg class="fichas-deco" width="110" height="76" viewBox="0 0 130 90" aria-hidden="true"><g stroke="#1C1A17" stroke-width="3"><circle cx="40" cy="55" r="32" fill="#F6C419"/><circle cx="40" cy="55" r="22" fill="none" stroke-dasharray="6 5"/><circle cx="92" cy="40" r="32" fill="#E2512F"/><circle cx="92" cy="40" r="22" fill="none" stroke-dasharray="6 5"/></g></svg>`;
  return `<section class="home" aria-labelledby="tituloHome">
    <div class="cartaz-confia">
      <p class="selo-jogo">um jogo Matutar Games</p>
      <h1 class="logo-confia" id="tituloHome" tabindex="-1" data-foco>CONFIA<span>?</span></h1>
      <p class="premissa">Veja as respostas, aposte e só então descubra a pergunta.</p>
      ${fichas}
    </div>
    ${ativa && confirmandoNova ? `<div class="painel confirma-nova" role="group" aria-label="Começar outra partida">
        <p><b>Começar outra?</b> A partida atual será apagada.</p>
        <button class="btn btn-principal" data-acao="nova">Começar outra</button>
        <button class="btn" data-acao="cancelar-nova">Voltar</button></div>` : `
    <div class="acoes-home">
      ${ativa ? `<button class="btn btn-principal btn-modo" data-acao="continuar">Continuar<small>Rodada ${partida.roundIndex + 1} de ${partida.perguntas.length} · saldo ${partida.balance}</small></button>
        <button class="btn btn-modo" data-acao="nova">Nova partida<small>apaga a atual</small></button>`
      : `<button class="btn btn-principal btn-modo" data-acao="nova">Jogar<small>Partida rápida · 4 rodadas</small></button>`}
    </div>`}
    <p class="chamada">Você confia no que sabe?</p>
    ${hist.length ? `<section class="painel anteriores" aria-labelledby="tituloAnteriores"><h2 id="tituloAnteriores">Últimas partidas</h2><ol>${hist.map(h =>
      `<li><span>${new Date(h.em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span><span><b>${h.saldo}</b> pts · ${h.acertos}/${h.rodadas} acertos</span></li>`).join('')}</ol></section>` : ''}
    <p class="em-breve">Partida completa e Desafio do dia chegam em breve.</p>
  </section>`;
}

/** Cabeçalho da partida: rodada, saldo e etapa numa faixa só. */
function placar() {
  const n = partida.perguntas.length;
  const casas = Array.from({ length: n }, (_, i) => {
    const r = partida.roundResults[i];
    const cls = r ? (r.correct ? 'acerto' : 'erro') : i === partida.roundIndex && partida.phase !== 'fim' ? 'atual' : '';
    return `<li class="${cls}"></li>`;
  }).join('');
  const fim = partida.phase === 'fim';
  const resumo = partida.roundResults.map((r, i) => `rodada ${i + 1} ${r.correct ? 'certa' : 'errada'}`).join(', ');
  return `<div class="placar">
      <div class="rodadas"><span class="rodadas-rotulo" aria-hidden="true">${fim ? 'Fim' : `Rodada ${partida.roundIndex + 1}/${n}`}</span>
        <ol class="casas" aria-label="${fim ? 'Fim de jogo' : `Rodada ${partida.roundIndex + 1} de ${n}`}${resumo ? '. ' + resumo : ''}">${casas}</ol></div>
      ${etapas()}
      <div class="saldo" aria-label="Saldo: ${pts(partida.balance)}"><small aria-hidden="true">saldo</small><b>${partida.balance}</b></div>
    </div>`;
}

/** Etapa atual da rodada: a aposta vem antes da pergunta. */
function etapas() {
  const f = partida.phase;
  if (!['aposta', 'plinko', 'pergunta', 'resultado'].includes(f)) return '<span class="etapas-vazio"></span>';
  const atual = f === 'aposta' || f === 'plinko' || mostrarResultadoPlinko ? 0 : f === 'pergunta' ? 1 : 2;
  const nomes = ['Aposta', 'Pergunta', 'Resultado'];
  return `<ol class="etapas" aria-label="Etapa">${nomes.map((n, i) =>
    `<li class="${i < atual ? 'feita' : i === atual ? 'agora' : ''}"${i === atual ? ' aria-current="step"' : ''}>${n}</li>`).join('')}</ol>`;
}

function listaAlternativas(q, modo) {
  const res = partida.phase === 'resultado' ? partida.roundResults.at(-1) : null;
  const itens = q.alternatives.map(a => {
    if (modo === 'ver') return `<li><div class="alt"><span class="letra" aria-hidden="true">${a.id}</span><span><span class="sr-only">${a.id}: </span>${esc(a.text)}</span></div></li>`;
    if (modo === 'responder') return `<li><button class="alt" data-acao="responder" data-letra="${a.id}"><span class="letra" aria-hidden="true">${a.id}</span><span><span class="sr-only">Alternativa ${a.id}: </span>${esc(a.text)}</span></button></li>`;
    const certa = a.id === q.correctAnswer, minha = a.id === res.answer;
    const cls = certa ? 'certa' : minha ? 'errada' : '';
    const marca = certa ? (minha ? '✓ Sua resposta' : '✓ Certa') : minha ? '✗ Sua resposta' : '';
    return `<li><div class="alt ${cls}"><span class="letra" aria-hidden="true">${a.id}</span><span><span class="sr-only">${a.id}: </span>${esc(a.text)}</span>${marca ? `<span class="marca">${marca}</span>` : ''}</div></li>`;
  }).join('');
  return `<ol class="alternativas ${modo === 'ver' ? 'so-ver' : modo === 'responder' ? 'responder' : ''}" aria-label="Alternativas">${itens}</ol>`;
}

const ICONE_CADEADO = `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>`;

function telaAposta() {
  const q = POR_ID.get(M.perguntaAtual(partida));
  const plinkoOk = M.plinkoDisponivel(partida);
  if (!plinkoOk && rascunho.modo === 'plinko') rascunho.modo = 'seco';
  return `<h2 class="titulo-fase" tabindex="-1" data-foco>${ICONE_CADEADO} A pergunta vem depois.</h2>
    ${listaAlternativas(q, 'ver')}
    <section class="painel aposta" aria-labelledby="tituloAposta">
      <h3 id="tituloAposta">Quanto você aposta?</h3>
      <fieldset class="modos"><legend class="sr-only">Tipo de aposta</legend>
        <label class="modo"><input type="radio" name="modo" value="seco" ${rascunho.modo === 'seco' ? 'checked' : ''}><b>No seco</b><span>1×</span></label>
        <label class="modo"><input type="radio" name="modo" value="plinko" ${rascunho.modo === 'plinko' ? 'checked' : ''} ${plinkoOk ? '' : 'disabled aria-describedby="motivoPlinko"'}><b>Plinko</b><span>0,5× a 2×</span></label>
      </fieldset>
      ${plinkoOk ? '' : `<p class="motivo" id="motivoPlinko">Plinko libera com ${R.APOSTA_MINIMA * 2} pontos.</p>`}
      <div id="controleAposta"></div>
    </section>
    ${barra(`<button class="btn btn-principal" data-acao="confirmar" id="botaoConfirmar">Apostar</button>`)}`;
}

/** Fichas são o jeito principal de escolher; − e + ajustam de 5 em 5. Redesenha só o controle, sem perder o foco. */
function atualizarAposta() {
  const caixa = document.getElementById('controleAposta');
  if (!caixa) return;
  const l = limites(), v = valorAtual(), modo = rascunho.modo;
  const p = R.potencial(v, modo, null, MULTIPLICADORES.map(m => m.valor));
  const faixa = (a, b) => (a === b ? `${a}` : `${a} a ${b}`);
  const focado = document.activeElement?.dataset?.acao, focadoValor = document.activeElement?.dataset?.valor;
  caixa.innerHTML = `
    <div class="fichas" role="group" aria-label="Valor da aposta">${R.atalhos(partida.balance, modo).map(a =>
      `<button type="button" class="ficha ${a.max ? 'vmax' : 'v' + a.valor}" data-acao="ficha" data-valor="${a.valor}" aria-pressed="${a.valor === v}" aria-label="${a.max ? `Tudo, ${a.valor}` : a.valor} pontos"><span>${a.max ? 'MÁX' : a.valor}</span></button>`).join('')}</div>
    <div class="valor">
      <button class="passo" type="button" data-acao="menos" aria-label="Menos ${PASSO}" ${v <= l.min ? 'disabled' : ''}>−</button>
      <output id="valorAposta" aria-live="polite"><b>${v}</b> pontos</output>
      <button class="passo" type="button" data-acao="mais" aria-label="Mais ${PASSO}" ${v >= l.max ? 'disabled' : ''}>+</button>
    </div>
    ${modo === 'plinko' ? `<p class="chances" aria-label="Chances do Plinko: ${MULTIPLICADORES.map(m => `${rotuloMult(m.valor)} ${m.peso}%`).join(', ')}">${MULTIPLICADORES.map(m => `<span class="m${String(m.valor).replace('.', '')}">${rotuloMult(m.valor)} <b>${m.peso}%</b></span>`).join('')}</p>` : ''}
    <p class="potencial" aria-live="polite"><span class="ganha">Acertou <b>+${faixa(p.ganhoMin, p.ganhoMax)}</b></span><span class="perde">Errou <b>−${faixa(p.perdaMin, p.perdaMax)}</b></span></p>`;
  if (focado) caixa.querySelector(`[data-acao="${focado}"]${focadoValor ? `[data-valor="${focadoValor}"]` : ''}`)?.focus();
  document.getElementById('botaoConfirmar').textContent = modo === 'plinko' ? `Apostar ${v} no Plinko` : `Apostar ${pts(v)}`;
}

function telaPlinko() {
  const fim = partida.phase === 'pergunta';
  const v = R.pontosEmJogo(partida.betAmount, partida.multiplier);
  return `<h2 class="titulo-fase" tabindex="-1" data-foco>${fim ? `Deu ${rotuloMult(partida.multiplier)}!` : 'Lá vai a bolinha…'}</h2>
    <section class="painel plinko" aria-label="Plinko">
      ${svgTabuleiro(fim ? partida.plinko.casa : null)}
      ${fim ? `<p class="plinko-resultado" role="status">Sua aposta de ${partida.betAmount} agora vale <b>${v}</b></p>`
      : `<p class="plinko-nota">Já foi sorteado. A bolinha só mostra o resultado.</p>`}
    </section>
    ${barra(fim ? `<button class="btn btn-principal" data-acao="revelar">Ver pergunta</button>` : `<button class="btn" data-acao="pular">Pular animação</button>`)}`;
}

function rodarPlinko() {
  const svg = app.querySelector('.tabuleiro');
  const gameId = partida.gameId, rodada = partida.roundIndex;
  animacao = animarPlinko(svg, partida.plinko, { reduzir: reduzirMovimento() });
  animacao.terminou.then(() => {
    if (!partida || partida.gameId !== gameId || partida.roundIndex !== rodada || partida.phase !== 'plinko') return;
    if (aplicar(p => M.concluirPlinko(p))) { mostrarResultadoPlinko = true; render(); anunciar(`Deu ${rotuloMult(partida.multiplier)}.`); }
  });
}

function telaPergunta() {
  const q = POR_ID.get(M.perguntaAtual(partida));
  const v = R.pontosEmJogo(partida.betAmount, partida.multiplier);
  const plinko = partida.betMode === 'plinko' ? ` <span class="risco-mult">Plinko ${rotuloMult(partida.multiplier)}</span>` : '';
  return `<p class="risco">Valendo <b>${v}</b>${plinko}</p>
    <h2 class="enunciado" tabindex="-1" data-foco>${esc(q.question)}</h2>
    ${listaAlternativas(q, 'responder')}`;
}

function telaResultado() {
  const q = POR_ID.get(M.perguntaAtual(partida));
  const r = partida.roundResults.at(-1);
  const ultima = M.ultimaRodada(partida);
  const certa = q.alternatives.find(a => a.id === q.correctAnswer);
  const minha = q.alternatives.find(a => a.id === r.answer);
  const alt = (a, cls, marca) => `<div class="alt ${cls}"><span class="letra" aria-hidden="true">${a.id}</span><span><span class="sr-only">${a.id}: </span>${esc(a.text)}</span><span class="marca">${marca}</span></div>`;
  return `<div class="veredito ${r.correct ? 'acerto' : 'erro'}" role="status">
      <span class="icone" aria-hidden="true">${r.correct ? '✓' : '✗'}</span>
      <span class="veredito-texto"><span tabindex="-1" data-foco>${r.correct ? 'Acertou!' : 'Errou.'} <span class="delta">${sinal(r.delta)} ${Math.abs(r.delta) === 1 ? 'ponto' : 'pontos'}</span></span>
        <small class="conta" aria-label="Saldo de ${r.saldoAntes} para ${r.saldoDepois}">Saldo ${r.saldoAntes} → <b>${r.saldoDepois}</b></small></span></div>
    <section class="gabarito" aria-label="Resposta certa">
      <p class="gabarito-pergunta">${esc(q.question)}</p>
      ${alt(certa, 'certa', r.correct ? '✓ Sua resposta' : '✓ Certa')}
      ${r.correct ? '' : alt(minha, 'errada', '✗ Sua resposta')}
      <p class="gabarito-explica">${esc(q.explanation)}</p>
      <p class="fonte">${naoRevisadaDeTeste(q) ? '<span class="selo-teste">Pergunta de teste, sem revisão editorial</span> ' : ''}Fonte: ${q.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.titulo)}</a>`).join(' · ')}</p>
    </section>
    ${barra(`<button class="btn btn-principal" data-acao="avancar">${ultima ? 'Ver resultado' : 'Próxima rodada'}</button>`)}`;
}

function telaZerado() {
  const anuncioOk = anuncios.estado() === 'disponivel' && !partida.adRecoveryUsed;
  const faltam = partida.perguntas.length - partida.roundIndex - 1;
  return `<section class="painel zerado" aria-labelledby="tituloZerado">
    <h2 id="tituloZerado" tabindex="-1" data-foco>Zerou!</h2>
    <p>${faltam === 1 ? 'Falta 1 pergunta.' : `Faltam ${faltam} perguntas.`} Pegue ${R.RECUPERACAO_GRATUITA} pontos e continue.</p>
    <button class="btn btn-principal" data-acao="recuperar">Pegar ${R.RECUPERACAO_GRATUITA} pontos</button>
    ${anuncioOk ? '<button class="btn" data-acao="anuncio">Ver um anúncio e ganhar mais 20</button>' : ''}
    <button class="btn" data-acao="encerrar">Encerrar partida</button>
  </section>`;
}

/** Frase do fim: comemora ou consola, sem culpar quem jogou. */
function fraseFinal(r) {
  if (r.acertos === r.rodadasJogadas && r.rodadasJogadas === r.totalRodadas) return r.saldoFinal >= 200 ? 'Gabaritou com confiança!' : 'Gabaritou!';
  if (r.saldoFinal >= 200) return 'O saldo mais que dobrou!';
  if (r.saldoFinal > 100) return 'Saiu no lucro!';
  if (r.saldoFinal === 100) return 'Empatou com a banca.';
  if (r.saldoFinal === 0) return 'Zerou, mas aprendeu um monte.';
  return r.acertos >= r.rodadasJogadas / 2 ? 'Acertou bastante. O saldo fica para a próxima.' : 'Hoje não foi. Bora de novo?';
}

function telaFim() {
  const r = M.resumo(partida);
  const linha = partida.roundResults.map(x => `<span aria-hidden="true">${x.correct ? '✅' : '❌'}</span>`).join('');
  return `<section class="fim" aria-labelledby="tituloFim">
    <article class="carta">
      <div class="carta-topo"><span class="logo-mini">CONFIA?</span><span class="marca-hub">MATUTAR <span>GAMES</span></span></div>
      <div class="carta-corpo">
        <h2 class="frase-final" id="tituloFim" tabindex="-1" data-foco>${esc(fraseFinal(r))}</h2>
        <p class="saldo-final">${r.saldoFinal}<small>pontos</small></p>
        <p><b>${r.acertos} de ${r.rodadasJogadas}</b> acertos${r.encerradaAntes ? ` · parou na rodada ${r.rodadasJogadas}` : ''}</p>
        <p class="linha-rodadas" aria-label="${partida.roundResults.map((x, i) => `rodada ${i + 1} ${x.correct ? 'certa' : 'errada'}`).join(', ')}">${linha}</p>
        <dl class="estatisticas">
          <div><dt>Maior ganho</dt><dd>+${r.maiorGanho}</dd></div>
          <div><dt>Maior perda</dt><dd>−${r.maiorPerda}</dd></div>
          <div><dt>Plinko</dt><dd>${r.usosPlinko}×</dd></div>
          <div><dt>Recuperações</dt><dd>${r.recuperacoes}</dd></div>
        </dl>
      </div>
    </article>
    <div class="acoes-fim">
      <button class="btn btn-principal" data-acao="compartilhar">Compartilhar</button>
      <p class="status-copia" id="statusCopia" role="status"></p>
      <button class="btn" data-acao="nova">Jogar de novo</button>
      <button class="btn-link" data-acao="inicio">Voltar ao início</button>
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
  try { await navigator.clipboard.writeText(t); st.textContent = 'Copiado! Sem spoiler das respostas.'; }
  catch {
    st.textContent = 'Não deu para copiar. Selecione o texto abaixo.';
    if (!document.getElementById('textoCompartilhar')) st.insertAdjacentHTML('afterend', `<label class="sr-only" for="textoCompartilhar">Texto para compartilhar</label><textarea class="texto-compartilhar" id="textoCompartilhar" readonly>${esc(t)}</textarea>`);
    const ta = document.getElementById('textoCompartilhar'); ta.focus(); ta.select();
  }
}

iniciar();
