<script setup lang="js">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useSnackbar } from "vue3-snackbar";
import QrcodeVue from 'qrcode.vue';

const snackbar = useSnackbar();
const router = useRouter();
const projects = ref([]);
const userId = ref('');
const user = ref('');
const notification = ref('');

const visibleQRCode = ref(false); // Keeps track of the currently visible QR code
const currentQrCode = ref('Null'); // The current QR code being displayed

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
    snackbar.add({
      type: 'success',
      text: 'Code copied to clipboard',
    });
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
async function getTeacherProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        subject,
        short_code,
        end_date
      `)
      .eq('id_owner', userId.value)

    if (error) {
      console.error('Error fetching user projects:', error.message);
      return;
    }

    projects.value = data || [];
  } catch (err) {
    console.error('Unexpected error fetching user projects:', err.message);
  }
}

async function getUserProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        subject,
        end_date,
        users_projects!inner(user_id)
      `)
      .eq('users_projects.user_id', userId.value);

    if (error) {
      console.error('Error fetching user projects:', error.message);
      return;
    }

    projects.value = data || [];
  } catch (err) {
    console.error('Unexpected error fetching user projects:', err.message);
  }
}

async function getGroups() {
  try {
    const { data, error } = await supabase
      .from('users_groups')
      .select('group_id, project_id')
      .eq('user_id', userId.value);

    if (error) {
      console.error('Error fetching groups:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching groups:', error.message);
    return [];
  }
}

async function fetchUserId() {
  try {

    const { data: user_db, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error fetching user:', error)
      return
    }

    user.value = user_db.user.user_metadata
    userId.value = user_db.user.id


    console.log('user is teacherLOGIC: ', user);
    console.log('user', user.value);
    //-----------------------------
    //const { data, error } = await supabase.auth.getSession();

    /*if (error) {
      console.error('Error fetching user session:', error.message);
      return;
    }

    userId.value = data?.session?.user?.id || null;

    if (!userId.value) {
      console.warn('User is not authenticated.');
    }*/
  } catch (error) {
    console.error('Error in fetchUserId:', error)
  }
}

async function redirectfromProject(projectId) {
  try {

    console.log(user.value.isTeacher);
    if (!user.value.isTeacher) {
      const groups = await getGroups();

      const userGroup = groups.find(group => group.project_id === projectId);

      if (userGroup) {
        router.push({ name: 'SingleGroup', params: { id: userGroup.group_id } });
      } else {
        router.push({ name: 'Groups', params: { projectId } });
      }
    }
    else {
      router.push({ name: 'Groups', params: { projectId } });
    }
  } catch (err) {
    console.error('Error during redirection:', err.message);
    alert('An error occurred during redirection.');
  }
}

onMounted(async () => {
  await fetchUserId();
  if (userId.value) {
    if (user.value.isTeacher) {
      console.log('getTeacherProjects');
      await getTeacherProjects();
    } else {
      console.log('getStudentProjects');
      await getUserProjects();
    }
  }

  notification.value = localStorage.getItem('notification');
  if (notification.value) {
    setTimeout(() => {
      notification.value = null;
      localStorage.removeItem('notification');
    }, 5000);
  }

});
</script>


<template>
  <div :class="`modal ${!visibleQRCode && 'opacity-0 pointer-events-none'
    } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
    <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay" @click="visibleQRCode = false" />

    <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">


      <!-- Add margin if you want to see some of the overlay behind the modal -->
      <div class="px-6 py-4 text-left modal-content">
        <!-- Title -->
        <div class="flex items-center justify-between">
          <p class="text-2xl font-bold">
            Share QR code with students </p>
          <div class="z-50 cursor-pointer modal-close" @click="visibleQRCode = false">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!-- Body -->
        <div class="text-center text-l mb-8">Join project with code: <a class=" font-bold">{{ currentQrCode }}</a>
        </div>


        <qrcode-vue :value="`https://synapse-app-g27.vercel.app/code?${currentQrCode.value}`"
          class="ml-5 justify-self-center" :size="200"></qrcode-vue>
        <!-- Footer -->
        <div class="flex justify-end pt-2">
          <button
            class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
            @click="visibleQRCode = false; console.log(currentQrCode)">
            Ok
          </button>

        </div>
      </div>
    </div>
  </div>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">My Projects</h3>

    <div class="mt-4">
      <div class="mt-6">
        <div v-if="!user.isTeacher">
          <router-link class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
            :class="[$route.name === 'Code' ? activeClass : inactiveClass]" to="/code">


            <button href="#"
              class="mt-4 bg-gray-800 border-gray-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 shadow-sm">
              <span class="pr-[10px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="fill-current">
                  <g clip-path="url(#clip0_906_8052)">
                    <path
                      d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                    <path
                      d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
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
        </div>
        <div v-if="user.isTeacher">
          <router-link class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
            :class="[$route.name === 'Forms' ? activeClass : inactiveClass]" to="/forms">


            <button href="#"
              class="mt-4 bg-gray-800 border-gray-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 shadow-sm">
              <span class="pr-[10px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="fill-current">
                  <g clip-path="url(#clip0_906_8052)">
                    <path
                      d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                    <path
                      d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
                  </g>
                  <defs>
                    <clipPath id="clip0_906_8052">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              Create a new project
            </button>
          </router-link>
        </div>
        <div v-if="notification" class="notification-banner bg-green-500 text-white p-4 rounded mb-4">
          {{ notification }}
        </div>
        <div :style="user.isTeacher ? { minWidth: '475px' } : {}"
          class="my-6 overflow-hidden bg-white rounded-md shadow">
          <table class="w-full text-left border-collapse">
            <thead class="border-b">
              <tr>
                <th class="px-7 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800">
                  Subject
                </th>
                <th class="px-7 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800">
                  Name
                </th>
                <th v-if="user.isTeacher"
                  class="px-7 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800 border-l">
                  Code
                </th>
                <th :class="!user.isTeacher ? 'border-l' : ''"
                  class="px-4 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800 text-right">
                  Next deadline
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, id) in projects" :key="id" class="hover:bg-gray-300 border-b border-gray-400">

                <td @click="redirectfromProject(project.id)" class="px-7 py-4 text-gray-500 text-left cursor-pointer">
                  {{ project.subject }}
                </td>
                <td @click="redirectfromProject(project.id)" class="px-7 py-4 text-lg text-gray-700 cursor-pointer">
                  {{ project.title }}
                </td>
                <td style="width: 120px" v-if="user.isTeacher"
                  class="px-7 py-4 text-lg text-gray-700 border-l border-gray-600">
                  <div class="flex items-center">
                    <!-- Short Code -->
                    <span class="text-gray-700 truncate" style="width: 80px;"
                      @click.prevent.stop="copyToClipboard(project.short_code)">{{ project.short_code }}</span>

                    <!-- QR Button -->
                    <button @click.prevent.stop="currentQrCode = project.short_code; visibleQRCode = true;"
                      class="ml-5 w-20 h-8 bg-black border rounded-full flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500">
                      QR
                    </button>


                  </div>
                </td>
                <td style="width: 120px;" :class="!user.isTeacher ? 'border-l border-gray-600' : ''"
                  class="px-4 py-4 text-gray-500 text-right">
                  {{ project.end_date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
