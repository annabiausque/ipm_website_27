<script setup lang="js">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();
const projects = ref([]);

async function getProjects() {
  const { data, error } = await supabase.from('projects').select();

  if (error) {
    console.error('Erreur lors de la récupération des projets:', error.message);
    return;
  }

  projects.value = data || [];
}

function redirectToGroup(id) {
  router.push({ name: 'SingleGroup', params: { id } }); // Redirige vers la route avec l'ID du projet
}

onMounted(() => {
  getProjects();
});
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">My projects</h3>

    <div class="mt-4">
      <div class="mt-6">
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Code' ? activeClass : inactiveClass]"
          to="/code"
        >
          <button
            class="mt-4 bg-gray-800 border-gray-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 shadow-sm"
          >
            <span class="pr-[10px]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current"
              >
                <g clip-path="url(#clip0_906_8052)">
                  <path
                    d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z"
                  />
                  <path
                    d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_906_8052">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Join a new project
          </button>
        </router-link>

        <div class="my-6 overflow-hidden bg-white rounded-md shadow">
          <table class="w-full text-left border-collapse">
            <thead class="border-b">
              <tr>
                <th class="px-10 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800">
                  Name
                </th>
                <th class="px-20 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800 text-right">
                  Next deadline
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(project, id) in projects"
                :key="id"
                class="hover:bg-gray-200"
              >
                <td
                  class="px-10 py-4 text-lg text-gray-700 border-b cursor-pointer"
                  @click="redirectToGroup(Int8Array(1))"
                >
                  {{ project.title }}
                </td>
                <td class="px-20 py-4 text-gray-500 border-b text-right">
                  {{ project.end_date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>




    <!-- Alerts 
    

    <div class="mt-4">
      <h4 class="text-gray-600">
        Alerts
      </h4>

      <div class="mt-4">
        <div
          class="px-4 py-4 overflow-x-auto bg-white rounded-md whitespace-nowrap"
        >
          <div
            class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <div class="flex items-center justify-center w-12 bg-green-500">
              <svg
                class="w-6 h-6 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
                />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-green-500">Success</span>
                <p class="text-sm text-gray-600">
                  Your account was registered!
                </p>
              </div>
            </div>
          </div>

          <div
            class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <div class="flex items-center justify-center w-12 bg-blue-500">
              <svg
                class="w-6 h-6 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
                />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-blue-500">Info</span>
                <p class="text-sm text-gray-600">
                  Channel archived by the owner.
                </p>
              </div>
            </div>
          </div>

          <div
            class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <div class="flex items-center justify-center w-12 bg-yellow-500">
              <svg
                class="w-6 h-6 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
                />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-yellow-500">Warning</span>
                <p class="text-sm text-gray-600">
                  Image size is too large.
                </p>
              </div>
            </div>
          </div>

          <div
            class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <div class="flex items-center justify-center w-12 bg-red-500">
              <svg
                class="w-6 h-6 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-red-500">Error</span>
                <p class="text-sm text-gray-600">
                  Your email is already used!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    -->

    <!-- Inputs 
    <div class="mt-8">
      <h4 class="text-gray-600">
        Inputs
      </h4>

      <div class="mt-4">
        <div class="flex items-center px-4 py-4 space-x-4 overflow-x-auto bg-white rounded-md">
          <label>
            <input
              type="radio"
              class="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
              name="radio"
            ><span class="ml-2 text-gray-700">Radio</span>
          </label>

          <label>
            <input
              type="checkbox"
              class="w-5 h-5 text-indigo-600 rounded-md focus:ring-indigo-500"
              name="radio"
            ><span class="ml-2 text-gray-700">Checkbox</span>
          </label>

          <label class="block">
            <input
              type="email"
              placeholder="Email"
              class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            >
          </label>

          <div class="relative mx-4 lg:mx-0">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <input
              class="w-32 pl-10 pr-4 text-indigo-600 border-gray-200 rounded-md sm:w-64 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              type="text"
              placeholder="Search"
            >
          </div>
        </div>
      </div>
    </div>
    -->

    <!-- Buttons -->
    <!--
    <div class="mt-8">
      <h4 class="text-gray-600">
        Buttons
      </h4>

      <div class="mt-4">
        <div class="flex px-4 py-4 space-x-4 overflow-x-auto bg-white rounded-md">
          <button class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
            Primary
          </button>

          <button class="flex items-center px-2 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
            <svg class="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            <span class="mx-1">Refresh</span>
          </button>

          <div class="flex items-center">
            <button class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
              Download
            </button>

            <span class="border border-transparent" />

            <div class="relative">
              - Menu toggle button -
              <button class="relative z-10 block p-2 transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
                <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              - Menu list -
              <div class="absolute right-0 z-20 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
    -->


    <!-- Paginations -->
    <!--
    <div class="mt-8">
      <h4 class="text-gray-600">
        Paginations
      </h4>

      <div class="mt-4">
        <div class="flex px-4 py-4 overflow-x-auto bg-white rounded-md">
          <div class="flex mr-4 rounded">
            <a
              href="#"
              class="px-3 py-2 ml-0 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 rounded-l hover:bg-indigo-500 hover:text-white"
            ><span>Previous</span></a>
            <a
              href="#"
              class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"
            ><span>1</span></a>
            <a
              href="#"
              class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"
            ><span>2</span></a>
            <a
              href="#"
              class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"
            ><span>3</span></a>
            <a
              href="#"
              class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-gray-200 rounded-r hover:bg-indigo-500 hover:text-white"
            ><span>Next</span></a>
          </div>
        </div>
      </div>
    </div>
    -->
  </div>
</template>
