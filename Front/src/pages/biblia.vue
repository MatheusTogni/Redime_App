<template>
  <v-container fluid style="padding:0;">
    <v-row style="margin:0;">
    </v-row>
    <div
      v-if="selectedBook && selectedChapter && !dialogSelect"
      class="bottom-bar-group"
      style="position:fixed; left:0; right:0; bottom:0; z-index:100; display:flex; justify-content:center; align-items:center; background:#232323; height:72px;"
    >
      <div class="bottom-bar-inner" style="display:flex; align-items:center; background:#393939; border-radius:20px; box-shadow:0 2px 8px #0002; padding:0 18px; min-width:220px; min-height:48px;">
        <v-btn icon @click="goToPrevChapter" :disabled="!hasPrevChapter" variant="text" style="color:#fff; background:transparent;">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div
          class="bottom-bar-title px-4"
          style="color:#fff; font-weight:600; font-size:1.1rem; text-align:center; min-width:100px; user-select:none; cursor:pointer;"
          @click="dialogSelect = true"
        >
          {{ selectedBook }} {{ selectedChapter }}
        </div>
        <v-btn icon @click="goToNextChapter" :disabled="!hasNextChapter" variant="text" style="color:#fff; background:transparent;">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
   <v-dialog v-model="dialogSelect" persistent max-width="400" max-height="700">
      <v-card>
        <v-card-title class="d-flex justify-center">
          <v-btn-toggle
            v-model="selectedTestament"
            mandatory
            color="primary"
          >
            <v-btn value="Antigo">Antigo</v-btn>
            <v-btn value="Novo">Novo</v-btn>
          </v-btn-toggle>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="searchBook"
            label="Pesquisar Livro"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            class="mb-2 search-field-white"
          ></v-text-field>
          <v-list>
            <template v-for="book in filteredBooks" :key="book.value">
              <v-list-item
                @click="selectBookDialog(book.value)"
                :active="selectedBook === book.value"
                style="cursor:pointer;"
              >
                <v-list-item-title>{{ book.title }}</v-list-item-title>
              </v-list-item>
              <transition name="fade-slide">
                <div v-if="expandedBook === book.value" class="d-flex flex-wrap gap-2 justify-center mb-2 hover-chapters" style="background: #232323;">
                  <v-btn
                    v-for="chapter in chapterOptions"
                    :key="chapter.value"
                    :color="selectedChapter === chapter.value ? 'primary' : 'grey-darken-3'"
                    variant="flat"
                    class="ma-1"
                    @click.stop="selectChapterDialog(chapter.value)"
                  >
                    {{ chapter.value }}
                  </v-btn>
                </div>
              </transition>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Resultado dos Versículos/Estado vazio -->
    <v-row style="margin:0;">
      <v-col cols="12" style="padding:0;">
        <div class="verses-bg pa-4">
          <div v-if="selectedBook && selectedChapter && !dialogSelect" class="verses-bottom-divider"></div>
          <template v-if="verses.length > 0">
            <div class="verso-titulo mb-4" style="flex-direction:column; gap:0;">
              <span class="font-weight-bold" style="font-size:1.5rem; line-height:1.1; color: grey;">{{ selectedBook }}</span>
              <span style="font-size:4.0rem; font-weight:900; line-height:1.1;">{{ selectedChapter }}</span>
            </div>
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
                  variant="flat"
                  style="font-size:1.1rem; font-weight:600;"
                >
                  {{ verse.number }}
                </v-chip>
                <span class="verse-text">{{ verse.text }}</span>
              </div>
            </div>
          </template>
          <template v-else-if="selectedBook && selectedChapter">
            <div class="text-center py-8">
              <v-icon size="64" color="grey">mdi-book-open-blank-variant</v-icon>
              <p class="text-h6 mt-4">Nenhum versículo encontrado</p>
              <p class="text-body-2 text-grey">
                Verifique se o livro e capítulo selecionados estão corretos.
              </p>
            </div>
          </template>
          <template v-else>
            <div class="text-center py-8">
              <v-icon size="64" color="primary">mdi-book-search</v-icon>
              <p class="text-h6 mt-4">Explore a Palavra de Deus</p>
              <p class="text-body-2 text-grey mb-6">
                Selecione um livro e capítulo para começar a leitura.
              </p>
              <v-btn
                color="primary"
                size="large"
                variant="elevated"
                style="font-weight:600; font-size:1.1rem; border-radius:12px; min-width:220px;"
                @click="dialogSelect = true"
              >
                Selecionar Livro e Capítulo
              </v-btn>
            </div>
          </template>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Verse {
  number: number;
  text: string;
}
interface Chapter {
  chapter: number;
  verses: Verse[];
}
interface BibleData {
  [bookName: string]: Chapter[];
}

export default defineComponent({
  name: 'BibliaPage',
  data() {
    return {
      bibliaData: {} as BibleData,
      selectedTestament: 'Novo' as 'Antigo' | 'Novo',
      selectedBook: null as string | null,
      selectedChapter: null as number | null,
      verses: [] as Verse[],
      searchBook: '',
      dialogSelect: false,
      oldTestamentBooks: [
        'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute', '1Samuel', '2Samuel', '1Reis', '2Reis', '1Crônicas', '2Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cânticos', 'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias'
      ],
      newTestamentBooks: [
        'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1Coríntios', '2Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', '1Tessalonicenses', '2Tessalonicenses', '1Timóteo', '2Timóteo', 'Tito', 'Filemom', 'Hebreus', 'Tiago', '1Pedro', '2Pedro', '1João', '2João', '3João', 'Judas', 'Apocalipse'
      ],
      expandedBook: null as string | null
    };
  },
  computed: {
    bookOptions(): { title: string; value: string }[] {
      const books = this.selectedTestament === 'Antigo' ? this.oldTestamentBooks : this.newTestamentBooks;
      return books
        .filter(book => book.toLowerCase().includes(this.searchBook.toLowerCase()))
        .filter(book => this.bibliaData[book])
        .map(book => ({ title: book, value: book }));
    },
    filteredBooks(): { title: string; value: string }[] {
      return this.bookOptions;
    },
    chapterOptions(): { title: string; value: number }[] {
      if (!this.selectedBook || !this.bibliaData[this.selectedBook]) {
        return [];
      }
      return this.bibliaData[this.selectedBook].map(chapter => ({
        title: `Capítulo ${chapter.chapter}`,
        value: chapter.chapter
      }));
    },
    hasPrevChapter(): boolean {
      if (!this.selectedBook || !this.selectedChapter) return false;
      return this.selectedChapter > 1;
    },
    hasNextChapter(): boolean {
      if (!this.selectedBook || !this.selectedChapter || !this.bibliaData[this.selectedBook]) return false;
      return this.selectedChapter < this.bibliaData[this.selectedBook].length;
    }
  },
  methods: {
    async loadBibleData() {
      try {
        const response = await fetch('/biblias/NVI/biblia_nvi_estruturada.json');
        if (!response.ok) {
          throw new Error('Erro ao carregar dados da bíblia');
        }
        this.bibliaData = await response.json();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar bíblia:', error);
      }
    },
    selectBookDialog(book: string) {
      if (this.expandedBook === book) {
        this.expandedBook = null;
      } else {
        this.expandedBook = book;
      }
      // Só altera selectedBook e selectedChapter se for um livro diferente do atual
      if (this.selectedBook !== book) {
        this.selectedBook = book;
        this.selectedChapter = null;
      }
    },
    selectChapter(chapter: number) {
      this.selectedChapter = chapter;
      this.loadVerses();
    },
    selectChapterDialog(chapter: number) {
      this.selectedChapter = chapter;
      this.loadVerses();
      this.dialogSelect = false;
      this.expandedBook = null; // Sempre fecha o hover ao escolher capítulo
    },
    goToPrevChapter() {
      if (this.hasPrevChapter) {
        this.selectChapter((this.selectedChapter as number) - 1);
      }
    },
    goToNextChapter() {
      if (this.hasNextChapter) {
        this.selectChapter((this.selectedChapter as number) + 1);
      }
    },
    loadVerses() {
      if (!this.selectedBook || !this.selectedChapter || !this.bibliaData[this.selectedBook]) {
        this.verses = [];
        return;
      }
      const book = this.bibliaData[this.selectedBook];
      const chapter = book.find(ch => ch.chapter === this.selectedChapter);
      if (chapter && chapter.verses) {
        this.verses = chapter.verses;
      } else {
        this.verses = [];
      }
    }
  },
  mounted() {
    this.loadBibleData();
  }
});
</script>

<style scoped>

.verses-bg {
  background: #232323;
  min-height: calc(100vh - 72px); /* altura total menos a barra de navegação */
  width: 100%;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  padding-bottom: 0;
  position: relative;
}
.verses-bottom-divider {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 72px;
  height: 2px;
  background: #fff;
  opacity: 0.7;
  z-index: 101;
}
.verses-container {
  max-height: calc(84vh - 120px);
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
  color: #fff;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.hover-chapters {
  will-change: opacity, transform;
}

.search-field-white .v-input__control,
.search-field-white .v-field {
  border: none !important;
  border-radius: 18px !important;
  box-shadow: none !important;
}
.search-field-white .v-field--outlined {
  border-color: #fff !important;
  border-width: 2px !important;
  border-radius: 18px !important;
}
.search-field-white .v-label,
.search-field-white input {
  color: #fff !important;
}
.search-field-white .v-field__outline {
  border-radius: 18px !important;
  border-color: #fff !important;
}

.verso-titulo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
}

@media (max-width: 600px) {
  .verse-text {
    font-size: 1rem;
  }
  .v-bottom-navigation {
    font-size: 0.95rem;
    min-height: 48px;
  }
}
</style>