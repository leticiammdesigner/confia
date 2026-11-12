"""Testes de ponta a ponta do Confia? (Playwright, Chromium).
Uso:  python3 -m http.server 8780  (na raiz do repositório)
      python3 testes/e2e.py http://localhost:8780
Capturas de tela (opcional): defina CAPTURAS=/pasta/.
"""
import os, sys, re, json
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import compartilhar_comum as comp
BASE=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://localhost:8780'; R=[]
S=os.environ.get('CAPTURAS')
def ok(n,c,d=''): R.append((n,bool(c))); print('OK   ' if c else 'FALHA',n,d)
def estado(pg): return pg.evaluate("JSON.parse(localStorage.getItem('confia:partida:v1'))")
def vigiar(pg,err):
    pg.on('pageerror',lambda e: err.append(str(e))); pg.on('console',lambda m: err.append(m.text) if m.type=='error' else None)
    pg.on('response',lambda r: err.append(f'{r.status} {r.url}') if r.status>=400 else None)
def correta(pg,e):
    qid=e['perguntas'][e['roundIndex']]
    return pg.evaluate(f"import('./js/dados/banco.js').then(m=>m.BANCO.find(q=>q.id==='{qid}').correctAnswer)")

with sync_playwright() as p:
    b=p.chromium.launch()
    for rot,ctxargs in [('celular',dict(**p.devices['Pixel 7'])),('desktop',dict(viewport={'width':1280,'height':900}))]:
        ctx=b.new_context(permissions=['clipboard-read','clipboard-write'],**ctxargs); comp.instalar(ctx); pg=ctx.new_page(); err=[]; vigiar(pg,err)
        clica=(lambda s: pg.tap(s)) if rot=='celular' else (lambda s: pg.click(s))
        pg.goto(BASE+'/'); pg.wait_for_timeout(400)
        ok(f'[{rot}] home: marca, nome e chamada', 'Todos os jogos' in pg.inner_text('.mt-barra') and pg.get_attribute('.mt-voltar','href')=='https://matutar-games.netlify.app/' and 'CONFIA' in pg.inner_text('h1') and 'Você confia no que sabe?' in pg.inner_text('main'))
        fontes=pg.evaluate("Promise.all(['16px Bungee','16px \"Bowlby One\"','700 16px \"Atkinson Hyperlegible\"','16px \"Gochi Hand\"'].map(f=>document.fonts.load(f).then(r=>r.length>0)))")
        ok(f'[{rot}] fontes locais carregam', all(fontes), str(fontes))
        clica('[data-acao=nova]'); pg.wait_for_timeout(250)
        e=estado(pg)
        ok(f'[{rot}] partida rápida: 4 perguntas, 100 pontos', len(e['perguntas'])==4 and e['balance']==100 and e['phase']=='aposta')
        ok(f'[{rot}] pergunta escondida na fase de aposta', pg.locator('.enunciado').count()==0 and pg.locator('button.alt').count()==0 and pg.locator('.alternativas.so-ver .alt').count()==4)
        alts_antes=[t.split(':',1)[-1].strip() for t in pg.locator('.alt').all_inner_texts()]
        # rodada 1: Plinko, aposta máxima, acerta
        pg.check('input[value=plinko]',force=True); pg.wait_for_timeout(80)
        clica('[data-acao=ficha][aria-label^="Tudo"]'); pg.wait_for_timeout(50)
        ok(f'[{rot}] Plinko: máximo é metade do saldo', '50' in pg.inner_text('#valorAposta'))
        # toque duplo no confirmar
        pg.evaluate("(()=>{const b=document.getElementById('botaoConfirmar');b.click();b.click();})()"); pg.wait_for_timeout(100)
        e=estado(pg); ok(f'[{rot}] toque duplo registra uma aposta só', e['phase']=='plinko' and e['betAmount']==50)
        ok(f'[{rot}] Plinko não mostra o resultado antes da bolinha chegar', 'Deu' not in pg.inner_text('.titulo-fase') and pg.locator('.plinko-resultado').count()==0 and pg.locator('.casa.final').count()==0)
        mult=e['multiplier']
        # atualizar durante o Plinko
        pg.reload(); pg.wait_for_timeout(300)
        e2=estado(pg); ok(f'[{rot}] atualizar no Plinko mantém o multiplicador ({mult})', e2['multiplier']==mult and pg.locator('.tabuleiro').count()==1)
        clica('[data-acao=pular]'); pg.wait_for_timeout(300)
        ok(f'[{rot}] pular animação mostra o resultado do sorteio', pg.locator('.plinko-resultado').count()==1 and pg.inner_text('.titulo-fase')=='Deu '+str(mult).replace('.',',')+'×!' and str(int(50*mult+0.5)) in pg.inner_text('.plinko-resultado'))
        ok(f'[{rot}] casa final destacada bate com o multiplicador', pg.evaluate("document.querySelector('.casa.final text').textContent")==str(mult).replace('.',',')+'×')
        clica('[data-acao=revelar]'); pg.wait_for_timeout(500)
        ok(f'[{rot}] pergunta aparece com as mesmas alternativas na mesma ordem', pg.locator('.enunciado').count()==1 and [t.split(':',1)[-1].strip() for t in pg.locator('button.alt').all_inner_texts()]==alts_antes)
        letra=correta(pg,estado(pg))
        clica(f'button.alt[data-letra={letra}]'); pg.wait_for_timeout(200)
        e=estado(pg); r=e['roundResults'][0]; esperado=int(50*mult+0.5)
        ok(f'[{rot}] acerto no Plinko soma aposta × multiplicador (+{esperado})', r['correct'] and r['delta']==esperado and e['balance']==100+esperado)
        ok(f'[{rot}] resultado mostra certa, saldo antes e depois e fonte', pg.locator('.alt.certa').count()==1 and f"100 → {100+esperado}" in ' '.join(pg.inner_text('.conta').split()) and pg.locator('.gabarito .fonte a[href^="https"]').count()>=1)
        # atualizar depois de responder: não duplica
        pg.reload(); pg.wait_for_timeout(300)
        e=estado(pg); ok(f'[{rot}] atualizar no resultado não duplica', len(e['roundResults'])==1 and e['phase']=='resultado' and pg.locator('.veredito').count()==1)
        if rot=='celular' and S: pg.screenshot(path=S+'confia-'+'resultado.png',full_page=True)
        clica('[data-acao=avancar]'); pg.wait_for_timeout(200)
        # rodada 2: aposta tudo no seco e erra -> zera
        clica('[data-acao=ficha][aria-label^="Tudo"]'); clica('#botaoConfirmar'); pg.wait_for_timeout(500)
        e=estado(pg); certa=correta(pg,e); errada=[l for l in 'ABCD' if l!=certa][0]
        clica(f'button.alt[data-letra={errada}]'); pg.wait_for_timeout(200)
        e=estado(pg); ok(f'[{rot}] erro com tudo no seco zera o saldo, sem negativo', e['balance']==0 and e['roundResults'][1]['delta']<0)
        ok(f'[{rot}] erro mostra ✗ e texto, não só cor', '✗' in pg.inner_text('.veredito') and 'Errou' in pg.inner_text('.veredito') and pg.locator('.alt.errada .marca').count()==1)
        clica('[data-acao=avancar]'); pg.wait_for_timeout(200)
        ok(f'[{rot}] saldo zerado: tela de recuperação, sem anúncio', pg.locator('.zerado').count()==1 and pg.locator('[data-acao=anuncio]').count()==0)
        if rot=='celular' and S: pg.screenshot(path=S+'confia-'+'zerado.png',full_page=True)
        clica('[data-acao=recuperar]'); pg.wait_for_timeout(200)
        e=estado(pg); ok(f'[{rot}] recuperação gratuita: +10 e segue na rodada 3', e['balance']==10 and e['freeRecoveryCount']==1 and e['roundIndex']==2)
        ok(f'[{rot}] com 10 pontos o Plinko fica indisponível e explicado', pg.is_disabled('input[value=plinko]') and pg.locator('#motivoPlinko').count()==1)
        # teclado: rodada 3 inteira só com teclado
        pg.focus('[data-acao=ficha]'); pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
        pg.focus('#botaoConfirmar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(400)
        e=estado(pg); ok(f'[{rot}] aposta pelo teclado', e['phase']=='pergunta' and e['betAmount']==10)
        foco=pg.evaluate("document.activeElement.className")
        ok(f'[{rot}] foco vai para o enunciado ao revelar', 'enunciado' in foco, foco)
        certa=correta(pg,e); pg.focus(f'button.alt[data-letra={certa}]')
        outline=pg.evaluate("getComputedStyle(document.activeElement).outlineStyle")
        pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
        ok(f'[{rot}] resposta pelo teclado, foco visível nas alternativas', estado(pg)['balance']==20, outline)
        clica('[data-acao=avancar]'); pg.wait_for_timeout(200)
        # rodada 4: seco 10, acerta
        clica('[data-acao=ficha][data-valor="10"]'); clica('#botaoConfirmar'); pg.wait_for_timeout(400)
        e=estado(pg); clica(f'button.alt[data-letra={correta(pg,e)}]'); pg.wait_for_timeout(200)
        clica('[data-acao=avancar]'); pg.wait_for_timeout(300)
        e=estado(pg); fim=pg.inner_text('.fim')
        ok(f'[{rot}] fim: saldo e acertos separados', e['phase']=='fim' and '30' in pg.inner_text('.saldo-final') and '3 de 4' in fim, fim.replace('\n',' / ')[:200])
        ok(f'[{rot}] fim: estatísticas (Plinko 1×, 1 recuperação)', '1×' in fim and 'Recuperações' in fim)
        if rot=='celular' and S: pg.screenshot(path=S+'confia-'+'fim.png',full_page=True)
        clica('[data-acao=compartilhar]'); pg.wait_for_timeout(300)
        try: clip=pg.evaluate('navigator.clipboard.readText()')
        except Exception: clip=pg.input_value('#textoCompartilhar') if pg.locator('#textoCompartilhar').count() else ''
        txt=clip
        perguntas=[q for q in e['perguntas']]
        enunciados=pg.evaluate(f"import('./js/dados/banco.js').then(m=>m.BANCO.filter(q=>{json.dumps(perguntas)}.includes(q.id)).map(q=>[q.question.slice(0,25),...q.alternatives.map(a=>a.text)]))")
        vaza=[t for grupo in enunciados for t in grupo if len(t)>3 and t in txt]
        ok(f'[{rot}] compartilhar: saldo, acertos, sem perguntas nem respostas', txt.startswith('Confia? · ') and 'https://confia-matutar.netlify.app/' in txt and 'Saldo final: 30 pontos' in txt and 'Acertos: 3/4' in txt and not vaza, txt.replace('\n',' / ') + (' VAZA:'+str(vaza) if vaza else ''))
        ok(f'[{rot}] compartilhar: leva o endereço oficial do jogo', 'https://confia-matutar.netlify.app/' in txt and 'localhost' not in txt)
        if rot=='celular':
            for lw in (320,360,390):
                pg.set_viewport_size({'width':lw,'height':800}); pg.wait_for_timeout(150)
                comp.checar(pg, ok, f'[{lw}] compartilhar', '[data-acao=compartilhar]', '#statusCopia', '#textoCompartilhar', 'https://confia-matutar.netlify.app/', '.acoes-fim',
                    lambda t: (t.startswith('Confia? · ') and 'Saldo final: 30 pontos · Acertos: 3/4' in t and not any(x in t for x in ('🎰','🎯','R$','reais')) and not [q for g in enunciados for q in g if len(q)>3 and q in t], ''))
            pg.set_viewport_size(ctxargs.get('viewport',{'width':390,'height':844})); pg.wait_for_timeout(100)
        pg.reload(); pg.wait_for_timeout(300)
        hist=pg.evaluate("JSON.parse(localStorage.getItem('confia:historico:v1'))")
        ok(f'[{rot}] histórico: uma entrada por partida, mesmo após atualizar', len(hist)==1 and hist[0]['saldo']==30)
        ok(f'[{rot}] home mostra a última partida', 'Últimas partidas' in pg.inner_text('main'))
        ok(f'[{rot}] sem rolagem lateral', pg.evaluate('document.documentElement.scrollWidth<=innerWidth'))
        ok(f'[{rot}] sem erros de console nem de rede', not err, '; '.join(err[:4]))
        ctx.close()
    # layout mobile: ação principal à vista sem rolar, em 360 e 390 px
    for w,h in [(360,740),(390,844),(320,568)]:
        ctx=b.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.goto(BASE+'/'); pg.wait_for_timeout(300)
        visivel=lambda s: pg.evaluate(f"(()=>{{const el=document.querySelector('{s}'),r=el.getBoundingClientRect(),bar=document.querySelector('.barra-acao');const lim=bar&&!bar.contains(el)?bar.getBoundingClientRect().top:innerHeight;return r.top>=0&&r.bottom<=lim}})()")
        pg.tap('[data-acao=nova]'); pg.wait_for_timeout(200)
        ok(f'[{w}px] aposta: alternativas, fichas e botão na mesma tela', visivel('#botaoConfirmar') and (w<360 or (visivel('.alternativas') and visivel('.fichas'))), str(pg.evaluate('document.documentElement.scrollHeight')))
        pg.check('input[value=plinko]',force=True); pg.wait_for_timeout(80)
        ok(f'[{w}px] aposta no Plinko: chances e botão à vista', visivel('#botaoConfirmar') and (w<360 or visivel('.chances')))
        pg.tap('#botaoConfirmar'); pg.wait_for_timeout(100)
        ok(f'[{w}px] Plinko: tabuleiro inteiro e botão de pular à vista', visivel('.tabuleiro') and visivel('[data-acao=pular]'))
        pg.tap('[data-acao=pular]'); pg.wait_for_timeout(200)
        ok(f'[{w}px] Plinko: resultado e "Ver pergunta" à vista', visivel('.plinko-resultado') and visivel('[data-acao=revelar]'))
        pg.tap('[data-acao=revelar]'); pg.wait_for_timeout(450)
        ok(f'[{w}px] pergunta e as 4 alternativas à vista', visivel('.enunciado') and (visivel('button.alt[data-letra=D]') if w>=360 else visivel('button.alt[data-letra=A]')))
        ok(f'[{w}px] pergunta: sem barra de ação e sem faixa vazia reservada', pg.locator('.barra-acao').count()==0 and not pg.evaluate("document.body.classList.contains('com-barra')") and pg.evaluate("parseFloat(getComputedStyle(document.querySelector('main')).paddingBottom)")<=24)
        pg.tap('button.alt[data-letra=A]'); pg.wait_for_timeout(400)
        ok(f'[{w}px] resultado: ganho/perda, resposta certa e "Próxima rodada" à vista', visivel('.veredito') and visivel('.gabarito .alt.certa') and visivel('[data-acao=avancar]'))
        pg.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)'); pg.wait_for_timeout(100)
        cobre=pg.evaluate("(()=>{const bar=document.querySelector('.barra-acao').getBoundingClientRect();const ult=document.querySelector('.gabarito').getBoundingClientRect();return {bar:bar.top,ult:ult.bottom,fundo:bar.bottom,h:innerHeight}})()")
        ok(f'[{w}px] barra não cobre o fim do conteúdo e encosta no rodapé da tela', cobre['ult']<=cobre['bar']+0.5 and abs(cobre['fundo']-cobre['h'])<=1, str(cobre))
        ok(f'[{w}px] sem rolagem lateral', pg.evaluate('document.documentElement.scrollWidth<=innerWidth'))
        if w==360 and S: pg.screenshot(path=S+'confia-'+f'{w}-resultado.png')
        ctx.close()
    # redução de movimento
    ctx=b.new_context(reduced_motion='reduce'); pg=ctx.new_page(); pg.goto(BASE+'/'); pg.wait_for_timeout(300)
    pg.click('[data-acao=nova]'); pg.check('input[value=plinko]',force=True); pg.click('#botaoConfirmar'); pg.wait_for_timeout(150)
    ok('redução de movimento: Plinko termina na hora', pg.locator('.plinko-resultado').count()==1)
    ok('preferência marcada no Como jogar', pg.is_checked('#menosMovimento'))
    # começar outra com partida ativa pede confirmação
    pg.click('#inicioJogo'); pg.wait_for_timeout(300)
    ok('com partida em andamento, home oferece continuar', pg.locator('[data-acao=continuar]').count()==1)
    pg.click('[data-acao=nova] >> nth=0'); pg.wait_for_timeout(100)
    ok('nova partida pede confirmação antes de apagar a atual', pg.locator('.confirma-nova').count()==1)
    # como jogar
    pg.click('#abrirComoJogar'); pg.wait_for_timeout(100)
    ok('Como jogar abre e fecha', pg.locator('dialog[open]').count()==1); pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    ok('Como jogar fecha com Esc', pg.locator('dialog[open]').count()==0)
    # sem localStorage
    ctx2=b.new_context(); pg2=ctx2.new_page(); pg2.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('bloqueado')}})")
    err2=[]; pg2.on('pageerror',lambda e: err2.append(str(e))); pg2.goto(BASE+'/'); pg2.wait_for_timeout(300); pg2.click('[data-acao=nova]'); pg2.wait_for_timeout(200)
    ok('funciona sem localStorage (aba anônima/bloqueio)', pg2.locator('#botaoConfirmar').count()==1 and not err2, str(err2))
    b.close()
falhas=[r for r in R if not r[1]]; print(f'\n{len(R)-len(falhas)} de {len(R)} OK')
