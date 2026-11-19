/**
 * Confia? · banco escrito pela IA para o MVP e revisado pela idealizadora em 18/11/2026.
 * status 'verified' = texto e fonte aprovados, entra em partida.
 * status 'needs_editorial_review' = fora de partida, e a auditoria diz o que falta (fonte fraca,
 * link quebrado ou troca de pergunta pendente).
 * status 'aposentada' = fora de partida para sempre, por decisão editorial. Fica no arquivo como registro.
 */
const alt = (...t) => t.map((text, i) => ({ id: 'ABCD'[i], text }));
const fonte = (titulo, url) => ({ titulo, url });
const base = { origem: 'demonstrativo', version: 2 };

export const PERGUNTAS_DEMONSTRATIVAS = [
  { ...base, id: 'his-001', alternatives: alt('Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'), correctAnswer: 'D',
    question: 'Qual cidade foi a primeira capital do Brasil colonial?',
    explanation: 'Salvador foi fundada em 1549 para ser a sede do governo-geral e foi capital até 1763, quando a sede passou para o Rio de Janeiro.',
    realCategory: 'História', apparentCategory: 'Geografia', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('IBGE: Salvador (BA), Divisão Territorial Brasileira', 'https://biblioteca.ibge.gov.br/visualizacao/dtb/bahia/salvador.pdf')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'mus-001', alternatives: alt('Vênus', 'Mercúrio', 'Marte', 'Júpiter'), correctAnswer: 'B',
    question: 'Qual planeta do Sistema Solar tem o mesmo nome do sobrenome artístico de Freddie Mercury, vocalista do Queen?',
    explanation: 'Farrokh Bulsara adotou o nome Freddie Mercury quando o grupo virou Queen. Mercury é Mercúrio em inglês, o planeta mais perto do Sol.',
    realCategory: 'Música', apparentCategory: 'Astronomia', editorialType: 'conexao-improvavel', difficulty: 'facil', status: 'verified',
    sources: [fonte('Britannica: Freddie Mercury', 'https://www.britannica.com/biography/Freddie-Mercury')],
    auditoria: 'Revisada pela idealizadora em 18/11/2026. Fonte trocada em 19/11/2026 pela Britannica, consultada na data. O enunciado dizia que o planeta deu nome ao sobrenome: a causalidade não se sustenta nas fontes, só a coincidência de nome, e foi corrigido.' },

  { ...base, id: 'esp-001', alternatives: alt('Seis', 'Oito', 'Dez', 'Doze'), correctAnswer: 'A',
    question: 'Quantos jogadores de cada equipe ficam em quadra durante uma partida de vôlei?',
    explanation: 'São seis por equipe em quadra, que vão trocando de posição em rodízio ao longo do jogo.',
    realCategory: 'Esportes', apparentCategory: 'Números', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('CBV: Regulamento do COBRAV 2021-2024', 'https://wp.cbv.com.br/wp-content/uploads/2023/07/regulamento_cobrav_2021-2024.pdf')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'tec-001', alternatives: alt('Maçã', 'Banana', 'Abacaxi', 'Laranja'), correctAnswer: 'A',
    question: 'Qual fruta dá nome à empresa fundada por Steve Jobs e Steve Wozniak em 1976?',
    explanation: 'Apple quer dizer maçã em inglês, e a maçã mordida virou o logotipo da marca.',
    realCategory: 'Tecnologia', apparentCategory: 'Frutas', editorialType: 'desvio', difficulty: 'facil', status: 'verified',
    sources: [fonte('Macworld: Why is Apple called Apple?', 'https://www.macworld.com/article/673923/why-is-apple-called-apple.html')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'mar-001', alternatives: alt('Tigre', 'Lobo', 'Leão', 'Urso'), correctAnswer: 'C',
    question: 'Que animal aparece no emblema da montadora francesa Peugeot?',
    explanation: 'O leão representa a Peugeot desde o século XIX, antes mesmo de a empresa fabricar carros.',
    realCategory: 'Marcas e design', apparentCategory: 'Animais', editorialType: 'desvio', difficulty: 'media', status: 'verified',
    sources: [fonte('Peugeot: The Peugeot lion, history of a symbol', 'https://www.peugeot.co.nz/brand/peugeot-magazine/the-peugeot-lion-history-of-a-symbol.html')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'esp-002', alternatives: alt('Pelé', 'Sócrates', 'Zico', 'Garrincha'), correctAnswer: 'B',
    question: 'Qual craque brasileiro, capitão da Seleção na Copa de 1982, era formado em medicina e ficou conhecido como “Doutor Sócrates”?',
    explanation: 'Sócrates, capitão da seleção na Copa de 1982, se formou em medicina e foi um dos líderes da Democracia Corinthiana.',
    realCategory: 'Esportes', apparentCategory: 'Esportes', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Trivela: os sacrifícios de Sócrates em busca do sonho na Copa de 82', 'https://trivela.com.br/brasil/os-sacrificios-aos-quais-socrates-se-submeteu-em-busca-do-sonho-na-copa-de-82/')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'pop-002', alternatives: alt('Pizza', 'Risoto', 'Nhoque', 'Lasanha'), correctAnswer: 'D',
    question: 'Qual prato é a obsessão mais famosa do gato Garfield, criado por Jim Davis?',
    explanation: 'Garfield é obcecado por lasanha. E odeia segundas-feiras.',
    realCategory: 'Quadrinhos', apparentCategory: 'Culinária', editorialType: 'desvio', difficulty: 'facil', status: 'verified',
    sources: [fonte('Wikipedia: Garfield (character)', 'https://en.wikipedia.org/wiki/Garfield_(character)')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'cie-001', alternatives: alt('Prata', 'Ouro', 'Cobre', 'Platina'), correctAnswer: 'B',
    question: 'Na tabela periódica, qual elemento químico é representado pelo símbolo Au?',
    explanation: 'Au vem do latim aurum, que quer dizer ouro.',
    realCategory: 'Ciência', apparentCategory: 'Esportes', editorialType: 'desvio', difficulty: 'facil', status: 'verified',
    sources: [fonte('CIAAW/IUPAC: Gold', 'https://ciaaw.org/gold.htm')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026. Fonte trocada em 19/11/2026 pela CIAAW, comissão da IUPAC, consultada na data: "The symbol Au derives from the Latin aurum".' },

  { ...base, id: 'cie-002', alternatives: alt('Pele', 'Coração', 'Fígado', 'Pulmão'), correctAnswer: 'A',
    question: 'Qual é o maior órgão do corpo humano em área e peso?',
    explanation: 'A pele cobre o corpo inteiro e é o maior órgão humano, tanto em área quanto em peso.',
    realCategory: 'Ciência', apparentCategory: 'Corpo humano', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('National Geographic Brasil: Estes são os três maiores órgãos do corpo', 'https://www.nationalgeographicbrasil.com/ciencia/2023/08/estes-sao-os-tres-maiores-orgaos-do-corpo')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'cie-003', alternatives: alt('Netuno', 'Urano', 'Saturno', 'Plutão'), correctAnswer: 'D',
    question: 'Qual corpo celeste foi reclassificado como planeta-anão pela União Astronômica Internacional em 2006?',
    explanation: 'Em 2006, a União Astronômica Internacional criou a categoria de planeta-anão, e Plutão foi reclassificado.',
    realCategory: 'Ciência', apparentCategory: 'Astronomia', editorialType: 'falsa-pegadinha', difficulty: 'facil', status: 'verified',
    sources: [fonte('União Astronômica Internacional: resultado da Assembleia Geral de 2006', 'https://www.iau.org/news/pressreleases/detail/iau0603')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026. Fonte trocada em 19/11/2026 pelo comunicado da própria IAU, consultado na data: "Pluto is a dwarf planet by the above definition".' },

  { ...base, id: 'cin-001', alternatives: alt('A pílula azul', 'A pílula vermelha', 'A pílula verde', 'A pílula amarela'), correctAnswer: 'B',
    question: 'Em Matrix (1999), qual pílula Neo escolhe tomar quando Morpheus lhe oferece duas opções?',
    explanation: 'Neo toma a vermelha, que mostra o mundo como ele é. A azul o devolveria à vida de antes, sem lembrança da conversa.',
    realCategory: 'Cinema', apparentCategory: 'Cores', editorialType: 'desvio', difficulty: 'facil', status: 'verified',
    sources: [fonte('Wikipedia: Red pill and blue pill', 'https://en.wikipedia.org/wiki/Red_pill_and_blue_pill')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'tec-002', alternatives: alt('Rubi', 'Esmeralda', 'Safira', 'Diamante'), correctAnswer: 'A',
    question: 'Que pedra preciosa dá nome à linguagem de programação criada pelo japonês Yukihiro Matsumoto?',
    explanation: 'A linguagem Ruby, lançada nos anos 1990, tem nome de pedra preciosa: rubi.',
    realCategory: 'Tecnologia', apparentCategory: 'Pedras preciosas', editorialType: 'conexao-improvavel', difficulty: 'media', status: 'verified',
    sources: [fonte('Ruby: FAQ oficial, de onde vem o nome', 'https://www.ruby-lang.org/en/documentation/faq/1/')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026. O link antigo apontava para simple.wikipedia.com, domínio que não existe. Trocado em 19/11/2026 pelo FAQ do site oficial da linguagem, consultado na data: "Matz wanted to use a jewel name for his new language, so he named Ruby after a colleague birthstone".' },

  { ...base, id: 'his-002', alternatives: alt('Janeiro', 'Abril', 'Outubro', 'Julho'), correctAnswer: 'C',
    question: 'Qual mês dá nome à revolução de 1917 que levou os bolcheviques ao poder na Rússia?',
    explanation: 'É a Revolução de Outubro. Pelo calendário juliano, usado na Rússia na época, ela começou em 25 de outubro (7 de novembro no nosso calendário).',
    realCategory: 'História', apparentCategory: 'Calendário', editorialType: 'conexao-improvavel', difficulty: 'media', status: 'verified',
    sources: [fonte('Britannica: October Revolution', 'https://www.britannica.com/topic/October-Revolution-Russian-history')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026. Fonte trocada em 19/11/2026 pela Britannica, consultada na data, que traz as duas datas: 24 e 25 de outubro pelo calendário antigo, 6 e 7 de novembro pelo novo.' },

  { ...base, id: 'ani-001', alternatives: alt('Água-viva', 'Polvo', 'Caranguejo', 'Estrela-do-mar'), correctAnswer: 'B',
    question: 'Qual destes animais marinhos possui três corações?',
    explanation: 'O polvo tem dois corações que bombeiam sangue para as brânquias e um terceiro que leva sangue para o resto do corpo.',
    realCategory: 'Animais e natureza', apparentCategory: 'Animais', editorialType: 'direta', difficulty: 'media', status: 'aposentada',
    sources: [fonte('Canaltech: Por que polvos têm três corações?', 'https://canaltech.com.br/meio-ambiente/por-que-polvos-tem-tres-coracoes/')],
    auditoria: 'Aposentada em 19/11/2026 a pedido da idealizadora: pergunta o mesmo que a R004, que já está em partida e tem fonte própria. Fica no arquivo como registro, fora de partida para sempre.' },

  { ...base, id: 'his-003', alternatives: alt('Cleópatra', 'Nefertiti', 'Ramsés II', 'Tutancâmon'), correctAnswer: 'D',
    question: 'Qual faraó egípcio teve sua tumba encontrada quase intacta por Howard Carter, no Vale dos Reis, em 1922?',
    explanation: 'Howard Carter encontrou a tumba do faraó Tutancâmon no Vale dos Reis em novembro de 1922.',
    realCategory: 'História', apparentCategory: 'Egito antigo', editorialType: 'falsa-pegadinha', difficulty: 'media', status: 'verified',
    sources: [fonte('World History Encyclopedia: El descubrimiento de la tumba de Tutankamón', 'https://www.worldhistory.org/trans/ES/2-2063/el-descubrimiento-de-la-tumba-de-tutankamon/')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'lin-001', alternatives: alt('Odin', 'Thor', 'Loki', 'Balder'), correctAnswer: 'B',
    question: 'Qual deus nórdico dá nome à palavra inglesa Thursday, o “dia de Thor”?',
    explanation: 'Thursday vem do inglês antigo e quer dizer "dia de Thor", o deus do trovão.',
    realCategory: 'Línguas e mitologia', apparentCategory: 'Super-heróis', editorialType: 'conexao-improvavel', difficulty: 'media', status: 'verified',
    sources: [fonte('Etymonline: Thursday', 'https://www.etymonline.com/it/word/Thursday')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'bra-001', alternatives: alt('Caju', 'Pequi', 'Açaí', 'Cupuaçu'), correctAnswer: 'B',
    question: 'Qual fruto típico do Cerrado, muito usado na culinária de Goiás, tem espinhos finos junto ao caroço?',
    explanation: 'O pequi tem uma camada de espinhos debaixo da polpa. Por isso a regra é roer, nunca morder.',
    realCategory: 'Curiosidades brasileiras', apparentCategory: 'Frutas', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Embrapa: Pequi, Caryocar brasiliense', 'https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/890521/1/Pequi.pdf')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'cin-002', alternatives: alt('Tubarão', 'Baleia', 'Golfinho', 'Orca'), correctAnswer: 'A',
    question: 'Qual animal dá nome ao filme de Steven Spielberg de 1975, considerado um dos primeiros grandes blockbusters de verão?',
    explanation: '"Tubarão" (Jaws) estreou em 1975 e mudou o jeito de Hollywood lançar filmes no verão.',
    realCategory: 'Cinema', apparentCategory: 'Animais marinhos', editorialType: 'desvio', difficulty: 'facil', status: 'verified',
    sources: [fonte('Rolling Stone Brasil: Tubarão completa 50 anos', 'https://rollingstone.com.br/cinema/tubarao-completa-50-anos-o-filme-que-mudou-o-cinema-e-criou-o-blockbuster-de-verao/')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'net-001', alternatives: alt('Akita', 'Shiba Inu', 'Husky siberiano', 'Border collie'), correctAnswer: 'B',
    question: 'Qual raça de cachorro é a Kabosu, a cadela que inspirou o meme Doge?',
    explanation: 'Kabosu era uma shiba inu japonesa, adotada em 2008. A foto dela com o olhar desconfiado virou o meme Doge e, depois, a moeda dogecoin.',
    realCategory: 'Internet e memes', apparentCategory: 'Animais', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('Boston Globe: Kabosu, Shiba Inu who helped define the Doge meme, dies at 18', 'https://www.bostonglobe.com/2024/05/24/business/kabosu-shiba-inu-who-helped-define-doge-meme-dies-18')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'cin-003', alternatives: alt('Caneta', 'Borracha', 'Régua', 'Lápis'), correctAnswer: 'D',
    question: 'No primeiro John Wick (2014), com qual objeto Viggo Tarasov diz que John Wick matou três homens em um bar?',
    explanation: 'Na lenda contada pelo mafioso Viggo Tarasov, foi com um lápis.',
    realCategory: 'Cinema', apparentCategory: 'Material escolar', editorialType: 'desvio', difficulty: 'media', status: 'verified',
    sources: [fonte('GamesRadar: Assassination John Wick style, movie characters killed by pencils', 'https://www.gamesradar.com/assassination-john-wick-style-8-movie-characters-killed-by-pencils')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'his-004', alternatives: alt('1822', '1888', '1889', '1500'), correctAnswer: 'B',
    question: 'Em que ano a Lei Áurea aboliu a escravidão no Brasil?',
    explanation: 'A Lei Áurea foi assinada pela princesa Isabel em 13 de maio de 1888.',
    realCategory: 'História', apparentCategory: 'Datas', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('Senado: arquivos da Lei Áurea', 'https://www12.senado.leg.br/institucional/arquivo/documentos-apenas/arquivos-lei-aurea')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'geo-001', alternatives: alt('Nilo', 'Mississippi', 'Yangtzé', 'Amazonas'), correctAnswer: 'D',
    question: 'Qual rio tem a maior vazão de água do mundo?',
    explanation: 'O Amazonas tem a maior vazão do mundo, muito à frente de qualquer outro rio.',
    realCategory: 'Geografia', apparentCategory: 'Geografia', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('National Geographic Brasil: 5 curiosidades sobre o maior rio do mundo', 'https://www.nationalgeographicbrasil.com/viagem/2023/05/as-5-curiosidades-sobre-o-maior-rio-do-mundo')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },

  { ...base, id: 'cin-004', alternatives: alt('Pantera', 'Leopardo', 'Onça', 'Guepardo'), correctAnswer: 'A',
    question: 'Qual animal dá nome ao herói T’Challa, interpretado por Chadwick Boseman nos filmes da Marvel?',
    explanation: 'T\'Challa é o Pantera Negra, rei de Wakanda. O filme solo do herói estreou em 2018.',
    realCategory: 'Cinema', apparentCategory: 'Animais', editorialType: 'desvio', difficulty: 'facil', status: 'verified',
    sources: [fonte('Disney Brasil: do que é feito o traje do Pantera Negra', 'https://www.disney.com.br/novidades/do-que-e-feito-o-traje-do-pantera-negra')],
    auditoria: 'Revisada e aprovada pela idealizadora em 18/11/2026.' },
];
