<!-- CardContent.vue -->
<template>
    <div>
      <h3 :id="`tier-${title.toLowerCase()}`" class="text-base font-semibold" :class="titleColor">
        {{ title }}
      </h3>
      <p class="mt-4 flex items-baseline gap-x-2">
        <span class="text-5xl font-semibold tracking-tight">{{ price }}</span>
        <span class="text-base text-gray-500">{{ priceUnit }}</span>
      </p>
      <p class="mt-6 text-base text-gray-600">{{ description }}</p>
      <ul role="list" class="mt-8 space-y-3 text-sm text-gray-600">
        <li v-for="(feature, index) in features" :key="index" class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none" :class="iconColor" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
          </svg>
          {{ feature }}
        </li>
      </ul>
      <div class="mt-8 flex space-x-4">
      <a href="#" :aria-describedby="`tier-${title.toLowerCase()}`"
         class="block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold"
         :class="buttonClass">Like</a>
      <a href="#" :aria-describedby="`tier-${title.toLowerCase()}`"
         class="block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold bg-red-500 text-white hover:bg-red-400">Dislike</a>
    </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    title: String,
    price: String,
    priceUnit: { type: String, default: '/month' },
    description: String,
    features: Array,
    titleColor: { type: String, default: 'text-indigo-600' },
    iconColor: { type: String, default: 'text-indigo-600' },
    buttonClass: { type: String, default: 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300' },
  });
  </script>
  