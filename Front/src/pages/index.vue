<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" lg="6">
        <v-card class="text-center pa-6">
          <v-icon size="80" color="primary" class="mb-4">mdi-cross</v-icon>
          
          <h1 class="text-h3 mb-4">Bem-vindo ao Redime App</h1>
          
          <p class="text-h6 text-grey mb-6">
            Sua bíblia digital offline para estudo e meditação
          </p>
          
          <v-row class="mt-8" justify="center">
            <v-col cols="12" sm="6" md="4">
              <v-btn
                size="large"
                color="primary"
                block
                to="/biblia"
                prepend-icon="mdi-book-open-page-variant"
              >
                Ler Bíblia
              </v-btn>
            </v-col>
          </v-row>
          
          <v-divider class="my-6"></v-divider>
          
          <v-row>
            <v-col cols="12" sm="4">
              <v-card flat>
                <v-icon size="48" color="primary">mdi-book-search</v-icon>
                <v-card-title class="text-h6">Pesquisa Rápida</v-card-title>
                <v-card-text>
                  Encontre versículos por livro e capítulo
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" sm="4">
              <v-card flat>
                <v-icon size="48" color="primary">mdi-wifi-off</v-icon>
                <v-card-title class="text-h6">Totalmente Offline</v-card-title>
                <v-card-text>
                  Acesse sua bíblia em qualquer lugar
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" sm="4">
              <v-card flat>
                <v-icon size="48" color="primary">mdi-heart</v-icon>
                <v-card-title class="text-h6">Interface Simples</v-card-title>
                <v-card-text>
                  Design focado na leitura e meditação
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// Página inicial do Redime App
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
