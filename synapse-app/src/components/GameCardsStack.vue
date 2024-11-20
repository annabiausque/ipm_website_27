<template>
    <div class="cards relative flex m-12 w-72">
      <GameCard
        v-for="(card, index) in cards"
        :key="card"
        :card="card"
        :is-current="index === 0"
        @cardAccepted="$emit('cardAccepted');"
        @cardRejected="$emit('cardRejected');"
        @cardSkipped="$emit('cardSkipped');"
        @hideCard="$emit('hideCard');"
      />
    </div>
  </template>
  
  <script>
  import GameCard from "../components/GameCard.vue";
  
  export default {
    components: {
      GameCard
    },
  
    props: {
      cards: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
