<script setup lang="js">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { supabase } from './lib/supabaseClient';

const defaultLayout = 'default';
const router = useRouter();

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    router.push({ name: 'Dashboard' });
  } else if (event === 'SIGNED_OUT') {
    router.push({ name: 'Login' });
  }
});

const layout = computed(() => {
  return `${router.currentRoute.value.meta.layout || defaultLayout}-layout`;
});
</script>

<template>
  <component :is="layout">
  
    <router-view />
  </component>
</template>

<style>
/* Styles optionnels */
</style>
