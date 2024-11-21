<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const route = useRoute();
const projectId = route.params.projectId;

const email = ref('');
const loading = ref(true);
const groups = ref([]);
const userId = ref('');
const project = ref('');
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

onMounted(fetchGroups);

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
    } else {
        console.log('User successfully added to group');
        // Refresh the groups state
        await fetchGroups();
    }
}

async function leaveGroup(groupId) {
    console.log('Deleting user from group:', groupId);
    // Insert user to grou

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
</script>
<template>

    <div>
        <span class="ml-4 text-4xl font-normal text-gray-700">Choose your group</span>
    </div>
    <div class="ml-4 mt-2 text-1xl text-gray-700">
        For project:
        <span class="text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            {{ project.title }}
        </span>
    </div>

    <div class="items-center justify-items-center justify-center" v-if="groups.length > 0">
        <router-link to="/match">
            <button
                class="justify-self-center mt-4 bg-gray-800 border-gray-800 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 shadow-sm">
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
                                <img :src="`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${member.user_id}&radius=50&randomizeIds=true`"
                                    alt="Member Avatar"
                                    class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2">
                                <button v-if="member.user_id == userId" @click="leaveGroup(group.id)"
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
                    <div v-for="member_free_slot in group.free_spots - 1" draggable="false" @click="addMember(group.id)"
                        class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2 border-gray-300 border-dotted flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100">
                    </div>
                    <div v-id="group.free_spots > 0" draggable="false" @click="addMember(group.id)"
                        class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2 border-gray-300 border-dotted flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100">
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
    <div v-if="groups.length <= 0 && !loading" class="text-center">
        Sorry no groups found for this project
    </div>
</template>