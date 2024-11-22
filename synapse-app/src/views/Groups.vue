<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import { useSnackbar } from "vue3-snackbar";
const snackbar = useSnackbar();
const route = useRoute();
const router = useRouter()
const projectId = route.params.projectId;
const groupToLeave = ref('');
const open = ref(false);
const loading = ref(true);
const groups = ref([]);
const userId = ref('');
const project = ref('');
const user = ref('');
const isTeacher = ref(false);

const fetchGroups = async () => {
    const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId);
    project.value = projectData[0];
    console.log(projectData[0]);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return;
    }
    userId.value = userData?.user?.id;
    console.log(userData?.user?.id);
    console.log('Project ID:', projectId);
    const { data: groupsData } = await supabase
        .from('groups_with_members')
        .select('*')
        .eq('project_id', projectId);

    console.log(groupsData);

    if (groupsData && groupsData.length > 0) {
        groups.value = groupsData;
    } else {
        console.error('No project found with the provided code.');
    }
    loading.value = false;
};

const fetchUserData = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return;
    }
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData?.user?.id);
    user.value = data[0];
   
    console.log(user.value);
};



onMounted(async () => {
  await fetchGroups();
  await fetchUserData();
  isTeacher.value = user.value.is_teacher; 
  console.log(groups.value);
});



async function addMember(groupId) {
    console.log('Adding member to group:', groupId);
    // Insert user to group


    const { error } = await supabase
        .from('users_groups')
        .insert({
            group_id: groupId,
            project_id: projectId,
            user_id: userId.value,
        });
    if (error) {
        console.error('Error inserting user to group:', error);
        snackbar.add({
            type: 'info',
            text: 'You are already member of a group',
        })

    } else {
        console.log('User successfully added to group');
        // snackbar.add({
        //     type: 'success',
        //     text: 'You successfully joined the group',
        // });
        // Refresh the groups state
        await fetchGroups();
    }
}

async function leaveGroup(groupId) {
    console.log('Deleting user from group:', groupId);
    // Insert user to grou
    // show confirmation modal

    const { error } = await supabase
        .from('users_groups')
        .delete()
        .eq('group_id', groupId)
        .eq('project_id', projectId)
        .eq('user_id', userId.value);
    if (error) {
        console.error('Error deleting user from group:', error);
    } else {
        console.log('User successfully deleted from group');
        // Refresh the groups state
        await fetchGroups();
    }
}

const profile = (id) => {
  console.log('Profile -> id: ', id)
  if (id) {
    router.push(`/profile/${id}`)
  } else {
    console.error('User ID is not available')
  }
}
</script>
<template>

    <div>
        <span class="ml-4 text-4xl font-normal text-gray-700" v-if = "!isTeacher" >Choose your group</span>
        <span class="ml-4 text-4xl font-normal text-gray-700" v-if = "isTeacher" >Check the groups</span>
    </div>
    <div class="ml-4 mt-2 text-1xl text-gray-700">
        For project:
        <span class="text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            {{ project.title }}
        </span>
    </div>

    <div class="items-center justify-items-center justify-center" v-if="groups.length > 0 ">

        <router-link :to="`/match/${projectId}`">
            <button
                class="justify-self-center mt-4 bg-gray-800 border-gray-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 shadow-sm" v-if = "!isTeacher">
                <span class="pr-[10px]">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#e8eaed">
                        <path
                            d="M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z" />
                    </svg>
                </span>
                Find me a group
            </button>
        </router-link>
        <div v-for="group in groups" class=" hover:bg-gray-50 mt-10 bg-white shadow-md overflow-hidden rounded-3xl">
            <div class="p-8">
                
               
                <div class="uppercase tracking-wide text-l text-indigo-500 font-semibold">Group: {{ group.name }}</div>
                <div class="flex mt-4 space-x-5 justify-center">
                    <div v-for="member in group.members" :key="member.id">
                        <div class="flex flex-col items-center space-y-2 relative group">
                            <div class="relative">
                                <img @click="() => profile(member.user_id)" :src="`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${member.user_id}&radius=50&randomizeIds=true`"
                                    alt="Member Avatar"
                                    class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2">
                                <button v-if="member.user_id == userId" @click="open = true; groupToLeave = group.id"
                                    class="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Leave
                                </button>
                            </div>
                            <span
                                :class="{ 'text-blue-500': member.user_id == userId, 'text-gray-700': member.user_id != userId }"
                                class="text-center text-sm font-semibold">
                                {{ member.user_id == userId ? "You" : member.username }}
                            </span>
                        </div>
                    </div>
                    <div v-for="member_free_slot in group.free_spots - 1" draggable="false"  @click="addMember(group.id)"
                        class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2 border-gray-900 border-dotted flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-500 bg-gray-300">
                        +
                    </div>
                    <div v-id="group.free_spots > 0" draggable="false" v-if = "!isTeacher" @click="addMember(group.id)"
                        class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2 border-gray-900 border-dotted flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-500 bg-gray-300">
                        +
                    </div>
                </div>
                <div v-if="group?.members?.some(member => member.user_id === userId)" class="text-right">
                    <router-link :to="`/singlegroup/${group.id}`">
                        <button 
                            class="mt-4 bg-gray-800 border-gray-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:border-transparent disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 shadow-sm transition-transform duration-300 transform hover:scale-105">
                            <span class="pr-[10px]">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#e8eaed">
                                    <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
                                </svg>
                            </span>
                            Go to project
                        </button>
                    </router-link>
                </div>
           
            </div>
        </div>


    </div>

    <div :class="`modal ${!open && 'opacity-0 pointer-events-none'
        } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
        <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay" @click="open = false" />

        <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
            <div
                class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close">
                <svg class="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 18 18">
                    <path
                        d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                </svg>
                <span class="text-sm">(Esc)</span>
            </div>

            <!-- Add margin if you want to see some of the overlay behind the modal -->
            <div class="px-6 py-4 text-left modal-content">
                <!-- Title -->
                <div class="flex items-center justify-between pb-3">
                    <p class="text-2xl font-bold">
                        You are about to leave a group
                    </p>
                    <div class="z-50 cursor-pointer modal-close" @click="open = false">
                        <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                            viewBox="0 0 18 18">
                            <path
                                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                        </svg>
                    </div>
                </div>

                <!-- Body -->
                <p>Are you sure you want to leave your group?</p>

                <!-- Footer -->
                <div class="flex justify-end pt-2">
                    <button
                        class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
                        @click="open = false">
                        No
                    </button>
                    <button
                        class="px-6 py-3 font-medium tracking-wide text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none"
                        @click="open = false; leaveGroup(groupToLeave)">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="groups.length <= 0 && !loading" class="text-center">
        Sorry no groups found for this project
    </div>
</template>
