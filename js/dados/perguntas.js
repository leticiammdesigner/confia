/**
 * Confia? · banco demonstrativo complementar (23 perguntas), escrito para o MVP.
 * Escritas pela IA, fontes https consultadas em 07/11/2026. Status "needs_editorial_review": ainda não foram revisadas
 * pela idealizadora. Só entram na versão de teste (partida rápida e completa), nunca no desafio diário.
 * A Britney saiu daqui: a versão oficial é a Q013 do banco original.
 * A ordem das alternativas é a mesma antes e depois da revelação (A–D).
 */
const alt = (...t) => t.map((text, i) => ({ id: 'ABCD'[i], text }));
const fonte = (titulo, url) => ({ titulo, url, consultadaEm: '2026-11-07' });

export const PERGUNTAS_DEMONSTRATIVAS = [
  { id: 'his-001', alternatives: alt('Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'), correctAnswer: 'D',
    question: 'Qual foi a primeira capital do Brasil?',
    explanation: 'Salvador foi fundada em 1549 para ser a sede do governo-geral e foi capital até 1763, quando a sede passou para o Rio de Janeiro.',
    realCategory: 'História', apparentCategory: 'Geografia', editorialType: 'direta', difficulty: 'facil',
    sources: [fonte('Toda Matéria: Primeira capital do Brasil, Salvador', 'https://www.todamateria.com.br/primeira-capital-do-brasil-salvador/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'mus-001', alternatives: alt('Vênus', 'Mercúrio', 'Marte', 'Júpiter'), correctAnswer: 'B',
    question: 'Farrokh Bulsara, vocalista do Queen, adotou como sobrenome artístico o nome de um planeta. Qual?',
    explanation: 'Ele virou Freddie Mercury. Mercury é Mercúrio em inglês.',
    realCategory: 'Música', apparentCategory: 'Astronomia', editorialType: 'conexao-improvavel', difficulty: 'facil',
    sources: [fonte('eBiografia: Freddie Mercury', 'https://www.ebiografia.com/freddie_mercury/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'esp-001', alternatives: alt('Seis', 'Oito', 'Doze', 'Dez'), correctAnswer: 'A',
    question: 'Quantos jogadores de cada time ficam em quadra durante uma partida de vôlei?',
    explanation: 'São seis por equipe em quadra, que vão trocando de posição em rodízio ao longo do jogo.',
    realCategory: 'Esportes', apparentCategory: 'Números', editorialType: 'direta', difficulty: 'facil',
    sources: [fonte('Toda Matéria: Voleibol', 'https://www.todamateria.com.br/voleibol/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'tec-001', alternatives: alt('Maçã', 'Banana', 'Abacaxi', 'Laranja'), correctAnswer: 'A',
    question: 'Qual fruta dá nome à empresa fundada por Steve Jobs e Steve Wozniak em 1976?',
    explanation: 'Apple quer dizer maçã em inglês, e a maçã mordida virou o logotipo da marca.',
    realCategory: 'Tecnologia', apparentCategory: 'Frutas', editorialType: 'desvio', difficulty: 'facil',
    sources: [fonte('Macworld: Why is Apple called Apple?', 'https://www.macworld.com/article/673923/why-is-apple-called-apple.html')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'mar-001', alternatives: alt('Tigre', 'Lobo', 'Leão', 'Urso'), correctAnswer: 'C',
    question: 'Que animal aparece no emblema da montadora francesa Peugeot?',
    explanation: 'O leão representa a Peugeot desde o século XIX, antes mesmo de a empresa fabricar carros.',
    realCategory: 'Marcas e design', apparentCategory: 'Animais', editorialType: 'desvio', difficulty: 'media',
    sources: [fonte('Peugeot: The Peugeot lion, history of a symbol', 'https://www.peugeot.co.nz/brand/peugeot-magazine/the-peugeot-lion-history-of-a-symbol.html')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'esp-002', alternatives: alt('Pelé', 'Sócrates', 'Zico', 'Garrincha'), correctAnswer: 'B',
    question: 'Qual destes craques do futebol brasileiro era formado em medicina e ficou conhecido como "Doutor"?',
    explanation: 'Sócrates, capitão da seleção na Copa de 1982, se formou em medicina e foi um dos líderes da Democracia Corinthiana.',
    realCategory: 'Esportes', apparentCategory: 'Esportes', editorialType: 'direta', difficulty: 'media',
    sources: [fonte('eBiografia: Sócrates (jogador)', 'https://www.ebiografia.com/socrates_jogador/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'pop-002', alternatives: alt('Pizza', 'Risoto', 'Nhoque', 'Lasanha'), correctAnswer: 'D',
    question: 'Qual é a comida preferida do gato Garfield, dos quadrinhos de Jim Davis?',
    explanation: 'Garfield é obcecado por lasanha. E odeia segundas-feiras.',
    realCategory: 'Quadrinhos', apparentCategory: 'Culinária', editorialType: 'desvio', difficulty: 'facil',
    sources: [fonte('Wikipedia: Garfield (character)', 'https://en.wikipedia.org/wiki/Garfield_(character)')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'cie-001', alternatives: alt('Bronze', 'Ouro', 'Prata', 'Cobre'), correctAnswer: 'B',
    question: 'Qual elemento químico é representado pelo símbolo Au na tabela periódica?',
    explanation: 'Au vem do latim aurum, que quer dizer ouro.',
    realCategory: 'Ciência', apparentCategory: 'Esportes', editorialType: 'desvio', difficulty: 'facil',
    sources: [fonte('Toda Matéria: O elemento químico ouro (Au)', 'https://www.todamateria.com.br/ouro-elemento-quimico/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'cie-002', alternatives: alt('Pele', 'Coração', 'Fígado', 'Pulmão'), correctAnswer: 'A',
    question: 'Qual é o maior órgão do corpo humano?',
    explanation: 'A pele cobre o corpo inteiro e é o maior órgão humano, tanto em área quanto em peso.',
    realCategory: 'Ciência', apparentCategory: 'Corpo humano', editorialType: 'direta', difficulty: 'facil',
    sources: [fonte('National Geographic Brasil: Estes são os três maiores órgãos do corpo', 'https://www.nationalgeographicbrasil.com/ciencia/2023/08/estes-sao-os-tres-maiores-orgaos-do-corpo')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'cie-003', alternatives: alt('Netuno', 'Urano', 'Saturno', 'Plutão'), correctAnswer: 'D',
    question: 'Qual destes astros deixou de ser considerado planeta em 2006 e passou a ser chamado de planeta-anão?',
    explanation: 'Em 2006, a União Astronômica Internacional criou a categoria de planeta-anão, e Plutão foi reclassificado.',
    realCategory: 'Ciência', apparentCategory: 'Astronomia', editorialType: 'falsa-pegadinha', difficulty: 'facil',
    sources: [fonte('Canaltech: É verdade que Plutão é só um planeta-anão?', 'https://canaltech.com.br/curiosidades/e-verdade-que-plutao-e-so-um-planeta-anao-o-astro-foi-reclassificado-em-2006/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'cin-001', alternatives: alt('Azul', 'Vermelha', 'Verde', 'Amarela'), correctAnswer: 'B',
    question: 'Em Matrix (1999), Morpheus oferece duas pílulas a Neo. De que cor é a pílula que ele toma?',
    explanation: 'Neo toma a pílula vermelha, que revela a verdade. A azul o faria esquecer tudo e voltar à vida de antes.',
    realCategory: 'Cinema', apparentCategory: 'Cores', editorialType: 'desvio', difficulty: 'facil',
    sources: [fonte('Wikipedia: Red pill and blue pill', 'https://en.wikipedia.org/wiki/Red_pill_and_blue_pill')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'tec-002', alternatives: alt('Rubi', 'Esmeralda', 'Safira', 'Diamante'), correctAnswer: 'A',
    question: 'Que pedra preciosa dá nome à linguagem de programação criada pelo japonês Yukihiro Matsumoto?',
    explanation: 'A linguagem Ruby, lançada nos anos 1990, tem nome de pedra preciosa: rubi.',
    realCategory: 'Tecnologia', apparentCategory: 'Pedras preciosas', editorialType: 'conexao-improvavel', difficulty: 'media',
    sources: [fonte('Simple English Wikipedia: Ruby (programming language)', 'https://simple.wikipedia.com/wiki/Ruby_(programming_language)')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'his-002', alternatives: alt('Janeiro', 'Abril', 'Outubro', 'Julho'), correctAnswer: 'C',
    question: 'Que mês dá nome à revolução de 1917 que levou os bolcheviques ao poder na Rússia?',
    explanation: 'É a Revolução de Outubro. Pelo calendário juliano, usado na Rússia na época, ela começou em 25 de outubro (7 de novembro no nosso calendário).',
    realCategory: 'História', apparentCategory: 'Calendário', editorialType: 'conexao-improvavel', difficulty: 'media',
    sources: [fonte('História do Mundo: Revolução de Outubro (1917)', 'https://www.historiadomundo.com.br/idade-contemporanea/revolucao-de-outubro-1917.htm')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'ani-001', alternatives: alt('Água-viva', 'Polvo', 'Caranguejo', 'Estrela-do-mar'), correctAnswer: 'B',
    question: 'Qual destes animais marinhos tem três corações?',
    explanation: 'O polvo tem dois corações que bombeiam sangue para as brânquias e um terceiro que leva sangue para o resto do corpo.',
    realCategory: 'Animais e natureza', apparentCategory: 'Animais', editorialType: 'direta', difficulty: 'media',
    sources: [fonte('Canaltech: Por que polvos têm três corações?', 'https://canaltech.com.br/meio-ambiente/por-que-polvos-tem-tres-coracoes/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'his-003', alternatives: alt('Cleópatra', 'Nefertiti', 'Ramsés II', 'Tutancâmon'), correctAnswer: 'D',
    question: 'De quem era a tumba encontrada quase intacta pelo arqueólogo Howard Carter, no Egito, em 1922?',
    explanation: 'Howard Carter encontrou a tumba do faraó Tutancâmon no Vale dos Reis em novembro de 1922.',
    realCategory: 'História', apparentCategory: 'Egito antigo', editorialType: 'falsa-pegadinha', difficulty: 'media',
    sources: [fonte('World History Encyclopedia: El descubrimiento de la tumba de Tutankamón', 'https://www.worldhistory.org/trans/ES/2-2063/el-descubrimiento-de-la-tumba-de-tutankamon/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'lin-001', alternatives: alt('Hulk', 'Odin', 'Thor', 'Loki'), correctAnswer: 'C',
    question: 'Que deus nórdico dá nome à quinta-feira em inglês, "Thursday"?',
    explanation: 'Thursday vem do inglês antigo e quer dizer "dia de Thor", o deus do trovão.',
    realCategory: 'Línguas e mitologia', apparentCategory: 'Super-heróis', editorialType: 'conexao-improvavel', difficulty: 'media',
    sources: [fonte('Etymonline: Thursday', 'https://www.etymonline.com/it/word/Thursday')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'bra-001', alternatives: alt('Caju', 'Pequi', 'Açaí', 'Cupuaçu'), correctAnswer: 'B',
    question: 'Qual fruto do Cerrado é estrela da culinária goiana e esconde espinhos finos no caroço?',
    explanation: 'O pequi tem uma camada de espinhos debaixo da polpa. Por isso a regra é roer, nunca morder.',
    realCategory: 'Curiosidades brasileiras', apparentCategory: 'Frutas', editorialType: 'direta', difficulty: 'media',
    sources: [fonte('TudoGostoso: Você conhece o pequi?', 'https://www.tudogostoso.com.br/noticias/voce-conhece-o-pequi-aprenda-o-que-e-e-como-cozinhar-essa-fruta-tipica-do-cerrado-a6586.htm')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'cin-002', alternatives: alt('Tubarão', 'Baleia', 'Golfinho', 'Orca'), correctAnswer: 'A',
    question: 'Que animal dá nome ao filme de Steven Spielberg de 1975 considerado o primeiro grande blockbuster de verão?',
    explanation: '"Tubarão" (Jaws) estreou em 1975 e mudou o jeito de Hollywood lançar filmes no verão.',
    realCategory: 'Cinema', apparentCategory: 'Animais marinhos', editorialType: 'desvio', difficulty: 'facil',
    sources: [fonte('Rolling Stone Brasil: Tubarão completa 50 anos', 'https://rollingstone.com.br/cinema/tubarao-completa-50-anos-o-filme-que-mudou-o-cinema-e-criou-o-blockbuster-de-verao/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'net-001', alternatives: alt('Gato', 'Coruja', 'Cachorro', 'Sapo'), correctAnswer: 'C',
    question: 'Que animal é o Doge, estrela de um dos memes mais famosos da internet?',
    explanation: 'O Doge é a Kabosu, uma cadela shiba inu do Japão que virou o rosto do meme e da criptomoeda Dogecoin.',
    realCategory: 'Internet e memes', apparentCategory: 'Animais', editorialType: 'direta', difficulty: 'facil',
    sources: [fonte('Boston Globe: Kabosu, Shiba Inu who helped define the Doge meme, dies at 18', 'https://www.bostonglobe.com/2024/05/24/business/kabosu-shiba-inu-who-helped-define-doge-meme-dies-18')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'cin-003', alternatives: alt('Caneta', 'Borracha', 'Régua', 'Lápis'), correctAnswer: 'D',
    question: 'No primeiro John Wick (2014), contam que o protagonista matou três homens num bar usando qual objeto?',
    explanation: 'Na lenda contada pelo mafioso Viggo Tarasov, foi com um lápis.',
    realCategory: 'Cinema', apparentCategory: 'Material escolar', editorialType: 'desvio', difficulty: 'media',
    sources: [fonte('GamesRadar: Assassination John Wick style, movie characters killed by pencils', 'https://www.gamesradar.com/assassination-john-wick-style-8-movie-characters-killed-by-pencils')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'his-004', alternatives: alt('1822', '1889', '1888', '1500'), correctAnswer: 'C',
    question: 'Em que ano foi assinada a Lei Áurea, que aboliu a escravidão no Brasil?',
    explanation: 'A Lei Áurea foi assinada pela princesa Isabel em 13 de maio de 1888.',
    realCategory: 'História', apparentCategory: 'Datas', editorialType: 'direta', difficulty: 'facil',
    sources: [fonte('História do Mundo: Lei Áurea', 'https://www.historiadomundo.com.br/idade-moderna/lei-aurea.htm')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'geo-001', alternatives: alt('Nilo', 'Mississippi', 'Yangtzé', 'Amazonas'), correctAnswer: 'D',
    question: 'Qual rio despeja mais água no oceano do que qualquer outro do planeta?',
    explanation: 'O Amazonas tem a maior vazão do mundo, muito à frente de qualquer outro rio.',
    realCategory: 'Geografia', apparentCategory: 'Geografia', editorialType: 'direta', difficulty: 'facil',
    sources: [fonte('National Geographic Brasil: 5 curiosidades sobre o maior rio do mundo', 'https://www.nationalgeographicbrasil.com/viagem/2023/05/as-5-curiosidades-sobre-o-maior-rio-do-mundo')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },

  { id: 'cin-004', alternatives: alt('Pantera', 'Leopardo', 'Onça', 'Guepardo'), correctAnswer: 'A',
    question: 'Qual felino dá nome ao herói T\'Challa, vivido por Chadwick Boseman no cinema?',
    explanation: 'T\'Challa é o Pantera Negra, rei de Wakanda. O filme solo do herói estreou em 2018.',
    realCategory: 'Cinema', apparentCategory: 'Animais', editorialType: 'desvio', difficulty: 'facil',
    sources: [fonte('AdoroCinema: Pantera Negra', 'https://www.adorocinema.com/filmes/filme-130336/')], status: 'needs_editorial_review', origem: 'demonstrativo', revisaoEditorial: 'pendente', version: 1 },
];
