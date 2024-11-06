<template>

</template>

<script setup lang = "jsx">
import { onMounted } from 'vue';
import React from "react";
import { createRoot, hydrateRoot } from 'react-dom/client';
import SwipeCards from '../SwipeCards.jsx';

onMounted(() => {
  const reactRootElement = document.getElementById("reactRoot");

  if (reactRootElement) {
    console.log("Montage de React dans #reactRoot");
    const root = createRoot(reactRootElement);
    root.render(<SwipeCards />);
  } else {
    console.error("#reactRoot introuvable");
  }
});

</script>
