/**
 * Confia? · banco editorial original da idealizadora (Adendo ao PRD v1.1, revisão de 07/11/2026).
 * Texto, gabarito, fontes e status conforme o adendo. Não reescrever sem revisão editorial.
 * O anexo recebido termina no meio da Q021; Q022 a Q027 ainda não foram recebidas.
 */
const alt = (...t) => t.map((text, i) => ({ id: 'ABCD'[i], text }));
const fonte = (titulo, url) => ({ titulo, url });
const base = { origem: 'idealizadora', version: 1 };

export const PERGUNTAS_ORIGINAIS = [
  { ...base, id: 'Q001', titulo: 'Turismo capilar', alternatives: alt('Turquia', 'Irã', 'Grécia', 'Polônia'), correctAnswer: 'A',
    question: 'Segundo uma estimativa referente a 2018, mais de 400 mil estrangeiros viajaram para qual país em busca de transplantes capilares?',
    explanation: 'A Turquia tornou-se um destino importante para o turismo capilar, especialmente em Istambul. Uma reportagem de 2019 citou estimativa de pouco mais de 400 mil visitantes estrangeiros para transplantes capilares em 2018.',
    realCategory: 'Curiosidades e saúde', apparentCategory: 'Geografia', editorialType: 'conexao-improvavel', difficulty: 'media', status: 'verified',
    sources: [fonte('EL PAÍS Brasil, 2019', 'https://brasil.elpais.com/brasil/2019/07/31/economia/1564581220_032997.html')],
    auditoria: 'O número não deve ser apresentado como estatística anual atual. É uma estimativa histórica atribuída a uma entidade setorial.' },

  { ...base, id: 'Q002', titulo: 'Os gatos do Egito Antigo', alternatives: alt('Pena de morte', 'Amputação de uma mão', 'Mumificação como punição ritual', 'Um ano de detenção'), correctAnswer: 'A',
    question: 'Segundo o historiador grego Heródoto, qual era a punição para quem matasse intencionalmente um animal considerado sagrado no Egito Antigo?',
    explanation: 'Heródoto relatou que matar deliberadamente um animal sagrado poderia ser punido com a morte. Quando a morte era acidental, a penalidade era diferente. Os gatos estavam entre os animais especialmente valorizados na sociedade egípcia.',
    realCategory: 'História', apparentCategory: 'Punições e leis', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Heródoto, Histórias, Livro II, seção 65', 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Herodotus/2A%2A.html')],
    auditoria: 'Não apresentar o relato de Heródoto como uma regra universal e imutável de todos os períodos do Egito Antigo.' },

  { ...base, id: 'Q003', titulo: 'A cidade de Dilma', alternatives: alt('Sabará', 'Belo Horizonte', 'Formiga', 'Luz'), correctAnswer: 'B',
    question: 'Em qual cidade nasceu a ex-presidenta brasileira Dilma Rousseff?',
    explanation: 'Dilma Rousseff nasceu em Belo Horizonte, Minas Gerais, em 14 de dezembro de 1947.',
    realCategory: 'História e política brasileira', apparentCategory: 'Geografia mineira', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('Biblioteca da Presidência da República', 'https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes/dilma-rousseff/biografia')] },

  { ...base, id: 'Q004', titulo: 'A personagem da Turma da Mônica', alternatives: alt('Milena', 'Rosinha', 'Dorinha', 'Sara'), correctAnswer: 'C',
    question: 'Qual é o nome da personagem cega da Turma da Mônica, criada em homenagem a Dorina Nowill?',
    explanation: 'Dorinha foi criada por Mauricio de Sousa para ampliar a representação de pessoas com deficiência visual nas histórias da Turma da Mônica.',
    realCategory: 'Quadrinhos e cultura brasileira', apparentCategory: 'Personagens', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('MSP Estúdios: Dorinha', 'https://turmadamonica.uol.com.br/donasdarua/personagem.php?id=dorinha')] },

  { ...base, id: 'Q005', titulo: 'O presidente que não assumiu', alternatives: alt('Washington Luís', 'Artur Bernardes', 'Júlio Prestes', 'Delfim Moreira'), correctAnswer: 'C',
    question: 'Qual político foi eleito presidente do Brasil em 1930, mas acabou impedido de tomar posse devido ao movimento revolucionário daquele ano?',
    explanation: 'Júlio Prestes venceu a eleição presidencial de 1930, mas a Revolução de 1930 impediu sua posse. Getúlio Vargas assumiria o governo após a ruptura política.',
    realCategory: 'História do Brasil', apparentCategory: 'Presidentes brasileiros', editorialType: 'direta', difficulty: 'dificil', status: 'verified',
    sources: [fonte('Arquivo Nacional: Júlio Prestes', 'https://presidentes.an.gov.br/index.php/centro-de-referencia-de-acervos-presidenciais/assuntos/biografias/217-julio-prestes-de-albuquerque')] },

  { ...base, id: 'Q006', titulo: 'Planetas com anéis', alternatives: alt('Saturno, Júpiter, Urano e Netuno', 'Saturno, Mercúrio, Vênus e Netuno', 'Saturno, Vênus, Urano e Júpiter', 'Saturno, Júpiter, Vênus e Urano'), correctAnswer: 'A',
    question: 'Qual destes conjuntos reúne todos os planetas do Sistema Solar que possuem sistemas de anéis conhecidos?',
    explanation: 'Saturno tem os anéis mais conhecidos, mas Júpiter, Urano e Netuno também possuem sistemas de anéis, embora menos visíveis.',
    realCategory: 'Astronomia', apparentCategory: 'Sistema Solar', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('NASA: Saturn FAQ', 'https://science.nasa.gov/mission/cassini/faq/')] },

  { ...base, id: 'Q007', titulo: 'O nome científico da banana', alternatives: alt('Ananas', 'Musa', 'Carica', 'Persea'), correctAnswer: 'B',
    question: 'A maioria das bananas cultivadas pertence a espécies e híbridos associados a qual gênero botânico?',
    explanation: 'Musa é o gênero botânico que inclui diversas espécies relacionadas às bananas cultivadas. Entre elas estão Musa acuminata e Musa balbisiana, importantes na origem de diferentes variedades.',
    realCategory: 'Botânica e ciência', apparentCategory: 'Nomenclatura científica', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Royal Botanic Gardens, Kew: Musa', 'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A327926-2')] },

  { ...base, id: 'Q008', titulo: 'O verdadeiro nome de Cazuza', alternatives: alt('Ubiratan', 'Ubirajara', 'Argelino', 'Agenor'), correctAnswer: 'D',
    question: 'Qual era o primeiro nome de batismo do cantor e compositor Cazuza?',
    explanation: 'O nome completo de Cazuza era Agenor de Miranda Araújo Neto. Seu apelido tornou-se um dos nomes mais conhecidos do rock brasileiro.',
    realCategory: 'Música brasileira', apparentCategory: 'Nomes próprios', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Dicionário Cravo Albin da Música Popular Brasileira', 'https://dicionariompb.com.br/artista/cazuza/')] },

  { ...base, id: 'Q009', titulo: 'Uma canetada da Ludmilla', alternatives: alt('Espelho', '700 por Hora', 'Modo Avião', 'Fala Mal de Mim'), correctAnswer: 'B',
    question: 'Qual música de Ludmilla, lançada no projeto Hello Mundo, fala sobre independência, desejo e uma relação intensa, com uma provocação envolvendo velocidade no título?',
    explanation: '"700 por Hora" integra o repertório de Ludmilla e foi registrada em 2019. A faixa traz uma mistura de atitude, sensualidade e afirmação de independência.',
    realCategory: 'Música pop brasileira', apparentCategory: 'Títulos de músicas', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Vagalume: 700 por Hora', 'https://www.vagalume.com.br/ludmilla/700-por-hora.html')] },

  { ...base, id: 'Q010', titulo: "Racionais MC's e a lágrima", alternatives: alt('Nego Drama', 'Vida Loka (Parte II)', 'Jesus Chorou', 'Vida Loka (Parte I)'), correctAnswer: 'C',
    question: "Qual música dos Racionais MC's começa com uma adivinha poética cuja resposta é uma lágrima?",
    explanation: '"Jesus Chorou", do álbum Nada como um Dia Após o Outro Dia, de 2002, utiliza a imagem de uma lágrima para abrir uma reflexão sobre sofrimento, sentimentos e experiências humanas.',
    realCategory: 'Rap brasileiro', apparentCategory: "Discografia dos Racionais MC's", editorialType: 'conexao-improvavel', difficulty: 'media', status: 'verified',
    sources: [fonte('Cultura Genial: Jesus Chorou', 'https://www.culturagenial.com/musica-jesus-chorou-do-racionais-mc-s/')] },

  { ...base, id: 'Q011', titulo: 'O casal de Mulheres Apaixonadas', alternatives: alt('Edwiges e Salete', 'Clara e Rafaela', 'Dóris e Gracinha', 'Marcinha e Raquel'), correctAnswer: 'B',
    question: 'Na novela Mulheres Apaixonadas, exibida em 2003, qual era o nome do casal de adolescentes lésbicas?',
    explanation: 'Clara, interpretada por Paula Picarelli, e Rafaela, interpretada por Alinne Moraes, viveram um relacionamento marcado por conflitos familiares e preconceito.',
    realCategory: 'Novelas brasileiras', apparentCategory: 'Casais de televisão', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Folha de S.Paulo, abril de 2003', 'https://www1.folha.uol.com.br/folha/ilustrada/ult90u32346.shtml')] },

  { ...base, id: 'Q012', titulo: 'Allison Mack e NXIVM', alternatives: alt('The O.C.', 'Smallville', '24 Horas', 'Gossip Girl'), correctAnswer: 'B',
    question: 'A atriz Allison Mack foi condenada a três anos de prisão, em 2021, por sua participação na organização NXIVM, liderada por Keith Raniere. Por qual série ela ficou mais conhecida?',
    explanation: 'Allison Mack interpretou Chloe Sullivan em Smallville. Em 2021, recebeu uma sentença de três anos de prisão por crimes relacionados ao seu envolvimento com a organização NXIVM.',
    realCategory: 'Séries e acontecimentos reais', apparentCategory: 'Séries adolescentes', editorialType: 'conexao-improvavel', difficulty: 'media', status: 'verified',
    sources: [fonte('ABC News, junho de 2021', 'https://abcnews.com/US/allison-mack-sentenced-years-prison-role-nxivm/story?id=78579948')] },

  { ...base, id: 'Q013', titulo: 'A cobra da Britney', alternatives: alt('Coral', 'Jiboia', 'Píton', 'Naja'), correctAnswer: 'C',
    question: 'Em 2001, Britney Spears fez uma apresentação inesquecível no MTV Video Music Awards. Nossa amada apareceu com uma enorme cobra nos ombros enquanto cantava "I\'m a Slave 4 U". Que tipo de cobra era aquela?',
    explanation: 'A estrela daquela apresentação era uma píton-birmanesa albina. A cena se tornou um dos momentos mais marcantes da história do VMA.',
    realCategory: 'Cultura pop internacional', apparentCategory: 'Serpentes e natureza', editorialType: 'desvio', difficulty: 'media', status: 'verified',
    sources: [fonte('TIME, 2016', 'https://time.com/4468261/britney-spears-snake-mtv-vma/')],
    observacao: 'Principal pergunta de referência do jogo. Preservar o tom afetivo e bem-humorado do enunciado.' },

  { ...base, id: 'Q014', titulo: 'A voz do Não Inviabilize', alternatives: alt('Camila Fremder', 'Déia Freitas', 'Leila Germano', 'Cris Bartis'), correctAnswer: 'B',
    question: 'Qual é o nome da criadora e apresentadora do podcast Não Inviabilize?',
    explanation: 'Déia Freitas criou o Não Inviabilize em 2020, transformando histórias enviadas por ouvintes em episódios narrados com humor, suspense e emoção.',
    realCategory: 'Podcasts brasileiros', apparentCategory: 'Comunicadoras', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Não Inviabilize: Sobre', 'https://naoinviabilize.com.br/sobre/')] },

  { ...base, id: 'Q015', titulo: 'O romance de Frida Kahlo', alternatives: alt('Josef Stalin', 'Vladimir Lenin', 'Leon Trótski', 'Karl Marx'), correctAnswer: 'C',
    question: 'Qual revolucionário comunista russo teve um breve relacionamento amoroso com a pintora Frida Kahlo durante seu exílio no México?',
    explanation: 'Frida Kahlo e Leon Trótski tiveram um breve relacionamento em 1937. A artista chegou a dedicar a ele um autorretrato, hoje parte importante dos estudos sobre sua vida.',
    realCategory: 'Arte e história', apparentCategory: 'Revolucionários comunistas', editorialType: 'conexao-improvavel', difficulty: 'media', status: 'verified',
    sources: [fonte('National Museum of Women in the Arts', 'https://nmwa.org/whats-on/exhibitions/online/between-the-curtains-frida-kahlos-self-portrait/')] },

  { ...base, id: 'Q016', titulo: 'A nacionalidade de Portinari', alternatives: alt('Italiana', 'Brasileira', 'Espanhola', 'Portuguesa'), correctAnswer: 'B',
    question: 'Qual era a nacionalidade do pintor Candido Portinari, conhecido por obras como Guerra e Paz?',
    explanation: 'Candido Portinari nasceu em Brodowski, no interior de São Paulo, em 1903. Embora fosse filho de imigrantes italianos, era brasileiro.',
    realCategory: 'Artes visuais', apparentCategory: 'Nacionalidades', editorialType: 'direta', difficulty: 'facil', status: 'verified',
    sources: [fonte('Museu Casa de Portinari', 'https://www.museucasadeportinari.org.br/candido-portinari/vida/')] },

  { ...base, id: 'Q017', titulo: 'O Radar de Gloria Groove', alternatives: alt('Baby, Você Não Viu', 'Radar', 'Apaga a Luz', 'Suplicar'), correctAnswer: 'B',
    question: 'Qual música de Gloria Groove, lançada em 2020 no EP Affair, fala sobre o fim de uma relação e traz no título uma metáfora sobre alguém que já não fazia parte do seu campo de atenção?',
    explanation: '"Radar" encerra o EP Affair, de Gloria Groove, lançado em 2020. A música representa uma etapa de superação dentro da narrativa amorosa do projeto.',
    realCategory: 'Música pop brasileira', apparentCategory: 'Discografia de Gloria Groove', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('ONErpm: Gloria Groove lança Radar', 'https://onerpm.com/pt/gloria-groove-revela-o-ep-affair-completo-com-lancamento-de-radar/')],
    auditoria: 'Revisar os distratores A e C futuramente para garantir uma dificuldade mais equilibrada.' },

  { ...base, id: 'Q018', titulo: 'O filme que não é de 1999', alternatives: alt('O Show de Truman', 'O Sexto Sentido', 'Matrix', 'De Olhos Bem Fechados'), correctAnswer: 'A',
    question: 'Qual destes filmes NÃO foi lançado originalmente em 1999?',
    explanation: 'O Show de Truman estreou em 1998. Já os outros três filmes foram lançados em 1999, um ano particularmente marcante para o cinema.',
    realCategory: 'Cinema', apparentCategory: 'Filmes dos anos 1990', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Paramount: The Truman Show', 'https://www.paramount.com/movies/the-truman-show')] },

  { ...base, id: 'Q019', titulo: 'Das quadras para os palcos', alternatives: alt('Ana Carolina', 'Simone', 'Maria Bethânia', 'Cássia Eller'), correctAnswer: 'B',
    question: 'Antes de se tornar uma das grandes vozes da MPB, qual destas cantoras teve uma trajetória no basquete e chegou a receber convocações para a seleção brasileira?',
    explanation: 'Antes da carreira musical, Simone estudou Educação Física e jogou basquete. Sua trajetória nas quadras foi lembrada em entrevistas e documentários sobre a participação feminina no esporte.',
    realCategory: 'Música e esporte', apparentCategory: 'Cantoras brasileiras', editorialType: 'conexao-improvavel', difficulty: 'dificil', status: 'verified',
    sources: [fonte('Band: Simone esportista', 'https://www.band.com.br/entretenimento/simone-esportista-jogou-basquete-fez-faculdade-com-pele-e-dirigiu-para-ayrton-16505166')] },

  { ...base, id: 'Q020', titulo: 'O fim de Sandy & Junior', alternatives: alt('2005', '2006', '2007', '2008'), correctAnswer: 'C',
    question: 'Em que ano Sandy e Junior anunciaram o fim da dupla, após 17 anos de carreira?',
    explanation: 'Sandy e Junior anunciaram a separação em abril de 2007 e encerraram aquele ciclo com o projeto Acústico MTV e uma turnê de despedida. Os dois voltariam a se reunir temporariamente em 2019.',
    realCategory: 'Música brasileira', apparentCategory: 'Datas', editorialType: 'direta', difficulty: 'media', status: 'verified',
    sources: [fonte('Folha de S.Paulo, abril de 2007', 'https://www1.folha.uol.com.br/folha/ilustrada/ult90u70346.shtml')] },

  // O anexo terminou no meio da explicação desta pergunta: fica fora das partidas até chegar o texto completo.
  { ...base, id: 'Q021', titulo: 'Para quem foi escrita Malandragem?', alternatives: alt('Cássia Eller', 'Angela Ro Ro', 'Bebel Gilberto', 'Zélia Duncan'), correctAnswer: 'B',
    question: 'A música "Malandragem", composta por Cazuza e Frejat e eternizada na voz de Cássia Eller, foi originalmente escrita pensando em qual cantora?',
    explanation: 'Cazuza e Frejat compuseram [texto incompleto no anexo recebido]',
    realCategory: 'Música brasileira', apparentCategory: 'Cantoras brasileiras', editorialType: 'direta', difficulty: 'media', status: 'needs_editorial_review',
    sources: [], pendencia: 'Anexo cortado: falta o fim da explicação, tipo, dificuldade e fonte.' },
];
