// Base de dados completa da Bíblia em português para funcionamento offline
export interface BibleBookData {
  abbrev: string
  name: string
  testament: 'old' | 'new'
  chapters: number
  author?: string
  group: string
}

export const BIBLE_BOOKS: BibleBookData[] = [
  // Antigo Testamento
  { abbrev: 'gn', name: 'Gênesis', testament: 'old', chapters: 50, author: 'Moisés', group: 'Lei' },
  { abbrev: 'ex', name: 'Êxodo', testament: 'old', chapters: 40, author: 'Moisés', group: 'Lei' },
  { abbrev: 'lv', name: 'Levítico', testament: 'old', chapters: 27, author: 'Moisés', group: 'Lei' },
  { abbrev: 'nm', name: 'Números', testament: 'old', chapters: 36, author: 'Moisés', group: 'Lei' },
  { abbrev: 'dt', name: 'Deuteronômio', testament: 'old', chapters: 34, author: 'Moisés', group: 'Lei' },
  { abbrev: 'js', name: 'Josué', testament: 'old', chapters: 24, author: 'Josué', group: 'História' },
  { abbrev: 'jz', name: 'Juízes', testament: 'old', chapters: 21, author: 'Samuel', group: 'História' },
  { abbrev: 'rt', name: 'Rute', testament: 'old', chapters: 4, author: 'Samuel', group: 'História' },
  { abbrev: '1sm', name: '1 Samuel', testament: 'old', chapters: 31, author: 'Samuel', group: 'História' },
  { abbrev: '2sm', name: '2 Samuel', testament: 'old', chapters: 24, author: 'Samuel', group: 'História' },
  { abbrev: '1rs', name: '1 Reis', testament: 'old', chapters: 22, author: 'Jeremias', group: 'História' },
  { abbrev: '2rs', name: '2 Reis', testament: 'old', chapters: 25, author: 'Jeremias', group: 'História' },
  { abbrev: '1cr', name: '1 Crônicas', testament: 'old', chapters: 29, author: 'Esdras', group: 'História' },
  { abbrev: '2cr', name: '2 Crônicas', testament: 'old', chapters: 36, author: 'Esdras', group: 'História' },
  { abbrev: 'ed', name: 'Esdras', testament: 'old', chapters: 10, author: 'Esdras', group: 'História' },
  { abbrev: 'ne', name: 'Neemias', testament: 'old', chapters: 13, author: 'Neemias', group: 'História' },
  { abbrev: 'et', name: 'Ester', testament: 'old', chapters: 10, author: 'Mardoqueu', group: 'História' },
  { abbrev: 'job', name: 'Jó', testament: 'old', chapters: 42, author: 'Desconhecido', group: 'Poesia' },
  { abbrev: 'sl', name: 'Salmos', testament: 'old', chapters: 150, author: 'Davi e outros', group: 'Poesia' },
  { abbrev: 'pv', name: 'Provérbios', testament: 'old', chapters: 31, author: 'Salomão', group: 'Poesia' },
  { abbrev: 'ec', name: 'Eclesiastes', testament: 'old', chapters: 12, author: 'Salomão', group: 'Poesia' },
  { abbrev: 'ct', name: 'Cânticos', testament: 'old', chapters: 8, author: 'Salomão', group: 'Poesia' },
  { abbrev: 'is', name: 'Isaías', testament: 'old', chapters: 66, author: 'Isaías', group: 'Profetas Maiores' },
  { abbrev: 'jr', name: 'Jeremias', testament: 'old', chapters: 52, author: 'Jeremias', group: 'Profetas Maiores' },
  { abbrev: 'lm', name: 'Lamentações', testament: 'old', chapters: 5, author: 'Jeremias', group: 'Profetas Maiores' },
  { abbrev: 'ez', name: 'Ezequiel', testament: 'old', chapters: 48, author: 'Ezequiel', group: 'Profetas Maiores' },
  { abbrev: 'dn', name: 'Daniel', testament: 'old', chapters: 12, author: 'Daniel', group: 'Profetas Maiores' },
  { abbrev: 'os', name: 'Oséias', testament: 'old', chapters: 14, author: 'Oséias', group: 'Profetas Menores' },
  { abbrev: 'jl', name: 'Joel', testament: 'old', chapters: 3, author: 'Joel', group: 'Profetas Menores' },
  { abbrev: 'am', name: 'Amós', testament: 'old', chapters: 9, author: 'Amós', group: 'Profetas Menores' },
  { abbrev: 'ob', name: 'Obadias', testament: 'old', chapters: 1, author: 'Obadias', group: 'Profetas Menores' },
  { abbrev: 'jn', name: 'Jonas', testament: 'old', chapters: 4, author: 'Jonas', group: 'Profetas Menores' },
  { abbrev: 'mq', name: 'Miqueias', testament: 'old', chapters: 7, author: 'Miqueias', group: 'Profetas Menores' },
  { abbrev: 'na', name: 'Naum', testament: 'old', chapters: 3, author: 'Naum', group: 'Profetas Menores' },
  { abbrev: 'hc', name: 'Habacuque', testament: 'old', chapters: 3, author: 'Habacuque', group: 'Profetas Menores' },
  { abbrev: 'sf', name: 'Sofonias', testament: 'old', chapters: 3, author: 'Sofonias', group: 'Profetas Menores' },
  { abbrev: 'ag', name: 'Ageu', testament: 'old', chapters: 2, author: 'Ageu', group: 'Profetas Menores' },
  { abbrev: 'zc', name: 'Zacarias', testament: 'old', chapters: 14, author: 'Zacarias', group: 'Profetas Menores' },
  { abbrev: 'ml', name: 'Malaquias', testament: 'old', chapters: 4, author: 'Malaquias', group: 'Profetas Menores' },

  // Novo Testamento
  { abbrev: 'mt', name: 'Mateus', testament: 'new', chapters: 28, author: 'Mateus', group: 'Evangelhos' },
  { abbrev: 'mc', name: 'Marcos', testament: 'new', chapters: 16, author: 'Marcos', group: 'Evangelhos' },
  { abbrev: 'lc', name: 'Lucas', testament: 'new', chapters: 24, author: 'Lucas', group: 'Evangelhos' },
  { abbrev: 'jo', name: 'João', testament: 'new', chapters: 21, author: 'João', group: 'Evangelhos' },
  { abbrev: 'at', name: 'Atos', testament: 'new', chapters: 28, author: 'Lucas', group: 'História' },
  { abbrev: 'rm', name: 'Romanos', testament: 'new', chapters: 16, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: '1co', name: '1 Coríntios', testament: 'new', chapters: 16, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: '2co', name: '2 Coríntios', testament: 'new', chapters: 13, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: 'gl', name: 'Gálatas', testament: 'new', chapters: 6, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: 'ef', name: 'Efésios', testament: 'new', chapters: 6, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: 'fp', name: 'Filipenses', testament: 'new', chapters: 4, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: 'cl', name: 'Colossenses', testament: 'new', chapters: 4, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: '1ts', name: '1 Tessalonicenses', testament: 'new', chapters: 5, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: '2ts', name: '2 Tessalonicenses', testament: 'new', chapters: 3, author: 'Paulo', group: 'Cartas Paulinas' },
  { abbrev: '1tm', name: '1 Timóteo', testament: 'new', chapters: 6, author: 'Paulo', group: 'Cartas Pastorais' },
  { abbrev: '2tm', name: '2 Timóteo', testament: 'new', chapters: 4, author: 'Paulo', group: 'Cartas Pastorais' },
  { abbrev: 'tt', name: 'Tito', testament: 'new', chapters: 3, author: 'Paulo', group: 'Cartas Pastorais' },
  { abbrev: 'fm', name: 'Filemom', testament: 'new', chapters: 1, author: 'Paulo', group: 'Cartas Pastorais' },
  { abbrev: 'hb', name: 'Hebreus', testament: 'new', chapters: 13, author: 'Desconhecido', group: 'Cartas Gerais' },
  { abbrev: 'tg', name: 'Tiago', testament: 'new', chapters: 5, author: 'Tiago', group: 'Cartas Gerais' },
  { abbrev: '1pe', name: '1 Pedro', testament: 'new', chapters: 5, author: 'Pedro', group: 'Cartas Gerais' },
  { abbrev: '2pe', name: '2 Pedro', testament: 'new', chapters: 3, author: 'Pedro', group: 'Cartas Gerais' },
  { abbrev: '1jo', name: '1 João', testament: 'new', chapters: 5, author: 'João', group: 'Cartas Gerais' },
  { abbrev: '2jo', name: '2 João', testament: 'new', chapters: 1, author: 'João', group: 'Cartas Gerais' },
  { abbrev: '3jo', name: '3 João', testament: 'new', chapters: 1, author: 'João', group: 'Cartas Gerais' },
  { abbrev: 'jd', name: 'Judas', testament: 'new', chapters: 1, author: 'Judas', group: 'Cartas Gerais' },
  { abbrev: 'ap', name: 'Apocalipse', testament: 'new', chapters: 22, author: 'João', group: 'Profecia' }
]

// Versículos inspiracionais em português (NVI)
export const INSPIRATIONAL_VERSES = [
  {
    reference: "João 3:16",
    text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
    book: "jo",
    chapter: 3,
    verse: 16
  },
  {
    reference: "Filipenses 4:13",
    text: "Posso todas as coisas naquele que me fortalece.",
    book: "fp",
    chapter: 4,
    verse: 13
  },
  {
    reference: "Romanos 8:28",
    text: "Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.",
    book: "rm",
    chapter: 8,
    verse: 28
  },
  {
    reference: "Jeremias 29:11",
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    book: "jr",
    chapter: 29,
    verse: 11
  },
  {
    reference: "Salmos 23:1",
    text: "O Senhor é o meu pastor; nada me faltará.",
    book: "sl",
    chapter: 23,
    verse: 1
  },
  {
    reference: "Isaías 40:31",
    text: "Mas os que esperam no Senhor renovam as suas forças, sobem com asas como águias, correm e não se cansam, caminham e não se fatigam.",
    book: "is",
    chapter: 40,
    verse: 31
  },
  {
    reference: "Mateus 11:28",
    text: "Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.",
    book: "mt",
    chapter: 11,
    verse: 28
  },
  {
    reference: "Provérbios 3:5-6",
    text: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.",
    book: "pv",
    chapter: 3,
    verse: 5
  },
  {
    reference: "2 Timóteo 1:7",
    text: "Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.",
    book: "2tm",
    chapter: 1,
    verse: 7
  },
  {
    reference: "1 Pedro 5:7",
    text: "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.",
    book: "1pe",
    chapter: 5,
    verse: 7
  }
]

// Função para obter um versículo aleatório
export function getRandomInspirationalVerse() {
  const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length)
  return INSPIRATIONAL_VERSES[randomIndex]
}

// Função para obter livros por testamento
export function getBooksByTestament(testament: 'old' | 'new') {
  return BIBLE_BOOKS.filter(book => book.testament === testament)
}

// Função para encontrar um livro por abreviação
export function findBookByAbbrev(abbrev: string) {
  return BIBLE_BOOKS.find(book => book.abbrev === abbrev)
}
