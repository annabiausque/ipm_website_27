<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useSidebar } from '../composables/useSidebar'

const { isOpen } = useSidebar()

const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
)
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
)

const isTeacher = ref(false) // Détermine si l'utilisateur est un enseignant

async function checkIfTeacher() {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id

  if (userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_teacher')
      .eq('id', userId)
      .single() // Récupère une seule ligne

    if (error) {
      console.error('Erreur lors de la récupération des informations du profil :', error)
      return
    }

    isTeacher.value = data?.is_teacher || false
  }
}

onMounted(() => {
  checkIfTeacher()
})
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden" @click="isOpen = false" />
    <!-- Sidebar -->
    <div :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0">
      <router-link to="/my-projects" class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <img src="../assets/logo.png" class="w-16 h-16">
          <span class="mx-2 text-2xl font-semibold text-white">Synapse</span>
        </div>
      </router-link>

      <nav class="mt-10">
        <!-- My Projects -->
        <router-link class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'MyProjects' ? activeClass : inactiveClass]" to="/my-projects">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z"
              fill="currentColor" />
            <path
              d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z"
              fill="currentColor" />
            <path
              d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z"
              fill="currentColor" />
            <path
              d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.89543 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z"
              fill="currentColor" />
          </svg>
          <span class="mx-4">My projects</span>
        </router-link>

        <!-- What's Synapse -->
        <router-link class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Tables' ? activeClass : inactiveClass]" to="/tables">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H7Z"
              fill="currentColor" />
            <path
              d="M4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H5C4.44772 8 4 7.55228 4 7Z"
              fill="currentColor" />
            <path
              d="M2 11C2 9.89543 2.89543 9 4 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V11Z"
              fill="currentColor" />
          </svg>
          <span class="mx-4">What's Synapse ?</span>
        </router-link>

        <!-- Create a new project -->
        <router-link
          v-if="isTeacher"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Forms' ? activeClass : inactiveClass]"
          to="/forms"
        >
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H7Z"
              fill="currentColor" />
            <path
              d="M4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H5C4.44772 8 4 7.55228 4 7Z"
              fill="currentColor" />
            <path
              d="M2 11C2 9.89543 2.89543 9 4 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V11Z"
              fill="currentColor" />
          </svg>
          <span class="mx-4">Create a new project</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>
