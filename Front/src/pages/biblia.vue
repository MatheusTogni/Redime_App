<template>
  <v-container fluid class="pa-0">
    <!-- Header com navegação compacta -->
    <v-app-bar 
      color="primary" 
      dark 
      app
      class="bible-header"
    >
      <!-- Botão de navegação anterior -->
      <v-btn 
        icon
        :disabled="selectedChapter <= 1"
        @click="previousChapter"
        size="small"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <!-- Nome do livro e capítulo (clicável) -->
      <v-btn
        variant="text"
        color="white"
        class="flex-grow-1 text-h6"
        @click="showBookSelector = true"
      >
        {{ currentBookName }} {{ selectedChapter }}
      </v-btn>

      <!-- Botão de navegação próximo -->
      <v-btn 
        icon
        :disabled="selectedChapter >= maxChapters"
        @click="nextChapter"
        size="small"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <!-- Menu de opções -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="showVersionSelector = true">
            <v-list-item-title>{{ selectedVersionName }}</v-list-item-title>
            <v-list-item-subtitle>Mudar versão</v-list-item-subtitle>
          </v-list-item>
          <v-list-item @click="decreaseFontSize">
            <v-list-item-title>A-</v-list-item-title>
            <v-list-item-subtitle>Diminuir fonte</v-list-item-subtitle>
          </v-list-item>
          <v-list-item @click="increaseFontSize">
            <v-list-item-title>A+</v-list-item-title>
            <v-list-item-subtitle>Aumentar fonte</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Área principal de leitura -->
    <v-main class="bible-content">
      <v-container fluid class="pa-0">
        <!-- Loading -->
        <div v-if="loading" class="text-center pa-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="mt-4 text-h6">Carregando versículos...</p>
        </div>

        <!-- Versículos -->
        <div v-else-if="verses.length > 0" class="pa-4">
          <div 
            v-for="verse in filteredVerses" 
            :key="verse.number" 
            class="verse-container mb-4"
          >
            <v-chip 
              class="verse-number mr-3" 
              size="small" 
              color="primary"
              variant="outlined"
            >
              {{ verse.number }}
            </v-chip>
            <span class="verse-text" :style="{ fontSize: fontSize + 'px' }">
              {{ verse.text }}
            </span>
          </div>

          <!-- Botões de ação -->
          <v-row class="ma-0 mt-6">
            <v-col cols="6" class="pa-1">
              <v-btn @click="copyToClipboard" color="secondary" block variant="outlined">
                <v-icon left>mdi-content-copy</v-icon>
                Copiar
              </v-btn>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-btn @click="shareVerse" color="info" block variant="outlined">
                <v-icon left>mdi-share</v-icon>
                Compartilhar
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- Estado vazio -->
        <div v-else class="text-center pa-8">
          <v-icon size="64" color="grey">mdi-book-open-page-variant</v-icon>
          <p class="text-h6 mt-4">Toque no nome do livro acima para começar</p>
        </div>
      </v-container>
    </v-main>

    <!-- Modal de seleção de livro e capítulo -->
    <v-dialog v-model="showBookSelector" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-btn icon @click="showBookSelector = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Selecionar Livro</v-toolbar-title>
        </v-toolbar>

        <v-container>
          <!-- Busca -->
          <v-text-field
            v-model="searchBook"
            label="Buscar livro..."
            prepend-inner-icon="mdi-magnify"
            clearable
            class="mb-4"
          ></v-text-field>

          <!-- Abas de testamentos -->
          <v-tabs v-model="selectedTestament" class="mb-4">
            <v-tab value="old">Antigo Testamento</v-tab>
            <v-tab value="new">Novo Testamento</v-tab>
          </v-tabs>

          <!-- Lista de livros -->
          <v-list>
            <v-list-item
              v-for="book in filteredBooks"
              :key="book.abbrev"
              @click="selectBook(book)"
              class="mb-2"
            >
              <v-list-item-title class="text-h6">{{ book.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ book.chapters }} capítulos</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal de seleção de capítulo -->
    <v-dialog v-model="showChapterSelector" max-width="500">
      <v-card>
        <v-card-title>{{ currentBookName }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="chapter in availableChapters"
              :key="chapter.value"
              cols="3"
              class="pa-1"
            >
              <v-btn
                @click="selectChapter(chapter.value)"
                :color="selectedChapter === chapter.value ? 'primary' : 'default'"
                block
                size="large"
              >
                {{ chapter.value }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showChapterSelector = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de seleção de versão -->
    <v-dialog v-model="showVersionSelector" max-width="500">
      <v-card>
        <v-card-title>Selecionar Versão</v-card-title>
        <v-list>
          <v-list-item
            v-for="version in availableVersions"
            :key="version.value"
            @click="selectVersion(version.value)"
            :class="{ 'v-list-item--active': selectedVersion === version.value }"
          >
            <v-list-item-title>{{ version.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showVersionSelector = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para feedback -->
    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { bibleApiService } from '../services/bible-api'
import { BIBLE_BOOKS, getBooksByTestament, findBookByAbbrev } from '../data/bible-complete'

interface Book {
  abbrev: string
  name: string
  chapters: number
  testament: string
}

interface Verse {
  number: number
  text: string
}

// Estados reativos
const selectedTestament = ref('old')
const selectedBook = ref('')
const selectedChapter = ref(1)
const selectedVersion = ref('nvi')
const verses = ref<Verse[]>([])
const loading = ref(false)
const fontSize = ref(18)
const verseStart = ref(1)
const verseEnd = ref()
const snackbar = ref(false)
const snackbarText = ref('')
const apiStatus = ref<'online' | 'offline' | 'checking'>('checking')
const connectionError = ref('')

// Estados dos modais
const showBookSelector = ref(false)
const showChapterSelector = ref(false)
const showVersionSelector = ref(false)
const searchBook = ref('')

// Versões disponíveis
const availableVersions = ref([
  { name: 'Nova Versão Internacional (NVI)', value: 'nvi' },
  { name: 'João Ferreira de Almeida', value: 'almeida' },
  { name: 'Almeida Corrigida Fiel', value: 'acf' },
  { name: 'World English Bible (Inglês)', value: 'web' }
])

// Computadas
const availableBooks = computed(() => {
  return getBooksByTestament(selectedTestament.value as 'old' | 'new').map(book => ({
    abbrev: book.abbrev,
    name: book.name,
    chapters: book.chapters,
    testament: book.testament
  }))
})

const filteredBooks = computed(() => {
  if (!searchBook.value) return availableBooks.value
  
  return availableBooks.value.filter(book =>
    book.name.toLowerCase().includes(searchBook.value.toLowerCase())
  )
})

const availableChapters = computed(() => {
  if (!selectedBook.value) return []
  const book = findBookByAbbrev(selectedBook.value)
  if (!book) return []
  
  return Array.from({ length: book.chapters }, (_, i) => ({
    title: `Capítulo ${i + 1}`,
    value: i + 1
  }))
})

const currentBookName = computed(() => {
  const book = findBookByAbbrev(selectedBook.value)
  return book ? book.name : 'Selecionar Livro'
})

const selectedVersionName = computed(() => {
  const version = availableVersions.value.find(v => v.value === selectedVersion.value)
  return version ? version.name : 'NVI'
})

const maxChapters = computed(() => {
  const book = findBookByAbbrev(selectedBook.value)
  return book ? book.chapters : 1
})

const totalVerses = computed(() => {
  return verses.value.length
})

const filteredVerses = computed(() => {
  if (!verseStart.value && !verseEnd.value) return verses.value
  
  const start = parseInt(verseStart.value as any) || 1
  const end = parseInt(verseEnd.value as any) || verses.value.length
  
  return verses.value.filter(verse => verse.number >= start && verse.number <= end)
})

// Métodos
const showMessage = (message: string) => {
  snackbarText.value = message
  snackbar.value = true
}

const checkApiStatus = async () => {
  apiStatus.value = 'checking'
  try {
    const isOnline = await bibleApiService.testConnection()
    apiStatus.value = isOnline ? 'online' : 'offline'
    
    if (!isOnline) {
      showMessage('Modo offline - Funcionalidade limitada.')
    }
  } catch (error) {
    apiStatus.value = 'offline'
    connectionError.value = error instanceof Error ? error.message : 'Erro desconhecido'
    showMessage('Erro de conexão - Usando modo offline')
  }
}

const loadVerses = async () => {
  if (!selectedBook.value || !selectedChapter.value) return
  
  loading.value = true
  connectionError.value = ''
  
  try {
    const chapterData = await bibleApiService.getChapter(
      selectedVersion.value,
      selectedBook.value,
      selectedChapter.value
    )
    
    verses.value = chapterData.verses
    verseStart.value = 1
    verseEnd.value = chapterData.verses.length
    
    if (apiStatus.value === 'offline' && chapterData.verses[0]?.text.includes('[Versículo')) {
      showMessage('Conteúdo limitado - Conecte-se à internet para texto completo')
    }
    
  } catch (error) {
    console.error('Erro ao carregar versículos:', error)
    showMessage(`Erro ao carregar ${currentBookName.value} ${selectedChapter.value}`)
    verses.value = []
  } finally {
    loading.value = false
  }
}

const selectBook = (book: Book) => {
  selectedBook.value = book.abbrev
  showBookSelector.value = false
  showChapterSelector.value = true
}

const selectChapter = (chapter: number) => {
  selectedChapter.value = chapter
  showChapterSelector.value = false
  loadVerses()
}

const selectVersion = (version: string) => {
  selectedVersion.value = version
  showVersionSelector.value = false
  if (selectedBook.value && selectedChapter.value) {
    loadVerses()
  }
}

const previousChapter = () => {
  if (selectedChapter.value > 1) {
    selectedChapter.value--
    loadVerses()
  }
}

const nextChapter = () => {
  if (selectedChapter.value < maxChapters.value) {
    selectedChapter.value++
    loadVerses()
  }
}

const increaseFontSize = () => {
  if (fontSize.value < 28) fontSize.value += 2
}

const decreaseFontSize = () => {
  if (fontSize.value > 14) fontSize.value -= 2
}

const copyToClipboard = async () => {
  const text = filteredVerses.value
    .map(verse => `${verse.number}. ${verse.text}`)
    .join('\n')
  
  const fullText = `${currentBookName.value} ${selectedChapter.value}\n\n${text}`
  
  try {
    await navigator.clipboard.writeText(fullText)
    showMessage('Texto copiado para a área de transferência')
  } catch (error) {
    console.error('Erro ao copiar:', error)
    showMessage('Erro ao copiar texto')
  }
}

const shareVerse = async () => {
  if (navigator.share) {
    const text = filteredVerses.value
      .map(verse => `${verse.number}. ${verse.text}`)
      .join('\n')
    
    try {
      await navigator.share({
        title: `${currentBookName.value} ${selectedChapter.value}`,
        text: text,
        url: window.location.href
      })
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        copyToClipboard()
      }
    }
  } else {
    copyToClipboard()
  }
}

// Watchers
watch(selectedTestament, () => {
  searchBook.value = ''
})

watch(selectedVersion, () => {
  if (selectedBook.value && selectedChapter.value) {
    loadVerses()
  }
})

// Lifecycle
onMounted(async () => {
  await checkApiStatus()
  
  // Carregar João 3:16 como padrão
  selectedTestament.value = 'new'
  selectedBook.value = 'jo'
  selectedChapter.value = 3
  await loadVerses()
})
</script>

<style scoped>
.bible-header {
  position: fixed !important;
  top: 0;
  z-index: 1000;
}

.bible-content {
  margin-top: 64px; /* Altura do app-bar */
  padding-bottom: 20px;
}

.verse-container {
  line-height: 1.8;
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.verse-number {
  flex-shrink: 0;
  margin-top: 2px;
}

.verse-text {
  flex: 1;
  line-height: 1.7;
  text-align: justify;
  color: #333;
}

/* Melhorias para toque em dispositivos móveis */
.v-btn {
  min-height: 44px;
}

.v-list-item {
  min-height: 56px;
}

/* Espaçamento específico para mobile */
@media (max-width: 600px) {
  .verse-container {
    padding: 16px 0;
  }
  
  .verse-text {
    font-size: 18px;
  }
}
</style>
