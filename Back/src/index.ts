import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3003', 'http://localhost:3002', 'http://localhost:3001'],
  credentials: true
}));

// Mapeamento de livros para bibliaonline.com.br
const BOOK_MAPPING: { [key: string]: string } = {
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
};

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Proxy para bibliaonline.com.br (NVI)
app.get('/api/nvi/:book/:chapter', async (req, res) => {
  try {
    const { book, chapter } = req.params;
    
    // Validar parâmetros
    if (!BOOK_MAPPING[book]) {
      return res.status(400).json({ 
        error: `Livro '${book}' não encontrado`,
        availableBooks: Object.keys(BOOK_MAPPING)
      });
    }
    
    const chapterNum = parseInt(chapter);
    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 150) {
      return res.status(400).json({ 
        error: `Capítulo '${chapter}' inválido. Deve ser um número entre 1 e 150.`
      });
    }
    
    const bibliaOnlineBook = BOOK_MAPPING[book];
    const url = `https://www.bibliaonline.com.br/nvi/${bibliaOnlineBook}/${chapter}`;
    
    console.log(`📡 Buscando NVI: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Mobile Safari/537.36'
      }
    });
    
    if (response.status === 200) {
      console.log(`✅ HTML recebido: ${response.data.length} caracteres`);
      res.json({ 
        success: true, 
        html: response.data,
        book,
        chapter: chapterNum,
        url 
      });
    } else {
      res.status(response.status).json({ 
        error: `Erro HTTP ${response.status}`,
        url 
      });
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar NVI:', error.message);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📖 Proxy NVI disponível em: http://localhost:${port}/api/nvi/{livro}/{capitulo}`);
  console.log(`📝 Exemplo: http://localhost:${port}/api/nvi/jo/3`);
});
