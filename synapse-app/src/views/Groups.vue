<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const route = useRoute();
const projectId = route.params.projectId;

const email = ref('');
const loading = ref(false);
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
};

onMounted(fetchGroups);

async function addMember(groupId) {
    console.log('Adding member to group:', groupId);
    // Insert user to group

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return;
    }
    console.log(userData?.user?.id);

    const { error } = await supabase
        .from('users_groups')
        .insert({
            group_id: groupId,
            project_id: projectId,
            user_id: userData?.user?.id
        });
    if (error) {
        console.error('Error inserting user to group:', error);
    } else {
        console.log('User successfully added to group');
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
    <div class="items-center justify-items-center justify-center">

        <div v-for="group in groups" class="hover:bg-gray-50 mt-10 bg-white shadow-md overflow-hidden rounded-3xl">
            <div class="p-8">
                <div class="uppercase tracking-wide text-l text-indigo-500 font-semibold">Group: {{ group.name }}</div>
                <div class="flex mt-4 space-x-5 justify-center overflow-x-hidden">
                    <div v-for="member in group.members" :key="member.id">
                        <div class="flex flex-col items-center space-y-2">
                            <img :src="`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${member.user_id}&radius=50&randomizeIds=true`"
                                alt="Member Avatar"
                                class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2">
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
                    <div draggable="false" @click="addMember(group.id)"
                        class="select-none w-12 h-12 min-h-12 min-w-12 rounded-full border-2 border-gray-300 border-dotted flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100">
                        +
                    </div>
                </div>
            </div>
        </div>


    </div>

</template>