<script setup lang="js">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { supabase } from './lib/supabaseClient';
import { Vue3Snackbar } from "vue3-snackbar";

const defaultLayout = 'default';
const router = useRouter();

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // router.push({ name: 'Dashboard' }); // this was forcing redirect to dashboard
  } else if (event === 'SIGNED_OUT') {
    router.push({ name: 'Login' });
  }
});

const { currentRoute } = useRouter();

const layout = computed(() => {
  return `${router.currentRoute.value.meta.layout || defaultLayout}-layout`;
});
</script>

<template>
  <component :is="layout">

    <router-view />
    <vue3-snackbar bottom groups :duration="4000"></vue3-snackbar>

  </component>
</template>

<style>
/* Styles optionnels */
</style>
