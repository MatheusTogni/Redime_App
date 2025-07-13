<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-icon class="mr-2">mdi-cross</v-icon>
      <v-toolbar-title>Redime App</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <template v-if="$vuetify.display.mdAndUp">
        <v-btn icon="mdi-magnify" variant="text" title="Pesquisar"></v-btn>
        <v-btn icon="mdi-bookmark" variant="text" title="Favoritos"></v-btn>
      </template>
      
      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list>
        <v-list-subheader>
          <v-icon left>mdi-cross</v-icon>
          Redime App
        </v-list-subheader>
        
        <v-divider></v-divider>
        
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          value="home"
          to="/"
          @click="drawer = false"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-book-open-page-variant"
          title="Bíblia"
          value="biblia"
          to="/biblia"
          @click="drawer = false"
        ></v-list-item>
        
        <v-divider></v-divider>
        
        <v-list-item
          prepend-icon="mdi-information"
          title="Sobre"
          value="about"
          to="/about"
          @click="drawer = false"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const drawer = ref(false)
const group = ref(null)

watch(group, () => {
  drawer.value = false
})
</script>
