<template>
    <div class="my-6 overflow-hidden bg-white rounded-md shadow">
      <table class="w-full text-left border-collapse">
        <thead class="border-b">
          <tr>
            <th
              class="px-10 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
            >
              Name
            </th>
            <th
              class="px-20 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800 text-right"
            >
              Skill
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Iterate over the projects array -->
          <tr
            v-for="(project, projectId) in projects"
            :key="projectId"
            class="hover:bg-gray-200"
          >
            <!-- Name cell -->
            <td class="px-10 py-4 text-lg text-gray-700 border-b">
              {{ project.name }}
            </td>
            <!-- Iterate over the skill_list array to display each skill in a separate row -->
            <td
              v-for="(skill, skillId) in project.skill_list"
              :key="skillId"
              class="px-20 py-4 text-gray-500 border-b text-right"
            >
              {{ skill }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
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