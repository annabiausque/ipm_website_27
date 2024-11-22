<script lang="js">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import { defineComponent } from "vue";



export default {
  name: "SingleGroup",
  setup() {
    const route = useRoute();
    const groupId = route.params.id;
    const groupData = ref(null);
    const loading = ref(true);
    const userID = ref(null);
    

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

    const fetchGroupMembers = async (groupId) => {
      try {
        const { data, error } = await supabase
          .from("users_groups")
          .select("user_id")
          .eq("group_id", groupId);

        if (error) {
          console.error("Erreur Supabase:", error.message);
          return [];
        }

        return data.map((item) => item.user_id);
      } catch (error) {
        console.error("Erreur inattendue:", error.message);
        return [];
      }
    };

    const fetchUsernameFromID = async(userID) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", userID);

        if (error) {
          console.error("Erreur Supabase:", error.message);
          return null;
        }

        if (!data || data.length === 0) {
          console.warn("Aucun utilisateur trouvé avec cet ID.");
          return null;
        }

        return data[0];
      } catch (error) {
        console.error("Erreur inattendue:", error.message);
        return null;
      }
    }

    const loadGroupUsernames = async () => {
      try {
        // Étape 1 : Récupérer les user_id
        const userIds = await fetchGroupMembers(groupId);

        // Étape 2 : Récupérer les usernames pour chaque user_id
        const promises = userIds.map((id) => fetchUsernameFromID(id));
        const results = await Promise.all(promises);

        // Filtrer les résultats non valides (null ou undefined)
        usernames.value = results.filter((username) => username !== null).map((user) => user.username);
      } catch (error) {
        console.error("Erreur lors du chargement des usernames :", error.message);
      } finally {
        loading.value = false; // Fin du chargement
      }
    };

    onMounted(async () => {
      console.log("Group ID:", groupId);
      groupData.value = await fetchGroupData(groupId);
      loading.value = false;
      loadGroupUsernames();

    });

    return { groupData, loading };
  },
};
</script>

<template>
  <div class="bg-gray-50 py-24 sm:py-32">
    <div class="w-full h-full px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-center text-base/7 font-semibold text-indigo-600">Project name</h2>
      <div v-if="loading" class="text-center py-12">
              <p class="text-gray-500 text-lg">Loading...</p>
            </div>
            <div v-else-if="groupData" class="p-8">
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
            
            <div v-else-if="groupData" >
              <h3 class="text-lg font-medium text-gray-800">Group members </h3>
             <li v-for="(username, index) in usernames" :key="index" class="py-2">
        <span class="text-gray-800">{{ username }}</span>
      </li>
              <h3 class="mt-4 text-lg font-medium text-gray-800">Skills </h3>
              <p class="mt-2 text-gray-600">{{ (groupData.skills_list || []).join(", ") }}</p>
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

    
            <div class="!z-5 relative  rounded-[20px] max-w-[300px] bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined">
                 
          
 
                <div class="mt-5 flex items-center justify-between p-2">
                    <div class="flex items-center justify-center gap-2">
                      <input
                            type="checkbox"
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
                            justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
                            checked:border-none checked:text-white hover:cursor-pointer dark:border-white/10 checked:bg-brand-500 dark:checked:bg-brand-400"
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
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
                            justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
                            checked:border-none checked:text-white hover:cursor-pointer dark:border-white/10 checked:bg-brand-500 dark:checked:bg-brand-400"
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
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
                            justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
                            checked:border-none checked:text-white hover:cursor-pointer dark:border-white/10 checked:bg-brand-500 dark:checked:bg-brand-400"
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
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
                            justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
                            checked:border-none checked:text-white hover:cursor-pointer dark:border-white/10 checked:bg-brand-500 dark:checked:bg-brand-400"
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
                            class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
                            justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
                            checked:border-none checked:text-white hover:cursor-pointer dark:border-white/10 checked:bg-brand-500 dark:checked:bg-brand-400"
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
          <div
            class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"
          ></div>
         
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
/* Ajoutez des styles spécifiques ici si nécessaire */
</style>


<style scoped>
/* Ajoutez des styles spécifiques ici si nécessaire */
</style>
