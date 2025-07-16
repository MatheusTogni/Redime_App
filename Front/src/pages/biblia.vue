<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
          Bíblia Sagrada - NVI
        </h1>
      </v-col>
    </v-row>

    <!-- Controles de Pesquisa -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedBook"
          :items="bookOptions"
          label="Selecione o Livro"
          prepend-icon="mdi-book"
          variant="outlined"
          clearable
          @update:model-value="onBookChange"
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedChapter"
          :items="chapterOptions"
          label="Selecione o Capítulo"
          prepend-icon="mdi-format-list-numbered"
          variant="outlined"
          clearable
          :disabled="!selectedBook"
          @update:model-value="loadVerses"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Resultado dos Versículos -->
    <v-row v-if="verses.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-bookmark</v-icon>
            {{ selectedBook }} - Capítulo {{ selectedChapter }}
          </v-card-title>
          
          <v-card-text>
            <div class="verses-container">
              <div
                v-for="verse in verses"
                :key="verse.number"
                class="verse-item mb-3"
              >
                <v-chip
                  class="mr-2 mb-1"
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  {{ verse.number }}
                </v-chip>
                <span class="verse-text">{{ verse.text }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estado Vazio -->
    <v-row v-else-if="selectedBook && selectedChapter">
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-8">
            <v-icon size="64" color="grey">mdi-book-open-blank-variant</v-icon>
            <p class="text-h6 mt-4">Nenhum versículo encontrado</p>
            <p class="text-body-2 text-grey">
              Verifique se o livro e capítulo selecionados estão corretos.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Instrução Inicial -->
    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-8">
            <v-icon size="64" color="primary">mdi-book-search</v-icon>
            <p class="text-h6 mt-4">Explore a Palavra de Deus</p>
            <p class="text-body-2 text-grey">
              Selecione um livro e capítulo para começar a leitura.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

// Tipos
interface Verse {
  number: number
  text: string
}

interface Chapter {
  chapter: number
  verses: Verse[]
}

interface BibleData {
  [bookName: string]: Chapter[]
}

// Estados reativo
const bibliaData = ref<BibleData>({})
const selectedBook = ref<string | null>(null)
const selectedChapter = ref<number | null>(null)
const verses = ref<Verse[]>([])

// Opções computadas
const bookOptions = computed(() => {
  return Object.keys(bibliaData.value).map(book => ({
    title: book,
    value: book
  }))
})

const chapterOptions = computed(() => {
  if (!selectedBook.value || !bibliaData.value[selectedBook.value]) {
    return []
  }
  
  return bibliaData.value[selectedBook.value].map(chapter => ({
    title: `Capítulo ${chapter.chapter}`,
    value: chapter.chapter
  }))
})

// Métodos
const loadBibleData = async () => {
  try {
    const response = await fetch('/biblias/NVI/biblia_nvi_estruturada.json')
    if (!response.ok) {
      throw new Error('Erro ao carregar dados da bíblia')
    }
    bibliaData.value = await response.json()
  } catch (error) {
    console.error('Erro ao carregar bíblia:', error)
  }
}

const onBookChange = () => {
  selectedChapter.value = null
  verses.value = []
}

const loadVerses = () => {
  if (!selectedBook.value || !selectedChapter.value || !bibliaData.value[selectedBook.value]) {
    verses.value = []
    return
  }

  const book = bibliaData.value[selectedBook.value]
  const chapter = book.find(ch => ch.chapter === selectedChapter.value)
  
  if (chapter && chapter.verses) {
    verses.value = chapter.verses
  } else {
    verses.value = []
  }
}

// Lifecycle
onMounted(() => {
  loadBibleData()
})
</script>

<style scoped>
.verses-container {
  max-height: 600px;
  overflow-y: auto;
}

.verse-item {
  line-height: 1.6;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.verse-item:last-child {
  border-bottom: none;
}

.verse-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.87);
}

@media (max-width: 600px) {
  .verse-text {
    font-size: 1rem;
  }
}
</style>