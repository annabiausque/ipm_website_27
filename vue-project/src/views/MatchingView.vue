<template>
  <div class="vue-tinder-container">
    <VueTinder :queue="myQueueData" />

  </div>
</template>

<script setup>
import VueTinder from "../lib/vue-tinder/src/components/vue-tinder/Tinder.vue"; // Vérifiez que le chemin est correct

// Exemple de données de test pour `myQueueData`
const myQueueData = [
  { key: 1, title: "Carte 1", description: "Ceci est la première carte" },
  { key: 2, title: "Carte 2", description: "Ceci est la deuxième carte" },
  { key: 3, title: "Carte 3", description: "Ceci est la troisième carte" }
];
</script>

<style lang="scss" scoped>
.vue-tinder-container {
  width: 100%;
  height: 100vh; /* Occupe toute la hauteur de l'écran */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid red; /* Bordure de test pour vérifier la taille */
}
</style>
