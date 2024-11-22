<script setup lang="js">

import { supabase } from '../lib/supabaseClient';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import { useSnackbar } from 'vue3-snackbar';

const title = ref('');
const description = ref('');
const dateValue = ref([]);
const min = ref(1);
const max = ref(10);
const userId = ref(null);
const subject = ref('');
const numberOfGroups = ref(1);
const newSkill = ref('');
const skills = ref([]);
const snackbar = useSnackbar();

const router = useRouter();

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  userId.value = data.session?.user?.id || null;

  if (!userId.value) {
    console.error('Utilisateur non authentifié');

  }
});

async function createProject() {
  if (!userId.value) {
    alert('Erreur : Utilisateur non authentifié.');
    return;
  }

  try {
    const { data: projectData, projectError } = await supabase
      .from('projects')
      .insert([
        {
          title: title.value,
          description: description.value,
          start_date: dateValue.value[0],
          end_date: dateValue.value[1],
          min_students: min.value,
          max_students: max.value,
          id_owner: userId.value,
          subject: subject.value,
          number_of_groups: numberOfGroups.value,
          skill_list: skills.value,
        }
      ]).select();

    if (projectError) {
      console.error('Erreur lors de la création du projet:', projectError.message);
    } else {

      console.log('Projet créé avec succès:', projectData);
      let groups = [];
      for (let i = 0; i < numberOfGroups.value; i++) {
        groups.push({
          project_id: projectData[0].id,
          name: `${title.value} group ${i + 1}`,
        });
      }
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert(groups);
      if (groupError) {
        console.error('Erreur lors de la création des groupes:', groupError.message);
        snackbar.add({
          type: 'error',
          text: 'An error occurred while creating the groups for the project.',
        });
        return;
      }

      //localStorage.setItem('notification', 'Your new project was successfully created!');
      snackbar.add({
        type: 'success',
        text: 'Your new project was successfully created!',
      });
      router.push('/my-projects');
    }
  } catch (projectError) {
    console.error('Erreur lors de la création du projet:', projectError.message);
  }
}


async function uploadPdf(event) {
  const file = event.target.files[0];


  const fileName = `${Date.now()}_${file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      contentType: file.type,
    });

  if (error) {
    console.error('Erreur lors du téléchargement du PDF:', error.message);
    return;
  }

  console.log('PDF téléchargé avec succès:', data.Key);
  return data.Key;
}

async function savePdfToDatabase(fileName, filePath) {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      { file_name: fileName, file_path: filePath },
    ]);


  if (error) {
    console.error('Erreur lors de l\'enregistrement dans la base de données:', error.message);
  } else {
    console.log('Fichier enregistré dans la base de données:', data);
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0];

  const filePath = await uploadPdf(file);

  if (filePath) {
    await savePdfToDatabase(file.name, filePath);
  }
}

function addSkill() {
  const skill = newSkill.value.trim();
  if (skill && !skills.value.includes(skill)) {
    skills.value.push(skill);
    newSkill.value = '';
  }
}


</script>


<template>
  <div>
    <h3 class="text-3xl font-semibold text-gray-700">
      Create a new project
    </h3>



    <div class="mt-8">
      <h4 class="text-gray-600">
        Project definition
      </h4>

      <div class="mt-4">
        <div class="p-5 bg-white rounded-md shadow-md">


          <form @submit.prevent="createProject">




            <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="subject" class="block text-sm/6 font-medium text-gray-900">Subject</label>

                <div class="mt-2">

                  <select id="subject" v-model='subject' name="subject" autocomplete="subject-name"
                    class="block w-full rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6">
                    <option>Human Computer Interaction</option>
                    <option>Information retrieval</option>
                    <option>Data Modelling</option>
                  </select>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="title" class="block text-sm/6 font-medium text-gray-900">Title</label>
                <div class="mt-2">
                  <input type="text" name="title" id="title" v-model='title'
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                </div>
              </div>

              <div class="col-span-full">
                <label for="about" class="block text-sm/6 font-medium text-gray-900">About</label>
                <div class="mt-2">
                  <textarea id="about" name="about" rows="3" v-model="description"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"></textarea>
                </div>
                <p class="mt-3 text-sm/6 text-gray-600">Describe the main goal of the project.</p>
              </div>



              <div class="col-span-full">
                <label for="dates" class="block text-sm/6 font-medium text-gray-900">Set up the deadlines</label>
                <div class="mt-2"> <vue-tailwind-datepicker v-model="dateValue" as-single no-input use-range /></div>

              </div>


              <div class="col-span-full">
                <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Resources</label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor"
                      aria-hidden="true">
                      <path fill-rule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clip-rule="evenodd" />
                    </svg>
                    <div class="mt-4 flex text-sm/6 text-gray-600">
                      <label for="file-upload"
                        class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="uploadPdf">
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>

    <div class="mt-8">

      <h4 class="text-gray-600">
        Groups' definition
      </h4>

      <div class="mt-4">
        <div class="p-5 bg-white rounded-md shadow-md">

          <div class="sm:col-span-8">
            <form @submit.prevent="register">


              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-white rounded-md shadow-md">

                <div>
                  <label for="groupsNumber" class="block text-sm font-medium text-gray-900">Number of groups</label>
                  <div class="py-2">
                    <input id="groupsNumber" v-model='numberOfGroups' type="number"
                      class="w-full rounded-md border-2 border-gray-300 bg-gray-100 px-4 py-1.5 text-lg">
                  </div>
                </div>


                <div>
                  <label class="block text-sm font-medium text-gray-900">Select Range</label>
                  <div class="flex items-center space-x-2">
                    <double-range-slider class="w-full" :min="min" :max="max" :min-threshold="1" :max-threshold="10"
                      @update:min="(value) => min = +value" @update:max="(value) => max = +value"></double-range-slider>
                    <span class="text-gray-700">{{ min }} - {{ max }}</span>
                  </div>
                </div>
                <div class="col-span-full">
                  <label for="skills" class="block text-sm font-medium text-gray-900 mb-2">Skills needed for the
                    project</label>
                </div>
                <div class="flex items-center space-x-2">
                  <input id="skills" v-model="newSkill" placeholder="Add a new skill"
                    class="w-full rounded-md border-2 border-gray-300 bg-gray-100 px-4 py-1.5 text-sm" />
                  <button @click="addSkill"
                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Add
                  </button>
                </div>
                <div>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <div v-for="(skill, index) in skills" :key="index"
                      class="flex items-center space-x-2 bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-medium">
                      <span>#{{ skill }}</span>
                      <button @click="removeSkill(index)" class="text-gray-500 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>


              <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="submit" @click="createProject"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create
                  project</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
