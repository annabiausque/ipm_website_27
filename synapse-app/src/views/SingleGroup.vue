<script lang="js">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import { useSnackbar } from "vue3-snackbar";

export default {
  name: "SingleGroup",
  setup() {
    const route = useRoute();
    const groupId = route.params.id;
    const groupData = ref(null);
    const loading = ref(true);
    const usernames = ref([]); 
    const projectId = ref(null);
    const skillsList = ref([]);
    const projectData = ref(null);
    const members = ref([]); 
    const snackbar = useSnackbar();
    const isOpen = ref(false);

    const openMenuIndex = ref(null);

    const toggleMenu = (index) => {
      openMenuIndex.value = openMenuIndex.value === index ? null : index;
    };

    const isMenuOpen = (index) => openMenuIndex.value === index;

    const fetchGroupData = async (groupId) => {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .eq("id", groupId);

        if (error) {
          console.error("Erreur Supabase:", error.message);
          return null;
        }

        if (!data || data.length === 0) {
          console.warn("Aucun groupe trouvé avec cet ID.");
          return null;
        }

        return data[0];
      } catch (error) {
        console.error("Erreur inattendue:", error.message);
        return null;
      }
    };
    

    const fetchGroupSkills = async (groupId, projectId) => {
      try {
        const { data, error } = await supabase
          .from("users_groups")
          .select("user_id")
          .eq("group_id", groupId)
          .eq("project_id", projectId);

        if (error) {
          console.error("Error Supabase:", error.message);
          return [];
        }

        if (!data || data.length === 0) {
          console.warn("No member found.");
          return [];
        }

        members.value = await Promise.all(
          data.map(async (member) => {
            const { user_id } = member;
            const { data: userProfile, error: profileError } = await supabase
              .from("profiles")
              .select("username")
              .eq("id", user_id)
              .single();

            if (profileError) {
              console.error(
                `Erreur lors de la récupération du username pour l'utilisateur ${user_id}:`,
                profileError.message
              );
              return { user_id, username: "Utilisateur inconnu" };
            }

            return { user_id, username: userProfile.username };
          })
        );

        let allSkills = [];

        for (const member of members.value) {
          const { user_id } = member;

          const { data: userSkills, error: skillsError } = await supabase
            .from("users_projects")
            .select("skills_list")
            .eq("user_id", user_id)
            .eq("project_id", projectId);

          if (skillsError) {
            console.error(
              `Erreur lors de la récupération des compétences pour l'utilisateur ${user_id}:`,
              skillsError.message
            );
            continue;
          }

          if (userSkills && userSkills.length > 0 && userSkills[0].skills_list) {
            allSkills = allSkills.concat(userSkills[0].skills_list);
          }
        }

        skillsList.value = [...new Set(allSkills)];
      } catch (error) {
        console.error("Erreur inattendue:", error.message);
        return [];
      }
    };

 
    const fetchProjectData = async (projectId) => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId);

        if (error) {
          console.error("Erreur Supabase:", error.message);
          return null;
        }

        if (!data || data.length === 0) {
          console.warn("Aucun projet trouvé avec cet ID.");
          return null;
        }

        return data[0];
      } catch (error) {
        console.error("Erreur inattendue:", error.message);
        return null;
      }
    };

   
    onMounted(async () => {
      try {
        groupData.value = await fetchGroupData(groupId);

        if (groupData.value) {
          projectId.value = groupData.value.project_id;

          await fetchGroupSkills(groupId, projectId.value);


          projectData.value = await fetchProjectData(projectId.value);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données du groupe :", error.message);
      } finally {
        loading.value = false;
      }
    });

    return {
      groupData,
      loading,
      usernames,
      skillsList,
      projectData,
      members,
      toggleMenu,
      isMenuOpen,
    };
  },
};
</script>


<template>
  <div class="bg-gray-50 py-24 sm:py-32">
    <div class="w-full h-full px-6 lg:max-w-7xl lg:px-8">
   
      <div v-if="loading" class="text-center py-12">
              <p class="text-gray-500 text-lg">Loading...</p>
            </div>
            <div v-else-if="groupData" class="p-8">
              <h2 class="text-center text-base/7 font-semibold text-indigo-600">{{projectData.title}}</h2>
              <p class="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
     {{ groupData.name }}
      </p>
            </div>
     
      <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
        <div class="relative lg:row-span-1">
          <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
          <div
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]"
          >
            
          <div class="px-8 pt-8 sm:px-10 sm:pt-10">
            <div v-if="loading" >
              <p class="text-gray-500 text-lg">Loading...</p>
            </div>
            
            <div v-else-if="groupData">
            <h3 class="text-lg font-medium text-gray-800">Group members</h3>
            <ul>
           
              <li v-for="(member, index) in members" :key="index" class="py-2 relative">
  <div class="flex items-center gap-x-2">
   
    <div class="relative">
  <button
    type="button"
    class="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900"
    @click="toggleMenu(index)"
    :aria-expanded="isMenuOpen(index)"
  >
    <span>{{ member.username }}</span>
    <svg
      class="size-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  <transition name="dropdown">
    <div
      v-if="isMenuOpen(index)"
      class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white z-50"
    >
      <div class="group relative flex gap-x-6 rounded-lg p-2 hover:bg-gray-50">
        <div>
          <a href="#" class="text-gray-900">email@email.com</a>
        </div>
      </div>
    </div>
  </transition>
</div>


    
  </div>
</li>


            </ul>

            <h3 class="mt-4 text-lg font-medium text-gray-800">Skills</h3>
            <ul>
              <li v-for="(skill, index) in skillsList" :key="index" class="py-2">
                <span class="text-gray-600">{{ skill }}</span>
              </li>
            </ul>
          </div>

            <div v-else class="text-center py-12">
              <p class="text-gray-500 text-lg">Aucun groupe trouvé.</p>
            </div>
          </div>
          </div>
          <div
            class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"
          ></div>
        </div>
        <div class="relative max-lg:row-start-1">
          <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
          <div
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]"
          >
            <div class="px-8 pt-8 sm:px-10 sm:pt-10">
              <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                Progress
              </p>
            </div>
            <div class="flex h-full items-center justify-center px-8 pt-8 sm:px-10 sm:pt-10">
              <div class="relative w-40 h-40 flex items-center justify-center">
                <svg
                  class="absolute inset-0 w-full h-full -rotate-90"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    class="stroke-current text-gray-200"
                    stroke-width="2"
                  ></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    class="stroke-current text-blue-600"
                    stroke-width="2"
                    stroke-dasharray="100"
                    stroke-dashoffset="65"
                    stroke-linecap="round"
                  ></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-center text-2xl font-bold text-blue-600">35%</span>
                </div>
              </div>
             
        
            </div>
            <div class="px-8 pt-8 sm:px-10 sm:pt-10">
              <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                List of tasks
              </p>

    <!---->
              <div class="!z-5 relative  rounded-[20px] max-w-[300px] bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !px-4 !pb-8 !pt-5 xl:p-![18px] bg-gray-500 mb-5">
                 
                <div class="mt-5 flex items-center justify-between p-2">
                    <div class="flex items-center justify-center gap-2">
                      <input
                            type="checkbox"
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-md border border-gray-800 hover:cursor-pointer outline-none transition duration-[0.5s] checked:text-black checked:border-none dark:border-white/10"
                            name="weekly" 
                        />
                        <p class="text-base font-bold text-navy-700 dark:text-white">
                        Landing Page Design
                        </p>
                    </div>
                    
                </div>

                <div class="mt-2 flex items-center justify-between p-2">
                    <div class="flex items-center justify-center gap-2">
                      <input
                            type="checkbox"
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-md border border-gray-800 hover:cursor-pointer outline-none transition duration-[0.5s] checked:text-black checked:border-none dark:border-white/10"
                            name="weekly" 
                        />
                        <p class="text-base font-bold text-navy-700 dark:text-white">
                        Mobile App Design
                        </p>
                    </div>
                 
                </div>

                <div class="mt-2 flex items-center justify-between p-2">
                    <div class="flex items-center justify-center gap-2">
                      <input
                            type="checkbox"
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-md border border-gray-800 hover:cursor-pointer outline-none transition duration-[0.5s] checked:text-black checked:border-none dark:border-white/10"
                            name="weekly" 
                        />
                        <p class="text-base font-bold text-navy-700 dark:text-white">
                        Dashboard Builder
                        </p>
                    </div>
                 
                </div>

                <div class="mt-2 flex items-center justify-between p-2">
                    <div class="flex items-center justify-center gap-2">
                      <input
                            type="checkbox"
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-md border border-gray-800 hover:cursor-pointer outline-none transition duration-[0.5s] checked:text-black checked:border-none dark:border-white/10"
                            name="weekly" 
                        />
                        <p class="text-base font-bold text-navy-700 dark:text-white">
                        Landing Page Design
                        </p>
                    </div>
                
                </div>

                <div class="mt-2 flex items-center justify-between p-2">
                    <div class="flex items-center justify-center gap-2">
                      <input
                            type="checkbox"
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-md border border-gray-800 hover:cursor-pointer outline-none transition duration-[0.5s] checked:text-black checked:border-none dark:border-white/10"
                            name="weekly" 
                        />
                        <p class="text-base font-bold text-navy-700 dark:text-white">
                        Dashboard Builder
                        </p>
                      </div>
                  </div>
                </div>
              
              </div>
            </div>
          
            <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
         
        </div>
        <div class="relative lg:row-span-1">
          <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          <div
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]"
          >
            <div class="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
              <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                Ressources
              </p>
              <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem
                sodales gravida.
              </p>

              <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                Completed assignements
              </p>
              <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem
                sodales gravida.
              </p>
            </div>
          </div>
          <div
            class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease-out;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Classe pour la gestion de la superposition */
.z-50 {
  z-index: 50;
}
</style>


