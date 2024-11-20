<template>
  <!-- Stack -->
  <div class="flex flex-col w-full h-full items-center justify-center flex-grow ">
    <div class="stack-container relative w-80 h-96 mb-8">
    <Swipeable
      class="card absolute rounded-lg border border-gray-400 w-80 h-96 overflow-y-auto [grid-template-areas:'stack'] "
      v-for="(card, index) in stack"
      :key="card.id"
      :style="{ zIndex: stack.length - index, top: `${index * 5}px` }"
      v-on:swipe="onSwipe"
    >
      <!-- Card Content -->
      <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 [grid-area:stack]">
       
          <img class="rounded-t-lg" src="../assets/logo_indigo.png" alt="" />
   
        <div class="p-5 ">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">  {{ card.name }}</h5>
          </a>
          <a href="#members" id="members">
            <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">Group members</p>
          </a>
          <a href="#">
            <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">Skills : {{ card.skills_list.join(', ') }}</p>
          </a>
          <a href="#">
            <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">Preferences</p>
          </a>
        </div>
      </div>
    </Swipeable>
  </div>
    <!-- Buttons -->
    <div class="flex items-center justify-center w-full h-20 space-x-4 pb-5">
      <!-- "X" Button -->
      <div
        class="bg-white rounded-full h-16 w-16 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-red-400 transition duration-200"
        @click="onClick('swipe-left')"
      >
        <img src="../assets/xmark-solid.svg" class="w-2/3 h-2/3" alt="X icon" />
      </div>
      <!-- "Info" Button -->
      <div
        class="bg-white rounded-full h-12 w-12 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-blue-300 transition duration-200"
        @click="scrollToAnchor('members')"
      >
        <i class="fa fa-info text-blue-500 text-xl" aria-hidden="true"></i>
      </div>
      <!-- "Heart" Button -->
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
import { supabase } from '../lib/supabaseClient';
import { ref, onMounted } from 'vue';

export default {
  name: "Match",
  components: { Swipeable },
  data() {
    return { 
      stack: [],
      noGroupsLeft: false, // Indique si le stack est vide
      isSwiping: false, // Indique si une animation de swipe est en cours
    };
  },
  methods: {
    onSwipe(direction) {
    console.log(direction);
    const cardElement = document.querySelector('.card'); // Trouve la carte actuelle
    if (cardElement) {
      cardElement.classList.add(direction === 'swipe-left' ? 'swipe-left' : 'swipe-right'); // Applique la classe
    }

    setTimeout(() => {
      this.stack.pop(); // Supprime la carte après l'animation
      this.noGroupsLeft = this.stack.length === 0;
    }, 500); // Le délai correspond à la durée de l'animation CSS
  },
    scrollToAnchor(anchorId) {
      const target = document.getElementById(anchorId); // Trouver l'élément avec l'id
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' }); // Scroller doucement
      } else {
        console.warn(`Anchor with ID '${anchorId}' not found.`);
      }
    },
    onClick(direction) {
  console.log(direction);
  const cardElement = document.querySelector('.card'); // Trouve la carte actuelle
  if (cardElement) {
    cardElement.classList.add(direction === 'swipe-left' ? 'swipe-left' : 'swipe-right'); // Applique la classe
  }

  setTimeout(() => {
    this.stack.pop(); // Supprime la carte après l'animation
    this.noGroupsLeft = this.stack.length === 0;
  }, 500);
},

  async fetchGroupInfos() {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('id, name, avatar, skills_list');

        if (error) {
          console.error('Erreur lors de la récupération des informations du groupe:', error.message);
          return;
        }

        this.stack = data || [];
        this.noGroupsLeft = this.stack.length === 0;
      } catch (error) {
        console.error('Erreur inattendue lors de la récupération des informations du groupe:', error.message);
      }
    },
  },
  mounted() {
    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user?.id || null;
      this.userId = userId;
      this.fetchGroupInfos();
    });
  },
};


</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

.card {
  position: relative;
  margin: auto;
  transition: transform 0.3s;
  scroll-behavior: smooth;
}
</style>