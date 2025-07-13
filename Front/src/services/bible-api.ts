import axios from 'axios'
import { BIBLE_BOOKS, BOOK_MAPPING_EN, INSPIRATIONAL_VERSES, getRandomInspirationalVerse, findBookByAbbrev } from '@/data/bible-complete'

// Mapeamento de livros para bibliaonline.com.br (formato usado nas URLs)
const BOOK_MAPPING_BIBLIA_ONLINE: { [key: string]: string } = {
  // Antigo Testamento
  'gn': 'gn', 'ex': 'ex', 'lv': 'lv', 'nm': 'nm', 'dt': 'dt',
  'js': 'js', 'jz': 'jz', 'rt': 'rt', '1sm': '1sm', '2sm': '2sm',
  '1rs': '1rs', '2rs': '2rs', '1cr': '1cr', '2cr': '2cr', 'ed': 'ed',
  'ne': 'ne', 'et': 'et', 'job': 'job', 'sl': 'sl', 'pv': 'pv',
  'ec': 'ec', 'ct': 'ct', 'is': 'is', 'jr': 'jr', 'lm': 'lm',
  'ez': 'ez', 'dn': 'dn', 'os': 'os', 'jl': 'jl', 'am': 'am',
  'ob': 'ob', 'jn': 'jn', 'mq': 'mq', 'na': 'na', 'hc': 'hc',
  'sf': 'sf', 'ag': 'ag', 'zc': 'zc', 'ml': 'ml',
  // Novo Testamento  
  'mt': 'mt', 'mc': 'mc', 'lc': 'lc', 'jo': 'jo', 'at': 'at',
  'rm': 'rm', '1co': '1co', '2co': '2co', 'gl': 'gl', 'ef': 'ef',
  'fp': 'fp', 'cl': 'cl', '1ts': '1ts', '2ts': '2ts', '1tm': '1tm',
  '2tm': '2tm', 'tt': 'tt', 'fm': 'fm', 'hb': 'hb', 'tg': 'tg',
  '1pe': '1pe', '2pe': '2pe', '1jo': '1jo', '2jo': '2jo', '3jo': '3jo',
  'jd': 'jd', 'ap': 'ap'
}

// APIs funcionais
const API_ENDPOINTS = {
  bibleApi: 'https://bible-api.com', // API que está funcionando
  bibliaOnline: 'https://www.bibliaonline.com.br', // NVI em português brasileiro (direto - pode ter CORS)
  nviProxy: 'http://localhost:3000/api/nvi', // Proxy para bibliaonline.com.br via backend
  proxy: '/api/bible-alt', // Proxy local para Bible API
  backup: 'https://www.abibliadigital.com.br/api' // Backup (pode ter CORS)
}

export interface BibleVerse {
  number: number
  text: string
  book?: {
    name: string
    abbrev: string
  }
  chapter?: {
    number: number
  }
}

export interface BibleChapter {
  book: {
    abbrev: string
    name: string
    chapters: number
  }
  chapter: {
    number: number
    verses: number
  }
  verses: BibleVerse[]
}

export interface BibleBook {
  abbrev: string
  name: string
  author: string
  group: string
  chapters: number
}

export interface BibleVersion {
  version: string
  verses: number
}

class BibleApiService {
  private readonly timeout = 8000 // 8 segundos

  /**
   * Parse HTML do bibliaonline.com.br para extrair versículos
   */
  private parseNVIHtml(html: string): BibleVerse[] {
    const verses: BibleVerse[] = []
    
    try {
      // Criar um parser DOM simples
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      console.log('🔍 Fazendo parse do HTML da bibliaonline.com.br...')
      
      // O bibliaonline.com.br usa elementos <p> com atributo data-v no formato ".X."
      // Exemplo: <p data-v=".16." class="l0">
      const verseElements = doc.querySelectorAll('p[data-v]')
      console.log(`📋 Encontrados ${verseElements.length} elementos com data-v`)
      
      if (verseElements.length > 0) {
        verseElements.forEach((element) => {
          const dataV = element.getAttribute('data-v')
          if (dataV) {
            // Extrair número do versículo do data-v (formato: ".16." -> 16)
            const match = dataV.match(/\.(\d+)\./)
            if (match) {
              const verseNumber = parseInt(match[1])
              
              // Procurar pelo texto do versículo dentro do span com classe 't'
              const textElement = element.querySelector('span.t')
              const text = textElement?.textContent?.trim()
              
              if (text && text.length > 0 && verseNumber > 0) {
                verses.push({
                  number: verseNumber,
                  text: text
                })
              }
            }
          }
        })
      }
      
      // Se não encontrou versículos pelo método específico, tentar fallback
      if (verses.length === 0) {
        console.log('Tentando parser fallback...')
        
        // Buscar por qualquer elemento que contenha versículos
        const allElements = doc.querySelectorAll('p, div, span')
        
        allElements.forEach((element, index) => {
          const text = element.textContent?.trim()
          if (text && text.length > 10) {
            // Procurar por padrão: número + texto
            const match = text.match(/^(\d+)\s+(.+)/)
            if (match) {
              const verseNumber = parseInt(match[1])
              const verseText = match[2].trim()
              
              if (verseText.length > 5 && verseNumber <= 200) {
                verses.push({
                  number: verseNumber,
                  text: verseText
                })
              }
            }
          }
        })
      }
      
    } catch (error) {
      console.error('Erro ao fazer parse do HTML NVI:', error)
    }
    
    // Ordenar por número do versículo e remover duplicatas
    const uniqueVerses = verses
      .filter((verse, index, self) => 
        self.findIndex(v => v.number === verse.number) === index
      )
      .sort((a, b) => a.number - b.number)
    
    console.log(`📖 Parsed ${uniqueVerses.length} versículos da NVI`)
    return uniqueVerses.slice(0, 200) // Limitar a 200 versículos máximo
  }

  /**
   * Busca versículos da NVI no bibliaonline.com.br
   */
  private async fetchFromBibliaOnline(book: string, chapter: number): Promise<BibleVerse[]> {
    const bibliaOnlineBook = BOOK_MAPPING_BIBLIA_ONLINE[book]
    if (!bibliaOnlineBook) {
      throw new Error(`Livro ${book} não mapeado para bibliaonline.com.br`)
    }
    
    // Usar proxy do backend para evitar problemas de CORS
    const url = `${API_ENDPOINTS.nviProxy}/${bibliaOnlineBook}/${chapter}`
    
    console.log('📡 Buscando NVI via proxy:', url)
    
    try {
      const response = await axios.get(url, {
        timeout: this.timeout
      })
      
      if (response.data && response.data.success && response.data.html) {
        const verses = this.parseNVIHtml(response.data.html)
        
        if (verses.length === 0) {
          throw new Error('Nenhum versículo encontrado no HTML')
        }
        
        console.log(`✅ NVI via proxy: Encontrados ${verses.length} versículos em ${book} ${chapter}`)
        return verses
      } else {
        throw new Error('Resposta inválida do proxy')
      }
      
    } catch (error) {
      console.error(`❌ Erro ao buscar NVI via proxy:`, error)
      throw error
    }
  }

  /**
   * Obtém informações sobre as versões disponíveis (offline)
   */
  async getVersions(): Promise<BibleVersion[]> {
    // Retorna versões disponíveis incluindo NVI verdadeira
    return [
      { version: 'nvi', verses: 31102 }, // Nova Versão Internacional (bibliaonline.com.br)
      { version: 'almeida', verses: 31102 }, // João Ferreira de Almeida (bible-api.com)
      { version: 'acf', verses: 31102 }, // Almeida Corrigida Fiel (mapeada para Almeida)
      { version: 'web', verses: 31102 }  // World English Bible
    ]
  }

  /**
   * Obtém lista de todos os livros da Bíblia (offline)
   */
  async getBooks(): Promise<BibleBook[]> {
    return BIBLE_BOOKS.map(book => ({
      abbrev: book.abbrev,
      name: book.name,
      author: book.author || 'Desconhecido',
      group: book.group,
      chapters: book.chapters
    }))
  }

  /**
   * Obtém os versículos de um capítulo específico usando múltiplas fontes
   */
  async getChapter(version: string = 'almeida', book: string, chapter: number): Promise<BibleChapter> {
    const bookData = findBookByAbbrev(book)
    if (!bookData) {
      throw new Error(`Livro ${book} não encontrado`)
    }

    // Estratégia baseada na versão solicitada
    if (version === 'nvi') {
      // Para NVI, tentar bibliaonline.com.br primeiro
      try {
        const nviVerses = await this.fetchFromBibliaOnline(book, chapter)
        
        return {
          book: {
            abbrev: book,
            name: bookData.name,
            chapters: bookData.chapters
          },
          chapter: {
            number: chapter,
            verses: nviVerses.length
          },
          verses: nviVerses.map(verse => ({
            ...verse,
            book: {
              name: bookData.name,
              abbrev: book
            },
            chapter: {
              number: chapter
            }
          }))
        }
      } catch (nviError) {
        console.log('NVI não disponível, tentando fallback para Almeida...', nviError)
        // Fallback para Almeida se NVI falhar
        version = 'almeida'
      }
    }

    // Para outras versões ou fallback, usar Bible API
    const englishBookName = BOOK_MAPPING_EN[book]
    if (!englishBookName) {
      throw new Error(`Mapeamento para ${book} não encontrado`)
    }

    // Mapear versões para as disponíveis na Bible API
    const translationMap: { [key: string]: string } = {
      'nvi': 'almeida',      // Fallback caso NVI tenha falhado
      'acf': 'almeida', 
      'aa': 'almeida',
      'almeida': 'almeida',
      'web': 'web' // World English Bible (inglês)
    }
    
    const apiTranslation = translationMap[version] || 'almeida'

    try {
      // Buscar na Bible API
      const response = await this.getChapterRange(englishBookName, chapter, apiTranslation)

      if (response.data && response.data.verses) {
        return {
          book: {
            abbrev: book,
            name: bookData.name,
            chapters: bookData.chapters
          },
          chapter: {
            number: chapter,
            verses: response.data.verses.length
          },
          verses: response.data.verses.map((verse: any) => ({
            number: verse.verse,
            text: verse.text?.trim() || `Versículo ${verse.verse} não disponível`,
            book: {
              name: bookData.name,
              abbrev: book
            },
            chapter: {
              number: chapter
            }
          }))
        }
      }

      throw new Error('Dados inválidos recebidos da API')

    } catch (error) {
      console.error(`Erro ao buscar ${bookData.name} ${chapter}:`, error)
      
      // Fallback: retorna versículos de exemplo
      return this.getFallbackChapter(book, chapter, bookData)
    }
  }

  /**
   * Retorna dados de fallback quando a API falha
   */
  private getFallbackChapter(book: string, chapter: number, bookData: any): BibleChapter {
    const fallbackVerses = []
    const englishBookName = BOOK_MAPPING_EN[book] || book
    const versesCount = this.getEstimatedVersesCount(englishBookName, chapter)
    
    for (let i = 1; i <= versesCount; i++) {
      fallbackVerses.push({
        number: i,
        text: `[Versículo ${i} - Conecte-se à internet para ver o conteúdo completo]`,
        book: {
          name: bookData.name,
          abbrev: book
        },
        chapter: {
          number: chapter
        }
      })
    }

    return {
      book: {
        abbrev: book,
        name: bookData.name,
        chapters: bookData.chapters
      },
      chapter: {
        number: chapter,
        verses: versesCount
      },
      verses: fallbackVerses
    }
  }

  /**
   * Faz requisição direta para a API (sem proxy)
   */
  private async getChapterRange(englishBookName: string, chapter: number, apiTranslation: string): Promise<any> {
    // Primeiro tenta um range grande para pegar o capítulo completo
    let maxVerse = this.getEstimatedVersesCount(englishBookName, chapter)
    
    try {
      // Usa API direta (sem proxy)
      const url = `${API_ENDPOINTS.bibleApi}/${englishBookName}%20${chapter}:1-${maxVerse}?translation=${apiTranslation}`
      console.log('Fazendo requisição para:', url)
      
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      return response
    } catch (error) {
      console.log('Tentativa com range grande falhou, tentando range menor...')
      // Se falhar, tenta com range menor
      maxVerse = Math.floor(maxVerse / 2)
      const url = `${API_ENDPOINTS.bibleApi}/${englishBookName}%20${chapter}:1-${maxVerse}?translation=${apiTranslation}`
      console.log('Tentando com URL menor:', url)
      
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      return response
    }
  }

  /**
   * Estima número de versículos baseado em dados conhecidos
   */
  private getEstimatedVersesCount(englishBookName: string, chapter: number): number {
    // Alguns capítulos conhecidos para dar uma estimativa melhor
    const knownCounts: { [key: string]: { [key: number]: number } } = {
      'psalms': { 119: 176, 23: 6, 1: 6, 51: 19, 91: 16 },
      'john': { 3: 36, 1: 51, 11: 57, 21: 25 },
      'genesis': { 1: 31, 2: 25, 3: 24, 50: 26 },
      'matthew': { 5: 48, 6: 34, 7: 29, 28: 20 },
      'romans': { 8: 39, 12: 21, 16: 27 },
      'revelation': { 22: 21, 21: 27 }
    }

    if (knownCounts[englishBookName] && knownCounts[englishBookName][chapter]) {
      return knownCounts[englishBookName][chapter]
    }

    // Estimativa padrão baseada no tipo de livro
    if (['psalms'].includes(englishBookName)) return 50 // Salmos tem versículos variados
    if (['proverbs', 'ecclesiastes'].includes(englishBookName)) return 35 // Livros de sabedoria
    if (['matthew', 'mark', 'luke', 'john'].includes(englishBookName)) return 45 // Evangelhos
    if (['acts'].includes(englishBookName)) return 48 // Atos
    if (['romans', '1corinthians', '2corinthians'].includes(englishBookName)) return 35 // Cartas longas
    if (['philemon', '2john', '3john', 'jude'].includes(englishBookName)) return 25 // Cartas curtas
    
    return 40 // Padrão geral mais alto para não perder versículos
  }

  /**
   * Obtém um versículo específico
   */
  async getVerse(version: string = 'almeida', book: string, chapter: number, verse: number): Promise<BibleVerse> {
    const chapterData = await this.getChapter(version, book, chapter)
    const foundVerse = chapterData.verses.find(v => v.number === verse)
    
    if (!foundVerse) {
      throw new Error(`Versículo ${verse} não encontrado em ${book} ${chapter}`)
    }
    
    return foundVerse
  }

  /**
   * Busca versículos por palavra-chave (funcionalidade limitada offline)
   */
  async searchVerses(version: string = 'almeida', query: string): Promise<BibleVerse[]> {
    // Busca nos versículos inspiracionais disponíveis offline
    const results = INSPIRATIONAL_VERSES.filter(verse => 
      verse.text.toLowerCase().includes(query.toLowerCase()) ||
      verse.reference.toLowerCase().includes(query.toLowerCase())
    ).map(verse => ({
      number: verse.verse,
      text: verse.text,
      book: {
        name: findBookByAbbrev(verse.book)?.name || verse.book,
        abbrev: verse.book
      },
      chapter: {
        number: verse.chapter
      }
    }))

    if (results.length === 0) {
      throw new Error(`Nenhum resultado encontrado para "${query}". Conecte-se à internet para busca completa.`)
    }

    return results
  }

  /**
   * Obtém um versículo aleatório dos versículos inspiracionais
   */
  async getRandomVerse(version: string = 'almeida'): Promise<BibleVerse> {
    const verse = getRandomInspirationalVerse()
    return {
      number: verse.verse,
      text: verse.text,
      book: {
        name: findBookByAbbrev(verse.book)?.name || verse.book,
        abbrev: verse.book
      },
      chapter: {
        number: verse.chapter
      }
    }
  }

  /**
   * Testa conectividade com as APIs
   */
  async testConnection(): Promise<boolean> {
    try {
      // Testa bibliaonline.com.br para NVI primeiro
      await axios.get(`${API_ENDPOINTS.bibliaOnline}/nvi/jo/3`, { 
        timeout: 5000,
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      console.log('✅ Conectado ao Bíblia Online (NVI)')
      return true
    } catch (error) {
      console.log('❌ Bíblia Online falhou, testando Bible API...', error)
      
      try {
        // Testa Bible API como fallback
        await axios.get(`${API_ENDPOINTS.bibleApi}/john%203:16?translation=almeida`, { 
          timeout: 5000,
          headers: {
            'Accept': 'application/json'
          }
        })
        console.log('✅ Conectado à Bible API (Almeida)')
        return true
      } catch (bibleApiError) {
        console.log('❌ Bible API também falhou:', bibleApiError)
        
        try {
          // Testa proxy como último recurso
          await axios.get(`${API_ENDPOINTS.proxy}/john%203:16?translation=almeida`, { 
            timeout: 5000
          })
          console.log('✅ Conectado via proxy')
          return true
        } catch (proxyError) {
          console.log('❌ Todas as APIs falharam:', proxyError)
          return false
        }
      }
    }
  }

  /**
   * Obtém estatísticas da Bíblia
   */
  async getBibleStats() {
    const oldTestament = BIBLE_BOOKS.filter(b => b.testament === 'old')
    const newTestament = BIBLE_BOOKS.filter(b => b.testament === 'new')
    
    return {
      totalBooks: BIBLE_BOOKS.length,
      oldTestamentBooks: oldTestament.length,
      newTestamentBooks: newTestament.length,
      totalChapters: BIBLE_BOOKS.reduce((sum, book) => sum + book.chapters, 0),
      isOnline: await this.testConnection()
    }
  }
}

// Instância singleton do serviço
export const bibleApiService = new BibleApiService()

// Lista de versões disponíveis (caso a API não responda)
export const BIBLE_VERSIONS = [
  { version: 'nvi', name: 'Nova Versão Internacional (NVI)' },
  { version: 'almeida', name: 'João Ferreira de Almeida' },
  { version: 'acf', name: 'Almeida Corrigida Fiel (mapeada para Almeida)' },
  { version: 'web', name: 'World English Bible (Inglês)' }
]
