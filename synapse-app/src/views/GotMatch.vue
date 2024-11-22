<template>
  <div>
    <div class="h-screen w-full bg-[linear-gradient(0deg,_rgba(172,46,209,0.5)_50%,_rgba(217,39,39,0.5)_120%)] rounded-xl py-10">
      <h1 class="text-4xl text-white text-center font-bold py-10">You got a match!</h1>

      <div class="flex justify-center items-center mt-20">
        <div class="card relative rounded-lg w-80 h-96 overflow-auto">
          <div class="max-w-sm bg-[rgba(0,0,0,0)] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img class="rounded-t-lg" src="../assets/logo_indigo.png" alt="Group Avatar" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {{ groupData?.name || "Loading..." }}
              </h5>
              <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                Group members: {{ groupData?.members || "No members yet" }}
              </p>
              <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                Skills: {{ groupData?.skills_list?.join(", ") || "No skills listed" }}
              </p>
              <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                Preferences: {{ groupData?.preferences || "No preferences listed" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center mt-20">
        <router-link :to="`/singlegroup/${groupID}`">
          <button
            class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-lg text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
          >
            View my group
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

export default {
  setup() {
    const route = useRoute();
    const groupID = route.params.groupId; 
    const groupData = ref(null); 


    const getGroupData = async () => {
      try {
        const { data, error } = await supabase.from("groups").select("*").eq("id", groupID).single();

        if (error) {
          console.error("Error fetching group data:", error.message);
        } else {
          groupData.value = data;
          console.log("Group data fetched:", data);
        }
      } catch (err) {
        console.error("Unexpected error fetching group data:", err.message);
      }
    };

    onMounted(() => {
      getGroupData(); 
    });

    return {
      groupID,
      groupData,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
