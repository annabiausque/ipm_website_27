<script setup lang="js">
import { onMounted, ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const dropdownOpen = ref(false)
const { isOpen } = useSidebar()
const router = useRouter()
let user = ref('')
const logout = async () => {
  console.log('logout');
  const { error } = await supabase.auth.signOut();
  if (!error) {
    router.push('/')
  } else {
    console.error(error.message);
  }
}
let userId = ref('')
onMounted(async () => {
  const user_db = await supabase.auth.getUser()
  user.value = user_db.data.user.user_metadata;
  console.log('user', user.value);

  userId.value = user.value.sub
  console.log('User ID:', userId.value)

})

const profile = () => {
  console.log('Profile')
  if (userId.value) {
    router.push(`/profile/${userId.value}`)
  } else {
    console.error('User ID is not available')
  }
}

</script>

<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
    <div class="flex items-center">
      <button class="text-gray-500 focus:outline-none lg:hidden" @click="isOpen = true">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>


    </div>

    <div class="flex items-center">
     

      <div class="relative">
        <button class="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none"
          @click="dropdownOpen = !dropdownOpen">
          <img :src="`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.sub}&radius=50&randomizeIds=true`">
        </button>

        <div v-show="dropdownOpen" class="fixed inset-0 z-10 w-full h-full" @click="dropdownOpen = false" />

        <transition enter-active-class="transition duration-150 ease-out transform"
          enter-from-class="scale-95 opacity-0" enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in transform" leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0">
          <div v-show="dropdownOpen" class="absolute right-0 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
            <div class="block px-4 text-xl text-gray-700">
              Hello, <span class="font-semibold"> {{ user.username }} </span>
            </div>
            <div class="block px-4 text-xs text-gray-700">
              You are a
              <span
                class="text-transparent text-xs font-semibold bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                {{ user.isTeacher ? "Teacher" : "Student" }}
              </span>
            </div>
            <hr class="border-t my-2 mb-6 border-gray-300 ">

            <div @click="profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
              Profile</div>
            <div @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
              Log out
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>
