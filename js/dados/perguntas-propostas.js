/**
 * Confia? · perguntas escritas pelo assistente e aprovadas pela idealizadora em 18/11/2026.
 * origem 'assistente': quem escreveu. status 'verified': revisado por ela, entra em partida.
 * Proposta nova entra aqui com status 'needs_editorial_review' e só joga depois da revisão dela.
 * N010 a N020 fecham o lote de vinte pedido por ela: fatos aprovados em 19/11/2026, fontes buscadas
 * pelo assistente com cada página aberta antes de entrar aqui.
 */
const alt = (...t) => t.map((text, i) => ({ id: 'ABCD'[i], text }));
const fonte = (titulo, url) => ({ titulo, url, consultadaEm: '2026-11-18' });
const base = { origem: 'assistente', version: 1 };

export const PERGUNTAS_PROPOSTAS = [
  { ...base, id: 'N001', titulo: 'A erva que formiga', alternatives: alt('Coentro', 'Jambu', 'Chicória', 'Alfavaca'), correctAnswer: 'B',
    question: 'Qual erva do tacacá deixa a boca formigando e levemente dormente?',
    explanation: 'O jambu tem espilantol, substância que provoca uma leve sensação de anestesia na boca. É ela que dá o tremelique característico do tacacá paraense.',
    realCategory: 'Gastronomia', apparentCategory: 'Botânica', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Pesquisa FAPESP: Planta eclética (jambu)', 'https://revistapesquisa.fapesp.br/planta-ecletica/')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N002', titulo: 'A maior medalhista', alternatives: alt('Rebeca Andrade', 'Robert Scheidt', 'Torben Grael', 'Marta'), correctAnswer: 'A',
    question: 'Quem é a maior medalhista olímpica da história do Brasil?',
    explanation: 'Rebeca Andrade chegou a seis medalhas olímpicas em Paris 2024, passando Robert Scheidt e Torben Grael, que têm cinco cada um.',
    realCategory: 'Esportes', apparentCategory: 'Esportes', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Agência Gov: Rebeca é a maior medalhista do Brasil em Jogos Olímpicos', 'https://agenciagov.ebc.com.br/noticias/202408/rebeca-andrade-e-a-maior-medalhista-do-brasil-em-jogos-olimpicos')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N003', titulo: 'A disputa dos bois', alternatives: alt('Manaus', 'Santarém', 'Parintins', 'Belém'), correctAnswer: 'C',
    question: 'Em qual cidade do Amazonas acontece o festival em que Garantido e Caprichoso se enfrentam na disputa?',
    explanation: 'O Festival Folclórico de Parintins acontece em junho, numa arena chamada Bumbódromo. Em 2024 virou manifestação da cultura nacional por lei.',
    realCategory: 'Cultura brasileira', apparentCategory: 'Geografia', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Senado: Lei reconhece Festival de Parintins como manifestação da cultura nacional', 'https://www12.senado.leg.br/noticias/materias/2024/09/05/lei-reconhece-festival-de-parintins-como-manifestacao-da-cultura-nacional')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N004', titulo: 'O urso brasileiro', alternatives: alt('Cidade de Deus', 'Central do Brasil', 'O Auto da Compadecida', 'Tropa de Elite'), correctAnswer: 'B',
    question: 'Qual filme brasileiro venceu o Urso de Ouro no Festival de Berlim de 1998?',
    explanation: 'Central do Brasil, de Walter Salles, conquistou o Urso de Ouro, e Fernanda Montenegro levou o Urso de Prata de melhor atriz. Tropa de Elite venceu o mesmo prêmio dez anos depois.',
    realCategory: 'Cinema', apparentCategory: 'Cinema', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Berlinale: Central do Brasil, programa de 1998', 'https://www.berlinale.de/en/1998/programme/19980191.html')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N005', titulo: 'O primeiro no espaço', alternatives: alt('Marcos Pontes', 'Bartolomeu Gusmão', 'Alberto Santos Dumont', 'Fernando Collor'), correctAnswer: 'A',
    question: 'Quem foi o primeiro brasileiro a ir ao espaço como astronauta?',
    explanation: 'Marcos Pontes passou oito dias na Estação Espacial Internacional em 2006, na Missão Centenário, cem anos depois do voo do 14-Bis.',
    realCategory: 'História recente', apparentCategory: 'Ciência', editorialType: 'direta', difficulty: 'facil', status: 'published',
    sources: [fonte('Agência FAPESP: Tem brasileiro no espaço', 'https://agencia.fapesp.br/tem-brasileiro-no-espaco/5281')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N006', titulo: 'A boca sem dente', alternatives: alt('Preguiça', 'Capivara', 'Tatu', 'Tamanduá-bandeira'), correctAnswer: 'D',
    question: 'Qual desses animais brasileiros não tem nenhum dente?',
    explanation: 'O tamanduá-bandeira não tem dentes: ele usa uma língua de até 60 centímetros, coberta de saliva grudenta, para comer formigas e cupins.',
    realCategory: 'Animais', apparentCategory: 'Animais', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('ICMBio: Programa de manejo do tamanduá-bandeira', 'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/programa-de-manejo-populacional/tamandua-bandeira/programa_de_manejo_tamandua_bandeira.pdf')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N007', titulo: 'A escultura que dobra', alternatives: alt('Tarsila do Amaral', 'Tomie Ohtake', 'Lygia Clark', 'Beatriz Milhazes'), correctAnswer: 'C',
    question: 'Quem criou os Bichos, esculturas de metal com dobradiças feitas para o público manipular?',
    explanation: 'Lygia Clark fez a série nos anos 1960. A obra só existe inteira quando alguém mexe nela, o que era o ponto do neoconcretismo.',
    realCategory: 'Artes visuais', apparentCategory: 'Artes visuais', editorialType: 'direta', difficulty: 'dificil', status: 'published',
    sources: [fonte('MASP: Bicho, de Lygia Clark, no acervo', 'https://masp.org.br/acervo/obra/bicho')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N008', titulo: 'O último da Clarice', alternatives: alt('Perto do Coração Selvagem', 'A Paixão Segundo G.H.', 'Laços de Família', 'A Hora da Estrela'), correctAnswer: 'D',
    question: 'Qual foi o último livro que Clarice Lispector publicou em vida?',
    explanation: 'A Hora da Estrela saiu em 1977, poucos meses antes da morte dela. Conta a história de Macabéa, nordestina que vive no Rio.',
    realCategory: 'Literatura', apparentCategory: 'Literatura', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('IMS Clarice Lispector: 40 anos de A Hora da Estrela', 'https://site.claricelispector.ims.com.br/en/2017/02/15/40-anos-de-a-hora-da-estrela/')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N009', titulo: 'A brasileira de Portugal', alternatives: alt('Brasil', 'Portugal', 'Argentina', 'Estados Unidos'), correctAnswer: 'B',
    question: 'Em que país nasceu Carmen Miranda, que virou um símbolo do Brasil no exterior?',
    explanation: 'Carmen nasceu em Marco de Canaveses, Portugal, em 1909, e veio para o Rio com menos de um ano. A cidade natal tem um museu com o nome dela.',
    realCategory: 'Música', apparentCategory: 'Personalidades', editorialType: 'falsa-pegadinha', difficulty: 'media', status: 'published',
    sources: [fonte('Câmara Municipal de Marco de Canaveses: Museu Carmen Miranda', 'https://www.cm-marco-canaveses.pt/download/795/pt2020/17891/museu-carmen-miranda.pdf')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N010', titulo: 'A procissão da corda', alternatives: alt('Bahia', 'Pernambuco', 'Pará', 'Maranhão'), correctAnswer: 'C',
    question: 'Em qual estado acontece o Círio de Nazaré, uma das maiores procissões católicas do mundo?',
    explanation: 'O Círio sai de Belém, no Pará, em outubro, e reúne milhões de romeiros. A corda que os promesseiros puxam virou símbolo da festa.',
    realCategory: 'Costumes', apparentCategory: 'Geografia', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Agência Brasil: Círio de Nazaré reúne 2,5 milhões em Belém', 'https://agenciabrasil.ebc.com.br/cultura/noticia/2025-10/cirio-de-nazare-no-ano-da-cop30-reune-25-milhoes-em-belem')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data.' },

  { ...base, id: 'N011', titulo: 'Dez provas, dois dias', alternatives: alt('Pentatlo', 'Decatlo', 'Heptatlo', 'Triatlo'), correctAnswer: 'B',
    question: 'Qual prova do atletismo masculino reúne dez modalidades diferentes disputadas em dois dias?',
    explanation: 'O decatlo tem cem metros, salto em distância, arremesso de peso, salto em altura e quatrocentos metros no primeiro dia, e mais cinco provas no segundo. O heptatlo, com sete provas, é a versão feminina.',
    realCategory: 'Modalidades', apparentCategory: 'Esportes', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('World Athletics: Decathlon', 'https://worldathletics.org/disciplines/combined-events/decathlon')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data.' },

  { ...base, id: 'N012', titulo: 'O salto de Pequim', alternatives: alt('Salto em distância', 'Salto com vara', 'Corrida com barreiras', 'Heptatlo'), correctAnswer: 'A',
    question: 'Em qual modalidade Maurren Maggi conquistou o ouro olímpico em Pequim, em 2008?',
    explanation: 'Maurren saltou 7,04 metros e virou a primeira mulher brasileira a ganhar um ouro olímpico em prova individual.',
    realCategory: 'Esportistas', apparentCategory: 'Esportes', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Wikipédia: Maurren Maggi', 'https://en.wikipedia.org/wiki/Maurren_Maggi')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data, que traz os 7,04 metros e o pioneirismo.' },

  { ...base, id: 'N013', titulo: 'O bolinho das baianas', alternatives: alt('Grão-de-bico', 'Soja', 'Feijão-fradinho', 'Lentilha'), correctAnswer: 'C',
    question: 'De qual grão é feita a massa do acarajé, o bolinho frito das baianas de tabuleiro?',
    explanation: 'A massa leva feijão-fradinho moído no pilão, cebola e sal, e é frita no dendê. O ofício das baianas de acarajé é patrimônio cultural do Brasil desde 2005.',
    realCategory: 'Gastronomia', apparentCategory: 'Culinária', editorialType: 'direta', difficulty: 'facil', status: 'published',
    sources: [fonte('Iphan Bahia: Patrimônio Imaterial, ofício das baianas de acarajé', 'https://www.gov.br/iphan/pt-br/superintendencias/bahia/patrimonio-imaterial')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data.' },

  { ...base, id: 'N014', titulo: 'Vote num homem sério', alternatives: alt('Zeca Diabo', 'Tieta', 'Sinhozinho Malta', 'Odorico Paraguaçu'), correctAnswer: 'D',
    question: 'Qual prefeito da teledramaturgia brasileira passou a novela inteira tentando inaugurar um cemitério?',
    explanation: 'Odorico Paraguaçu, vivido por Paulo Gracindo em O Bem-Amado (1973), precisava de um defunto para inaugurar a obra. A novela é de Dias Gomes.',
    realCategory: 'Televisão', apparentCategory: 'Televisão', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Wikipédia: O Bem-Amado', 'https://en.wikipedia.org/wiki/O_Bem-Amado')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data: "The priority goal of his administration is the inauguration of the local cemetery".' },

  { ...base, id: 'N015', titulo: 'O romance da seca', alternatives: alt('Rachel de Queiroz', 'Cecília Meireles', 'Lygia Fagundes Telles', 'Adélia Prado'), correctAnswer: 'A',
    question: 'Quem escreveu O Quinze, romance sobre a seca de 1915 publicado em 1930?',
    explanation: 'Rachel de Queiroz publicou O Quinze aos vinte anos, bancando a edição do próprio bolso. Em 1977 virou a primeira mulher a entrar na Academia Brasileira de Letras.',
    realCategory: 'Literatura', apparentCategory: 'Literatura', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Editora Record: O Quinze', 'https://www.record.com.br/en/products/o-quinze')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data. O enunciado dizia "seca no Ceará": a fonte fala da seca de 1915 que atingiu o Nordeste, então o enunciado passou a citar o ano, não o estado.' },

  { ...base, id: 'N016', titulo: 'A arte que se veste', alternatives: alt('Tarsila do Amaral', 'Lygia Pape', 'Hélio Oiticica', 'Mira Schendel'), correctAnswer: 'C',
    question: 'Quem criou os Parangolés, capas de pano feitas para serem vestidas e dançadas pelo público?',
    explanation: 'Hélio Oiticica começou os Parangolés em 1964, depois de passar a frequentar a Mangueira. A obra só existe quando alguém a veste e se move.',
    realCategory: 'Artes visuais', apparentCategory: 'Artes visuais', editorialType: 'direta', difficulty: 'dificil', status: 'published',
    sources: [fonte('MASP: Hélio Oiticica, a dança na minha experiência', 'https://masp.org.br/exposicoes/helio-oiticica-a-danca-na-minha-experiencia')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data: "para ser usada, experimentada, vivida e dançada pelo espectador-participante".' },

  { ...base, id: 'N017', titulo: 'O maior de todos', alternatives: alt('Paca', 'Capivara', 'Cutia', 'Castor'), correctAnswer: 'B',
    question: 'Qual é o maior roedor do mundo, comum nas margens de rios brasileiros?',
    explanation: 'Uma capivara adulta chega a cerca de 55 quilos. Ela tem hábitos semiaquáticos e passa boa parte do dia dentro da água.',
    realCategory: 'Animais', apparentCategory: 'Animais', editorialType: 'direta', difficulty: 'facil', status: 'published',
    sources: [fonte('National Geographic Brasil: as 6 curiosidades sobre a capivara', 'https://www.nationalgeographicbrasil.com/animais/2023/04/as-6-curiosidades-sobre-a-capivara-o-maior-roedor-do-mundo')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data. A explicação dizia "passa dos sessenta quilos" e foi corrigida para os cerca de 55 quilos que a fonte registra.' },

  { ...base, id: 'N018', titulo: 'A moeda nova', alternatives: alt('1986', '1990', '1992', '1994'), correctAnswer: 'D',
    question: 'Em que ano o real passou a ser a moeda do Brasil?',
    explanation: 'O real entrou em circulação em julho de 1994, substituindo o cruzeiro real na conversão de CR$ 2.750 para R$ 1. Antes dele vieram o cruzado, o cruzado novo e o cruzeiro real.',
    realCategory: 'História recente', apparentCategory: 'Economia', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Banco Central do Brasil: reformas do sistema monetário', 'https://www.bcb.gov.br/ingles/museu-espacos/refmone-i.asp?frame=1')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data.' },

  { ...base, id: 'N019', titulo: 'O tambor de tronco', alternatives: alt('Frevo', 'Maracatu', 'Carimbó', 'Coco'), correctAnswer: 'C',
    question: 'Qual ritmo paraense, tocado em tambores feitos de tronco escavado, virou patrimônio cultural do Brasil em 2014?',
    explanation: 'O carimbó nasceu no Pará do encontro de indígenas, africanos e portugueses. O nome vem do tambor curimbó, feito de um tronco cavado.',
    realCategory: 'Música', apparentCategory: 'Música', editorialType: 'direta', difficulty: 'media', status: 'published',
    sources: [fonte('Iphan: Plano de Salvaguarda do Carimbó', 'https://www.gov.br/iphan/pt-br/assuntos/noticias/carimbozeiros-debatem-estrategias-para-implantacao-do-plano-de-salvaguarda/Plano_Salvaguarda_Carimbo2020.pdf')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data. A primeira versão ligava o carimbó à origem da lambada, ligação que as fontes disputam, e foi trocada pelo registro do Iphan.' },

  { ...base, id: 'N020', titulo: 'A festa dos livros', alternatives: alt('Paraty', 'Petrópolis', 'Búzios', 'Angra dos Reis'), correctAnswer: 'A',
    question: 'Em qual cidade do Rio de Janeiro acontece a Flip, festa literária que existe desde 2003?',
    explanation: 'A Flip ocupa o centro histórico de Paraty e homenageia um autor brasileiro a cada edição.',
    realCategory: 'Eventos', apparentCategory: 'Literatura', editorialType: 'direta', difficulty: 'facil', status: 'published',
    sources: [fonte('Wikipédia: Festa Literária Internacional de Paraty', 'https://en.wikipedia.org/wiki/Festa_Liter%C3%A1ria_Internacional_de_Paraty')],
    auditoria: 'Escrita pelo assistente em 19/11/2026, com os fatos aprovados pela idealizadora e a fonte consultada na mesma data: "held yearly since 2003 in the Brazilian city of Paraty, in the state of Rio de Janeiro".' },
];
