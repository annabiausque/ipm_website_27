<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const projects = ref([])

async function getProjects() {
    const { data } = await supabase.from('projects').select()
    projects.value = data
}

onMounted(() => {
    getProjects()
})
</script>

<template>
    <ul>
        <li v-for="project in projects" :key="project.id">{{ project.end_date }}</li>
    </ul>
</template>