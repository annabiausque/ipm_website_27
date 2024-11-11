<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();

const loading = ref(false);
const email = ref('');
const password = ref('');

const login = async () => {
  console.log('login');
  loading.value = true;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
console.log('data', data)
  loading.value = false;
  if (!error) {
    router.push('/dashboard');
  } else {
    console.error(error.message);
  }
};

</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/logo_indigo.png" class="w-16 h-16">
        <span class="ml-4 text-2xl font-semibold text-gray-700">Synapse</span>
      </div>

      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input v-model="email" type="email"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>
        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input v-model="password" type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <div class="flex items-center justify-between mt-4">
          <!-- <div>
            <label class="inline-flex items-center">
              <input type="checkbox"
                class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div> -->

          <RouterLink to="/reset-password" class="block text-sm text-indigo-700 fontme hover:underline">
            Forgot your password?
          </RouterLink>
        </div>
        <button type="submit"
          class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
          Login
        </button>
      </form>
      <p class="mt-12 text-xs text-gray-700">
        Don't have an account yet?
        <RouterLink to="/register" class="text-indigo-700 hover:underline">
          Register
        </RouterLink>
      </p>
    </div>
  </div>
</template>