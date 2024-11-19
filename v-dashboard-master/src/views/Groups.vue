<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();

const email = ref('');
const loading = ref(false);
const groups = ref([1, 2, 3, 4]);

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
</script>

<template>
    <div class="flex">
        <span class="ml-4 text-4xl font-semibold text-gray-700">Choose your group</span>
    </div>
    <div class="items-center justify-items-center justify-center">

        <div v-for="group in groups" :key="group.id"
            class="hover:bg-gray-50 mt-10 bg-white rounded-2xl shadow-md w-1/3 overflow-hidden ">
            <div class="p-8 ">
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Group {{ group }}</div>
                <div class="flex mt-4 space-x-4 justify-center">
                    <img src="https://via.placeholder.com/50" alt="Avatar 1" class="w-12 h-12 rounded-full">
                    <img src="https://via.placeholder.com/50" alt="Avatar 2" class="w-12 h-12 rounded-full">
                    <img src="https://via.placeholder.com/50" alt="Avatar 3" class="w-12 h-12 rounded-full">
                    <img src="https://via.placeholder.com/50" alt="Avatar 4" class="w-12 h-12 rounded-full">
                </div>
            </div>
        </div>

    </div>

</template>