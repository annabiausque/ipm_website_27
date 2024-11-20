<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();

const email = ref('');
const loading = ref(false);
const groups = ref([1, 2, 3, 4]);


onMounted(async () => {

});
</script>

<template>
    <div class="flex">
        <span class="ml-4 text-4xl font-semibold text-gray-700">Choose your group</span>
    </div>
    <div class="items-center justify-items-center justify-center">

        <div v-for="group in groups" :key="group.id"
            class="hover:bg-gray-50 mt-10 bg-white shadow-md overflow-hidden rounded-3xl">
            <div class="p-8">
                <div class="uppercase tracking-wide text-l text-indigo-500 font-semibold">Group {{ group }}</div>
                <div class="flex mt-4 space-x-5 justify-center overflow-x-hidden">

                    <img src="https://via.placeholder.com/50" alt="Avatar 1" class="w-12 h-12 rounded-full">
                    <img src="https://via.placeholder.com/50" alt="Avatar 2" class="w-12 h-12 rounded-full">
                    <img src="https://via.placeholder.com/50" alt="Avatar 3" class="w-12 h-12 rounded-full">
                    <img src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=User1&radius=50&randomizeIds=true"
                        class="w-12 h-12 min-h-12 min-w-12 rounded-full border-2 border-gray-300 ">
                    <div draggable="false"
                        class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2 border-gray-300 border-dotted flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100">
                        +
                    </div>
                </div>
            </div>
        </div>


    </div>

</template>