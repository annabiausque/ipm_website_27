<template>
    
<div class="bg-gray-50 py-24 sm:py-32">
  <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
    <h2 class="text-center text-base/7 font-semibold text-indigo-600">{{groupData.name}}</h2>
    <p class="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">Project name</p>
    <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
      <div class="relative lg:row-span-2">
        <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
        
            <div id="hs-file-upload" data-hs-file-upload='{
  "url": "/upload",
  "extensions": {
    "default": {
      "class": "shrink-0 size-5"
    },
    "xls": {
      "class": "shrink-0 size-5"
    },
    "zip": {
      "class": "shrink-0 size-5"
    },
    "csv": {
      "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"m5 12-3 3 3 3\"/><path d=\"m9 18 3-3-3-3\"/></svg>",
      "class": "shrink-0 size-5"
    }
  }
}'>
  <template data-hs-file-upload-preview="">
    <div class="p-3 bg-white border border-solid border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
      <div class="mb-2 flex justify-between items-center">
        <div class="flex items-center gap-x-3">
          <span class="size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500" data-hs-file-upload-file-icon="">
            <img class="rounded-lg hidden" data-dz-thumbnail="">
          </span>
          <div>
            <p class="text-sm font-medium text-gray-800 dark:text-white">
              <span class="truncate inline-block max-w-[300px] align-bottom" data-hs-file-upload-file-name=""></span>.<span data-hs-file-upload-file-ext=""></span>
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-500" data-hs-file-upload-file-size=""></p>
          </div>
        </div>
        <div class="inline-flex items-center gap-x-2">
          <button type="button" class="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200" data-hs-file-upload-remove="">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-x-3 whitespace-nowrap">
        <div class="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" data-hs-file-upload-progress-bar="">
          <div class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500 hs-file-upload-complete:bg-green-600 dark:bg-blue-500" style="width: 0" data-hs-file-upload-progress-bar-pane=""></div>
        </div>
        <div class="w-10 text-end">
          <span class="text-sm text-gray-800 dark:text-white">
            <span data-hs-file-upload-progress-bar-value="">0</span>%
          </span>
        </div>
      </div>
    </div>
  </template>

  <div class="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600" data-hs-file-upload-trigger="">
    <div class="flex flex-col">
  <div class=" min-h-[631px] ">
    <div class="min-w-full inline-block align-middle">
      <div data-hs-datatable='{
        "pageLength": 10,
        "pagingOptions": {
          "pageBtnClasses": "min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700"
        },
        "selecting": true,
        "rowSelectingOptions": {
          "selectAllSelector": "#hs-table-search-checkbox-all"
        },
        "language": {
          "zeroRecords": "<div class=\"py-10 px-5 flex flex-col justify-center items-center text-center\"><svg class=\"shrink-0 size-6 text-gray-500 dark:text-neutral-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.3-4.3\"/></svg><div class=\"max-w-sm mx-auto\"><p class=\"mt-2 text-sm text-gray-600 dark:text-neutral-400\">No search results</p></div></div>"
        }
      }'>
        <div class="py-3 overflow-x-auto">
          <div class="relative max-w-xs overflow-x-auto">
            <label for="hs-table-input-search" class="sr-only">Search</label>
            <input type="text" name="hs-table-search" id="hs-table-input-search" class="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Search for items" data-hs-datatable-search="">
            <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
              <svg class="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="overflow-hidden min-h-[509px] ">
          <table class="min-w-full">
            <thead class="border-y border-gray-200 dark:border-neutral-700">
              <tr>
                <th scope="col" class="py-1 px-3 pe-0 --exclude-from-ordering">
                  <div class="flex items-center h-5">
                    <input id="hs-table-search-checkbox-all" type="checkbox" class="border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
                    <label for="hs-table-search-checkbox-all" class="sr-only">Checkbox</label>
                  </div>
                </th>
                <th scope="col" class="py-1 group text-start font-normal focus:outline-none">
                  <div class="py-1 px-2.5 inline-flex items-center border border-transparent text-sm text-gray-500 rounded-md hover:border-gray-200 dark:text-neutral-500 dark:hover:border-neutral-700">
                    Name
                    <svg class="size-3.5 ms-1 -me-0.5 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path class="hs-datatable-ordering-asc:text-blue-600 dark:hs-datatable-ordering-asc:text-blue-500" d="m7 15 5 5 5-5"></path>
                      <path class="hs-datatable-ordering-desc:text-blue-600 dark:hs-datatable-ordering-desc:text-blue-500" d="m7 9 5-5 5 5"></path>
                    </svg>
                  </div>
                </th>

                <th scope="col" class="py-1 group text-start font-normal focus:outline-none">
                  <div class="py-1 px-2.5 inline-flex items-center border border-transparent text-sm text-gray-500 rounded-md hover:border-gray-200 dark:text-neutral-500 dark:hover:border-neutral-700">
                    Age
                    <svg class="size-3.5 ms-1 -me-0.5 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path class="hs-datatable-ordering-asc:text-blue-600 dark:hs-datatable-ordering-asc:text-blue-500" d="m7 15 5 5 5-5"></path>
                      <path class="hs-datatable-ordering-desc:text-blue-600 dark:hs-datatable-ordering-desc:text-blue-500" d="m7 9 5-5 5 5"></path>
                    </svg>
                  </div>
                </th>

                <th scope="col" class="py-1 group text-start font-normal focus:outline-none">
                  <div class="py-1 px-2.5 inline-flex items-center border border-transparent text-sm text-gray-500 rounded-md hover:border-gray-200 dark:text-neutral-500 dark:hover:border-neutral-700">
                    Address
                    <svg class="size-3.5 ms-1 -me-0.5 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path class="hs-datatable-ordering-asc:text-blue-600 dark:hs-datatable-ordering-asc:text-blue-500" d="m7 15 5 5 5-5"></path>
                      <path class="hs-datatable-ordering-desc:text-blue-600 dark:hs-datatable-ordering-desc:text-blue-500" d="m7 9 5-5 5 5"></path>
                    </svg>
                  </div>
                </th>

                <th scope="col" class="py-2 px-3 text-end font-normal text-sm text-gray-500 --exclude-from-ordering dark:text-neutral-500">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
              <tr>
                <td class="py-3 ps-3">
                  <div class="flex items-center h-5">
                    <input id="hs-table-search-checkbox-1" type="checkbox" class="border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" data-hs-datatable-row-selecting-individual="">
                    <label for="hs-table-search-checkbox-1" class="sr-only">Checkbox</label>
                  </div>
                </td>
                <td class="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">Christina Bersh</td>
                <td class="p-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">45</td>
                <td class="p-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">4222 River Rd, Columbus</td>
                <td class="p-3 whitespace-nowrap text-end text-sm font-medium">
                  <button type="button" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Delete</button>
                </td>
              </tr>

              <tr>
                <td class="py-3 ps-3">
                  <div class="flex items-center h-5">
                    <input id="hs-table-search-checkbox-2" type="checkbox" class="border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" data-hs-datatable-row-selecting-individual="">
                    <label for="hs-table-search-checkbox-2" class="sr-only">Checkbox</label>
                  </div>
                </td>
                <td class="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">David Harrison</td>
                <td class="p-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">27</td>
                <td class="p-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">2952 S Peoria Ave, Tulsa</td>
                <td class="p-3 whitespace-nowrap text-end text-sm font-medium">
                  <button type="button" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Delete</button>
                </td>
              </tr>

            
            </tbody>
          </table>
        </div>

        <div class="py-1 px-4 hidden" data-hs-datatable-paging="">
          <nav class="flex items-center space-x-1">
            <button type="button" class="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-datatable-paging-prev="">
              <span aria-hidden="true">«</span>
              <span class="sr-only">Previous</span>
            </button>
            <div class="flex items-center space-x-1 [&>.active]:bg-gray-100 dark:[&>.active]:bg-neutral-700" data-hs-datatable-paging-pages=""></div>
            <button type="button" class="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-datatable-paging-next="">
              <span class="sr-only">Next</span>
              <span aria-hidden="true">»</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</div>
  </div>

  <div class="mt-4 space-y-3 empty:mt-0" data-hs-file-upload-previews=""></div>
</div>
        </div>
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
      </div>
      <div class="relative max-lg:row-start-1">
        <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
          <div class="px-8 pt-8 sm:px-10 sm:pt-10">
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Performance</p>
              </div>
          <div class="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
            <div class="relative w-full h-full">
<!-- Circular Progress -->
<div class="relative size-40">
  <svg class="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <!-- Background Circle -->
    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200" stroke-width="2"></circle>
    <!-- Progress Circle -->
    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600" stroke-width="2" stroke-dasharray="100" stroke-dashoffset="65" stroke-linecap="round"></circle>
  </svg>

  <!-- Percentage Text -->
  <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
    <span class="text-center text-2xl font-bold text-blue-600">35%</span>
  </div>
</div>
<!-- End Circular Progress -->
            </div>
          </div>
        </div>
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
      </div>
      <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
        <div class="absolute inset-px rounded-lg bg-white"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
          <div class="px-8 pt-8 sm:px-10 sm:pt-10">
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Security</p>
            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.</p>
          </div>
          <div class="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
            <img class="h-[min(152px,40cqw)] object-cover" src="https://tailwindui.com/plus/img/component-images/bento-03-security.png" alt="">
          </div>
        </div>
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
      </div>
      <div class="relative lg:row-span-2">
        <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
          <div class="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Powerful APIs</p>
            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.</p>
          </div>
         
        </div>
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
      </div>
    </div>
  </div>
</div>



</template>

<script lang="js">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';

export default {
  name: 'SingleGroup',
  setup() {
    const route = useRoute();
    const groupId = route.params.id;
    const groupData = ref(null);
    const loading = ref(true);

    const fetchGroupData = async (groupId) => {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId);

        if (error) {
          console.error('Erreur Supabase:', error.message);
          return null;
        }

        if (data.length === 0) {
          console.warn('Aucun groupe trouvé avec cet ID.');
          return null;
        }

        return data[0];
      } catch (error) {
        console.error('Erreur inattendue:', error.message);
        return null;
      }
    };

    onMounted(async () => {
      console.log('Group ID:', groupId);
      groupData.value = await fetchGroupData(groupId);
      loading.value = false;
    });

    return { groupData, loading };
  },
};

</script>


<style scoped>
.overflow-x-auto {
  overflow-x: auto; 
}
</style>
