<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const emailSent = ref(false);
const isUpdate = ref(route.query.action === 'passwordUpdate');
//console.log('isUpdate', isUpdate);

onMounted(() => {
  console.log('isUpdate', isUpdate);
});

const passwordReset = async () => {
  loading.value = true;
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: window.location.href + '?action=passwordUpdate',
  });
  emailSent.value = true;
  loading.value = false;
  if (error) {
    console.error(error.message);
  }
};

const updatePassword = async () => {
  loading.value = true;
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });
  loading.value = false;
  if (error) {
    console.error(error.message);
  } else {
    router.push('/');
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

      <form v-if="!emailSent && !isUpdate" class="mt-4" @submit.prevent="passwordReset">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input v-model="email" type="email"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>
        <button type="submit"
          class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
          Send reset link
        </button>
      </form>

      <form v-if="emailSent && !isUpdate" class="mt-4">
        <label class="block">
          <p class="text-sm text-gray-700 mb-4">An email has been sent to your inbox with a link to reset your password.
          </p>
        </label>
        <RouterLink to="/"><button
            class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
            Go to login page
          </button>
        </RouterLink>
      </form>

      <form v-if="!emailSent && isUpdate" class="mt-4" @submit.prevent="updatePassword">
        <label class="block">
          <span class="text-sm text-gray-700">New Password</span>
          <input v-model="password" type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>
        <button type="submit"
          class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
          Update Password
        </button>
      </form>
    </div>
  </div>
</template>