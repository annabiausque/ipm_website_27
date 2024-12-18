<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient';
import { useRouter, useRoute } from 'vue-router';
import { useSnackbar } from "vue3-snackbar";
const snackbar = useSnackbar();
const router = useRouter();
const route = useRoute();
interface FAQ {
  id: number
  header: string
  text: string
}

const faq: FAQ = {
  id: 1,
  header: "How to get the code?",
  text: "To join the project, ask your teacher for the code."
}

const activeFaq = ref<number | null>(null)
const codeInput = ref<string>('')
const codeError = ref<string | null>(null)

// Get the short_code from the URL parameter
onMounted(() => {
  const shortCode = route.query.short_code as string | undefined;
  if (shortCode) {
    codeInput.value = shortCode;
  }
});



const handleToggle = () => {
  activeFaq.value = activeFaq.value === faq.id ? null : faq.id
}

const handleQuestionClick = (event: MouseEvent) => {
  event.preventDefault(); // Prevent any default action if needed
  // No action, just prevent the default behavior (like navigation)
}

const transformToUppercase = (event: Event) => {
  const target = event.target as HTMLInputElement;
  codeInput.value = target.value.toUpperCase();
}

const verifyCode = () => {
  const codeFormat = /^[A-Z]{2}\d{2}[A-Z]$/;
  if (codeFormat.test(codeInput.value)) {
    codeError.value = null;
    return true;
  } else {
    codeError.value = 'Code is invalid. It should be in the format: two letters, two digits, and a letter (e.g., AB12C)';
    return false;
  }
}

const signUserToProject = async () => {
  if (!verifyCode()) {
    return;
  }
  let project_id: string = "";
  
  // Sprawdzenie projektu
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('short_code', codeInput.value);
  
  if (projectError || !projectData || projectData.length === 0) {
    console.error('No project found with the provided code.');
    snackbar.add({ type: 'error', text: 'No project found with the provided code.' });
    return;
  }
  
  project_id = projectData[0].id;
  
  // Pobranie użytkownika
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user?.id) {
    console.error('Error fetching user:', userError);
    return;
  }
  
  const userId = userData.user.id;
  
  // Sprawdzenie, czy użytkownik jest już przypisany do projektu
  const { data: existingAssignment, error: assignmentError } = await supabase
    .from('users_projects')
    .select('*')
    .eq('project_id', project_id)
    .eq('user_id', userId);
  
  if (assignmentError) {
    console.error('Error checking assignment:', assignmentError);
    snackbar.add({ type: 'error', text: 'Error verifying your project assignment.' });
    return;
  }
  
  if (existingAssignment && existingAssignment.length > 0) {
    snackbar.add({ type: 'warning', text: 'You are already assigned to this project.' });
    router.push({ name: 'Code' });
    return;
  }
  
  // Dodanie użytkownika do projektu
  const { error: insertError } = await supabase
    .from('users_projects')
    .insert({ project_id: project_id, user_id: userId });
  
  if (insertError) {
    console.error('Error signing user to project:', insertError);
    snackbar.add({ type: 'error', text: 'Failed to join the project. Please try again later.' });
  } else {
    console.log("User signed to project");
    snackbar.add({ type: 'success', text: 'You have successfully joined the project.' });
    router.push({ name: 'StudentForm', params: { projectId: project_id } });
  }
}
</script>

<template>
  <!-- ====== Forms Section Start -->
  <section class="bg-gray-1 dark:bg-dark py-30 lg:py-20">
    <div class="container mx-auto mt-[10px]"> <!-- Added negative margin to move window up -->
      <div class="flex flex-wrap -mx-7">

        <div class="w-full px-4">

          <div
            class="relative mx-auto max-w-[550px] overflow-hidden rounded-lg bg-white py-10 px-10 text-center sm:px-12 md:px-[60px] dark:bg-dark-2">
            <form>
              <!-- Synapse Section -->
              <div class="flex items-center justify-center mb-6"> <!-- Added mb-6 for margin-bottom -->
                <img src="../assets/logo_indigo.png" class="w-16 h-16">
                <span class="ml-4 text-2xl font-semibold text-gray-700">Synapse</span>
              </div>

              <!-- Input Section -->
              <div class="mb-2">
                <input v-model="codeInput" type="text" placeholder="Provide the code to join the project :)"
                  @input="transformToUppercase" @keydown.enter.prevent="signUserToProject"
                  class="w-full px-5 py-3 text-base bg-transparent border rounded-md outline-none border-stroke text-body-color dark:border-dark-3 focus:border-primary focus-visible:shadow-none text-center" />
              </div>
              <div v-if="codeError" class="text-left text-red-500 text-sm mt-1">{{ codeError }}</div>

              <!-- Buttons Section (Submit + ? button) -->
              <div class="mt-12 flex items-center justify-start space-x-4">
                <!-- Submit Button -->
                <a @click="signUserToProject"
                  class="bg-indigo-800 border-indigo-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500">
                  Submit
                </a>

                <!-- ? Button -->
                <span class="group relative inline-block">
                  <button type="button"
                    class="bg-primary inline-flex rounded py-2 px-[13px] text-base font-medium text-grey-800"
                    @click="handleQuestionClick">
                    ?
                  </button>
                  <div
                    class="text-dark dark:text-black shadow-1 dark:shadow-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-[5px] bg-gray-300 dark:bg-dark-2 py-1.5 px-3.5 text-sm opacity-0 group-hover:opacity-100">
                    <span
                      class="absolute -left-1 top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-300 dark:bg-dark-2"></span>
                    You need to ask your teacher for the code.
                  </div>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>