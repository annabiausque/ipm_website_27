<template>
    <div id="match">
      <Swipeable
        class="card"
        v-for="card in stack"
        :key="card.id"
        v-on:swipe="onSwipe"
        :style="{
          background: card.color,
        }"
      />
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
            color: getRandomColor() 
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