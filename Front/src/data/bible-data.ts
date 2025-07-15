// Interface para versículos
export interface BibleVerse {
  number: number
  text: string
}

export const sampleVerses = {
  // Gênesis 1
  "gn": {
    "1": {
      "verses": [
        { "number": 1, "text": "No princípio criou Deus os céus e a terra." },
        { "number": 2, "text": "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas." },
        { "number": 3, "text": "E disse Deus: Haja luz; e houve luz." },
        { "number": 4, "text": "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas." },
        { "number": 5, "text": "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro." },
        { "number": 6, "text": "E disse Deus: Haja uma expansão no meio das águas, e haja separação entre águas e águas." },
        { "number": 7, "text": "E fez Deus a expansão, e fez separação entre as águas que estavam debaixo da expansão e as águas que estavam sobre a expansão; e assim foi." },
        { "number": 8, "text": "E chamou Deus à expansão Céus; e foi a tarde e a manhã, o dia segundo." }
      ]
    }
  },
  // João 3
  "jo": {
    "3": {
      "verses": [
        { "number": 16, "text": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
        { "number": 17, "text": "Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele." },
        { "number": 18, "text": "Quem crê nele não é condenado; mas quem não crê já está condenado, porquanto não crê no nome do unigênito Filho de Deus." }
      ]
    }
  },
  // Salmos 23
  "sl": {
    "23": {
      "verses": [
        { "number": 1, "text": "O Senhor é o meu pastor; nada me faltará." },
        { "number": 2, "text": "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas." },
        { "number": 3, "text": "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome." },
        { "number": 4, "text": "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam." },
        { "number": 5, "text": "Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda." },
        { "number": 6, "text": "Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias." }
      ]
    },
    "91": {
      "verses": [
        { "number": 1, "text": "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará." },
        { "number": 2, "text": "Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei." },
        { "number": 3, "text": "Porque ele te livrará do laço do passarinheiro, e da peste perniciosa." },
        { "number": 4, "text": "Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel." }
      ]
    }
  },
  // Mateus 5 (Bem-aventuranças)
  "mt": {
    "5": {
      "verses": [
        { "number": 3, "text": "Bem-aventurados os pobres de espírito, porque deles é o reino dos céus." },
        { "number": 4, "text": "Bem-aventurados os que choram, porque eles serão consolados." },
        { "number": 5, "text": "Bem-aventurados os mansos, porque eles herdarão a terra." },
        { "number": 6, "text": "Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos." },
        { "number": 7, "text": "Bem-aventurados os misericordiosos, porque eles alcançarão misericórdia." },
        { "number": 8, "text": "Bem-aventurados os limpos de coração, porque eles verão a Deus." }
      ]
    }
  },
  // Filipenses 4
  "fp": {
    "4": {
      "verses": [
        { "number": 13, "text": "Posso todas as coisas em Cristo que me fortalece." },
        { "number": 19, "text": "O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus." }
      ]
    }
  }
}

// Lista de versículos inspiradores para o "Versículo do Dia"
export const inspirationalVerses = [
  {
    text: "Entregue o seu caminho ao Senhor; confie nele, e ele agirá.",
    reference: "Salmos 37:5"
  },
  {
    text: "Posso todas as coisas em Cristo que me fortalece.",
    reference: "Filipenses 4:13"
  },
  {
    text: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmos 23:1"
  },
  {
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16"
  },
  {
    text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
    reference: "Romanos 8:28"
  },
  {
    text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
    reference: "Isaías 41:10"
  },
  {
    text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.",
    reference: "Salmos 91:1"
  },
  {
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reference: "Mateus 11:28"
  },
  {
    text: "A tua palavra é lâmpada para os meus pés e luz para o meu caminho.",
    reference: "Salmos 119:105"
  },
  {
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11"
  }
]

// Função para obter um versículo aleatório (apenas local)
export const getRandomVerse = (): { text: string; reference: string } => {
  const randomIndex = Math.floor(Math.random() * inspirationalVerses.length)
  return inspirationalVerses[randomIndex]
}

// Função para carregar versículos de um capítulo (apenas dados locais)
export const loadBibleChapter = (book: string, chapter: number): BibleVerse[] => {
  const bookData = sampleVerses[book as keyof typeof sampleVerses] as any
  if (bookData && bookData[chapter]) {
    return bookData[chapter].verses
  }
  
  // Retorna versículos de exemplo se não encontrar o livro/capítulo
  return [
    { 
      number: 1, 
      text: "Este é um versículo de exemplo. Para acessar o conteúdo completo da Bíblia, adicione mais dados locais." 
    }
  ]
}
