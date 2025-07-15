<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="text-center pa-6">
          <v-card-title class="text-h4 mb-4">
            <v-icon size="48" color="primary" class="mr-2">mdi-cross</v-icon>
            Bem-vindo ao Redime App
          </v-card-title>
          
          <v-card-subtitle class="text-h6 mb-4">
            Sua jornada de fé digital
          </v-card-subtitle>
          
          <v-card-text>
            <p class="text-body-1 mb-4">
              "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles."
            </p>
            <p class="text-caption mb-6">Mateus 18:20</p>
            
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-card class="feature-card" elevation="2" @click="goToBible">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary">mdi-book-open-page-variant</v-icon>
                    <p class="text-h6 mt-2">Bíblia</p>
                    <p class="text-body-2">Leia e estude a Palavra de Deus</p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card class="feature-card" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary">mdi-hands-pray</v-icon>
                    <p class="text-h6 mt-2">Oração</p>
                    <p class="text-body-2">Momentos de oração e reflexão</p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card class="feature-card" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary">mdi-account-group</v-icon>
                    <p class="text-h6 mt-2">Comunidade</p>
                    <p class="text-body-2">Conecte-se com outros irmãos</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-actions class="justify-center">
            <v-btn color="primary" size="large" @click="goToBible">
              <v-icon left>mdi-book-open-page-variant</v-icon>
              Começar Leitura
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Versículo do dia -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center">
            <v-icon left>mdi-calendar-today</v-icon>
            Versículo do Dia
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-h6 font-italic mb-2">
              "{{ verseOfDay.text }}"
            </p>
            <p class="text-caption">{{ verseOfDay.reference }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRandomInspirationalVerse } from '../data/bible-complete'

const router = useRouter()

const verseOfDay = ref({
  text: "Entregue o seu caminho ao Senhor; confie nele, e ele agirá.",
  reference: "Salmos 37:5"
})

const goToBible = () => {
  router.push('/biblia')
}

onMounted(() => {
  // Carrega um versículo aleatório
  const randomVerse = getRandomInspirationalVerse()
  verseOfDay.value = {
    text: randomVerse.text,
    reference: randomVerse.reference
  }
})
</script>

<style scoped>
.feature-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
}
</style>

