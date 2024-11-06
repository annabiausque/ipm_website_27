<template>
  <div class = "flex flex-col min-h-screen bg-primary-background">
    <SiteNavigation/>
 <RouterView/>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SiteNavigation from './components/SiteNavigation.vue';
</script>

