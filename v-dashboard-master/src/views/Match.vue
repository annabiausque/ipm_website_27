<template>
  <!-- Stack -->
  <div class="flex flex-col w-full h-full items-center justify-center flex-grow">
    <Swipeable
      class="card relative rounded-lg border border-gray-400 w-80 h-96 overflow-y-auto"
      v-for="card in stack"
      :key="card.id"
      v-on:swipe="onSwipe"
    >
      <!-- Card Content -->
      <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
       
          <img class="rounded-t-lg" src="../assets/logo_indigo.png" alt="" />
   
        <div class="p-5">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Group 1</h5>
          </a>
          <a href="#members" id="members">
            <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">Group members</p>
          </a>
          <a href="#">
            <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">Skills</p>
          </a>
          <a href="#">
            <p class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">Preferences</p>
          </a>
        </div>
      </div>
    </Swipeable>

    <!-- Buttons -->
    <div class="flex items-center justify-center w-full h-20 space-x-4 pb-5">
      <!-- "X" Button -->
      <div
        class="bg-white rounded-full h-16 w-16 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-red-400 transition duration-200"
        @click="onSwipe('swipe-left')"
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
        @click="onSwipe('swipe-right')"
      >
        <img src="../assets/heart-regular.svg" class="w-2/3 h-2/3" alt="Heart icon" />
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { Swipeable } from "vue-swipy";

export default {
  name: "Match",
  components: { Swipeable },
  data() {
    return { 
      stack: [{ id: 1 }],
    };
  },
  methods: {
    onSwipe(direction) {
      console.log(direction);
      setTimeout(() => {
        this.stack.pop();
        this.stack.unshift({ id: Math.random() });
      }, 300);
    },
    scrollToAnchor(anchorId) {
      const target = document.getElementById(anchorId); // Trouver l'élément avec l'id
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' }); // Scroller doucement
      } else {
        console.warn(`Anchor with ID '${anchorId}' not found.`);
      }
    },
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
