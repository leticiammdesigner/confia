"""Medição: só o endereço oficial conta, e o funil sai de uma partida de verdade.

medir.js só age em matutargames.com.br, e o teste roda em localhost. Então o navegador é levado
a acreditar que está no endereço oficial: as requisições para https://matutargames.com.br são
atendidas com os arquivos do disco, e o script do GoatCounter vira um dublê que anota o que
teria sido enviado, sem rede nenhuma.

A partida é jogada até o fim de propósito. js/medicao.js é só uma ponte, e uma ponte que escute
um nome que o jogo não emite mais passaria num teste que disparasse o evento à mão. Jogando, a
cadeia inteira é exercitada: o jogo registra, eventos.js dispara, a ponte traduz, medir envia.

Uso:  python3 -m http.server 8797   (na raiz do repositório)
      python3 testes/medicao.py http://localhost:8797
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'http://localhost:8797'
CASA = 'https://matutargames.com.br'
res = []
def ok(n, c, x=''):
    res.append(bool(c)); print(('OK  ' if c else 'FALHA ') + n + (' · ' + str(x) if not c and x != '' else ''))

DUBLE = """
  window.__pedidos = [];
  window.goatcounter = { count: function (d) { window.__pedidos.push(d); } };
"""

def preparar(ctx, rede, fingir_casa=True):
    if fingir_casa:
        def servir(route, request):
            # em produção o jogo vive em /confia/; o servidor local serve a raiz do repositório,
            # então o prefixo sai aqui
            caminho = request.url[len(CASA):].split('?')[0] or '/'
            if caminho.startswith('/confia'): caminho = caminho[len('/confia'):] or '/'
            if caminho == '/': caminho = '/index.html'
            r = ctx.request.get(BASE + caminho)
            route.fulfill(status=r.status, body=r.body(),
                          headers={'content-type': r.headers.get('content-type', 'text/html')})
        ctx.route(CASA + '/**', servir)
    def contador(route, request):
        rede.append(request.url)
        route.fulfill(status=200, content_type='application/javascript', body=DUBLE)
    ctx.route('**/gc.zgo.at/**', contador)

def nomes(pg):
    return [d.get('path') for d in pg.evaluate("() => window.__pedidos || []")]

def estado(pg):
    return pg.evaluate("JSON.parse(localStorage.getItem('confia:partida:v1'))")

def correta(pg, e):
    qid = e['perguntas'][e['roundIndex']]
    return pg.evaluate("import('./js/dados/banco.js').then(m=>m.BANCO.find(q=>q.id==='%s').correctAnswer)" % qid)

def jogar_ate_o_fim(pg, rodadas=12):
    """Aposta o mínimo, pula o Plinko quando aparece e responde. Para quando a partida acaba."""
    for _ in range(rodadas):
        if pg.locator('[data-acao=compartilhar]').count(): return
        fichas = pg.locator('[data-acao=ficha]')
        if fichas.count(): fichas.first.click(); pg.wait_for_timeout(100)
        if pg.locator('#botaoConfirmar').count(): pg.click('#botaoConfirmar'); pg.wait_for_timeout(400)
        if pg.locator('[data-acao=pular]').count(): pg.click('[data-acao=pular]'); pg.wait_for_timeout(300)
        if pg.locator('[data-acao=revelar]').count(): pg.click('[data-acao=revelar]'); pg.wait_for_timeout(400)
        alt = pg.locator('button.alt')
        if alt.count():
            e = estado(pg)
            letra = correta(pg, e) if e else 'A'
            pg.click('button.alt[data-letra=%s]' % letra); pg.wait_for_timeout(300)
        if pg.locator('[data-acao=avancar]').count(): pg.click('[data-acao=avancar]'); pg.wait_for_timeout(300)

with sync_playwright() as p:
    b = p.chromium.launch()

    # ---------------- no endereço oficial: mede ----------------
    ctx = b.new_context(viewport={'width': 1200, 'height': 900})
    rede = []
    preparar(ctx, rede)
    pg = ctx.new_page()
    erros = []
    pg.on('pageerror', lambda e: erros.append(str(e)))
    pg.goto(CASA + '/confia/', wait_until='networkidle')
    pg.wait_for_timeout(700)

    ok('no endereço oficial o contador é carregado', any('count.js' in u for u in rede), rede)
    ok('medir existe para o jogo chamar', pg.evaluate("() => typeof window.medir") == 'function')
    ok('carregar o jogo não gera erro de script', not erros, erros[:2])

    pg.click('[data-acao=nova]')
    pg.wait_for_timeout(700)
    ok('começar a partida vira evento', 'confia-inicia' in nomes(pg), nomes(pg))

    jogar_ate_o_fim(pg)
    ok('a partida chega ao fim', pg.locator('[data-acao=compartilhar]').count() == 1)
    ok('terminar a partida vira evento', 'confia-termina' in nomes(pg), nomes(pg))

    enviado = pg.evaluate("() => (window.__pedidos || []).find(d => d.path === 'confia-termina')") or {}
    ok('o evento vai marcado como evento, não como página', enviado.get('event') is True, enviado)
    ok('cada partida conta, não uma por sessão', enviado.get('no_session') is True, enviado)
    # o objeto do evento interno carrega gameId, modo, rodada, acerto e saldo: nada disso sai daqui
    ok('o evento não leva nada além do nome',
       set(enviado.keys()) <= {'path', 'title', 'event', 'no_session'}, list(enviado.keys()))
    ok('nenhum evento carrega identificador de partida',
       all(set(d.keys()) <= {'path', 'title', 'event', 'no_session'}
           for d in pg.evaluate("() => window.__pedidos || []")))

    # ---------------- em prévia: não conta ----------------
    ctx2 = b.new_context(viewport={'width': 1200, 'height': 900})
    rede2 = []
    preparar(ctx2, rede2, fingir_casa=False)
    previa = ctx2.new_page()
    previa.goto(BASE + '/', wait_until='networkidle')
    previa.wait_for_timeout(600)
    previa.click('[data-acao=nova]')
    previa.wait_for_timeout(800)

    ok('fora do endereço oficial o contador nem é pedido', rede2 == [], rede2)
    ok('jogar em prévia não envia nada', not previa.evaluate("() => window.__pedidos"))
    ok('medir continua existindo, para nenhuma chamada quebrar',
       previa.evaluate("() => typeof window.medir") == 'function')

    b.close()

print('%d de %d OK' % (sum(res), len(res)))
sys.exit(0 if all(res) else 1)
