<script setup lang="js">


import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import VueTailwindDatepicker from "vue-tailwind-datepicker";

const min = ref(3)
const max = ref(7)
const dateValue = ref([]);
const title = ref('');
const description = ref('');
const ressource = ref('');

async function createProject() {
    try {
      

        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
 
    }
}

async function uploadPdf(file) {
  // Vérifiez que le fichier existe et est bien au format PDF
  if (!file || file.type !== 'application/pdf') {
    console.error('Veuillez sélectionner un fichier PDF');
    return;
  }

  // Nom unique pour le fichier, basé sur le timestamp
  const fileName = `${Date.now()}_${file.name}`;
  
  // Télécharger le fichier dans le bucket
  const { data, error } = await supabase.storage
    .from('documents') // Nom du bucket créé dans Supabase
    .upload(fileName, file, {
      contentType: 'application/pdf',
    });

  if (error) {
    console.error('Erreur lors du téléchargement du PDF:', error.message);
    return;
  }

  // Retourner le chemin du fichier pour l'enregistrer dans la base de données
  console.log('PDF téléchargé avec succès:', data.Key);
  return data.Key; // Clé ou chemin du fichier dans le bucket
}

async function savePdfToDatabase(fileName, filePath) {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      { name: fileName, file_path: filePath }
    ]);

  if (error) {
    console.error('Erreur lors de l\'enregistrement dans la base de données:', error.message);
  } else {
    console.log('Fichier enregistré dans la base de données:', data);
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0]; // Récupère le fichier sélectionné

  // Étape 1 : Télécharger le fichier vers Supabase Storage
  const filePath = await uploadPdf(file);

  if (filePath) {
    // Étape 2 : Enregistrer le chemin du fichier dans la base de données
    await savePdfToDatabase(file.name, filePath);
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
          
            <select id="subject" name="subject" autocomplete="subject-name" class="block w-full rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6">
              <option>Human Computer Interaction</option>
              <option>Information retrieval</option>
              <option>Data Modelling</option>
            </select>
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="title" class="block text-sm/6 font-medium text-gray-900">Title</label>
          <div class="mt-2">
            <input type="text" name="title" id="title" v-model = 'title' class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
          </div>
        </div>

        <div class="col-span-full">
          <label for="about" class="block text-sm/6 font-medium text-gray-900">About</label>
          <div class="mt-2">
            <textarea id="about" name="about" rows="3" v-model = "description" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"></textarea>
          </div>
          <p class="mt-3 text-sm/6 text-gray-600">Describe the main goal of the project.</p>
        </div>
        
      
      
        <div class="col-span-full">
        <label for="dates" class="block text-sm/6 font-medium text-gray-900">Set up the deadlines</label>
        <div class = "mt-2"> <vue-tailwind-datepicker v-model="dateValue" as-single no-input use-range /></div>
       
        </div>
 

        <div class="col-span-full">
                <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Resources</label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                    </svg>
                    <div class="mt-4 flex text-sm/6 text-gray-600">
                      <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload">
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
                <input id="groupsNumber" type="number" class="w-full rounded-md border-2 border-gray-300 bg-gray-100 px-4 py-1.5 text-lg">
              </div>
              </div>

  
              <div>
                <label class="block text-sm font-medium text-gray-900">Select Range</label>
                <div class="flex items-center space-x-2">
                  <double-range-slider 
                    class="w-full"
                    :min="min"
                    :max="max"
                    :min-threshold="0"
                    :max-threshold="10"
                    @update:min="(value) => min = +value"
                    @update:max="(value) => max = +value"
                  ></double-range-slider>
                  <span class="text-gray-700">{{ min }} - {{ max }}</span>
                </div>
              </div>
            </div>

     
            <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
                <button type="submit" @click="createProject" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create project</button>
            </div>

      
          </form>
         </div>
            
        </div>
      </div>
      
    </div>
     
  </div>

 
  <!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```

<form>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Profile</h2>
      <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
          <div class="mt-2">
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
              <input type="text" name="username" id="username" autocomplete="username" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6" placeholder="janesmith">
            </div>
          </div>
        </div>



        <div class="col-span-full">
          <label for="photo" class="block text-sm/6 font-medium text-gray-900">Photo</label>
          <div class="mt-2 flex items-center gap-x-3">
            <svg class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
            </svg>
            <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
          </div>
        </div>

      </div>
    </div>

    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Personal Information</h2>
      <p class="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="first-name" class="block text-sm/6 font-medium text-gray-900">First name</label>
          <div class="mt-2">
            <input type="text" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="title" class="block text-sm/6 font-medium text-gray-900">Last name</label>
          <div class="mt-2">
            <input type="text" name="title" id="title" autocomplete="family-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
          </div>
        </div>

        <div class="sm:col-span-4">
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
          </div>
        </div>



     

        <div class="sm:col-span-2 sm:col-start-1">
          <label for="city" class="block text-sm/6 font-medium text-gray-900">City</label>
          <div class="mt-2">
            <input type="text" name="city" id="city" autocomplete="address-level2" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
          </div>
        </div>

        <div class="sm:col-span-2">
          <label for="region" class="block text-sm/6 font-medium text-gray-900">State / Province</label>
          <div class="mt-2">
            <input type="text" name="region" id="region" autocomplete="address-level1" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
          </div>
        </div>

        <div class="sm:col-span-2">
          <label for="postal-code" class="block text-sm/6 font-medium text-gray-900">ZIP / Postal code</label>
          <div class="mt-2">
            <input type="text" name="postal-code" id="postal-code" autocomplete="postal-code" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
          </div>
        </div>
      </div>
    </div>

    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Notifications</h2>
      <p class="mt-1 text-sm/6 text-gray-600">We'll always let you know about important changes, but you pick what else you want to hear about.</p>

      <div class="mt-10 space-y-10">
        <fieldset>
          <legend class="text-sm/6 font-semibold text-gray-900">By Email</legend>
          <div class="mt-6 space-y-6">
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="comments" name="comments" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
              </div>
              <div class="text-sm/6">
                <label for="comments" class="font-medium text-gray-900">Comments</label>
                <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p>
              </div>
            </div>
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="candidates" name="candidates" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
              </div>
              <div class="text-sm/6">
                <label for="candidates" class="font-medium text-gray-900">Candidates</label>
                <p class="text-gray-500">Get notified when a candidate applies for a job.</p>
              </div>
            </div>
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="offers" name="offers" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
              </div>
              <div class="text-sm/6">
                <label for="offers" class="font-medium text-gray-900">Offers</label>
                <p class="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend class="text-sm/6 font-semibold text-gray-900">Push Notifications</legend>
          <p class="mt-1 text-sm/6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
          <div class="mt-6 space-y-6">
            <div class="flex items-center gap-x-3">
              <input id="push-everything" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
              <label for="push-everything" class="block text-sm/6 font-medium text-gray-900">Everything</label>
            </div>
            <div class="flex items-center gap-x-3">
              <input id="push-email" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
              <label for="push-email" class="block text-sm/6 font-medium text-gray-900">Same as email</label>
            </div>
            <div class="flex items-center gap-x-3">
              <input id="push-nothing" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
              <label for="push-nothing" class="block text-sm/6 font-medium text-gray-900">No push notifications</label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
    <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
  </div>
</form>
-->
</template>
