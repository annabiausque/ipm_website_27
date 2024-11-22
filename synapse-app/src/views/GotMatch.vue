<template>
<div>
    <div class="h-screen w-full bg-[linear-gradient(0deg,_rgba(172,46,209,0.5)_50%,_rgba(217,39,39,0.5)_120%)] rounded-xl py-10 overflow-auto">
    <h1 class="text-4xl text-white text-center font-bold py-10">You got a match!</h1>

    <div class="flex justify-center items-center mt-20">
<div class="card relative rounded-lg border border-gray-400 w-80 h-96 overflow-y-auto">
  <div class="max-w-sm bg-[rgba(0,0,0,0)] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
</div>
</div>

</div>
</div>
</template>

<script>

export default {
  data() {
    return {
      card: {
        name: "Group Name",
        skills_list: ["Skill 1", "Skill 2", "Skill 3"],
      },
    };
  },
};
</script>

<style lang="scss" scoped>

</style>