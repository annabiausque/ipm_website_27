<template>
    <header class="sticky top-0 bg-primary-background shadow-lg">
      <nav
        class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6"
      >
        <RouterLink :to="{ name: 'home' }" class="flex-1">
          <div class="flex items-center gap-3">
            <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 sm:h-12 sm:w-12" />
            <p class="text-2xl flex-1 text-center">Synapse</p>
          </div>
        </RouterLink>
  
        <div class="flex gap-3 flex-1 justify-end">
            <i class="fa-regular fa-user hover:text-primary-hover duration-150 cursor-pointer text-2xl"></i>
               <i class="fa-solid fa-bars hover:text-primary-hover duration-150 cursor-pointer text-2xl"></i>
          </div>

        
      </nav>
    </header>
  </template>
  
  <script setup>
  import { RouterLink } from "vue-router";
  </script>