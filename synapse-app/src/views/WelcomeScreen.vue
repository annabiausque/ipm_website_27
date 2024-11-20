<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';


const email = ref('');
const user = ref('');
const router = useRouter();

const getDataAndRoute = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return;
    }
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData?.user?.id);
    user.value = data[0];
    console.log(user.value);

    if (!user.value.show_onboarding) {
        router.push({ name: 'MyProjects' });
    }
};

onMounted(getDataAndRoute);

async function setOnboarding() {

    const { error } = await supabase
        .from('profiles')
        .update({

            show_onboarding: false
        }).eq('id', user.value.id);
    if (error) {
        console.error('Error updating onboarding:', error);
    } else {
        console.log('Onboarding successfully updated');
    }
    getDataAndRoute();
}
</script>
<template>
    <div v-if="user.show_onboarding" class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white rounded-3xl w-4/5 h-auto shadow-lg p-8 text-center">
            <div class="flex items-center justify-center">
                <img src="../assets/logo_indigo.png" class="w-20 h-20">
                <span class="ml-8 text-6xl font-semibold text-gray-700">Synapse</span>
            </div>
            <div class="mt-12 uppercase space-y-4 text-center w-1/4   place-self-center">
                <div class="bg-indigo-200 text-xl text-gray-700  rounded-xl">
                    Match
                </div>
                <div class="bg-indigo-200 text-xl text-gray-700 rounded-xl">
                    Develop
                </div>
                <div class="bg-indigo-200 text-xl text-gray-700 rounded-xl">
                    Succeed
                </div>
            </div>
            <button @click="setOnboarding"
                class="mt-16 bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700">
                Get started
            </button>
        </div>
    </div>

</template>
