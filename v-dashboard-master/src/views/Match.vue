<template>
    <div id="match">
      <Swipeable
        class="card"
        v-for="card in stack"
        :key="card.id"
        v-on:swipe="onSwipe"
        :style="{ background: card.color }"
      >
      <div class="max-w-sm mt-6 overflow-hidden bg-white rounded shadow-lg">
        <img
          class="w-full"
          src="https://picsum.photos/id/1016/384/234"
          alt="Sunset in the mountains"
        >
        <div class="px-6 py-4">
          <div class="mb-2 text-xl font-bold text-gray-900">
            The Coldest Sunset
          </div>
          <p class="text-base text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptatibus quia, nulla! Maiores et perferendis eaque,
            exercitationem praesentium nihil.
          </p>
        </div>
        <div class="px-6 pt-4 pb-2">
          <span
            class="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
          >#photography</span>
          <span
            class="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
          >#travel</span>
          <span
            class="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
          >#winter</span>
        </div>
      </div>
      </Swipeable>
    </div>
  </template>
  
  
  <script lang = "js">
    import { interact } from 'interactjs';

    import { Swipeable } from "vue-swipy";  
    function getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }  export default {
      name: "Match",
      components: { Swipeable },
      data() {
        return { stack: [] };
      },
      mounted() {
        for (var i = 0; i < 3; i++) {
          this.stack.push({ 
            id: Math.random(), 
            color: getRandomColor() ,
          });
        }
      },
      methods: {
        onSwipe(direction) {
          console.log(direction);
          setTimeout(() => {
            this.stack.pop();
            this.stack.unshift({ 
              id: Math.random(), 
              color: getRandomColor() 
            });
          }, 300);
        },
      },
    };
  </script>
  
  <style>
    body {
      margin: 0;
    }  
    .card {
      position: absolute;
      height: 400px;
      width: 250px;
      border-radius: 8px;
    }
    #match {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
    }
  </style>