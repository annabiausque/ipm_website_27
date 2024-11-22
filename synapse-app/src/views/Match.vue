<template>
  <div class="flex flex-col w-full h-full items-center justify-center flex-grow">
    <div class="stack-container relative w-80 h-96 mb-8">
      <Swipeable
        class="card absolute rounded-lg border border-gray-400 w-80 h-96 overflow-y-auto"
        v-for="(card, index) in stack"
        :key="card.id"
        :style="{ zIndex: stack.length - index, top: `${index * 5}px` }"
        v-on:swipe="onSwipe"
      >
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <img class="rounded-t-lg" src="../assets/logo_indigo.png" alt="Group Avatar" />
          <div class="p-5">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {{ card.name }}
              </h5>
            </a>
            <a href="#members" id="members">
              <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                Group members
              </p>
            </a>
            <a href="#">
              <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                Skills: {{ (card.skills_list || []).join(", ") }}
              </p>
            </a>
            <a href="#">
              <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                Preferences
              </p>
            </a>
          </div>
        </div>
      </Swipeable>
    </div>
    <div class="flex items-center justify-center w-full h-20 space-x-4 pb-5">
      <div
        class="bg-white rounded-full h-16 w-16 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-red-400 transition duration-200"
        @click="onClick('swipe-left')"
      >
        <img src="../assets/xmark-solid.svg" class="w-2/3 h-2/3" alt="X icon" />
      </div>
      <div
        class="bg-white rounded-full h-12 w-12 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-blue-300 transition duration-200"
        @click="scrollToAnchor('members')"
      >
        <i class="fa fa-info text-blue-500 text-xl" aria-hidden="true"></i>
      </div>
      <div
        class="bg-white rounded-full h-16 w-16 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-green-400 transition duration-200"
        @click="onClick('swipe-right')"
      >
        <img src="../assets/heart-regular.svg" class="w-2/3 h-2/3" alt="Heart icon" />
      </div>
    </div>
  </div>
</template>
<script lang="js">
import { Swipeable } from "vue-swipy";
import { supabase } from "../lib/supabaseClient";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Match",
  components: { Swipeable },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const stack = ref([]);
    const noGroupsLeft = ref(false);
    const projectId = route.params.projectId;
    const currentIndex = ref(0);
    const matchId = ref("");

    const onSwipe = async (direction) => {
      const currentCard = stack.value[currentIndex.value];

      if (!currentCard) {
        noGroupsLeft.value = true;
        return;
      }

      if (direction === "swipe-right") {
        matchId.value = currentCard.id;

  
        createHeartEffect();

        console.log(currentCard.id)

     
        router.push({
          name: "GotMatch",
          params: {
            projectId: projectId,
            groupId: currentCard.id,
          },
        });
      }

   
      currentIndex.value++;
      setTimeout(() => {
        stack.value.shift();
        noGroupsLeft.value = stack.value.length === 0;
      }, 300);
    };

    const createHeartEffect = () => {
      const heartCount = 20;
      for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
        heart.innerText = "💗";
        document.body.appendChild(heart);
        setTimeout(() => {
          heart.remove();
        }, 5000);
      }

      document.body.style.backgroundColor = "pink";
      setTimeout(() => {
        document.body.style.backgroundColor = "";
      }, 500);
    };

    const addUserToGroup = async (groupId) => {
      try {
        const { error } = await supabase
          .from("users_groups")
          .insert([{ group_id: groupId, user_id: route.params.userId }]);

        if (error) {
          console.error("Error while adding user to group:", error.message);
        } else {
          console.log("User successfully added to the group.");
        }
      } catch (err) {
        console.error("Unexpected error while adding user to group:", err.message);
      }
    };

    const fetchGroupInfos = async () => {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select("id, name, avatar, skills_list")
          .eq("project_id", projectId);

        if (error) {
          console.error("Error fetching group info:", error.message);
          return;
        }

        stack.value = data || [];
        noGroupsLeft.value = stack.value.length === 0;
      } catch (err) {
        console.error("Unexpected error fetching group info:", err.message);
      }
    };

    onMounted(() => {
      fetchGroupInfos();
    });

    return {
      stack,
      noGroupsLeft,
      onSwipe,
      createHeartEffect,
      matchId,
    };
  },
};
</script>


<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

.card {
  position: absolute;
  transition: transform 0.3s, opacity 0.3s;
}

.card.swipe-left {
  transform: translateX(-100vw) rotate(-20deg);
  opacity: 0;
}

.card.swipe-right {
  transform: translateX(100vw) rotate(20deg);
  opacity: 0;
}

.heart {
  position: fixed;
  font-size: 1.5rem;
  top: -1vh;
  animation: fall 3s linear forwards;
}

@keyframes fall {
  from {
    transform: translateY(0vh) translateX(-10vw);
  }
  to {
    transform: translateY(105vh) translateX(10vw);
  }
}
</style>
