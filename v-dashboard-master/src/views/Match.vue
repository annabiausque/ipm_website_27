<template>

    <!-- Stack -->
    <div class="flex flex-col w-full h-full items-center justify-center flex-grow">
      <Swipeable
        class="card relative rounded-lg border border-gray-400 w-80 h-96"
        v-for="card in stack"
        :key="card.id"
        v-on:swipe="onSwipe"
      >
        <div class="tbg bg-white border border-gray-400 w-full h-full flex flex-col items-center mx-auto">
          <div class="theader flex justify-between w-full bg-gray-200 border-b border-gray-400 p-3">
            <div class="flex items-center"></div>
            <div class="flex items-center text-gray-500">
              <i class="fa fa-comments text-lg" aria-hidden="true"></i>
            </div>
          </div>
          <div class="p-4 flex flex-col items-center">
            <div class="tphoto relative rounded-lg border border-gray-400 shadow-lg w-64 h-64 overflow-hidden">
              <img src="../assets/logo_dark.png" class="w-full h-full object-cover" title="Tinder Photo" alt="Tinder Photo" />
              <div class="flex justify-between w-full p-2 bg-white bg-opacity-80 absolute bottom-0">
                <div class="text-lg font-bold">Group 1</div>
                <div class="text-sm text-gray-500 flex space-x-2">
                  <i class="fa fa-users" aria-hidden="true"></i><span>3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Swipeable>
      <div class="flex items-center justify-center w-full h-20 space-x-4 pb-5">
      <!-- "X" Button -->
      <div
        class="bg-white rounded-full h-16 w-16 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-red-400 transition duration-200"
        @click="onSwipe('left')"
      >
        <img src="../assets/xmark-solid.svg" class="w-2/3 h-2/3" alt="X icon" />
      </div>
      <!-- "Info" Button -->
      <div
        class="bg-white rounded-full h-12 w-12 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-blue-300 transition duration-200"
      >
        <i class="fa fa-info text-blue-500 text-xl" aria-hidden="true"></i>
      </div>
      <!-- "Heart" Button -->
      <div
        class="bg-white rounded-full h-16 w-16 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:bg-green-400 transition duration-200"
        @click="onSwipe('right')"
      >
        <img src="../assets/heart-regular.svg" class="w-2/3 h-2/3" alt="Heart icon" />
      </div>
    </div>
    </div>

    <!-- Buttons -->
   

</template>

<script lang="js">
import { Swipeable } from "vue-swipy";

export default {
  name: "Match",
  components: { Swipeable },
  data() {
    return { 
      stack: [{ id: 1 }]
    };
  },
  methods: {
    onSwipe(direction) {
      console.log(direction);
      console.log(this.stack);
      setTimeout(() => {
        this.stack.pop();
        this.stack.unshift({ id: Math.random() });
      }, 300);
    },
  },
};
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

.card {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
