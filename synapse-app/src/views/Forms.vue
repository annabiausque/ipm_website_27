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
const uploadedFiles = ref([]); 

const router = useRouter();

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1); 
};


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
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
     
      uploadedFiles.value.push({
        name: file.name,
        size: Math.round(file.size / 1024), 
      });
    };
    reader.readAsDataURL(file); 
  }

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


function removeSkill(index) {
  skills.value.splice(index, 1);
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
          <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1-1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
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

    <!-- Uploaded files preview -->
    <div class="col-span-full">
      <div v-for="(file, index) in uploadedFiles" :key="index"
        class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm mb-4">
      <!-- File Uploading Progress Form -->

  <!-- Uploading File Content -->
 
    <div class="flex items-center gap-x-3">
      <span class="size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500">
        <svg class="shrink-0 size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.0243 1.43996H7.08805C6.82501 1.43996 6.57277 1.54445 6.38677 1.73043C6.20077 1.91642 6.09631 2.16868 6.09631 2.43171V6.64796L15.0243 11.856L19.4883 13.7398L23.9523 11.856V6.64796L15.0243 1.43996Z" fill="#21A366"></path>
          <path d="M6.09631 6.64796H15.0243V11.856H6.09631V6.64796Z" fill="#107C41"></path>
          <path d="M22.9605 1.43996H15.0243V6.64796H23.9523V2.43171C23.9523 2.16868 23.8478 1.91642 23.6618 1.73043C23.4758 1.54445 23.2235 1.43996 22.9605 1.43996Z" fill="#33C481"></path>
          <path d="M15.0243 11.856H6.09631V21.2802C6.09631 21.5433 6.20077 21.7955 6.38677 21.9815C6.57277 22.1675 6.82501 22.272 7.08805 22.272H22.9606C23.2236 22.272 23.4759 22.1675 23.6618 21.9815C23.8478 21.7955 23.9523 21.5433 23.9523 21.2802V17.064L15.0243 11.856Z" fill="#185C37"></path>
          <path d="M15.0243 11.856H23.9523V17.064H15.0243V11.856Z" fill="#107C41"></path>
          <path opacity="0.1" d="M12.5446 5.15996H6.09631V19.296H12.5446C12.8073 19.2952 13.0591 19.1904 13.245 19.0046C13.4308 18.8188 13.5355 18.567 13.5363 18.3042V6.1517C13.5355 5.88892 13.4308 5.63712 13.245 5.4513C13.0591 5.26548 12.8073 5.16074 12.5446 5.15996Z" fill="black"></path>
          <path opacity="0.2" d="M11.8006 5.90396H6.09631V20.04H11.8006C12.0633 20.0392 12.3151 19.9344 12.501 19.7486C12.6868 19.5628 12.7915 19.311 12.7923 19.0482V6.8957C12.7915 6.6329 12.6868 6.38114 12.501 6.19532C12.3151 6.0095 12.0633 5.90475 11.8006 5.90396Z" fill="black"></path>
          <path opacity="0.2" d="M11.8006 5.90396H6.09631V18.552H11.8006C12.0633 18.5512 12.3151 18.4464 12.501 18.2606C12.6868 18.0748 12.7915 17.823 12.7923 17.5602V6.8957C12.7915 6.6329 12.6868 6.38114 12.501 6.19532C12.3151 6.0095 12.0633 5.90475 11.8006 5.90396Z" fill="black"></path>
          <path opacity="0.2" d="M11.0566 5.90396H6.09631V18.552H11.0566C11.3193 18.5512 11.5711 18.4464 11.757 18.2606C11.9428 18.0748 12.0475 17.823 12.0483 17.5602V6.8957C12.0475 6.6329 11.9428 6.38114 11.757 6.19532C11.5711 6.0095 11.3193 5.90475 11.0566 5.90396Z" fill="black"></path>
          <path d="M1.13604 5.90396H11.0566C11.3195 5.90396 11.5718 6.00842 11.7578 6.19442C11.9438 6.38042 12.0483 6.63266 12.0483 6.8957V16.8162C12.0483 17.0793 11.9438 17.3315 11.7578 17.5175C11.5718 17.7035 11.3195 17.808 11.0566 17.808H1.13604C0.873012 17.808 0.620754 17.7035 0.434765 17.5175C0.248775 17.3315 0.144287 17.0793 0.144287 16.8162V6.8957C0.144287 6.63266 0.248775 6.38042 0.434765 6.19442C0.620754 6.00842 0.873012 5.90396 1.13604 5.90396Z" fill="#107C41"></path>
          <path d="M2.77283 15.576L5.18041 11.8455L2.9752 8.13596H4.74964L5.95343 10.5071C6.06401 10.7318 6.14015 10.8994 6.18185 11.01H6.19745C6.27683 10.8305 6.35987 10.6559 6.44669 10.4863L7.73309 8.13596H9.36167L7.09991 11.8247L9.41897 15.576H7.68545L6.29489 12.972C6.22943 12.861 6.17387 12.7445 6.12899 12.6238H6.10817C6.06761 12.7419 6.01367 12.855 5.94748 12.9608L4.51676 15.576H2.77283Z" fill="white"></path>
        </svg>
      </span>
      <div>
        <p class="text-sm font-medium text-gray-800 dark:text-gray-400">{{ file.name }}</p>
        <p class="text-xs text-gray-800 dark:text-gray-400">{{ file.size }} kb</p>
      </div>
    </div>
   
  <!-- End Uploading File Content -->
  <div class="flex items-center gap-x-3 whitespace-nowrap">
    <div class="inline-flex items-center gap-x-2">
    
      <button type="button"  @click="removeFile(index)" class="relative text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200">
        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" x2="10" y1="11" y2="17"></line>
          <line x1="14" x2="14" y1="11" y2="17"></line>
        </svg>
        <span class="sr-only">Delete</span>
      </button>
    </div>

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