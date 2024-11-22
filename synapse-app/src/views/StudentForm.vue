<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userId = ref<string | null>(null);
const projectId = route.params.projectId;

const maxNumber = ref<number | null>(null);
const projectTitle = ref('');
const skillList = ref<string[]>([]); // Array for skills
const skills = ref<string[]>([]); // Selected skills
const working_mode = ref<string>('');
const free_spots = ref<number>(-1);

// Reactive state for the selected value
const defaultSelectValue = ref<number | string>(''); // Group size
const preferredWorkingMode = ref<string>(''); // Preferred working mode

// Reactive state for toggling button colors
const skillButtonStates = ref<Record<string, boolean>>({}); // State to track skill button states

// Generate options from 0 to maxNumber
const numberOptions = computed(() => {
  if (maxNumber.value !== null) {
    return Array.from({ length: maxNumber.value + 1 }, (_, i) => i); // Create an array [0, 1, 2, ..., maxNumber]
  }
  return [];
});

// Options for preferred working mode
const workingModes = ['remotely', 'hybrid', 'in-person'];

// Toggle function for button color
const toggleSkillButtonColor = (skill: string) => {
  skillButtonStates.value[skill] = !skillButtonStates.value[skill];
  if (skillButtonStates.value[skill]) {
    skills.value.push(skill); // Add skill to selected list
  } else {
    const index = skills.value.indexOf(skill);
    if (index > -1) {
      skills.value.splice(index, 1); // Remove skill from selected list
    }
  }
};

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  userId.value = data.session?.user?.id || null;

  // // First, check if the project exists and is related to the user
  // const data2 = await supabase
  //   .from('users_projects')
  //   .select('*') // Select all relevant fields
  //   .eq('user_id', userId.value) // Ensure it's the logged-in user
  //   .eq('project_id', projectId) // Ensure it's the correct project
  //   .single(); // Fetch a single record (should only return one result)

  // console.log(data2?.data, "Project info");

  // Fetch project data when the component is mounted
  if (projectId) {
    try {
      const { data, error } = await supabase
        .from('projects') // Replace 'projects' with your actual table name
        .select('*') // Adjust the column names if needed
        .eq('id', projectId)
        .single(); // Fetch a single record

      if (error) {
        console.error('Error fetching project:', error);
        return;
      }

      if (data) {
        projectTitle.value = data.title; // Set the project title
        maxNumber.value = data.max_students; // Set the max number
        skillList.value = data.skill_list || []; // Set the skill list

        // Initialize the skill button states
        skillList.value.forEach((skill) => {
          skillButtonStates.value[skill] = false; // Set all to false (white background) initially
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }
});

async function updateStudentSkills(event: Event) {
  event.preventDefault(); // Prevent default form submission (page reload)

  try {
    const { data, error } = await supabase
      .from('users_projects')
      .upsert([{
        user_id: userId.value,
        project_id: projectId,
        free_spots: free_spots.value,
        working_mode: working_mode.value,
        skills_list: skills.value,
      }])
      .eq('user_id', userId.value) // Ensure we're updating the right user's project
      .eq('project_id', projectId); // Ensure it's the correct project

    if (error) {
      console.error('Error updating project:', error);
    } else {
      console.log('Project updated successfully');
      router.push(`/groups/${projectId}`);
    }
  } catch (error) {
    console.error('Error updating project:', error.message);
  }
  
}
</script>

<template>
  <section class="bg-gray-1 py-30 lg:py-20">
    <div class="container mx-auto mt-[10px]">
      <!-- Display the project title -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 ">
          {{ projectTitle || 'Loading...' }}
        </h1>
        <p v-if="maxNumber !== null" class="text-gray-600 ">
          Max number of students in a group: {{ maxNumber }}
        </p>
      </div>

      <div class="flex flex-wrap -mx-7">
        <div class="w-full px-4">
          <div class="relative mx-auto max-w-[550px] overflow-hidden rounded-lg bg-white py-10 px-10 text-center sm:px-12 md:px-[60px] dark:bg-dark-2">
            <form @submit="updateStudentSkills">
              <!-- Group Size Selection -->
              <div class="mb-12 flex items-center justify-between">
                <label for="group-select" class="mr-4 text-base font-medium text-dark ">
                  I am looking for a group with
                </label>
                <div class="relative z-20 flex-1 ml-[-30px] group">
                  <select
                    id="group-select"
                    v-model="free_spots"
                    class="relative z-20 w-1/3 appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-[6px] px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  >
                    <option v-for="number in numberOptions" :key="number" :value="number">
                      {{ number }}
                    </option>
                  </select>
                  <span class="ml-2 text-base font-medium text-dark ">free spots</span>
                </div>
              </div>

              <!-- Working Mode Selection -->
              <div class="mb-12 flex items-center justify-between">
                <label for="working-mode" class="mr-4 text-base font-medium text-dark ">
                  I prefer working
                </label>
                <div class="relative z-20 flex-1 ml-[-30px]">
                  <select
                    id="working-mode"
                    v-model="working_mode"
                    class="relative z-20 w-1/3 appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-[6px] px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  >
                    <option v-for="mode in workingModes" :key="mode" :value="mode">
                      {{ mode }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Skill Buttons Section -->
              <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-800  mb-4">Select your skills:</h2>
                <div class="flex flex-wrap gap-2 justify-center">
                  <button
                    v-for="skill in skillList"
                    :key="skill"
                    @click="toggleSkillButtonColor(skill)"
                    :class="[ 
                      'py-2 px-4 border rounded-full transition duration-300', 
                      skillButtonStates[skill] ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'
                    ]"
                    type="button"
                  >
                    {{ skill }}
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center mt-6">
                <button
                  class="bg-indigo-800 border-indigo-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
                  type="submit"
                >
                  Find a group!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
