/**
 * Confia? · perguntas escritas pelo assistente e aprovadas pela idealizadora em 18/11/2026.
 * origem 'assistente': quem escreveu. status 'verified': revisado por ela, entra em partida.
 * Proposta nova entra aqui com status 'needs_editorial_review' e só joga depois da revisão dela.
 */
const alt = (...t) => t.map((text, i) => ({ id: 'ABCD'[i], text }));
const fonte = (titulo, url) => ({ titulo, url, consultadaEm: '2026-11-18' });
const base = { origem: 'assistente', version: 1 };

export const PERGUNTAS_PROPOSTAS = [
  { ...base, id: 'N001', titulo: 'A erva que formiga', alternatives: alt('Coentro', 'Jambu', 'Chicória', 'Alfavaca'), correctAnswer: 'B',
    question: 'Qual erva do tacacá deixa a boca formigando e levemente dormente?',
    explanation: 'O jambu tem espilantol, substância que provoca uma leve sensação de anestesia na boca. É ela que dá o tremelique característico do tacacá paraense.',
    realCategory: 'Gastronomia', apparentCategory: 'Botânica', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Pesquisa FAPESP: Planta eclética (jambu)', 'https://revistapesquisa.fapesp.br/planta-ecletica/')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N002', titulo: 'A maior medalhista', alternatives: alt('Rebeca Andrade', 'Robert Scheidt', 'Torben Grael', 'Marta'), correctAnswer: 'A',
    question: 'Quem é a maior medalhista olímpica da história do Brasil?',
    explanation: 'Rebeca Andrade chegou a seis medalhas olímpicas em Paris 2024, passando Robert Scheidt e Torben Grael, que têm cinco cada um.',
    realCategory: 'Esportes', apparentCategory: 'Esportes', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Agência Gov: Rebeca é a maior medalhista do Brasil em Jogos Olímpicos', 'https://agenciagov.ebc.com.br/noticias/202408/rebeca-andrade-e-a-maior-medalhista-do-brasil-em-jogos-olimpicos')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N003', titulo: 'A disputa dos bois', alternatives: alt('Manaus', 'Santarém', 'Parintins', 'Belém'), correctAnswer: 'C',
    question: 'Em qual cidade do Amazonas acontece o festival em que Garantido e Caprichoso se enfrentam na disputa?',
    explanation: 'O Festival Folclórico de Parintins acontece em junho, numa arena chamada Bumbódromo. Em 2024 virou manifestação da cultura nacional por lei.',
    realCategory: 'Cultura brasileira', apparentCategory: 'Geografia', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Senado: Lei reconhece Festival de Parintins como manifestação da cultura nacional', 'https://www12.senado.leg.br/noticias/materias/2024/09/05/lei-reconhece-festival-de-parintins-como-manifestacao-da-cultura-nacional')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N004', titulo: 'O urso brasileiro', alternatives: alt('Cidade de Deus', 'Central do Brasil', 'O Auto da Compadecida', 'Tropa de Elite'), correctAnswer: 'B',
    question: 'Qual filme brasileiro venceu o Urso de Ouro no Festival de Berlim de 1998?',
    explanation: 'Central do Brasil, de Walter Salles, conquistou o Urso de Ouro, e Fernanda Montenegro levou o Urso de Prata de melhor atriz. Tropa de Elite venceu o mesmo prêmio dez anos depois.',
    realCategory: 'Cinema', apparentCategory: 'Cinema', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Berlinale: Central do Brasil, programa de 1998', 'https://www.berlinale.de/en/1998/programme/19980191.html')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N005', titulo: 'O primeiro no espaço', alternatives: alt('Marcos Pontes', 'Bartolomeu Gusmão', 'Alberto Santos Dumont', 'Fernando Collor'), correctAnswer: 'A',
    question: 'Quem foi o primeiro brasileiro a ir ao espaço como astronauta?',
    explanation: 'Marcos Pontes passou oito dias na Estação Espacial Internacional em 2006, na Missão Centenário, cem anos depois do voo do 14-Bis.',
    realCategory: 'História recente', apparentCategory: 'Ciência', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('Agência FAPESP: Tem brasileiro no espaço', 'https://agencia.fapesp.br/tem-brasileiro-no-espaco/5281')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N006', titulo: 'A boca sem dente', alternatives: alt('Preguiça', 'Capivara', 'Tatu', 'Tamanduá-bandeira'), correctAnswer: 'D',
    question: 'Qual desses animais brasileiros não tem nenhum dente?',
    explanation: 'O tamanduá-bandeira não tem dentes: ele usa uma língua de até 60 centímetros, coberta de saliva grudenta, para comer formigas e cupins.',
    realCategory: 'Animais', apparentCategory: 'Animais', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('ICMBio: Programa de manejo do tamanduá-bandeira', 'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/programa-de-manejo-populacional/tamandua-bandeira/programa_de_manejo_tamandua_bandeira.pdf')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N007', titulo: 'A escultura que dobra', alternatives: alt('Tarsila do Amaral', 'Tomie Ohtake', 'Lygia Clark', 'Beatriz Milhazes'), correctAnswer: 'C',
    question: 'Quem criou os Bichos, esculturas de metal com dobradiças feitas para o público manipular?',
    explanation: 'Lygia Clark fez a série nos anos 1960. A obra só existe inteira quando alguém mexe nela, o que era o ponto do neoconcretismo.',
    realCategory: 'Artes visuais', apparentCategory: 'Artes visuais', editorialType: 'direta', difficulty: 'dificil', status: 'verified',
    sources: [fonte('MASP: Bicho, de Lygia Clark, no acervo', 'https://masp.org.br/acervo/obra/bicho')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N008', titulo: 'O último da Clarice', alternatives: alt('Perto do Coração Selvagem', 'A Paixão Segundo G.H.', 'Laços de Família', 'A Hora da Estrela'), correctAnswer: 'D',
    question: 'Qual foi o último livro que Clarice Lispector publicou em vida?',
    explanation: 'A Hora da Estrela saiu em 1977, poucos meses antes da morte dela. Conta a história de Macabéa, nordestina que vive no Rio.',
    realCategory: 'Literatura', apparentCategory: 'Literatura', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('IMS Clarice Lispector: 40 anos de A Hora da Estrela', 'https://site.claricelispector.ims.com.br/en/2017/02/15/40-anos-de-a-hora-da-estrela/')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },

  { ...base, id: 'N009', titulo: 'A brasileira de Portugal', alternatives: alt('Brasil', 'Portugal', 'Argentina', 'Estados Unidos'), correctAnswer: 'B',
    question: 'Em que país nasceu Carmen Miranda, que virou um símbolo do Brasil no exterior?',
    explanation: 'Carmen nasceu em Marco de Canaveses, Portugal, em 1909, e veio para o Rio com menos de um ano. A cidade natal tem um museu com o nome dela.',
    realCategory: 'Música', apparentCategory: 'Personalidades', editorialType: 'falsa-pegadinha', difficulty: 'media', status: 'verified',
    sources: [fonte('Câmara Municipal de Marco de Canaveses: Museu Carmen Miranda', 'https://www.cm-marco-canaveses.pt/download/795/pt2020/17891/museu-carmen-miranda.pdf')],
    auditoria: 'Escrita pelo assistente e revisada pela idealizadora em 18/11/2026, com a fonte consultada na mesma data.' },
];
