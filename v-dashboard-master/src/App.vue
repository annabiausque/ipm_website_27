<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VueTailwindDatepicker from "vue-tailwind-datepicker";
const defaultLayout = 'default'

const { currentRoute } = useRouter()

const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`,
)
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
